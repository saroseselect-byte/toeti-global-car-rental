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

test('public SEO files expose only customer-ready TOETI routes', async () => {
  const robots = await (await get('/robots.txt')).text();
  const sitemap = await (await get('/sitemap.xml')).text();

  assert.match(robots, /Sitemap: https:\/\/toeti-global-car-rental\.sarose\.workers\.dev\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/toeti-global-car-rental\.sarose\.workers\.dev\/zanzibar-car-rental/);
  assert.doesNotMatch(sitemap, /supplier\/|review|preview|demo/i);
});

test('Explore speaks to customers without internal supplier workflow language', async () => {
  const html = await (await get('/explore')).text();

  assert.doesNotMatch(html, /supplier approval|after approval|suppliers confirm/i);
  assert.doesNotMatch(html, /COMING SOON/);
  assert.match(html, /More journeys ahead/);
});


test('homepage globe has no decorative flight stripe and retains Earth imagery for the fallback', async () => {
  const html = await (await get('/')).text();

  assert.doesNotMatch(html, /globe-orbit|globe-flight/);
  assert.match(html, /\.globe-fallback\{[^}]*earth-blue-marble\.jpg/);
  assert.match(html, /body\{background:#fffefd!important/);
  assert.match(html, /filter:brightness\(1\.25\) saturate\(1\.2\)/);
  assert.match(html, /<img class="global-mobility-reference"[^>]*src="data:image\/jpeg;base64,/);
  assert.match(html, /@keyframes toeti-world-turn/);
});


test('public TOETI pages share the bright Sarose luxe theme', async () => {
  for (const path of ['/', '/explore', '/partners']) {
    const response = await get(path);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /--toeti-luxe-violet:#7c3aed/);
    assert.match(html, /--toeti-luxe-neon:#c084fc/);
    assert.match(html, /--toeti-luxe-ivory:#fdfbf7/);
    assert.match(html, /TOETI LUXE THEME/);
  }
});
