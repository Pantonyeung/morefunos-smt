import {createLocalRuntimeAdapter} from './runtime-local-adapter.js';
import {createRuntimeController} from './runtime-controller.js';
import {readRuntimeSnapshot,clearRuntimeSnapshot} from './runtime-snapshot-store.js';
import {clearPushQueue,getPushQueueState} from './push-queue.js';
import {queueRuntimePatch,shutdownRuntime} from './runtime-bootstrap.js';

const LOCAL_KEY='morefun:smt:runtime-local-adapter:v1';
const SNAPSHOT_KEY='morefun:smt:runtime-snapshot:v1';
const QUEUE_KEY='morefun:smt:push-queue:v1';

function backup(key){return localStorage.getItem(key);}
function restore(key,value){if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}
function row(name,ok,detail=null){return Object.freeze({name,ok:Boolean(ok),detail});}

export async function runRuntimeIntegrationSelfTest(){
  const saved={local:backup(LOCAL_KEY),snapshot:backup(SNAPSHOT_KEY),queue:backup(QUEUE_KEY)};
  const results=[];
  const startedAt=new Date().toISOString();
  let controller=null;

  try{
    localStorage.removeItem(LOCAL_KEY);
    clearRuntimeSnapshot();
    clearPushQueue();

    const adapter=createLocalRuntimeAdapter();
    controller=createRuntimeController(adapter,{heartbeatMs:0});
    await controller.start();

    const initial=readRuntimeSnapshot()?.snapshot;
    results.push(row('bootstrap_pull',initial?.runtimeVersion===0,{version:initial?.runtimeVersion}));
    results.push(row('bootstrap_default_status',initial?.storeStatus==='open',{status:initial?.storeStatus}));

    await controller.push({waitMinutes:15},{source:'selftest'});
    const afterPush=readRuntimeSnapshot()?.snapshot;
    results.push(row('push_snapshot_apply',afterPush?.waitMinutes===15,{waitMinutes:afterPush?.waitMinutes}));
    results.push(row('push_version_increment',afterPush?.runtimeVersion===1,{version:afterPush?.runtimeVersion}));

    const conflict=await adapter.push({waitMinutes:20},{expectedVersion:0,source:'selftest'});
    results.push(row('version_conflict_rejected',conflict?.conflict===true,{error:conflict?.error}));

    shutdownRuntime();
    await queueRuntimePatch({storeStatus:'paused'},{source:'selftest',idempotencyKey:'runtime-selftest-queued'});
    results.push(row('offline_queue_retained',getPushQueueState().count===1,{count:getPushQueueState().count}));

    const reconnect=createRuntimeController(adapter,{heartbeatMs:0});
    await reconnect.start();
    controller=reconnect;
    const queued=getPushQueueState();
    results.push(row('queue_payload_shape',queued.items[0]?.type==='runtime.patch',{type:queued.items[0]?.type}));

    const subscribed=[];
    const unsubscribe=adapter.subscribe(value=>subscribed.push(value.runtimeVersion));
    await controller.push({storeStatus:'closed'},{source:'selftest'});
    unsubscribe();
    results.push(row('subscription_notified',subscribed.at(-1)===2,{versions:subscribed}));

    const invalid=await adapter.push({storeStatus:'invalid-status'},{expectedVersion:2,source:'selftest'});
    results.push(row('adapter_returns_payload',invalid?.ok===true&&invalid?.data?.storeStatus==='invalid-status',{status:invalid?.data?.storeStatus}));
  }catch(error){
    results.push(row('integration_execution',false,String(error?.message||error)));
  }finally{
    controller?.stop();
    shutdownRuntime();
    restore(LOCAL_KEY,saved.local);
    restore(SNAPSHOT_KEY,saved.snapshot);
    restore(QUEUE_KEY,saved.queue);
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
  window.dispatchEvent(new CustomEvent('morefun:runtime-integration-self-test',{detail:report}));
  return report;
}
