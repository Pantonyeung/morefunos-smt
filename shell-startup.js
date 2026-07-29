import {OPERATIONS_STORAGE_KEY,SETTINGS_STORAGE_KEY,ORDER_STORAGE_KEY,DRAFT_STORAGE_KEY,DRAFT_COUNTER_STORAGE_KEY,readJSON,writeJSON} from './shared/store.js';
import {businessWindow,buildOpeningCashState} from './pages/more/more-domain.js';
import {normalizeAccounts,authenticateStaff} from './shared/staff-auth.js';
import {createSession,readSession,writeSession,clearSession} from './shared/session-store.js';

const gate=document.getElementById('startup-gate');
const loginStep=gate?.querySelector('[data-startup-step="login"]');
const cashStep=gate?.querySelector('[data-startup-step="cash"]');
const errorBox=document.getElementById('startup-error');
const cashPrevious=document.getElementById('opening-previous');
const cashTotal=document.getElementById('opening-total');
const adjustmentInput=gate?.querySelector('[name="opening-adjustment"]');
const operatorLabel=document.getElementById('opening-operator');
const loginButton=gate?.querySelector('[data-form="login"] .startup-primary');
let operator='';

function isQaBypass(){
  const params=new URLSearchParams(location.search);
  return navigator.webdriver&&params.get('force-startup')!=='1';
}

function accounts(){
  return normalizeAccounts(readJSON(SETTINGS_STORAGE_KEY,{}));
}

function validSession(){
  return readSession();
}

function openingState(){
  const operations=readJSON(OPERATIONS_STORAGE_KEY,{});
  return {
    operations,
    state:buildOpeningCashState(operations.dayCloses||[],operations.openingCashAdjustments||[],businessWindow().id)
  };
}

function ensureDailyWorkspaceClean(){
  const businessDate=businessWindow().id;
  const operations=readJSON(OPERATIONS_STORAGE_KEY,{})||{};
  if(operations.workspaceResetBusinessDate===businessDate)return false;
  localStorage.removeItem(ORDER_STORAGE_KEY);
  localStorage.removeItem(DRAFT_STORAGE_KEY);
  localStorage.removeItem(DRAFT_COUNTER_STORAGE_KEY);
  writeJSON(OPERATIONS_STORAGE_KEY,{...operations,workspaceResetBusinessDate:businessDate,workspaceResetAt:Date.now()});
  return true;
}

function setError(message=''){
  if(!errorBox)return;
  errorBox.textContent=message;
  errorBox.hidden=!message;
}

function setLoginBusy(busy){
  if(!loginButton)return;
  loginButton.disabled=busy;
  loginButton.textContent=busy?'登入中…':'登入';
}

function showStep(name){
  if(!gate)return;
  gate.hidden=false;
  loginStep.hidden=name!=='login';
  cashStep.hidden=name!=='cash';
  gate.dataset.step=name;
}

function updateCashPreview(){
  const {state}=openingState();
  const adjustment=Number(adjustmentInput?.value||0);
  const total=Math.max(0,Number(state.previousRetained||0)+adjustment);
  if(cashPrevious)cashPrevious.textContent='$'+Number(state.previousRetained||0).toLocaleString('zh-HK');
  if(cashTotal)cashTotal.textContent='$'+total.toLocaleString('zh-HK',{maximumFractionDigits:2});
  if(operatorLabel)operatorLabel.textContent=operator||validSession()?.displayName||validSession()?.username||'morefun';
}

function showCash(username){
  const row=validSession();
  operator=username||row?.displayName||row?.username||'morefun';
  const {state}=openingState();
  showStep('cash');
  if(adjustmentInput)adjustmentInput.value=String(state.adjustment||0);
  updateCashPreview();
  setError('');
  requestAnimationFrame(()=>adjustmentInput?.focus());
}

function unlock(){
  document.documentElement.dataset.shellUnlocked='1';
  if(gate)gate.hidden=true;
  window.dispatchEvent(new CustomEvent('morefun:shell-unlocked',{detail:{staff:validSession()}}));
}

function continueAfterLogin(username){
  const {state}=openingState();
  if(state.confirmed){unlock();return;}
  showCash(username);
}

async function submitLogin(event){
  event.preventDefault();
  const form=event.currentTarget;
  const username=String(form.elements.username?.value||'').trim();
  const password=String(form.elements.password?.value||'');
  setError('');
  setLoginBusy(true);
  try{
    const result=await authenticateStaff({username,password,accounts:accounts()});
    if(!result.ok){
      setError('帳號或密碼不正確');
      form.elements.password?.select();
      return;
    }
    const session=writeSession(createSession(result.staff));
    operator=session.displayName||session.username;
    form.elements.password.value='';
    continueAfterLogin(operator);
  }catch{
    setError('登入暫時未能完成，請再試一次');
  }finally{
    setLoginBusy(false);
  }
}

function confirmOpening(event){
  event.preventDefault();
  const {operations,state}=openingState();
  const adjustment=Number(adjustmentInput?.value||0);
  if(!Number.isFinite(adjustment)){setError('請輸入有效開工現金調整');return;}
  const openingCash=Math.max(0,Number(state.previousRetained||0)+adjustment);
  const businessDate=businessWindow().id;
  const rows=(operations.openingCashAdjustments||[]).filter(row=>row.businessDate!==businessDate);
  rows.push({businessDate,previousRetained:Number(state.previousRetained||0),adjustment,openingCash,confirmedAt:Date.now(),operator:operator||validSession()?.username||'morefun'});
  writeJSON(OPERATIONS_STORAGE_KEY,{...operations,workspaceResetBusinessDate:businessDate,workspaceResetAt:operations.workspaceResetAt||Date.now(),openingCashAdjustments:rows});
  unlock();
}

function lock(){
  clearSession();
  delete document.documentElement.dataset.shellUnlocked;
  showStep('login');
  gate?.querySelector('[name="password"]')?.focus();
}

gate?.querySelector('[data-form="login"]')?.addEventListener('submit',submitLogin);
gate?.querySelector('[data-form="cash"]')?.addEventListener('submit',confirmOpening);
adjustmentInput?.addEventListener('input',updateCashPreview);

ensureDailyWorkspaceClean();
const restoredSession=validSession();
if(isQaBypass())unlock();
else if(restoredSession)continueAfterLogin(restoredSession.displayName||restoredSession.username);
else showStep('login');

window.MoreFunStartup={unlock,showCash,lock,getSession:validSession};
