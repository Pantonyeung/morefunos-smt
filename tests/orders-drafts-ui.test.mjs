import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const orderPage=await readFile(new URL('../pages/order/page.js',import.meta.url),'utf8');
const loader=await readFile(new URL('../app-loader.js',import.meta.url),'utf8');
const ordersPage=await readFile(new URL('../pages/orders/page.js',import.meta.url),'utf8');
const checkoutPage=await readFile(new URL('../pages/checkout/page.js',import.meta.url),'utf8');
const shellPage=await readFile(new URL('../shared/shell.js',import.meta.url),'utf8');

test('掛單只開左右面板，再由一般掛單或堂食枱號完成操作',()=>{
  assert.match(orderPage,/DRAFT_STORAGE_KEY/);
  assert.match(orderPage,/createDraftRecord/);
  assert.match(orderPage,/restoreDraftForTerminal/);
  assert.match(orderPage,/open-hold-panel/);
  assert.match(orderPage,/data-action="add-draft"/);
  assert.match(orderPage,/data-action="assign-table"/);
  assert.match(orderPage,/堂食枱位/);
  assert.match(orderPage,/九宮格/);
  assert.doesNotMatch(orderPage,/data-action="save-draft"/);
});

test('取單使用左列表右內容，並固定返回、作廢及取單操作',()=>{
  assert.match(orderPage,/open-drafts/);
  assert.match(orderPage,/select-draft/);
  assert.match(orderPage,/selectedDraftId/);
  assert.match(orderPage,/data-action="void-draft"/);
  assert.match(orderPage,/data-action="restore-draft"/);
  assert.match(orderPage,/請選擇左邊暫存單/);
  assert.match(orderPage,/作廢/);
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
  assert.match(ordersPage,/renderBottomNav\("orders"/);
  assert.match(shellPage,/堂食/);
  assert.doesNotMatch(ordersPage,/現場外賣/);
  assert.match(ordersPage,/磨飯 App/);
  assert.match(ordersPage,/電話／WhatsApp/);
  assert.match(ordersPage,/外賣平台/);
  assert.match(ordersPage,/付款方式/);
  assert.doesNotMatch(ordersPage,/>Web</);
});

test('每件產品保存獨立堂食或外賣選擇',()=>{
  assert.match(orderPage,/service-mode/);
  assert.match(orderPage,/data-action=\"service-mode\"/);
  assert.match(orderPage,/serviceMode:line\.serviceMode/);
});

test('reverse checkout reuse loads the original cart then navigates to the locked ordering page',()=>{
  assert.match(ordersPage,/反結帳並重用/);
  assert.match(ordersPage,/reuse-order/);
  assert.match(ordersPage,/ORDER_STORAGE_KEY/);
  assert.match(ordersPage,/morefun:navigate.*order/);
});
