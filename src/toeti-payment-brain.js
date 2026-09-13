const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const now=()=>new Date().toISOString();
const id=(p='id')=>`${p}_${crypto.randomUUID()}`;
const enc=s=>encodeURIComponent(String(s));

function requireEnv(env){
  const missing=[];
  for(const k of ['STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','TOETI_ADMIN_TOKEN']) if(!env[k]) missing.push(k);
  return missing;
}
function adminOK(req,env){
  const h=req.headers.get('authorization')||'';
  return h===`Bearer ${env.TOETI_ADMIN_TOKEN}`;
}
async function stripe(env,path,params={}){
  const body=new URLSearchParams();
  for(const [k,v] of Object.entries(params)) if(v!==undefined&&v!==null) body.set(k,String(v));
  const r=await fetch(`https://api.stripe.com/v1/${path}`,{method:'POST',headers:{authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,'content-type':'application/x-www-form-urlencoded'},body});
  const data=await r.json();
  if(!r.ok) throw new Error(data?.error?.message||`Stripe ${r.status}`);
  return data;
}
function hex(buf){return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function safeEq(a,b){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
async function verifyStripeSignature(payload,header,secret){
  if(!header||!secret)return false;
  const parts=Object.fromEntries(header.split(',').map(p=>p.split('=')));
  const t=parts.t,v1=parts.v1;
  if(!t||!v1)return false;
  if(Math.abs(Math.floor(Date.now()/1000)-Number(t))>300)return false;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${t}.${payload}`));
  return safeEq(hex(sig),v1);
}
async function getBooking(env,bookingId){return env.DB.prepare('SELECT * FROM toeti_payment_bookings WHERE id=?').bind(bookingId).first()}
async function summedRefunds(env,bookingId){const r=await env.DB.prepare('SELECT COALESCE(SUM(amount_minor),0) total FROM toeti_refunds WHERE booking_id=? AND status IN (\'pending\',\'succeeded\')').bind(bookingId).first();return Number(r?.total||0)}

async function prepareBooking(req,env){
  if(!adminOK(req,env))return json({error:'unauthorized'},401);
  const b=await req.json().catch(()=>null);
  if(!b)return json({error:'invalid_json'},400);
  const amount=Number(b.amount_minor);
  const currency=String(b.currency||'').toLowerCase();
  if(!b.supplier_key||!b.supplier_name||!b.product_name||!['car','experience'].includes(b.product_type)||!Number.isInteger(amount)||amount<=0||!/^[a-z]{3}$/.test(currency)) return json({error:'invalid_booking'},400);
  const bookingId=b.id||id('book');
  await env.DB.prepare(`INSERT INTO toeti_payment_bookings (id,supplier_key,supplier_name,product_type,product_name,amount_minor,currency,customer_email,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?, 'awaiting_payment',?,?,?)`)
    .bind(bookingId,b.supplier_key,b.supplier_name,b.product_type,b.product_name,amount,currency,b.customer_email||null,now(),now()).run();
  return json({ok:true,booking_id:bookingId,status:'awaiting_payment'},201);
}

async function createCheckout(req,env){
  const b=await req.json().catch(()=>null); if(!b?.booking_id)return json({error:'booking_id_required'},400);
  const booking=await getBooking(env,b.booking_id); if(!booking)return json({error:'booking_not_found'},404);
  if(!['awaiting_payment','payment_failed'].includes(booking.status))return json({error:'booking_not_payable',status:booking.status},409);
  const origin=new URL(req.url).origin;
  const success=b.success_url||`${origin}/payment/success?booking_id=${enc(booking.id)}`;
  const cancel=b.cancel_url||`${origin}/payment/cancel?booking_id=${enc(booking.id)}`;
  try{
    const s=await stripe(env,'checkout/sessions',{
      mode:'payment',
      success_url:success,
      cancel_url:cancel,
      customer_email:booking.customer_email||undefined,
      'line_items[0][price_data][currency]':booking.currency,
      'line_items[0][price_data][unit_amount]':booking.amount_minor,
      'line_items[0][price_data][product_data][name]':booking.product_name,
      'line_items[0][price_data][product_data][description]':`${booking.supplier_name} · ${booking.product_type}`,
      'line_items[0][quantity]':1,
      'metadata[booking_id]':booking.id,
      'metadata[supplier_key]':booking.supplier_key,
      'payment_intent_data[metadata][booking_id]':booking.id,
      'payment_intent_data[metadata][supplier_key]':booking.supplier_key
    });
    await env.DB.prepare('UPDATE toeti_payment_bookings SET stripe_checkout_session_id=?,status=\'checkout_created\',updated_at=? WHERE id=?').bind(s.id,now(),booking.id).run();
    return json({ok:true,booking_id:booking.id,checkout_session_id:s.id,url:s.url});
  }catch(e){return json({error:'stripe_checkout_failed',message:e.message},502)}
}

async function handleWebhook(req,env){
  const raw=await req.text();
  if(!await verifyStripeSignature(raw,req.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET))return json({error:'invalid_signature'},400);
  let ev; try{ev=JSON.parse(raw)}catch{return json({error:'invalid_event'},400)}
  const seen=await env.DB.prepare('SELECT event_id FROM stripe_webhook_events WHERE event_id=?').bind(ev.id).first(); if(seen)return json({ok:true,duplicate:true});
  const obj=ev.data?.object||{};
  try{
    if(ev.type==='checkout.session.completed'||ev.type==='checkout.session.async_payment_succeeded'){
      const bookingId=obj.metadata?.booking_id; if(bookingId){
        await env.DB.prepare('UPDATE toeti_payment_bookings SET status=\'paid\',stripe_payment_intent_id=?,updated_at=? WHERE id=?').bind(obj.payment_intent||null,now(),bookingId).run();
        await env.DB.prepare(`INSERT OR REPLACE INTO toeti_payments (id,booking_id,stripe_checkout_session_id,stripe_payment_intent_id,amount_minor,currency,status,created_at,updated_at) VALUES (?,?,?,?,?,?, 'succeeded',?,?)`)
          .bind(obj.payment_intent||obj.id,bookingId,obj.id,obj.payment_intent||null,Number(obj.amount_total||0),String(obj.currency||'').toLowerCase(),now(),now()).run();
      }
    }
    if(ev.type==='checkout.session.async_payment_failed'){
      const bookingId=obj.metadata?.booking_id; if(bookingId)await env.DB.prepare('UPDATE toeti_payment_bookings SET status=\'payment_failed\',updated_at=? WHERE id=?').bind(now(),bookingId).run();
    }
    if(ev.type==='payment_intent.payment_failed'){
      const bookingId=obj.metadata?.booking_id; if(bookingId)await env.DB.prepare('UPDATE toeti_payment_bookings SET status=\'payment_failed\',updated_at=? WHERE id=?').bind(now(),bookingId).run();
    }
    await env.DB.prepare('INSERT INTO stripe_webhook_events (event_id,event_type,processed_at) VALUES (?,?,?)').bind(ev.id,ev.type,now()).run();
    return json({ok:true});
  }catch(e){return json({error:'webhook_processing_failed',message:e.message},500)}
}

async function registerSupplier(req,env){
  if(!adminOK(req,env))return json({error:'unauthorized'},401);
  const b=await req.json().catch(()=>null); if(!b?.supplier_key||!b?.supplier_name)return json({error:'supplier_required'},400);
  const share=Number.isInteger(Number(b.payout_share_bps))?Number(b.payout_share_bps):8500;
  if(share<0||share>10000)return json({error:'invalid_share'},400);
  await env.DB.prepare(`INSERT INTO supplier_payout_profiles (supplier_key,supplier_name,stripe_account_id,payout_share_bps,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(supplier_key) DO UPDATE SET supplier_name=excluded.supplier_name,stripe_account_id=excluded.stripe_account_id,payout_share_bps=excluded.payout_share_bps,status=excluded.status,updated_at=excluded.updated_at`)
    .bind(b.supplier_key,b.supplier_name,b.stripe_account_id||null,share,b.status||'pending',now(),now()).run();
  return json({ok:true,supplier_key:b.supplier_key,payout_share_bps:share,status:b.status||'pending'});
}

async function markFulfilled(req,env){
  if(!adminOK(req,env))return json({error:'unauthorized'},401);
  const b=await req.json().catch(()=>null); if(!b?.booking_id)return json({error:'booking_id_required'},400);
  const booking=await getBooking(env,b.booking_id); if(!booking)return json({error:'booking_not_found'},404);
  if(booking.status!=='paid')return json({error:'booking_not_paid',status:booking.status},409);
  await env.DB.prepare('UPDATE toeti_payment_bookings SET status=\'fulfilled\',fulfilled_at=?,updated_at=? WHERE id=?').bind(now(),now(),booking.id).run();
  return json({ok:true,booking_id:booking.id,status:'fulfilled'});
}

async function releaseSupplier(req,env){
  if(!adminOK(req,env))return json({error:'unauthorized'},401);
  const b=await req.json().catch(()=>null); if(!b?.booking_id)return json({error:'booking_id_required'},400);
  const booking=await getBooking(env,b.booking_id); if(!booking)return json({error:'booking_not_found'},404);
  if(booking.status!=='fulfilled')return json({error:'booking_not_fulfilled',status:booking.status},409);
  const existing=await env.DB.prepare('SELECT id FROM toeti_transfers WHERE booking_id=?').bind(booking.id).first(); if(existing)return json({error:'already_released'},409);
  const profile=await env.DB.prepare('SELECT * FROM supplier_payout_profiles WHERE supplier_key=?').bind(booking.supplier_key).first();
  if(!profile?.stripe_account_id||profile.status!=='active')return json({error:'supplier_payout_not_ready'},409);
  const amount=Math.floor(Number(booking.amount_minor)*Number(profile.payout_share_bps)/10000);
  try{
    const t=await stripe(env,'transfers',{amount,currency:booking.currency,destination:profile.stripe_account_id,'metadata[booking_id]':booking.id,'metadata[supplier_key]':booking.supplier_key});
    await env.DB.prepare('INSERT INTO toeti_transfers (id,booking_id,supplier_key,stripe_transfer_id,amount_minor,currency,status,created_at) VALUES (?,?,?,?,?,?,\'created\',?)').bind(id('tr'),booking.id,booking.supplier_key,t.id,amount,booking.currency,now()).run();
    await env.DB.prepare('UPDATE toeti_payment_bookings SET status=\'supplier_released\',updated_at=? WHERE id=?').bind(now(),booking.id).run();
    return json({ok:true,booking_id:booking.id,stripe_transfer_id:t.id,amount_minor:amount,currency:booking.currency});
  }catch(e){return json({error:'stripe_transfer_failed',message:e.message},502)}
}

async function refund(req,env){
  if(!adminOK(req,env))return json({error:'unauthorized'},401);
  const b=await req.json().catch(()=>null); if(!b?.booking_id)return json({error:'booking_id_required'},400);
  const booking=await getBooking(env,b.booking_id); if(!booking?.stripe_payment_intent_id)return json({error:'paid_booking_not_found'},404);
  if(booking.status==='supplier_released')return json({error:'manual_reversal_required_after_supplier_release'},409);
  const already=await summedRefunds(env,booking.id),remaining=Number(booking.amount_minor)-already;
  const amount=b.amount_minor==null?remaining:Number(b.amount_minor);
  if(!Number.isInteger(amount)||amount<=0||amount>remaining)return json({error:'invalid_refund_amount',remaining_minor:remaining},400);
  try{
    const r=await stripe(env,'refunds',{payment_intent:booking.stripe_payment_intent_id,amount,reason:b.reason||undefined,'metadata[booking_id]':booking.id});
    await env.DB.prepare('INSERT INTO toeti_refunds (id,booking_id,stripe_refund_id,amount_minor,currency,reason,status,created_at) VALUES (?,?,?,?,?,?,?,?)').bind(id('rf'),booking.id,r.id,amount,booking.currency,b.reason||null,r.status||'pending',now()).run();
    const newStatus=amount===remaining?'refunded':'partially_refunded';
    await env.DB.prepare('UPDATE toeti_payment_bookings SET status=?,updated_at=? WHERE id=?').bind(newStatus,now(),booking.id).run();
    return json({ok:true,booking_id:booking.id,stripe_refund_id:r.id,amount_minor:amount,currency:booking.currency,status:r.status});
  }catch(e){return json({error:'stripe_refund_failed',message:e.message},502)}
}

async function status(req,env){
  const u=new URL(req.url),bookingId=u.searchParams.get('booking_id'); if(!bookingId)return json({error:'booking_id_required'},400);
  const b=await getBooking(env,bookingId); if(!b)return json({error:'booking_not_found'},404);
  return json({booking_id:b.id,supplier_name:b.supplier_name,product_type:b.product_type,product_name:b.product_name,amount_minor:b.amount_minor,currency:b.currency,status:b.status});
}

export async function paymentBrain(request,env){
  const u=new URL(request.url),p=u.pathname;
  if(p==='/api/payments/health'&&request.method==='GET') return json({ok:true,mode:env.STRIPE_SECRET_KEY?.startsWith('sk_test_')?'sandbox':'unconfigured',missing:requireEnv(env)});
  if(p==='/api/payments/prepare'&&request.method==='POST') return prepareBooking(request,env);
  if(p==='/api/payments/checkout'&&request.method==='POST') return createCheckout(request,env);
  if(p==='/api/payments/webhook'&&request.method==='POST') return handleWebhook(request,env);
  if(p==='/api/payments/supplier'&&request.method==='POST') return registerSupplier(request,env);
  if(p==='/api/payments/fulfilled'&&request.method==='POST') return markFulfilled(request,env);
  if(p==='/api/payments/release'&&request.method==='POST') return releaseSupplier(request,env);
  if(p==='/api/payments/refund'&&request.method==='POST') return refund(request,env);
  if(p==='/api/payments/status'&&request.method==='GET') return status(request,env);
  return null;
}
