const statusControl=document.getElementById('shell-online');
const gate=document.getElementById('startup-gate');
const loginStep=gate?.querySelector('[data-startup-step="login"]');
const cashStep=gate?.querySelector('[data-startup-step="cash"]');
const errorBox=document.getElementById('startup-error');

function openSupplyLogin(){
  const runtime=window.MoreFunStartup?.supplyRuntime;
  if(runtime?.getSession?.()){
    void runtime.flushPending?.();
    void runtime.refresh?.();
    return;
  }
  if(!gate||!loginStep)return;
  gate.hidden=false;
  gate.dataset.step='login';
  loginStep.hidden=false;
  if(cashStep)cashStep.hidden=true;
  if(errorBox){errorBox.hidden=false;errorBox.textContent='請重新登入，將本機售罄變更同步到 SMT／SMM／Customer。';}
  requestAnimationFrame(()=>loginStep.querySelector('[name="username"]')?.focus());
}

if(statusControl){
  statusControl.setAttribute('role','button');
  statusControl.tabIndex=0;
  statusControl.title='查看或重新連接供應狀態同步';
  statusControl.addEventListener('click',openSupplyLogin);
  statusControl.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openSupplyLogin();}});
}
