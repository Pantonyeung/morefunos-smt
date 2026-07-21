import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const page=await readFile(new URL('../pages/checkout/page.js',import.meta.url),'utf8');
const css=await readFile(new URL('../pages/checkout/page.css',import.meta.url),'utf8');

test('結帳頂部只顯示狀態資料，不保留假快捷金額按鈕',()=>{
  assert.doesNotMatch(page,/快捷金額/);
  assert.match(page,/statusbar/);
  assert.match(page,/操作終端/);
});

test('結帳頁保留數字鍵盤而不顯示底部主導航',()=>{
  assert.match(page,/keypad/);
  assert.match(page,/data-action="keypad"/);
  assert.doesNotMatch(page,/bottom-nav|nav-item/);
  assert.match(css,/\.keypad/);
});

test('詳情操作固定提供返回訂單及優惠兩欄',()=>{
  assert.match(page,/detail-actions/);
  assert.match(page,/返回訂單/);
  assert.match(page,/data-action="discount-open"/);
  assert.match(page,/優惠/);
});

test('付款區及現金鍵盤由渠道政策動態控制而非所有渠道全部顯示',()=>{
  assert.match(page,/getChannelPolicy/);
  assert.match(page,/policy\.requiresPaymentMethod/);
  assert.match(page,/payment==='現金付款'/);
  assert.match(page,/cashPayment/);
  assert.match(page,/channel-fields/);
});

test('結帳完成保留核對卡並提供有原因的更正資料入口',()=>{
  assert.match(page,/完成核對/);
  assert.match(page,/更正資料/);
  assert.match(page,/correctionReason/);
  assert.match(page,/checkout_data_corrected/);
  assert.doesNotMatch(page,/setTimeout\(\(\)=>parent\.postMessage/);
});

test('非現場渠道有對應的備註、取餐碼、核對碼或平台單號欄位',()=>{
  assert.match(page,/pickupCode/);
  assert.match(page,/verificationCode/);
  assert.match(page,/platformOrderId/);
  assert.match(page,/note/);
});
