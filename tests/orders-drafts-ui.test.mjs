import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const orderPage=await readFile(new URL('../pages/order/page.js',import.meta.url),'utf8');
const loader=await readFile(new URL('../app-loader.js',import.meta.url),'utf8');
const ordersPage=await readFile(new URL('../pages/orders/page.js',import.meta.url),'utf8');
const checkoutPage=await readFile(new URL('../pages/checkout/page.js',import.meta.url),'utf8');

test('order page saves numbered drafts and restores them through a take-order card',()=>{
  assert.match(orderPage,/DRAFT_STORAGE_KEY/);
  assert.match(orderPage,/createDraftRecord/);
  assert.match(orderPage,/restoreDraftForTerminal/);
  assert.match(orderPage,/save-draft/);
  assert.match(orderPage,/open-drafts/);
  assert.match(orderPage,/data-action="restore-draft"/);
  assert.match(orderPage,/draftNumber/);
});

test('checkout persists the completing terminal and order audit',()=>{
  assert.match(checkoutPage,/ORDER_HISTORY_STORAGE_KEY/);
  assert.match(checkoutPage,/TERMINAL_ID_STORAGE_KEY/);
  assert.match(checkoutPage,/buildCheckoutRecord/);
  assert.match(checkoutPage,/checkedOutByTerminalId/);
});

test('bottom navigation opens the independent orders page',()=>{
  assert.match(loader,/orders:'pages\/orders\/index\.html'/);
  assert.match(orderPage,/morefun:navigate.*orders/);
});

test('orders page uses the three approved channel columns and payment methods',()=>{
  assert.match(ordersPage,/現場/);
  assert.match(ordersPage,/堂食/);
  assert.match(ordersPage,/現場外賣/);
  assert.match(ordersPage,/磨飯 App/);
  assert.match(ordersPage,/電話／WhatsApp/);
  assert.match(ordersPage,/外賣平台/);
  assert.match(ordersPage,/付款方式/);
  assert.doesNotMatch(ordersPage,/>Web</);
});

test('reverse checkout reuse loads the original cart then navigates to the locked ordering page',()=>{
  assert.match(ordersPage,/反結帳並重用/);
  assert.match(ordersPage,/reuse-order/);
  assert.match(ordersPage,/ORDER_STORAGE_KEY/);
  assert.match(ordersPage,/morefun:navigate.*order/);
});
