# Current state

## VERIFIED WORKING (local build and D1-compatible test runtime)

- Responsive customer homepage for Rental Cars and Tours & Experiences.
- Zanzibar destination page, offer cards, offer detail and booking form.
- Seven Maluda vehicle prices in USD from the existing verified inventory seed.
- Maluda comprehensive-insurance excess/deductible updated to TZS 350,000; third-party-only minor damage language retained as supplier-provided information.
- Clearly labelled example Experience; no claim that it is real supplier inventory.
- One unified Destination → Supplier → Offer → Availability → Booking → Communication → Audit/Learning model.
- Secure random supplier review tokens, change requests, versioned revision, approval timestamp and LIVE gate.
- Draft or unapproved database offers return 404 and never appear publicly.
- Request-to-book creates AWAITING_SUPPLIER and never claims instant booking.
- Separate random customer-status and supplier-decision tokens.
- Supplier accepts or declines; customer status and booking events update.
- Manual adapter active; email adapter records a queued communication only.
- Audit and learning events for draft, review, change, revision, approval, live, booking and supplier outcome.
- Nine automated tests pass, including complete P1 Car and P2 Experience flows with restart-safe SQL persistence semantics.
- Both migrations apply successfully to local D1.

## NOT YET VERIFIED

- Production D1 database and public Cloudflare deployment. This environment has no Cloudflare API token/account binding and `wrangler.jsonc` deliberately retains a database-ID placeholder.
- Actual outbound supplier email delivery or inbound reply processing.
- WhatsApp integration.
- Supplier-specific API integration, including RF Rent-a-Car Azores documentation/authentication.
- Payment, checkout, KYC, commission, payout, refund or reconciliation.
- Real Experience inventory or supplier approval.
- Real customer booking traffic.

## Integrity rule

Only the first section may be described as verified working, and only in the stated local/test scope. No production URL or external integration may be claimed until separately deployed and tested.
