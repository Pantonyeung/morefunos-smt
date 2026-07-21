import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page=fs.readFileSync(new URL('../pages/soldout/page.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../pages/soldout/page.css',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');

test('售罄頁沿用產品分類與三種點單卡模板',()=>{
  assert.match(page,/style==='text'/);
  assert.match(page,/style==='small'/);
  assert.match(page,/product-card large/);
  assert.match(page,/products-'\+style/);
  assert.match(page,/data-action="category"/);
});

test('右欄提供分類售罄列表、收起與圖片顯示切換',()=>{
  assert.match(page,/售罄列表/);
  assert.match(page,/toggle-section/);
  assert.match(page,/toggle-panel/);
  assert.match(page,/toggle-list-images/);
  assert.match(css,/--side-width/);
});

test('批量模式使用待確認欄及四個固定操作',()=>{
  assert.match(page,/待確認/);
  for(const label of ['今日售罄','暫停供應','恢復供應','返回'])assert.match(page,new RegExp(label));
  assert.match(page,/apply-bulk/);
});

test('產品詳情只讀而選擇開關獨立',()=>{
  assert.match(page,/只供參考，不能修改/);
  assert.match(page,/open-product/);
  assert.match(page,/toggle-select/);
});

test('應用程式路由已接入售罄頁',()=>assert.match(loader,/soldout:'pages\/soldout\/index\.html'/));
