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

test('Manolya cards use five distinct destination-accurate images without external checkout leakage', () => {
  const html = supplierPreview('/supplier/manolya-istanbul');
  assert.equal((html.match(/class="sp-product-image"/g) || []).length, 5);
  assert.match(html, /Exterior_of_Hagia_Sophia-/);
  assert.match(html, /Topkapi_Palace/);
  assert.match(html, /Basilica_Cistern_Istanbul/);
  assert.match(html, /Sunset_over_Bosphorus/);
  assert.match(html, /Dolmabahce-Palace-Istanbul/);
  assert.doesNotMatch(html, /href="https:\/\/manolyatour\.com\/skip-the-line-tickets\//);
});
