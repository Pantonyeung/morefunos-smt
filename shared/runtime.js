export function createRenderQueue(renderFn){
  let scheduled=false;
  let rendering=false;
  let pending=false;
  const run=()=>{
    scheduled=false;
    if(rendering){pending=true;return;}
    rendering=true;
    try{renderFn();}catch(error){window.dispatchEvent(new CustomEvent('morefun:runtime-error',{detail:error}));}
    finally{rendering=false;if(pending){pending=false;schedule();}}
  };
  const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(run);};
  return {schedule,flush:run};
}

export function createStore(initialState,{storageKey,normalize}={}){
  let state=normalize?normalize(initialState):structuredClone(initialState);
  const listeners=new Set();
  const get=()=>state;
  const persist=()=>{if(storageKey)localStorage.setItem(storageKey,JSON.stringify(state));};
  const set=updater=>{
    const next=typeof updater==='function'?updater(structuredClone(state)):updater;
    state=normalize?normalize(next):next;
    persist();
    listeners.forEach(fn=>fn(state));
  };
  const subscribe=fn=>{listeners.add(fn);return()=>listeners.delete(fn);};
  return {get,set,subscribe,persist};
}

export function createOverlayManager(){
  let overlay=null;
  const close=()=>{overlay?.remove();overlay=null;};
  const open=({anchor,content,className='anchored-popover',onClose})=>{
    close();
    const scrim=document.createElement('button');
    scrim.className='overlay-scrim';
    scrim.setAttribute('aria-label','返回');
    const panel=document.createElent('section');
    panel.className=className;
    panel.innerHTML=content;
    document.body.append(scrim,panel);
    overlay={scrim,panel,remove(){crim.remove();panel.remove();onClose?.();}};
    const position=()=>{
      const rect=anchor.getBoundingClientRect();
      const width=Math.min(420,Math.max(260,rect.width));
      panel.style.width=`${width}px`;
      const left=Math.max(12,Math.min(window.innerWidth-width-12,rect.left+(rect.width-width)/2));
      panel.style.left=`${left}px`;
      const top=Math.max(12,rect.top-panel.offsetHeight-10);
      panel.style.top=`${top}px`;
    };
    requestAnimationFrame(position);
    scrim.addEventListener('click',close,{once:true});
    return {panel,close,position};
  };
  return {open,close,get panel(){return overlay?.panel||null;}};
}

export function installErrorBoundary({toast,report}={}){
  const handle=error=>{
    console.error('MORE_FUN_RUNTIME_ERROR',error);
    toast?.('操作未完成，資料已保留，請再試一次');
    report?.(error);
  };
  window.addEventListener('error',event=>{event.preventDefault();handle(event.error||event.message);});
  window.addEventListener('unhandledrejection',event=>{event.preventDefault();handle(event.reason);});
  return handle;
}

export function createViewportFitter(stage,{width=1920,height=1080}={}){
  let raf=0,last='';
  const fit=()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      const scale=Math.min(1,innerWidth/width,innerHeight/height);
      const left=Math.max(0,(innerWidth-width*scale)/2);
      const top=Math.max(0,(innerHeight-height*scale)/2);
      const key=`${scale.toFixed(6)}|${left.toFixed(2)}|${top.toFixed(2)}`;
      if(key===last)return;last=key;
      stage.style.transform=`scale(${scale})`;
      stage.style.left=`${left}px`;stage.style.top=`${top}px`;
      stage.dataset.scale=scale.toFixed(6);
    });
  };
  addEventListener('resize',fit,{passive:true});
  addEventListener('orientationchange',fit,{passive:true});
  fit();
  return fit;
}
