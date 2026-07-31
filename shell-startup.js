import {OPERATIONS_STORAGE_KEY,SETTINGS_STORAGE_KEY,ORDER_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,TERMINAL_ID_STORAGE_KEY,SUPPLY_STORAGE_KEY,readJSON,writeJSON} from './shared/store.js';
import {businessWindow,buildOpeningCashState} from './pages/more/more-domain.js';
import {startRuntimeNonBlocking} from './shared/runtime-lifecycle.js';
import {ensureOfflineSurvival,registerOfflineServiceWorker,refreshOfflineAssets,flushOfflineJournal} from './shared/offline-survival.js';
import {appendOfflineJournalEntry,getOfflineJournalStatus,recoverDurableStorageFromJournal} from './shared/offline-journal.js';
import {requestPersistentStorage,subscribeStorageHealth} from './shared/storage-health.js';
import {createSupplyRuntime} from './shared/supply-runtime.js';

const SESSION_KEY='morefun:smt:staff-shell-session:v2';
const EPHEMERAL_SESSION_KEY='morefun:smt:staff-shell-session:ephemeral:v2';
const RECOVERY_RELOAD_KEY='morefun:smt:journal-recovery-reloaded';
const SIX_DIGITS=/^\d{6}$/;
const params=new URLSearchParams(location.search);
const APP_PROFILE=/mobile|smm/i.test(String(params.get('profile')||params.get('mode')||''))?'mobile':'register';
const SUPPLY_SOURCE=APP_PROFILE==='mobile'?'smm':'smt';
const defaultTerminal=APP_PROFILE==='mobile'?'SMM-01':'SMT-01';
const profileTerminalKey=`${TERMINAL_ID_STORAGE_KEY}:${APP_PROFILE}`;
const terminalId=String(params.get('terminal')||localStorage.getItem(profileTerminalKey)||(APP_PROFILE==='register'?localStorage.getItem(TERMINAL_ID_STORAGE_KEY):'')||defaultTerminal);
localStorage.setItem(profileTerminalKey,terminalId);
if(APP_PROFILE==='register')localStorage.setItem(TERMINAL_ID_STORAGE_KEY,terminalId);
document.documentElement.dataset.appProfile=APP_PROFILE;

const supplyRuntime=createSupplyRuntime({source:SUPPLY_SOURCE,deviceId:terminalId,globalObject:window});
const gate=document.getElementById('startup-gate');
const loginStep=gate?.querySelector('[data-startup-step="login"]');
const cashStep=gate?.querySelector('[data-startup-step="cash"]');
const errorBox=document.getElementById('startup-error');
const cashPrevious=document.getElementById('opening-previous');
const cashTotal=document.getElementById('opening-total');
const adjustmentInput=gate?.querySelector('[name="opening-adjustment"]');
const operatorLabel=document.getElementById('opening-operator');
let shellOnline=document.getElementById('shell-online');
let operator='';
let survivalStarted=false;
let supplyStarted=false;
let stopStorageHealth=null;

