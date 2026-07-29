import {applyRuntimeSnapshot,readRuntimeSnapshot} from './runtime-snapshot-store.js';
import {markHeartbeatFailure,markHeartbeatStarted,markHeartbeatSuccess,markRuntimeReady} from './health-state.js';

export function createRuntimeController(adapter,{heartbeatMs=30000}={}){
  if(!adapter||typeof adapter.pull!=='function')throw new TypeError('runtime adapter required');
  let timer=null;
  let unsubscribe=null;

  async function pull(){
    const result=await adapter.pull();
    if(!result?.ok)throw new Error(result?.error||'runtime_pull_failed');
    return applyRuntimeSnapshot(result.data,{revision:result.data?.runtimeVersion,source:adapter.mode||'adapter'});
  }

  async function push(patch,{source='smt'}={}){
    const cached=readRuntimeSnapshot()?.snapshot||{};
    const result=await adapter.push(patch,{expectedVersion:cached.runtimeVersion??null,source});
    if(!result?.ok){
      const error=new Error(result?.error||'runtime_push_failed');
      error.conflict=Boolean(result?.conflict);
      error.current=result?.current||null;
      throw error;
    }
    return applyRuntimeSnapshot(result.data,{revision:result.data?.runtimeVersion,source:adapter.mode||'adapter'});
  }

  async function heartbeat(){
    try{
      const result=typeof adapter.health==='function'?await adapter.health():{ok:true};
      if(!result?.ok)throw new Error(result?.error||'runtime_health_failed');
      markHeartbeatSuccess({adapterMode:adapter.mode||'unknown'});
      return result;
    }catch(error){
      markHeartbeatFailure(String(error?.message||error));
      throw error;
    }
  }

  async function start(){
    markHeartbeatStarted();
    await pull();
    markRuntimeReady();
    if(typeof adapter.subscribe==='function'){
      unsubscribe=adapter.subscribe(data=>applyRuntimeSnapshot(data,{revision:data?.runtimeVersion,source:adapter.mode||'adapter'}));
    }
    await heartbeat();
    if(heartbeatMs>0)timer=setInterval(()=>heartbeat().catch(()=>{}),heartbeatMs);
    return api;
  }

  function stop(){
    if(timer)clearInterval(timer);
    timer=null;
    unsubscribe?.();
    unsubscribe=null;
  }

  const api=Object.freeze({start,stop,pull,push,heartbeat,adapter});
  return api;
}
