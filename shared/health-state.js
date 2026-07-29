const listeners=new Set();

const initialState=()=>({
  status:'unknown',
  online:navigator.onLine!==false,
  runtimeReady:false,
  heartbeat:'idle',
  lastCheckedAt:null,
  lastHealthyAt:null,
  consecutiveFailures:0,
  reason:null
});

let state=initialState();

function snapshot(){
  return Object.freeze({...state});
}

function emit(){
  const next=snapshot();
  for(const listener of listeners){
    try{listener(next);}catch(error){console.error('HEALTH_LISTENER_FAILED',error);}
  }
  window.dispatchEvent(new CustomEvent('morefun:health-change',{detail:next}));
}

export function getHealthState(){
  return snapshot();
}

export function setHealthState(patch={}){
  const checkedAt=patch.lastCheckedAt??state.lastCheckedAt;
  const becameHealthy=patch.status==='healthy';
  state={
    ...state,
    ...patch,
    lastCheckedAt:checkedAt,
    lastHealthyAt:becameHealthy?(patch.lastHealthyAt||checkedAt||new Date().toISOString()):state.lastHealthyAt,
    consecutiveFailures:becameHealthy?0:(patch.consecutiveFailures??state.consecutiveFailures)
  };
  document.documentElement.dataset.healthStatus=state.status;
  document.documentElement.dataset.networkOnline=state.online?'1':'0';
  emit();
  return snapshot();
}

export function markRuntimeReady(){
  return setHealthState({runtimeReady:true});
}

export function markHeartbeatStarted(){
  return setHealthState({heartbeat:'running'});
}

export function markHeartbeatSuccess(extra={}){
  const now=new Date().toISOString();
  return setHealthState({
    status:'healthy',
    online:true,
    heartbeat:'running',
    lastCheckedAt:now,
    lastHealthyAt:now,
    reason:null,
    ...extra
  });
}

export function markHeartbeatFailure(reason='heartbeat_failed',extra={}){
  const now=new Date().toISOString();
  const failures=state.consecutiveFailures+1;
  return setHealthState({
    status:failures>=3?'offline':'degraded',
    online:navigator.onLine!==false,
    heartbeat:'running',
    lastCheckedAt:now,
    consecutiveFailures:failures,
    reason,
    ...extra
  });
}

export function subscribeHealth(listener,{emitCurrent=true}={}){
  if(typeof listener!=='function')throw new TypeError('listener must be a function');
  listeners.add(listener);
  if(emitCurrent)listener(snapshot());
  return()=>listeners.delete(listener);
}

export function resetHealthState(){
  state=initialState();
  emit();
  return snapshot();
}

window.addEventListener('online',()=>setHealthState({online:true,status:state.status==='offline'?'degraded':state.status,reason:null}));
window.addEventListener('offline',()=>setHealthState({online:false,status:'offline',reason:'browser_offline'}));
