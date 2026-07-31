const stage=document.getElementById('stage');
const frame=document.getElementById('page');
const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};
const rootParams=new URLSearchParams(location.search);
const APP_PROFILE=/mobile|smm/i.test(String(rootParams.get('profile')||rootParams.get('mode')||''))?'mobile':'register';
document.documentElement.dataset.appProfile=APP_PROFILE;
let current='';
let fitToken=0;
let childReady=false;
const SCALE_KEY='morefun-smt-ui-scale';
let uiScale=Math.max(.82,Math.min(1,Number(localStorage.getItem(SCALE_KEY)||1)));

function route(){
  const fallback=APP_PROFILE==='mobile'?'soldout':'order';
  const key=(location.hash.replace(/^#\/?/,'')||fallback).split('?')[0];
  return routes[key]?key:fallback;
}
function routeSource(key){
  if(APP_PROFILE==='mobile'&&key==='soldout')return 'pages/mobile-soldout/index.html';
  return routes[key];
}
function canvasWidth(){return APP_PROFILE==='mobile'&&route()==='soldout'?430:1920}
function viewportSize(){
  const viewport=window.visualViewport;
  return {width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};
}
function applyFit(size){
  const logicalWidth=canvasWidth();
  const scale=(size.width/logicalWidth)*(logicalWidth===430?1:uiScale);
  const logicalHeight=Math.max(logicalWidth===430?720:720,Math.round(size.height/scale));
  stage.style.width=logicalWidth+'px';
  stage.style.height=logicalHeight+'px';
  frame.style.width=logicalWidth+'px';
  frame.style.height=logicalHeight+'px';
  stage.style.left=Math.max(0,(size.width-logicalWidth*scale)/2)+'px';
  stage.style.top='0px';
  stage.style.transform='scale('+scale+')';
  stage.dataset.scale=scale.toFixed(6);
  stage.dataset.profile=APP_PROFILE==='mobile'?'smm-mobile':'sunmi-t2s-safe-width';
  stage.dataset.logicalHeight=String(logicalHeight);
  stage.dataset.fitted='1';
}
function fitStableViewport(){
  const token=++fitToken;
  let previous='';
  let stableCount=0;
  let attempts=0;
  function sample(){
    if(token!==fitToken)return;
    const size=viewportSize();
    const landscape=size.width>size.height;
    document.documentElement.dataset.orientation=landscape?'landscape':'portrait';
    if(APP_PROFILE!=='mobile'&&!landscape){stage.dataset.fitted='0';return;}
    const key=size.width+'x'+size.height+'-'+route();
    stableCount=key===previous?stableCount+1:0;
    previous=key;
    attempts+=1;
    if(stableCount>=2||attempts>=12){applyFit(size);return;}
    setTimeout(sample,120);
  }
  sample();
}
function showLoaderError(message){
  frame.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';
}
function load(){
  const key=route();
  if(key===current)return;
  current=key;
  childReady=false;
  const params=new URLSearchParams({build:'order-v1-32',profile:APP_PROFILE});
  for(const name of ['terminal','mode'])if(rootParams.get(name))params.set(name,rootParams.get(name));
  frame.src=routeSource(key)+'?'+params.toString();
  fitStableViewport();
}
frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。'));
addEventListener('hashchange',load);
addEventListener('pageshow',fitStableViewport,{once:true});
addEventListener('orientationchange',()=>{stage.dataset.fitted='0';setTimeout(fitStableViewport,180);},{passive:true});
addEventListener('message',event=>{
  if(event.source!==frame.contentWindow)return;
  if(event.data?.type==='morefun:page-ready')childReady=true;
  if(event.data?.type==='morefun:navigate')location.hash='#/'+event.data.route;
  if(event.data?.type==='morefun:exit-fullscreen'&&document.fullscreenElement)document.exitFullscreen?.();
  if(event.data?.type==='morefun:set-ui-scale'){
    uiScale=Math.max(.82,Math.min(1,Number(event.data.value)||1));
    localStorage.setItem(SCALE_KEY,String(uiScale));
    fitStableViewport();
  }
  if(event.data?.type==='morefun:page-runtime-error'){
    console.error(event.data);
    if(!childReady)showLoaderError('頁面啟動失敗，資料仍保存在本機，請重新整理後再試。');
  }
});
fitStableViewport();
load();
