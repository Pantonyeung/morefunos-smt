import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORDER_ACTION,
  canPerformOrderAction,
  reopenCompletedOrder,
  voidOrderItem,
  duplicateOrderForNewCart
} from '../pages/orders/order-recovery-domain.js';

const staff={staffId:'S1',staffName:'店員'};
const manager={...staff,managerAuthorized:true};
const completed={id:'O100',status:'completed',completedAt:1000,lines:[
  {lineId:'L1',productId:'P1',name:'飯團',qty:1,total:41},
  {lineId:'L2',productId:'P2',name:'飲品',qty:1,total:8}
]};

test('manager actions require explicit manager authorization',()=>{
  assert.equal(canPerformOrderAction(ORDER_ACTION.REOPEN,staff),false);
  assert.equal(canPerformOrderAction(ORDER_ACTION.REOPEN,manager),true);
  assert.equal(canPerformOrderAction(ORDER_ACTION.DUPLICATE,staff),true);
});

test('completed order can reopen without mutating source',()=>{
  const result=reopenCompletedOrder(completed,{actor:manager,reason:'客人要求加單',at:2000});
  assert.equal(result.order.status,'running');
  assert.equal(result.order.reopenedAt,2000);
  assert.equal(result.order.completedAt,null);
  assert.equal(completed.status,'completed');
  assert.equal(result.audit.action,'reopen');
  assert.equal(result.audit.reason,'客人要求加單');
});

test('reopen rejects non-manager',()=>{
  assert.throws(()=>reopenCompletedOrder(completed,{actor:staff}),/MANAGER_AUTH_REQUIRED/);
});

test('void item requires reason and keeps line for audit truth',()=>{
  assert.throws(()=>voidOrderItem(completed,'L1',{actor:manager}),/VOID_REASON_REQUIRED/);
  const result=voidOrderItem(completed,'L1',{actor:manager,reason:'重複落單',at:3000});
  const line=result.order.lines.find(item=>item.lineId==='L1');
  assert.equal(line.voided,true);
  assert.equal(line.voidReason,'重複落單');
  assert.equal(result.order.lines.length,2);
  assert.equal(result.audit.meta.lineId,'L1');
});

test('duplicate order excludes voided items and creates new line ids',()=>{
  const source={...completed,lines:[completed.lines[0],{...completed.lines[1],voided:true}]};
  const result=duplicateOrderForNewCart(source,{idFactory:(_,index)=>`NEW-${index}`,at:4000});
  assert.equal(result.sourceOrderId,'O100');
  assert.equal(result.cart.length,1);
  assert.equal(result.cart[0].lineId,'NEW-0');
  assert.equal(result.cart[0].productId,'P1');
});
