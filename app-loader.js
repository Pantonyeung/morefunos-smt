const ROOT_LOADER_RECURSION_GUARD='ROOT_LOADER_RECURSION_GUARD';

if(window.top!==window.self){
  document.documentElement.innerHTML=`<!doctype html><html lang="zh-HK"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#fff;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;color:#332820}.card{max-width:560px;padding:30px;border:1px solid #eadfd5;border-radius:18px;text-align:center}.card strong{display:block;color:#e94b12;font-size:24px;margin-bottom:10px}.card p{line-height:1.65;color:#756b63}</style></head><body><section class="card"><strong>頁面載入被中止</strong><p>系統偵測到 Root Loader 被錯誤載入到子頁框架，已停止重複載入。請返回並重新整理。</p><code>${ROOT_LOADER_RECURSION_GUARD}</code></section></body></html>`;
  throw new Error(ROOT_LOADER_RECURSION_GUARD);
}

const DESIGN_WIDTH=1920;
const DESIGN_HEIGHT=1080;
const BUILD_ID='v14-20260719';

const routes=Object.freeze({
  boot:'pages/boot/index.html',
  order:'pages/order/index.html',
  checkout:'pages/checkout/index.html',
  orders:'pages/placeholder/index.html?page=orders&label=訂單',
  dine:'pages/placeholder/index.html?page=dine&label=堂食',
  supply:'pages/placeholder/index.html?page=supply&label=售罄',
  more:'pages/placeholder/index.html?page=more&label=更多'
});

const viewport=document.getElementById('viewport');
const stage=document.getElementById('t2-stage');
const frame=document.getElementById('page-frame');
const status=document.getElementById('route-status');
const pageError=document.getElementById('page-error');
let activeRoute='';
let readyTimer=0;
let lastGeometry='';

export async function resetLegacyPreviewCaches(){
  try{
    if('serviceWorker' in navigator){
      const registrations=await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration=>registration.unregister()));
    }
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.filter(key=>key.startsWith('morefun-smt-')).map(key=>caches.delete(key)));
    }
  }catch(error){console.warn('Preview cache reset skipped',error)}
  return false;
}

function normalizedRoute(value){
  const route=String(value||'').replace(/^#\/?/,'').replace(/^\//,'').split(/[?&]/)[0];
  return routes[route]?route:'order';
}

function fitStage(){
  const width=viewport.clientWidth;
  const height=viewport.clientHeight;
  const scale=Math.min(1,width/DESIGN_WIDTH,height/DESIGN_HEIGHT);
  const left=Math.max(0,(width-DESIGN_WIDTH*scale)/2);
  const top=Math.max(0,(height-DESIGN_HEIGHT*scale)/2);
  const geometry=`${scale.toFixed(6)}|${left.toFixed(2)}|${top.toFixed(2)}`;
  if(geometry===lastGeometry)return;
  lastGeometry=geometry;
  stage.style.transform=`scale(${scale})`;
  stage.style.left=`${left}px`;
  stage.style.top=`${top}px`;
  stage.dataset.scale=scale.toFixed(6);
}

function routeFromHash(){return normalizedRoute(location.hash||'#/order')}
function hidePageError(){pageError.hidden=true;pageError.innerHTML=''}
function showPageError(route,message=''){
  pageError.hidden=false;
  pageError.innerHTML=`<section class="page-error-card"><strong>頁面暫時未能載入</strong><p>${message|| (route==='checkout'?'結帳頁載入失敗，訂單仍保存在本機。':'此頁載入失敗，現有資料沒有被刪除。')}</p><div><button data-error-action="retry">重新載入此頁</button><button data-error-action="order">返回點單</button></div></section>`;
  pageError.querySelector('[data-error-action="retry"]').addEventListener('click',()=>loadRoute(route,{force:true}));
  pageError.querySelector('[data-error-action="order"]').addEventListener('click',()=>navigate('order'));
  status.textContent=`page-error:${route}`;
}
function armReadyTimeout(route){clearTimeout(readyTimer);readyTimer=window.setTimeout(()=>showPageError(route),12000)}
function navigate(route,{replace=false}={}){
  const next=normalizedRoute(route);
  const hash=`#/${next}`;
  if(replace)history.replaceState(null,'',hash);
  else if(location.hash!==hash)location.hash=hash;
  loadRoute(next);
}
function loadRoute(route,{force=false}={}){
  const next=normalizedRoute(route);
  if(!force&&activeRoute===next&&frame.dataset.ready==='true')return;
  activeRoute=next;
  hidePageError();
  frame.dataset.ready='false';
  frame.dataset.route=next;
  frame.src=`${routes[next]}${routes[next].includes('?')?'&':'?'}build=${encodeURIComponent(BUILD_ID)}`;
  status.textContent=`正在載入${next}`;
  document.title=`磨飯 SMT｜${next}`;
  armReadyTimeout(next);
}

window.addEventListener('message',event=>{
  if(event.source!==frame.contentWindow)return;
  const data=event.data;
  if(!data)return;
  if(data.type==='morefun:navigate')navigate(data.route);
  if(data.type==='morefun:page-ready'){
    clearTimeout(readyTimer);
    frame.dataset.ready='true';
    hidePageError();
    status.textContent=`已載入${activeRoute}`;
  }
  if(data.type==='morefun:page-runtime-error'){
    status.textContent=`runtime-error:${data.page||activeRoute}`;
    console.error('Child page runtime error',data.message||'unknown');
  }
});
frame.addEventListener('error',()=>showPageError(activeRoute||routeFromHash()));
window.addEventListener('hashchange',()=>loadRoute(routeFromHash()));
window.addEventListener('resize',fitStage,{passive:true});
window.addEventListener('orientationchange',fitStage,{passive:true});
if('ResizeObserver' in window)new ResizeObserver(()=>requestAnimationFrame(fitStage)).observe(viewport);

window.MoreFunSMTRouter=Object.freeze({navigate,fitStage,routes,DESIGN_WIDTH,DESIGN_HEIGHT,BUILD_ID});

async function bootstrap(){
  fitStage();
  await resetLegacyPreviewCaches();
  if(!location.hash)navigate('order',{replace:true});
  else loadRoute(routeFromHash());
}
bootstrap();
