const ROOT_LOADER_RECURSION_GUARD='ROOT_LOADER_RECURSION_GUARD';

if(window.top !== window.self){
  document.documentElement.innerHTML=`<!doctype html><html lang="zh-HK"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#fff;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;color:#332820}.card{max-width:560px;padding:30px;border:1px solid #eadfd5;border-radius:18px;text-align:center}.card strong{display:block;color:#e94b12;font-size:24px;margin-bottom:10px}.card p{line-height:1.65;color:#756b63}</style></head><body><section class="card"><strong>頁面載入被中止</strong><p>系統偵測到 Root Loader 被錯誤載入到子頁框架，已停止重複載入。請返回並重新整理。</p><code>${ROOT_LOADER_RECURSION_GUARD}</code></section></body></html>`;
  throw new Error(ROOT_LOADER_RECURSION_GUARD);
}

const DESIGN_WIDTH=1920;
const DESIGN_HEIGHT=1080;
const BUILD='v12';

const routes=Object.freeze({
  boot:`pages/boot/index.html?${BUILD}`,
  order:`pages/order/index.html?${BUILD}`,
  checkout:`pages/checkout/index.html?${BUILD}`,
  orders:`pages/placeholder/index.html?page=orders&label=訂單&${BUILD}`,
  dine:`pages/placeholder/index.html?page=dine&label=堂食&${BUILD}`,
  supply:`pages/placeholder/index.html?page=supply&label=售罄&${BUILD}`,
  more:`pages/placeholder/index.html?page=more&label=更多&${BUILD}`
});

const viewport=document.getElementById('viewport');
const stage=document.getElementById('t2-stage');
const frame=document.getElementById('page-frame');
const status=document.getElementById('route-status');
let activeRoute='';

function normalizedRoute(value){
  const route=String(value||'').replace(/^#\/?/,'').replace(/^\//,'').split(/[?&]/)[0];
  return routes[route]?route:'order';
}

function fitStage(){
  const width=viewport.clientWidth;
  const height=viewport.clientHeight;
  const scale=Math.min(1,width/DESIGN_WIDTH,height/DESIGN_HEIGHT);
  const scaledWidth=DESIGN_WIDTH*scale;
  const scaledHeight=DESIGN_HEIGHT*scale;
  stage.style.transform=`scale(${scale})`;
  stage.style.left=`${Math.max(0,(width-scaledWidth)/2)}px`;
  stage.style.top=`${Math.max(0,(height-scaledHeight)/2)}px`;
  stage.dataset.scale=scale.toFixed(6);
}

function routeFromHash(){return normalizedRoute(location.hash||'#/order')}
function navigate(route,{replace=false}={}){
  const next=normalizedRoute(route);
  const hash=`#/${next}`;
  if(replace)history.replaceState(null,'',hash);
  else if(location.hash!==hash)location.hash=hash;
  loadRoute(next);
}
function loadRoute(route){
  const next=normalizedRoute(route);
  if(activeRoute===next&&frame.dataset.loaded==='true')return;
  activeRoute=next;
  frame.dataset.loaded='false';
  frame.src=routes[next];
  frame.dataset.route=next;
  status.textContent=`正在載入${next}`;
  document.title=`磨飯 SMT｜${next}`;
}

frame.addEventListener('load',()=>{
  frame.dataset.loaded='true';
  status.textContent=`已載入${activeRoute}`;
});
window.addEventListener('message',event=>{
  const data=event.data;
  if(!data||data.type!=='morefun:navigate')return;
  navigate(data.route);
});
window.addEventListener('hashchange',()=>loadRoute(routeFromHash()));
window.addEventListener('resize',fitStage,{passive:true});
window.addEventListener('orientationchange',fitStage,{passive:true});
new ResizeObserver(fitStage).observe(viewport);

window.MoreFunSMTRouter=Object.freeze({navigate,fitStage,routes,DESIGN_WIDTH,DESIGN_HEIGHT,BUILD});
fitStage();
if(!location.hash)navigate('order',{replace:true});
else loadRoute(routeFromHash());
