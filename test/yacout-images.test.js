import test from 'node:test';
import assert from 'node:assert/strict';
import { yacoutReview } from '../src/yacout-review.js';
test('Yacout review uses four real supplier-hosted photos only for exact models in groups A and B', () => {
 const html=yacoutReview();
 assert.equal((html.match(/<img /g)||[]).length,4);
 assert.equal((html.match(/https:\/\/yacout-tours\.com\/uploads\/cars\//g)||[]).length,4);
 for(const car of ['Dacia Logan','Kia Picanto','Renault Clio 5','Peugeot 208'])assert.match(html,new RegExp('alt="'+car));
 assert.match(html,/Photos des véhicules de cette catégorie en attente de validation/);
 assert.doesNotMatch(html,/https:\/\/images\.unsplash\.com/);
});
