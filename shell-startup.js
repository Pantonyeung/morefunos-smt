import {OPERATIONS_STORAGE_KEY,SETTINGS_STORAGE_KEY,ORDER_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,readJSON,writeJSON} from './shared/store.js';
import {businessWindow,buildOpeningCashState} from './pages/more/more-domain.js';
import {startRuntimeNonBlocking} from './shared/runtime-lifecycle.js';
import {ensureOfflineSurvival,registerOfflineServiceWorker,refreshOfflineAssets} from './shared/offline-survival.js';

const SESSION_KEY='morefun:smt:daily-session';
const gate=document.getElementById('startup-gate');
const loginStep=gate?.querySelector('[data-startup-step="login"]');
const cashStep=gate?.querySelector('[data-startup-step="cash"]');
const errorBox=document.getElementById('startup-error');
const cashPrevious=document.getElementById('opening-previous');
const cashTotal=document.getElementById('opening-total');
const adjustmentInput=gate?.querySelector('[name="opening-adjustment"]');
const operatorLabel=document.getElementById('opening-operator');
let operator='';
let survivalStarted=false;

function isQaBypass(){const params=new URLSearchParams(location.search);return navigator.webdriver&&params.get('force-startup')!=='1';}
function credentials(){const settings=readJSON(SETTINGS_STORAGE_KEY,{}),accounts=Array.isArray(settings?.auth?.accounts)?settings.auth.accounts:[];return accounts.length?accounts:[{username:'morefun',password:'morefun',enabled:true}];}
function session(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');}catch{return null;}}
function saveSession(username){const day=businessWindow().id;sessionStorage.setItem(SESSION_KEY,JSON.stringify({username,businessDate:day,loginAt:Date.now()}));}
function validSession(){const row=session();return row&&row.businessDate===businessWindow().id&&row.username;}
function openingState(){const operations=readJSON(OPERATIONS_STORAGE_KEY,{});return {operations,state:buildOpeningCashState(operations.dayCloses||[],operations.openingCashAdjustments||[],businessWindow().id)};}
function ensureDailyWorkspaceClean(){const businessDate=businessWindow().id,operations=readJSON(OPERATIONS_STORAGE_KEY,{})||{};if(operations.workspaceResetBusinessDate===businessDate)return false;localStorage.removeItem(ORDER_STORAGE_KEY);localStorage.removeItem(DRAFT_STORAGE_KEY);localStorage.removeItem(DRAFT_COUNTER_STORAGE_KEY);writeJSON(OPERATIONS_STORAGE_KEY,{...operations,workspaceResetBusinessDate:businessDate,workspaceResetAt:Date.now()});return true;}
function setError(message=''){if(!errorBox)return;errorBox.textContent=message;errorBox.hidden=!message;}
function showStep(name){if(!gate)return;gate.hidden=false;loginStep.hidden=name!=='login';cashStep.hidden=name!=='cash';gate.dataset.step=name;}
function updateCashPreview(){const {state}=openingState(),adjustment=Number(adjustmentInput?.value||0),total=Math.max(0,Number(state.previousRetained||0)+adjustment);if(cashPrevious)cashPrevious.textContent='$'+Number(state.previousRetained||0).toLocaleString('zh-HK');if(cashTotal)cashTotal.textContent='$'+total.toLocaleString('zh-HK',{maximumFractionDigits:2});if(operatorLabel)operatorLabel.textContent=operator||validSession()?.username||'morefun';}
function showCash(username){operator=username||validSession()?.username||'morefun';const {state}=openingState();showStep('cash');if(adjustmentInput)adjustmentInput.value=String(state.adjustment||0);updateCashPreview();setError('');requestAnimationFrame(()=>adjustmentInput?.focus());}

async function startSurvivalLayer({force=false}={}){
  if(survivalStarted&&!force)return;
  survivalStarted=true;
  const runtimeResult=await startRuntimeNonBlocking(),controller=runtimeResult?.controller||null;
  const [serviceWorker,offline]=await Promise.all([registerOfflineServiceWorker(),ensureOfflineSurvival({adapter:controller?.adapter||null,force})]);
  if(force)await refreshOfflineAssets();
  window.dispatchEvent(new CustomEvent('morefun:offline-survival-ready',{detail:{runtimeOk:Boolean(runtimeResult?.ok),serviceWorkerOk:Boolean(serviceWorker?.ok),offlineOk:Boolean(offline?.ok),mode:offline?.mode||'unknown',force}}));
}

function unlock(){document.documentElement.dataset.shellUnlocked='1';if(gate)gate.hidden=true;window.dispatchEvent(new CustomEvent('morefun:shell-unlocked'));void startSurvivalLayer();}
function continueAfterLogin(username){const {state}=openingState();if(state.confirmed){unlock();return;}showCash(username);}
function submitLogin(event){event.preventDefault();const form=event.currentTarget,username=String(form.elements.username?.value||'').trim(),password=String(form.elements.password?.value||''),match=credentials().find(row=>row.enabled!==false&&String(row.username)===username&&String(row.password)===password);if(!match){setError('帳號或密碼不正確');return;}saveSession(username);operator=username;continueAfterLogin(username);}
function confirmOpening(event){event.preventDefault();const {operations,state}=openingState(),adjustment=Number(adjustmentInput?.value||0);if(!Number.isFinite(adjustment)){setError('請輸入有效開工現金調整');return;}const openingCash=Math.max(0,Number(state.previousRetained||0)+adjustment),businessDate=businessWindow().id,rows=(operations.openingCashAdjustments||[]).filter(row=>row.businessDate!==businessDate);rows.push({businessDate,previousRetained:Number(state.previousRetained||0),adjustment,openingCash,confirmedAt:Date.now(),operator:operator||validSession()?.username||'morefun'});writeJSON(OPERATIONS_STORAGE_KEY,{...operations,workspaceResetBusinessDate:businessDate,workspaceResetAt:operations.workspaceResetAt||Date.now(),openingCashAdjustments:rows});unlock();}

gate?.querySelector('[data-form="login"]')?.addEventListener('submit',submitLogin);
gate?.querySelector('[data-form="cash"]')?.addEventListener('submit',confirmOpening);
adjustmentInput?.addEventListener('input',updateCashPreview);
window.addEventListener('online',()=>{if(document.documentElement.dataset.shellUnlocked==='1')void startSurvivalLayer({force:true});});

ensureDailyWorkspaceClean();
if(isQaBypass())unlock();else if(validSession())continueAfterLogin(validSession().username);else showStep('login');
window.MoreFunStartup={unlock,showCash,startSurvivalLayer};
