import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

class FakeStatement {
  constructor(sql) { this.sql = sql; this.values = []; }
  bind(...values) { this.values = values; return this; }
}

test('booking endpoint calculates on server and writes booking plus events', async () => {
  const saved = [];
  const DB = { prepare: sql => new FakeStatement(sql), batch: async statements => { saved.push(...statements); return statements.map(() => ({ success: true })); } };
  const request = new Request('https://toeti.test/api/bookings', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
    vehicleId: 'veh_rav4', pickupDate: '2026-10-12', returnDate: '2026-10-19', pickupLocation: 'Zanzibar Airport',
    customerName: 'P1 Test Customer', customerEmail: 'P1@Example.com', customerPhone: '+255000000000', totalCents: 1
  }) });
  const response = await worker.fetch(request, { DB });
  const result = await response.json();
  assert.equal(response.status, 201);
  assert.equal(result.totalCents, 21000);
  assert.equal(result.rentalDays, 7);
  assert.equal(result.status, 'AWAITING_SUPPLIER');
  assert.match(result.reference, /^TOETI-ZNZ-[A-F0-9]{8}$/);
  assert.equal(saved.length, 6);
  assert.match(saved[0].sql, /INSERT INTO bookings/);
  assert.equal(saved[0].values[13], 21000);
  assert.equal(saved[0].values[14], 'AWAITING_SUPPLIER');
  assert.match(saved[1].sql, /INSERT INTO booking_events/);
  assert.match(saved[2].sql, /INSERT INTO availability_requests/);
  assert.match(saved[4].sql, /INSERT INTO audit_events/);
});

test('booking endpoint rejects unknown vehicle and invalid dates', async () => {
  const DB = { prepare: sql => ({ bind(){return this}, async first(){return null}, sql }), batch: async () => { throw new Error('must not write'); } };
  const base = { pickupDate: '2026-10-19', returnDate: '2026-10-12', pickupLocation: 'Stone Town', customerName: 'Test', customerEmail: 'test@example.com', customerPhone: '1' };
  let response = await worker.fetch(new Request('https://toeti.test/api/bookings', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ ...base, vehicleId: 'missing' }) }), { DB });
  assert.equal(response.status, 404);
  response = await worker.fetch(new Request('https://toeti.test/api/bookings', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ ...base, vehicleId: 'veh_rav4' }) }), { DB });
  assert.equal(response.status, 400);
});
