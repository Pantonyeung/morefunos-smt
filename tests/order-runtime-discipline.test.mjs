import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync(new URL('../pages/order/index.html', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../pages/order/page.js', import.meta.url), 'utf8');
const modalPolicy = fs.readFileSync(new URL('../shared/modal-policy.js', import.meta.url), 'utf8');

test('order runtime does not load post-render drink enhancer', () => {
  assert.equal(index.includes('drink-choice-view.js'), false);
  assert.equal(fs.existsSync(new URL('../pages/order/drink-choice-view.js', import.meta.url)), false);
});

test('drink assignment badges render from assignment state', () => {
  assert.match(page, /drinkAssignmentCounts=new Map\(\)/);
  assert.match(page, /Object\.values\(assignments\)/);
  assert.match(page, /drink-choice-count/);
});

test('modal policy does not observe the whole document tree', () => {
  assert.equal(modalPolicy.includes('MutationObserver'), false);
});

test('order runtime keeps required completion in page state', () => {
  assert.match(page, /modal\.draft\.assignments/);
  assert.match(page, /completion-required-choice/);
});
