import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeIncomingOrder,enqueueIncoming,acceptIncoming,rejectIncoming,pendingIncoming,
  INCOMING_STATUS_PENDING,INCOMING_STATUS_ACCEPTED,INCOMING_STATUS_REJECTED
} from '../pages/orders/incoming-queue-domain.js';

test('normalizes platform source without changing order truth',()=>{
  const item=normalizeIncomingOrder({source:'Keeta',id:'K100',items:[{name:'飯團',qty:1,total:45}],payment:{status:'paid'}},1000);
  assert.equal(item.group,'platform');
  assert.equal(item.status,INCOMING_STATUS_PENDING);
  assert.equal(item.amount,45);
  assert.equal(item.idempotencyKey,'Keeta:K100');
});

test('same idempotency key cannot create duplicate intake',()=>{
  const first=enqueueIncoming([],{source:'Foodpanda',id:'F1'},1000);
  const second=enqueueIncoming(first.queue,{source:'Foodpanda',id:'F1'},2000);
  assert.equal(second.duplicate,true);
  assert.equal(second.queue.length,1);
});

test('accept keeps same intake identity',()=>{
  const first=enqueueIncoming([],{source:'磨飯 Web',id:'W1'},1000);
  const result=acceptIncoming(first.queue,first.item.intakeId,1500);
  assert.equal(result.item.status,INCOMING_STATUS_ACCEPTED);
  assert.equal(result.item.idempotencyKey,first.item.idempotencyKey);
  assert.equal(result.item.acceptedAt,1500);
});

test('reject requires reason and keeps item for audit',()=>{
  const first=enqueueIncoming([],{source:'WhatsApp',id:'WA1'},1000);
  assert.throws(()=>rejectIncoming(first.queue,first.item.intakeId,''));
  const result=rejectIncoming(first.queue,first.item.intakeId,'重複落單',1600);
  assert.equal(result.item.status,INCOMING_STATUS_REJECTED);
  assert.equal(result.item.rejectReason,'重複落單');
  assert.equal(result.queue.length,1);
});

test('pending queue is oldest first',()=>{
  let queue=enqueueIncoming([],{source:'電話',id:'2'},2000).queue;
  queue=enqueueIncoming(queue,{source:'磨飯 App',id:'1'},1000).queue;
  assert.deepEqual(pendingIncoming(queue).map(x=>x.externalId),['1','2']);
});
