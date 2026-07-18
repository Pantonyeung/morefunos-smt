function navigate(route){
  const clean=String(route||'order').replace(/^#?\/?/,'');
  if(window.parent&&window.parent!==window){window.parent.postMessage({type:'morefun:navigate',route:clean},'*');return;}
  location.hash=`#/${clean}`;
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-route]');
  if(!target)return;
  event.preventDefault();
  navigate(target.dataset.route);
});
window.addEventListener('morefun:navigate',event=>navigate(event.detail?.route));
window.MoreFunPageBridge=Object.freeze({navigate});
