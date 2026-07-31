export const SUPPLY_STORAGE_KEY='morefun:smt:v1:supply-overrides';
export const SUPPLY_PENDING_STORAGE_KEY='morefun:staff:supply-pending:v1';
export const STAFF_SESSION_STORAGE_KEY='morefun:staff:session:v1';
export const OPERATIONS_API_BASE_STORAGE_KEY='morefun:operations-api-base-url';
const DEFAULT_API_BASE='';
const POLL_INTERVAL_MS=15000;

const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const parse=value=>{try{return JSON.parse(value||'null')}catch{return null}};
const supplyRows=value=>Array.isArray(value)
  ?value
  :value&&typeof value==='object'
    ?Object.entries(value).map(([key,row])=>row&&typeof row==='object'?{...row,productId:row.productId||row.product_id||row.id||key}:{productId:key,status:row})
    :[];
const productIdOf=row=>String(row?.productId||row?.product_id||row?.id||'').trim();
const timestamp=value=>{const number=Number(value);if(Number.isFinite(number)&&number>0)return number;const parsed=Date.parse(String(value||''));return Number.isFinite(parsed)?parsed:0};

export function normalizeSupplyStatus(value){
  const status=String(value||'available').trim().toLowerCase().replace(/[-\s]+/g,'_');
  if(['soldout','sold_out','out_of_stock','unavailable'].includes(status))return 'soldout';
  if(['paused','pause','suspended','disabled'].includes(status))return 'paused';
  return 'available';
}

export function normalizeSupplyOverrides(value){
  const output={};
  for(const row of supplyRows(value)){
    const productId=productIdOf(row);
    const status=normalizeSupplyStatus(row?.status||row?.availability_status);
    if(!productId||status==='available')continue;
    output[productId]={
      status,
      updatedAt:timestamp(row?.updatedAt??row?.updated_at),
      expiresAt:timestamp(row?.expiresAt??row?.expires_at),
      source:String(row?.source||''),
      deviceId:String(row?.deviceId||row?.device_id||'')
    };
  }
  return output;
}

export function diffSupplyOverrides(before={},after={}){
  const ids=[...new Set([...Object.keys(before||{}),...Object.keys(after||{})])].sort();
  const updates=[];
  for(const productId of ids){
    const previous=normalizeSupplyStatus(before?.[productId]?.status||before?.[productId]?.availability_status);
    const next=normalizeSupplyStatus(after?.[productId]?.status||after?.[productId]?.availability_status);
    if(previous!==next)updates.push({productId,status:next});
  }
  return updates;
}

export function createMemoryStorage(seed={}){
  const map=new Map(Object.entries(seed));
  return {
    getItem:key=>map.has(String(key))?map.get(String(key)):null,
    setItem:(key,value)=>map.set(String(key),String(value)),
    removeItem:key=>map.delete(String(key)),
    clear:()=>map.clear(),
    key:index=>[...map.keys()][index]??null,
    get length(){return map.size},
    _map:map
  };
}

function safeStorage(storage){return storage||globalThis.localStorage||createMemoryStorage()}
function mergePending(current=[],updates=[]){
  const map=new Map();
  for(const item of [...current,...updates]){
    const productId=productIdOf(item);
    if(productId)map.set(productId,{productId,status:normalizeSupplyStatus(item.status||item.availability_status)});
  }
  return [...map.values()].sort((left,right)=>left.productId.localeCompare(right.productId));
}
function normalizeSession(value,now=Date.now()){
  if(!value||typeof value!=='object'||!String(value.token||'').trim())return null;
  const expiresAt=timestamp(value.expiresAt);
  if(expiresAt&&expiresAt<=now)return null;
  return {token:String(value.token),staff:clone(value.staff||null),source:String(value.source||''),deviceId:String(value.deviceId||''),expiresAt};
}
function dispatch(globalObject,name,detail){
  try{globalObject?.dispatchEvent?.(new CustomEvent(name,{detail}))}catch{}
}
function sameJson(left,right){return JSON.stringify(left||{})===JSON.stringify(right||{})}
function overlayPending(remote,pending,local){
  const next={...normalizeSupplyOverrides(remote)};
  for(const item of pending){
    if(item.status==='available')delete next[item.productId];
    else next[item.productId]={...(local?.[item.productId]||{}),status:item.status,updatedAt:local?.[item.productId]?.updatedAt||Date.now(),source:local?.[item.productId]?.source||'local-pending',deviceId:local?.[item.productId]?.deviceId||''};
  }
  return next;
}

