import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/qa-click-wrapper.js';

test('AF Madeira review is customer-readable and offers a safe enquiry action', async () => {
  const response = await worker.fetch(new Request('https://example.test/supplier/af-madeira-rental'), {}, {});
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /AF Madeira Rental/i);
  assert.doesNotMatch(html, /NOTHING LIVE|supplier-facing review|commercial gate|before launch/i);
  assert.match(html, /href="\/qa\/request\?item=AF%20Madeira%20Rental"/);

  const enquiry = await worker.fetch(new Request('https://example.test/qa/request?item=AF%20Madeira%20Rental'), {}, {});
  assert.equal(enquiry.status, 200);
  assert.match(await enquiry.text(), /mailto:toetirental@gmail\.com/);
});
