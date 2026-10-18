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
