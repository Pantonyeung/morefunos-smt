import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addCartItem,
  changeCartItemQuantity,
  removeCartItem,
  updateCartItemOptions,
  getCartSummary,
  getRequiredState,
  incrementOrderNumber,
  createLocalOrder
} from '../smt-domain.js';

const product = {
  id: 'f4', code: 'F4', name: '蜜糖雞絲＋鹽酥雞', price: 45,
  availability: 'available', requiredGroups: []
};

const requiredProduct = {
  id: 'b1', code: 'B1', name: '自選便當', price: 48,
  availability: 'available', requiredGroups: ['rice']
};

test('adding the same configured item increments quantity without mutating input', () => {
  const original = [];
  const once = addCartItem(original, product, {});
  const twice = addCartItem(once, product, {});
  assert.equal(original.length, 0);
  assert.equal(twice.length, 1);
  assert.equal(twice[0].qty, 2);
});

test('different option selections create different cart lines', () => {
  const one = addCartItem([], product, {ice: 'less'});
  const two = addCartItem(one, product, {ice: 'normal'});
  assert.equal(two.length, 2);
});

test('sold-out or paused products cannot be added', () => {
  assert.deepEqual(addCartItem([], {...product, availability: 'sold-out'}, {}), []);
  assert.deepEqual(addCartItem([], {...product, availability: 'paused'}, {}), []);
});

test('quantity never falls below one through decrement', () => {
  const cart = [{lineId: 'l1', productId: 'f4', qty: 1, unitPrice: 45, options: {}, optionSignature: '[]', requiredGroups: []}];
  assert.deepEqual(changeCartItemQuantity(cart, 'l1', -1), cart);
});

test('remove deletes only the chosen cart line', () => {
  const cart = [{lineId: 'a', productId: 'f4'}, {lineId: 'b', productId: 'b1'}];
  assert.deepEqual(removeCartItem(cart, 'a'), [{lineId: 'b', productId: 'b1'}]);
});

test('Required state blocks checkout only when required selections are missing', () => {
  const required = getRequiredState(addCartItem([], requiredProduct, {}));
  assert.equal(required.missingCount, 1);
  assert.equal(required.canCheckout, false);
});

test('updating one CartItem completes Required without changing neighbours', () => {
  const cart = [...addCartItem([], requiredProduct, {}), ...addCartItem([], product, {})];
  const target = cart[0].lineId;
  const neighbour = cart[1];
  const next = updateCartItemOptions(cart, target, {rice: '肉燥飯'});
  assert.equal(next[0].options.rice, '肉燥飯');
  assert.equal(next[1], neighbour);
  assert.equal(getRequiredState(next).canCheckout, true);
});

test('cart summary returns item count and subtotal', () => {
  const cart = addCartItem(addCartItem([], product, {}), requiredProduct, {rice: '菜飯'});
  assert.deepEqual(getCartSummary(cart), {itemCount: 2, subtotal: 93});
});

test('order numbers increment instead of remaining fixed', () => {
  assert.equal(incrementOrderNumber('P0056'), 'P0057');
  assert.equal(incrementOrderNumber('P0999'), 'P1000');
});

test('creating an order preserves cart when persistence fails', () => {
  const state = {cart: addCartItem([], product, {}), orders: [], checkout: {source: 'walk-in', paymentMethod: 'cash'}};
  const result = createLocalOrder({state, now: 123, nextOrderNumber: 'P0057', persist: () => { throw new Error('disk full'); }});
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'persist-failed');
  assert.equal(result.nextState.cart.length, 1);
});

test('successful order starts timer and print jobs only after confirmation', () => {
  let saved;
  const state = {cart: addCartItem([], product, {}), orders: [], checkout: {source: 'walk-in', paymentMethod: 'cash'}};
  const result = createLocalOrder({state, now: 123, nextOrderNumber: 'P0057', persist: next => { saved = next; }});
  assert.equal(result.ok, true);
  assert.equal(result.order.timerStartedAt, 123);
  assert.equal(result.order.printJobsCreated, true);
  assert.equal(saved.cart.length, 0);
});
