import base from './review-worker.js';

// Exact, supplier-provided FareHarbor affiliate URL (OceanEye email 12 Oct 2026).
// Keep ALL attribution parameters. Do not rewrite from a browser's redirected address.
export const OCEANEYE_AFFILIATE_URL='https://fareharbor.com/embeds/book/oceaneyeazores/?ref=toetiglobal-asn&schedule-uuid=fd133e37-4928-4280-83e0-07b8ec9a21d4&asn=toetiglobal-eur&asn-ref=toetiglobal-asn&full-items=yes&flow=447044&button-tags=toetiglobal-asn';
const bookingScript='https://fareharbor.com/embeds/api/v1/?autolightframe=yes';
const htmlHeaders={'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin'};

function launchInfo(){
 return `<section id="oceaneye-booking" class="te-booking" aria-label="OceanEye experiences and booking">
  <p class="te-kicker">TOETI GLOBAL · SÃO MIGUEL · AZORES</p>
  <h2>Discover OceanEye on the Azores</h2>
  <p>Explore the Atlantic with local operator OceanEye: glass-bottom boat trips, snorkeling, whale and dolphin watching, kayaking and island boat experiences. Find available activities and dates using the official OceanEye booking service.</p>
  <div class="te-highlights"><span>Local OceanEye operator</span><span>Live dates shown by FareHarbor</span><span>Secure booking with OceanEye</span></div>
  <a id="te-book" class="te-button" href="${OCEANEYE_AFFILIATE_URL}" rel="noopener noreferrer" aria-label="View OceanEye availability and book using TOETI partner link">View tours &amp; check availability →</a>
  <p class="te-note">Booking is handled securely by OceanEye through FareHarbor. Depending on your device, the booking window may open on TOETI or at FareHarbor. Payment and confirmation are handled by the operator.</p>
  <p class="te-note"><strong>Partner preview:</strong> commission attribution and settlement checks are still pending; this page is not yet approved for paid advertising.</p>
 </section>`;
}
function enhance(page){
 const css=`<style>
 .te-booking{margin:32px auto 56px;padding:clamp(26px,5vw,54px);max-width:1100px;background:linear-gradient(135deg,#09293c,#0c5d69 68%,#4e4379);color:#fff;border-radius:26px;box-shadow:0 22px 55px #1234}
 .te-booking h2{font-size:clamp(30px,5vw,55px);line-height:1.08;margin:10px 0 18px}
 .te-booking p{line-height:1.7;max-width:790px}.te-kicker{font-size:12px;font-weight:900;letter-spacing:.15em;color:#f4d497}
 .te-highlights{display:flex;flex-wrap:wrap;gap:9px;margin:23px 0}.te-highlights span{padding:9px 13px;border-radius:99px;background:#ffffff21;border:1px solid #ffffff3b;font-size:13px;font-weight:750}
 .te-button{display:inline-flex;align-items:center;min-height:52px;padding:15px 23px;border-radius:11px;background:#ffcd78;color:#112b3c!important;text-decoration:none;font-weight:900;font-size:17px;line-height:1.3}
 .te-button:focus-visible{outline:4px solid #fff;outline-offset:4px}.te-button:hover{background:#ffe0a8}
 .te-note{font-size:13px;color:#e5f1f3}.te-note strong{color:white}
 @media(max-width:640px){.te-booking{border-radius:16px;margin:18px 12px 42px;padding:25px 20px}.te-button{width:100%;justify-content:center;text-align:center}}
 </style>`;
 // Leave existing supplier preview untouched; add a single tracked booking module.
 const withSection=page.includes('</main>')?page.replace('</main>',launchInfo()+'</main>'):page.replace('</body>',launchInfo()+'</body>');
 return withSection.replace('</head>',`<meta name="robots" content="noindex,nofollow">${css}</head>`).replace('</body>',`<script defer src="${bookingScript}"></script></body>`);
}
export default {async fetch(request,env,ctx){
 const url=new URL(request.url);
 // Old enquiry links must not offer an untracked mailto checkout.
 if(url.pathname==='/qa/request'&&request.method==='GET')return Response.redirect(new URL('/#oceaneye-booking',url),302);
 const response=await base.fetch(request,env,ctx);
 if(request.method!=='GET'||!(response.headers.get('content-type')||'').includes('text/html'))return response;
 return new Response(enhance(await response.text()),{status:response.status,headers:htmlHeaders});
}};
