function navigate(route){if(parent&&parent!==window)parent.postMessage({type:'morefun:navigate',route},'*');else location.hash=`#/${route}`;}
function ready(){if(parent&&parent!==window)parent.postMessage({type:'morefun:page-ready',page:document.body.dataset.page||'unknown'},'*');}
function applyPreferences(){
  try{
    const settings=JSON.parse(localStorage.getItem('morefun:smt:v16c:settings')||'{}');
    document.documentElement.dataset.theme=settings.morePage?.theme||'warm';
    document.documentElement.dataset.sounds=settings.morePage?.sounds===false?'off':'on';
  }catch(_error){document.documentElement.dataset.theme='warm';document.documentElement.dataset.sounds='on';}
}
function handleShellNavigation(event){
  const button=event.target?.closest?.('[data-action="shell-navigate"]');
  if(!button||button.disabled)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const route=button.dataset.route;
  if(!route||route===document.body.dataset.page)return;
  navigate(route);
}
function announceReadyAfterStableFrames(){
  const announce=()=>requestAnimationFrame(()=>requestAnimationFrame(ready));
  if(document.fonts?.ready)document.fonts.ready.then(announce,announce);
  else announce();
}
applyPreferences();
document.addEventListener('click',handleShellNavigation,true);
document.addEventListener('DOMContentLoaded',()=>{applyPreferences();announceReadyAfterStableFrames();},{once:true});
window.MoreFunPageBridge={navigate,ready,applyPreferences};