import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createMemoryStorage,
  createSupplyRuntime,
  diffSupplyOverrides,
  normalizeSupplyOverrides,
  STAFF_SESSION_STORAGE_KEY,
  SUPPLY_PENDING_STORAGE_KEY,
  SUPPLY_STORAGE_KEY
} from '../shared/supply-runtime.js';


test('supply override normalization supports canonical and legacy status aliases',()=>{
  assert.deepEqual(normalizeSupplyOverrides([
    {product_id:'F4',availability_status:'sold_out',updated_at:'2026-07-31T01:00:00.000Z'},
    {product_id:'R1',availability_status:'paused'},
    {product_id:'D1',availability_status:'available'}
  ]),{
    F4:{status:'soldout',updatedAt:Date.parse('2026-07-31T01:00:00.000Z'),expiresAt:0,source:'',deviceId:''},
    R1:{status:'paused',updatedAt:0,expiresAt:0,source:'',deviceId:''}
  });
});

test('local changes collapse to the latest status per product',()=>{
  assert.deepEqual(diffSupplyOverrides(
    {F4:{status:'available'},R1:{status:'soldout'}},
    {F4:{status:'paused'},R1:{status:'available'},D1:{status:'soldout'}}
  ),[
    {productId:'D1',status:'soldout'},
    {productId:'F4',status:'paused'},
    {productId:'R1',status:'available'}
  ]);
});

test('SMT and SMM share Staff login, pending queue, PATCH and GET refresh',async()=>{
  const storage=createMemoryStorage();
  const calls=[];
  const fetchImpl=async(url,options={})=>{
    calls.push({url:String(url),method:options.method||'GET',body:options.body||''});
    if(String(url).endsWith('/v1/staff/login'))return new Response(JSON.stringify({ok:true,token:'staff-token',staff:{staffNumber:'MOREFUN',name:'店員'},expiresInSeconds:3600}),{status:200,headers:{'content-type':'application/json'}});
    if((options.method||'GET')==='PATCH')return new Response(JSON.stringify({
      ok:true,
      updated:[{requestedProductId:'f4',productId:'F4',from:'available',to:'soldout'}],
      availability:[
        {product_id:'F4',canonical_product_id:'F4',availability_status:'soldout',source:'smm',device_id:'mobile-01'},
        {product_id:'f4',canonical_product_id:'F4',alias_of:'F4',availability_status:'soldout',source:'smm',device_id:'mobile-01'}
      ],
      updatedAt:'2026-07-31T01:00:00.000Z'
    }),{status:200,headers:{'content-type':'application/json'}});
    return new Response(JSON.stringify({
      ok:true,
      availability:[
        {product_id:'R1',canonical_product_id:'R1',availability_status:'paused',source:'smt',device_id:'smt-01'},
        {product_id:'r1',canonical_product_id:'R1',alias_of:'R1',availability_status:'paused',source:'smt',device_id:'smt-01'}
      ],
      updatedAt:'2026-07-31T01:01:00.000Z'
    }),{status:200,headers:{'content-type':'application/json'}});
  };
  const runtime=createSupplyRuntime({storage,fetchImpl,baseUrl:'https://worker.test',source:'smm',deviceId:'mobile-01'});
  await runtime.login({staffNumber:'morefun',password:'morefun'});
  assert.equal(runtime.getSession().token,'staff-token');
  assert.equal(JSON.parse(storage.getItem(STAFF_SESSION_STORAGE_KEY)).source,'smm');

  runtime.captureLocalChange({}, {f4:{status:'soldout',updatedAt:1}});
  assert.deepEqual(runtime.getPending(),[{productId:'f4',status:'soldout'}]);
  assert.equal(JSON.parse(storage.getItem(SUPPLY_PENDING_STORAGE_KEY)).length,1);
  const flushed=await runtime.flushPending();
  assert.equal(flushed.ok,true);
  assert.deepEqual(runtime.getPending(),[]);
  assert.equal(runtime.getOverrides().F4.status,'soldout');
  assert.equal(runtime.getOverrides().f4.status,'soldout');
  assert.equal(calls.some(call=>call.method==='PATCH'),true);

  const refreshed=await runtime.refresh();
  assert.equal(refreshed.ok,true);
  assert.equal(runtime.getOverrides().R1.status,'paused');
  assert.equal(runtime.getOverrides().r1.status,'paused');
});

test('offline mode preserves local supply state and queued changes',async()=>{
  const storage=createMemoryStorage({
    [SUPPLY_STORAGE_KEY]:JSON.stringify({f4:{status:'soldout',updatedAt:20}}),
    [SUPPLY_PENDING_STORAGE_KEY]:JSON.stringify([{productId:'f4',status:'soldout'}]),
    [STAFF_SESSION_STORAGE_KEY]:JSON.stringify({token:'token',staff:{staffNumber:'MOREFUN'},source:'smt',deviceId:'smt-01',expiresAt:Date.now()+3600000})
  });
  const runtime=createSupplyRuntime({storage,fetchImpl:async()=>{throw new Error('offline')},baseUrl:'https://worker.test'});
  const result=await runtime.boot();
  assert.equal(result.overrides.f4.status,'soldout');
  assert.deepEqual(runtime.getPending(),[{productId:'f4',status:'soldout'}]);
  assert.equal(runtime.getState().status,'offline-local');
});

test('cross-context storage reload picks up child iframe login and local changes',()=>{
  const storage=createMemoryStorage();
  const runtime=createSupplyRuntime({storage,fetchImpl:async()=>{throw new Error('not-used')},baseUrl:'https://worker.test'});
  storage.setItem(STAFF_SESSION_STORAGE_KEY,JSON.stringify({token:'child-token',staff:{staffNumber:'MOREFUN'},source:'smt',deviceId:'smt-01',expiresAt:Date.now()+3600000}));
  storage.setItem(SUPPLY_STORAGE_KEY,JSON.stringify({f4:{status:'soldout',updatedAt:10}}));
  storage.setItem(SUPPLY_PENDING_STORAGE_KEY,JSON.stringify([{productId:'f4',status:'soldout'}]));
  runtime.reloadFromStorage();
  assert.equal(runtime.getSession().token,'child-token');
  assert.equal(runtime.getOverrides().f4.status,'soldout');
  assert.deepEqual(runtime.getPending(),[{productId:'f4',status:'soldout'}]);
});
