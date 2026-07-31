export const SUPPLY_STORAGE_KEY='morefun:smt:v1:supply-overrides';
export const SUPPLY_PENDING_STORAGE_KEY='morefun:staff:supply-pending:v1';
export const STAFF_SESSION_STORAGE_KEY='morefun:staff:session:v1';
export const OPERATIONS_API_BASE_STORAGE_KEY='morefun:operations-api-base-url';
export const DEFAULT_OPERATIONS_API_BASE='https://morefunos-admin.pages.dev';
const POLL_MS=15000;

const parse=value=>{try{return JSON.parse(value||'null')}catch{return null}};
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const statusOf=row=>{
  const value=String(row?.status||row?.availability_status||'available').trim().toLowerCase();
  return ['soldout','paused'].includes(value)?value:'available';
};
const timestamp=value=>{
  const numeric=Number(value);
  if(Number.isFinite(numeric)&&numeric>0)return numeric;
  const parsed=Date.parse(String(value||''));
  return Number.isFinite(parsed)?parsed:0;
};
const productIdOf=row=>String(row?.productId||row?.product_id||row?.id||'').trim();
const rows=value=>Array.isArray(value)?value:value&&typeof value==='object'?Object.values(value):[];

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

export function normalizeSupplyOverrides(value){
  const output={};
  for(const row of rows(value)){
    const productId=productIdOf(row);
    const status=statusOf(row);
    if(!productId||status==='available')continue;
    output[productId]={
      status,
      updatedAt:timestamp(row.updatedAt??row.updated_at),
      expiresAt:timestamp(row.expiresAt??row.expires_at),
      source:String(row.source||''),
      deviceId:String(row.deviceId||row.device_id||'')
    };
  }
  return output;
}

export function diffSupplyOverrides(before={},after={}){
  const ids=[...new Set([...Object.keys(before||{}),...Object.keys(after||{})])].sort();
  const updates=[];
  for(const productId of ids){
    const previous=statusOf(before?.[productId]);
    const next=statusOf(after?.[productId]);
    if(previous!==next)updates.push({productId,status:next});
  }
  return updates;
}

function mergePending(current=[],updates=[]){
  const map=new Map();
  for(const item of [...current,...updates]){
    const productId=productIdOf(item);
    const status=statusOf(item);
    if(productId)map.set(productId,{productId,status});
  }
  return [...map.values()].sort((left,right)=>left.productId.localeCompare(right.productId));
}

function normalizeSession(value){
  if(!value||typeof value!=='object'||!String(value.token||'').trim())return null;
  const expiresAt=timestamp(value.expiresAt);
  if(expiresAt&&expiresAt<=Date.now())return null;
  return {
    token:String(value.token),
    staff:value.staff&&typeof value.staff==='object'?clone(value.staff):null,
    source:String(value.source||''),
    deviceId:String(value.deviceId||''),
    expiresAt
  };
}

function safeStorage(storage){return storage||globalThis.localStorage||createMemoryStorage()}
function dispatch(globalObject,name,detail){
  try{globalObject?.dispatchEvent?.(new CustomEvent(name,{detail}))}catch{}
}

