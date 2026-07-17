import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  createInitialState,
  reducer,
  loadState,
  saveState,
  createStore
} from '../smt-state.js';

test('opening search does not inject a space into the query', () => {
  const state = reducer(createInitialState(), {type: 'SEARCH_OPEN'});
  assert.equal(state.search.open, true);
  assert.equal(state.search.query, '');
});

test('selecting a payment method is persisted in checkout state', () => {
  const state = reducer(createInitialState(), {type: 'CHECKOUT_PAYMENT_SET', value: 'fps'});
  assert.equal(state.checkout.paymentMethod, 'fps');
});

test('later processing keeps the pending order pending', () => {
  const initial = {
    ...createInitialState(),
    incomingOrders: [{id: 'N1', status: 'pending'}],
    incomingBatch: {visible: true, reminderRequired: false, orderIds: ['N1']}
  };
  const state = reducer(initial, {type: 'INCOMING_LATER', orderIds: ['N1']});
  assert.equal(state.incomingOrders[0].status, 'pending');
  assert.equal(state.incomingBatch.visible, false);
  assert.equal(state.incomingBatch.reminderRequired, true);
});

test('new incoming batch groups all new pending orders', () => {
  const state = reducer(createInitialState(), {
    type: 'INCOMING_BATCH_RECEIVED',
    orders: [{id: 'N1', status: 'pending'}, {id: 'N2', status: 'pending'}]
  });
  assert.equal(state.incomingBatch.visible, true);
  assert.deepEqual(state.incomingBatch.orderIds, ['N1', 'N2']);
  assert.equal(state.incomingOrders.length, 2);
});

test('legacy unversioned localStorage state migrates safely', () => {
  const storage = {
    getItem(key) {
      return key === 'morefun-smt-state' ? JSON.stringify({page: 'orders', query: 'F4', quickMode: true}) : null;
    },
    setItem() {}
  };
  const state = loadState(storage);
  assert.equal(state.schemaVersion, 2);
  assert.equal(state.page, 'orders');
  assert.equal(state.search.query, 'F4');
  assert.equal(state.quickMode, true);
});

test('saveState removes transient overlays and stores schema v2', () => {
  let saved;
  const storage = {setItem(key, value) { saved = {key, value}; }};
  saveState(storage, {...createInitialState(), overlay: {type: 'checkout'}, toast: {message: '完成'}});
  const parsed = JSON.parse(saved.value);
  assert.equal(saved.key, STORAGE_KEY);
  assert.equal(parsed.schemaVersion, 2);
  assert.equal(parsed.overlay, null);
  assert.equal(parsed.toast, null);
});

test('store dispatch notifies subscribers and persists the new state', () => {
  const data = new Map();
  const storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value)
  };
  const store = createStore({storage, now: () => 123});
  let observed;
  store.subscribe((state, action) => { observed = {state, action}; });
  store.dispatch({type: 'PAGE_SET', page: 'orders'});
  assert.equal(store.getState().page, 'orders');
  assert.equal(observed.action.at, 123);
  assert.ok(data.has(STORAGE_KEY));
});


test('legacy demo cart rows without the v2 line schema are not loaded as broken items', () => {
  const storage = {
    getItem(key) {
      return key === 'morefun-smt-state' ? JSON.stringify({cart:[{line:'old',productId:'f4',qty:1}]}) : null;
    },
    setItem() {}
  };
  assert.deepEqual(loadState(storage).cart, []);
});
