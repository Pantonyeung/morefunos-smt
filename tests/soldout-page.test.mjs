import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page=fs.readFileSync(new URL('../pages/soldout/page.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../pages/soldout/page.css',import.meta.url),'utf8');
const enhancements=fs.readFileSync(new URL('../pages/soldout/soldout-enhancements.css',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');

test('售罄頁沿用產品分類與三種點單卡模板',()=>{
  assert.match(page,/style==='text'/);
  assert.match(page,/style==='small'/);
  assert.match(page,/const classes='product-card '\+style/);
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

test('正常模式產品詳情提供四個供應狀態操作',()=>{
  assert.match(page,/產品內容、價格及選項不能在此修改/);
  assert.match(page,/open-product/);
  assert.match(page,/set-single-status/);
  for(const label of ['今日售罄','暫停供應','恢復供應','返回'])assert.match(page,new RegExp(label));
});

test('批量模式點擊整張產品卡即可加入或取消',()=>{
  assert.match(page,/action=batch\?'toggle-select':'open-product'/);
  assert.doesNotMatch(page,/class="select-switch/);
  assert.match(page,/selected\.has\(b\.dataset\.id\)\?selected\.delete/);
});

test('目前分類支援一次性多選、全選及全不選並保留跨分類選取',()=>{
  assert.match(page,/一次性多選/);
  assert.match(page,/select-category-all/);
  assert.match(page,/visibleProducts\(\)\.forEach\(p=>selected\.add/);
  assert.match(page,/select-category-none/);
  assert.match(page,/visibleProducts\(\)\.forEach\(p=>selected\.delete/);
});

test('提供紫米快捷操作、售罄獨立分類及清晰狀態卡',()=>{
  assert.match(page,/紫米售罄/);
  assert.match(page,/紫米恢復/);
  assert.match(page,/data-value="售罄"/);
  assert.match(page,/status==='soldout'\?'soldout':status==='paused'\?'paused'/);
  assert.doesNotMatch(enhancements,/grayscale\(/);
  assert.match(enhancements,/\.supply-product\.soldout/);
  assert.match(enhancements,/\.supply-product\.paused/);
});

test('售罄頁可獨立切換大圖小圖及純文字卡',()=>{
  assert.match(page,/card-mode/);
  for(const label of ['大圖','小圖','純文字'])assert.match(page,new RegExp(label));
});

test('應用程式路由已接入售罄頁',()=>assert.match(loader,/soldout:'pages\/soldout\/index\.html'/));

test('售罄頁使用正確餐牌後備參數，網絡失敗亦保留可操作頁面',()=>{
  assert.match(page,/loadMenuCatalog\(\{fallback:fallbackCatalog\}\)/);
  assert.match(page,/\.catch\(/);
});

test('售罄產品移出原分類並集中到售罄分類，停售仍留原分類',()=>{
  assert.match(page,/category==='售罄'\?statusOf\(p\.id\)==='soldout'/);
  assert.match(page,/statusOf\(p\.id\)!=='soldout'&&p\.category===category/);
});

test('小圖與純文字卡解除父層點單格線，內容不會被壓成直排',()=>{
  assert.match(enhancements,/\.supply-product\.small\s*\{[^}]*display:\s*block/);
  assert.match(enhancements,/\.supply-product\.text\s*\{[^}]*display:\s*block/);
  assert.match(enhancements,/\.supply-product\.small \.card-open\s*\{[^}]*grid-template-columns:\s*72px minmax\(0,1fr\) auto/);
});
