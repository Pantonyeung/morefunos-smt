const ROOT_LOADER_RECURSION_GUARD='ROOT_LOADER_RECURSION_GUARD';
if(window.top!==window.self){document.documentElement.innerHTML='<!doctype html><html lang="zh-HK"><body style="font-family:sans-serif;display:grid;place-items:center;min-height:100vh"><strong>Root Loader 被錯誤載入，已停止。</strong></body></html>';throw new Error(ROOT_LOADER_RECURSION_GUARD);}
const DESIGN_WIDTH=1920,DESIGN_HEIGHT=1080,BUILD_ID='smt-master-v1.1-20260719';
const routes=Object.freeze({boot:'pages/boot/index.html',order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/placeholder/index.html?page=orders&label=訂單',dine:'pages/placeholder/index.html?page=dine&label=堂食',supply:'pages/placeholder/index.html?page=supply&label=售罄',more:'pages/placeholder/index.html?page=more&label=更多'});
const viewport=document.getElementById('viewport'),stage=document.getElementById('t2-stage'),frame=document.getElementById('page-frame'),status=document.getElementById('route-status'),pageError=document.getElementById('page-error');
let activeRoute='',readyTimer=0,lastGeometry='',lastOrientation=screen.orientation?.type||(innerWidth>innerHeight?'landscape':'portrait');
export async function resetLegacyPreviewCaches(){try{if('serviceWorker'in navigator){for(const registration of await navigator.serviceWorker.getRegistrations())await registration.unregister();}if('caches'in window){for(const key of await caches.keys())if(key.startsWith('morefun-smt-'))await caches.delete(key);}}catch(error){console.warn('Cache reset skipped',error);}return false;}
const normalizedRoute=value=>{const route=String(value||'').replace(/^#\/?/,'').replace(/^\//,'').split(/[?&]/)[0];return routes[route]?route:'order';};
export function fitStage(reason='manual'){const width=viewport.clientWidth,height=viewport.clientHeight,scale=Math.min(1,width/DESIGN_WIDTH,height/DESIGN_HEIGHT),left=Math.max(0,(width-DESIGN_WIDTH*scale)/2),top=Math.max(0,(height-DESIGN_HEIGHT*scale)/2),geometry=`${scale.toFixed(6)}|${left.toFixed(2)}|${top.toFixed(2)}`;if(geometry===lastGeometry&&reason!=='force')return;lastGeometry=geometry;stage.style.transform=`scale(${scale})`;stage.style.left=`${left}px`;stage.style.top=`${top}px`;stage.dataset.scale=scale.toFixed(6);}
const routeFromHash=()=>normalizedRoute(location.hash||'#/order');
function showPageError(route){pageError.hidden=false;pageError.innerHTML=`<section class="page-error-card"><strong>頁面暫時未能載入</strong><p>訂單資料仍保存在本機。</p><div><button data-error-action="retry">重新載入此頁</button><button data-error-action="order">返回點單</button></div></section>`;pageError.querySelector('[data-error-action="retry"]').onclick=()=>loadRoute(route,{force:true});pageError.querySelector('[data-error-action="order"]').onclick=()=>navigate('order');}
function hidePageError(){pageError.hidden=true;pageError.innerHTML='';}
function armReadyTimeout(route){clearTimeout(readyTimer);readyTimer=setTimeout(()=>showPageError(route),9000);}
export function navigate(route,{replace=false}={}){const next=normalizedRoute(route),hash=`#/${next}`;if(replace)history.replaceState(null,'',hash);else if(location.hash!==hash)location.hash=hash;loadRoute(next);}
function loadRoute(route,{force=false}={}){const next=normalizedRoute(route);if(!force&&activeRoute===next&&frame.dataset.ready==='true')return;activeRoute=next;hidePageError();frame.dataset.ready='false';frame.src=`${routes[next]}${routes[next].includes('?')?'&':'?'}build=${BUILD_ID}`;status.textContent=`正在載入${next}`;armReadyTimeout(next);}
function handleOrientationChange(){const orientation=screen.orientation?.type||(innerWidth>innerHeight?'landscape':'portrait');if(orientation===lastOrientation)return;lastOrientation=orientation;requestAnimationFrame(()=>fitStage('orientationchange'));}
window.addEventListener('message',event=>{if(event.source!==frame.contentWindow||!event.data)return;if(event.data.type==='morefun:navigate')navigate(event.data.route);if(event.data.type==='morefun:page-ready'){clearTimeout(readyTimer);frame.dataset.ready='true';hidePageError();status.textContent=`已載入${activeRoute}`;}if(event.data.type==='morefun:page-runtime-error')showPageError(activeRoute);});
frame.addEventListener('error',()=>showPageError(activeRoute||routeFromHash()));
window.addEventListener('hashchange',()=>loadRoute(routeFromHash()));
window.addEventListener('pageshow',event=>{if(event.persisted)requestAnimationFrame(()=>fitStage('pageshow'));},{passive:true});
window.addEventListener('orientationchange',handleOrientationChange,{passive:true});
screen.orientation?.addEventListener?.('change',handleOrientationChange);
window.MoreFunSMTRouter=Object.freeze({navigate,fitStage,routes,DESIGN_WIDTH,DESIGN_HEIGHT,BUILD_ID});
async function bootstrap(){fitStage('bootstrap');await resetLegacyPreviewCaches();if(!location.hash)navigate('order',{replace:true});else loadRoute(routeFromHash());}
bootstrap();
