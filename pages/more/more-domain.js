const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const number=value=>Number.isFinite(Number(value))?Number(value):0;
const round=value=>Math.round(number(value)*100)/100;

export const CASH_DENOMINATIONS=[
  {id:'note-1000',kind:'note',label:'$1,000 紙幣',value:1000},
  {id:'note-500',kind:'note',label:'$500 紙幣',value:500},
  {id:'note-100',kind:'note',label:'$100 紙幣',value:100},
  {id:'note-50',kind:'note',label:'$50 紙幣',value:50},
  {id:'note-20',kind:'note',label:'$20 紙幣',value:20},
  {id:'note-10',kind:'note',label:'$10 紙幣',value:10},
  {id:'coin-10',kind:'coin',label:'$10 硬幣',value:10},
  {id:'coin-5',kind:'coin',label:'$5 硬幣',value:5},
  {id:'coin-2',kind:'coin',label:'$2 硬幣',value:2},
  {id:'coin-1',kind:'coin',label:'$1 硬幣',value:1},
  {id:'coin-0.5',kind:'coin',label:'50¢ 硬幣',value:.5},
  {id:'coin-0.2',kind:'coin',label:'20¢ 硬幣',value:.2},
  {id:'coin-0.1',kind:'coin',label:'10¢ 硬幣',value:.1}
];

export function syncCashDenomination(breakdown,id,{source='quantity',value=0}={}){
  const denomination=CASH_DENOMINATIONS.find(row=>row.id===id);
  if(!denomination)throw new Error('找不到現金面額');
  const input=Math.max(0,number(value));
  let quantity;
  if(source==='amount'){
    quantity=round(input/denomination.value);
    if(Math.abs(quantity-Math.round(quantity))>.000001)throw new Error('輸入金額必須符合面額倍數');
    quantity=Math.round(quantity);
  }else{
    if(Math.abs(input-Math.round(input))>.000001)throw new Error('紙幣或硬幣數量必須是整數');
    quantity=Math.round(input);
  }
  return {...(breakdown||{}),[id]:{denomination:denomination.value,quantity,amount:round(quantity*denomination.value)}};
}

export function totalCashBreakdown(breakdown={}){
  return round(CASH_DENOMINATIONS.reduce((sum,row)=>sum+number(breakdown?.[row.id]?.amount),0));
}

export function defaultCashDistribution(cashCounted=0,openingFloat=0){
  const counted=Math.max(0,round(cashCounted));
  const retained=Math.min(counted,Math.max(0,round(openingFloat)));
  return {cashWithdrawn:round(counted-retained),cashRetained:retained};
}

function localDateId(timestamp){
  const date=new Date(timestamp);
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}

export function businessWindow(now=Date.now(),startHour=5){
  const point=new Date(number(now));
  const start=new Date(point);
  start.setHours(startHour,0,0,0);
  if(point.getTime()<start.getTime())start.setDate(start.getDate()-1);
  const end=new Date(start);
  end.setDate(end.getDate()+1);
  return {id:localDateId(start.getTime()),start:start.getTime(),end:end.getTime(),startHour};
}

function orderTime(order){
  return number(order?.completedAt||order?.checkedOutAt||order?.acceptedAt||order?.createdAt||order?.updatedAt);
}

export function ordersForWindow(orders,{now=Date.now(),startHour=5}={}){
  const window=businessWindow(now,startHour);
  return (Array.isArray(orders)?orders:[]).filter(order=>{
    const time=orderTime(order);
    return time>=window.start&&time<window.end;
  });
}

function groupRows(map){
  return [...map.values()].sort((a,b)=>b.amount-a.amount||String(a.name).localeCompare(String(b.name),'zh-HK'));
}

function paymentGroup(method=''){
  const text=String(method||'未分類');
  if(text==='現金')return 'cash';
  if(text==='平台已付')return 'platform';
  return 'electronic';
}

