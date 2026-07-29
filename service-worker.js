const CACHE='morefun-smt-shell-v2-20260729';
const CORE=[
  './','./index.html','./manifest.webmanifest','./app-shell.css','./app-loader.js','./shell-startup.js',
  './shared/store.js','./shared/components.js','./shared/shell.js','./shared/page-base.css','./shared/responsive-pages.css','./shared/page-bridge.js','./shared/responsive.js','./shared/status-actions.js',
  './shared/runtime-contract.js','./shared/runtime-local-adapter.js','./shared/runtime-controller.js','./shared/runtime-bootstrap.js','./shared/runtime-lifecycle.js','./shared/runtime-status.js','./shared/runtime-diagnostics.js','./shared/runtime-snapshot-store.js','./shared/push-queue.js','./shared/health-state.js',
  './shared/offline-package-store.js','./shared/offline-survival.js','./shared/offline-journal.js','./shared/storage-health.js','./shared/offline-endurance-self-test.js',
  './pages/order/index.html','./pages/order/page.js','./pages/order/page.css','./pages/order/responsive.css',
  './pages/checkout/index.html','./pages/checkout/page.js','./pages/checkout/page.css','./pages/checkout/responsive.css',
  './pages/orders/index.html','./pages/orders/page.js','./pages/orders/page.css','./pages/orders/responsive.css',
  './pages/dine/index.html','./pages/dine/page.js','./pages/dine/page.css','./pages/dine/responsive.css',
  './pages/soldout/index.html','./pages/soldout/page.js','./pages/soldout/page.css','./pages/soldout/responsive.css',
  './pages/more/index.html','./pages/more/page.js','./pages/more/page.css','./pages/more/responsive.css','./pages/more/more-domain.js','./pages/more/print-domain.js','./pages/more/runtime-ui-hook.js'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(async cache=>{
    for(const url of CORE){try{await cache.add(url);}catch(error){console.warn('OFFLINE_PRECACHE_SKIP',url,error?.message||error);}}
  }).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('morefun-smt-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

function isSameOrigin(request){try{return new URL(request.url).origin===self.location.origin;}catch{return false;}}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||!isSameOrigin(request))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));return response;}).catch(async()=>await caches.match(request)||await caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>{
    const network=fetch(request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>cached);
    return cached||network;
  }));
});

self.addEventListener('message',event=>{
  if(event.data?.type==='morefun:offline-cache-refresh')event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url)))));
});
