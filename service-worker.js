const CACHE='morefun-smt-page-folders-preview-v4';
const SHELL=['./','./index.html','./app-shell.css','./app-loader.js','./manifest.webmanifest'];
const scopePath=new URL(self.registration.scope).pathname;

function isRootDocument(url){
  const path=url.pathname;
  return path===scopePath||path===`${scopePath}index.html`;
}

function subpageOfflineResponse(){
  return new Response(`<!doctype html><html lang="zh-HK"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;display:grid;place-items:center;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{max-width:560px;padding:30px;border:1px solid #ead9ce;border-radius:18px;background:#fff;text-align:center}.card strong{display:block;color:#e84b12;font-size:25px;margin-bottom:10px}.card p{line-height:1.7;color:#776b63}</style></head><body><section class="card"><strong>暫時未能載入此頁</strong><p>網絡或部署文件未完成。請返回上一頁，稍後重新整理。系統已阻止重複載入，購物車資料仍保存在本機。</p></section></body></html>`,{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request,{cache:'no-store'});
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(request,copy));
      }
      return response;
    }catch{
      const cached=await caches.match(request,{ignoreSearch:true});
      if(cached)return cached;
      if(request.mode==='navigate'){
        if(isRootDocument(url))return (await caches.match('./index.html'))||subpageOfflineResponse();
        return subpageOfflineResponse();
      }
      return Response.error();
    }
  })());
});
