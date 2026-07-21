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
