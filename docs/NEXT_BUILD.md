# Next build

Recommended puzzle piece: supplier availability operations.

1. Create and bind production D1; deploy and verify a persisted test booking.
2. Add an authenticated internal action to move `REQUESTED` through supplier-contact and availability states.
3. Connect the approved supplier communication channel with idempotent outbound messages and reply capture.
4. Obtain Maluda's insurance/excess answer and supplier-specific commission agreement; preserve source evidence.
5. Only then evaluate one sandbox platform-payment provider and implement checkout plus signed webhook handling.

## Autonomy classification

| Process | Now | Target |
|---|---|---|
| Supplier availability decision | A — supplier/human decision | A |
| Publish unconfirmed insurance/terms | A — forbidden without evidence | A |
| Booking validation and quote | D — automated now | D |
| Supplier contact | B — manual until channel approved | C/D |
| Payment-provider/KYC approval | A/B | A/B |
| Payment reconciliation after verified webhooks | Not built | C/D |
