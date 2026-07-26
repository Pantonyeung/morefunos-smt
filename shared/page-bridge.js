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
let statusActions=[];
function normalizeStatusActions(actions){
  return (Array.isArray(actions)?actions:[]).map((action,index)=>({
    id:String(action?.id||`action-${index}`),
    className:String(action?.className||''),
    html:String(action?.html||action?.label||''),
    disabled:Boolean(action?.disabled),
    ariaLabel:String(action?.ariaLabel||action?.label||'')
  }));
}
function publishStatusActions(){
  if(!(parent&&parent!==window))return;
  parent.postMessage({type:'morefun:status-actions',page:document.body.dataset.page||'unknown',actions:statusActions},'*');
}
function setStatusActions(actions){statusActions=normalizeStatusActions(actions);publishStatusActions();}
function triggerStatusAction(message){
  const action=statusActions.find(item=>item.id===message.id);
  if(!action||action.disabled)return;
  window.dispatchEvent(new CustomEvent('morefun:status-action-trigger',{detail:{id:action.id,anchor:message.anchor||null}}));
}
function handleParentMessage(event){
  if(event.source!==parent)return;
  const message=event.data||{};
  if(message.type==='morefun:status-action-trigger'){triggerStatusAction(message);return;}
  if(message.type==='morefun:page-activate'){publishStatusActions();}
}
function announceReadyAfterStableFrames(){
  const announce=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{ready();publishStatusActions();}));
  if(document.fonts?.ready)document.fonts.ready.then(announce,announce);
  else announce();
}
applyPreferences();
document.addEventListener('click',handleShellNavigation,true);
window.addEventListener('message',handleParentMessage);
document.addEventListener('DOMContentLoaded',()=>{applyPreferences();announceReadyAfterStableFrames();},{once:true});
window.MoreFunPageBridge={navigate,ready,applyPreferences,publishStatusActions,setStatusActions};