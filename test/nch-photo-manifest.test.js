import test from 'node:test';
import assert from 'node:assert/strict';
import {NCH_ORIGINAL_PHOTOS,approvedNchPhotoForGroup} from '../src/nch-photo-manifest.js';

test('six supplier original photo records are preserved, no group guessed',()=>{
 assert.equal(NCH_ORIGINAL_PHOTOS.length,6);
 assert.equal(new Set(NCH_ORIGINAL_PHOTOS.map(x=>x.file)).size,6);
 for(const p of NCH_ORIGINAL_PHOTOS){
   assert.match(p.file,/Screenshot 2026-09-13/);
   assert.equal(p.group,null);
   assert.equal(p.publicUrl,null);
 }
});
test('NCH group photo mapping fails closed until approved and hosted',()=>{
 for(const group of ['Group A','Group B','Group C','Group D','Group E','Group F']){
   assert.equal(approvedNchPhotoForGroup(group),null);
 }
});

test('NCH worker uses the verified photo gate rather than arbitrary images', async()=>{
 const fs=await import('node:fs');
 const worker=fs.readFileSync(new URL('../src/nch-fiji-worker.js',import.meta.url),'utf8');
 assert.match(worker,/approvedNchPhotoForGroup\(g\.name\)/);
 assert.match(worker,/Exact available vehicle confirmed by NCH/);
 assert.doesNotMatch(worker,/nch-fiji-original-0[1-6]\.webp/);
});
