import {createLocalRuntimeAdapter} from './runtime-local-adapter.js';
import {createRuntimeController} from './runtime-controller.js';
import {enqueuePush,flushPushQueue} from './push-queue.js';

const DEFAULT_HEARTBEAT_MS=30000;
let controller=null;
let started=null;

function resolveAdapter(options={}){
  if(options.adapter)return options.adapter;
  return createLocalRuntimeAdapter();
}

async function sendQueuedItem(item,source='smt'){
  if(item.type!=='runtime.patch')throw new Error('unsupported_push_type');
  await controller.push(item.payload?.patch||{},{source:item.payload?.source||source});
}

export function getRuntimeController(){return controller;}

export async function bootstrapRuntime(options={}){
  if(started)return started;
  const adapter=resolveAdapter(options);
  controller=createRuntimeController(adapter,{heartbeatMs:options.heartbeatMs??DEFAULT_HEARTBEAT_MS});
  started=controller.start().then(async()=>{
    await flushPushQueue({sender:item=>sendQueuedItem(item)});
    window.dispatchEvent(new CustomEvent('morefun:runtime-ready',{detail:{mode:adapter.mode||'unknown'}}));
    return controller;
  }).catch(error=>{
    controller?.stop();
    controller=null;
    started=null;
    window.dispatchEvent(new CustomEvent('morefun:runtime-bootstrap-failed',{detail:{error:String(error?.message||error)}}));
    throw error;
  });
  return started;
}

export async function queueRuntimePatch(patch,{source='smt',idempotencyKey}={}){
  enqueuePush({type:'runtime.patch',payload:{patch,source},idempotencyKey});
  if(!controller)return {queued:true,flushed:false};
  const state=await flushPushQueue({sender:item=>sendQueuedItem(item,source)});
  return {queued:true,flushed:state.count===0,state};
}

export async function flushRuntimeQueue(){
  if(!controller)return {ok:false,error:'runtime_not_started'};
  const state=await flushPushQueue({sender:item=>sendQueuedItem(item)});
  return {ok:state.count===0,state};
}

export function shutdownRuntime(){
  controller?.stop();
  controller=null;
  started=null;
  window.dispatchEvent(new CustomEvent('morefun:runtime-stopped'));
}
