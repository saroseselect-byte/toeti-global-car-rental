CREATE TABLE IF NOT EXISTS toeti_payment_bookings (
  id TEXT PRIMARY KEY,
  supplier_key TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('car','experience')),
  product_name TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  currency TEXT NOT NULL,
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'awaiting_payment',
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fulfilled_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_toeti_payment_bookings_status
  ON toeti_payment_bookings(status);
CREATE INDEX IF NOT EXISTS idx_toeti_payment_bookings_supplier
  ON toeti_payment_bookings(supplier_key);

CREATE TABLE IF NOT EXISTS supplier_payout_profiles (
  supplier_key TEXT PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  stripe_account_id TEXT,
  payout_share_bps INTEGER NOT NULL DEFAULT 8500 CHECK (payout_share_bps BETWEEN 0 AND 10000),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS toeti_payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES toeti_payment_bookings(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_toeti_payments_intent
  ON toeti_payments(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS toeti_transfers (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  supplier_key TEXT NOT NULL,
  stripe_transfer_id TEXT NOT NULL UNIQUE,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES toeti_payment_bookings(id)
);

CREATE TABLE IF NOT EXISTS toeti_refunds (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  stripe_refund_id TEXT NOT NULL UNIQUE,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES toeti_payment_bookings(id)
);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
