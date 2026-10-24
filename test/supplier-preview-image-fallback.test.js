import test from 'node:test';
import assert from 'node:assert/strict';
import { supplierPreview, supplierCss } from '../src/supplier-pages.js';
test('every Manolya product image falls back without pretending an unavailable photo loaded',()=>{
 const html=supplierPreview('/supplier/manolya-istanbul');
 assert.equal((html.match(/sp-product-image/g)||[]).length,5);
 assert.equal((html.match(/sp-photo-unavailable/g)||[]).length,5);
 assert.match(supplierCss,/Destination photo temporarily unavailable/);
});
test('unapproved supplier detail stays in review, not a fake checkout',()=>{
 const html=supplierPreview('/supplier/manolya-istanbul',1);
 assert.match(html,/activation pending|bekliyor/i);
 assert.doesNotMatch(html,/<form/i);
});
