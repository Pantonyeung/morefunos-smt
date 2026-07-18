import test from 'node:test';
import assert from 'node:assert/strict';
import {copy, flattenCopy} from '../smt-copy.js';
import {icon} from '../smt-icons.js';

const simplifiedOnly = /[这为后发与个门无从开关东车云应并]/;

test('all visible copy is non-empty Traditional Chinese', () => {
  const values = flattenCopy(copy);
  assert.ok(values.length > 30);
  for (const value of values) {
    assert.equal(typeof value, 'string');
    assert.ok(value.trim().length > 0);
    assert.doesNotMatch(value, simplifiedOnly);
  }
});

test('core actions use explicit Traditional Chinese verbs', () => {
  assert.equal(copy.actions.add, '加入');
  assert.equal(copy.actions.checkout, '結帳');
  assert.equal(copy.actions.confirmOrder, '確認落單');
  assert.equal(copy.actions.later, '稍後處理');
});

test('icons are SVG and expose accessible labels when requested', () => {
  const labelled = icon('order', {labelled: true, label: '點單'});
  assert.match(labelled, /^<svg/);
  assert.match(labelled, /role="img"/);
  assert.match(labelled, /aria-label="點單"/);
  assert.doesNotMatch(labelled, /[▣▤♨⊠♧⌁◷▦◉]/);
});
