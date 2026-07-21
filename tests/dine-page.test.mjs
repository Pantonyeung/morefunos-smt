import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('堂食頁固定顯示八張室內枱及戶外枱',async()=>{
  const {createInitialDineState}=await import('../pages/dine/dine-domain.js');
  const state=createInitialDineState();
  assert.deepEqual(state.tables.map(table=>table.id),['1','2','3','4','5','6','7','8','戶外']);
  assert.ok(state.tables.every(table=>['free','occupied'].includes(table.status)));
});

test('三十五分鐘提示只標記枱卡，不增加第三種枱位狀態',async()=>{
  const {tableView}=await import('../pages/dine/dine-domain.js');
  const view=tableView({id:'3',status:'occupied',openedAt:Date.now()-36*60_000,orders:[]},Date.now());
  assert.equal(view.status,'occupied');
  assert.equal(view.isLate,true);
  assert.equal(view.minutes,36);
});

test('逐餐品付款可拆數量並鎖定已付款數量',async()=>{
  const {applyItemPayment}=await import('../pages/dine/dine-domain.js');
  const session={payments:[],items:[{lineId:'a',name:'飯團',qty:10,unitPrice:20,paidQty:0}]};
  const next=applyItemPayment(session,[{lineId:'a',qty:3}],'現金');
  assert.equal(next.items[0].paidQty,3);
  assert.equal(next.payments[0].amount,60);
  assert.equal(next.payments[0].method,'現金');
  assert.throws(()=>applyItemPayment(next,[{lineId:'a',qty:8}],'PayMe'),/超出未付數量/);
});

test('堂食掃碼提交保持待確認，確認後才加入落單記錄',async()=>{
  const {acceptQrSubmission}=await import('../pages/dine/dine-domain.js');
  const session={items:[],orderBatches:[],pendingSubmissions:[{id:'qr-1',items:[{lineId:'b',name:'凍奶茶',qty:1,unitPrice:15,paidQty:0}]}]};
  const next=acceptQrSubmission(session,'qr-1');
  assert.equal(next.pendingSubmissions.length,0);
  assert.equal(next.items.length,1);
  assert.equal(next.orderBatches.length,1);
});

test('員工堂食點餐會建立指定枱會話內容，金額及批次由同一批餐品計算',async()=>{
  const {createInitialDineState,commitTableOrder}=await import('../pages/dine/dine-domain.js');
  const state=createInitialDineState(1000);
  const cart=[{lineId:'line-1',name:'自選便當',qty:2,unitPrice:58,total:116}];
  const next=commitTableOrder(state,{tableId:'3',sessionId:null},cart,{terminalId:'SMM-01',now:2000});
  const table=next.tables.find(entry=>entry.id==='3');
  assert.equal(table.status,'occupied');
  assert.equal(table.session.items.length,1);
  assert.equal(table.session.orderBatches.length,1);
  assert.equal(table.session.orderBatches[0].source,'STAFF');
  assert.equal(table.session.orderBatches[0].terminalId,'SMM01');
  assert.equal(tableViewForTest(await import('../pages/dine/dine-domain.js'),table,2000).total,116);
});

test('堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱',async()=>{
  const {createInitialDineState,openTable,commitTableOrder}=await import('../pages/dine/dine-domain.js');
  const state=createInitialDineState(1000);
  state.tables[0]=openTable(state.tables[0],1000);
  assert.throws(()=>commitTableOrder(state,{tableId:'1',sessionId:'DINE-1-old'},[{lineId:'x',name:'飯團',qty:1,unitPrice:41}],{now:2000}),/堂食會話已失效/);
});

test('堂食暫存單保留枱號，取單後仍然回到原枱',async()=>{
  const {createDraftRecord,restoreDraftForTerminal}=await import('../shared/operations.js');
  const context={mode:'dine',tableId:'6',sessionId:'DINE-6-1000'};
  const draft=createDraftRecord({cart:[{lineId:'x',qty:1}],terminalId:'SMM-01',context,now:2000});
  assert.deepEqual(draft.context,context);
  const restored=restoreDraftForTerminal(draft,'SMT-01',3000);
  assert.deepEqual(restored.context,context);
});

function tableViewForTest(domain,table,now){return domain.tableView(table,now);}

test('堂食頁提供簡潔枱詳情、半屏待確認及兩層付款操作',()=>{
  const page=read('pages/dine/page.js');
  const css=read('pages/dine/page.css');
  assert.match(page,/加單/);
  assert.match(page,/付款/);
  assert.match(page,/訂單記錄/);
  assert.match(page,/永久枱碼/);
  assert.match(page,/即時枱碼/);
  assert.match(page,/全數付款/);
  assert.match(page,/選擇餐品付款/);
  assert.match(page,/確認落單/);
  assert.match(css,/\.pending-review-panel[^}]*width:\s*min\(50vw/);
});

test('正式堂食頁不會自動建立示範枱或示範訂單，掃碼入口標示第二版保留',()=>{
  const page=read('pages/dine/page.js');
  assert.doesNotMatch(page,/function demoState/);
  assert.match(page,/第二版保留/);
  assert.match(page,/DRAFT_STORAGE_KEY/);
});

test('現有點餐及訂單底欄可以進入獨立堂食頁',()=>{
  assert.match(read('app-loader.js'),/dine:\s*'pages\/dine\/index\.html'/);
  assert.match(read('pages/order/page.js'),/navigate-dine/);
  assert.match(read('pages/orders/page.js'),/navigate-dine/);
});
