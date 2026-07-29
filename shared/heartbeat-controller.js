import {
  getHealthState,
  markHeartbeatStarted,
  markHeartbeatSuccess,
  markHeartbeatFailure
} from './health-state.js';

const DEFAULT_INTERVAL_MS=30000;
const DEFAULT_TIMEOUT_MS=6000;
let timer=null;
let running=false;
let activeProbe=null;

function withTimeout(promise,timeoutMs){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort('heartbeat_timeout'),timeoutMs);
  return {
    signal:controller.signal,
    result:Promise.resolve(promise(controller.signal)).finally(()=>clearTimeout(timeout))
  };
}

async function defaultProbe(signal){
  const url=new URL('./index.html',window.location.href);
  url.searchParams.set('__health',Date.now().toString());
  const response=await fetch(url,{method:'GET',cache:'no-store',signal,credentials:'same-origin'});
  if(!response.ok)throw new Error(`heartbeat_http_${response.status}`);
  return {httpStatus:response.status};
}

export async function runHeartbeatOnce({probe=activeProbe||defaultProbe,timeoutMs=DEFAULT_TIMEOUT_MS}={}){
  if(navigator.onLine===false){
    return markHeartbeatFailure('browser_offline',{online:false});
  }
  try{
    const task=withTimeout(probe,timeoutMs);
    const detail=await task.result;
    return markHeartbeatSuccess({detail:detail||null});
  }catch(error){
    const reason=error?.name==='AbortError'?'heartbeat_timeout':String(error?.message||'heartbeat_failed');
    return markHeartbeatFailure(reason);
  }
}

export function startHeartbeat({intervalMs=DEFAULT_INTERVAL_MS,timeoutMs=DEFAULT_TIMEOUT_MS,probe=defaultProbe,immediate=true}={}){
  if(running)return stopHeartbeat;
  running=true;
  activeProbe=probe;
  markHeartbeatStarted();

  const tick=()=>runHeartbeatOnce({probe,timeoutMs}).catch(error=>{
    console.error('HEARTBEAT_TICK_FAILED',error);
  });

  if(immediate)tick();
  timer=setInterval(tick,Math.max(5000,intervalMs));
  return stopHeartbeat;
}

export function stopHeartbeat(){
  running=false;
  activeProbe=null;
  if(timer){clearInterval(timer);timer=null;}
}

export function getHeartbeatState(){
  return Object.freeze({running,health:getHealthState()});
}

window.addEventListener('beforeunload',stopHeartbeat,{once:true});
