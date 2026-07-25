import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';

const stage=document.getElementById('stage');
const seedFrame=document.getElementById('page');
const nav=document.getElementById('global-bottom-nav');
const routeLabel=document.getElementById('shell-route-label');
const shellContext=document.getElementById('shell-context');
const routeFeedback=document.getElementById('route-feedback');
const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};
const labels={order:'點餐',orders:'訂單',dine:'堂食',soldout:'售罄',more:'更多',checkout:'結帳'};
const mainRoutes=['order','orders','dine','soldout','more'];
const BUILD='global-shell-v1-20260725';
const frameByRoute=new Map();
const allFrames=new Set();
const readyRoutes=new Set();
let activeFrame=seedFrame;
let current='';
let pending='';
let childReady=false;
let resizeFrame=0;
let currentProfile=null;
let watchdogTimer=0;
let shellUnlocked=document.documentElement.dataset.shellUnlocked==='1';
let preloadStarted=false;
let preloadQueue=[];
let preloadingRoute='';
const SCALE_KEY='morefun-smt-ui-scale';
let uiScale=Math.max(.82,Math.min(1,Number(localStorage.getItem(SCALE_KEY)||1)));

function viewportSize(){const viewport=window.visualViewport;return {width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};}
function frameList(){return [...allFrames];}
function route(){const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}
function pageUrl(key,mode='normal'){const base=routes[key]+'?build='+encodeURIComponent(BUILD);return mode==='normal'?base:base+'&'+mode+'='+Date.now();}

function applyChildShellMode(frame){
  try{
    const doc=frame?.contentDocument;
    if(!doc?.head)return;
    let style=doc.getElementById('morefun-global-shell-mode');
    if(!style){style=doc.createElement('style');style.id='morefun-global-shell-mode';doc.head.appendChild(style);}
    style.textContent='.global-statusbar,.shell-bottom-nav{display:none!important}.app{height:100%!important;min-height:0!important}.workspace{min-height:0!important}';
    doc.documentElement.dataset.globalShell='1';
  }catch(error){console.warn('GLOBAL_SHELL_CHILD_MODE_FAILED',error);}
}

function applyProfileToFrame(frame){
  if(!frame||!currentProfile)return;
  frame.style.width='100%';frame.style.height='100%';
  try{if(frame.contentDocument?.documentElement)applyResponsiveProfile(frame.contentDocument,currentProfile);}catch(error){console.warn('RESPONSIVE_CHILD_PROFILE_FAILED',error);}
  applyChildShellMode(frame);
}

function applyProfile(){
  const size=viewportSize();currentProfile=getResponsiveProfile(size.width,size.height);applyResponsiveProfile(document,currentProfile);
  document.documentElement.style.setProperty('--user-ui-scale',String(uiScale));
  stage.style.width='100%';stage.style.height='100%';stage.style.left='0px';stage.style.top='0px';stage.style.transform='none';
  stage.dataset.profile=currentProfile.name;stage.dataset.viewportWidth=String(currentProfile.width);stage.dataset.viewportHeight=String(currentProfile.height);stage.dataset.fitted=currentProfile.landscape?'1':'0';
  frameList().forEach(applyProfileToFrame);
}
function scheduleProfileUpdate(){if(resizeFrame)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;applyProfile();});}

