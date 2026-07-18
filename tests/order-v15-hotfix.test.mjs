import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('v15 hotfix keeps insertion order and sequence badges',()=>{
  const js=read('pages/order/page-hotfix-v15.js');
  assert.match(js,/preserveInsertionOrder/);
  assert.match(js,/createdOrder/);
  assert.match(js,/cart-seq/);
});

test('v15 edit flow supports single and multi quantity options without the old handler',()=>{
  const js=read('pages/order/page-hotfix-v15.js');
  assert.match(js,/selectedQty/);
  assert.match(js,/edit-option-request/);
  assert.match(js,/edit-drink-request/);
  assert.match(js,/stopImmediatePropagation/);
  assert.match(js,/套用到 \$\{selectedQty\} 份/);
});

test('clear cart uses one confirmation only',()=>{
  const js=read('pages/order/page-hotfix-v15.js');
  assert.match(js,/清空後不可恢復，確定清空整張購物車/);
  assert.doesNotMatch(js,/第一次確認|第二次確認|clear-step-2/);
});

test('product metadata remains visible when images fail',()=>{
  const css=read('pages/order/page-hotfix-v15.css');
  const js=read('pages/order/page-hotfix-v15.js');
  assert.match(css,/\.product \.meta/);
  assert.match(js,/ensureProductMeta/);
  assert.match(js,/hotfixFallback/);
});

test('order index loads cache-busted v15 hotfix after v14 runtime',()=>{
  const html=read('pages/order/index.html');
  assert.match(html,/page-v14\.js\?v=15/);
  assert.match(html,/page-hotfix-v15\.js\?v=15/);
  assert.match(html,/page-hotfix-v15\.css\?v=15/);
});
