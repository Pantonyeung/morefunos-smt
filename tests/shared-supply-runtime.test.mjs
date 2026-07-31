import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createMemoryStorage,
  createSupplyRuntime,
  diffSupplyOverrides,
  normalizeSupplyOverrides
} from '../shared/supply-runtime.js';

test('normalizes shared SMT/SMM supply states',()=>{
  assert.deepEqual(normalizeSupplyOverrides([
    {product_id:'F4',availability_status:'sold_out',updated_at:'2026-07-31T01:00:00.000Z'},
    {product_id:'R1',availability_status:'paused'},
    {product_id:'D1',availability_status:'available'}
  ]),{
    F4:{status:'soldout',updatedAt:Date.parse('2026-07-31T01:00:00.000Z'),expiresAt:0,source:'',deviceId:''},
    R1:{status:'paused',updatedAt:0,expiresAt:0,source:'',deviceId:''}
  });
});

test('diffs available, soldout and paused changes',()=>{
  assert.deepEqual(diffSupplyOverrides(
    {F4:{status:'available'},R1:{status:'soldout'}},
    {F4:{status:'paused'},R1:{status:'available'},D1:{status:'soldout'}}
  ),[
    {productId:'D1',status:'soldout'},
    {productId:'F4',status:'paused'},
    {productId:'R1',status:'available'}
  ]);
});

test('queues local changes, flushes with Staff Session and refreshes remote state',async()=>{
  const storage=createMemoryStorage();
  const calls=[];
  const fetchImpl=async(url,options={})=>{
    calls.push({url:String(url),method:options.method||'GET',body:options.body||'',authorization:options.headers?.authorization||''});
    if(String(url).endsWith('/v1/staff/login'))return new Response(JSON.stringify({ok:true,token:'staff-token',staff:{staffNumber:'MOREFUN',name:'店員'},expiresInSeconds:3600}),{status:200,headers:{'content-type':'application/json'}});
    if((options.method||'GET')==='PATCH')return new Response(JSON.stringify({ok:true,availability:[{product_id:'F4',availability_status:'soldout',source:'smm',device_id:'mobile-01'}],updatedAt:'2026-07-31T02:00:00.000Z'}),{status:200,headers:{'content-type':'application/json'}});
    return new Response(JSON.stringify({ok:true,availability:[{product_id:'R1',availability_status:'paused',source:'smt',device_id:'smt-01'}],updatedAt:'2026-07-31T02:01:00.000Z'}),{status:200,headers:{'content-type':'application/json'}});
  };
  const runtime=createSupplyRuntime({storage,fetchImpl,baseUrl:'',source:'smm',deviceId:'mobile-01',globalObject:{dispatchEvent(){},setInterval(){return 1},clearInterval(){}}});
  await runtime.login({staffNumber:'morefun',password:'morefun'});
  runtime.captureLocalSnapshot({F4:{status:'soldout',updatedAt:1}});
  assert.deepEqual(runtime.getPending(),[{productId:'F4',status:'soldout'}]);
  await runtime.flushPending();
  assert.deepEqual(runtime.getPending(),[]);
  assert.equal(runtime.getOverrides().F4.status,'soldout');
  assert.equal(calls.some(call=>call.method==='PATCH'&&call.authorization==='Bearer staff-token'),true);
  await runtime.refresh();
  assert.equal(runtime.getOverrides().R1.status,'paused');
});

test('keeps local supply and pending queue when network is unavailable',async()=>{
  const storage=createMemoryStorage({
    'morefun:smt:v1:supply-overrides':JSON.stringify({F4:{status:'soldout',updatedAt:20}})
  });
  const runtime=createSupplyRuntime({storage,fetchImpl:async()=>{throw new Error('offline')},baseUrl:'',globalObject:{dispatchEvent(){},setInterval(){return 1},clearInterval(){}}});
  runtime.captureLocalSnapshot({F4:{status:'soldout',updatedAt:20},R1:{status:'paused',updatedAt:30}});
  const result=await runtime.flushPending();
  assert.equal(result.ok,false);
  assert.equal(runtime.getOverrides().F4.status,'soldout');
  assert.equal(runtime.getOverrides().R1.status,'paused');
  assert.deepEqual(runtime.getPending(),[{productId:'R1',status:'paused'}]);
});
