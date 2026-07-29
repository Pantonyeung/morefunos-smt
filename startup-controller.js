import {authenticateStaff,normalizeAccounts} from './shared/staff-auth.js';
import {createSession,readSession,writeSession,clearSession} from './shared/session-store.js';
import {startBootstrap,getBootstrapState} from './shared/bootstrap-orchestrator.js';
import {getHealthState,markRuntimeReady,subscribeHealth} from './shared/health-state.js';
import {startHeartbeat,stopHeartbeat,runHeartbeatOnce,getHeartbeatState} from './shared/heartbeat-controller.js';
import {runPull,getPullState,subscribePull} from './shared/pull-controller.js';
import {enqueuePush,flushPushQueue,getPushQueueState,subscribePushQueue} from './shared/push-queue.js';
import {getFallbackState,subscribeFallback,reevaluateFallback} from './shared/fallback-coordinator.js';
import {configureSyncAdapters,startSyncCoordinator,stopSyncCoordinator,getSyncState,syncNow} from './shared/sync-coordinator.js';
import {createRuntimeApiAdapter,getRuntimeApiConfig} from './shared/runtime-api-adapter.js';
import {readRuntimeSnapshot,applyRuntimeSnapshot,clearRuntimeSnapshot} from './shared/runtime-snapshot-store.js';
import {runRuntimeSelfTest} from './shared/runtime-self-test.js';

const SETTINGS_KEY='morefun:smt:v16c:settings';
const gate=document.getElementById('startup-gate');
const form=gate?.querySelector('form');
const errorBox=document.getElementById('startup-error');
const submitButton=form?.querySelector('button[type="submit"]');
let runtimeApi=null;

function readSettings(){
  try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{};}catch{return {};}
}

function setError(message=''){
  if(!errorBox)return;
  errorBox.textContent=message;
  errorBox.hidden=!message;
}

function setBusy(busy){
  if(!submitButton)return;
  submitButton.disabled=busy;
  submitButton.textContent=busy?'登入中…':'登入';
}

function configureRuntimeSync(session){
  const settings=readSettings();
  runtimeApi=createRuntimeApiAdapter({
    settings,
    session,
    applySnapshot:(snapshot)=>applyRuntimeSnapshot(snapshot,{revision:snapshot?.revision||snapshot?.version||null})
  });

  if(!runtimeApi.isConfigured()){
    configureSyncAdapters({fetcher:null,apply:null,sender:null});
    document.documentElement.dataset.syncConfigured='0';
    return false;
  }

  configureSyncAdapters({
    fetcher:async({sinceVersion}={})=>{
      const result=await runtimeApi.pull({revision:sinceVersion});
      return {revision:result.revision,snapshot:result.snapshot};
    },
    apply:async(result)=>applyRuntimeSnapshot(result.snapshot??result,{revision:result.revision||null}),
    sender:(item)=>runtimeApi.push(item)
  });
  document.documentElement.dataset.syncConfigured='1';
  return true;
}

async function startRuntime(session){
  document.documentElement.dataset.staffReady='1';
  document.documentElement.dataset.staffUser=session?.username||'';
  if(gate)gate.hidden=true;

  await startBootstrap({
    session,
    loadRuntime:()=>import('./app-loader.js?v=smt-adaptive-transition-v1')
  });

  markRuntimeReady();
  const syncConfigured=configureRuntimeSync(session);
  startHeartbeat(syncConfigured?{probe:()=>runtimeApi.healthProbe()}:undefined);
  startSyncCoordinator();

  window.dispatchEvent(new CustomEvent('morefun:staff-ready',{
    detail:{
      staff:session,
      bootstrap:getBootstrapState(),
      health:getHealthState(),
      sync:getSyncState(),
      syncConfigured,
      cachedSnapshot:readRuntimeSnapshot()
    }
  }));
}

async function submitLogin(event){
  event.preventDefault();
  const username=String(form.elements.username?.value||'').trim();
  const password=String(form.elements.password?.value||'');
  setError('');
  setBusy(true);
  try{
    const result=await authenticateStaff({username,password,accounts:normalizeAccounts(readSettings())});
    if(!result.ok){
      setError('帳號或密碼不正確');
      form.elements.password?.select();
      return;
    }
    const session=writeSession(createSession(result.staff));
    form.elements.password.value='';
    await startRuntime(session);
  }catch(error){
    console.error('STAFF_LOGIN_FAILED',error);
    setError('登入暫時未能完成，請再試一次');
    if(gate)gate.hidden=false;
  }finally{
    setBusy(false);
  }
}

function lock(){
  stopSyncCoordinator();
  stopHeartbeat();
  clearSession();
  location.reload();
}

form?.addEventListener('submit',submitLogin);
window.MoreFunStaff={
  lock,
  getSession:readSession,
  getBootstrapState,
  getHealthState,
  getHeartbeatState,
  runHeartbeatOnce,
  subscribeHealth,
  configureSyncAdapters,
  syncNow,
  getSyncState,
  runPull,
  getPullState,
  subscribePull,
  enqueuePush,
  flushPushQueue,
  getPushQueueState,
  subscribePushQueue,
  getFallbackState,
  subscribeFallback,
  reevaluateFallback,
  getRuntimeApiConfig:()=>getRuntimeApiConfig(readSettings()),
  getRuntimeSnapshot:readRuntimeSnapshot,
  clearRuntimeSnapshot,
  runRuntimeSelfTest
};

const restoredSession=readSession();
if(restoredSession)startRuntime(restoredSession).catch(error=>{
  console.error('SESSION_RESTORE_BOOTSTRAP_FAILED',error);
  stopSyncCoordinator();
  stopHeartbeat();
  if(gate)gate.hidden=false;
  setError('系統啟動失敗，請重新登入');
});
else{
  gate.hidden=false;
  requestAnimationFrame(()=>form?.elements.password?.focus());
}
