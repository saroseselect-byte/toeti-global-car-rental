import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/entry.js';

test('Cape Car Tours canonical route serves the prepared four-experience page', async () => {
  const response = await worker.fetch(
    new Request('https://toeti.test/supplier/cape-car-tours'),
    {},
  );
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<h1>Cape Car Tours<\/h1>/);
  assert.match(html, /Constantia Wine and Picnic Tour/);
  assert.match(html, /Cape Peninsula Tour/);
  assert.match(html, /Cape Picnic and Penguins Tour/);
  assert.match(html, /Custom Western Cape Tour/);
});
