# TOETI master architecture

TOETI is a global marketplace for rental cars and experiences. P1 is a single Cloudflare Worker with D1 persistence. Domain records are universal: destinations, suppliers, offers, bookings, events and payment routes. Zanzibar and Maluda are seed data, not architectural special cases.

The public Worker serves inventory and accepts request-to-book submissions. The server selects the authoritative offer price, calculates rental days and total, persists the booking and writes booking/audit events atomically. Supplier contact is the next operational step. Payment is intentionally unavailable until an eligible provider adapter and supplier commercial terms are configured.

Future connectors live behind adapters. Financial state changes must originate from verified provider webhooks, be idempotent, and emit structured events. No raw card data enters TOETI.
