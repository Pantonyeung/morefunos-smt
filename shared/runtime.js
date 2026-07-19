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
    try{localStorage.setItem(options.storageKey,JSON.stringify(state));}
    catch(error){console.warn('STORE_PERSIST_FAILED',error);}
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

/*
 * V16i Anchored Card Engine
 * - No MutationObserver
 * - Tracks only the current user click
 * - Repositions once after the card renders
 * - Works inside the fixed 1920x1080 order page coordinate system
 */
const ANCHORED_TRIGGER_ACTIONS=new Set([
  'quick-drink',
  'completion-drink',
  'edit-line',
  'open-completion',
  'open-status',
  'open-health',
  'toggle-card',
  'setting-card',
  'complete-group'
]);

let lastAnchor=null;
let lastAction='';
let anchorFrame=0;

function injectAnchoredCardStyles(){
  if(document.getElementById('morefun-anchored-card-styles'))return;
  const style=document.createElement('style');
  style.id='morefun-anchored-card-styles';
  style.textContent=`
    .anchored-source-card{
      --anchor-x:50%;
      --anchor-y:50%;
      --arrow-size:15px;
      overflow:visible!important;
    }
    .anchored-source-card::before,
    .anchored-source-card::after{
      content:"";
      position:absolute;
      width:0;
      height:0;
      pointer-events:none;
      z-index:3;
    }
    .anchored-source-card[data-arrow-side="bottom"]::before{
      left:var(--anchor-x);
      bottom:calc(var(--arrow-size) * -1);
      transform:translateX(-50%);
      border-left:var(--arrow-size) solid transparent;
      border-right:var(--arrow-size) solid transparent;
      border-top:var(--arrow-size) solid var(--line,#e7dfd8);
    }
    .anchored-source-card[data-arrow-side="bottom"]::after{
      left:var(--anchor-x);
      bottom:calc((var(--arrow-size) - 2px) * -1);
      transform:translateX(-50%);
      border-left:calc(var(--arrow-size) - 2px) solid transparent;
      border-right:calc(var(--arrow-size) - 2px) solid transparent;
      border-top:calc(var(--arrow-size) - 2px) solid #fff;
    }
    .anchored-source-card[data-arrow-side="top"]::before{
      left:var(--anchor-x);
      top:calc(var(--arrow-size) * -1);
      transform:translateX(-50%);
      border-left:var(--arrow-size) solid transparent;
      border-right:var(--arrow-size) solid transparent;
      border-bottom:var(--arrow-size) solid var(--line,#e7dfd8);
    }
    .anchored-source-card[data-arrow-side="top"]::after{
      left:var(--anchor-x);
      top:calc((var(--arrow-size) - 2px) * -1);
      transform:translateX(-50%);
      border-left:calc(var(--arrow-size) - 2px) solid transparent;
      border-right:calc(var(--arrow-size) - 2px) solid transparent;
      border-bottom:calc(var(--arrow-size) - 2px) solid #fff;
    }
    .anchored-source-card[data-arrow-side="left"]::before{
      top:var(--anchor-y);
      left:calc(var(--arrow-size) * -1);
      transform:translateY(-50%);
      border-top:var(--arrow-size) solid transparent;
      border-bottom:var(--arrow-size) solid transparent;
      border-right:var(--arrow-size) solid var(--line,#e7dfd8);
    }
    .anchored-source-card[data-arrow-side="left"]::after{
      top:var(--anchor-y);
      left:calc((var(--arrow-size) - 2px) * -1);
      transform:translateY(-50%);
      border-top:calc(var(--arrow-size) - 2px) solid transparent;
      border-bottom:calc(var(--arrow-size) - 2px) solid transparent;
      border-right:calc(var(--arrow-size) - 2px) solid #fff;
    }
    .anchored-source-card[data-arrow-side="right"]::before{
      top:var(--anchor-y);
      right:calc(var(--arrow-size) * -1);
      transform:translateY(-50%);
      border-top:var(--arrow-size) solid transparent;
      border-bottom:var(--arrow-size) solid transparent;
      border-left:var(--arrow-size) solid var(--line,#e7dfd8);
    }
    .anchored-source-card[data-arrow-side="right"]::after{
      top:var(--anchor-y);
      right:calc((var(--arrow-size) - 2px) * -1);
      transform:translateY(-50%);
      border-top:calc(var(--arrow-size) - 2px) solid transparent;
      border-bottom:calc(var(--arrow-size) - 2px) solid transparent;
      border-left:calc(var(--arrow-size) - 2px) solid #fff;
    }
    .anchored-source-card[data-source-action="quick-drink"],
    .anchored-source-card[data-source-action="completion-drink"]{
      --arrow-size:13px;
    }
    .anchored-source-highlight{
      outline:3px solid rgba(239,82,24,.28)!important;
      outline-offset:2px;
    }
  `;
  document.head.appendChild(style);
}

function clearAnchorHighlight(){
  document.querySelectorAll('.anchored-source-highlight').forEach(function(node){
    node.classList.remove('anchored-source-highlight');
  });
}

function rememberAnchor(target){
  const trigger=target.closest('[data-action]');
  if(!trigger)return;
  const action=trigger.dataset.action||'';
  if(!ANCHORED_TRIGGER_ACTIONS.has(action))return;
  clearAnchorHighlight();
  lastAnchor=trigger;
  lastAction=action;
  trigger.classList.add('anchored-source-highlight');
}

