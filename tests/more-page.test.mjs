import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>{try{return fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');}catch{return '';}};
const page=read('pages/more/page.js');
const css=read('pages/more/page.css');
const html=read('pages/more/index.html');
const loader=read('app-loader.js');

test('更多頁已接入正式路由及五項底部導航',()=>{
  assert.match(loader,/more:\s*'pages\/more\/index\.html'/);
  for(const path of ['pages/order/page.js','pages/orders/page.js','pages/dine/page.js','pages/soldout/page.js']){
    assert.match(read(path),/navigate-more/,path+' 缺少更多頁導航');
  }
  for(const route of ['order','orders','dine','soldout'])assert.match(page,new RegExp('data-value="'+route+'"'));
});

test('更多主畫面有營業日及六個帶營運狀態的入口',()=>{
  for(const label of ['收銀與日結','報表與分析','打印與設備','備份與恢復','顯示與操作','系統與更新'])assert.match(page,new RegExp(label));
  for(const status of ['今日未日結','淨銷售','設備狀態','最近完整備份','一般模式','同步狀態'])assert.match(page,new RegExp(status));
  assert.match(page,/05:00–翌日04:59/);
  assert.match(css,/\.more-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
});

test('六個入口均有可讀細節面板而非只顯示簡單訊息',()=>{
  for(const id of ['dayclose','reports','printers','backup','display','system'])assert.match(page,new RegExp("id:'"+id+"'"));
  for(const copy of ['付款待核實','渠道銷售','T271U #1','保留策略','六套品牌主題','上一有效版本'])assert.match(page,new RegExp(copy));
  assert.match(page,/detail-dialog/);
  assert.match(css,/\.detail-dialog/);
});

test('日結、恢復、更新及退出全螢幕均先開二次確認',()=>{
  for(const type of ['dayclose','restore','update','exit'])assert.match(page,new RegExp('(?:^|[,{\\s])'+type+':'));
  for(const copy of ['確認正式日結','進入安全恢復','準備下載及更新','退出全螢幕模式'])assert.match(page,new RegExp(copy));
  assert.match(page,/open-confirm/);
  assert.match(page,/confirm-action/);
  assert.match(page,/不設密碼/);
  assert.doesNotMatch(page,/type="password"|passcode/i);
});

test('未接通硬件及資料能力不會假裝執行成功',()=>{
  for(const copy of ['硬件尚未接通','真實備份接口尚未接通','更新服務尚未接通','匯出接口尚未接通'])assert.match(page,new RegExp(copy));
  assert.doesNotMatch(page,/備份已成功|更新已完成|已完成日結/);
});

test('顯示設定可本機保存，彈窗遮罩不可點空白關閉',()=>{
  assert.match(page,/SETTINGS_STORAGE_KEY/);
  assert.match(page,/writeJSON\(SETTINGS_STORAGE_KEY/);
  assert.match(page,/toggle-setting/);
  assert.match(page,/choose-theme/);
  assert.match(page,/class="dialog-scrim"[^>]*aria-hidden="true"/);
  assert.doesNotMatch(page,/dialog-scrim" data-action="close/);
});

test('更多頁沿用共用基礎樣式並固定頂底欄',()=>{
  assert.match(html,/shared\/page-base\.css/);
  assert.match(html,/page-bridge\.js/);
  assert.match(css,/\.more-workspace\s*\{[^}]*min-height:\s*0/s);
  assert.match(css,/\.detail-dialog\s*\{[^}]*max-height:/s);
  assert.match(css,/\.dialog-body\s*\{[^}]*overflow-y:\s*auto/s);
});
