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
  assert.match(page,/payment\s*===\s*["']現金["']/);
  assert.match(page,/cashControls/);
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

test('快捷金額固定在大鍵盤上方，現場轉換付款方式亦不收起鍵盤',()=>{
  assert.match(page,/cash-controls/);
  assert.match(page,/quick-amounts/);
  assert.match(page,/policy\.group\s*===\s*["']onsite["']/);
  assert.doesNotMatch(page,/cash\?cashPayment/);
  assert.match(css,/\.cash-controls/);
  assert.match(css,/\.quick-amounts/);
});

test('已收框是唯一金額輸入顯示並在輸入狀態發光',()=>{
  assert.match(page,/received-summary/);
  assert.match(page,/data-action="keypad-target" data-value="received"/);
  assert.doesNotMatch(page,/請輸入金額/);
  assert.doesNotMatch(page,/received-row/);
  assert.match(css,/received-summary\.active/);
  assert.match(css,/box-shadow/);
});

test('渠道及付款方式引用大圖標 WebP 資源並採用上圖下字',()=>{
  assert.match(page,/assets\/checkout-icons/);
  assert.match(page,/channel-onsite\.webp/);
  assert.match(page,/payment-cash\.webp/);
  assert.match(page,/<img class="option-icon"/);
  assert.match(css,/flex-direction:\s*column/);
  assert.match(css,/width:\s*36px/);
});

test('數字鍵盤使用四行放大按鍵',()=>{
  assert.match(css,/repeat\(4,minmax\(92px,1fr\)\)/);
  assert.match(css,/min-height:92px/);
});

test('零元時確認按鈕停用並顯示清楚原因',()=>{
  assert.match(page,/result\.payable\s*<=\s*0/);
  assert.match(page,/訂單金額必須大於零/);
  assert.match(page,/data-action="confirm"[^>]*disabled/);
});

test('任何渠道的確認結帳操作永遠固定在付款欄最底',()=>{
  assert.match(page,/checkout-action-zone/);
  assert.match(page,/checkout-context/);
  assert.match(css,/\.checkout-action-zone\s*\{[^}]*margin-top:\s*auto/s);
  assert.match(css,/\.checkout-action-zone\s+\.confirm\s*\{[^}]*width:\s*100%/s);
});