function isQaBypass(){return navigator.webdriver&&params.get('force-startup')!=='1';}
function isShellUnlocked(){return document.documentElement.dataset.shellUnlocked==='1';}
function credentials(){const settings=readJSON(SETTINGS_STORAGE_KEY,{}),accounts=Array.isArray(settings?.auth?.accounts)?settings.auth.accounts:[];return accounts;}
function readSession(storage,key){try{return JSON.parse(storage.getItem(key)||'null');}catch{return null;}}
function session(){return readSession(localStorage,SESSION_KEY)||readSession(sessionStorage,EPHEMERAL_SESSION_KEY);}
function clearShellSession(){localStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(EPHEMERAL_SESSION_KEY);}
function saveSession(username,{remember=true,...extra}={}){
  const row={username,businessDate:businessWindow().id,loginAt:Date.now(),profile:APP_PROFILE,remember:Boolean(remember),...extra};
  clearShellSession();
  (remember?localStorage:sessionStorage).setItem(remember?SESSION_KEY:EPHEMERAL_SESSION_KEY,JSON.stringify(row));
}
function validSession(){
  const row=session();
  if(!row||!String(row.username||'').trim()||row.profile!==APP_PROFILE)return null;
  if(row.remember===false&&row.businessDate!==businessWindow().id)return null;
  return row;
}
function openingState(){const operations=readJSON(OPERATIONS_STORAGE_KEY,{});return {operations,state:buildOpeningCashState(operations.dayCloses||[],operations.openingCashAdjustments||[],businessWindow().id)};}
function ensureDailyWorkspaceClean(){const businessDate=businessWindow().id,operations=readJSON(OPERATIONS_STORAGE_KEY,{})||{};if(operations.workspaceResetBusinessDate===businessDate)return false;localStorage.removeItem(ORDER_STORAGE_KEY);localStorage.removeItem(DRAFT_STORAGE_KEY);localStorage.removeItem(DRAFT_COUNTER_STORAGE_KEY);writeJSON(OPERATIONS_STORAGE_KEY,{...operations,workspaceResetBusinessDate:businessDate,workspaceResetAt:Date.now()});return true;}
function setError(message=''){if(!errorBox)return;errorBox.textContent=message;errorBox.hidden=!message;}
function showStep(name){if(!gate)return;gate.hidden=false;loginStep.hidden=name!=='login';cashStep.hidden=name!=='cash';gate.dataset.step=name;}
function showLogin(message=''){
  showStep('login');setError(message);
  const form=gate?.querySelector('[data-form="login"]');
  const remembered=validSession();
  if(form?.elements?.username&&!form.elements.username.value)form.elements.username.value=remembered?.username||'';
  requestAnimationFrame(()=>form?.querySelector('input[name="username"]')?.focus());
}
function updateCashPreview(){const {state}=openingState(),adjustment=Number(adjustmentInput?.value||0),total=Math.max(0,Number(state.previousRetained||0)+adjustment);if(cashPrevious)cashPrevious.textContent='$'+Number(state.previousRetained||0).toLocaleString('zh-HK');if(cashTotal)cashTotal.textContent='$'+total.toLocaleString('zh-HK',{maximumFractionDigits:2});if(operatorLabel)operatorLabel.textContent=operator||validSession()?.username||'Staff';}
function showCash(username){operator=username||validSession()?.username||'Staff';const {state}=openingState();showStep('cash');if(adjustmentInput)adjustmentInput.value=String(state.adjustment||0);updateCashPreview();setError('');requestAnimationFrame(()=>adjustmentInput?.focus());}

function currentShellOnline(){return document.getElementById('shell-online')||shellOnline;}
function renderSupplyState(detail=supplyRuntime.getState()){
  shellOnline=currentShellOnline();
  if(!shellOnline)return;
  const pending=supplyRuntime.getPending().length;
  const connected=Boolean(detail?.connected);
  const sessionRequired=detail?.status==='session-required';
  const syncing=detail?.status==='syncing'||detail?.status==='queued';
  let label='供應同步離線';
  if(sessionRequired)label=pending?`重新登入｜待同步 ${pending}`:'重新登入同步';
  else if(connected&&pending===0)label='供應同步已連線';
  else if(connected||syncing)label=pending?`同步中 ${pending}`:'同步中';
  else if(pending)label=`離線待同步 ${pending}`;
  shellOnline.classList.toggle('is-warning',!connected||pending>0);
  shellOnline.classList.toggle('is-ok',connected&&pending===0);
  shellOnline.dataset.supplyState=String(detail?.status||'unknown');
  shellOnline.innerHTML=`<i></i>${label}`;
  shellOnline.title=detail?.lastError||`${SUPPLY_SOURCE.toUpperCase()}｜${terminalId}｜按此檢查同步或登出`;
  shellOnline.setAttribute('aria-label',`${label}。按此檢查同步或登出。`);
}

