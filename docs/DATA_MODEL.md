# Data model

P1 migrations create `suppliers`, `destinations`, `offers`, `bookings`, `booking_events`, `audit_events`, `supplier_commercial_terms`, `payment_routes`, and `transactions`.

Vehicle inventory and policies are currently version-controlled seed data. Booking prices are stored as integer cents with their ISO currency. Unknown terms use null/pending states; commission basis points are nullable and never defaulted.

Later migrations may add normalized vehicles, experiences, pricing, policies, availability requests, customers, commissions, payouts, refunds, communications, integration connections and jobs when their first working flows are built.