export function buildOperationalReport(orders,{now=Date.now(),startHour=5}={}){
  const window=businessWindow(now,startHour);
  const rows=ordersForWindow(orders,{now,startHour});
  const completed=rows.filter(order=>order.status!=='cancelled'&&order.status!=='voided');
  const summary={
    completedOrders:completed.length,
    cancelledOrders:rows.length-completed.length,
    itemUnits:0,
    grossSales:0,
    discounts:0,
    refunds:0,
    netSales:0,
    cashExpected:0,
    electronicExpected:0,
    unverifiedDirectTotal:0,
    unverifiedDirectOrders:0,
    platformGross:0,
    platformSettlement:0,
    pendingPayments:0,
    printExceptions:0
  };
  const channels=new Map(),payments=new Map(),products=new Map(),hours=new Map();
  completed.forEach(order=>{
    const gross=number(order.subtotal??order.amount);
    const discount=number(order.discountAmount);
    const refund=number(order.refundedAmount||order.refundAmount);
    const net=Math.max(0,number(order.amount)-refund);
    summary.grossSales+=gross;
    summary.discounts+=discount;
    summary.refunds+=refund;
    summary.netSales+=net;
    const pending=/待|pending/i.test(String(order.paymentStatus||order.reconciliationStatus||''));
    if(pending)summary.pendingPayments+=1;
    if(order.printStatus==='異常'||(order.printJobs||[]).some(job=>job.status==='failed'))summary.printExceptions+=1;
    const unverifiedDirect=pending&&(/電話|WhatsApp|磨飯\s*App|自家\s*App|網頁|Web/i.test(String(order.source||''))||order.group==='owned');
    const payGroup=unverifiedDirect?'unverified':paymentGroup(order.paymentMethod);
    if(payGroup==='unverified'){
      summary.unverifiedDirectTotal+=net;
      summary.unverifiedDirectOrders+=1;
    }else if(payGroup==='cash')summary.cashExpected+=net;
    else if(payGroup==='platform'){
      summary.platformGross+=number(order.platformSalesGross??net);
      summary.platformSettlement+=number(order.estimatedPlatformSettlement??net);
    }else summary.electronicExpected+=net;
    const channelName=String(order.source||'未分類');
    const channel=channels.get(channelName)||{name:channelName,orders:0,amount:0};
    channel.orders+=1;channel.amount+=net;channels.set(channelName,channel);
    const paymentName=String(order.paymentMethod||'未分類');
    const payment=payments.get(paymentName)||{name:paymentName,orders:0,amount:0,pending:0};
    payment.orders+=1;payment.amount+=net;payment.pending+=pending?1:0;payments.set(paymentName,payment);
    const hour=new Date(orderTime(order)).getHours();
    const hourKey=String(hour).padStart(2,'0')+':00';
    const hourRow=hours.get(hourKey)||{name:hourKey,orders:0,amount:0};
    hourRow.orders+=1;hourRow.amount+=net;hours.set(hourKey,hourRow);
    (order.items||order.cart||[]).forEach(item=>{
      const quantity=Math.max(0,number(item.qty||item.quantity));
      const amount=number(item.total??number(item.unitPrice)*quantity);
      const name=String(item.name||item.productName||'未命名商品');
      const product=products.get(name)||{name,category:String(item.category||'未分類'),quantity:0,amount:0,orders:0};
      product.quantity+=quantity;product.amount+=amount;product.orders+=1;products.set(name,product);
      summary.itemUnits+=quantity;
    });
  });
  Object.keys(summary).forEach(key=>{if(typeof summary[key]==='number')summary[key]=round(summary[key]);});
  return {businessWindow:window,orderIds:rows.map(order=>order.id),summary,channels:groupRows(channels),payments:groupRows(payments),products:groupRows(products),hours:groupRows(hours),generatedAt:number(now)};
}

export function calculateDayCloseReconciliation({report,cashCounted=0,openingFloat=0,cashExpenses=0}={}){
  const knownDrawerExpected=round(number(openingFloat)+number(report?.summary?.cashExpected)-number(cashExpenses));
  const unverifiedTotal=Math.max(0,number(report?.summary?.unverifiedDirectTotal));
  const inferredUnverifiedCash=round(Math.max(0,Math.min(unverifiedTotal,number(cashCounted)-knownDrawerExpected)));
  const inferredUnverifiedNonCash=round(unverifiedTotal-inferredUnverifiedCash);
  const cashExpectedAfterReconciliation=round(knownDrawerExpected+inferredUnverifiedCash);
  const cashDifference=round(number(cashCounted)-cashExpectedAfterReconciliation);
  return {knownDrawerExpected,unverifiedTotal,inferredUnverifiedCash,inferredUnverifiedNonCash,cashExpectedAfterReconciliation,cashDifference};
}