export function createSupplyRuntime(options={}){
  const storage=safeStorage(options.storage);
  const fetchImpl=options.fetchImpl||globalThis.fetch?.bind(globalThis);
  const baseUrl=String(options.baseUrl||storage.getItem(OPERATIONS_API_BASE_STORAGE_KEY)||DEFAULT_OPERATIONS_API_BASE).replace(/\/+$/,'');
  const source=String(options.source||'smt').toLowerCase()==='smm'?'smm':'smt';
  const deviceId=String(options.deviceId||`${source}-unknown`);
  const globalObject=options.globalObject||globalThis;
  let session=normalizeSession(parse(storage.getItem(STAFF_SESSION_STORAGE_KEY)));
  let overrides=normalizeSupplyOverrides(parse(storage.getItem(SUPPLY_STORAGE_KEY))||{});
  let pending=mergePending([],parse(storage.getItem(SUPPLY_PENDING_STORAGE_KEY))||[]);
  let state={status:session?'idle':'session-required',connected:false,lastError:null,lastSyncAt:null};
  let internalWriteDepth=0;
  let pollTimer=null;

  function internalWrite(key,value){
    internalWriteDepth+=1;
    try{
      if(value===null)storage.removeItem(key);else storage.setItem(key,JSON.stringify(value));
    }finally{internalWriteDepth-=1}
  }
  function persistOverrides(value,{emit=false,reason='runtime'}={}){
    const previous=overrides;
    overrides=normalizeSupplyOverrides(value);
    internalWrite(SUPPLY_STORAGE_KEY,overrides);
    if(emit&&JSON.stringify(previous)!==JSON.stringify(overrides))dispatch(globalObject,'morefun:supply-runtime-remote-change',{reason,overrides:clone(overrides)});
    dispatch(globalObject,'morefun:supply-runtime-state',{...state,overrides:clone(overrides),pending:clone(pending)});
    return clone(overrides);
  }
  function persistPending(value){pending=mergePending([],value);internalWrite(SUPPLY_PENDING_STORAGE_KEY,pending);return clone(pending)}
  function persistSession(value){session=normalizeSession(value);if(session)internalWrite(STAFF_SESSION_STORAGE_KEY,session);else internalWrite(STAFF_SESSION_STORAGE_KEY,null);return session}
  async function request(path,{method='GET',body,token=session?.token}={}){
    if(typeof fetchImpl!=='function')throw new Error('SUPPLY_RUNTIME_FETCH_UNAVAILABLE');
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
      let payload;try{payload=JSON.parse(text)}catch{throw new Error(`SUPPLY_RUNTIME_INVALID_JSON_${response.status}`)}
      if(!response.ok||payload?.ok!==true){const error=new Error(payload?.error||`SUPPLY_RUNTIME_HTTP_${response.status}`);error.status=response.status;throw error}
      return payload;
    }finally{if(timer)clearTimeout(timer)}
  }

  async function login({staffNumber,password}={}){
    const payload=await request('/v1/staff/login',{method:'POST',body:{staffNumber,password,deviceId,source},token:''});
    const expiresAt=Date.now()+Number(payload.expiresInSeconds||8*60*60)*1000;
    persistSession({token:payload.token,staff:payload.staff||null,source,deviceId,expiresAt});
    state={status:'connected',connected:true,lastError:null,lastSyncAt:new Date().toISOString()};
    await flushPending();
    return clone(session);
  }

  function logout(){
    persistSession(null);
    state={status:'session-required',connected:false,lastError:null,lastSyncAt:state.lastSyncAt};
    dispatch(globalObject,'morefun:supply-runtime-state',{...state,overrides:clone(overrides),pending:clone(pending)});
  }

  function captureLocalChange(before,after){
    const updates=diffSupplyOverrides(before,after);
    if(!updates.length)return clone(pending);
    overrides=normalizeSupplyOverrides(after);
    pending=mergePending(pending,updates);
    internalWrite(SUPPLY_PENDING_STORAGE_KEY,pending);
    dispatch(globalObject,'morefun:supply-runtime-state',{...state,status:session?'queued':'offline-local',overrides:clone(overrides),pending:clone(pending)});
    if(session)queueMicrotask(()=>void flushPending());
    return clone(pending);
  }

  async function flushPending(){
    if(!pending.length)return {ok:true,skipped:true,availability:clone(overrides)};
    if(!session){state={...state,status:'session-required',connected:false};return {ok:false,error:'STAFF_SESSION_REQUIRED',queued:pending.length}}
    try{
      state={...state,status:'syncing',lastError:null};
      const payload=await request('/v1/staff/availability',{method:'PATCH',body:{updates:pending}});
      persistPending([]);
      persistOverrides(payload.availability||{}, {emit:false,reason:'local-sync'});
      state={status:'connected',connected:true,lastError:null,lastSyncAt:payload.updatedAt||new Date().toISOString()};
      dispatch(globalObject,'morefun:supply-runtime-state',{...state,overrides:clone(overrides),pending:clone(pending)});
      return {ok:true,...payload};
    }catch(error){
      state={status:'offline-local',connected:false,lastError:String(error?.message||error),lastSyncAt:state.lastSyncAt};
      dispatch(globalObject,'morefun:supply-runtime-state',{...state,overrides:clone(overrides),pending:clone(pending)});
      return {ok:false,error:state.lastError,queued:pending.length};
    }
  }

  async function refresh({emit=true}={}){
    if(!session){state={...state,status:'session-required',connected:false};return {ok:false,error:'STAFF_SESSION_REQUIRED',availability:clone(overrides)}}
    try{
      const payload=await request('/v1/staff/availability');
      persistOverrides(payload.availability||{}, {emit,reason:'remote-refresh'});
      state={status:'connected',connected:true,lastError:null,lastSyncAt:payload.updatedAt||new Date().toISOString()};
      dispatch(globalObject,'morefun:supply-runtime-state',{...state,overrides:clone(overrides),pending:clone(pending)});
      return {ok:true,...payload};
    }catch(error){
      state={status:'offline-local',connected:false,lastError:String(error?.message||error),lastSyncAt:state.lastSyncAt};
      dispatch(globalObject,'morefun:supply-runtime-state',{...state,overrides:clone(overrides),pending:clone(pending)});
      return {ok:false,error:state.lastError,availability:clone(overrides)};
    }
  }

  async function boot(){
    if(session&&pending.length)await flushPending();
    if(session)await refresh({emit:false});
    else dispatch(globalObject,'morefun:supply-runtime-state',{...state,overrides:clone(overrides),pending:clone(pending)});
    return {session:clone(session),state:{...state},overrides:clone(overrides),pending:clone(pending)};
  }

  function startPolling(intervalMs=POLL_MS){
    stopPolling();
    if(!session||typeof globalObject.setInterval!=='function')return null;
    pollTimer=globalObject.setInterval(()=>void refresh({emit:true}),Math.max(5000,Number(intervalMs)||POLL_MS));
    return pollTimer;
  }
  function stopPolling(){if(pollTimer&&typeof globalObject.clearInterval==='function')globalObject.clearInterval(pollTimer);pollTimer=null}

  return Object.freeze({
    baseUrl,source,deviceId,storage,
    getSession:()=>clone(session),
    getState:()=>({...state}),
    getOverrides:()=>clone(overrides),
    getPending:()=>clone(pending),
    isInternalWrite:()=>internalWriteDepth>0,
    login,logout,captureLocalChange,flushPending,refresh,boot,startPolling,stopPolling,
    persistOverrides
  });
}

