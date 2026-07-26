const host=document.getElementById('shell-page-actions');
const stage=document.getElementById('stage');
const actionsByFrame=new WeakMap();
let syncFrame=0;

function activePageFrame(){return stage?.querySelector('.shell-page.is-active')||null;}
function frameForSource(source){return [...(stage?.querySelectorAll('iframe')||[])].find(frame=>frame.contentWindow===source)||null;}
function syncShellActions(){
  syncFrame=0;
  if(!host)return;
  const frame=activePageFrame();
  const actions=frame?actionsByFrame.get(frame)||[]:[];
  const fragment=document.createDocumentFragment();
  actions.forEach(action=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='shell-page-action '+(action.className||'');
    button.innerHTML=action.html||'';
    button.disabled=Boolean(action.disabled);
    button.dataset.shellActionId=String(action.id||'');
    if(action.ariaLabel)button.setAttribute('aria-label',action.ariaLabel);
    fragment.appendChild(button);
  });
  host.replaceChildren(fragment);
  host.hidden=!actions.length;
}
function scheduleSync(){if(syncFrame)return;syncFrame=requestAnimationFrame(()=>requestAnimationFrame(syncShellActions));}
function proxyAnchorInFrame(proxy,frame){
  const proxyRect=proxy?.getBoundingClientRect?.();
  const frameRect=frame?.getBoundingClientRect?.();
  if(!proxyRect||!frameRect)return null;
  return {
    left:proxyRect.left-frameRect.left,
    right:proxyRect.right-frameRect.left,
    top:proxyRect.top-frameRect.top,
    bottom:proxyRect.bottom-frameRect.top,
    width:proxyRect.width,
    height:proxyRect.height
  };
}

host?.addEventListener('click',event=>{
  const proxy=event.target.closest('[data-shell-action-id]');
  if(!proxy||proxy.disabled)return;
  const frame=activePageFrame();
  if(!frame)return;
  frame.contentWindow?.postMessage({type:'morefun:status-action-trigger',id:proxy.dataset.shellActionId,anchor:proxyAnchorInFrame(proxy,frame)},'*');
});

addEventListener('message',event=>{
  const message=event.data||{};
  if(message.type!=='morefun:status-actions')return;
  const frame=frameForSource(event.source);
  if(!frame)return;
  actionsByFrame.set(frame,Array.isArray(message.actions)?message.actions:[]);
  if(frame===activePageFrame())scheduleSync();
});

stage?.addEventListener('load',scheduleSync,true);
addEventListener('hashchange',scheduleSync);
addEventListener('pageshow',scheduleSync);
scheduleSync();

export {syncShellActions};
