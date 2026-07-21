import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyOrderFilters,
  cancelOrder,
  changeOrderPayment,
  partiallyCancelItem,
  queueReprint,
} from '../pages/orders/orders-domain.js';

const base={
  id:'P0054',group:'owned',source:'電話／WhatsApp',status:'running',amount:76,
  paymentMethod:'PayMe',paymentStatus:'付款待核實',printStatus:'異常',
  items:[{name:'叉燒飯',qty:1,total:58},{name:'凍檸茶',qty:2,total:18}],audit:[]
};

test('filters can switch between source, payment exception, print exception and history',()=>{
  const rows=[base,{...base,id:'P0055',group:'onsite',status:'cancelled',paymentStatus:'已付款',printStatus:'正常'}];
  assert.deepEqual(applyOrderFilters(rows,{source:'owned',view:'active'}).map(x=>x.id),['P0054']);
  assert.deepEqual(applyOrderFilters(rows,{exception:'payment',view:'active'}).map(x=>x.id),['P0054']);
  assert.deepEqual(applyOrderFilters(rows,{exception:'print',view:'active'}).map(x=>x.id),['P0054']);
  assert.deepEqual(applyOrderFilters(rows,{view:'history'}).map(x=>x.id),['P0055']);
});

test('changing channel and payment persists values and audit instead of only showing a toast',()=>{
  const changed=changeOrderPayment(base,{source:'堂食',paymentMethod:'現金付款'},'SMT',1000);
  assert.equal(changed.source,'堂食');
  assert.equal(changed.group,'onsite');
  assert.equal(changed.paymentMethod,'現金付款');
  assert.equal(changed.audit.at(-1).type,'order_payment_changed');
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
