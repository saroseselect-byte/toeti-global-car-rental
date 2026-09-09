# Data model

Migrations create `suppliers`, `destinations`, `offers`, `supplier_reviews`, `bookings`, `booking_events`, `availability_requests`, `communications`, `audit_events`, `learning_events`, `supplier_commercial_terms`, `payment_routes`, and `transactions`.

Vehicle inventory and policies are currently version-controlled seed data. Booking prices are stored as integer cents with their ISO currency. Unknown terms use null/pending states; commission basis points are nullable and never defaulted.

Cars and experiences share the same offer and booking core. Type-specific details are stored as validated JSON during this 80/20 iteration. Later migrations may normalize high-volume fields, customers, commissions, payouts, refunds, integration connections and jobs when their first working flows are built.
