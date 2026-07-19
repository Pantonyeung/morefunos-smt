function navigate(route){
  const clean=String(route||'order').replace(/^#?\/?/,'');
  if(window.parent&&window.parent!==window){window.parent.postMessage({type:'morefun:navigate',route:clean},'*');return;}
  location.hash=`#/${clean}`;
}

function postRuntimeError(error){
  if(!(window.parent&&window.parent!==window))return;
  const message=String(error?.message||error?.reason?.message||error?.reason||error||'unknown');
  window.parent.postMessage({type:'morefun:page-runtime-error',page:document.body?.dataset?.page||'unknown',message},'*');
}

function announceReady(){
  const page=document.body?.dataset?.page||location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'unknown';
  if(window.parent&&window.parent!==window)window.parent.postMessage({type:'morefun:page-ready',page},'*');
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-route]');
  if(!target)return;
  event.preventDefault();
  navigate(target.dataset.route);
});
window.addEventListener('error',event=>postRuntimeError(event.error||event.message));
window.addEventListener('unhandledrejection',event=>postRuntimeError(event.reason));
window.addEventListener('morefun:navigate',event=>navigate(event.detail?.route));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',announceReady,{once:true});else announceReady();
window.MoreFunPageBridge=Object.freeze({navigate,announceReady,postRuntimeError});
