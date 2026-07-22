import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

let shell=null;
try{shell=await import('../shared/shell.js')}catch{}
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const pages=await Promise.all(['order','orders','dine','soldout','more'].map(name=>read(`pages/${name}/page.js`)));
const baseCss=await read('shared/page-base.css');
const runtime=await read('shared/runtime.js');
const pageCss=await Promise.all(['order','orders','more'].map(name=>read(`pages/${name}/page.css`)));

test('共用狀態欄永久包含品牌、終端、接單狀態及最近訂單',()=>{
  assert.ok(shell,'尚未建立共用介面骨架');
  const html=shell.renderGlobalStatusBar({terminalId:'SMT-01',operationLabel:'接單中',lastOrder:'P0055'});
  assert.match(html,/global-statusbar/);
  for(const copy of ['磨飯 SMT','SMT-01','接單中','P0055'])assert.match(html,new RegExp(copy));
});

test('共用底欄固定五項、同一套線性圖標及唯一選中項',()=>{
  assert.ok(shell,'尚未建立共用介面骨架');
  const html=shell.renderBottomNav('dine');
  for(const route of ['order','orders','dine','soldout','more'])assert.match(html,new RegExp(`data-route="${route}"`));
  assert.equal((html.match(/<svg/g)||[]).length,5);
  assert.equal((html.match(/class="shell-nav-button active"/g)||[]).length,1);
});

test('五個主要頁面全部使用共用狀態欄及底部導航',()=>{
  pages.forEach((page,index)=>{
    assert.match(page,/shared\/shell\.js/,`第 ${index+1} 頁未引用共用骨架`);
    assert.match(page,/renderGlobalStatusBar/,`第 ${index+1} 頁未使用共用狀態欄`);
    assert.match(page,/renderBottomNav/,`第 ${index+1} 頁未使用共用底欄`);
  });
});

test('五個主要頁面共用同一最近訂單顯示規則',()=>{
  pages.forEach((page,index)=>assert.match(page,/latestOrderDisplayNumber/,`第 ${index+1} 頁未共用最近訂單規則`));
  pages.forEach((page,index)=>assert.match(page,/activeDineOrderIdentities/,`第 ${index+1} 頁未計入活躍堂食流水`));
});

test('底欄高度、選中膠囊、字體及圖標只由共用樣式控制',()=>{
  assert.match(baseCss,/\.bottom-nav\s*\{[^}]*height:\s*76px/s);
  assert.match(baseCss,/\.shell-nav-icon/);
  assert.match(baseCss,/--choice-pill-radius:\s*999px/);
  assert.match(baseCss,/\.shell-nav-button\s*\{[^}]*border-radius:\s*var\(--choice-pill-radius\)/s);
  assert.match(baseCss,/\.shell-nav-button\.active\s*\{[^}]*background:\s*var\(--orange-soft\)[^}]*box-shadow:/s);
  assert.doesNotMatch(baseCss,/\.shell-nav-button\.active::before/);
  pageCss.forEach(css=>assert.doesNotMatch(css,/\.bottom-nav\s*\{[^}]*height:/s));
});

test('分類、頁籤、分段、付款、來源及模式選擇共用膠囊規則',()=>{
  for(const selector of [
    '.category-page',
    '.category-search',
    '.categories',
    '.segmented',
    '.channels',
    '.payments',
    '.option-grid',
    '.option-chips',
    '.source-picker',
    '.tabs',
    '.status-filter',
    '.mode-choice',
    '.issue-quick',
    '.method-grid',
    '.theme'
  ]) assert.ok(baseCss.includes(selector),`${selector} 尚未接入共用膠囊規則`);
  assert.match(baseCss,/border-radius:\s*var\(--choice-pill-radius\)\s*!important/);
  assert.match(baseCss,/\.active\s*\{[^}]*background:\s*var\(--orange-soft\)\s*!important[^}]*box-shadow:/s);
});

test('來源彈窗支援四方向箭嘴並由定位器標記實際方向',()=>{
  assert.match(runtime,/dataset\.arrowSide/);
  for(const side of ['top','right','bottom','left'])assert.match(baseCss,new RegExp(`data-arrow-side="${side}"`));
});
