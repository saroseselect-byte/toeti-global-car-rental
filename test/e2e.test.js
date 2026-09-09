import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../src/index.js';

class D1Statement {
  constructor(db,sql){this.db=db;this.sql=sql;this.values=[]}
  bind(...values){this.values=values;return this}
  async first(){return this.db.prepare(this.sql).get(...this.values)||null}
  async all(){return {results:this.db.prepare(this.sql).all(...this.values)}}
  async run(){return this.db.prepare(this.sql).run(...this.values)}
}
class TestD1 {
  constructor(){this.db=new DatabaseSync(':memory:');this.db.exec(readFileSync('migrations/0001_initial.sql','utf8'));this.db.exec(readFileSync('migrations/0002_supplier_ready_core.sql','utf8'))}
  prepare(sql){return new D1Statement(this.db,sql)}
  async batch(statements){this.db.exec('BEGIN');try{const out=[];for(const s of statements)out.push(await s.run());this.db.exec('COMMIT');return out}catch(e){this.db.exec('ROLLBACK');throw e}}
}
const call=(env,path,method='GET',body)=>worker.fetch(new Request(`https://toeti.test${path}`,{method,headers:{'content-type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),env);

async function completeFlow(type){
  const DB=new TestD1(),env={DB};
  let response=await call(env,'/api/demo/reviews','POST',{type});
  assert.equal(response.status,201);
  let reviewUrl=(await response.json()).reviewUrl;
  const reviewToken=reviewUrl.split('/').pop();
  assert.equal((await call(env,'/supplier/demo/review/not-a-real-token')).status,404);
  response=await call(env,`/api/supplier-reviews/${reviewToken}/action`,'POST',{action:'REQUEST_CHANGES',notes:'Please correct the operating details.'});
  assert.equal(response.status,200);
  let offer=DB.db.prepare('SELECT * FROM offers').get();
  assert.equal(offer.status,'DRAFT');
  assert.equal((await call(env,`/offers/${offer.id}`)).status,404);
  response=await call(env,`/api/supplier-reviews/${reviewToken}/revise`,'POST');
  assert.equal(response.status,201);
  const revised=await response.json();
  assert.equal(revised.version,2);
  const revisedToken=revised.reviewUrl.split('/').pop();
  response=await call(env,`/api/supplier-reviews/${revisedToken}/action`,'POST',{action:'APPROVE'});
  assert.equal(response.status,200);
  offer=DB.db.prepare('SELECT * FROM offers').get();
  assert.equal(offer.status,'LIVE');
  assert.equal((await call(env,`/offers/${offer.id}`)).status,200);
  const booking=type==='CAR_RENTAL'?{offerId:offer.id,pickupDate:'2026-10-12',returnDate:'2026-10-15',pickupLocation:'Zanzibar Airport',customerName:'Demo Customer',customerEmail:'demo@example.com',customerPhone:'+255000000'}:{offerId:offer.id,date:'2026-10-12',timeslot:'09:00',adults:2,children:1,customerName:'Demo Customer',customerEmail:'demo@example.com',customerPhone:'+255000000'};
  response=await call(env,'/api/bookings','POST',booking);
  assert.equal(response.status,201);
  const created=await response.json();
  assert.equal(created.status,'AWAITING_SUPPLIER');
  assert.equal((await call(env,created.customerStatusUrl)).status,200);
  const supplierToken=created.supplierDecisionUrl.split('/').pop();
  response=await call(env,`/api/supplier-bookings/${supplierToken}/decision`,'POST',{decision:'CONFIRMED'});
  assert.equal(response.status,200);
  const customerPage=await (await call(env,created.customerStatusUrl)).text();
  assert.match(customerPage,/CONFIRMED/);
  const actions=DB.db.prepare('SELECT action FROM audit_events ORDER BY created_at').all().map(x=>x.action);
  for(const action of ['DRAFT_GENERATED','SUPPLIER_REVIEW_SENT','SUPPLIER_REQUESTED_CHANGE','DRAFT_REVISED','SUPPLIER_APPROVED','OFFER_LIVE','BOOKING_REQUESTED','SUPPLIER_CONFIRMED'])assert.ok(actions.includes(action),`${action} missing`);
}

test('P1 car completes review, revision, approval, booking and supplier confirmation',()=>completeFlow('CAR_RENTAL'));
test('P2 experience completes review, revision, approval, booking and supplier confirmation',()=>completeFlow('EXPERIENCE'));
