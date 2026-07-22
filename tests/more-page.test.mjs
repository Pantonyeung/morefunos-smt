import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>{try{return fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');}catch{return '';}};
const page=read('pages/more/page.js');
const css=read('pages/more/page.css');
const html=read('pages/more/index.html');
const loader=read('app-loader.js');
const printDomain=read('pages/more/print-domain.js');

test('更多頁已接入正式路由及五項底部導航',()=>{
  assert.match(loader,/more:\s*'pages\/more\/index\.html'/);
  for(const path of ['pages/order/page.js','pages/orders/page.js','pages/dine/page.js','pages/soldout/page.js']){
    assert.match(read(path),/navigate-more/,path+' 缺少更多頁導航');
  }
  assert.match(page,/renderBottomNav\('more'/);
  for(const route of ['order','orders','dine','soldout','more'])assert.match(read('shared/shell.js'),new RegExp("\\['"+route+"'"));
});

test('更多主畫面有營業日及六個帶營運狀態的入口',()=>{
  for(const label of ['收銀與日結','報表與分析','打印與設備','備份與恢復','顯示與操作','系統與更新'])assert.match(page,new RegExp(label));
  for(const status of ['今日未日結','淨銷售','已設定','最近備份已驗證','一般模式','待同步'])assert.match(page,new RegExp(status));
  assert.match(page,/05:00–翌日04:59/);
  assert.match(css,/\.more-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
});

test('更多首頁直接顯示今日營業、渠道及付款分析而毋須進入第二層',()=>{
  assert.match(page,/function analysisSnapshot/);
  assert.match(page,/more-analysis/);
  for(const copy of ['今日營業','渠道分拆','付款分拆'])assert.match(page,new RegExp(copy));
  assert.match(css,/\.more-analysis/);
});

test('六個入口均有可讀細節面板而非只顯示簡單訊息',()=>{
  for(const id of ['dayclose','reports','printers','backup','display','system'])assert.match(page,new RegExp("id:'"+id+"'"));
  for(const copy of ['付款待核實','渠道分析','五部設備','保留策略','六套品牌主題','更新來源'])assert.match(page,new RegExp(copy));
  assert.match(printDomain,/T271U/);
  assert.match(page,/detail-dialog/);
  assert.match(css,/\.detail-dialog/);
});

test('日結、恢復、更新及退出全螢幕均先開二次確認',()=>{
  for(const type of ['dayclose','restore','update','exit'])assert.match(page,new RegExp('(?:^|[,{\\s])'+type+':'));
  for(const copy of ['確認正式日結','確認安全恢復','保存更新檢查','退出全螢幕模式'])assert.match(page,new RegExp(copy));
  assert.match(page,/open-confirm/);
  assert.match(page,/confirm-action/);
  assert.match(page,/不設密碼/);
  assert.doesNotMatch(page,/type="password"|passcode/i);
});

test('六個入口已由死按鈕改成真實本機操作',()=>{
  assert.doesNotMatch(page,/data-action="unavailable"/);
  for(const oldCopy of ['真實備份接口尚未接通','匯出接口尚未接通','操作紀錄資料層尚未接通'])assert.doesNotMatch(page,new RegExp(oldCopy));
  for(const action of ['save-dayclose-draft','export-report','create-backup','save-display','download-diagnostic','check-update'])assert.match(page,new RegExp(`data-action="${action}"`));
  assert.doesNotMatch(page,/備份已成功|更新已完成|已實體打印/);
});

test('顯示設定可本機保存，彈窗遮罩不可點空白關閉',()=>{
  assert.match(page,/SETTINGS_STORAGE_KEY/);
  assert.match(page,/writeJSON\(SETTINGS_STORAGE_KEY/);
  assert.match(page,/toggle-setting/);
  assert.match(page,/choose-theme/);
  assert.match(page,/class="dialog-scrim"[^>]*aria-hidden="true"/);
  assert.doesNotMatch(page,/dialog-scrim" data-action="close/);
});

test('顯示與操作可設定分類每行格數、行數及最後一格搜尋',()=>{
  for(const value of [5,6,7])assert.match(page,new RegExp(`data-action="category-columns" data-value="${value}"`));
  for(const value of [1,2])assert.match(page,new RegExp(`data-action="category-rows" data-value="${value}"`));
  assert.match(page,/data-action="toggle-category-search"/);
  assert.match(page,/categoryLayout/);
  assert.match(page,/writeJSON\(SETTINGS_STORAGE_KEY/);
});

test('更多頁沿用共用基礎樣式並固定頂底欄',()=>{
  assert.match(html,/shared\/page-base\.css/);
  assert.match(html,/page-bridge\.js/);
  assert.match(css,/\.more-workspace\s*\{[^}]*min-height:\s*0/s);
  assert.match(css,/\.detail-dialog\s*\{[^}]*max-height:/s);
  assert.match(css,/\.dialog-body\s*\{[^}]*overflow-y:\s*auto/s);
});

test('收銀日結提供點算、支出、差異原因、版本及正式保存',()=>{
  for(const field of ['cash-counted','expense-amount','expense-category','expense-note','difference-reason'])assert.match(page,new RegExp(`data-field="${field}"`));
  assert.match(page,/createDayClose/);
  assert.match(page,/dayCloses/);
  assert.match(page,/createBackupEnvelope/);
});

test('日結提供面額互推、開工底金、提取留底、待核實反推及超額授權',()=>{
  for(const field of ['opening-float','cash-withdrawn','cash-retained'])assert.match(page,new RegExp(`data-field="${field}"`));
  assert.match(page,/data-denomination=/);
  assert.match(page,/denomination-quantity/);
  assert.match(page,/denomination-amount/);
  assert.match(page,/待核實現金/);
  assert.match(page,/待核實非現金/);
  assert.match(page,/toggle-dayclose-approval/);
  assert.match(css,/\.cash-count-grid/);
});

test('開機底金顯示上次留底、調整額及確認後開工現金',()=>{
  assert.match(page,/buildOpeningCashState/);
  for(const field of ['previous-retained','opening-adjustment','opening-cash'])assert.match(page,new RegExp(`data-field="${field}"`));
  assert.match(page,/data-action="confirm-opening-cash"/);
  assert.match(page,/openingCashAdjustments/);
});

test('營業分析同時展示每個渠道及每種付款方式的單數和金額',()=>{
  assert.match(page,/analyticsReport/);
  assert.match(page,/r\.channels/);
  assert.match(page,/r\.payments/);
  assert.match(page,/單數/);
  assert.match(page,/銷售原額/);
});

test('全局共用樣式提供觸控回饋、彈窗動效及減少動效模式',()=>{
  const base=read('shared/page-base.css');
  assert.match(base,/button:active/);
  assert.match(base,/@keyframes\s+mf-dialog-in/);
  assert.match(base,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(base,/:focus-visible/);
});

test('報表五個分頁讀取同一選定日期報表並可下載 CSV',()=>{
  assert.match(page,/buildOperationalReport/);
  assert.match(page,/buildReportRange/);
  assert.match(page,/buildCsvExport/);
  assert.match(page,/downloadText/);
  for(const tab of ['營業','渠道','付款','商品','異常'])assert.match(page,new RegExp(tab));
});

test('歷史報表提供七種日期入口及自訂開始結束日期',()=>{
  for(const copy of ['今日','昨日','最近 7 日','最近 30 日','最近 3 個月','最近 6 個月','自訂日期'])assert.match(page,new RegExp(copy));
  assert.match(page,/data-action="report-range"/);
  assert.match(page,/data-report-start/);
  assert.match(page,/data-report-end/);
  assert.match(page,/data-action="apply-custom-range"/);
  assert.match(page,/setInterval\(.*businessWindow\(\)\.id/s);
});

test('付款對數逐項顯示單數應收實收退款差額狀態並可下鑽',()=>{
  for(const copy of ['單數','應收','實收','退款','差額','對數狀態'])assert.match(page,new RegExp(copy));
  assert.match(page,/data-action="report-drilldown"/);
  assert.match(page,/reportDrilldown/);
  assert.match(page,/orderDisplayNumber/);
});

test('商品報表可切換產品及分類並保留時段與日結紀錄',()=>{
  assert.match(page,/data-action="report-product-view"/);
  assert.match(page,/產品排行/);
  assert.match(page,/分類排行/);
  assert.match(page,/每小時營業趨勢/);
  assert.match(page,/日結紀錄/);
});

test('打印中心可設定網絡設備、選格式、診斷、預覽、重試及改送',()=>{
  for(const field of ['printer-name','printer-host','printer-port','printer-paper','printer-copies','printer-template'])assert.match(page,new RegExp(field));
  for(const action of ['edit-printer','save-printer','run-printer-diagnostic','queue-test-print','preview-template','open-print-jobs','retry-print-job','reroute-print-job'])assert.match(page,new RegExp(action));
  assert.match(printDomain,/XP-N160II/);
  assert.match(printDomain,/T271U/);
  assert.match(page,/管理端發佈/);
  assert.match(page,/buildAndroidPrintPayload/);
});

test('備份中心可以建立、下載、匯入、驗證及分範圍恢復',()=>{
  for(const action of ['create-backup','download-backup','import-backup','restore-scope'])assert.match(page,new RegExp(action));
  assert.match(page,/type="file"/);
  assert.match(page,/validateBackupEnvelope/);
  assert.match(page,/restoreBackupValues/);
  assert.match(page,/恢復前自動備份/);
});

test('系統中心提供真實診斷、操作紀錄、同步重試及更新檢查結果',()=>{
  assert.match(page,/buildDiagnosticReport/);
  for(const action of ['download-diagnostic','view-audit','retry-sync','check-update'])assert.match(page,new RegExp(action));
  assert.match(page,/未設定更新來源/);
  assert.match(page,/唔會顯示已下載或已安裝/);
});
