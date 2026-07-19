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

const TRACKED_ACTIONS=new Set([
  'quick-drink','completion-drink','edit-line','open-completion',
  'open-status','open-health','toggle-card','setting-card','complete-group'
]);

let sourceElement=null;
let sourceAction='';
let sourceCard=null;
let quickCard=null;

function injectAnchoredStyles(){
  if(document.getElementById('morefun-anchor-v16i'))return;
  const style=document.createElement('style');
  style.id='morefun-anchor-v16i';
  style.textContent=`
    .mf-anchor-card{
      --mf-arrow-x:50%;
      --mf-arrow-y:50%;
      --mf-arrow-size:15px;
      overflow:visible!important;
    }
    .mf-anchor-card::before,.mf-anchor-card::after{
      content:"";
      position:absolute;
      width:0;height:0;
      pointer-events:none;
      z-index:5;
    }
    .mf-anchor-card[data-mf-arrow="left"]::before{
      left:calc(var(--mf-arrow-size) * -1);
      top:var(--mf-arrow-y);
      transform:translateY(-50%);
      border-top:var(--mf-arrow-size) solid transparent;
      border-bottom:var(--mf-arrow-size) solid transparent;
      border-right:var(--mf-arrow-size) solid #d9cabe;
    }
    .mf-anchor-card[data-mf-arrow="left"]::after{
      left:calc((var(--mf-arrow-size) - 2px) * -1);
      top:var(--mf-arrow-y);
      transform:translateY(-50%);
      border-top:calc(var(--mf-arrow-size) - 2px) solid transparent;
      border-bottom:calc(var(--mf-arrow-size) - 2px) solid transparent;
      border-right:calc(var(--mf-arrow-size) - 2px) solid #fff;
    }
    .mf-anchor-card[data-mf-arrow="right"]::before{
      right:calc(var(--mf-arrow-size) * -1);
      top:var(--mf-arrow-y);
      transform:translateY(-50%);
      border-top:var(--mf-arrow-size) solid transparent;
      border-bottom:var(--mf-arrow-size) solid transparent;
      border-left:var(--mf-arrow-size) solid #d9cabe;
    }
    .mf-anchor-card[data-mf-arrow="right"]::after{
      right:calc((var(--mf-arrow-size) - 2px) * -1);
      top:var(--mf-arrow-y);
      transform:translateY(-50%);
      border-top:calc(var(--mf-arrow-size) - 2px) solid transparent;
      border-bottom:calc(var(--mf-arrow-size) - 2px) solid transparent;
      border-left:calc(var(--mf-arrow-size) - 2px) solid #fff;
    }
    .mf-anchor-card[data-mf-arrow="top"]::before{
      top:calc(var(--mf-arrow-size) * -1);
      left:var(--mf-arrow-x);
      transform:translateX(-50%);
      border-left:var(--mf-arrow-size) solid transparent;
      border-right:var(--mf-arrow-size) solid transparent;
      border-bottom:var(--mf-arrow-size) solid #d9cabe;
    }
    .mf-anchor-card[data-mf-arrow="top"]::after{
      top:calc((var(--mf-arrow-size) - 2px) * -1);
      left:var(--mf-arrow-x);
      transform:translateX(-50%);
      border-left:calc(var(--mf-arrow-size) - 2px) solid transparent;
      border-right:calc(var(--mf-arrow-size) - 2px) solid transparent;
      border-bottom:calc(var(--mf-arrow-size) - 2px) solid #fff;
    }
    .mf-anchor-card[data-mf-arrow="bottom"]::before{
      bottom:calc(var(--mf-arrow-size) * -1);
      left:var(--mf-arrow-x);
      transform:translateX(-50%);
      border-left:var(--mf-arrow-size) solid transparent;
      border-right:var(--mf-arrow-size) solid transparent;
      border-top:var(--mf-arrow-size) solid #d9cabe;
    }
    .mf-anchor-card[data-mf-arrow="bottom"]::after{
      bottom:calc((var(--mf-arrow-size) - 2px) * -1);
      left:var(--mf-arrow-x);
      transform:translateX(-50%);
      border-left:calc(var(--mf-arrow-size) - 2px) solid transparent;
      border-right:calc(var(--mf-arrow-size) - 2px) solid transparent;
      border-top:calc(var(--mf-arrow-size) - 2px) solid #fff;
    }
    .mf-anchor-source{
      outline:3px solid rgba(239,82,24,.30)!important;
      outline-offset:2px;
    }
    .mf-quick-card{
      position:fixed!important;
      width:330px!important;
      height:auto!important;
      min-height:220px;
      z-index:45!important;
      background:#fff;
      border:1px solid var(--line,#e7dfd8);
      border-radius:15px;
      box-shadow:var(--shadow,0 12px 36px rgba(76,46,28,.14));
      overflow:visible!important;
    }
    .mf-quick-card header{
      display:flex;align-items:center;justify-content:space-between;
      padding:14px;border-bottom:1px solid var(--line,#e7dfd8);
    }
    .mf-quick-card .mf-quick-body{padding:14px;display:grid;gap:12px}
    .mf-quick-card .mf-quick-row{
      display:flex;align-items:center;justify-content:space-between;
      padding:12px;border:1px solid var(--line,#e7dfd8);
      border-radius:11px;background:#fff;
    }
    .mf-quick-card .mf-switch{
      width:50px;height:28px;border-radius:999px;border:0;background:#e9dfd7;
      padding:3px;display:flex;justify-content:flex-start;
    }
    .mf-quick-card .mf-switch.on{background:#ef5218;justify-content:flex-end}
    .mf-quick-card .mf-switch i{
      width:22px;height:22px;border-radius:50%;background:#fff;display:block;
    }
  `;
  document.head.appendChild(style);
}

