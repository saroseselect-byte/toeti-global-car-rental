import test from 'node:test';
import assert from 'node:assert/strict';
import { destinations, customerReadyDestinations, globeDestinations } from '../src/destinations.js';
import { globalHome } from '../src/global-home.js';

test('destination registry is safe for public sales surfaces',()=>{
  const ids=new Set();
  const allowed=new Set(['CAR','EXPERIENCE','LONGSTAY']);
  for(const d of destinations){
    assert.ok(d.id && !ids.has(d.id),'destination ids must be unique'); ids.add(d.id);
    assert.ok(Number.isFinite(d.lat)&&d.lat>=-90&&d.lat<=90,'valid latitude');
    assert.ok(Number.isFinite(d.lng)&&d.lng>=-180&&d.lng<=180,'valid longitude');
    assert.ok(allowed.has(d.category),'known category');
    if(d.public){
      assert.equal(d.status,'SALES_GREEN');
      assert.ok(d.url?.startsWith('/')&&!/review|preview|private/i.test(d.url),'public route must not be review/private');
      assert.ok(d.exploreUrl?.startsWith('/'),'explore route required');
    }
  }
  assert.deepEqual(globeDestinations,customerReadyDestinations);
});

test('homepage live destination UI is driven by every customer-ready registry record',()=>{
  const html=globalHome();
  for(const d of customerReadyDestinations){
    assert.match(html,new RegExp(`href=["']${d.url.replace(/[.*+?^$()|[\]\\]/g,'\\$&')}["']`));
    assert.ok(html.includes(d.destination));
    assert.ok(html.includes(d.copy));
  }
});