async function startStorageProtection(){
  const persistence=await requestPersistentStorage();
  if(!stopStorageHealth)stopStorageHealth=subscribeStorageHealth(health=>window.dispatchEvent(new CustomEvent('morefun:storage-health',{detail:health})));
  const journal=await getOfflineJournalStatus().catch(()=>({ready:false,count:0,unsynced:0}));
  window.dispatchEvent(new CustomEvent('morefun:storage-protection-ready',{detail:{persistence,journal}}));
}

async function startSurvivalLayer({force=false}={}){
  if(survivalStarted&&!force)return;
  survivalStarted=true;
  const runtimeResult=await startRuntimeNonBlocking(),controller=runtimeResult?.controller||null,adapter=controller?.adapter||null;
  const [serviceWorker,offline]=await Promise.all([registerOfflineServiceWorker(),ensureOfflineSurvival({adapter,force}),startStorageProtection()]);
  const sync=await flushOfflineJournal({adapter}).catch(error=>({status:'failed',lastError:String(error?.message||error)}));
  if(force)await refreshOfflineAssets();
  window.dispatchEvent(new CustomEvent('morefun:offline-survival-ready',{detail:{runtimeOk:Boolean(runtimeResult?.ok),serviceWorkerOk:Boolean(serviceWorker?.ok),offlineOk:Boolean(offline?.ok),mode:offline?.mode||'unknown',sync,force}}));
}

async function startSupplyLayer({force=false}={}){
  if(supplyStarted&&!force)return;
  supplyStarted=true;
  if(force)await supplyRuntime.flushPending();
  const result=await supplyRuntime.boot();
  if(!result?.session&&validSession()){
    clearShellSession();
    showLogin('登入已失效，請重新輸入 Staff 編號及 6 位密碼。');
    return;
  }
  supplyRuntime.startPolling();
  renderSupplyState();
}

function unlock(){document.documentElement.dataset.shellUnlocked='1';if(gate)gate.hidden=true;window.dispatchEvent(new CustomEvent('morefun:shell-unlocked'));void startSurvivalLayer();void startSupplyLayer();}
function logout({confirmUser=true}={}){
  if(confirmUser&&!window.confirm('確認登出 Staff？本機購物車、餐牌及待同步資料會保留。'))return false;
  supplyRuntime.stopPolling();
  supplyRuntime.logout();
  clearShellSession();
  operator='';
  document.documentElement.dataset.shellUnlocked='0';
  showLogin('已登出，請重新登入。');
  renderSupplyState();
  return true;
}
function continueAfterLogin(username){if(APP_PROFILE==='mobile'){unlock();return;}const {state}=openingState();if(state.confirmed){unlock();return;}showCash(username);}
async function submitLogin(event){
  event.preventDefault();
  const form=event.currentTarget,button=form.querySelector('[type="submit"]'),username=String(form.elements.username?.value||'').trim(),password=String(form.elements.password?.value||''),remember=form.elements.rememberLogin?.checked!==false;
  if(!username){setError('請輸入 Staff 編號');return;}
  if(!SIX_DIGITS.test(password)){setError('密碼必須係6位數字');return;}
  const localMatch=credentials().find(row=>row.enabled!==false&&String(row.username||row.staffNumber)===username&&String(row.password)===password);
  setError('');if(button){button.disabled=true;button.textContent='登入中…';}
  let remote='connected';
  try{await supplyRuntime.login({staffNumber:username,password});}
  catch(error){
    const status=Number(error?.status||0);
    if(status===401||status===403){clearShellSession();setError('Staff 編號、密碼或帳戶狀態不正確');if(button){button.disabled=false;button.textContent='登入';}return;}
    if(!localMatch){setError('暫時無法連線，而且本機未保存呢個 Staff 帳號，請檢查網絡後再試。');if(button){button.disabled=false;button.textContent='登入';}return;}
    remote='offline-local';
    window.__MOREFUN_STAFF_LOGIN_WARNING__=Object.freeze({code:'STAFF_LOGIN_OFFLINE_FALLBACK',message:String(error?.message||error),at:new Date().toISOString()});
  }
  saveSession(username,{remember,staffRuntime:remote});operator=username;
  form.elements.password.value='';
  if(isShellUnlocked()){
    if(gate)gate.hidden=true;
    void startSupplyLayer({force:true});
  }else continueAfterLogin(username);
  if(button){button.disabled=false;button.textContent='登入';}
}
function confirmOpening(event){event.preventDefault();const {operations,state}=openingState(),adjustment=Number(adjustmentInput?.value||0);if(!Number.isFinite(adjustment)){setError('請輸入有效開工現金調整');return;}const openingCash=Math.max(0,Number(state.previousRetained||0)+adjustment),businessDate=businessWindow().id,rows=(operations.openingCashAdjustments||[]).filter(row=>row.businessDate!==businessDate);rows.push({businessDate,previousRetained:Number(state.previousRetained||0),adjustment,openingCash,confirmedAt:Date.now(),operator:operator||validSession()?.username||'Staff'});writeJSON(OPERATIONS_STORAGE_KEY,{...operations,workspaceResetBusinessDate:businessDate,workspaceResetAt:operations.workspaceResetAt||Date.now(),openingCashAdjustments:rows});unlock();}