function clearSource(){
  document.querySelectorAll('.mf-anchor-source').forEach(function(node){
    node.classList.remove('mf-anchor-source');
  });
}

function setSource(element,action){
  if(!element)return;
  clearSource();
  sourceElement=element;
  sourceAction=action||element.dataset.action||'';
  sourceElement.classList.add('mf-anchor-source');
}

function clamp(value,min,max){return Math.max(min,Math.min(max,value));}

function decorateCard(card,source,preferred){
  if(!card||!source||!source.isConnected)return;
  const sourceRect=source.getBoundingClientRect();
  const cardRect=card.getBoundingClientRect();
  if(!cardRect.width||!cardRect.height)return;

  const vw=document.documentElement.clientWidth||window.innerWidth;
  const vh=document.documentElement.clientHeight||window.innerHeight;
  const gap=18;
  const sx=sourceRect.left+sourceRect.width/2;
  const sy=sourceRect.top+sourceRect.height/2;

  let arrow=preferred||'top';
  let left=cardRect.left;
  let top=cardRect.top;

  if(arrow==='left'){
    left=sourceRect.right+gap;
    top=clamp(sy-cardRect.height/2,12,vh-cardRect.height-12);
  }else if(arrow==='right'){
    left=sourceRect.left-cardRect.width-gap;
    top=clamp(sy-cardRect.height/2,12,vh-cardRect.height-12);
  }else if(arrow==='bottom'){
    left=clamp(sx-cardRect.width/2,12,vw-cardRect.width-12);
    top=sourceRect.top-cardRect.height-gap;
  }else{
    left=clamp(sx-cardRect.width/2,12,vw-cardRect.width-12);
    top=sourceRect.bottom+gap;
  }

  left=clamp(left,12,vw-cardRect.width-12);
  top=clamp(top,12,vh-cardRect.height-12);

  card.style.position='fixed';
  card.style.left=left+'px';
  card.style.right='auto';
  card.style.top=top+'px';
  card.style.bottom='auto';
  card.classList.add('mf-anchor-card');
  card.dataset.mfArrow=arrow;

  const rect=card.getBoundingClientRect();
  if(arrow==='left'||arrow==='right'){
    card.style.setProperty('--mf-arrow-y',clamp(sy-rect.top,25,rect.height-25)+'px');
  }else{
    card.style.setProperty('--mf-arrow-x',clamp(sx-rect.left,25,rect.width-25)+'px');
  }
}

