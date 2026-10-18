# TOETI first customer-acquisition wave — evidence gate (2026-10-18)

## Scope: Fiji, Zanzibar, and only tours independently verified as SALES_GREEN

This is a launch-readiness plan, **not** permission to publish, email customers, spend ad budget, or activate an unapproved supplier. Work on existing customer routes only; no duplicate pages, inventory, funnels or PRs.

| Stream | Existing evidence | Customer traffic status | Next minimal proof |
|---|---|---|---|
| Zanzibar / Maluda cars | Supplier-approved six-car public offer set in src/data.js; PRs #23, #33, #58, #61 cover supplier terms, organic landing, canonical flow and SEO | Candidate for first wave, pending current deployed-route, mobile, CTA and request end-to-end verification | Check canonical customer route, six real photos, accurate rates, permit disclosure, enquiry submission and status confirmation |
| Fiji / NCH cars | PRs #46 and #65 cover canonical supplier routes and request navigation; PR #71 is an isolated fictional demo | HOLD customer acquisition until real supplier and commercial gates pass | Reuse original NCH photos, verify real fleet/terms and booking path, obtain written approval; never promote demo rates |
| Tours & Experiences | PRs #17 and #18 are review-only; #29 Cape tours needs commercial/route approval; src/data.js experience is DEMO_APPROVED only | HOLD: no tour established as SALES_GREEN by this evidence | Inspect current SALES_GREEN registry, supplier written approvals, price/availability, canonical TOETI enquiry path, mobile and runtime; only then add specific tours to wave |

## 80/20 conversion readiness
1. Verify production reality against latest Work changes before editing: home, /explore, canonical Zanzibar and Fiji, approved tour routes, desktop and mobile.
2. Confirm each live card leads to TOETI-owned enquiry, not external supplier checkout. Check form submission, validation, confirmation and tracking without PII leakage.
3. Keep review/demo/private routes out of index and sitemap. No invented rates, availability, tour inventory or testimonials.
4. Prepare SEO landing titles and destination content only for verified sales-ready offers; prefer existing Zanzibar SEO page rather than duplicating.
5. Measure consent-compliant visit → enquiry conversion before paid advertising. First use no-budget organic posts and search once CEO approves external publication.

## Release gate
MARKETING_READY requires deployed 200 routes, mobile+desktop visual QA, supplier written commercial approval, real availability disclaimer, enquiry success, privacy/consent and tracking, and CEO publication authorization. Never equate a green GitHub CI with marketing readiness.

## Mandatory image provenance gate
- Car imagery MUST match the exact supplier and vehicle. Reuse original supplier-provided/authorized NCH Fiji and Maluda Zanzibar assets; never replace with AI or generic car pictures.
- Destination hero imagery MUST depict the named destination, with a verifiable source, correct geographic identification, and appropriate usage rights. Do not present a photo from another country/island as this destination.
- Tour images MUST match the actual advertised tour/attraction or be clearly identified as representative regional imagery when explicitly approved; do not invent itinerary photos.
- Keep an asset record with destination, supplier/vehicle/tour, source URL or file reference, rights/approval, and verification status before publication.
- If provenance, rights, or identity cannot be verified, retain an accessible neutral placeholder and block customer marketing for that image until resolved.
- Do not change already approved originals without a specific verified correction.
