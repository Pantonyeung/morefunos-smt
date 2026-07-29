const DEFAULT_TIMEOUT_MS=8000;

function trimSlash(value=''){
  return String(value||'').trim().replace(/\/+$/,'');
}

function joinUrl(base,path){
  const cleanBase=trimSlash(base);
  const cleanPath=String(path||'').trim();
  if(!cleanBase||!cleanPath)return '';
  if(/^https?:\/\//i.test(cleanPath))return cleanPath;
  return cleanBase+'/'+cleanPath.replace(/^\/+/, '');
}

function readPath(source,path){
  return String(path||'').split('.').reduce((value,key)=>value?.[key],source);
}

function normalizeConfig(settings={}){
  const sync=settings.sync||settings.staffSync||settings.api||{};
  const baseUrl=sync.baseUrl||sync.apiBaseUrl||settings.apiBaseUrl||settings.workerUrl||'';
  return Object.freeze({
    enabled:sync.enabled!==false&&Boolean(baseUrl),
    baseUrl:trimSlash(baseUrl),
    pullPath:sync.pullPath||sync.pullEndpoint||'/smt/sync/pull',
    pushPath:sync.pushPath||sync.pushEndpoint||'/smt/sync/push',
    healthPath:sync.healthPath||sync.healthEndpoint||'/health',
    token:sync.token||settings.apiToken||'',
    deviceId:sync.deviceId||settings.deviceId||'smt-primary',
    timeoutMs:Number(sync.timeoutMs)||DEFAULT_TIMEOUT_MS
  });
}

async function requestJson(url,{method='GET',body,config,session,idempotencyKey}={}){
  if(!url)throw new Error('sync_endpoint_not_configured');
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),config.timeoutMs);
  const headers={'Accept':'application/json','Content-Type':'application/json','X-MoreFun-Device':config.deviceId};
  if(config.token)headers.Authorization=`Bearer ${config.token}`;
  if(session?.username)headers['X-MoreFun-Staff']=session.username;
  if(idempotencyKey)headers['Idempotency-Key']=idempotencyKey;
  try{
    const response=await fetch(url,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',credentials:'omit',signal:controller.signal});
    const text=await response.text();
    let data=null;
    if(text){try{data=JSON.parse(text);}catch{throw new Error('sync_invalid_json');}}
    if(!response.ok){
      const error=new Error(data?.error||data?.message||`sync_http_${response.status}`);
      error.status=response.status;
      error.retryable=response.status>=500||response.status===408||response.status===429;
      throw error;
    }
    return data||{};
  }catch(error){
    if(error?.name==='AbortError'){
      const timeoutError=new Error('sync_timeout');
      timeoutError.retryable=true;
      throw timeoutError;
    }
    throw error;
  }finally{clearTimeout(timeout);}
}

export function createRuntimeApiAdapter({settings={},session=null,applySnapshot=()=>{}}={}){
  const config=normalizeConfig(settings);
  const requireEnabled=()=>{if(!config.enabled)throw new Error('sync_not_configured');};
  return Object.freeze({
    config,
    isConfigured:()=>config.enabled,
    async healthProbe(){
      requireEnabled();
      return requestJson(joinUrl(config.baseUrl,config.healthPath),{config,session});
    },
    async pull({revision=null}={}){
      requireEnabled();
      const url=new URL(joinUrl(config.baseUrl,config.pullPath));
      if(revision)url.searchParams.set('revision',revision);
      url.searchParams.set('deviceId',config.deviceId);
      const result=await requestJson(url.toString(),{config,session});
      return {
        revision:result.revision||result.version||null,
        snapshot:result.snapshot??result.data??result,
        apply:async()=>applySnapshot(result.snapshot??result.data??result)
      };
    },
    async push(item){
      requireEnabled();
      return requestJson(joinUrl(config.baseUrl,config.pushPath),{
        method:'POST',config,session,idempotencyKey:item.idempotencyKey,
        body:{deviceId:config.deviceId,type:item.type,payload:item.payload,createdAt:item.createdAt}
      });
    }
  });
}

export function getRuntimeApiConfig(settings={}){
  return normalizeConfig(settings);
}

export function getSnapshotValue(snapshot,path,fallback=null){
  const value=readPath(snapshot,path);
  return value===undefined?fallback:value;
}
