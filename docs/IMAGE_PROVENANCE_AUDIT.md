# TOETI image provenance audit — first pass (2026-10-18)

This is a **source-code inspection**, not visual verification of the actual images or confirmation of licensing. No production assets were changed.

| Surface | Evidence in current branch | Finding | Gate |
|---|---|---|---|
| Zanzibar / Maluda car cards | `src/data.js` has six Cloudinary images under `maluda-car-rental/cars/` for Escudo, RAV4, Juke, RAV4 Miss Tanzania, Harrier, Alphard | Supplier-specific source path is present; exact image-to-vehicle identity and rights still need visual/document review | Verify six original files against supplier-provided images before marketing |
| Zanzibar Prado | `src/data.js` holds seventh Prado with null image, excluded from public offers; `src/entry.js` has fallback/legacy Prado references | Correct to keep out of approved public inventory. Legacy path needs runtime check | Do not advertise Prado or use an unrelated photo |
| Zanzibar destination hero | `src/entry.js` contains a Wikimedia hero URL and a separate Stone Town marketplace Wikimedia image | URLs point to intended Zanzibar-related subjects by filename; actual visual, source metadata and licensing not yet checked | Confirm image contents, attribution and license |
| Zanzibar experience image | `src/entry.js` replaces a TOUR placeholder with a Stone Town market image, while `src/data.js` experience is explicitly demo | **Potential misleading association** if this is shown as a bookable supplier-approved tour | Keep demo experiences out of customer acquisition; verify current public route |
| Fiji NCH | `src/entry.js` mounts existing `qa-click-wrapper.js` via `/supplier/nch-fiji`; separate `/demo/fiji-rental` has no photos | No invented image was added by PR #71. Original six NCH photos need to be traced and checked against each car | Never substitute generic Fiji or AI vehicle imagery |
| Other supplier tour previews | `src/supplier-pages.js` contains location-specific Wikimedia hero URLs and item photos | Some source and license metadata is recorded, but route and individual photo review remains necessary | Do not market review-only tour pages |

## Immediate marketing hold
No external campaign may use these images until the exact vehicle/tour identity, geography, supplier permission or Creative Commons attribution requirements and deployed appearance have been verified. Avoid adding duplicate media to the repo. Reuse the existing authorized originals.

## Second pass: active customer-facing worker (2026-10-18)
- **Important correction:** The public `/supplier/maluda-zanzibar` and `/cars/*` routes are handled by `src/maluda-zanzibar-final-worker.js`, not solely `src/data.js`. This worker uses **six different Cloudinary vehicle URLs** from the `src/data.js` catalog. Audit the active worker images first, not the legacy catalog images.
- Active Maluda worker maps six car slugs to six supplier-namespaced URLs. URL namespaces alone **do not prove** exact vehicle identity; verify against supplier originals visually.
- `/supplier/nch-fiji` is served by `src/qa-click-wrapper.js` backed by `src/nch-fiji-worker.js`. The latter contains **three Wikimedia Fiji scenery URLs**, but **Group A–F cards use text/placeholder visuals**, not the six original supplier vehicle photos. The original NCH photo assets have not been located in these active worker files. Do not claim Fiji photo readiness or substitute generic images.
- The Fiji demo remains separately isolated and image-free. Its fictional prices must never be marketed as NCH offers.
- Next evidence needed: original NCH photo file identifiers and approved group-to-photo mapping; visually inspect the six active Maluda URLs and the exact Wikimedia hero image metadata. Do not modify the customer-facing worker until verified.

## Original NCH supplier attachments recovered (2026-10-18)
Source: TOETI Gmail thread `Re: TOETI Global — Fiji car-rental partnership pilot`, supplier message dated 2026-09-13, six PNG attachments. All six were retrieved and visually inspected; **they are genuine supplier-submitted photos**, not stock/AI images.

| Attachment timestamp in filename | Visible vehicle (visual identification; supplier group mapping NOT confirmed) |
|---|---|
| 11.49.17 AM | Blue Mazda hatchback (appears Mazda Demio) |
| 11.49.37 AM | Red Toyota tall compact vehicle (front view; model unconfirmed) |
| 11.49.57 AM | White tall minivan, side view (model unconfirmed) |
| 11.50.38 AM | White crossover SUV (model unconfirmed) |
| 11.50.55 AM | White Nissan X-Trail, side view (likely) |
| 11.51.12 AM | White Nissan X-Trail, rear view — appears **same car as 11.50.55**, not necessarily a sixth distinct vehicle |

**Do not map one attachment to each A–F group automatically.** Two X-Trail images appear to depict the same car; the red Toyota and white van require model identification. Some images show license plates: consider privacy/appropriateness of displaying plates in public, preserving originals internally. Supplier originals are in the TOETI mailbox; they have NOT been committed to GitHub or published because the current GitHub file actions accept UTF-8 text only, not binary PNG upload. Next: import originals through authorized binary asset upload workflow, then map groups using supplier-provided group mapping, verify customer page and obtain publication approval. Never substitute photos from unrelated Fiji operators.

## Verified 2026-10-18 — duplicate-work prevention
- Original NCH supplier email 2026-09-13 (Gmail message `1a0980cf6129b1cc`) already contains six PNG attachments and fleet details; do not ask NCH to resend them.
- Existing PR #13 already created `src/nch-fiji-worker.js`, `src/qa-click-wrapper.js`, and `supplier-pilots/nch-fiji.json`. PR #30 contains existing Fiji tests. Reuse, do not rebuild.
- `supplier-pilots/nch-fiji.json` explicitly says the six supplier photos are *source assets for review*, and prohibits inferred group-specific details. It does **not** contain a verified image-to-group mapping or hosted photo URLs.
- Previous TOETI outbound email already sent NCH the supplier review link. Do not send duplicate outreach; await or inspect existing approval thread before any new contact.
- Existing unsent NCH photo mapping draft is redundant pending full asset/review audit; do not send it automatically.
- Safe path: inspect earlier supplier review deployment and asset history; restore original images to review-only environment, labelled as a supplier fleet gallery without assigning unverified group identities; obtain written approval before customer launch.