function detectSource(storage,locationObject){
  const params=new URLSearchParams(locationObject?.search||'');
  const terminal=String(storage.getItem('morefun:smt:terminal-id')||params.get('terminal')||'').toLowerCase();
  const profile=String(params.get('profile')||params.get('mode')||'').toLowerCase();
  return /smm|mobile/.test(`${terminal} ${profile}`)?'smm':'smt';
}

function installStorageCapture(runtime,globalObject){
  const StorageCtor=globalObject?.Storage;
  const local=globalObject?.localStorage;
  if(!StorageCtor?.prototype||!local||StorageCtor.prototype.__morefunSupplyCaptureInstalled)return;
  const original=StorageCtor.prototype.setItem;
  Object.defineProperty(StorageCtor.prototype,'__morefunSupplyCaptureInstalled',{value:true,configurable:true});
  StorageCtor.prototype.setItem=function(key,value){
    const watching=this===local&&String(key)===SUPPLY_STORAGE_KEY&&!runtime.isInternalWrite();
    const before=watching?normalizeSupplyOverrides(parse(this.getItem(key))||{}):null;
    const result=original.call(this,key,value);
    if(watching){
      const after=normalizeSupplyOverrides(parse(String(value))||{});
      runtime.captureLocalChange(before,after);
    }
    return result;
  };
}

