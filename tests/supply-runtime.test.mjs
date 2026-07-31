import assert from 'node:assert/strict';
import {createMemoryStorage,createSupplyRuntime,diffSupplyOverrides,normalizeSupplyOverrides} from '../shared/supply-runtime.js';

assert.deepEqual(diffSupplyOverrides(
  {F4:{status:'available'},R1:{status:'soldout'}},
  {F4:{status:'paused'},R1:{status:'available'},D1:{status:'soldout'}}
),[
  {productId:'D1',status:'soldout'},
  {productId:'F4',status:'paused'},
  {productId:'R1',status:'available'}
]);

assert.deepEqual(normalizeSupplyOverrides([
  {product_id:'F4',availability_status:'soldout',updated_at:'2026-07-31T01:00:00.000Z'},
  {product_id:'R1',availability_status:'paused'},
  {product_id:'D1',availability_status:'available'}
]),{
  F4:{status:'soldout',updatedAt:Date.parse('2026-07-31T01:00:00.000Z'),expiresAt:0,source:'',deviceId:''},
  R1:{status:'paused',updatedAt:0,expiresAt:0,source:'',deviceId:''}
});

const storage=createMemoryStorage();
const calls=[];
const fetchImpl=async(url,options={})=>{
  calls.push({url:String(url),method:options.method||'GET',body:options.body||''});
  if(String(url).endsWith('/v1/staff/login'))return new Response(JSON.stringify({ok:true,token:'staff-token',staff:{staffNumber:'MOREFUN',name:'店員'},expiresInSeconds:3600}),{status:200,headers:{'content-type':'application/json'}});
  if((options.method||'GET')==='PATCH')return new Response(JSON.stringify({ok:true,availability:[{product_id:'F4',availability_status:'soldout',source:'smm',device_id:'mobile-01'}]}),{status:200,headers:{'content-type':'application/json'}});
  return new Response(JSON.stringify({ok:true,availability:[{product_id:'R1',availability_status:'paused',source:'smt',device_id:'smt-01'}]}),{status:200,headers:{'content-type':'application/json'}});
};
const runtime=createSupplyRuntime({storage,fetchImpl,baseUrl:'https://worker.test',source:'smm',deviceId:'mobile-01'});
await runtime.login({staffNumber:'morefun',password:'morefun'});
assert.equal(runtime.getSession().token,'staff-token');

runtime.captureLocalChange({}, {F4:{status:'soldout',updatedAt:1}});
assert.deepEqual(runtime.getPending(),[{productId:'F4',status:'soldout'}]);
const flushed=await runtime.flushPending();
assert.equal(flushed.ok,true);
assert.deepEqual(runtime.getPending(),[]);
assert.equal(runtime.getOverrides().F4.status,'soldout');
assert.equal(calls.some(call=>call.method==='PATCH'),true);

const refreshed=await runtime.refresh();
assert.equal(refreshed.ok,true);
assert.equal(runtime.getOverrides().R1.status,'paused');

const offlineStorage=createMemoryStorage({
  'morefun:smt:v1:supply-overrides':JSON.stringify({F4:{status:'soldout',updatedAt:20}})
});
const offline=createSupplyRuntime({storage:offlineStorage,fetchImpl:async()=>{throw new Error('offline')},baseUrl:'https://worker.test'});
const result=await offline.refresh();
assert.equal(result.ok,false);
assert.equal(offline.getOverrides().F4.status,'soldout');

console.log('Shared SMT/SMM supply runtime checks passed.');
