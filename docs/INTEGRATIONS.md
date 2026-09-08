# Integrations

## GitHub

Source repository: `saroseselect-byte/toeti-global-car-rental`. No secrets belong in Git.

## Cloudflare

Required for launch: Workers and D1. Create database `toeti-production`, replace the D1 ID placeholder in `wrangler.jsonc`, apply migrations, then deploy. Use separate preview/production configuration before accepting real customers.

## Supplier communication

Not connected. Next adapter requires a sender account, API/OAuth credentials, least-privilege send/read scopes, and webhook or scheduled reply ingestion. Supplier availability remains a human-confirmed request flow for P1.

## Payments

Not connected and not required for P1. A future platform-payments provider must support the relevant countries, supplier KYC, checkout, verified signed webhooks, commission/split accounting, payouts and refunds. Credentials belong in Cloudflare secrets. Sandbox mode is required before production. Provider costs must be reviewed at selection time.
