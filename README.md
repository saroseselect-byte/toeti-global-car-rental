# TOETI supplier-ready booking core

One Cloudflare Worker + D1 application for Rental Cars and Tours & Experiences.

## Verified locally

- Customer storefront, destination and offer pages
- Secure supplier review, change request, revision and approval
- Public visibility only after supplier approval
- Request-to-book with separate customer and supplier tokens
- Manual/email availability adapter states
- Supplier accept/decline and customer status page
- Audit and learning events
- End-to-end Car and Experience tests

## Commands

- `npm test`
- `npm run check`
- `npx wrangler d1 migrations apply DB --local`
- `npm run dev`
- `npm run deploy`

Read `docs/CURRENT_STATE.md` before representing any capability as live.
