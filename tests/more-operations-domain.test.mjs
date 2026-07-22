import test from 'node:test';
import assert from 'node:assert/strict';
import {
  businessWindow,
  buildOperationalReport,
  CASH_DENOMINATIONS,
  syncCashDenomination,
  totalCashBreakdown,
  defaultCashDistribution,
  buildOpeningCashState,
  calculateDayCloseReconciliation,
  createDayClose,
  buildCsvExport,
  createBackupEnvelope,
  validateBackupEnvelope,
  restoreBackupValues,
  buildDiagnosticReport
} from '../pages/more/more-domain.js';

const at=value=>new Date(value).getTime();
const now=at('2026-07-22T15:00:00+08:00');
const orders=[
  {id:'P100',source:'現場',status:'completed',completedAt:at('2026-07-22T06:00:00+08:00'),amount:100,subtotal:110,discountAmount:10,paymentMethod:'現金',paymentStatus:'已付款',paidAmount:100,items:[{name:'鹽酥雞',category:'小食',qty:2,total:40},{name:'手打檸檬茶',category:'飲品',qty:2,total:60}]},
  {id:'A101',source:'磨飯 App',status:'completed',completedAt:at('2026-07-22T07:00:00+08:00'),amount:59,paymentMethod:'FPS',paymentStatus:'付款待核實',paidAmount:0,items:[{name:'紫米飯團 A 餐',category:'飯團餐',qty:1,total:59}]},
  {id:'K102',source:'Keeta',status:'completed',completedAt:at('2026-07-22T08:00:00+08:00'),amount:80,paymentMethod:'平台已付',paymentStatus:'平台已付',platformSalesGross:80,estimatedPlatformSettlement:60,printStatus:'異常',items:[{name:'菜飯便當',category:'便當',qty:1,total:80}]},
  {id:'OLD',source:'現場',status:'completed',completedAt:at('2026-07-22T04:59:00+08:00'),amount:999,paymentMethod:'現金',items:[]},
  {id:'VOID',source:'現場',status:'cancelled',completedAt:at('2026-07-22T09:00:00+08:00'),amount:50,paymentMethod:'現金',items:[]}
];

test('營業日固定由早上五時起計並排除上一營業日訂單',()=>{
  const window=businessWindow(now);
  assert.equal(window.start,at('2026-07-22T05:00:00+08:00'));
  assert.equal(window.end,at('2026-07-23T05:00:00+08:00'));
  assert.equal(window.id,'2026-07-22');
  const report=buildOperationalReport(orders,{now});
  assert.deepEqual(report.orderIds,['P100','A101','K102','VOID']);
});

test('報表分開淨銷售、付款、平台結算、待核實及打印異常',()=>{
  const report=buildOperationalReport(orders,{now});
  assert.equal(report.summary.completedOrders,3);
  assert.equal(report.summary.netSales,239);
  assert.equal(report.summary.discounts,10);
  assert.equal(report.summary.cashExpected,100);
  assert.equal(report.summary.electronicExpected,0);
  assert.equal(report.summary.unverifiedDirectTotal,59);
  assert.equal(report.summary.unverifiedDirectOrders,1);
  assert.equal(report.summary.platformGross,80);
  assert.equal(report.summary.platformSettlement,60);
  assert.equal(report.summary.pendingPayments,1);
  assert.equal(report.summary.printExceptions,1);
  assert.equal(report.products.find(row=>row.name==='鹽酥雞').quantity,2);
  assert.deepEqual(report.channels.map(row=>[row.name,row.orders,row.amount]),[['現場',1,100],['Keeta',1,80],['磨飯 App',1,59]]);
  assert.deepEqual(report.payments.map(row=>[row.name,row.orders,row.amount,row.pending]),[['現金',1,100,0],['平台已付',1,80,0],['FPS',1,59,1]]);
});

test('港幣盤點只提供店舖實際接收的五款紙幣及三款硬幣',()=>{
  assert.deepEqual(CASH_DENOMINATIONS.map(row=>[row.kind,row.value]),[['note',500],['note',100],['note',50],['note',20],['note',10],['coin',5],['coin',2],['coin',1]]);
  let breakdown={};
  breakdown=syncCashDenomination(breakdown,'note-100',{source:'amount',value:1000});
  breakdown=syncCashDenomination(breakdown,'coin-5',{source:'quantity',value:3});
  assert.equal(breakdown['note-100'].quantity,10);
  assert.equal(breakdown['note-100'].amount,1000);
  assert.equal(breakdown['coin-5'].amount,15);
  assert.equal(totalCashBreakdown(breakdown),1015);
  assert.throws(()=>syncCashDenomination(breakdown,'note-100',{source:'amount',value:105}),/面額倍數/);
});

test('新營業日沿用上次留底並容許開機時加減調整',()=>{
  const closes=[{businessDate:'2026-07-21',createdAt:1000,cashRetained:1150}];
  assert.deepEqual(buildOpeningCashState(closes,[],'2026-07-22'),{businessDate:'2026-07-22',previousRetained:1150,adjustment:0,openingCash:1150,confirmed:false});
  const adjusted=buildOpeningCashState(closes,[{businessDate:'2026-07-22',adjustment:-150,confirmedAt:2000}],'2026-07-22');
  assert.deepEqual(adjusted,{businessDate:'2026-07-22',previousRetained:1150,adjustment:-150,openingCash:1000,confirmed:true,confirmedAt:2000});
});

test('未手動調整前按開工底金建議提取及留底，且不會留多過實點現金',()=>{
  assert.deepEqual(defaultCashDistribution(1000,300),{cashWithdrawn:700,cashRetained:300});
  assert.deepEqual(defaultCashDistribution(1000,1200),{cashWithdrawn:0,cashRetained:1000});
});

