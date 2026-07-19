const stage=document.getElementById('stage');
const frame=document.getElementById('page');
const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html'};
let current='';
let lastOrientation='';
let fitTimer=0;

function viewportSize(){
  const viewport=window.visualViewport;
  return {width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};
}
function fitLandscapeOnce(force=false){
  const size=viewportSize();
  const orientation=size.width>size.height?'landscape':'portrait';
  document.documentElement.dataset.orientation=orientation;
  if(orientation!=='landscape')return;
  if(!force&&lastOrientation==='landscape'&&stage.dataset.fitted==='1')return;
  lastOrientation='landscape';
  clearTimeout(fitTimer);
  fitTimer=setTimeout(()=>{
    const stable=viewportSize();
    const scale=Math.min(stable.width/1920,stable.height/1080);
    const left=Math.max(0,(stable.width-1920*scale)/2);
    const top=Math.max(0,(stable.height-1080*scale)/2);
    stage.style.transform='translate('+left+'px,'+top+'px) scale('+scale+')';
    stage.dataset.scale=scale.toFixed(6);
    stage.dataset.fitted='1';
  },220);
}
function route(){const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}
function showLoaderError(message){frame.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';}
function load(){const key=route();if(key===current)return;current=key;frame.src=routes[key]+'?build=v16f';}
frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。'));
addEventListener('hashchange',load);
addEventListener('pageshow',()=>fitLandscapeOnce(true),{once:true});
addEventListener('orientationchange',()=>{lastOrientation='';stage.dataset.fitted='0';fitLandscapeOnce(true);},{passive:true});
addEventListener('message',event=>{if(event.source!==frame.contentWindow)return;if(event.data?.type==='morefun:navigate')location.hash='#/'+event.data.route;if(event.data?.type==='morefun:page-runtime-error')console.error(event.data);});
fitLandscapeOnce(true);
load();
