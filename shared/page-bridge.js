const ROUTE_PATHS=Object.freeze({
  order:'../order/index.html',
  orders:'../orders/index.html',
  dine:'../dine/index.html',
  soldout:'../soldout/index.html',
  more:'../more/index.html',
  checkout:'../checkout/index.html'
});

let runtimeErrorShown=false;

function inPreview(){return parent&&parent!==window;}

function navigate(route){
  const target=ROUTE_PATHS[route];
  if(!target)return false;
  if(inPreview()){
    parent.postMessage({type:'morefun:navigate',route},'*');
    return true;
  }
  location.href=target;
  return true;
}

function ready(){
  if(inPreview())parent.postMessage({type:'morefun:page-ready',page:document.body.dataset.page||'unknown'},'*');
}

function showRuntimeError(error){
  if(runtimeErrorShown)return;
  runtimeErrorShown=true;
  const message=String(error?.message||error||'未能完成頁面初始化');
  const app=document.getElementById('app');
  if(app)app.innerHTML=`<main style="width:100%;height:100%;display:grid;place-items:center;padding:48px;background:#f8f6f2;color:#251f1b"><section style="max-width:560px;padding:32px;border:1px solid #e7dfd8;border-radius:18px;background:#fff;box-shadow:0 12px 36px rgba(76,46,28,.14)"><small style="color:#cf4338;font-weight:800">頁面啟動異常</small><h1 style="margin:10px 0;font-size:30px">暫時未能開啟此頁</h1><p style="margin:0 0 24px;line-height:1.6">${message.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}</p><div style="display:flex;gap:12px"><button type="button" data-runtime-reload style="min-height:48px;padding:0 18px;border:0;border-radius:12px;background:#ef5218;color:#fff;font-weight:800">重新載入</button><a href="../order/index.html" style="display:grid;place-items:center;min-height:48px;padding:0 18px;border:1px solid #e7dfd8;border-radius:12px;color:#251f1b;text-decoration:none;font-weight:800">返回點餐</a></div></section></main>`;
  app?.querySelector('[data-runtime-reload]')?.addEventListener('click',()=>location.reload());
  if(inPreview())parent.postMessage({type:'morefun:page-runtime-error',page:document.body.dataset.page||'unknown',message},'*');
}

function applyPreferences(){
  try{
    const settings=JSON.parse(localStorage.getItem('morefun:smt:v16c:settings')||'{}');
    document.documentElement.dataset.theme=settings.morePage?.theme||'warm';
    document.documentElement.dataset.sounds=settings.morePage?.sounds===false?'off':'on';
  }catch(_error){document.documentElement.dataset.theme='warm';document.documentElement.dataset.sounds='on';}
}

window.addEventListener('error',event=>{if(event.error)showRuntimeError(event.error);});
window.addEventListener('unhandledrejection',event=>showRuntimeError(event.reason));
applyPreferences();
document.addEventListener('DOMContentLoaded',()=>{applyPreferences();ready();},{once:true});
window.MoreFunPageBridge={ROUTE_PATHS,navigate,ready,applyPreferences,showRuntimeError};
