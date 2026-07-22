import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const bridge=read('shared/page-bridge.js');
const baseCss=read('shared/page-base.css');
const orderPage=read('pages/order/page.js');
const checkoutPage=read('pages/checkout/page.js');
const ordersPage=read('pages/orders/page.js');

test('共用頁面橋接會從正式設定套用主題及聲音狀態',()=>{
  assert.match(bridge,/morefun:smt:v16c:settings/);
  assert.match(bridge,/dataset\.theme/);
  assert.match(bridge,/dataset\.sounds/);
  for(const theme of ['warm','tea','sprout','purple','sunset','mist'])assert.match(baseCss,new RegExp(`data-theme=["']${theme}["']`));
});

test('點單頁重載會讀取更多頁保存的快速模式及產品圖片設定',()=>{
  assert.match(orderPage,/saved\?\.quickMode\?\?savedSettings\.morePage\?\.quickMode/);
  assert.match(orderPage,/settings\.catalog\.showImages!==false/);
  assert.match(orderPage,/store\.get\(\)\.settings\.catalog\.showImages/);
});

test('正式結帳會建立中央打印工作而不把排隊當成實體成功',()=>{
  assert.match(checkoutPage,/PRINTER_STORAGE_KEY/);
  assert.match(checkoutPage,/createPrintJobs/);
  assert.match(checkoutPage,/waiting_bridge|待實體橋接/);
  assert.match(checkoutPage,/writeJSON\(PRINTER_STORAGE_KEY/);
});

test('訂單重印會即時匯入中央打印工作佇列',()=>{
  assert.match(ordersPage,/PRINTER_STORAGE_KEY/);
  assert.match(ordersPage,/importExternalPrintJobs/);
  assert.match(ordersPage,/writeJSON\(PRINTER_STORAGE_KEY/);
});

test('堂食正式落單後會把堂食打印工作匯入中央佇列',()=>{
  assert.match(orderPage,/syncDinePrintJobs/);
  assert.match(orderPage,/importExternalPrintJobs/);
  assert.match(orderPage,/PRINTER_STORAGE_KEY/);
});
