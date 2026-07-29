import {getHealthState,subscribeHealth} from './health-state.js';
import {getPushQueueState} from './push-queue.js';

const listeners=new Set();
let unsubscribeHealth=null;
let state=Object.freeze({mode:'normal',reason:null,enteredAt:null,recoveredAt:null});

function emit(patch={}){
  state=Object.freeze({...state,...patch});
  document.documentElement.dataset.runtimeMode=state.mode;
  for(const listener of listeners){
    try{listener(state);}catch(error){console.error('FALLBACK_LISTENER_FAILED',error);}
  }
  window.dispatchEvent(new CustomEvent('morefun:fallback-change',{detail:state}));
  return state;
}

function evaluate(){
  const health=getHealthState();
  const queued=getPushQueueState().count;
  if(health.status==='offline'){
    if(state.mode!=='offline')emit({mode:'offline',reason:health.reason||'health_offline',enteredAt:new Date().toISOString(),recoveredAt:null});
    return state;
  }
  if(health.status==='degraded'||queued>0){
    if(state.mode!=='degraded')emit({mode:'degraded',reason:health.reason||(queued>0?'pending_push_queue':'health_degraded'),enteredAt:new Date().toISOString(),recoveredAt:null});
    return state;
  }
  if(state.mode!=='normal')return emit({mode:'normal',reason:null,recoveredAt:new Date().toISOString()});
  return state;
}

export function getFallbackState(){return state;}

export function subscribeFallback(listener,{emitCurrent=true}={}){
  if(typeof listener!=='function')throw new TypeError('listener must be a function');
  listeners.add(listener);
  if(emitCurrent)listener(state);
  return()=>listeners.delete(listener);
}

export function startFallbackCoordinator(){
  if(unsubscribeHealth)return stopFallbackCoordinator;
  unsubscribeHealth=subscribeHealth(evaluate);
  window.addEventListener('morefun:push-queue-change',evaluate);
  evaluate();
  return stopFallbackCoordinator;
}

export function stopFallbackCoordinator(){
  unsubscribeHealth?.();
  unsubscribeHealth=null;
  window.removeEventListener('morefun:push-queue-change',evaluate);
}

export function reevaluateFallback(){return evaluate();}
