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

test('堂食付款歸零會建立現場歷史訂單並即時清空枱位',async()=>{
  const {createInitialDineState,commitTableOrder,settleTablePayment}=await import('../pages/dine/dine-domain.js');
  let state=createInitialDineState(1000);
  state=commitTableOrder(state,{tableId:'1'},[{lineId:'a',name:'芝士',qty:1,unitPrice:26,total:26}],{terminalId:'SMT',now:2000});
  const result=settleTablePayment(state,[],{
    tableId:'1',selections:[{lineId:'a',qty:1}],method:'現金',terminalId:'SMT',now:3000
  });
  const table=result.state.tables.find(entry=>entry.id==='1');
  assert.equal(table.status,'free');
  assert.equal(table.session,null);
  assert.equal(result.history.length,1);
  assert.equal(result.history[0].source,'現場');
  assert.equal(result.history[0].group,'onsite');
  assert.equal(result.history[0].status,'completed');
  assert.equal(result.history[0].amount,26);
  assert.equal(result.history[0].dineTableId,'1');
  assert.equal(result.history[0].displayOrderNo,'P001');
  assert.match(result.history[0].id,/^MF-/);
  assert.equal(result.history[0].createdTerminalId,'SMT');
});

test('堂食正式落單即鎖定流水並保存到製作工作，跨營業日付款亦不改號',async()=>{
  const {createInitialDineState,commitTableOrder,settleTablePayment}=await import('../pages/dine/dine-domain.js');
  const beforeFive=new Date(2026,6,22,4,59).getTime(),afterFive=new Date(2026,6,22,5,1).getTime();
  let state=createInitialDineState(beforeFive);
  state=commitTableOrder(state,{tableId:'1'},[{lineId:'cross',name:'飯團',qty:1,unitPrice:41,total:41}],{terminalId:'SMT-01',now:beforeFive,history:[]});
  const session=state.tables[0].session;
  assert.equal(session.orderIdentity.displayOrderNo,'P001');
  assert.equal(session.orderBatches[0].displayOrderNo,'P001');
  assert.equal(session.printJobs[0].displayOrderNo,'P001');
  const result=settleTablePayment(state,[],{tableId:'1',selections:[{lineId:'cross',qty:1}],method:'現金',terminalId:'SMT-01',now:afterFive});
  assert.equal(result.history[0].displayOrderNo,'P001');
  assert.equal(result.history[0].businessDate,'2026-07-21');
});

test('同時使用中的堂食枱亦會佔用每日流水避免撞號',async()=>{
  const {createInitialDineState,commitTableOrder}=await import('../pages/dine/dine-domain.js');
  let state=createInitialDineState(1000);
  state=commitTableOrder(state,{tableId:'1'},[{name:'A',qty:1,unitPrice:10}],{terminalId:'SMT',now:2000,history:[]});
  state=commitTableOrder(state,{tableId:'2'},[{name:'B',qty:1,unitPrice:10}],{terminalId:'SMT',now:3000,history:[]});
  assert.deepEqual(state.tables.slice(0,2).map(table=>table.session.orderIdentity.displayOrderNo),['P001','P002']);
});

test('舊版未有識別的堂食枱直接付款時會避開其他活躍枱流水',async()=>{
  const {createInitialDineState,openTable,commitTableOrder,settleTablePayment}=await import('../pages/dine/dine-domain.js');
  let state=createInitialDineState(1000);
  state=commitTableOrder(state,{tableId:'2'},[{lineId:'new',name:'新單',qty:1,unitPrice:10}],{terminalId:'SMT',now:2000,history:[]});
  state.tables[0]=openTable(state.tables[0],1500);
  state.tables[0].session.items.push({lineId:'legacy',name:'舊單',qty:1,paidQty:0,unitPrice:20});
  const result=settleTablePayment(state,[],{tableId:'1',selections:[{lineId:'legacy',qty:1}],method:'現金',terminalId:'SMT',now:3000});
  assert.equal(result.history[0].displayOrderNo,'P002');
});

test('載入舊資料時會補救已付清但未清枱的堂食會話，且不重複寫歷史',async()=>{
  const {createInitialDineState,commitTableOrder,applyFullPayment,reconcileSettledTables}=await import('../pages/dine/dine-domain.js');
  let state=createInitialDineState(1000);
  state=commitTableOrder(state,{tableId:'2'},[{lineId:'b',name:'飯團',qty:1,unitPrice:45,total:45}],{now:2000});
  state.tables[1].session=applyFullPayment(state.tables[1].session,'PayMe',3000);
  const first=reconcileSettledTables(state,[],{terminalId:'SMT',now:4000});
  const second=reconcileSettledTables(first.state,first.history,{terminalId:'SMT',now:5000});
  assert.equal(first.state.tables[1].status,'free');
  assert.equal(first.history.length,1);
  assert.equal(second.history.length,1);
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
  const cart=[{lineId:'line-1',name:'自選紫米飯團',category:'飯團',qty:2,unitPrice:58,total:116}];
  const next=commitTableOrder(state,{tableId:'3',sessionId:null},cart,{terminalId:'SMM-01',now:2000});
  const table=next.tables.find(entry=>entry.id==='3');
  assert.equal(table.status,'occupied');
  assert.equal(table.session.items.length,1);
  assert.equal(table.session.orderBatches.length,1);
  assert.equal(table.session.orderBatches[0].source,'STAFF');
  assert.equal(table.session.orderBatches[0].terminalId,'SMM01');
  assert.deepEqual(table.session.printJobs.map(job=>job.document),['製作單','標籤']);
  assert.equal(tableViewForTest(await import('../pages/dine/dine-domain.js'),table,2000).total,116);
});

