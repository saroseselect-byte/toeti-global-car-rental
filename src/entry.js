import app from './index.js';

const heroCss = `.destination-hero{position:relative;min-height:520px;border-radius:26px;overflow:hidden;margin-bottom:24px;background:#0b172a;color:#fff;display:flex;align-items:flex-end;isolation:isolate;box-shadow:0 20px 55px rgba(8,27,55,.18)}.destination-hero:before{content:'';position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(4,14,28,.84) 0%,rgba(4,14,28,.62) 42%,rgba(4,14,28,.14) 72%,rgba(4,14,28,.08) 100%),url('https://upload.wikimedia.org/wikipedia/commons/8/8d/Nungwi_%282010-011-1318-T%29.jpg');background-size:cover;background-position:center 48%;z-index:-2}.destination-hero:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(4,14,28,.48),transparent 48%);z-index:-1}.destination-hero__content{padding:clamp(28px,5vw,58px);max-width:780px}.destination-hero__eyebrow{display:inline-flex;align-items:center;gap:8px;padding:7px 11px;border-radius:999px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.26);font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(8px)}.destination-hero h1{font-size:clamp(44px,7vw,82px);line-height:.96;letter-spacing:-.055em;margin:18px 0 14px;text-wrap:balance}.destination-hero p{font-size:clamp(17px,2vw,21px);line-height:1.6;color:#f3f7fb;max-width:660px;text-shadow:0 2px 16px rgba(0,0,0,.35)}.destination-hero__actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.destination-hero__actions .btn.alt{background:#fff;color:#10274c}.destination-hero__credit{position:absolute;right:16px;bottom:12px;font-size:11px;color:rgba(255,255,255,.86);background:rgba(0,0,0,.34);padding:6px 8px;border-radius:8px;backdrop-filter:blur(6px)}.destination-hero__credit a{text-decoration:underline;color:#fff}@media(max-width:700px){.destination-hero{min-height:500px;align-items:flex-end}.destination-hero:before{background-image:linear-gradient(0deg,rgba(4,14,28,.92) 0%,rgba(4,14,28,.64) 52%,rgba(4,14,28,.18) 100%),url('https://upload.wikimedia.org/wikipedia/commons/8/8d/Nungwi_%282010-011-1318-T%29.jpg');background-position:58% center}.destination-hero__content{padding:28px 22px 58px}.destination-hero__credit{left:22px;right:auto;bottom:12px}}`;

const heroMarkup = `<section class="destination-hero"><div class="destination-hero__content"><span class="destination-hero__eyebrow">TOETI ZANZIBAR · TANZANIA</span><h1>Explore Zanzibar with TOETI</h1><p>From Stone Town to the turquoise coast, discover Zanzibar with trusted local rental cars and experiences — with local suppliers keeping final control of availability.</p><div class="destination-hero__actions"><a class="btn alt" href="/destination/zanzibar?type=CAR_RENTAL">Rental Cars</a><a class="btn" href="/destination/zanzibar?type=EXPERIENCE">Experiences</a></div></div><div class="destination-hero__credit">Photo: <a href="https://commons.wikimedia.org/wiki/File:Nungwi_(2010-011-1318-T).jpg">Moongateclimber / Wikimedia Commons</a> · <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a> · cropped + overlay added</div></section>`;

export default {
  async fetch(request, env, ctx) {
    const response = await app.fetch(request, env, ctx);
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.pathname !== '/destination/zanzibar') return response;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    let body = await response.text();
    body = body.replace('</style>', `${heroCss}</style>`);
    body = body.replace(/<section class="welcome">[\s\S]*?<\/section>/, heroMarkup);

    const headers = new Headers(response.headers);
    const csp = headers.get('content-security-policy');
    if (csp && !csp.includes('https://upload.wikimedia.org')) {
      headers.set('content-security-policy', csp.replace('https://res.cloudinary.com', 'https://res.cloudinary.com https://upload.wikimedia.org'));
    }
    headers.set('cache-control', 'no-store');
    return new Response(body, { status: response.status, statusText: response.statusText, headers });
  }
};
