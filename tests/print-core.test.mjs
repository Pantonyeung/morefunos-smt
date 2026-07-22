import test from 'node:test';
import assert from 'node:assert/strict';
import {
  defaultPrinterState,
  validatePrinter,
  aggregateProductionSummary,
  renderPrintDocument,
  createPrintJobs,
  retryPrintJob,
  reroutePrintJob,
  buildAndroidPrintPayload,
  importExternalPrintJobs,
  diagnosePrinterConfiguration
} from '../pages/more/print-domain.js';

const order={id:'P0055',source:'電話／WhatsApp',paymentMethod:'現金',amount:218,subtotal:228,discountAmount:10,paidAmount:220,changeAmount:2,acceptedAt:1000,checkoutTerminalId:'SMT-01',channelData:{phone:'85261234567',platformOrderId:'T3453',note:'十一時後取'},items:[
  {lineId:'1',name:'鹽酥雞',category:'小食',qty:3,unitPrice:18,total:54,options:{醬汁:'蜜糖芥末'}},
  {lineId:'2',name:'手打檸檬茶',category:'飲品',qty:2,unitPrice:20,total:40,options:{冰量:'少冰'}},
  {lineId:'3',name:'台式奶茶',category:'飲品',qty:1,unitPrice:16,total:16},
  {lineId:'4',name:'菜飯便當',category:'便當',qty:2,unitPrice:45,total:90},
  {lineId:'5',code:'F4',name:'蜜糖芥末雞絲／鹽酥雞／爆檸',labelName:'F4紫米餐',category:'飯團',qty:1,unitPrice:18,total:18,fulfillment:'外賣',packagingFee:1,options:{餐點:['蜜糖芥末雞絲','鹽酥雞','爆檸']}}
]};

test('預設建立五部設備及四款由管理端發佈的示範格式',()=>{
  const state=defaultPrinterState(1000);
  assert.equal(state.printers.length,5);
  assert.deepEqual(state.printers.map(row=>row.model),['SUNMI T2S','XP-N160II','XP-N160II','T271U','T271U']);
  assert.deepEqual(state.templates.map(row=>row.documentType),['receipt','production','packing','label']);
  assert.ok(state.templates.every(row=>row.source==='admin-demo'&&row.editable===false));
});

test('網絡打印機必須有有效網絡地址、連接埠、紙寬、用途及格式',()=>{
  const printer=defaultPrinterState(1000).printers.find(row=>row.model==='XP-N160II');
  assert.equal(validatePrinter(printer).ok,false);
  const valid={...printer,host:'192.168.1.201',port:9100,paperWidth:80,purposes:['production'],templateAssignments:{production:'production-demo-v1'}};
  assert.deepEqual(validatePrinter(valid),{ok:true,errors:[]});
  assert.match(validatePrinter({...valid,host:'999.1.1.1'}).errors.join('、'),/網絡地址/);
  assert.match(validatePrinter({...valid,port:70000}).errors.join('、'),/連接埠/);
});

test('製作及打包統計同時提供每款產品與飲品、飯餐、飯團總數',()=>{
  const summary=aggregateProductionSummary(order.items);
  assert.equal(summary.items.find(row=>row.name==='鹽酥雞').quantity,3);
  assert.equal(summary.items.find(row=>row.name==='手打檸檬茶').quantity,2);
  assert.equal(summary.totals.drinks,3);
  assert.equal(summary.totals.riceMeals,2);
  assert.equal(summary.totals.riceballs,1);
  assert.equal(summary.totalUnits,9);
});

test('四款格式生成可讀預覽，製作單及打包單頂部先顯示合併統計',()=>{
  const state=defaultPrinterState(1000);
  for(const template of state.templates){
    const doc=renderPrintDocument(template,order);
    assert.equal(doc.documentType,template.documentType);
    assert.match(doc.text,/P055/);
  }
  const production=renderPrintDocument(state.templates.find(row=>row.documentType==='production'),order);
  assert.ok(production.text.indexOf('合併統計')<production.text.indexOf('逐項明細'));
  assert.match(production.text,/飲品總杯數：3/);
  assert.match(production.text,/飯餐總份數：2/);
  assert.match(production.text,/電話／WhatsApp/);
  assert.match(production.text,/T3453/);
  assert.match(production.text,/十一時後取/);
  const receipt=renderPrintDocument(state.templates.find(row=>row.documentType==='receipt'),order);
  assert.match(receipt.text,/原價：\$228/);
  assert.match(receipt.text,/優惠：-\$10/);
  assert.match(receipt.text,/實收：\$220/);
  assert.match(receipt.text,/找續：\$2/);
  assert.match(receipt.text,/電話：85261234567/);
  const label=renderPrintDocument(state.templates.find(row=>row.documentType==='label'),order);
  assert.match(label.text,/P055/);
  assert.match(label.text,/1\/1/);
  assert.match(label.text,/磨飯/);
  assert.match(label.text,/F4紫米餐/);
  assert.match(label.text,/外賣/);
  assert.match(label.text,/蜜糖芥末雞絲/);
  assert.match(label.text,/外賣盒.*\$1/);
});

