import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync(new URL('../pages/order/index.html', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../pages/order/page.js', import.meta.url), 'utf8');
const runtime = fs.readFileSync(new URL('../shared/runtime.js', import.meta.url), 'utf8');

test('order runtime does not load post-render drink enhancer', () => {
  assert.equal(index.includes('drink-choice-view.js'), false);
  assert.equal(fs.existsSync(new URL('../pages/order/drink-choice-view.js', import.meta.url)), false);
});

test('drink assignment badges render from assignment state', () => {
  assert.match(page, /drinkAssignmentCounts=new Map\(\)/);
  assert.match(page, /Object\.values\(assignments\)/);
  assert.match(page, /drink-choice-count/);
});

test('modal policy is owned by order core, not an external runtime layer', () => {
  assert.equal(index.includes('modal-policy.js'), false);
  assert.equal(fs.existsSync(new URL('../shared/modal-policy.js', import.meta.url)), false);
  assert.match(page, /function requestDismiss\(\)/);
  assert.match(page, /kind:'modal-exit'/);
  assert.match(page, /confirm-save-exit/);
});

test('order runtime keeps required completion in page state', () => {
  assert.match(page, /modal\.draft\.assignments/);
  assert.match(page, /completion-required-choice/);
});

test('transient UI state bypasses transaction persistence and full normalization', () => {
  assert.match(runtime, /function setTransient\(/);
  assert.match(page, /store\.setTransient\(state=>\(\{\.\.\.state,category:/);
  assert.match(page, /store\.setTransient\(state=>\(\{\.\.\.state,searchQuery:/);
  assert.match(page, /store\.setTransient\(state=>\(\{\.\.\.state,quickDrawerOpen:/);
});

test('order page uses lazy surface rendering', () => {
  assert.match(page, /let layoutChanged=false/);
  assert.match(page, /function publishOverlayState\(\)/);
  assert.equal(page.includes('const cartHtml=cartSurface(state),categoryHtml=categoryBar(state),productsHtml=productGridSurface(state)'), false);
});
