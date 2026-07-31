const statusControl=document.getElementById('shell-online');

function openSupplyLogin(){
  const startup=window.MoreFunStartup;
  const runtime=startup?.supplyRuntime;
  if(runtime?.getSession?.()){
    void runtime.flushPending?.();
    void runtime.refresh?.();
    return;
  }
  startup?.showLogin?.('請重新登入，將本機售罄變更同步到 SMT／SMM／Customer。');
}

if(statusControl){
  statusControl.setAttribute('role','button');
  statusControl.tabIndex=0;
  statusControl.title='查看或重新連接供應狀態同步';
  statusControl.addEventListener('click',openSupplyLogin);
  statusControl.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openSupplyLogin();}});
}