function cardForAction(action){
  if(action==='quick-drink'||action==='completion-drink'||action==='complete-group'){
    return document.querySelector('.anchored-popover');
  }
  if(action==='edit-line')return document.querySelector('.edit-card');
  if(action==='open-completion')return document.querySelector('.completion-card');
  if(action==='open-status')return document.querySelector('.status-card');
  if(action==='open-health')return document.querySelector('.health-card');
  if(action==='toggle-card')return document.querySelector('.side-card');
  return document.querySelector('.anchored-popover,.edit-card,.side-card');
}

function preferredArrow(action){
  if(action==='open-completion'||action==='edit-line')return 'left';
  if(action==='quick-drink'||action==='completion-drink'||action==='complete-group')return 'bottom';
  return 'top';
}

function locateCurrentCard(){
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      const card=cardForAction(sourceAction);
      if(card)decorateCard(card,sourceElement,preferredArrow(sourceAction));
    });
  });
}

function closeQuickCard(){
  if(quickCard){quickCard.remove();quickCard=null;}
  clearSource();
}

function openQuickCard(button){
  if(quickCard){
    closeQuickCard();
    return;
  }
  setSource(button,'quick-mode');
  quickCard=document.createElement('aside');
  quickCard.className='mf-quick-card mf-anchor-card';
  quickCard.innerHTML=`
    <header>
      <strong>快捷模式</strong>
      <button type="button" data-mf-close>×</button>
    </header>
    <div class="mf-quick-body">
      <div class="mf-quick-row">
        <span><strong>快捷飲品列</strong><br><small>顯示底部快捷飲品</small></span>
        <button type="button" class="mf-switch on" data-mf-toggle><i></i></button>
      </div>
      <div class="mf-quick-row">
        <span><strong>快捷補選</strong><br><small>飲品可統一補入待補區</small></span>
        <b>開啟</b>
      </div>
    </div>`;
  document.body.appendChild(quickCard);
  quickCard.querySelector('[data-mf-close]').onclick=closeQuickCard;
  quickCard.querySelector('[data-mf-toggle]').onclick=function(){
    this.classList.toggle('on');
    const strip=document.querySelector('.quick-strip');
    if(strip)strip.hidden=!this.classList.contains('on');
  };
  decorateCard(quickCard,button,'top');
}

function findQuickButton(target){
  const button=target.closest('button');
  if(!button)return null;
  const text=(button.textContent||'').trim();
  return text==='快捷 ON'||text==='快捷 OFF'||text.startsWith('快捷 ');
}

function installAnchorTracking(){
  injectAnchoredStyles();

  document.addEventListener('pointerdown',function(event){
    const actionElement=event.target.closest('[data-action]');
    if(actionElement&&TRACKED_ACTIONS.has(actionElement.dataset.action)){
      setSource(actionElement,actionElement.dataset.action);
    }
  },true);

  document.addEventListener('click',function(event){
    const quickButton=findQuickButton(event.target);
    if(quickButton&&!quickButton.dataset.action){
      event.preventDefault();
      event.stopPropagation();
      openQuickCard(quickButton);
      return;
    }

    const actionElement=event.target.closest('[data-action]');
    if(!actionElement)return;
    const action=actionElement.dataset.action;
    if(!TRACKED_ACTIONS.has(action))return;
    setSource(actionElement,action);
    locateCurrentCard();
  },true);
}

installAnchorTracking();

export function createOverlayManager(){
  let overlay=null;
  function close(){
    if(!overlay)return;
    overlay.scrim.remove();
    overlay.panel.remove();
    overlay=null;
    clearSource();
  }
  function open(options){
    close();
    const anchor=options.anchor;
    setSource(anchor,anchor?.dataset?.action||'popover');

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
      decorateCard(panel,anchor,preferredArrow(sourceAction));
    }

    requestAnimationFrame(function(){
      requestAnimationFrame(position);
    });
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
