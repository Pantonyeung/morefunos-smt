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
    sourceId:String(action?.sourceId||action?.id||`action-${index}`),
    action:String(action?.action||action?.dataset?.action||''),
    dataset:{...(action?.dataset||{})},
    className:String(action?.className||''),
    html:String(action?.html||action?.label||''),
    disabled:Boolean(action?.disabled),
    ariaLabel:String(action?.ariaLabel||action?.label||'')
  }));
}
function syncStatusActionSources(){
  const app=document.getElementById('app');
  if(!app)return;
  let host=app.querySelector(':scope > [data-shell-bridge-sources]');
  if(!host){
    host=document.createElement('div');
    host.hidden=true;
    host.dataset.shellBridgeSources='';
    app.appendChild(host);
  }
  const fragment=document.createDocumentFragment();
  statusActions.forEach(action=>{
    const button=document.createElement('button');
    button.type='button';
    button.hidden=true;
    button.disabled=action.disabled;
    button.dataset.shellSourceId=action.sourceId;
    Object.entries(action.dataset||{}).forEach(([key,value])=>{button.dataset[key]=String(value);});
    if(action.action&&!button.dataset.action)button.dataset.action=action.action;
    button.setAttribute('aria-hidden','true');
    fragment.appendChild(button);
  });
  host.replaceChildren(fragment);
}
function publishStatusActions(){
  if(!(parent&&parent!==window))return;
  parent.postMessage({type:'morefun:status-actions',page:document.body.dataset.page||'unknown',actions:statusActions.map(({sourceId,dataset,action,...publicAction})=>publicAction)},'*');
}
function setStatusActions(actions){statusActions=normalizeStatusActions(actions);syncStatusActionSources();publishStatusActions();}
function triggerStatusAction(message){
  let source=document.querySelector(`[data-shell-source-id="${CSS.escape(message.id)}"]`);
  if(!source){syncStatusActionSources();source=document.querySelector(`[data-shell-source-id="${CSS.escape(message.id)}"]`);}
  if(!source||source.disabled)return;
  let handled=false;
  try{
    const actionEvent=new CustomEvent('morefun:status-action',{bubbles:true,cancelable:true,detail:{anchor:message.anchor||null}});
    handled=!source.dispatchEvent(actionEvent);
  }catch(_error){}
  if(!handled)source.click();
}
function handleParentMessage(event){
  if(event.source!==parent)return;
  const message=event.data||{};
  if(message.type==='morefun:status-action-trigger'){triggerStatusAction(message);return;}
  if(message.type==='morefun:page-activate'){syncStatusActionSources();publishStatusActions();}
}
function announceReadyAfterStableFrames(){
  const announce=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{ready();syncStatusActionSources();publishStatusActions();}));
  if(document.fonts?.ready)document.fonts.ready.then(announce,announce);
  else announce();
}
applyPreferences();
document.addEventListener('click',handleShellNavigation,true);
window.addEventListener('message',handleParentMessage);
document.addEventListener('DOMContentLoaded',()=>{applyPreferences();announceReadyAfterStableFrames();},{once:true});
window.MoreFunPageBridge={navigate,ready,applyPreferences,publishStatusActions,setStatusActions};
