export const BOOKING_STATES = Object.freeze([
  'REQUESTED','SUPPLIER_CONTACT_PENDING','SUPPLIER_CONTACTED','AVAILABILITY_CONFIRMED',
  'AVAILABILITY_DECLINED','PAYMENT_PENDING','PAID','CONFIRMED','CANCELLED',
  'REFUND_PENDING','REFUNDED','PAYOUT_PENDING','PAYOUT_COMPLETED','FAILED','NEEDS_REVIEW'
]);

export const TRANSITIONS = Object.freeze({
  REQUESTED: ['SUPPLIER_CONTACT_PENDING','CANCELLED','NEEDS_REVIEW'],
  SUPPLIER_CONTACT_PENDING: ['SUPPLIER_CONTACTED','FAILED','NEEDS_REVIEW'],
  SUPPLIER_CONTACTED: ['AVAILABILITY_CONFIRMED','AVAILABILITY_DECLINED','NEEDS_REVIEW'],
  AVAILABILITY_CONFIRMED: ['PAYMENT_PENDING','CANCELLED','NEEDS_REVIEW'],
  AVAILABILITY_DECLINED: [], PAYMENT_PENDING: ['PAID','FAILED','CANCELLED'],
  PAID: ['CONFIRMED','REFUND_PENDING','NEEDS_REVIEW'],
  CONFIRMED: ['CANCELLED','REFUND_PENDING','PAYOUT_PENDING'],
  CANCELLED: ['REFUND_PENDING'], REFUND_PENDING: ['REFUNDED','FAILED'], REFUNDED: [],
  PAYOUT_PENDING: ['PAYOUT_COMPLETED','FAILED','NEEDS_REVIEW'], PAYOUT_COMPLETED: [],
  FAILED: ['NEEDS_REVIEW'], NEEDS_REVIEW: []
});

export function canTransition(from, to) { return TRANSITIONS[from]?.includes(to) ?? false; }
export function rentalDays(pickup, dropoff) {
  const start = Date.parse(`${pickup}T00:00:00Z`), end = Date.parse(`${dropoff}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error('Return date must be after pickup date.');
  return Math.ceil((end - start) / 86400000);
}
export function quoteCents(dailyRateCents, pickup, dropoff) { return dailyRateCents * rentalDays(pickup, dropoff); }
function randomHex(size) { const bytes = crypto.getRandomValues(new Uint8Array(size)); return [...bytes].map(x => x.toString(16).padStart(2,'0')).join(''); }
export function publicReference() { return `TOETI-ZNZ-${randomHex(4).toUpperCase()}`; }
export function secureToken() { const bytes = crypto.getRandomValues(new Uint8Array(24)); return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''); }

export class PaymentRouter {
  constructor(providers = []) { this.providers = providers; }
  select(context) {
    const provider = this.providers.find((p) => p.supports(context));
    if (!provider) return { status: 'UNAVAILABLE', reason: 'No eligible payment provider configured.' };
    return { status: 'SELECTED', provider: provider.id };
  }
}