function cardForAction(action){
  if(action==='quick-drink'||action==='completion-drink'||action==='complete-group')return document.querySelector('.anchored-popover');
  if(action==='edit-line')return document.querySelector('.edit-card');
  if(action==='open-completion')return document.querySelector('.completion-card,.side-card');
  if(action==='open-status')return document.querySelector('.status-card,.side-card');
  if(action==='open-health')return document.querySelector('.health-card,.side-card');
  if(action==='toggle-card'||action==='setting-card')return document.querySelector('.side-card');
  return document.querySelector('.anchored-popover,.edit-card,.side-card');
}

function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

function placeAnchoredCard(card,anchor,action){
  if(!card||!anchor||!anchor.isConnected)return;
  const anchorRect=anchor.getBoundingClientRect();
  const cardRect=card.getBoundingClientRect();
  if(!cardRect.width||!cardRect.height)return;

  const viewportWidth=document.documentElement.clientWidth||window.innerWidth;
  const viewportHeight=document.documentElement.clientHeight||window.innerHeight;
  const anchorCenterX=anchorRect.left+anchorRect.width/2;
  const anchorCenterY=anchorRect.top+anchorRect.height/2;
  const gap=18;

  let side='bottom';
  let left=cardRect.left;
  let top=cardRect.top;

  const roomAbove=anchorRect.top;
  const roomBelow=viewportHeight-anchorRect.bottom;
  const roomLeft=anchorRect.left;
  const roomRight=viewportWidth-anchorRect.right;

  if(action==='edit-line'){
    side=roomRight>=cardRect.width+gap?'left':'right';
  }else if(action==='open-completion'){
    side=roomRight>=cardRect.width+gap?'left':'right';
  }else if(action==='quick-drink'||action==='completion-drink'||action==='complete-group'){
    side=roomAbove>=cardRect.height+gap?'bottom':'top';
  }else{
    side=roomBelow>=cardRect.height+gap?'top':'bottom';
  }

  if(side==='bottom'){
    left=clamp(anchorCenterX-cardRect.width/2,12,viewportWidth-cardRect.width-12);
    top=anchorRect.top-cardRect.height-gap;
  }else if(side==='top'){
    left=clamp(anchorCenterX-cardRect.width/2,12,viewportWidth-cardRect.width-12);
    top=anchorRect.bottom+gap;
  }else if(side==='left'){
    left=anchorRect.right+gap;
    top=clamp(anchorCenterY-cardRect.height/2,12,viewportHeight-cardRect.height-12);
  }else{
    left=anchorRect.left-cardRect.width-gap;
    top=clamp(anchorCenterY-cardRect.height/2,12,viewportHeight-cardRect.height-12);
  }

  left=clamp(left,12,viewportWidth-cardRect.width-12);
  top=clamp(top,12,viewportHeight-cardRect.height-12);

  card.style.position='fixed';
  card.style.left=left+'px';
  card.style.right='auto';
  card.style.top=top+'px';
  card.style.bottom='auto';
  card.classList.add('anchored-source-card');
  card.dataset.arrowSide=side;
  card.dataset.sourceAction=action;

  const updated=card.getBoundingClientRect();
  if(side==='top'||side==='bottom'){
    card.style.setProperty('--anchor-x',clamp(anchorCenterX-updated.left,24,updated.width-24)+'px');
  }else{
    card.style.setProperty('--anchor-y',clamp(anchorCenterY-updated.top,24,updated.height-24)+'px');
  }
}

function scheduleAnchorPlacement(){
  cancelAnimationFrame(anchorFrame);
  anchorFrame=requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      const card=cardForAction(lastAction);
      if(card&&lastAnchor)placeAnchoredCard(card,lastAnchor,lastAction);
    });
  });
}

export function installAnchoredCardTracking(){
  injectAnchoredCardStyles();
  document.addEventListener('pointerdown',function(event){
    rememberAnchor(event.target);
  },true);
  document.addEventListener('click',function(event){
    rememberAnchor(event.target);
    scheduleAnchorPlacement();
  },true);
}

installAnchoredCardTracking();

export function createOverlayManager(){
  let overlay=null;
  function close(){
    if(!overlay)return;
    overlay.scrim.remove();
    overlay.panel.remove();
    clearAnchorHighlight();
    if(overlay.onClose)overlay.onClose();
    overlay=null;
  }
  function open(options){
    close();
    const anchor=options.anchor;
    lastAnchor=anchor;
    lastAction=anchor?.dataset?.action||lastAction||'popover';
    anchor?.classList?.add('anchored-source-highlight');

    const scrim=document.createElement('button');
    scrim.className='overlay-scrim';
    scrim.setAttribute('aria-label','返回');
    const panel=document.createElement('section');
    panel.className=options.className||'anchored-popover';
    panel.innerHTML=options.content||'';
    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    overlay={scrim,panel,onClose:options.onClose||null};

    function position(){
      placeAnchoredCard(panel,anchor,lastAction);
    }

    requestAnimationFrame(function(){
      requestAnimationFrame(position);
    });
    scrim.addEventListener('click',close,{once:true});
    return {panel,close,position};
  }
  return {open,close,get panel(){return overlay?overlay.panel:null;}};
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
