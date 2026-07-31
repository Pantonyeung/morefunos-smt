import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createMemoryStorage,
  createSupplyRuntime,
  STAFF_SESSION_STORAGE_KEY,
  SUPPLY_PENDING_STORAGE_KEY,
  SUPPLY_STORAGE_KEY
} from '../shared/supply-runtime.js';

function jsonResponse(payload,status=200){
  return new Response(JSON.stringify(payload),{status,headers:{'content-type':'application/json'}});
}

function sessionSeed({source='smt',deviceId='SMT-01'}={}){
  return JSON.stringify({
    token:'staff-token',
    staff:{staffNumber:'MOREFUN',name:'店員'},
    source,
    deviceId,
    expiresAt:Date.now()+60_000
  });
}

test('register profile logs in as SMT and sends the terminal identity',async()=>{
  const calls=[];
  const runtime=createSupplyRuntime({
    source:'smt',deviceId:'SMT-01',storage:createMemoryStorage(),
    fetchImpl:async(url,init={})=>{
      calls.push({url,init,body:init.body?JSON.parse(init.body):null});
      return jsonResponse({ok:true,token:'token-smt',staff:{staffNumber:'MOREFUN'},expiresInSeconds:3600});
    }
  });
  await runtime.login({staffNumber:'morefun',password:'morefun'});
  assert.equal(calls[0].url,'/v1/staff/login');
  assert.equal(calls[0].body.source,'smt');
  assert.equal(calls[0].body.deviceId,'SMT-01');
  assert.equal(runtime.getSession().source,'smt');
});

test('mobile profile logs in as SMM and uses the same staff API contract',async()=>{
  const calls=[];
  const runtime=createSupplyRuntime({
    source:'smm',deviceId:'SMM-01',storage:createMemoryStorage(),
    fetchImpl:async(url,init={})=>{
      calls.push({url,body:init.body?JSON.parse(init.body):null});
      return jsonResponse({ok:true,token:'token-smm',staff:{staffNumber:'MOREFUN'},expiresInSeconds:3600});
    }
  });
  await runtime.login({staffNumber:'morefun',password:'morefun'});
  assert.equal(calls[0].body.source,'smm');
  assert.equal(calls[0].body.deviceId,'SMM-01');
  assert.equal(runtime.getSession().source,'smm');
});

test('a persisted SMT token is never reused by the SMM mobile profile',()=>{
  const storage=createMemoryStorage({[STAFF_SESSION_STORAGE_KEY]:sessionSeed({source:'smt',deviceId:'SMT-01'})});
  const runtime=createSupplyRuntime({source:'smm',deviceId:'SMM-01',storage,fetchImpl:async()=>jsonResponse({ok:false},500)});
  assert.equal(runtime.getSession(),null);
  assert.equal(storage.getItem(STAFF_SESSION_STORAGE_KEY),null);
  assert.equal(runtime.getState().status,'session-required');
});

test('401 clears only the staff session and preserves local sold-out plus pending queue',async()=>{
  const storage=createMemoryStorage({
    [STAFF_SESSION_STORAGE_KEY]:sessionSeed(),
    [SUPPLY_STORAGE_KEY]:JSON.stringify({F4:{status:'soldout',updatedAt:Date.now()}}),
    [SUPPLY_PENDING_STORAGE_KEY]:JSON.stringify([{productId:'F4',status:'soldout'}])
  });
  const runtime=createSupplyRuntime({
    source:'smt',deviceId:'SMT-01',storage,
    fetchImpl:async()=>jsonResponse({ok:false,error:'expired-session'},401)
  });
  const result=await runtime.flushPending();
  assert.equal(result.ok,false);
  assert.equal(result.status,401);
  assert.equal(runtime.getSession(),null);
  assert.equal(runtime.getState().status,'session-required');
  assert.equal(runtime.getPending().length,1);
  assert.equal(runtime.getOverrides().F4.status,'soldout');
  assert.equal(storage.getItem(STAFF_SESSION_STORAGE_KEY),null);
});

test('network failure keeps the valid session and queues the local change for retry',async()=>{
  const storage=createMemoryStorage({
    [STAFF_SESSION_STORAGE_KEY]:sessionSeed(),
    [SUPPLY_STORAGE_KEY]:JSON.stringify({F4:{status:'soldout',updatedAt:Date.now()}}),
    [SUPPLY_PENDING_STORAGE_KEY]:JSON.stringify([{productId:'F4',status:'soldout'}])
  });
  const runtime=createSupplyRuntime({
    source:'smt',deviceId:'SMT-01',storage,
    fetchImpl:async()=>{throw new Error('network-offline')}
  });
  const result=await runtime.flushPending();
  assert.equal(result.ok,false);
  assert.equal(runtime.getState().status,'offline-local');
  assert.equal(runtime.getSession().token,'staff-token');
  assert.equal(runtime.getPending().length,1);
  assert.equal(runtime.getOverrides().F4.status,'soldout');
});