window.addEventListener('morefun:supply-runtime-state',event=>{
  renderSupplyState(event.detail);
  if(event.detail?.status==='session-required'&&isShellUnlocked()){
    clearShellSession();
    showLogin('帳戶已停用、密碼已重設或登入已被撤銷，請重新登入。');
  }
});
window.addEventListener('message',event=>{
  if(event.origin!==location.origin)return;
  const message=event.data||{};
  if(message.type!=='morefun:critical-storage-written'||!message.storageKey)return;
  void appendOfflineJournalEntry({storageKey:message.storageKey,value:message.value,source:SUPPLY_SOURCE,businessDate:businessWindow().id,terminalId}).catch(error=>window.dispatchEvent(new CustomEvent('morefun:offline-journal-failed',{detail:{error:String(error?.message||error),storageKey:message.storageKey}})));
  if(message.storageKey===SUPPLY_STORAGE_KEY)supplyRuntime.captureLocalSnapshot(message.value||{});
});

document.addEventListener('click',event=>{
  const target=event.target.closest?.('#shell-online,[data-staff-logout]');
  if(!target)return;
  if(target.matches('[data-staff-logout]')){logout();return;}
  if(target.id==='shell-online'&&isShellUnlocked())logout();
});
gate?.querySelector('[data-form="login"]')?.addEventListener('submit',event=>void submitLogin(event));
gate?.querySelector('[data-form="cash"]')?.addEventListener('submit',confirmOpening);
adjustmentInput?.addEventListener('input',updateCashPreview);
window.addEventListener('online',()=>{if(isShellUnlocked()){void startSurvivalLayer({force:true});void startSupplyLayer({force:true});}});
window.addEventListener('pagehide',()=>{stopStorageHealth?.();stopStorageHealth=null;supplyRuntime.stopPolling();},{once:true});

async function initializeStartup(){
  const recovery=await recoverDurableStorageFromJournal().catch(error=>({ok:false,count:0,error:String(error?.message||error)}));
  if(recovery.count>0&&sessionStorage.getItem(RECOVERY_RELOAD_KEY)!=='1'){
    sessionStorage.setItem(RECOVERY_RELOAD_KEY,'1');
    location.reload();
    return;
  }
  sessionStorage.removeItem(RECOVERY_RELOAD_KEY);
  ensureDailyWorkspaceClean();
  renderSupplyState();
  const remembered=validSession();
  const runtimeSession=supplyRuntime.getSession();
  if(isQaBypass())unlock();
  else if(remembered&&runtimeSession)continueAfterLogin(remembered.username);
  else {if(remembered&&!runtimeSession)clearShellSession();showLogin(remembered&&!runtimeSession?'登入已失效，請重新登入。':'');}
}

void initializeStartup();
window.MoreFunStartup={unlock,logout,showCash,showLogin,startSurvivalLayer,startSupplyLayer,supplyRuntime,clearShellSession};
