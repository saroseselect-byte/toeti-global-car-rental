CREATE TABLE IF NOT EXISTS payment_orders (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  vertical TEXT NOT NULL CHECK (vertical IN ('cars','experiences')),
  supplier_slug TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  title TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  currency TEXT NOT NULL,
  customer_email TEXT,
  supplier_connect_account TEXT,
  supplier_share_bps INTEGER NOT NULL DEFAULT 8500,
  status TEXT NOT NULL DEFAULT 'supplier_confirmed',
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_transfer_id TEXT,
  stripe_refund_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_supplier ON payment_orders(supplier_slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_orders_checkout_session ON payment_orders(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_orders_payment_intent ON payment_orders(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
