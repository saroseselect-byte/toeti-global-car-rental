import test from 'node:test';
import assert from 'node:assert/strict';
import { supplierCss, supplierPreview } from '../src/supplier-pages.js';

test('Manolya renders one distinct, attributed destination image per experience', () => {
  const html = supplierPreview('/supplier/manolya-istanbul');
  const cards = [...html.matchAll(/<article class="sp-card">([\s\S]*?)<\/article>/g)].map(match => match[1]);
  assert.equal(cards.length, 5);

  const images = cards.map(card => {
    const match = card.match(/<img src="([^"]+)" alt="([^"]+)"/);
    assert.ok(match, 'each Manolya experience needs its own image and alt text');
    assert.match(card, /class="sp-photo-credit"/);
    assert.match(card, /https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.match(card, /https:\/\/creativecommons\.org\/licenses\//);
    return match[1];
  });

  assert.equal(new Set(images).size, 5, 'experience images must be unique');
});

test('Manolya uses the approved light presentation and keeps unverified claims out', () => {
  const html = supplierPreview('/supplier/manolya-istanbul');
  for (const forbidden of ['#0e1820', '#171f22', '#17252a', '#263136']) {
    assert.doesNotMatch(supplierCss, new RegExp(forbidden, 'i'));
  }
  assert.doesNotMatch(html, /\b(?:approval|inventory|pilot|review page|supplier review)\b/i);
  assert.doesNotMatch(html, /(?:€|\$|£)\s?\d|\bavailable today\b/i);
});
