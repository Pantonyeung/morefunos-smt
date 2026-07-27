import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read=(file)=>fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const cartCss=read('pages/order/cart.css');
const orderHtml=read('pages/order/index.html');

test('cart.css owns pending action layout before page.css legacy removal',()=>{
  assert.match(cartCss,/\.pending-area\{[^}]*display:grid/);
  assert.match(cartCss,/grid-template-columns:minmax\(250px,1fr\) auto auto/);
  assert.match(cartCss,/\.pending-area>button\{/);
  assert.match(cartCss,/\.pending-receipt\{[^}]*grid-template-columns:auto auto 1fr/);
});

test('cart.css owns cart shell internals before page.css legacy removal',()=>{
  assert.match(cartCss,/\.cart>header\{/);
  assert.match(cartCss,/\.cart-list\{[^}]*overflow-y:auto/);
  assert.match(cartCss,/\.cart-category>header\{[^}]*position:sticky/);
  assert.match(cartCss,/\.seq\{/);
});

test('cart.css owns quick drawer container geometry but not drink-card internals',()=>{
  assert.match(cartCss,/\.quick-drawer\{[^}]*position:absolute/);
  assert.match(cartCss,/\.quick-drawer-handle\{/);
  assert.match(cartCss,/\.quick-drawer-panel\{[^}]*height:248px/);
  assert.match(cartCss,/\.quick-drawer-panel>header\{/);
  assert.doesNotMatch(cartCss,/\.drink-choice-card\{/);
  assert.doesNotMatch(cartCss,/\.drink-choice-img\{/);
  assert.doesNotMatch(cartCss,/\.drink-choice-count\{/);
});

test('order page uses the current versioned cart authority asset',()=>{
  assert.match(orderHtml,/cart\.css\?v=order-cart-core-v16/);
});
