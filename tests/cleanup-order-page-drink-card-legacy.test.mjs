import assert from 'node:assert/strict';
import test from 'node:test';
import {cleanupDrinkCardLegacy} from '../scripts/cleanup-order-page-drink-card-legacy.mjs';

test('removes a fully Drink Card owned rule',()=>{
  const input='.drink-choice-card{display:grid}.product-card{display:block}';
  const result=cleanupDrinkCardLegacy(input);
  assert.equal(result.css,'.product-card{display:block}');
  assert.equal(result.removedSelectors,1);
});

test('rewrites mixed selectors and preserves non-Drink container rules',()=>{
  const input='.drink-choice-card,\n.catalog{background:#fff}.detail-drinks{display:flex}';
  const result=cleanupDrinkCardLegacy(input);
  assert.match(result.css,/\.catalog\s*\{background:#fff\}/);
  assert.doesNotMatch(result.css,/\.drink-choice-card,/);
  assert.match(result.css,/\.detail-drinks\{display:flex\}/);
});

test('removes contextual Drink Card overrides without deleting drawer container',()=>{
  const input='.quick-drawer-panel .drink-choice-card{width:188px}.quick-drawer-panel{height:248px}';
  const result=cleanupDrinkCardLegacy(input);
  assert.equal(result.css,'.quick-drawer-panel{height:248px}');
  assert.equal(result.removedSelectors,1);
});

test('removes Drink Card variants while keeping Pairing and Product authorities',()=>{
  const input='.drink-card--drawer{height:240px}.drink-card--detail{height:154px}.specified-link-card{width:620px}.product-card.large{height:246px}';
  const result=cleanupDrinkCardLegacy(input);
  assert.doesNotMatch(result.css,/drink-card--/);
  assert.match(result.css,/\.specified-link-card/);
  assert.match(result.css,/\.product-card\.large/);
});

test('already-cleared CSS is stable',()=>{
  const input='.catalog{display:flex}.detail-drinks{display:flex}.specified-link-card{width:620px}';
  const result=cleanupDrinkCardLegacy(input);
  assert.equal(result.css,input);
  assert.equal(result.removedSelectors,0);
});