test('日結按實點現金反推待核實訂單的現金及非現金部分',()=>{
  const report=buildOperationalReport(orders,{now});
  const result=calculateDayCloseReconciliation({report,cashCounted:139,openingFloat:50,cashExpenses:10});
  assert.equal(result.knownDrawerExpected,140);
  assert.equal(result.inferredUnverifiedCash,0);
  assert.equal(result.inferredUnverifiedNonCash,59);
  assert.equal(result.cashDifference,-1);
  const withCash=calculateDayCloseReconciliation({report,cashCounted:169,openingFloat:50,cashExpenses:10});
  assert.equal(withCash.inferredUnverifiedCash,29);
  assert.equal(withCash.inferredUnverifiedNonCash,30);
  assert.equal(withCash.cashDifference,0);
});

test('日結保存現金、支出、差異、版本及稽核而不改寫訂單',()=>{
  const snapshot=JSON.stringify(orders);
  const close=createDayClose({orders,now,terminalId:'SMT-01',cashCounted:90,expenses:[{category:'食材',amount:10,paymentMethod:'現金',note:'補貨'}],reason:'現金支出已記錄',existing:[{businessDate:'2026-07-22',version:1}],backupId:'BACKUP-1'});
  assert.equal(close.version,2);
  assert.equal(close.cashExpectedAfterExpenses,90);
  assert.equal(close.cashDifference,0);
  assert.equal(close.backupId,'BACKUP-1');
  assert.equal(close.audit.at(-1).type,'day_close.completed');
  assert.equal(JSON.stringify(orders),snapshot);
});

test('超出百分之三差異而沒有原因不可正式日結',()=>{
  assert.throws(()=>createDayClose({orders,now,terminalId:'SMT-01',cashCounted:0,expenses:[]}),/差異原因/);
});

test('超出百分之三差異必須明確授權，並保存提取及留底現金',()=>{
  assert.throws(()=>createDayClose({orders,now,terminalId:'SMT-01',cashCounted:0,expenses:[],reason:'已覆核'}),/授權通過/);
  const close=createDayClose({orders,now,terminalId:'SMT-01',cashCounted:0,expenses:[],reason:'已覆核短款',approvedOverride:true,cashWithdrawn:0,cashRetained:0});
  assert.equal(close.reviewRequired,true);
  assert.equal(close.reviewApproval.approved,true);
  assert.equal(close.reviewApproval.terminalId,'SMT-01');
  assert.equal(close.cashWithdrawn+close.cashRetained,close.cashCounted);
});

test('提取及留底現金必須完整分配實點現金',()=>{
  assert.throws(()=>createDayClose({orders,now,terminalId:'SMT-01',cashCounted:100,expenses:[],cashWithdrawn:80,cashRetained:10}),/提取及留底/);
  const close=createDayClose({orders,now,terminalId:'SMT-01',cashCounted:100,expenses:[],cashWithdrawn:70,cashRetained:30});
  assert.equal(close.cashWithdrawn,70);
  assert.equal(close.cashRetained,30);
});

test('CSV 匯出包含摘要、訂單及商品明細並正確處理逗號',()=>{
  const csv=buildCsvExport(buildOperationalReport(orders,{now}),orders);
  assert.match(csv,/營業摘要/);
  assert.match(csv,/訂單明細/);
  assert.match(csv,/商品明細/);
  assert.match(csv,/P100/);
  assert.match(csv,/"鹽酥雞"/);
});

test('備份有可重算校驗值，任何內容被改動都會驗證失敗',()=>{
  const envelope=createBackupEnvelope({'morefun:smt:v16:orders':'[{"id":"P100"}]','morefun:smt:v16c:settings':'{}'},{now,terminalId:'SMT-01',reason:'manual'});
  assert.equal(validateBackupEnvelope(envelope).ok,true);
  envelope.values['morefun:smt:v16c:settings']='{"changed":true}';
  assert.equal(validateBackupEnvelope(envelope).ok,false);
});

test('恢復可以只套用設定或完整資料，並拒絕無效備份',()=>{
  const current={'morefun:smt:v16:orders':'old','morefun:smt:v16c:settings':'old-settings','morefun:obsolete':'remove','outside:key':'keep'};
  const envelope=createBackupEnvelope({'morefun:smt:v16:orders':'new','morefun:smt:v16c:settings':'new-settings','morefun:smt:v1:printers':'printers'},{now,terminalId:'SMT-01'});
  const settingsOnly=restoreBackupValues(current,envelope,'settings');
  assert.equal(settingsOnly['morefun:smt:v16:orders'],'old');
  assert.equal(settingsOnly['morefun:smt:v16c:settings'],'new-settings');
  assert.equal(settingsOnly['morefun:smt:v1:printers'],'printers');
  assert.equal(settingsOnly['outside:key'],'keep');
  const full=restoreBackupValues(current,envelope,'all');
  assert.equal(full['morefun:smt:v16:orders'],'new');
  assert.equal(full['outside:key'],'keep');
  assert.equal(Object.hasOwn(full,'morefun:obsolete'),false);
  const invalid={...envelope,checksum:'wrong'};
  assert.throws(()=>restoreBackupValues(current,invalid,'all'),/校驗/);
});

test('系統診斷清楚分開本機能力、同步積壓及未設定更新來源',()=>{
  const report=buildDiagnosticReport({version:'order-v1-28',terminalId:'SMT-01',operations:{outbox:[{id:'1'}]},printers:{jobs:[{status:'failed'},{status:'queued'}]},storageKeys:12,updateSource:''},{now});
  assert.equal(report.sync.pending,1);
  assert.equal(report.print.failed,1);
  assert.equal(report.update.status,'not_configured');
  assert.equal(report.version,'order-v1-28');
});