test('舊非 P 渠道訂單重印保留原識別而不會顯示測試工作',()=>{
  const template=defaultPrinterState(1000).templates.find(row=>row.documentType==='receipt');
  const document=renderPrintDocument(template,{...order,id:'K0061',displayOrderNo:''});
  assert.match(document.text,/訂單：K0061/);
  assert.doesNotMatch(document.text,/測試工作/);
});

test('打印工作按用途及格式路由，未設定設備會停在 blocked 而非假成功',()=>{
  const state=defaultPrinterState(1000);
  let result=createPrintJobs(order,state,{now:2000});
  assert.ok(result.jobs.some(job=>job.status==='blocked'));
  const printers=state.printers.map((row,index)=>row.transport==='network'?{...row,host:`192.168.1.${201+index}`,port:9100}:row);
  result=createPrintJobs(order,{...state,printers},{now:3000});
  assert.ok(result.jobs.length>=4);
  assert.ok(result.jobs.every(job=>job.status==='queued'&&job.bridgeStatus==='waiting_bridge'));
  assert.equal(result.jobs.filter(job=>job.documentType==='label').length,1);
  assert.equal(result.jobs.find(job=>job.documentType==='label').copies,1);
});

test('重試沿用同一工作並增加嘗試；改送會保存原目的地',()=>{
  const state=defaultPrinterState(1000);
  const printer={...state.printers[1],host:'192.168.1.201',port:9100};
  const job={id:'JOB-1',printerId:'kitchen-1',status:'failed',attempts:1,errors:[{message:'timeout'}],history:[]};
  const retried=retryPrintJob(job,{now:4000});
  assert.equal(retried.id,'JOB-1');
  assert.equal(retried.attempts,2);
  assert.equal(retried.status,'queued');
  const rerouted=reroutePrintJob(retried,printer,{now:5000});
  assert.equal(rerouted.printerId,printer.id);
  assert.equal(rerouted.history.at(-1).fromPrinterId,'kitchen-1');
});

test('安卓橋接封包包含傳輸資料、格式內容及冪等工作編號',()=>{
  const state=defaultPrinterState(1000),printer={...state.printers[1],host:'192.168.1.201',port:9100};
  const template=state.templates.find(row=>row.documentType==='production');
  const document=renderPrintDocument(template,order);
  const payload=buildAndroidPrintPayload({id:'JOB-1',copies:1,documentType:'production'},printer,document);
  assert.equal(payload.contract,'morefun.print.v1');
  assert.equal(payload.idempotencyKey,'JOB-1');
  assert.deepEqual(payload.target,{transport:'tcp',host:'192.168.1.201',port:9100});
  assert.match(payload.content.text,/合併統計/);
});

test('設備診斷會分開設定驗證、瀏覽器限制及安卓橋接狀態',()=>{
  const state=defaultPrinterState(1000),printer={...state.printers[1],host:'192.168.1.201',port:9100};
  const browserOnly=diagnosePrinterConfiguration(printer,{bridgeConnected:false,now:5000});
  assert.equal(browserOnly.configuration,'valid');
  assert.equal(browserOnly.rawTcpAvailable,false);
  assert.equal(browserOnly.status,'waiting_bridge');
  const connected=diagnosePrinterConfiguration(printer,{bridgeConnected:true,now:6000});
  assert.equal(connected.status,'ready_for_test_print');
});

test('現有訂單與堂食打印工作可去重匯入中央工作佇列',()=>{
  const state={...defaultPrinterState(1000),jobs:[{id:'EXISTING',status:'queued'}]};
  const next=importExternalPrintJobs(state,{orders:[{id:'P1',printJobs:[{id:'EXISTING'},{id:'ORDER-JOB',document:'顧客小票',status:'queued'}]}],dine:{tables:[{id:'1',session:{printJobs:[{id:'DINE-JOB',document:'製作單',status:'queued'}]}}]}},{now:6000});
  assert.deepEqual(next.jobs.map(job=>job.id),['EXISTING','ORDER-JOB','DINE-JOB']);
  assert.equal(next.jobs.find(job=>job.id==='DINE-JOB').sourceRef.tableId,'1');
});
