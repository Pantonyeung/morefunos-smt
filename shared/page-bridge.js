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
function statusActionNodes(){
  const selectors=[
    '.global-statusbar .shell-actions button',
    '.global-statusbar .top-btn',
    '.topbar.statusbar .shell-actions button',
    '.topbar.statusbar .top-btn'
  ];
  const nodes=[];
  selectors.forEach(selector=>document.querySelectorAll(selector).forEach(node=>{if(!nodes.includes(node))nodes.push(node);}));
  return nodes;
}
function statusActionId(node,index){
  if(node.dataset.shellActionId)return node.dataset.shellActionId;
  const seed=node.dataset.action||node.dataset.route||node.getAttribute('aria-label')||'action';
  const id=String(seed).replace(/[^a-zA-Z0-9_-]+/g,'-')+'-'+index;
  node.dataset.shellActionId=id;
  return id;
}
let publishFrame=0;
function publishStatusActions(){
  publishFrame=0;
  if(!(parent&&parent!==window))return;
  const actions=statusActionNodes().map((node,index)=>({
    id:statusActionId(node,index),
    className:node.className||'',
    html:node.innerHTML,
    disabled:Boolean(node.disabled),
    ariaLabel:node.getAttribute('aria-label')||''
  }));
  parent.postMessage({type:'morefun:status-actions',page:document.body.dataset.page||'unknown',actions},'*');
}
function scheduleStatusActions(){if(publishFrame)return;publishFrame=requestAnimationFrame(()=>requestAnimationFrame(publishStatusActions));}
function triggerStatusAction(message){
  const source=statusActionNodes().find((node,index)=>statusActionId(node,index)===message.id);
  if(!source||source.disabled)return;
  let handled=false;
  try{
    const actionEvent=new CustomEvent('morefun:status-action',{bubbles:true,cancelable:true,detail:{anchor:message.anchor||null}});
    handled=!source.dispatchEvent(actionEvent);
  }catch(_error){}
  if(!handled)source.click();
  scheduleStatusActions();
}
function handleParentMessage(event){
  if(event.source!==parent)return;
  const message=event.data||{};
  if(message.type==='morefun:status-action-trigger'){triggerStatusAction(message);return;}
  if(message.type==='morefun:page-activate'){scheduleStatusActions();}
}
function announceReadyAfterStableFrames(){
  const announce=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{ready();publishStatusActions();}));
  if(document.fonts?.ready)document.fonts.ready.then(announce,announce);
  else announce();
}
applyPreferences();
document.addEventListener('click',event=>{handleShellNavigation(event);scheduleStatusActions();},true);
document.addEventListener('change',scheduleStatusActions,true);
window.addEventListener('morefun:layout-invalidated',scheduleStatusActions);
window.addEventListener('message',handleParentMessage);
document.addEventListener('DOMContentLoaded',()=>{applyPreferences();announceReadyAfterStableFrames();},{once:true});
window.MoreFunPageBridge={navigate,ready,applyPreferences,publishStatusActions};
