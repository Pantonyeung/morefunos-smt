import test from 'node:test';
import assert from 'node:assert/strict';
import {
  businessWindow,
  buildReportRange,
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
  assert.equal(report.summary.grossSales,249);
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
  assert.deepEqual(report.payments.map(row=>[row.name,row.orders,row.amount,row.pending]),[['現金',1,100,0],['平台代收',1,80,0],['轉數快',1,59,1]]);
});

test('歷史報表支援今日昨日七日三十日三個月六個月及自訂日期',()=>{
  const expected={
    today:['2026-07-22T05:00:00+08:00','2026-07-23T05:00:00+08:00'],
    yesterday:['2026-07-21T05:00:00+08:00','2026-07-22T05:00:00+08:00'],
    '7d':['2026-07-16T05:00:00+08:00','2026-07-23T05:00:00+08:00'],
    '30d':['2026-06-23T05:00:00+08:00','2026-07-23T05:00:00+08:00'],
    '3m':['2026-04-22T05:00:00+08:00','2026-07-23T05:00:00+08:00'],
    '6m':['2026-01-22T05:00:00+08:00','2026-07-23T05:00:00+08:00']
  };
  Object.entries(expected).forEach(([preset,[start,end]])=>{
    const range=buildReportRange(preset,{now});
    assert.equal(range.start,at(start),preset);
    assert.equal(range.end,at(end),preset);
  });
  const custom=buildReportRange('custom',{now,startDate:'2026-07-20',endDate:'2026-07-22'});
  assert.equal(custom.start,at('2026-07-20T05:00:00+08:00'));
  assert.equal(custom.end,at('2026-07-23T05:00:00+08:00'));
  assert.throws(()=>buildReportRange('custom',{now,startDate:'2026-07-22',endDate:'2026-07-20'}),/結束日期/);
  assert.throws(()=>buildReportRange('custom',{now,startDate:'2026-01-21',endDate:'2026-07-22'}),/六個月/);
  assert.throws(()=>buildReportRange('custom',{now,startDate:'2026-07-20',endDate:'2026-07-23'}),/未來/);
  assert.equal(buildReportRange('today',{now}).endDate,'2026-07-22');
  assert.equal(buildReportRange('custom',{now,startDate:'2026-07-22',endDate:'2026-07-22'}).endDate,'2026-07-22');
  const monthEnd=buildReportRange('3m',{now:at('2026-05-31T15:00:00+08:00')});
  assert.equal(monthEnd.startDate,'2026-02-28');
});

test('選定歷史範圍會由訂單明細重算而不是只讀今日',()=>{
  const history=[
    ...orders,
    {id:'P090',source:'現場',status:'completed',completedAt:at('2026-07-21T12:00:00+08:00'),amount:40,subtotal:40,paymentMethod:'PayMe',paymentStatus:'已付款',paidAmount:40,items:[{name:'飲品',category:'飲品',qty:2,total:40}]}
  ];
  const today=buildOperationalReport(history,{range:buildReportRange('today',{now}),now});
  const yesterday=buildOperationalReport(history,{range:buildReportRange('yesterday',{now}),now});
  const sevenDays=buildOperationalReport(history,{range:buildReportRange('7d',{now}),now});
  assert.equal(today.summary.netSales,239);
  assert.equal(yesterday.summary.netSales,1039);
  assert.equal(sevenDays.summary.netSales,1278);
});

test('付款及渠道分拆提供對數欄位、狀態及對應訂單',()=>{
  const report=buildOperationalReport(orders,{now});
  assert.equal(report.summary.averageOrderValue,79.67);
  assert.equal(report.summary.outstandingOrders,1);
  assert.equal(report.summary.outstandingAmount,59);
  const cash=report.payments.find(row=>row.name==='現金');
  assert.deepEqual(
    {orders:cash.orders,gross:cash.gross,discounts:cash.discounts,expected:cash.expected,received:cash.received,refunds:cash.refunds,difference:cash.difference,status:cash.status,orderIds:cash.orderIds},
    {orders:1,gross:110,discounts:10,expected:100,received:100,refunds:0,difference:0,status:'已對數',orderIds:['P100']}
  );
  const fps=report.payments.find(row=>row.name==='轉數快');
  assert.equal(fps.expected,59);
  assert.equal(fps.received,0);
  assert.equal(fps.difference,59);
  assert.equal(fps.status,'待核實');
  assert.deepEqual(fps.orderIds,['A101']);
  const onsite=report.channels.find(row=>row.name==='現場');
  assert.equal(onsite.averageOrderValue,100);
  assert.deepEqual(onsite.orderIds,['P100']);
});

