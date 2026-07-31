import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createMemoryStorage,
  createSupplyRuntime,
  STAFF_SESSION_STORAGE_KEY
} from '../shared/supply-runtime.js';

function jsonResponse(payload,status=200){
  return new Response(JSON.stringify(payload),{status,headers:{'content-type':'application/json'}});
}

function sessionSeed(){
  return JSON.stringify({
    token:'staff-token',
    staff:{staffNumber:'MOREFUN',name:'店員'},
    source:'smt',
    deviceId:'SMT-01',
    expiresAt:Date.now()+60_000
  });
}

test('remote aliases collapse to one canonical local state and cannot create a false restore',async()=>{
  const storage=createMemoryStorage({[STAFF_SESSION_STORAGE_KEY]:sessionSeed()});
  const runtime=createSupplyRuntime({
    source:'smt',deviceId:'SMT-01',storage,
    fetchImpl:async()=>jsonResponse({
      ok:true,
      availability:[
        {
          product_id:'CANON-1',
          canonical_product_id:'CANON-1',
          alias_of:null,
          availability_status:'soldout',
          updated_at:'2026-07-31T06:00:00.000Z'
        },
        {
          product_id:'LEGACY-1',
          canonical_product_id:'CANON-1',
          alias_of:'CANON-1',
          availability_status:'soldout',
          updated_at:'2026-07-31T06:00:00.000Z'
        }
      ],
      updatedAt:'2026-07-31T06:00:00.000Z'
    })
  });

  const refreshed=await runtime.refresh();
  assert.equal(refreshed.ok,true);
  assert.deepEqual(Object.keys(runtime.getOverrides()),['CANON-1']);
  assert.equal(runtime.getOverrides()['CANON-1'].status,'soldout');
  assert.equal(runtime.getOverrides()['LEGACY-1'],undefined);

  const captured=runtime.captureLocalSnapshot({
    'CANON-1':{status:'soldout',updatedAt:Date.now()}
  });

  assert.deepEqual(captured.updates,[]);
  assert.deepEqual(captured.pending,[]);
});

test('removing the canonical product creates exactly one restore mutation',async()=>{
  const storage=createMemoryStorage({[STAFF_SESSION_STORAGE_KEY]:sessionSeed()});
  const runtime=createSupplyRuntime({
    source:'smt',deviceId:'SMT-01',storage,
    fetchImpl:async()=>jsonResponse({
      ok:true,
      availability:[
        {product_id:'CANON-1',canonical_product_id:'CANON-1',availability_status:'soldout'},
        {product_id:'LEGACY-1',canonical_product_id:'CANON-1',alias_of:'CANON-1',availability_status:'soldout'}
      ]
    })
  });

  await runtime.refresh();
  const captured=runtime.captureLocalSnapshot({});

  assert.deepEqual(captured.updates,[{productId:'CANON-1',status:'available'}]);
  assert.deepEqual(captured.pending,[{productId:'CANON-1',status:'available'}]);
});
