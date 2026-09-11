const esc=(s='')=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

const suppliers={
  '/supplier/pragueway-prague':{
    city:'Prague',country:'Czech Republic',name:'PragueWay Tours & Experiences',status:'SUPPLIER PILOT · PRODUCTS RECEIVED · REVIEW PENDING',
    intro:'Five supplier-selected bestsellers are being prepared by TOETI so PragueWay does not need to re-upload its catalogue. Nothing goes live without supplier review and approval.',
    products:[
      ['One Prague Tour — The Castle Side','https://pragueway.com/tour/one-prague-tour-the-castle-side/'],
      ['One Prague Tour — Old Town Road','https://pragueway.com/tour/one-prague-tour-old-town-road/'],
      ['Old Town Tour — Medieval Underground','https://pragueway.com/tour/old-town-tour-medieval-underground/'],
      ['Old Town Tour — Highlights & Hidden Gems','https://pragueway.com/tour/old-town-tour-highlights-hidden-gems/'],
      ['The One Day See It All Prague Tour','https://pragueway.com/tour/the-one-day-see-it-all-prague-tour/']
    ]
  },
  '/supplier/manolya-istanbul':{
    city:'Istanbul',country:'Türkiye',name:'Manolya Tour',status:'SUPPLIER PILOT · 5 PRODUCTS SELECTED · REVIEW PENDING',
    intro:'The first supplier-selected Istanbul experiences are staged as a TOETI review preview. Product facts, commercial details and availability remain subject to supplier confirmation before activation.',
    products:[
      ['Hagia Sophia & Basilica Cistern Fast-Track Entry Tickets',null],
      ['Topkapi Palace & Harem Skip-the-Ticket-Line Tour',null],
      ['Basilica Cistern Fast-Track Entry Ticket & Audio Guide',null],
      ['Bosphorus Sunset Yacht Cruise',null],
      ['Dolmabahce Palace Skip-the-Line Ticket & Audio Guide',null]
    ]
  }
};

export function supplierPreview(path){
 const s=suppliers[path]; if(!s)return null;
 const cards=s.products.map(([title,source],i)=>`<article class="sp-card"><div class="sp-num">0${i+1}</div><span class="sp-tag">EXPERIENCE · REVIEW PREVIEW</span><h3>${esc(title)}</h3><p>Supplier-selected pilot product. Exact price, availability, meeting details and policies are confirmed before LIVE.</p>${source?`<a href="${esc(source)}" target="_blank" rel="noopener">Supplier source ↗</a>`:'<span class="sp-wait">Supplier source/details being structured</span>'}</article>`).join('');
 return `<main class="sp-wrap"><section class="sp-hero"><div><span class="sp-pill">TOETI ${esc(s.city.toUpperCase())} · ${esc(s.country.toUpperCase())}</span><h1>${esc(s.name)}</h1><p>${esc(s.intro)}</p><div class="sp-state">${esc(s.status)}</div></div><aside><b>TOETI supplier-first pilot</b><span>€0 setup fee</span><span>€0 fixed monthly fee</span><span>No exclusivity</span><span>Supplier approval before LIVE</span></aside></section><section class="sp-head"><div><span>FOUNDING SUPPLIER PREVIEW</span><h2>${esc(s.city)} experiences</h2></div><p>TOETI prepares the listings. The supplier reviews them. Customers only see activated inventory after approval.</p></section><section class="sp-grid">${cards}</section><section class="sp-bottom"><b>Current ball</b><p>TOETI structures and verifies the proposed listings → supplier reviews/corrects → supplier approves → only then can an offer become LIVE.</p></section></main>`;
}

export const supplierCss=`.sp-wrap{width:min(1180px,calc(100% - 36px));margin:auto;padding:38px 0 70px}.sp-hero{min-height:420px;border-radius:28px;padding:clamp(28px,5vw,58px);display:grid;grid-template-columns:1.25fr .75fr;gap:36px;align-items:end;color:#fff;background:radial-gradient(circle at 85% 18%,rgba(111,224,211,.28),transparent 24%),linear-gradient(130deg,#07182f,#174e62 60%,#b7772c);box-shadow:0 22px 60px rgba(8,27,55,.2)}.sp-pill,.sp-tag{display:inline-flex;padding:7px 10px;border-radius:999px;font-size:11px;font-weight:900;letter-spacing:.1em}.sp-pill{background:#ffffff1d;border:1px solid #ffffff38}.sp-hero h1{font-size:clamp(42px,6vw,74px);line-height:.98;letter-spacing:-.05em;margin:16px 0}.sp-hero p{font-size:18px;line-height:1.6;color:#e8f1f4;max-width:720px}.sp-state{display:inline-block;margin-top:16px;padding:9px 12px;border-radius:10px;background:#f3bd5d;color:#382100;font-weight:900;font-size:12px}.sp-hero aside{display:grid;gap:10px;padding:24px;border:1px solid #ffffff38;background:#ffffff12;border-radius:20px;backdrop-filter:blur(8px)}.sp-hero aside span{padding:10px;border-radius:9px;background:#ffffff12}.sp-head{display:flex;justify-content:space-between;gap:30px;align-items:end;padding:52px 4px 22px}.sp-head span{font-size:12px;font-weight:900;letter-spacing:.12em;color:#147a7e}.sp-head h2{font-size:40px;margin:8px 0 0}.sp-head p{max-width:520px;color:#627080;line-height:1.55}.sp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.sp-card{position:relative;padding:24px;border:1px solid #e6d6bd;border-radius:22px;background:linear-gradient(150deg,#fffaf1,#f5e7d2);box-shadow:0 12px 32px rgba(70,52,24,.09);overflow:hidden}.sp-num{position:absolute;right:16px;top:8px;font-size:44px;font-weight:950;color:#0d78801b}.sp-tag{background:#dff4ee;color:#116a58}.sp-card h3{font-size:21px;line-height:1.25;margin:16px 0 10px}.sp-card p{color:#5b6878;line-height:1.55}.sp-card a,.sp-wait{font-size:13px;font-weight:850;color:#0d747b}.sp-bottom{margin-top:20px;padding:22px 25px;border-left:4px solid #e18b1b;border-radius:12px;background:#fff4dc}.sp-bottom p{margin-bottom:0;color:#4f6070}@media(max-width:800px){.sp-hero{grid-template-columns:1fr}.sp-grid{grid-template-columns:1fr 1fr}.sp-head{align-items:flex-start;flex-direction:column}}@media(max-width:560px){.sp-wrap{width:calc(100% - 24px)}.sp-grid{grid-template-columns:1fr}.sp-hero{padding:28px 22px}.sp-head h2{font-size:34px}}`;