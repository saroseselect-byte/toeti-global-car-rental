# All-supplier release gate — 24 October 2026
This is a **technical smoke audit**, NOT a supplier approval or public launch authorization.
Run: `node scripts/audit-supplier-previews.mjs`.
The script checks 21 previously deployed review URLs, booking forms/CTAs and a sample of image HTTP requests; writes a local JSON report (gitignored). It does **not** submit customer information, send email, accept payments or mutate production.

## Observed audit
- 21 review URLs checked; 20 returned HTTP 200; Cape Car Tours endpoint did not respond in this audit (recheck, do not assume permanently down).
- None of the 21 HTML responses showed a genuine customer input form.
- Yacout request CTA uses mailto only; AF Madeira request target had no real form in the previous direct check.
- Manolya, Premiant, WST and NCH had some destination image HTTP errors; these may be anti-bot blocks and require browser verification.
- Reviews are **not** SALES GREEN. Written supplier approval, correct contract/fees/terms, photo provenance, contact/booking confirmation and tracking are still mandatory.
- Do not route ads to these reviews; do not expose internal review copy to customers.
- Preserve existing supplier pages and closed supplier answers. Do not rebuild existing approved materials.
- Shared product photo safety fallback added to the main TOETI supplier template; individually deployed old review Workers need separate update from their original branches after source verification.
- Existing live Maluda routes are locked and excluded.
- No production D1 changes, Worker deployment or customer data collection occurred in this audit.
