import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/entry.js';

const get = path => worker.fetch(new Request(`https://toeti.test${path}`), {});

test('homepage product buttons open the matching Explore sections', async () => {
  const html = await (await get('/')).text();

  assert.match(html, /href="\/explore#cars"[^>]*><span>CARS<\/span>/);
  assert.match(html, /href="\/explore#experiences"[^>]*><span>TOURS &amp; EXPERIENCES<\/span>/);
  assert.match(html, /href="\/explore#longstay"[^>]*><span>LONG-STAY<\/span>/);
});

test('Explore exposes working Cars, Tours and Long-stay destinations', async () => {
  const html = await (await get('/explore')).text();

  assert.match(html, /id="cars"/);
  assert.match(html, /id="experiences"/);
  assert.match(html, /id="longstay"/);
});
