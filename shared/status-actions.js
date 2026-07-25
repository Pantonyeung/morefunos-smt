const host=document.getElementById('shell-page-actions');
const stage=document.getElementById('stage');
let activeFrame=null;
let childObserver=null;
let syncFrame=0;

function activePageFrame(){return stage?.querySelector('.shell-page.is-active')||null;}
function childActionNodes(frame){
  try{
    const doc=frame?.contentDocument;
    if(!doc)return [];
    const selectors=[
      '.global-statusbar .shell-actions button',
      '.global-statusbar .top-btn',
      '.topbar.statusbar .shell-actions button',
      '.topbar.statusbar .top-btn'
    ];
    const nodes=[];
    selectors.forEach(selector=>doc.querySelectorAll(selector).forEach(node=>{if(!nodes.includes(node))nodes.push(node);}));
    return nodes;
  }catch(_error){return []}
}

function syncChildStatusActions(){
  syncFrame=0;
  if(!host)return;
  const frame=activePageFrame();
  if(!frame){host.replaceChildren();return;}
  const actions=childActionNodes(frame);
  const fragment=document.createDocumentFragment();
  actions.forEach((source,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='shell-page-action '+(source.className||'');
    button.innerHTML=source.innerHTML;
    button.disabled=source.disabled;
    button.dataset.shellProxyIndex=String(index);
    button.setAttribute('data-shell-proxy-index',String(index));
    const label=source.getAttribute('aria-label');
    if(label)button.setAttribute('aria-label',label);
    fragment.appendChild(button);
  });
  host.replaceChildren(fragment);
  host.hidden=!actions.length;
  if(frame!==activeFrame){
    activeFrame=frame;
    childObserver?.disconnect();
    try{
      const doc=frame.contentDocument;
      childObserver=new MutationObserver(scheduleSync);
      childObserver.observe(doc.body||doc.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','disabled','hidden','aria-label']});
    }catch(_error){}
  }
}

function scheduleSync(){
  if(syncFrame)return;
  syncFrame=requestAnimationFrame(syncChildStatusActions);
}

host?.addEventListener('click',event=>{
  const proxy=event.target.closest('[data-shell-proxy-index]');
  if(!proxy||proxy.disabled)return;
  const frame=activePageFrame();
  const index=Number(proxy.dataset.shellProxyIndex);
  const source=childActionNodes(frame)[index];
  if(source&&!source.disabled)source.click();
});

stage?.addEventListener('load',scheduleSync,true);
new MutationObserver(scheduleSync).observe(stage,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-hidden']});
addEventListener('pageshow',scheduleSync);
scheduleSync();

export {syncChildStatusActions};
