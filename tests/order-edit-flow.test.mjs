import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {updateCartLineQuantity} from '../pages/order/order-domain.js';

const page = await readFile(new URL('../pages/order/page.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../pages/order/page.css', import.meta.url), 'utf8');

test('quick mode uses a direct-add product action', () => {
  assert.match(page, /quick-add-product/);
  assert.match(page, /function quickAddProduct/);
});

test('cart rows expose separate quantity and edit controls', () => {
  assert.match(page, /data-action="cart-qty"/);
  assert.match(page, /data-action="edit-line"/);
  assert.match(page, /function changeCartQuantity/);
});

test('product editor is a compact anchored card with explicit confirmation', () => {
  assert.match(page, /product-settings-card/);
  assert.match(page, /修改產品/);
  assert.match(css, /width:min\(25vw/);
  assert.match(page, /data-action="apply-product"/);
});

test('modal backdrop is inert and cannot dismiss changes', () => {
  assert.match(page, /<div class="modal-scrim"/);
  assert.doesNotMatch(page, /class="modal-scrim" data-action=/);
});

test('cart quantity updates totals, trims drink assignments, and removes zero rows', () => {
  const line={lineId:'l1',productId:'set',qty:2,unitPrice:59,total:118,drinkSlots:2,drinkAssignments:[{id:1},{id:2}]};
  const increased=updateCartLineQuantity([line],'l1',1,{set:1});
  assert.equal(increased[0].qty,3);
  assert.equal(increased[0].total,177);
  assert.equal(increased[0].drinkSlots,3);
  const decreased=updateCartLineQuantity(increased,'l1',-2,{set:1});
  assert.equal(decreased[0].qty,1);
  assert.equal(decreased[0].drinkAssignments.length,1);
  assert.deepEqual(updateCartLineQuantity(decreased,'l1',-1,{set:1}),[]);
});
