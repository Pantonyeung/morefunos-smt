import assert from 'node:assert/strict';
import test from 'node:test';
import {cleanupProductCardLegacy} from '../scripts/cleanup-order-page-product-card-legacy.mjs';

test('removes Product Card internals while preserving product-list geometry',()=>{
  const input='.product-card{display:grid}.products-large{grid-template-columns:repeat(4,1fr)}';
  const result=cleanupProductCardLegacy(input);
  assert.equal(result.css,'.products-large{grid-template-columns:repeat(4,1fr)}');
  assert.equal(result.removedSelectors,1);
});

test('removes supply-state Product Card rules without deleting status-list rules',()=>{
  const input='.product-card.sold-out{border:2px solid orange}.product-supply-state{display:block}.status-list>div.soldout{border-color:orange}';
  const result=cleanupProductCardLegacy(input);
  assert.doesNotMatch(result.css,/product-card|product-supply-state/);
  assert.match(result.css,/\.status-list>div\.soldout/);
  assert.equal(result.removedSelectors,2);
});

test('removes contextual Product Card internals and keeps unrelated modal authority',()=>{
  const input='.product-card.large .product-info{height:96px}.product-thumb{width:82px}.specified-link-card{width:620px}.detail-drinks{display:flex}';
  const result=cleanupProductCardLegacy(input);
  assert.doesNotMatch(result.css,/product-info|product-thumb/);
  assert.match(result.css,/\.specified-link-card/);
  assert.match(result.css,/\.detail-drinks/);
});

test('rewrites mixed selectors without removing products container',()=>{
  const input='.product-card,\n.products{min-height:0}.catalog{display:flex}';
  const result=cleanupProductCardLegacy(input);
  assert.match(result.css,/\.products\s*\{min-height:0\}/);
  assert.doesNotMatch(result.css,/\.product-card,/);
  assert.match(result.css,/\.catalog\{display:flex\}/);
});

test('already-cleared Product Card CSS is stable',()=>{
  const input='.products{display:grid}.products-large{grid-auto-rows:max-content}.catalog{display:flex}.specified-link-card{width:620px}.detail-drinks{display:flex}';
  const result=cleanupProductCardLegacy(input);
  assert.equal(result.css,input);
  assert.equal(result.removedSelectors,0);
});
