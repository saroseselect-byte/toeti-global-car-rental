# TOETI Global Car Rental — P1

Cloudflare Worker MVP for Zanzibar/Maluda request-to-book rentals.

## Local development

Run `npm install`, `npm test`, then `npm run dev`. Before deployment, create a Cloudflare D1 database, set its ID in `wrangler.jsonc`, apply `migrations/0001_initial.sql`, and deploy.

No live payments are enabled. See `docs/CURRENT_STATE.md` for exact status and blockers.