function setShellRouteUi(key,{loading=false}={}){
  nav?.querySelectorAll('[data-route]').forEach(button=>{const active=button.dataset.route===key;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  if(routeLabel)routeLabel.textContent=labels[key]||key;
  if(routeFeedback)routeFeedback.hidden=!loading;
  if(shellContext)shellContext.textContent=loading?'正在準備 '+(labels[key]||key)+'…':'營業操作中';
}

function showLoaderError(message,target=activeFrame){
  if(target!==activeFrame){console.error('PAGE_TRANSITION_FAILED',message);if(target?.dataset.route===pending){pending='';delete stage.dataset.pendingRoute;}target?.classList.remove('is-loading');if(routeFeedback)routeFeedback.hidden=true;return;}
  target.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';
}

function attachFrame(frame,key){
  frame.dataset.route=key;frame.title='磨飯 SMT｜'+(labels[key]||key);allFrames.add(frame);frameByRoute.set(key,frame);
  frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。',frame));
  frame.addEventListener('load',()=>applyProfileToFrame(frame));
}
function createHiddenFrame(key){const frame=document.createElement('iframe');frame.className='shell-page is-loading';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;attachFrame(frame,key);stage.appendChild(frame);return frame;}
function findSourceFrame(source){return frameList().find(frame=>source===frame.contentWindow)||null;}

function setActiveFrame(frame,key){
  if(!frame)return;
  const old=activeFrame;
  if(old&&old!==frame){old.classList.remove('is-active','is-loading');old.setAttribute('aria-hidden','true');old.tabIndex=-1;if(old.id==='page')old.id='page-cache-'+String(old.dataset.route||'route');}
  const existingPage=document.getElementById('page');if(existingPage&&existingPage!==frame)existingPage.removeAttribute('id');
  frame.id='page';frame.classList.remove('is-loading');frame.classList.add('is-active');frame.setAttribute('aria-hidden','false');frame.removeAttribute('tabindex');
  activeFrame=frame;current=key;pending='';childReady=true;clearTimeout(watchdogTimer);stage.dataset.route=current;delete stage.dataset.pendingRoute;applyProfileToFrame(frame);setShellRouteUi(key,{loading:false});
  try{frame.contentWindow?.postMessage({type:'morefun:page-activate',route:key},'*');}catch(_error){}
}

function armWatchdog(frame,key){clearTimeout(watchdogTimer);watchdogTimer=setTimeout(()=>{if(key!==pending||readyRoutes.has(key))return;frame.src=pageUrl(key,'retry');},1800);}
function ensureFrameLoading(key,{force=false,background=false}={}){
  let frame=frameByRoute.get(key);
  if(!frame){frame=createHiddenFrame(key);frame.src=pageUrl(key,force?'reload':'normal');return frame;}
  if(force){readyRoutes.delete(key);frame.classList.add('is-loading');frame.src=pageUrl(key,'reload');}
  if(background)frame.classList.add('is-loading');
  return frame;
}

function preloadNext(){
  if(!shellUnlocked||preloadingRoute||!preloadQueue.length)return;
  const key=preloadQueue.shift();
  if(readyRoutes.has(key)||frameByRoute.has(key)){setTimeout(preloadNext,80);return;}
  preloadingRoute=key;
  ensureFrameLoading(key,{background:true});
}
function startSequentialPreload(){
  if(preloadStarted||!shellUnlocked||!readyRoutes.has('order'))return;
  preloadStarted=true;preloadQueue=mainRoutes.filter(key=>key!=='order');setTimeout(preloadNext,160);
}

function load({force=false}={}){
  const key=route();if(!force&&key===current)return;
  const cached=frameByRoute.get(key);
  if(!force&&cached&&readyRoutes.has(key)){setActiveFrame(cached,key);return;}
  pending=key;childReady=false;stage.dataset.pendingRoute=key;setShellRouteUi(key,{loading:true});
  const frame=ensureFrameLoading(key,{force});armWatchdog(frame,key);
}

function boot(){
  const key='order';
  current=key;childReady=false;attachFrame(seedFrame,key);seedFrame.classList.add('is-active');seedFrame.src=pageUrl(key);stage.dataset.route=key;setShellRouteUi(key,{loading:false});
  if(location.hash!=='#/order')history.replaceState(null,'','#/order');
}

nav?.addEventListener('click',event=>{
  const button=event.target.closest('[data-route]');if(!button)return;
  const next=button.dataset.route;if(!routes[next]||next===current)return;
  setShellRouteUi(next,{loading:!readyRoutes.has(next)});
  if(location.hash==='#/'+next)load();else location.hash='#/'+next;
});

addEventListener('hashchange',()=>{if(shellUnlocked)load();});
addEventListener('pageshow',()=>applyProfile());
addEventListener('resize',scheduleProfileUpdate,{passive:true});
addEventListener('orientationchange',()=>setTimeout(scheduleProfileUpdate,120),{passive:true});
window.visualViewport?.addEventListener('resize',scheduleProfileUpdate,{passive:true});
addEventListener('morefun:shell-unlocked',()=>{shellUnlocked=true;if(readyRoutes.has('order'))setActiveFrame(frameByRoute.get('order'), 'order');startSequentialPreload();});

addEventListener('message',event=>{
  const sourceFrame=findSourceFrame(event.source);if(!sourceFrame)return;const sourceRoute=String(sourceFrame.dataset.route||'');
  if(event.data?.type==='morefun:page-ready'){
    if(sourceRoute)readyRoutes.add(sourceRoute);applyProfileToFrame(sourceFrame);
    if(sourceRoute===preloadingRoute){preloadingRoute='';setTimeout(preloadNext,120);}
    if(sourceRoute&&sourceRoute===pending&&shellUnlocked){setActiveFrame(sourceFrame,sourceRoute);return;}
    if(sourceFrame===activeFrame)childReady=true;
    if(sourceRoute==='order')startSequentialPreload();
    return;
  }
  if(event.data?.type==='morefun:shell-status'&&sourceFrame===activeFrame){if(shellContext&&event.data.context)shellContext.textContent=String(event.data.context);return;}
  if(sourceFrame!==activeFrame)return;
  if(event.data?.type==='morefun:navigate'){
    const next=String(event.data.route||'order');if(!routes[next])return;setShellRouteUi(next,{loading:!readyRoutes.has(next)});if(location.hash==='#/'+next){if(next!==current)load();}else location.hash='#/'+next;
  }
  if(event.data?.type==='morefun:exit-fullscreen'&&document.fullscreenElement)document.exitFullscreen?.();
  if(event.data?.type==='morefun:set-ui-scale'){uiScale=Math.max(.82,Math.min(1,Number(event.data.value)||1));localStorage.setItem(SCALE_KEY,String(uiScale));applyProfile();}
  if(event.data?.type==='morefun:page-runtime-error'){console.error(event.data);if(!childReady)showLoaderError('頁面啟動失敗，資料仍保存在本機，請重新整理後再試。',activeFrame);}
  if(event.data?.type==='morefun:reload-current-page'){const key=current;pending=key;stage.dataset.pendingRoute=key;readyRoutes.delete(key);activeFrame.src=pageUrl(key,'reload');armWatchdog(activeFrame,key);}
});

applyProfile();
boot();
