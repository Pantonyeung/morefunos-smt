import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL(path,import.meta.url),'utf8');

test('order entry loads one canonical runtime without conflicting reload hotfixes',async()=>{
  const html=await read('../pages/order/index.html');
  assert.match(html,/page-v14\.css\?v=16/);
  assert.match(html,/page-v14\.js\?v=16/);
  assert.doesNotMatch(html,/page-stability-v15\.js/);
  assert.doesNotMatch(html,/page-hotfix-v15\.js/);
});

test('active order and root runtimes contain no automatic page reload',async()=>{
  const order=await read('../pages/order/page-v14.js');
  const loader=await read('../app-loader.js');
  assert.doesNotMatch(order,/location\.reload\(/);
  assert.doesNotMatch(loader,/location\.reload\(/);
  assert.match(loader,/BUILD_ID='v16-20260719'/);
});