test('結帳、堂食及舊核數的付款別名會合併到同一對數方式',()=>{
  const aliases=[
    ['CASH-1','現金付款'],['ALI-1','Alipay'],['ALI-2','AlipayHK'],['ALI-3','支付寶'],
    ['WECHAT-1','WeChat Pay'],['WECHAT-2','WeChat Pay HK'],['WECHAT-3','微信支付'],
    ['FPS-1','FPS'],['FPS-2','FPS／轉數快'],['FPS-3','轉數快'],
    ['PAYME-1','PayMe'],['PAYME-2','拍住賞']
  ];
  const history=aliases.map(([id,paymentMethod],index)=>({
    id,source:'現場',status:'completed',completedAt:at(`2026-07-22T${String(10+Math.floor(index/4)).padStart(2,'0')}:${String(index%4*10).padStart(2,'0')}:00+08:00`),
    amount:10,subtotal:10,paymentMethod,paymentStatus:'已付款',items:[]
  }));
  const report=buildOperationalReport(history,{now});
  assert.deepEqual(Object.fromEntries(report.payments.map(row=>[row.name,row.orders])),{
    支付寶:3,微信支付:3,轉數快:3,PayMe:1,拍住賞:1,現金:1
  });
  assert.equal(report.summary.cashExpected,10);
  assert.equal(report.summary.electronicExpected,110);
});

test('未知付款方式歸入其他而不會製造無限新分類',()=>{
  const report=buildOperationalReport([
    {id:'OTHER-1',source:'現場',status:'completed',completedAt:at('2026-07-22T12:00:00+08:00'),amount:25,paymentMethod:'私人戶口甲',paymentStatus:'已付款',paidAmount:25,items:[]}
  ],{now});
  assert.deepEqual(report.payments.map(row=>[row.name,row.orders]),[['其他',1]]);
});

test('堂食分拆付款按每次實收方式對數而不只顯示組合付款',()=>{
  const report=buildOperationalReport([
    {id:'DINE-SPLIT',source:'現場',group:'onsite',serviceMode:'堂食',status:'completed',completedAt:at('2026-07-22T12:00:00+08:00'),amount:100,paymentMethod:'組合付款',paymentStatus:'已付款',paidAmount:100,payments:[{method:'現金',amount:40},{method:'PayMe',amount:60}],items:[]}
  ],{now});
  assert.deepEqual(report.payments.map(row=>[row.name,row.orders,row.expected,row.received]),[['PayMe',1,60,60],['現金',1,40,40]]);
  assert.equal(report.summary.cashExpected,40);
  assert.equal(report.summary.electronicExpected,60);
});

test('付款實收讀取真正 paidAmount 並保留短收及多收的正負差額',()=>{
  const report=buildOperationalReport([
    {id:'SHORT',source:'現場',status:'completed',completedAt:at('2026-07-22T12:00:00+08:00'),amount:100,paymentMethod:'PayMe',paymentStatus:'已付款',paidAmount:90,items:[]},
    {id:'OVER',source:'現場',status:'completed',completedAt:at('2026-07-22T13:00:00+08:00'),amount:100,paymentMethod:'支付寶',paymentStatus:'已付款',paidAmount:120,items:[]}
  ],{now});
  const short=report.payments.find(row=>row.name==='PayMe'),over=report.payments.find(row=>row.name==='支付寶');
  assert.deepEqual([short.expected,short.received,short.difference,short.status],[100,90,10,'短收']);
  assert.deepEqual([over.expected,over.received,over.difference,over.status],[100,120,-20,'多收']);
});

