import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read=(file)=>fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
const productCss=read('pages/order/product-card.css');
const orderHtml=read('pages/order/index.html');

test('product-card.css owns the base card shell and typography',()=>{
  assert.match(productCss,/\.product-card\{[^}]*border:1px solid #e5ddd5[^}]*border-radius:13px[^}]*box-shadow:var\(--lift\)/);
  assert.match(productCss,/\.product-info\{[^}]*grid-template-columns:minmax\(0,1fr\) auto/);
  assert.match(productCss,/\.product-copy\{[^}]*display:grid/);
  assert.match(productCss,/\.product-card strong\{[^}]*line-height:1\.22/);
  assert.match(productCss,/\.product-price\{[^}]*white-space:nowrap/);
  assert.match(productCss,/\.product-description\{[^}]*-webkit-line-clamp:1/);
  assert.match(productCss,/\.product-code\{[^}]*font-weight:900/);
});

test('product-card.css owns no-image and supply states',()=>{
  assert.match(productCss,/\.product-card\.large\.no-product-image\{/);
  assert.match(productCss,/\.product-card\.small\.no-product-image\{/);
  assert.match(productCss,/\.product-card\.sold-out\{/);
  assert.match(productCss,/\.product-card\.paused\{/);
  assert.match(productCss,/\.product-supply-state\{/);
});

test('product-card.css keeps adaptive row tokens as the only size source',()=>{
  assert.match(productCss,/height:var\(--adaptive-product-row-large\)/);
  assert.match(productCss,/height:var\(--adaptive-product-row-small\)/);
  assert.match(productCss,/height:var\(--adaptive-product-row-text\)/);
  assert.doesNotMatch(productCss,/\.product-card\.large\{[^}]*height:246px/);
});

test('order page loads the current Product Card authority asset',()=>{
  assert.match(orderHtml,/product-card\.css\?v=product-card-owner-v2/);
});
