import test from 'node:test'; import assert from 'node:assert/strict';
import { rentalDays, quoteCents, canTransition, publicReference, secureToken, PaymentRouter } from '../src/domain.js';
test('rental duration and authoritative quote',()=>{ assert.equal(rentalDays('2026-10-12','2026-10-19'),7); assert.equal(quoteCents(3000,'2026-10-12','2026-10-19'),21000); });
test('invalid date range is rejected',()=>assert.throws(()=>rentalDays('2026-10-19','2026-10-12')));
test('state machine allows only controlled transitions',()=>{ assert.equal(canTransition('REQUESTED','SUPPLIER_CONTACT_PENDING'),true); assert.equal(canTransition('REQUESTED','PAID'),false); });
test('references and tokens are non-predictable shapes',()=>{ assert.match(publicReference(),/^TOETI-ZNZ-[A-F0-9]{8}$/); assert.ok(secureToken().length >= 32); });
test('router does not fabricate a payment provider',()=>assert.deepEqual(new PaymentRouter().select({}),{status:'UNAVAILABLE',reason:'No eligible payment provider configured.'}));