test('現金對數以收款減找續計算，不會把找續再扣一次',()=>{
  const report=buildOperationalReport([{
    id:'CASH-CHANGE',source:'現場',status:'completed',completedAt:at('2026-07-22T12:00:00+08:00'),
    amount:111,paymentMethod:'現金',paymentStatus:'已付款',paidAmount:111,receivedAmount:120,changeAmount:9,items:[]
  }],{now});
  const cash=report.payments.find(row=>row.name==='現金');
  assert.deepEqual([cash.expected,cash.received,cash.difference,cash.status],[111,111,0,'已對數']);
  const legacy=buildOperationalReport([{
    id:'LEGACY-CASH-CHANGE',source:'現場',status:'completed',completedAt:at('2026-07-22T13:00:00+08:00'),
    amount:111,paymentMethod:'現金',paymentStatus:'已付款',paidAmount:120,items:[]
  }],{now}).payments.find(row=>row.name==='現金');
  assert.deepEqual([legacy.expected,legacy.received,legacy.difference,legacy.status],[111,111,0,'已對數']);
});

test('平台付款別名統一顯示為平台代收',()=>{
  const report=buildOperationalReport([
    {id:'PLATFORM-1',source:'Keeta',group:'platform',status:'completed',completedAt:at('2026-07-22T12:00:00+08:00'),amount:80,paymentMethod:'平台已付',paymentStatus:'平台已付',estimatedPlatformSettlement:60,items:[]},
    {id:'PLATFORM-2',source:'Foodpanda',group:'platform',status:'completed',completedAt:at('2026-07-22T13:00:00+08:00'),amount:100,paymentMethod:'平台代收',paymentStatus:'平台已付',estimatedPlatformSettlement:75,items:[]}
  ],{now});
  assert.deepEqual(report.payments.map(row=>[row.name,row.orders]),[['平台代收',2]]);
});

test('商品分類、時段及異常資料保留對應訂單供介面下鑽',()=>{
  const report=buildOperationalReport(orders,{now});
  assert.equal(report.categories.find(row=>row.name==='飲品').quantity,2);
  assert.deepEqual(report.categories.find(row=>row.name==='飲品').orderIds,['P100']);
  assert.ok(report.hours.every(row=>Array.isArray(row.orderIds)));
  assert.equal(report.anomalies.find(row=>row.key==='payment_pending').count,1);
  assert.equal(report.anomalies.find(row=>row.key==='print_failed').count,1);
  assert.equal(report.anomalies.find(row=>row.key==='cancelled').count,1);
  assert.equal(report.orders.length,4);
});

test('異常報表會由現有 audit 列出付款更改、部分取消、重印及付款問題',()=>{
  const report=buildOperationalReport([{
    id:'AUDIT-1',source:'現場',status:'completed',completedAt:at('2026-07-22T12:00:00+08:00'),amount:50,paymentMethod:'現金',paymentStatus:'已付款',paidAmount:50,items:[],audit:[
      {type:'order_payment_changed',at:at('2026-07-22T10:00:00+08:00')},{type:'checkout_data_corrected',at:at('2026-07-22T10:01:00+08:00')},{type:'order_item_partially_cancelled',at:at('2026-07-22T10:02:00+08:00'),detail:{amount:10}},
      {type:'order_reprint_queued',at:at('2026-07-22T10:03:00+08:00')},{type:'payment_issue_flagged',at:at('2026-07-22T10:04:00+08:00')}
    ]
  }],{now});
  for(const name of ['更改付款／訂單資料','部分取消／退菜','重印單據','付款問題'])assert.ok(report.anomalies.some(row=>row.name===name),name);
  assert.equal(report.anomalies.find(row=>row.name==='更改付款／訂單資料').count,2);
  assert.deepEqual(report.anomalies.find(row=>row.name==='部分取消／退菜').orderIds,['AUDIT-1']);
});

test('異常操作按 audit 發生時間入報表並保留跨日原訂單下鑽',()=>{
  const report=buildOperationalReport([{
    id:'OLD-AUDIT',source:'現場',status:'completed',completedAt:at('2026-07-20T12:00:00+08:00'),amount:40,paymentMethod:'現金',paidAmount:40,items:[],
    audit:[{type:'order_reprint_queued',at:at('2026-07-22T10:00:00+08:00')}]
  }],{now});
  assert.deepEqual(report.orderIds,[]);
  assert.deepEqual(report.anomalies.find(row=>row.name==='重印單據').orderIds,['OLD-AUDIT']);
  assert.ok(report.orders.some(order=>order.id==='OLD-AUDIT'));
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
