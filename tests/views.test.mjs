import test from 'node:test';
import assert from 'node:assert/strict';
import {createInitialState} from '../smt-state.js';
import {renderApp} from '../smt-views.js';
import {products, categories} from '../smt-data.js';

test('SMT shell renders fixed Traditional Chinese navigation with labelled SVG icons', () => {
  const html = renderApp(createInitialState(), {products, categories});
  for (const label of ['點單', '訂單', '堂食', '售罄', '更多']) {
    assert.match(html, new RegExp(`>${label}<`));
  }
  assert.match(html, /<svg class="icon icon-order"/);
  assert.match(html, /id="workspace"/);
});

test('order page keeps readable product information and image fallback text together', () => {
  const html = renderApp(createInitialState(), {products, categories});
  assert.match(html, /F4/);
  assert.match(html, /蜜糖雞絲/);
  assert.match(html, /\$45/);
  assert.match(html, /data-image-fallback="餐點圖片暫未提供"/);
  assert.match(html, /先由右邊選擇餐點/);
});

test('Required cart state changes primary action copy', () => {
  const state = {
    ...createInitialState(),
    cart: [{
      lineId: 'line-1', productId: 'b1', code: 'B1', name: '自選便當',
      qty: 1, unitPrice: 48, options: {}, optionSignature: '[]', requiredGroups: ['rice']
    }]
  };
  const html = renderApp(state, {products, categories});
  assert.match(html, /先整理/);
  assert.match(html, /尚欠 1 項/);
});

test('checkout shows a textual checked state for selected payment method', () => {
  const state = {
    ...createInitialState(),
    cart: [{lineId:'line-1', productId:'f4', code:'F4', name:'蜜糖雞絲＋鹽酥雞', qty:1, unitPrice:45, options:{}, optionSignature:'[]', requiredGroups:[]}],
    checkout: {...createInitialState().checkout, paymentMethod: 'cash'},
    overlay: {type: 'checkout'}
  };
  const html = renderApp(state, {products, categories});
  assert.match(html, /付款方式/);
  assert.match(html, /現金/);
  assert.match(html, /已選擇/);
  assert.match(html, /確認落單/);
});

test('incoming batch modal exposes exactly the two required primary choices', () => {
  const state = {
    ...createInitialState(),
    incomingOrders: [{id:'N1', source:'App', amount:62, status:'pending'}],
    incomingBatch: {visible:true, reminderRequired:false, orderIds:['N1']}
  };
  const html = renderApp(state, {products, categories});
  assert.match(html, /稍後處理/);
  assert.match(html, /查看及處理/);
});


test('cart summaries show human Traditional Chinese labels instead of internal option ids', () => {
  const state = {
    ...createInitialState(),
    cart: [{lineId:'line-1', productId:'b1', code:'B1', name:'自選便當', qty:1, unitPrice:48, options:{rice:'braised', riceLabel:'肉燥飯'}, optionSignature:'[]', requiredGroups:['rice']}]
  };
  const html = renderApp(state, {products, categories});
  assert.match(html, /肉燥飯/);
  assert.doesNotMatch(html, />braised</);
  assert.doesNotMatch(html, /braised ·/);
});

test('checkout exposes source, mode, packaging, discount and payment in natural order', () => {
  const initial = createInitialState();
  const state = {
    ...initial,
    cart: [{lineId:'line-1', productId:'f4', code:'F4', name:'蜜糖雞絲＋鹽酥雞', qty:1, unitPrice:45, options:{}, optionSignature:'[]', requiredGroups:[]}],
    overlay:{type:'checkout'}
  };
  const html = renderApp(state, {products, categories});
  const labels = ['訂單來源','用餐方式','包裝','優惠','付款方式'];
  let previous = -1;
  for (const label of labels) {
    const index = html.indexOf(label);
    assert.ok(index > previous, `${label} must follow the prior decision`);
    previous = index;
  }
  assert.match(html, /data-action="checkout-field-select"/);
});
