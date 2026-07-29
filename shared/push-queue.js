import {getHealthState} from './health-state.js';

const STORAGE_KEY='morefun:smt:push-queue:v1';
const listeners=new Set();
let flushing=false;

function readQueue(){
  try{
    const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    return Array.isArray(value)?value:[];
  }catch{return [];}
}

function writeQueue(queue){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(queue));
  emit(queue);
  return queue;
}

function emit(queue=readQueue()){
  const snapshot=Object.freeze({count:queue.length,flushing,items:queue.map(item=>Object.freeze({...item}))});
  for(const listener of listeners){
    try{listener(snapshot);}catch(error){console.error('PUSH_QUEUE_LISTENER_FAILED',error);}
  }
  window.dispatchEvent(new CustomEvent('morefun:push-queue-change',{detail:snapshot}));
  return snapshot;
}

function makeId(){
  return globalThis.crypto?.randomUUID?.()||`push_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getPushQueueState(){return emit();}

export function subscribePushQueue(listener,{emitCurrent=true}={}){
  if(typeof listener!=='function')throw new TypeError('listener must be a function');
  listeners.add(listener);
  if(emitCurrent)listener(emit());
  return()=>listeners.delete(listener);
}

export function enqueuePush({type,payload,idempotencyKey}={}){
  if(!type)throw new Error('push_type_required');
  const queue=readQueue();
  const key=idempotencyKey||makeId();
  if(queue.some(item=>item.idempotencyKey===key))return emit(queue);
  queue.push({id:makeId(),type,payload:payload??null,idempotencyKey:key,attempts:0,createdAt:new Date().toISOString(),lastError:null});
  return emit(writeQueue(queue));
}

export async function flushPushQueue({sender,maxItems=20}={}){
  if(flushing)return emit();
  if(typeof sender!=='function')throw new TypeError('sender must be a function');
  if(getHealthState().status==='offline')return emit();

  flushing=true;
  emit();
  try{
    const queue=readQueue();
    const remaining=[];
    for(const item of queue.slice(0,maxItems)){
      try{
        await sender(item);
      }catch(error){
        remaining.push({...item,attempts:item.attempts+1,lastError:String(error?.message||error||'push_failed')});
      }
    }
    remaining.push(...queue.slice(maxItems));
    writeQueue(remaining);
  }finally{
    flushing=false;
    emit();
  }
  return emit();
}

export function clearPushQueue(){return emit(writeQueue([]));}