function installSessionControl(runtime,globalObject){
  const documentObject=globalObject?.document;
  if(!documentObject)return;
  const style=documentObject.createElement('style');
  style.textContent=`.mf-supply-sync-button{margin-left:auto;border:1px solid #dbc8bc;border-radius:999px;padding:8px 14px;background:#fff;color:#382b24;font-weight:800}.mf-supply-sync-button[data-tone="ok"]{color:#176b35;border-color:#a8d9b8}.mf-supply-sync-button[data-tone="warn"]{color:#a45a00;border-color:#edc58a}.mf-supply-login-layer{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(34,24,18,.46)}.mf-supply-login-card{width:min(420px,calc(100vw - 32px));padding:24px;border-radius:20px;background:#fff;color:#382b24;box-shadow:0 24px 70px rgba(0,0,0,.24);font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif}.mf-supply-login-card h2{margin:0 0 8px}.mf-supply-login-card p{color:#78685d}.mf-supply-login-card label{display:grid;gap:6px;margin:12px 0;font-weight:700}.mf-supply-login-card input{min-height:44px;border:1px solid #d8c8be;border-radius:12px;padding:0 12px;font-size:16px}.mf-supply-login-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}.mf-supply-login-actions button{min-height:42px;border:0;border-radius:999px;padding:0 18px;font-weight:800}.mf-supply-login-actions .primary{background:#382b24;color:#fff}.mf-supply-login-error{color:#ad3425;font-size:13px}`;
  documentObject.head.appendChild(style);

  function label(){
    const session=runtime.getSession(),state=runtime.getState(),pending=runtime.getPending().length;
    if(!session)return {text:pending?`離線待同步 ${pending}`:'登入供應同步',tone:'warn'};
    if(state.connected)return {text:pending?`同步中 ${pending}`:'供應同步已連線',tone:'ok'};
    return {text:pending?`離線待同步 ${pending}`:'供應同步離線',tone:'warn'};
  }
  function ensureButton(){
    const host=documentObject.querySelector('.page-statusbar,.topbar');if(!host)return;
    let button=documentObject.getElementById('mf-supply-sync-button');
    if(!button){button=documentObject.createElement('button');button.id='mf-supply-sync-button';button.className='mf-supply-sync-button';button.type='button';button.addEventListener('click',openPanel);host.appendChild(button)}
    const next=label();button.textContent=next.text;button.dataset.tone=next.tone;
  }
  function closePanel(){documentObject.querySelector('.mf-supply-login-layer')?.remove()}
  function openPanel(){
    closePanel();
    const session=runtime.getSession();
    const layer=documentObject.createElement('div');layer.className='mf-supply-login-layer';
    layer.innerHTML=session?`<section class="mf-supply-login-card"><h2>供應狀態同步</h2><p>${String(session.staff?.name||session.staff?.staffNumber||'已登入')}｜${runtime.source.toUpperCase()}｜${runtime.deviceId}</p><div class="mf-supply-login-error" data-error></div><div class="mf-supply-login-actions"><button data-close>返回</button><button data-sync class="primary">立即同步</button><button data-logout>登出</button></div></section>`:`<form class="mf-supply-login-card" data-login><h2>登入供應狀態同步</h2><p>SMT／SMM 共用 Staff 帳號。斷網操作會先保存在本機，連線後再同步。</p><label>帳號<input name="staffNumber" autocomplete="username" required></label><label>密碼<input name="password" type="password" autocomplete="current-password" required></label><div class="mf-supply-login-error" data-error></div><div class="mf-supply-login-actions"><button type="button" data-close>返回</button><button class="primary" type="submit">登入並同步</button></div></form>`;
    layer.addEventListener('click',event=>{if(event.target===layer||event.target.closest('[data-close]'))closePanel()});
    layer.querySelector('[data-login]')?.addEventListener('submit',async event=>{
      event.preventDefault();const form=event.currentTarget,errorNode=form.querySelector('[data-error]'),button=form.querySelector('[type="submit"]');button.disabled=true;errorNode.textContent='';
      try{const data=new FormData(form);await runtime.login({staffNumber:data.get('staffNumber'),password:data.get('password')});await runtime.refresh({emit:false});closePanel();ensureButton();globalObject.location?.reload?.()}catch(error){errorNode.textContent=String(error?.message||error);button.disabled=false}
    });
    layer.querySelector('[data-sync]')?.addEventListener('click',async event=>{event.currentTarget.disabled=true;await runtime.flushPending();await runtime.refresh({emit:true});closePanel();ensureButton()});
    layer.querySelector('[data-logout]')?.addEventListener('click',()=>{runtime.logout();closePanel();ensureButton()});
    documentObject.body.appendChild(layer);
  }
  const observer=new MutationObserver(ensureButton);observer.observe(documentObject.body,{childList:true,subtree:true});
  globalObject.addEventListener('morefun:supply-runtime-state',ensureButton);
  ensureButton();
}

export async function bootSupplyRuntimeBridge(options={}){
  const globalObject=options.globalObject||globalThis;
  const storage=safeStorage(options.storage||globalObject.localStorage);
  const source=options.source||detectSource(storage,globalObject.location);
  const deviceId=options.deviceId||String(storage.getItem('morefun:smt:terminal-id')||`${source}-main`);
  const runtime=createSupplyRuntime({...options,globalObject,storage,source,deviceId});
  installStorageCapture(runtime,globalObject);
  await runtime.boot();
  runtime.startPolling();
  if(options.surface==='soldout')installSessionControl(runtime,globalObject);
  globalObject.MoreFunSupplyRuntime=runtime;
  globalObject.addEventListener?.('online',()=>{void runtime.flushPending().then(()=>runtime.refresh({emit:true}))});
  return runtime;
}
