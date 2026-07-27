import assert from 'node:assert/strict';
import test from 'node:test';
import {cleanupCartLegacy} from '../scripts/cleanup-order-page-cart-legacy.mjs';

test('removes a fully cart-owned rule',()=>{
  const input='.cart-row{display:grid}.product-card{display:block}';
  const result=cleanupCartLegacy(input);
  assert.equal(result.css,'.product-card{display:block}');
  assert.equal(result.removedSelectors,1);
});

test('rewrites mixed page composition selector without deleting catalog',()=>{
  const input='.cart,\n.catalog{background:#fff}.products{display:grid}';
  const result=cleanupCartLegacy(input);
  assert.match(result.css,/\.catalog\s*\{background:#fff\}/);
  assert.doesNotMatch(result.css,/\.cart,/);
  assert.match(result.css,/\.products\{display:grid\}/);
});

test('keeps drink-card internals even when nested in quick drawer',()=>{
  const input='.quick-drawer-panel .drink-choice-card{width:150px}.drink-choice-card{height:190px}';
  const result=cleanupCartLegacy(input);
  assert.equal(result.css,input);
  assert.equal(result.removedSelectors,0);
});

test('keeps product and pairing authorities untouched',()=>{
  const input='.product-card.large{height:246px}.specified-link-card{width:620px}.pairing-body{overflow:auto}';
  const result=cleanupCartLegacy(input);
  assert.equal(result.css,input);
  assert.equal(result.removedSelectors,0);
});

test('removes pending and cart footer legacy rules',()=>{
  const input='.pending-area{display:grid}.cart footer button{height:48px}.catalog{display:flex}';
  const result=cleanupCartLegacy(input);
  assert.equal(result.css,'.catalog{display:flex}');
  assert.equal(result.removedSelectors,2);
});
