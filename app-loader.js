const stage=document.getElementById('stage');
const frame=document.getElementById('page');
const hud=document.getElementById('device-hud');
const hudDetail=document.getElementById('device-hud-detail');
const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html',orders:'pages/orders/index.html',dine:'pages/dine/index.html',soldout:'pages/soldout/index.html',more:'pages/more/index.html'};
const BUILD='smt-t2s-1280x800-rebuild.36';
const TARGET_WIDTH=1280;
const TARGET_HEIGHT=800;
let current='',childReady=false,navSeq=0,readyTimer=0,repaintTimer=0;
function viewportSize(){const viewport=window.visualViewport;return{width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};}
function isExactTarget(size){return size.width===TARGET_WIDTH&&size.height===TARGET_HEIGHT;}
function applyT2SViewport(){
  const size=viewportSize();
  const orientation=size.width>=size.height?'橫屏':'直屏';
  document.documentElement.dataset.orientation=orientation==='橫屏'?'landscape':'portrait';
  const exact=isExactTarget(size);
  const scale=exact?1:Math.min(size.width/TARGET_WIDTH,size.height/TARGET_HEIGHT);
  const renderedWidth=Math.round(TARGET_WIDTH*scale),renderedHeight=Math.round(TARGET_HEIGHT*scale);
  stage.style.width=TARGET_WIDTH+'px';
  stage.style.height=TARGET_HEIGHT+'px';
  stage.style.left=Math.max(0,Math.round((size.width-renderedWidth)/2))+'px';
  stage.style.top=Math.max(0,Math.round((size.height-renderedHeight)/2))+'px';
  if(!exact&&'zoom' in stage.style){stage.style.zoom=String(scale);stage.style.transform='none';}
  else{stage.style.zoom='1';stage.style.transform=scale===1?'none':'scale('+scale+')';}
  stage.dataset.profile=exact?'sunmi-t2s-native':'sunmi-t2s-simulator';
  stage.dataset.viewportWidth=String(size.width);
  stage.dataset.viewportHeight=String(size.height);
  stage.dataset.scale=scale.toFixed(4);
  stage.dataset.fitted='1';
  document.documentElement.dataset.previewMode=exact?'native':'simulator';
  if(hud&&hudDetail){hud.hidden=exact;hudDetail.textContent='裝置 '+size.width+'×'+size.height+'（'+orientation+'）｜完整框縮放 '+Math.round(scale*100)+'%｜黃色框內固定為 1280×800｜版本 '+BUILD;}
}
function route(){const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}
function pingChild(){try{frame.contentWindow?.postMessage({type:'morefun:ping',build:BUILD},'*');}catch(_error){}}
function showLoaderError(message){frame.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><meta name="viewport" content="width=1280,initial-scale=1"><style>body{margin:0;display:grid;place-items:center;width:1280px;height:800px;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{max-width:520px;padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}.card button{min-height:48px;margin-top:12px;padding:0 20px;border:0;border-radius:10px;background:#ef5b23;color:#fff;font-weight:800}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p><button onclick="location.reload()">重新載入</button></section></body></html>';}
function patchChild(){
  let doc;
  try{doc=frame.contentDocument;}catch(_error){return;}
  if(!doc||!doc.documentElement)return;
  doc.documentElement.style.setProperty('--t2s-width',TARGET_WIDTH+'px');
  doc.documentElement.style.setProperty('--t2s-height',TARGET_HEIGHT+'px');
  let style=doc.getElementById('t2s-host-runtime-patch');
  if(!style){style=doc.createElement('style');style.id='t2s-host-runtime-patch';doc.head?.appendChild(style);}
  style.textContent=`
html,body,#app,.app,body>main,#app>main{width:1280px!important;min-width:1280px!important;max-width:1280px!important;height:800px!important;min-height:800px!important;max-height:800px!important;margin:0!important;overflow:hidden!important;}
#app>main,body>main{display:flex!important;flex-direction:column!important;background:var(--bg,#f8f6f2)!important;}
.workspace{flex:1 1 auto!important;min-width:0!important;min-height:0!important;overflow:hidden!important;}
.bottom-nav{flex:0 0 76px!important;min-height:76px!important;}
body[data-page="order"] .topbar,body[data-page="order"] .global-statusbar{flex:0 0 56px!important;min-height:56px!important;height:56px!important;}
body[data-page="order"] .workspace{height:668px!important;max-height:668px!important;}
body[data-page="order"] .order-grid{display:grid!important;height:100%!important;min-height:0!important;grid-template-columns:minmax(292px,var(--cart-width,25%)) minmax(0,1fr)!important;}
body[data-page="order"] .cart,body[data-page="order"] .catalog{min-height:0!important;overflow:hidden!important;background:#fff!important;border:1px solid var(--line,#e8e0d9)!important;}
body[data-page="order"] .catalog{display:flex!important;flex-direction:column!important;}
body[data-page="order"] .products{flex:1 1 auto!important;min-height:0!important;overflow:auto!important;}
body[data-page="checkout"] .app{display:flex!important;flex-direction:column!important;}
body[data-page="checkout"] .topbar{flex:0 0 58px!important;height:58px!important;min-height:58px!important;}
body[data-page="checkout"] .checkout{width:1280px!important;height:742px!important;min-width:1280px!important;max-width:1280px!important;display:grid!important;grid-template-columns:390px minmax(0,1fr)!important;gap:10px!important;padding:10px 12px!important;overflow:hidden!important;flex:0 0 742px!important;}
body[data-page="checkout"] .checkout-cart{display:flex!important;flex-direction:column!important;height:722px!important;min-height:0!important;overflow:hidden!important;background:#fff!important;}
body[data-page="checkout"] .checkout-main{display:flex!important;flex-direction:column!important;position:relative!important;height:722px!important;min-height:0!important;overflow:hidden!important;background:#fff!important;}
body[data-page="checkout"] .cart-lines{flex:1 1 auto!important;min-height:0!important;overflow:auto!important;}
`;
  try{doc.defaultView?.scrollTo(0,0);}catch(_error){}
}
function forceFrameRepaint(){
  clearTimeout(repaintTimer);
  repaintTimer=setTimeout(()=>{
    patchChild();
    frame.style.visibility='hidden';
    void frame.offsetHeight;
    requestAnimationFrame(()=>{frame.style.visibility='visible';frame.style.opacity='0.999';void frame.offsetHeight;requestAnimationFrame(()=>{frame.style.opacity='1';});});
  },20);
}
function nudgeChild(times=4){let count=0;const run=()=>{patchChild();pingChild();forceFrameRepaint();if(++count<times)setTimeout(run,160);};run();}
function load({force=false}={}){const key=route();if(!force&&key===current)return;current=key;childReady=false;clearTimeout(readyTimer);frame.removeAttribute('srcdoc');frame.style.visibility='hidden';frame.src=routes[key]+'?build='+encodeURIComponent(BUILD)+'&nav='+String(++navSeq)+'&t='+Date.now();readyTimer=setTimeout(()=>{if(!childReady)nudgeChild(5);},650);}
frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。'));
frame.addEventListener('load',()=>{applyT2SViewport();nudgeChild(6);});
addEventListener('hashchange',()=>load());
addEventListener('pageshow',()=>{applyT2SViewport();nudgeChild(3);});
addEventListener('resize',()=>{applyT2SViewport();forceFrameRepaint();},{passive:true});
addEventListener('orientationchange',()=>setTimeout(()=>{applyT2SViewport();nudgeChild(4);},120),{passive:true});
addEventListener('message',event=>{if(event.source!==frame.contentWindow)return;if(event.data?.type==='morefun:page-ready'){childReady=true;clearTimeout(readyTimer);nudgeChild(3);}if(event.data?.type==='morefun:navigate'){const next=String(event.data.route||'order');if(location.hash==='#/'+next)load({force:true});else location.hash='#/'+next;}if(event.data?.type==='morefun:exit-fullscreen'&&document.fullscreenElement)document.exitFullscreen?.();if(event.data?.type==='morefun:set-ui-scale')frame.contentWindow?.postMessage({type:'morefun:ui-scale-disabled',reason:'T2S 使用固定 1280×800 測試框；請使用瀏覽器雙指縮放檢查細節。'},'*');});
applyT2SViewport();load();