import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/qa-click-wrapper.js';

test('Manolya customer runtime removes internal supplier and approval language', async () => {
  const response = await worker.fetch(new Request('https://toeti.test/supplier/manolya-istanbul'), {}, {});
  assert.equal(response.status, 200);
  const html = await response.text();
  const visibleText = html.replace(/<style>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(visibleText, /\b(?:supplier|approval|inventory|pilot|commission|QA)\b/i);
  assert.doesNotMatch(visibleText, /(?:€|\$|£)\s?\d|\bavailable today\b/i);
  assert.match(visibleText, /Final details remain confirmed during the request/i);
  assert.doesNotMatch(html, /header,\.hero,\[class\*=hero\]\{min-height:58vh/i);
});
