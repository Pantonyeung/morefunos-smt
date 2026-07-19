function navigate(route){
  const clean=String(route||'order').replace(/^#?\/?/,'');
  if(window.parent&&window.parent!==window){window.parent.postMessage({type:'morefun:navigate',route:clean},'*');return;}
  location.hash=`#/${clean}`;
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
window.addEventListener('morefun:navigate',event=>navigate(event.detail?.route));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',announceReady,{once:true});else announceReady();
window.MoreFunPageBridge=Object.freeze({navigate,announceReady});
