import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createDraftRecord,
  nextDraftNumber,
  recordCheckoutOperator,
  restoreDraftForTerminal
} from '../shared/operations.js';

test('draft numbers are sequential within each terminal prefix',()=>{
  const drafts=[{draftNumber:'SMT-01'},{draftNumber:'SMT-02'},{draftNumber:'SMM-01'}];
  assert.equal(nextDraftNumber(drafts,'SMT'),'SMT-03');
  assert.equal(nextDraftNumber(drafts,'SMM'),'SMM-02');
});

test('a removed draft number is never reissued after retrieval',()=>{
  assert.equal(nextDraftNumber([],'SMT',{SMT:7}),'SMT-08');
  const draft=createDraftRecord({cart:[],terminalId:'SMT',drafts:[],counters:{SMT:7},now:100});
  assert.equal(draft.draftNumber,'SMT-08');
});

test('saving a cart records terminal ownership and an audit event',()=>{
  const draft=createDraftRecord({cart:[{lineId:'l1',name:'飯團',qty:1}],terminalId:'SMT',drafts:[],now:100});
  assert.equal(draft.draftNumber,'SMT-01');
  assert.equal(draft.ownerTerminalId,'SMT');
  assert.equal(draft.audit[0].type,'draft.created');
  assert.equal(draft.audit[0].terminalId,'SMT');
});

test('taking over another terminal draft preserves lineage',()=>{
  const original=createDraftRecord({cart:[{lineId:'l1',name:'飯團',qty:1}],terminalId:'SMT',drafts:[],now:100});
  const restored=restoreDraftForTerminal(original,'SMM',200);
  assert.equal(restored.cart[0].name,'飯團');
  assert.equal(restored.session.originDraftNumber,'SMT-01');
  assert.equal(restored.session.activeTerminalId,'SMM');
  assert.equal(restored.session.audit.at(-1).type,'draft.taken_over');
});

test('日結會清空當時所有草稿，而新營業日草稿不會被誤刪',async()=>{
  const {clearDraftsForDayClose,clearExpiredBusinessDayDrafts}=await import('../shared/operations.js');
  const drafts=[{id:'old',createdAt:100},{id:'new',createdAt:200}];
  const closed=clearDraftsForDayClose(drafts,{terminalId:'SMT',now:300});
  assert.deepEqual(closed.remaining,[]);
  assert.deepEqual(closed.voided.map(x=>x.status),['voided','voided']);
  const boundary=clearExpiredBusinessDayDrafts([
    {id:'before',createdAt:new Date(2026,6,21,4,59).getTime()},
    {id:'after',createdAt:new Date(2026,6,21,5,1).getTime()}
  ],new Date(2026,6,21,6,0).getTime());
  assert.deepEqual(boundary.remaining.map(x=>x.id),['after']);
});

test('a taken-over cart is renumbered under the terminal that saves it again',()=>{
  const original=createDraftRecord({cart:[{lineId:'l1',name:'飯團',qty:1}],terminalId:'SMT',drafts:[],now:100});
  const {cart,session}=restoreDraftForTerminal(original,'SMM',200);
  const resaved=createDraftRecord({cart,terminalId:'SMM',drafts:[original],session,now:300});
  assert.equal(resaved.draftNumber,'SMM-01');
  assert.equal(resaved.originDraftNumber,'SMT-01');
  assert.deepEqual(resaved.audit.map(x=>x.type),['draft.created','draft.taken_over','draft.resaved']);
});

test('checkout records which terminal completed the order',()=>{
  const order=recordCheckoutOperator({id:'P0056',audit:[]},'SMM',400);
  assert.equal(order.checkoutTerminalId,'SMM');
  assert.equal(order.audit[0].type,'order.checked_out');
  assert.equal(order.audit[0].terminalId,'SMM');
});
