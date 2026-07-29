import {authenticateStaff,normalizeAccounts} from './shared/staff-auth.js';
import {createSession,readSession,writeSession,clearSession} from './shared/session-store.js';

const SETTINGS_KEY='morefun:smt:v16c:settings';
const gate=document.getElementById('startup-gate');
const form=gate?.querySelector('form');
const errorBox=document.getElementById('startup-error');
const submitButton=form?.querySelector('button[type="submit"]');
let runtimeStarted=false;

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

async function startRuntime(session){
  if(runtimeStarted)return;
  runtimeStarted=true;
  document.documentElement.dataset.staffReady='1';
  document.documentElement.dataset.staffUser=session?.username||'';
  if(gate)gate.hidden=true;
  await import('./app-loader.js?v=smt-adaptive-transition-v1');
  window.dispatchEvent(new CustomEvent('morefun:staff-ready',{detail:{staff:session}}));
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
  }finally{
    setBusy(false);
  }
}

function lock(){
  clearSession();
  location.reload();
}

form?.addEventListener('submit',submitLogin);
window.MoreFunStaff={lock,getSession:readSession};

const restoredSession=readSession();
if(restoredSession)startRuntime(restoredSession);
else{
  gate.hidden=false;
  requestAnimationFrame(()=>form?.elements.password?.focus());
}
