import {enqueuePush,flushPushQueue,getPushQueueState,clearPushQueue} from './push-queue.js';
import {applyRuntimeSnapshot,readRuntimeSnapshot,clearRuntimeSnapshot} from './runtime-snapshot-store.js';

const QUEUE_KEY='morefun:smt:push-queue:v1';
const SNAPSHOT_KEY='morefun:smt:runtime-snapshot:v1';

function cloneStorageValue(key){return localStorage.getItem(key);}
function restoreStorageValue(key,value){
  if(value===null)localStorage.removeItem(key);
  else localStorage.setItem(key,value);
}

function result(name,ok,detail=null){return Object.freeze({name,ok:Boolean(ok),detail});}

export async function runRuntimeSelfTest(){
  const queueBackup=cloneStorageValue(QUEUE_KEY);
  const snapshotBackup=cloneStorageValue(SNAPSHOT_KEY);
  const results=[];
  const startedAt=new Date().toISOString();

  try{
    clearPushQueue();
    clearRuntimeSnapshot();

    const first=enqueuePush({type:'selftest.event',payload:{value:1},idempotencyKey:'selftest-fixed-key'});
    const second=enqueuePush({type:'selftest.event',payload:{value:2},idempotencyKey:'selftest-fixed-key'});
    results.push(result('queue_enqueue',first.count===1,{count:first.count}));
    results.push(result('queue_idempotency',second.count===1,{count:second.count}));

    await flushPushQueue({sender:async()=>({ok:true})});
    results.push(result('queue_success_removal',getPushQueueState().count===0,{count:getPushQueueState().count}));

    enqueuePush({type:'selftest.retry',payload:{value:3},idempotencyKey:'selftest-retry-key'});
    await flushPushQueue({sender:async()=>{throw new Error('selftest_expected_failure');}});
    const failed=getPushQueueState();
    results.push(result('queue_failure_retained',failed.count===1,{count:failed.count}));
    results.push(result('queue_attempt_incremented',failed.items[0]?.attempts===1,{attempts:failed.items[0]?.attempts}));
    results.push(result('queue_error_recorded',failed.items[0]?.lastError==='selftest_expected_failure',{lastError:failed.items[0]?.lastError}));

    const snapshot={revision:'selftest-r1',menu:{items:[{id:'test'}]},settings:{mode:'selftest'}};
    applyRuntimeSnapshot(snapshot,{revision:snapshot.revision});
    const cached=readRuntimeSnapshot();
    results.push(result('snapshot_write_read',cached?.snapshot?.revision==='selftest-r1',{revision:cached?.snapshot?.revision}));
    results.push(result('snapshot_atomic_shape',Array.isArray(cached?.snapshot?.menu?.items),null));
  }catch(error){
    results.push(result('selftest_execution',false,String(error?.message||error)));
  }finally{
    restoreStorageValue(QUEUE_KEY,queueBackup);
    restoreStorageValue(SNAPSHOT_KEY,snapshotBackup);
    window.dispatchEvent(new CustomEvent('morefun:push-queue-change',{detail:getPushQueueState()}));
  }

  const passed=results.filter(item=>item.ok).length;
  const report=Object.freeze({
    ok:passed===results.length,
    passed,
    failed:results.length-passed,
    total:results.length,
    startedAt,
    finishedAt:new Date().toISOString(),
    results
  });
  window.dispatchEvent(new CustomEvent('morefun:runtime-self-test',{detail:report}));
  return report;
}