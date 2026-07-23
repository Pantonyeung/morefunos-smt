function navigate(route){if(parent&&parent!==window)parent.postMessage({type:'morefun:navigate',route},'*');else location.hash=`#/${route}`;}
function ready(){if(parent&&parent!==window)parent.postMessage({type:'morefun:page-ready',page:document.body.dataset.page||'unknown'},'*');}
function applyPreferences(){
  try{
    const settings=JSON.parse(localStorage.getItem('morefun:smt:v16c:settings')||'{}');
    document.documentElement.dataset.theme=settings.morePage?.theme||'warm';
    document.documentElement.dataset.sounds=settings.morePage?.sounds===false?'off':'on';
  }catch(_error){document.documentElement.dataset.theme='warm';document.documentElement.dataset.sounds='on';}
}
function markReady(){applyPreferences();ready();}
applyPreferences();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',markReady,{once:true});else queueMicrotask(markReady);
window.addEventListener('message',event=>{if(event.data?.type==='morefun:ping')markReady();});
window.MoreFunPageBridge={navigate,ready,applyPreferences};