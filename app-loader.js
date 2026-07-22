const stage=document.getElementById('stage');
const frame=document.getElementById('page');
const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};
const BUILD='smt-t2s-1280x800-rebuild.1';
let current='';
let childReady=false;

function viewportSize(){
  const viewport=window.visualViewport;
  return {
    width:Math.round(viewport?.width||window.innerWidth),
    height:Math.round(viewport?.height||window.innerHeight)
  };
}

function applyNativeViewport(){
  const size=viewportSize();
  const landscape=size.width>size.height;
  document.documentElement.dataset.orientation=landscape?'landscape':'portrait';
  stage.dataset.profile=size.width<=1400?'sunmi-t2s-native':'desktop-native';
  stage.dataset.viewportWidth=String(size.width);
  stage.dataset.viewportHeight=String(size.height);
  stage.dataset.fitted=landscape?'1':'0';
}

function route(){
  const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];
  return routes[key]?key:'order';
}

function showLoaderError(message){
  frame.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{max-width:520px;padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}.card button{min-height:48px;margin-top:12px;padding:0 20px;border:0;border-radius:10px;background:#ef5b23;color:#fff;font-weight:800}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p><button onclick="location.reload()">重新載入</button></section></body></html>';
}

function load({force=false}={}){
  const key=route();
  if(!force&&key===current)return;
  current=key;
  childReady=false;
  frame.src=routes[key]+'?build='+encodeURIComponent(BUILD);
}

frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。'));
addEventListener('hashchange',()=>load());
addEventListener('pageshow',applyNativeViewport);
addEventListener('resize',applyNativeViewport,{passive:true});
addEventListener('orientationchange',()=>setTimeout(applyNativeViewport,120),{passive:true});
addEventListener('message',event=>{
  if(event.source!==frame.contentWindow)return;
  if(event.data?.type==='morefun:page-ready')childReady=true;
  if(event.data?.type==='morefun:navigate')location.hash='#/'+event.data.route;
  if(event.data?.type==='morefun:exit-fullscreen'&&document.fullscreenElement)document.exitFullscreen?.();
  if(event.data?.type==='morefun:set-ui-scale'){
    frame.contentWindow?.postMessage({type:'morefun:ui-scale-disabled',reason:'T2S 使用原生 1280×800 排版，不再縮放整頁。'},'*');
  }
  if(event.data?.type==='morefun:reload-current-page')load({force:true});
  if(event.data?.type==='morefun:page-runtime-error'){
    console.error(event.data);
    if(!childReady)showLoaderError('頁面啟動失敗，資料仍保存在本機，請重新整理後再試。');
  }
});

applyNativeViewport();
load();