test('堂食枱面摘要提供營運所需時間、餐點及數量資料',async()=>{
  const {tableView}=await import('../pages/dine/dine-domain.js');
  const now=40*60_000;
  const table={id:'3',status:'occupied',openedAt:5*60_000,session:{pendingSubmissions:[],items:[
    {name:'香煎雞扒便當',qty:1,unitPrice:58,paidQty:0},
    {name:'Ｆ４紫米飯團',qty:2,unitPrice:45,paidQty:1},
    {name:'凍台式奶茶',qty:2,unitPrice:18,paidQty:0},
    {name:'鹽酥雞',qty:1,unitPrice:28,paidQty:0}
  ]}};
  const view=tableView(table,now);
  assert.equal(view.minutes,35);
  assert.equal(view.timeStatus,'late');
  assert.equal(view.itemKinds,4);
  assert.equal(view.itemQty,6);
  assert.equal(view.remainingKinds,1);
  assert.deepEqual(view.itemPreview.map(item=>item.name),['香煎雞扒便當','Ｆ４紫米飯團','凍台式奶茶']);
});

test('堂食點餐拒絕寫入已失效的舊會話，避免餐品掛錯枱',async()=>{
  const {createInitialDineState,openTable,commitTableOrder}=await import('../pages/dine/dine-domain.js');
  const state=createInitialDineState(1000);
  state.tables[0]=openTable(state.tables[0],1000);
  assert.throws(()=>commitTableOrder(state,{tableId:'1',sessionId:'DINE-1-old'},[{lineId:'x',name:'飯團',qty:1,unitPrice:41}],{now:2000}),/堂食會話已失效/);
});

test('空枱開始點餐只建立意圖，正式提交餐品時才開枱',async()=>{
  const {createInitialDineState,createDineOrderContext,commitTableOrder}=await import('../pages/dine/dine-domain.js');
  const state=createInitialDineState(1000);
  const context=createDineOrderContext(state,'3');
  assert.equal(context.tableId,'3');
  assert.equal(context.sessionId,null);
  assert.equal(context.startedFromFree,true);
  assert.equal(state.tables[2].status,'free');
  const next=commitTableOrder(state,context,[{name:'飯團',qty:1,unitPrice:41}],{now:2000});
  assert.equal(next.tables[2].status,'occupied');
  assert.equal(next.tables[2].session.items.length,1);
});

test('舊版本遺留的空堂食會話會安全清理，有餐品的會話不受影響',async()=>{
  const {createInitialDineState,openTable,cleanupEmptyDineSessions}=await import('../pages/dine/dine-domain.js');
  const state=createInitialDineState(1000);
  state.tables[0]=openTable(state.tables[0],1200);
  state.tables[1]=openTable(state.tables[1],1300);
  state.tables[1].session.items.push({name:'便當',qty:1,unitPrice:50});
  const next=cleanupEmptyDineSessions(state);
  assert.equal(next.tables[0].status,'free');
  assert.equal(next.tables[1].status,'occupied');
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
  assert.doesNotMatch(page,/堂食暫存|張暫存|尚未正式落單/);
});

test('堂食枱卡直接顯示開枱、三十五分鐘及首三項餐點摘要',()=>{
  const page=read('pages/dine/page.js');
  assert.match(page,/開枱/);
  assert.match(page,/尚餘/);
  assert.match(page,/已超時/);
  assert.match(page,/itemPreview/);
  assert.match(page,/另外.*項/);
});

test('現有點餐及訂單底欄可以進入獨立堂食頁',()=>{
  assert.match(read('app-loader.js'),/dine:\s*'pages\/dine\/index\.html'/);
  assert.match(read('pages/order/page.js'),/navigate-dine/);
  assert.match(read('pages/orders/page.js'),/navigate-dine/);
});

test('堂食點單提供取消入口並同步清除失效堂食脈絡',()=>{
  const orderPage=read('pages/order/page.js');
  const dinePage=read('pages/dine/page.js');
  assert.match(orderPage,/cancel-dine-order/);
  assert.match(orderPage,/取消堂食點單/);
  assert.match(orderPage,/startedFromFree/);
  assert.match(dinePage,/cleanupEmptyDineSessions/);
  assert.match(dinePage,/clearOrderDineContext/);
});

test('點單頁兩個堂食落單入口都會讀取完成歷史避免重複流水',()=>{
  const orderPage=read('pages/order/page.js');
  assert.equal((orderPage.match(/history:readJSON\(ORDER_HISTORY_STORAGE_KEY,\[\]\)/g)||[]).length,2);
});

test('堂食頁最近訂單使用共用時間排序及三位顯示號碼',()=>{
  const page=read('pages/dine/page.js');
  assert.match(page,/latestOrderDisplayNumber/);
  assert.match(page,/activeDineOrderIdentities\(state\)/);
  assert.match(page,/try\{handle\(button\)\}catch/);
  assert.doesNotMatch(page,/\.at\(-1\)\?\.id/);
});
