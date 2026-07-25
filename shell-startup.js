import {OPERATIONS_STORAGE_KEY,SETTINGS_STORAGE_KEY,readJSON,writeJSON} from './shared/store.js';
import {businessWindow,buildOpeningCashState} from './pages/more/more-domain.js';

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

function isQaBypass(){
  const params=new URLSearchParams(location.search);
  return params.get('embedded-preview')==='1'||(navigator.webdriver&&params.get('force-startup')!=='1');
}

function credentials(){
  const settings=readJSON(SETTINGS_STORAGE_KEY,{});
  const accounts=Array.isArray(settings?.auth?.accounts)?settings.auth.accounts:[];
  return accounts.length?accounts:[{username:'morefun',password:'morefun',enabled:true}];
}

function session(){
  try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');}catch{return null;}
}

function saveSession(username){
  const day=businessWindow().id;
  sessionStorage.setItem(SESSION_KEY,JSON.stringify({username,businessDate:day,loginAt:Date.now()}));
}

function validSession(){
  const row=session();
  return row&&row.businessDate===businessWindow().id&&row.username;
}

function openingState(){
  const operations=readJSON(OPERATIONS_STORAGE_KEY,{});
  return {
    operations,
    state:buildOpeningCashState(operations.dayCloses||[],operations.openingCashAdjustments||[],businessWindow().id)
  };
}

function setError(message=''){
  if(!errorBox)return;
  errorBox.textContent=message;
  errorBox.hidden=!message;
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
  if(operatorLabel)operatorLabel.textContent=operator||validSession()?.username||'morefun';
}

function showCash(username){
  operator=username||validSession()?.username||'morefun';
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
  window.dispatchEvent(new CustomEvent('morefun:shell-unlocked'));
}

function continueAfterLogin(username){
  const {state}=openingState();
  if(state.confirmed){unlock();return;}
  showCash(username);
}

function submitLogin(event){
  event.preventDefault();
  const form=event.currentTarget;
  const username=String(form.elements.username?.value||'').trim();
  const password=String(form.elements.password?.value||'');
  const match=credentials().find(row=>row.enabled!==false&&String(row.username)===username&&String(row.password)===password);
  if(!match){setError('帳號或密碼不正確');return;}
  saveSession(username);
  operator=username;
  continueAfterLogin(username);
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
  writeJSON(OPERATIONS_STORAGE_KEY,{...operations,openingCashAdjustments:rows});
  unlock();
}

gate?.querySelector('[data-form="login"]')?.addEventListener('submit',submitLogin);
gate?.querySelector('[data-form="cash"]')?.addEventListener('submit',confirmOpening);
adjustmentInput?.addEventListener('input',updateCashPreview);

if(isQaBypass())unlock();
else if(validSession())continueAfterLogin(validSession().username);
else showStep('login');

window.MoreFunStartup={unlock,showCash};