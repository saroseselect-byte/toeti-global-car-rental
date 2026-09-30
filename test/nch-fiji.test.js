import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/qa-click-wrapper.js';

const call = (path) => worker.fetch(new Request(`https://nch.test${path}`), {}, {});

test('NCH Fiji exposes stable supplier routes without internal review language', async () => {
  for (const path of ['/', '/supplier/nch-fiji', '/supplier/nch-rentals-fiji']) {
    const response = await call(path);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /NCH Rentals Fiji/);
    assert.match(html, /View &amp; request|View & request/);
    assert.doesNotMatch(html, /SUPPLIER REVIEW|REVIEW_READY|review-only|NOT LIVE/i);
  }
});

test('stale undefined supplier route redirects to the stable NCH root', async () => {
  const response = await call('/supplier/undefined');

  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), 'https://nch.test/');
});

test('NCH request page keeps the selected group and takes no payment', async () => {
  const response = await call('/request?item=Group%20A');
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Group A/);
  assert.match(html, /No payment is taken at this stage/);
  assert.doesNotMatch(html, /undefined/);
});
