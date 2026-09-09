# Decisions

1. **Cloudflare Worker + D1 monolith for P1.** It is the smallest deployable system with durable state and leaves room for adapters without premature microservices.
2. **Request to book.** Maluda has no availability API; payment cannot start until supplier availability is confirmed.
3. **Integer cents and server-side quotes.** Browser-submitted amounts are never trusted.
4. **Universal domain names.** Zanzibar and Maluda are records/seed data, not one-off architecture.
5. **Nullable commission.** No universal TOETI percentage exists.
6. **Events alongside state.** Each important action leaves booking and audit history for later orchestration.
7. **No live payment in P1.** The router returns unavailable until real provider eligibility and credentials exist.
