import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/entry.js';

const get = path => worker.fetch(new Request(`https://toeti.test${path}`), {});

test('homepage product buttons open the matching Explore sections', async () => {
  const html = await (await get('/')).text();

  assert.match(html, /href="\/explore#cars"[^>]*><span>CARS<\/span>/);
  assert.match(html, /href="\/explore#experiences"[^>]*><span>TOURS &amp; EXPERIENCES<\/span>/);
  assert.match(html, /href="\/explore#longstay"[^>]*><span>LONG-STAY(?: CARS)?<\/span>/);
});

test('Explore exposes working Cars, Tours and Long-stay destinations', async () => {
  const html = await (await get('/explore')).text();

  assert.match(html, /id="cars"/);
  assert.match(html, /id="experiences"/);
  assert.match(html, /id="longstay"/);
});

test('Zanzibar customer destination hides internal demo and launch workflow copy', async () => {
  const html = await (await get('/destination/zanzibar')).text();

  assert.doesNotMatch(html, />Demo flow</);
  assert.doesNotMatch(html, /Launch \/ founding-partner phase/);
  assert.match(html, /Local travel, connected globally\./);
});

test('Explore does not expose internal demo or launch workflow copy', async () => {
  const html = await (await get('/explore')).text();

  assert.doesNotMatch(html, />Demo flow</);
  assert.doesNotMatch(html, /Launch \/ founding-partner phase/);
  assert.doesNotMatch(html, /destination previews/i);
  assert.match(html, /destination/);
  assert.match(html, /Local travel, connected globally\./);
});
