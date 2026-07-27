import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read=(file)=>fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const cartCss=read('pages/order/cart.css');

test('cart.css owns pending action layout before page.css legacy removal',()=>{
  assert.match(cartCss,/\.pending-area\{[^}]*display:grid/);
  assert.match(cartCss,/grid-template-columns:minmax\(250px,1fr\) auto auto/);
  assert.match(cartCss,/\.pending-area>button\{/);
  assert.match(cartCss,/\.pending-receipt\{[^}]*grid-template-columns:auto auto 1fr/);
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