export function createSupplyRuntime(options={}){
  const storage=safeStorage(options.storage);
  const fetchImpl=options.fetchImpl||globalThis.fetch?.bind(globalThis);
  const globalObject=options.globalObject||globalThis;
  const source=String(options.source||'smt').toLowerCase()==='smm'?'smm':'smt';
  const deviceId=String(options.deviceId||`${source}-unknown`);
  const configuredBase=options.baseUrl??storage.getItem(OPERATIONS_API_BASE_STORAGE_KEY)??DEFAULT_API_BASE;
  const baseUrl=String(configuredBase||'').replace(/\/+$/,'');
  let session=normalizeSession(parse(storage.getItem(STAFF_SESSION_STORAGE_KEY)));
  let overrides=normalizeSupplyOverrides(parse(storage.getItem(SUPPLY_STORAGE_KEY))||{});
  let pending=mergePending([],parse(storage.getItem(SUPPLY_PENDING_STORAGE_KEY))||[]);
  let state={status:session?'idle':'session-required',connected:false,lastError:null,lastSyncAt:null,source,deviceId};
  let pollTimer=null;
  let flushing=null;

  function persist(key,value){
    if(value==null)storage.removeItem(key);else storage.setItem(key,JSON.stringify(value));
  }
  function publish(reason='state'){
    dispatch(globalObject,'morefun:supply-runtime-state',{...state,reason,overrides:clone(overrides),pending:clone(pending),staff:clone(session?.staff||null)});
  }
  function persistOverrides(value,{reason='runtime',emit=true}={}){
    const next=normalizeSupplyOverrides(value);
    const changed=!sameJson(overrides,next);
    overrides=next;
    persist(SUPPLY_STORAGE_KEY,overrides);
    if(changed&&emit)dispatch(globalObject,'morefun:supply-runtime-updated',{reason,overrides:clone(overrides)});
    publish(reason);
    return clone(overrides);
  }
  function persistPending(value){pending=mergePending([],value);persist(SUPPLY_PENDING_STORAGE_KEY,pending);return clone(pending)}
  function persistSession(value){session=normalizeSession(value);persist(STAFF_SESSION_STORAGE_KEY,session);return clone(session)}
  async function request(path,{method='GET',body,token=session?.token}={}){
    if(typeof fetchImpl!=='function')throw Object.assign(new Error('SUPPLY_RUNTIME_FETCH_UNAVAILABLE'),{status:0});
    const controller=typeof AbortController==='function'?new AbortController():null;
    const timer=controller?setTimeout(()=>controller.abort(),8000):null;
    try{
      const response=await fetchImpl(`${baseUrl}${path}`,{
        method,
        headers:{accept:'application/json',...(body?{'content-type':'application/json'}:{}),...(token?{authorization:`Bearer ${token}`}:{})},
        body:body?JSON.stringify(body):undefined,
        signal:controller?.signal
      });
      const text=await response.text();
      let payload;try{payload=JSON.parse(text)}catch{throw Object.assign(new Error(`SUPPLY_RUNTIME_INVALID_JSON_${response.status}`),{status:response.status})}
      if(!response.ok||payload?.ok!==true)throw Object.assign(new Error(payload?.error||`SUPPLY_RUNTIME_HTTP_${response.status}`),{status:response.status,payload});
      return payload;
    }finally{if(timer)clearTimeout(timer)}
  }

  async function login({staffNumber,password}={}){
    const payload=await request('/v1/staff/login',{method:'POST',body:{staffNumber,password,deviceId,source},token:''});
    const expiresAt=Date.now()+Number(payload.expiresInSeconds||8*60*60)*1000;
    persistSession({token:payload.token,staff:payload.staff||null,source,deviceId,expiresAt});
    state={...state,status:'connected',connected:true,lastError:null,lastSyncAt:new Date().toISOString()};
    publish('login');
    if(pending.length)await flushPending();
    return clone(session);
  }

  function logout(){
    persistSession(null);
    state={...state,status:'session-required',connected:false,lastError:null};
    publish('logout');
  }

  function captureLocalSnapshot(value){
    const next=normalizeSupplyOverrides(value);
    const updates=diffSupplyOverrides(overrides,next);
    overrides=next;
    if(updates.length)persistPending(mergePending(pending,updates));
    state={...state,status:session?'queued':'offline-local',connected:false};
    publish('local-change');
    if(session&&updates.length)queueMicrotask(()=>void flushPending());
    return {updates:clone(updates),pending:clone(pending),overrides:clone(overrides)};
  }

  async function flushPending(){
    if(flushing)return flushing;
    if(!pending.length)return {ok:true,skipped:true,availability:clone(overrides)};
    if(!session){state={...state,status:'session-required',connected:false};publish('session-required');return {ok:false,error:'STAFF_SESSION_REQUIRED',queued:pending.length}}
    flushing=(async()=>{
      try{
        state={...state,status:'syncing',lastError:null};publish('syncing');
        const submitted=clone(pending);
        const payload=await request('/v1/staff/availability',{method:'PATCH',body:{updates:submitted}});
        persistPending([]);
        persistOverrides(payload.availability||{}, {reason:'local-sync'});
        state={...state,status:'connected',connected:true,lastError:null,lastSyncAt:payload.updatedAt||new Date().toISOString()};
        publish('synced');
        return {ok:true,...payload};
      }catch(error){
        state={...state,status:'offline-local',connected:false,lastError:String(error?.message||error)};
        publish('sync-failed');
        return {ok:false,error:state.lastError,queued:pending.length,status:Number(error?.status||0)};
      }finally{flushing=null}
    })();
    return flushing;
  }

  async function refresh(){
    if(!session){state={...state,status:'session-required',connected:false};publish('session-required');return {ok:false,error:'STAFF_SESSION_REQUIRED',availability:clone(overrides)}}
    try{
      const payload=await request('/v1/staff/availability');
      const next=overlayPending(payload.availability||{},pending,overrides);
      persistOverrides(next,{reason:'remote-refresh'});
      state={...state,status:pending.length?'queued':'connected',connected:true,lastError:null,lastSyncAt:payload.updatedAt||new Date().toISOString()};
      publish('refreshed');
      return {ok:true,...payload,availability:Object.values(next)};
    }catch(error){
      state={...state,status:'offline-local',connected:false,lastError:String(error?.message||error)};
      publish('refresh-failed');
      return {ok:false,error:state.lastError,availability:clone(overrides),status:Number(error?.status||0)};
    }
  }

  async function boot(){
    publish('boot-local');
    if(session&&pending.length)await flushPending();
    if(session)await refresh();
    return {session:clone(session),state:{...state},overrides:clone(overrides),pending:clone(pending)};
  }
  function startPolling(intervalMs=POLL_INTERVAL_MS){
    stopPolling();
    if(typeof globalObject.setInterval!=='function')return null;
    pollTimer=globalObject.setInterval(()=>{if(session)void refresh()},Math.max(5000,Number(intervalMs)||POLL_INTERVAL_MS));
    return pollTimer;
  }
  function stopPolling(){if(pollTimer&&typeof globalObject.clearInterval==='function')globalObject.clearInterval(pollTimer);pollTimer=null}

  return Object.freeze({
    source,deviceId,baseUrl,
    getSession:()=>clone(session),getState:()=>({...state}),getOverrides:()=>clone(overrides),getPending:()=>clone(pending),
    login,logout,captureLocalSnapshot,flushPending,refresh,boot,startPolling,stopPolling
  });
}
