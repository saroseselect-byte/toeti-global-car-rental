import test from 'node:test';
import assert from 'node:assert/strict';
import { supplierPreview } from '../src/supplier-pages.js';
import { yacoutReview } from '../src/yacout-review.js';

test('Manolya supplier review is presented in Turkish', () => {
  const html = supplierPreview('/supplier/manolya-istanbul');
  assert.match(html, /TEDARİKÇİ İNCELEMESİ/);
  assert.match(html, /onaylandıktan sonra/);
});

test('Yacout supplier review is presented in French', () => {
  const html = yacoutReview();
  assert.match(html, /REVUE PRIVÉE DU FOURNISSEUR/);
  assert.match(html, /À VÉRIFIER AVANT ACTIVATION/);
});