export function createDayClose({orders=[],now=Date.now(),terminalId='SMT',cashCounted=0,cashBreakdown={},openingFloat=0,cashWithdrawn,cashRetained,expenses=[],reason='',approvedOverride=false,existing=[],backupId=''}={}){
  const report=buildOperationalReport(orders,{now});
  const cashExpenses=(Array.isArray(expenses)?expenses:[]).filter(row=>String(row.paymentMethod||'現金')==='現金').reduce((sum,row)=>sum+number(row.amount),0);
  const reconciliation=calculateDayCloseReconciliation({report,cashCounted,openingFloat,cashExpenses});
  const cashExpectedAfterExpenses=reconciliation.cashExpectedAfterReconciliation;
  const cashDifference=reconciliation.cashDifference;
  const differenceThreshold=round(report.summary.netSales*.03);
  const reviewRequired=Math.abs(cashDifference)>differenceThreshold;
  if(reviewRequired&&!String(reason).trim())throw new Error('現金差異超出門檻，必須填寫差異原因');
  if(reviewRequired&&!approvedOverride)throw new Error('現金差異超出門檻，必須由有權人明確授權通過');
  const withdrawn=cashWithdrawn===undefined?0:round(cashWithdrawn);
  const retained=cashRetained===undefined?round(cashCounted-withdrawn):round(cashRetained);
  if(withdrawn<0||retained<0||Math.abs(round(withdrawn+retained)-round(cashCounted))>.001)throw new Error('提取及留底現金必須等於實際點算總額');
  const businessDate=report.businessWindow.id;
  const version=(Array.isArray(existing)?existing:[]).filter(row=>row.businessDate===businessDate).reduce((max,row)=>Math.max(max,number(row.version)),0)+1;
  return {
    id:`DAYCLOSE-${businessDate}-V${version}`,
    businessDate,version,status:'closed',createdAt:number(now),terminalId:String(terminalId||'SMT'),
    report:clone(report),cashCounted:round(cashCounted),cashBreakdown:clone(cashBreakdown||{}),openingFloat:round(openingFloat),cashWithdrawn:withdrawn,cashRetained:retained,
    cashExpectedAfterExpenses,cashDifference,differenceThreshold,reconciliation:clone(reconciliation),reviewRequired,
    expenses:clone(Array.isArray(expenses)?expenses:[]),differenceReason:String(reason||'').trim(),backupId:String(backupId||''),
    reviewApproval:{approved:reviewRequired?Boolean(approvedOverride):false,terminalId:reviewRequired?String(terminalId||'SMT'):'',at:reviewRequired?number(now):null},
    audit:[
      ...(reviewRequired?[{type:'day_close.difference_override_approved',terminalId:String(terminalId||'SMT'),at:number(now),businessDate,cashDifference,differenceThreshold,reason:String(reason||'').trim()}]:[]),
      {type:'day_close.completed',terminalId:String(terminalId||'SMT'),at:number(now),businessDate,version,cashDifference,backupId:String(backupId||'')}
    ]
  };
}

function csvCell(value){return `"${String(value??'').replaceAll('"','""')}"`;}
function csvRow(values){return values.map(csvCell).join(',');}

