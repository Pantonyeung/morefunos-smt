import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';

const stage=document.getElementById('stage');
const primaryFrame=document.getElementById('page');
const secondaryFrame=document.getElementById('page-next');
const frames=[primaryFrame,secondaryFrame];
const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};
const BUILD='adaptive-nav-v1-20260725';
let activeFrame=primaryFrame;
let loadingFrame=secondaryFrame;
let current='';
let pending='';
let childReady=false;
let resizeFrame=0;
let currentProfile=null;
let watchdogTimer=0;
let loadSeq=0;
let cacheWarmed=false;
const frameRoute=new WeakMap();
const readyFrames=new WeakSet();
const SCALE_KEY='morefun-smt-ui-scale';
let uiScale=Math.max(.82,Math.min(1,Number(localStorage.getItem(SCALE_KEY)||1)));

function viewportSize(){
  const viewport=window.visualViewport;
  return {
    width:Math.round(viewport?.width||window.innerWidth),
    height:Math.round(viewport?.height||window.innerHeight)
  };
}

function applyProfileToFrame(frame){
  if(!currentProfile)return;
  frame.style.width='100%';
  frame.style.height='100%';
  try{
    if(frame.contentDocument?.documentElement)applyResponsiveProfile(frame.contentDocument,currentProfile);
  }catch(error){
    console.warn('RESPONSIVE_CHILD_PROFILE_FAILED',error);
  }
}

function applyProfile(){
  const size=viewportSize();
  currentProfile=getResponsiveProfile(size.width,size.height);
  applyResponsiveProfile(document,currentProfile);
  document.documentElement.style.setProperty('--user-ui-scale',String(uiScale));
  stage.style.width='100%';
  stage.style.height='100%';
  stage.style.left='0px';
  stage.style.top='0px';
  stage.style.transform='none';
  stage.dataset.profile=currentProfile.name;
  stage.dataset.viewportWidth=String(currentProfile.width);
  stage.dataset.viewportHeight=String(currentProfile.height);
  stage.dataset.fitted=currentProfile.landscape?'1':'0';
  frames.forEach(applyProfileToFrame);
}

function scheduleProfileUpdate(){
  if(resizeFrame)return;
  resizeFrame=requestAnimationFrame(()=>{
    resizeFrame=0;
    applyProfile();
  });
}

function route(){
  const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];
  return routes[key]?key:'order';
}

function pageUrl(key,mode='normal'){
  const base=routes[key]+'?build='+encodeURIComponent(BUILD);
  return mode==='normal'?base:base+'&'+mode+'='+Date.now();
}

function showLoaderError(message,target=activeFrame){
  if(current&&target!==activeFrame){
    console.error('PAGE_TRANSITION_FAILED',message);
    pending='';
    target.classList.remove('is-loading');
    delete stage.dataset.pendingRoute;
    return;
  }
  target.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';
}

function warmPageCache(){
  if(cacheWarmed)return;
  cacheWarmed=true;
  const keys=Object.keys(routes).filter(key=>key!==current);
  const warm=()=>keys.forEach(key=>{
    fetch(pageUrl(key),{cache:'force-cache',credentials:'same-origin'}).catch(()=>{});
  });
  if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:900});
  else setTimeout(warm,120);
}

function armWatchdog(frame,key,seq){
  clearTimeout(watchdogTimer);
  watchdogTimer=setTimeout(()=>{
    if(seq!==loadSeq||key!==pending||readyFrames.has(frame))return;
    frame.src=pageUrl(key,'retry');
  },1800);
}

function activateFrame(nextFrame,key){
  const old=activeFrame;
  old.classList.remove('is-active');
  old.setAttribute('aria-hidden','true');
  old.tabIndex=-1;

  nextFrame.classList.remove('is-loading');
  nextFrame.classList.add('is-active');
  nextFrame.setAttribute('aria-hidden','false');
  nextFrame.removeAttribute('tabindex');

  activeFrame=nextFrame;
  loadingFrame=old;
  current=key;
  pending='';
  childReady=true;
  clearTimeout(watchdogTimer);
  stage.dataset.route=current;
  delete stage.dataset.pendingRoute;
  applyProfileToFrame(activeFrame);
  warmPageCache();
}

function load({force=false}={}){
  const key=route();
  if(!force&&(key===current||key===pending))return;

  if(!current){
    current=key;
    childReady=false;
    frameRoute.set(activeFrame,key);
    activeFrame.src=pageUrl(key);
    stage.dataset.route=current;
    return;
  }

  if(!force&&frameRoute.get(loadingFrame)===key&&readyFrames.has(loadingFrame)){
    activateFrame(loadingFrame,key);
    return;
  }

  pending=key;
  childReady=false;
  stage.dataset.pendingRoute=key;
  const seq=++loadSeq;
  clearTimeout(watchdogTimer);
  readyFrames.delete(loadingFrame);
  frameRoute.set(loadingFrame,key);
  loadingFrame.removeAttribute('srcdoc');
  loadingFrame.classList.add('is-loading');
  loadingFrame.src=pageUrl(key);
  armWatchdog(loadingFrame,key,seq);
}

frames.forEach(frame=>{
  frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。',frame));
  frame.addEventListener('load',()=>applyProfileToFrame(frame));
});

addEventListener('hashchange',()=>load());
addEventListener('pageshow',()=>{applyProfile();if(!current)load();});
addEventListener('resize',scheduleProfileUpdate,{passive:true});
addEventListener('orientationchange',()=>setTimeout(scheduleProfileUpdate,120),{passive:true});
window.visualViewport?.addEventListener('resize',scheduleProfileUpdate,{passive:true});

addEventListener('message',event=>{
  const sourceFrame=frames.find(frame=>event.source===frame.contentWindow);
  if(!sourceFrame)return;

  if(event.data?.type==='morefun:page-ready'){
    readyFrames.add(sourceFrame);
    applyProfileToFrame(sourceFrame);
    if(sourceFrame===loadingFrame&&pending){
      activateFrame(sourceFrame,pending);
      return;
    }
    if(sourceFrame===activeFrame){
      childReady=true;
      warmPageCache();
    }
    return;
  }

  if(sourceFrame!==activeFrame)return;

  if(event.data?.type==='morefun:navigate'){
    const next=String(event.data.route||'order');
    if(!routes[next])return;
    if(location.hash==='#/'+next){
      if(next!==current)load();
    }else{
      location.hash='#/'+next;
    }
  }
  if(event.data?.type==='morefun:exit-fullscreen'&&document.fullscreenElement)document.exitFullscreen?.();
  if(event.data?.type==='morefun:set-ui-scale'){
    uiScale=Math.max(.82,Math.min(1,Number(event.data.value)||1));
    localStorage.setItem(SCALE_KEY,String(uiScale));
    applyProfile();
  }
  if(event.data?.type==='morefun:page-runtime-error'){
    console.error(event.data);
    if(!childReady)showLoaderError('點單頁啟動失敗，資料仍保存在本機，請重新整理後再試。',activeFrame);
  }
  if(event.data?.type==='morefun:reload-current-page'){
    pending=current;
    const seq=++loadSeq;
    readyFrames.delete(loadingFrame);
    frameRoute.set(loadingFrame,current);
    loadingFrame.classList.add('is-loading');
    loadingFrame.src=pageUrl(current,'reload');
    armWatchdog(loadingFrame,current,seq);
  }
});

applyProfile();
load();
