import {bootstrapRuntime,shutdownRuntime} from './runtime-bootstrap.js';
import {getRuntimeStatus} from './runtime-status.js';

let startPromise=null;

export function startRuntimeNonBlocking(options={}){
  if(startPromise)return startPromise;
  startPromise=bootstrapRuntime(options).then(controller=>({ok:true,controller,status:getRuntimeStatus()})).catch(error=>{
    console.error('SMT_RUNTIME_START_FAILED',error);
    return {ok:false,error:String(error?.message||error),status:getRuntimeStatus()};
  });
  return startPromise;
}

export function stopRuntimeLifecycle(){
  shutdownRuntime();
  startPromise=null;
}

export function bindRuntimeToWindowLifecycle(options={}){
  const start=()=>{void startRuntimeNonBlocking(options);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else queueMicrotask(start);
  const stop=()=>stopRuntimeLifecycle();
  window.addEventListener('pagehide',stop,{once:true});
  return()=>{
    document.removeEventListener('DOMContentLoaded',start);
    window.removeEventListener('pagehide',stop);
  };
}