export function buildCsvExport(report,orders=[]){
  const selected=new Set(report?.orderIds||[]);
  const rows=(Array.isArray(orders)?orders:[]).filter(order=>selected.has(order.id));
  const lines=['\ufeff'+csvRow(['磨飯 SMT','營業報表',report?.businessWindow?.id||''])];
  lines.push('',csvRow(['營業摘要','數值']));
  Object.entries(report?.summary||{}).forEach(([key,value])=>lines.push(csvRow([key,value])));
  lines.push('',csvRow(['訂單明細']),csvRow(['訂單號','渠道','付款方式','付款狀態','狀態','金額','時間']));
  rows.forEach(order=>lines.push(csvRow([order.id,order.source,order.paymentMethod,order.paymentStatus,order.status,order.amount,new Date(orderTime(order)).toISOString()])));
  lines.push('',csvRow(['商品明細']),csvRow(['商品','分類','數量','銷售額','涉及訂單']));
  (report?.products||[]).forEach(item=>lines.push(csvRow([item.name,item.category,item.quantity,item.amount,item.orders])));
  return lines.join('\r\n');
}

function stable(value){
  if(Array.isArray(value))return '['+value.map(stable).join(',')+']';
  if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+stable(value[key])).join(',')+'}';
  return JSON.stringify(value);
}

function checksumOf(value){
  const text=stable(value);
  let hash=0x811c9dc5;
  for(let index=0;index<text.length;index++){
    hash^=text.charCodeAt(index);
    hash=Math.imul(hash,0x01000193)>>>0;
  }
  return 'fnv1a32-'+hash.toString(16).padStart(8,'0');
}

export function createBackupEnvelope(values,{now=Date.now(),terminalId='SMT',reason='manual'}={}){
  const safeValues=Object.fromEntries(Object.entries(values||{}).filter(([key])=>key.startsWith('morefun:')).sort(([a],[b])=>a.localeCompare(b)));
  const manifest={contract:'morefun.backup.v1',schemaVersion:1,createdAt:number(now),terminalId:String(terminalId||'SMT'),reason:String(reason||'manual'),keyCount:Object.keys(safeValues).length};
  const checksum=checksumOf({manifest,values:safeValues});
  return {id:`BACKUP-${number(now)}`,manifest,values:safeValues,checksum};
}

export function validateBackupEnvelope(envelope){
  const errors=[];
  if(envelope?.manifest?.contract!=='morefun.backup.v1')errors.push('備份格式不正確');
  if(number(envelope?.manifest?.schemaVersion)!==1)errors.push('備份版本不支援');
  if(!envelope?.values||typeof envelope.values!=='object'||Array.isArray(envelope.values))errors.push('備份內容缺失');
  if(Object.keys(envelope?.values||{}).some(key=>!key.startsWith('morefun:')))errors.push('備份含非 SMT 資料');
  const expected=checksumOf({manifest:envelope?.manifest||{},values:envelope?.values||{}});
  if(envelope?.checksum!==expected)errors.push('備份校驗失敗');
  return {ok:errors.length===0,errors,expectedChecksum:expected};
}

export function restoreBackupValues(current,envelope,scope='all'){
  const validation=validateBackupEnvelope(envelope);
  if(!validation.ok)throw new Error(validation.errors.join('；'));
  const next=scope==='all'
    ? Object.fromEntries(Object.entries(current||{}).filter(([key])=>!key.startsWith('morefun:')))
    : {...(current||{})};
  const include=key=>scope==='all'||(scope==='settings'&&(key.includes('settings')||key.includes('printers')||key.includes('terminal-id')||key.includes('ui-scale')));
  Object.entries(envelope.values).forEach(([key,value])=>{if(include(key))next[key]=value;});
  return next;
}

export function buildDiagnosticReport({version='unknown',terminalId='SMT',operations={},printers={},storageKeys=0,updateSource='',capabilities={}}={}, {now=Date.now()}={}){
  const jobs=Array.isArray(printers.jobs)?printers.jobs:[];
  return {
    contract:'morefun.diagnostic.v1',createdAt:number(now),version,terminalId,
    storage:{keys:number(storageKeys)},
    sync:{pending:(operations.outbox||[]).filter(row=>!['sent','completed'].includes(row.status)).length},
    print:{queued:jobs.filter(row=>row.status==='queued').length,blocked:jobs.filter(row=>row.status==='blocked').length,failed:jobs.filter(row=>row.status==='failed').length},
    update:{status:updateSource?'source_configured':'not_configured',source:updateSource||''},
    capabilities:{...capabilities}
  };
}
