import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {
  applyOrderFilters,
  cancelOrder,
  changeOrderPayment,
  partiallyCancelItem,
  queueReprint,
  reconcilePayment,
  flagPaymentIssue,
  archiveExpiredOrders,
} from '../pages/orders/orders-domain.js';

const ordersPage=await readFile(new URL('../pages/orders/page.js',import.meta.url),'utf8');

const base={
  id:'P0054',group:'owned',source:'電話／WhatsApp',status:'running',amount:76,
  paymentMethod:'PayMe',paymentStatus:'付款待核實',printStatus:'異常',
  items:[{name:'叉燒飯',qty:1,total:58},{name:'凍檸茶',qty:2,total:18}],audit:[]
};

test('運行訂單滿三十分鐘會持久轉入歷史而唔係只改畫面',()=>{
  const acceptedAt=1_000;
  const active={...base,acceptedAt,autoCompleteAt:acceptedAt+30*60_000};
  assert.equal(archiveExpiredOrders([active],acceptedAt+29*60_000)[0].status,'running');
  const archived=archiveExpiredOrders([active],acceptedAt+48*60_000)[0];
  assert.equal(archived.status,'completed');
  assert.equal(archived.completedAt,acceptedAt+30*60_000);
  assert.equal(archived.audit.at(-1).type,'order_auto_completed');
  assert.deepEqual(applyOrderFilters([archived],{view:'history'}).map(row=>row.id),['P0054']);
  assert.match(ordersPage,/archiveExpiredOrders/);
  assert.match(ordersPage,/writeJSON\(ORDER_HISTORY_STORAGE_KEY, orders\)/);
  assert.match(ordersPage,/setInterval\(archiveAndRender,\s*60_000\)/);
});

test('filters can switch between source, payment exception, print exception and history',()=>{
  const rows=[base,{...base,id:'P0055',group:'onsite',status:'cancelled',paymentStatus:'已付款',printStatus:'正常'}];
  assert.deepEqual(applyOrderFilters(rows,{source:'電話／WhatsApp',view:'active'}).map(x=>x.id),['P0054']);
  assert.deepEqual(applyOrderFilters(rows,{exception:'payment',view:'active'}).map(x=>x.id),['P0054']);
  assert.deepEqual(applyOrderFilters(rows,{exception:'print',view:'active'}).map(x=>x.id),['P0054']);
  assert.deepEqual(applyOrderFilters(rows,{view:'history'}).map(x=>x.id),['P0055']);
});

test('changing channel and payment persists values and audit instead of only showing a toast',()=>{
  const changed=changeOrderPayment(base,{source:'現場',paymentMethod:'現金'},'SMT',1000);
  assert.equal(changed.source,'現場');
  assert.equal(changed.group,'onsite');
  assert.equal(changed.paymentMethod,'現金');
  assert.equal(changed.audit.at(-1).type,'order_payment_changed');
});

test('更改渠道會套用正式付款狀態，非現場渠道不可保留舊付款方式',()=>{
  const changed=changeOrderPayment({...base,paymentStatus:'已付款'},{source:'磨飯 App',paymentMethod:'現金付款',channelData:{pickupCode:'A12'}},'SMT',1000);
  assert.equal(changed.paymentMethod,'待核實');
  assert.equal(changed.paymentStatus,'付款待核實');
  assert.equal(changed.reconciliationStatus,'pending');
  assert.equal(changed.channelData.pickupCode,'A12');
  assert.equal(changed.audit.at(-1).previous.source,'電話／WhatsApp');
});

test('待核實訂單可核實付款或標記問題及通知客戶',()=>{
  const paid=reconcilePayment(base,{paymentMethod:'PayMe',paidAmount:76},'SMT',2000);
  assert.equal(paid.paymentStatus,'已付款');
  assert.equal(paid.reconciliationStatus,'verified');
  assert.equal(paid.paidAmount,76);
  assert.equal(paid.audit.at(-1).type,'payment_reconciled');
  const issue=flagPaymentIssue(base,{reason:'截圖不清楚',notifyCustomer:true},'SMT',3000);
  assert.equal(issue.reconciliationStatus,'issue');
  assert.equal(issue.customerNotification.status,'queued');
  assert.equal(issue.audit.at(-1).type,'payment_issue_flagged');
});

test('訂單頁待核實入口共用完整核數及通知客戶操作',()=>{
  assert.match(ordersPage,/data-action="reconcile-open"/);
  assert.match(ordersPage,/核實成功/);
  assert.match(ordersPage,/資料有問題/);
  assert.match(ordersPage,/通知客戶/);
  assert.match(ordersPage,/保留待處理/);
  assert.match(ordersPage,/付款證明/);
  assert.match(ordersPage,/data-payment-proof/);
  assert.match(ordersPage,/WhatsApp QR Code/);
  assert.match(ordersPage,/data-qr/);
});

test('問題原因提供快選亦容許留空，唔會卡住待處理流程',()=>{
  assert.match(ordersPage,/問題快選/);
  assert.match(ordersPage,/截圖不清楚/);
  assert.match(ordersPage,/金額不相符/);
  assert.match(ordersPage,/付款紀錄未找到/);
  assert.match(ordersPage,/付款資料需要跟進/);
  assert.doesNotMatch(ordersPage,/if\(!reason\).*請輸入問題原因/);
});

test('打印異常訂單由職員打開後勾選需要重印的文件',()=>{
  assert.match(ordersPage,/filter-print/);
  assert.match(ordersPage,/data-action="reprint"/);
  assert.match(ordersPage,/name="document"/);
  assert.match(ordersPage,/confirm-reprint/);
});

test('部分取消使用商品行內加減及一次確認，不再逐項使用下拉選單',()=>{
  assert.match(ordersPage,/cancel-mode/);
  assert.match(ordersPage,/data-action="cancel-minus"/);
  assert.match(ordersPage,/data-action="cancel-plus"/);
  assert.match(ordersPage,/確認取消/);
  assert.doesNotMatch(ordersPage,/data-cancel-index|<select/);
});

test('partial cancellation keeps cancelled quantity visible and recalculates total',()=>{
  const changed=partiallyCancelItem(base,1,1,'SMT',1000);
  assert.equal(changed.items[1].qty,1);
  assert.equal(changed.items[1].cancelledQty,1);
  assert.equal(changed.amount,67);
  assert.equal(changed.audit.at(-1).type,'order_item_partially_cancelled');
});

test('whole-order cancellation remains in history instead of disappearing',()=>{
  const changed=cancelOrder(base,'SMT',1000);
  assert.equal(changed.status,'cancelled');
  assert.equal(changed.audit.at(-1).type,'order_cancelled');
});

test('reprint creates a visible print job and clears the exception after retry',()=>{
  const changed=queueReprint(base,['製作單','標籤'],'SMT',1000);
  assert.equal(changed.printStatus,'已排隊');
  assert.deepEqual(changed.printJobs.at(-1).documents,['製作單','標籤']);
  assert.equal(changed.audit.at(-1).type,'order_reprint_queued');
});
