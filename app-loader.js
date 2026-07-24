import {applyResponsiveProfile,getResponsiveProfile} from './shared/responsive.js';

const stage=document.getElementById('stage');
const frame=document.getElementById('page');
const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};
let current='';
let childReady=false;
let resizeFrame=0;
let currentProfile=null;
const SCALE_KEY='morefun-smt-ui-scale';
let uiScale=Math.max(.82,Math.min(1,Number(localStorage.getItem(SCALE_KEY)||1)));

function viewportSize(){
  const viewport=window.visualViewport;
  return {
    width:Math.round(viewport?.width||window.innerWidth),
    height:Math.round(viewport?.height||window.innerHeight)
  };
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
  frame.style.width='100%';
  frame.style.height='100%';
  try{
    if(frame.contentDocument?.documentElement)applyResponsiveProfile(frame.contentDocument,currentProfile);
  }catch(error){
    console.warn('RESPONSIVE_CHILD_PROFILE_FAILED',error);
  }
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

function showLoaderError(message){
  frame.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';
}

function load(){
  const key=route();
  if(key===current)return;
  current=key;
  childReady=false;
  frame.src=routes[key]+'?build=order-v1-31';
}

frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。'));
frame.addEventListener('load',()=>{
  if(currentProfile){
    try{applyResponsiveProfile(frame.contentDocument,currentProfile);}catch(error){console.warn('RESPONSIVE_CHILD_PROFILE_FAILED',error);}
  }
});
addEventListener('hashchange',load);
addEventListener('pageshow',applyProfile);
addEventListener('resize',scheduleProfileUpdate,{passive:true});
addEventListener('orientationchange',()=>setTimeout(scheduleProfileUpdate,120),{passive:true});
window.visualViewport?.addEventListener('resize',scheduleProfileUpdate,{passive:true});
addEventListener('message',event=>{
  if(event.source!==frame.contentWindow)return;
  if(event.data?.type==='morefun:page-ready')childReady=true;
  if(event.data?.type==='morefun:navigate')location.hash='#/'+event.data.route;
  if(event.data?.type==='morefun:exit-fullscreen'&&document.fullscreenElement)document.exitFullscreen?.();
  if(event.data?.type==='morefun:set-ui-scale'){
    uiScale=Math.max(.82,Math.min(1,Number(event.data.value)||1));
    localStorage.setItem(SCALE_KEY,String(uiScale));
    applyProfile();
  }
  if(event.data?.type==='morefun:page-runtime-error'){
    console.error(event.data);
    if(!childReady)showLoaderError('點單頁啟動失敗，資料仍保存在本機，請重新整理後再試。');
  }
});
applyProfile();
load();
