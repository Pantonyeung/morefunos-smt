import {readRuntimeSnapshot} from './runtime-snapshot-store.js';
import {getPushQueueState} from './push-queue.js';

export function getRuntimeStatus(){
  const stored=readRuntimeSnapshot();
  const snapshot=stored?.snapshot||null;
  const queue=getPushQueueState();
  return Object.freeze({
    ready:Boolean(snapshot),
    mode:String(stored?.source||'unknown'),
    runtimeVersion:Number(snapshot?.runtimeVersion||0),
    storeStatus:String(snapshot?.storeStatus||'open'),
    waitMinutes:Number(snapshot?.waitMinutes||0),
    updatedAt:snapshot?.updatedAt||null,
    queuedWrites:Number(queue?.count||0),
    offline:Boolean(queue?.count>0),
    snapshot
  });
}

export function subscribeRuntimeStatus(listener){
  if(typeof listener!=='function')throw new TypeError('listener must be a function');
  const emit=()=>listener(getRuntimeStatus());
  const events=['morefun:runtime-ready','morefun:runtime-bootstrap-failed','morefun:runtime-stopped','morefun:runtime-snapshot-changed','morefun:push-queue-changed'];
  events.forEach(name=>window.addEventListener(name,emit));
  emit();
  return()=>events.forEach(name=>window.removeEventListener(name,emit));
}
