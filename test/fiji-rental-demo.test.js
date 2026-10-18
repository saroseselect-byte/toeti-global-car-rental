import test from 'node:test';
import assert from 'node:assert/strict';
import { rentalDemoQuote, renderFijiRentalDemo, escapeDemoHtml } from '../src/fiji-rental-demo.js';
test('seven day Fiji demo quote is illustrative only',()=>{
 const q=rentalDemoQuote({vehicleId:'demo-corolla',days:7});
 assert.equal(q.subtotal,595);assert.equal(q.currency,'FJD');assert.equal(q.canBook,false);assert.equal(q.availabilityVerified,false);
});
test('rejects invalid vehicles and durations',()=>{
 for(const days of [0,-1,181,1.5,NaN])assert.throws(()=>rentalDemoQuote({vehicleId:'demo-corolla',days}),RangeError);
 assert.throws(()=>rentalDemoQuote({vehicleId:'missing',days:7}),RangeError);
});
test('safe demo route renders controls but no booking form',()=>{
 const page=renderFijiRentalDemo();
 assert.match(page,/value="7"/);assert.match(page,/DEMONSTRATION ONLY/);
 assert.doesNotMatch(page,/\/api\/bookings|fetch\(|<form/i);
 assert.equal(escapeDemoHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
