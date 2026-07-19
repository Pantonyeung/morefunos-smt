const CACHE='morefun-smt-t2-v1.0.1-20260719';
const ASSETS=['./index.html','./smt-master.css?v=1.0.1','./smt-master.js?v=1.0.1','./smt-data.js?v=1.0.1','./smt-api-client.js?v=1.0.1','./manifest.webmanifest'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('morefun-smt')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request,{cache:'no-store'});
        const cache=await caches.open(CACHE);
        cache.put('./index.html',response.clone());
        return response;
      }catch(error){
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    try{
      const response=await fetch(request,{cache:'no-store'});
      if(response&&response.ok){
        const cache=await caches.open(CACHE);
        cache.put(request,response.clone());
      }
      return response;
    }catch(error){
      return (await caches.match(request)) || Response.error();
    }
  })());
});
