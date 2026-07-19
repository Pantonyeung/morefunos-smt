export function safeClone(value){
  if(typeof structuredClone==='function'){
    try{return structuredClone(value);}catch(_error){}
  }
  return JSON.parse(JSON.stringify(value));
}

export function createRenderQueue(renderFn){
  let scheduled=false;
  let rendering=false;
  let pending=false;
  const run=function(){
    scheduled=false;
    if(rendering){pending=true;return;}
    rendering=true;
    try{renderFn();}
    catch(error){window.dispatchEvent(new CustomEvent('morefun:runtime-error',{detail:error}));}
    finally{
      rendering=false;
      if(pending){pending=false;schedule();}
    }
  };
  const schedule=function(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(run);
  };
  return {schedule:schedule,flush:run};
}

export function createStore(initialState,options){
  options=options||{};
  let state=options.normalize?options.normalize(initialState):safeClone(initialState);
  const listeners=new Set();
  function get(){return state;}
  function persist(){
    if(!options.storageKey)return;
    try{localStorage.setItem(options.storageKey,JSON.stringify(state));}catch(error){console.warn('STORE_PERSIST_FAILED',error);}
  }
  function set(updater){
    const draft=safeClone(state);
    const next=typeof updater==='function'?updater(draft):updater;
    state=options.normalize?options.normalize(next):next;
    persist();
    listeners.forEach(function(fn){fn(state);});
  }
  function subscribe(fn){listeners.add(fn);return function(){listeners.delete(fn);};}
  return {get:get,set:set,subscribe:subscribe,persist:persist};
}

export function createOverlayManager(){
  let overlay=null;
  function close(){
    if(!overlay)return;
    overlay.scrim.remove();
    overlay.panel.remove();
    if(overlay.onClose)overlay.onClose();
    overlay=null;
  }
  function open(options){
    close();
    const anchor=options.anchor;
    const scrim=document.createElement('button');
    scrim.className='overlay-scrim';
    scrim.setAttribute('aria-label','返回');
    const panel=document.createElement('section');
    panel.className=options.className||'anchored-popover';
    panel.innerHTML=options.content||'';
    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    overlay={scrim:scrim,panel:panel,onClose:options.onClose||null};
    function position(){
      const rect=anchor.getBoundingClientRect();
      const width=Math.min(420,Math.max(260,rect.width));
      panel.style.width=width+'px';
      const left=Math.max(12,Math.min(window.innerWidth-width-12,rect.left+(rect.width-width)/2));
      panel.style.left=left+'px';
      panel.style.top=Math.max(12,rect.top-panel.offsetHeight-10)+'px';
    }
    requestAnimationFrame(position);
    scrim.addEventListener('click',close,{once:true});
    return {panel:panel,close:close,position:position};
  }
  return {open:open,close:close,get panel(){return overlay?overlay.panel:null;}};
}

export function installErrorBoundary(options){
  options=options||{};
  function handle(error){
    console.error('MORE_FUN_RUNTIME_ERROR',error);
    if(options.toast)options.toast('操作未完成，資料已保留，請再試一次');
    if(options.report)options.report(error);
  }
  window.addEventListener('error',function(event){event.preventDefault();handle(event.error||event.message);});
  window.addEventListener('unhandledrejection',function(event){event.preventDefault();handle(event.reason);});
  return handle;
}

export function createViewportFitter(stage,options){
  options=options||{};
  const width=options.width||1920;
  const height=options.height||1080;
  let raf=0;
  let last='';
  function fit(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(function(){
      const scale=Math.min(1,window.innerWidth/width,window.innerHeight/height);
      const left=Math.max(0,(window.innerWidth-width*scale)/2);
      const top=Math.max(0,(window.innerHeight-height*scale)/2);
      const key=scale.toFixed(6)+'|'+left.toFixed(2)+'|'+top.toFixed(2);
      if(key===last)return;
      last=key;
      stage.style.transform='scale('+scale+')';
      stage.style.left=left+'px';
      stage.style.top=top+'px';
      stage.dataset.scale=scale.toFixed(6);
    });
  }
  window.addEventListener('resize',fit,{passive:true});
  window.addEventListener('orientationchange',fit,{passive:true});
  fit();
  return fit;
}
