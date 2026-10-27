import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{OCEANEYE_AFFILIATE_URL} from '../src/qa-click-wrapper.js';
test('OceanEye uses the exact approved affiliate parameters once, with FareHarbor Lightframe',async()=>{
 const response=await worker.fetch(new Request('https://example.com/'));
 const html=await response.text();
 const u=new URL(OCEANEYE_AFFILIATE_URL);
 assert.equal(u.searchParams.get('ref'),'toetiglobal-asn');
 assert.equal(u.searchParams.get('asn-ref'),'toetiglobal-asn');
 assert.equal(u.searchParams.get('schedule-uuid'),'fd133e37-4928-4280-83e0-07b8ec9a21d4');
 assert.ok(html.includes(OCEANEYE_AFFILIATE_URL));
 assert.ok(html.includes('https://fareharbor.com/embeds/api/v1/?autolightframe=yes'));
 assert.equal((html.match(/id="te-book"/g)||[]).length,1);
 assert.match(response.headers.get('x-robots-tag'),/noindex/);
});
test('old /qa/request does not create an untracked mailto link',async()=>{
 const r=await worker.fetch(new Request('https://example.com/qa/request?item=Boat'));
 assert.equal(r.status,302);
 assert.equal(r.headers.get('location'),'https://example.com/#oceaneye-booking');
});
