import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/entry.js';
const get = path => worker.fetch(new Request('https://toeti.test'+path),{},{});

test('NCH request form posts back to its own mounted route',async()=>{
 const response=await get('/nch/request?item=Group%20A');
 assert.equal(response.status,200);
 const html=await response.text();
 assert.match(html,/<form action="\/nch\/request" method="post">/);
 assert.match(html,/href="\/supplier\/nch-fiji"/);
 assert.doesNotMatch(html,/href="\/"/);
 assert.match(html,/name="item" value="Group A"/);
});
test('NCH supplier cards open the mounted NCH request route',async()=>{
 const response=await get('/supplier/nch-fiji');
 const html=await response.text();
 assert.match(html,/location.href='\/nch\/request\?item='/);
 assert.doesNotMatch(html,/location.href='\/request\?item='/);
});
