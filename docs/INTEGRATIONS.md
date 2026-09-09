# Integrations

## GitHub

Source repository: `saroseselect-byte/toeti-global-car-rental`. No secrets belong in Git.

## Cloudflare

Required for launch: Workers and D1. Create database `toeti-production`, replace the D1 ID placeholder in `wrangler.jsonc`, apply both migrations, then deploy. No Cloudflare credential is available in the current build environment, so production remains unverified.

## Supplier communication

Manual decisions work through secure supplier links. Email creates an auditable queued communication record but does not send externally. WhatsApp and supplier APIs remain explicitly NOT YET VERIFIED.

## Payments

Not connected and not required for P1. A future platform-payments provider must support the relevant countries, supplier KYC, checkout, verified signed webhooks, commission/split accounting, payouts and refunds. Credentials belong in Cloudflare secrets. Sandbox mode is required before production. Provider costs must be reviewed at selection time.
