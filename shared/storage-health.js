const WARN_RATIO=.72;
const CRITICAL_RATIO=.88;

function bytesToMb(value){return Math.round((Number(value||0)/1024/1024)*10)/10;}

export async function requestPersistentStorage(){
  if(!navigator.storage?.persist)return {supported:false,persisted:false};
  const before=await navigator.storage.persisted?.().catch(()=>false);
  const persisted=before||await navigator.storage.persist().catch(()=>false);
  return {supported:true,persisted:Boolean(persisted)};
}

export async function getStorageHealth(){
  const estimate=await navigator.storage?.estimate?.().catch(()=>({}))||{};
  const quota=Number(estimate.quota||0),usage=Number(estimate.usage||0),ratio=quota>0?usage/quota:0;
  const persisted=await navigator.storage?.persisted?.().catch(()=>false);
  const level=ratio>=CRITICAL_RATIO?'critical':ratio>=WARN_RATIO?'warning':'ok';
  return Object.freeze({
    supported:Boolean(navigator.storage?.estimate),
    usage,
    quota,
    usageMb:bytesToMb(usage),
    quotaMb:bytesToMb(quota),
    ratio,
    percent:Math.round(ratio*1000)/10,
    level,
    persisted:Boolean(persisted),
    checkedAt:new Date().toISOString()
  });
}

export function subscribeStorageHealth(listener,{intervalMs=60000}={}){
  if(typeof listener!=='function')throw new TypeError('listener must be a function');
  let stopped=false,timer=null;
  const check=async()=>{const health=await getStorageHealth();if(!stopped)listener(health);return health;};
  void check();
  if(intervalMs>0)timer=setInterval(()=>void check(),intervalMs);
  return()=>{stopped=true;if(timer)clearInterval(timer);};
}
