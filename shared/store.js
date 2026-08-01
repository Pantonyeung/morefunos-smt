export const ORDER_STORAGE_KEY='morefun:smt:v16:order';
export const SETTINGS_STORAGE_KEY='morefun:smt:v16c:settings';
export const DRAFT_STORAGE_KEY='morefun:smt:v16:drafts';
export const DRAFT_COUNTER_STORAGE_KEY='morefun:smt:v16:draft-counters';
export const ORDER_HISTORY_STORAGE_KEY='morefun:smt:v16:orders';
export const TERMINAL_ID_STORAGE_KEY='morefun:smt:terminal-id';
export const DINE_STORAGE_KEY='morefun-smt-dine-v2';
export const SUPPLY_STORAGE_KEY='morefun:smt:v1:supply-overrides';
export const OPERATIONS_STORAGE_KEY='morefun:smt:v1:operations';
export const PRINTER_STORAGE_KEY='morefun:smt:v1:printers';
export const BACKUP_STORAGE_KEY='morefun:smt:v1:backups';

const JOURNALED_KEYS=new Set([
  ORDER_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  DRAFT_STORAGE_KEY,
  DRAFT_COUNTER_STORAGE_KEY,
  ORDER_HISTORY_STORAGE_KEY,
  DINE_STORAGE_KEY,
  SUPPLY_STORAGE_KEY,
  OPERATIONS_STORAGE_KEY,
  PRINTER_STORAGE_KEY
]);

const liveDomainObjects=new Map();
const parseJSON=(text,fallback)=>{try{return JSON.parse(text||'null')??fallback;}catch{return fallback;}};
const isObject=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
const cloneObject=value=>isObject(value)?JSON.parse(JSON.stringify(value)):{};

function replaceObjectContents(target,value){
  const snapshot=cloneObject(value);
  Object.keys(target).forEach(key=>delete target[key]);
  Object.entries(snapshot).forEach(([key,row])=>{target[key]=row;});
  return target;
}

function dispatchDomainStateChanged(key,value,source){
  try{
    window.dispatchEvent(new CustomEvent('morefun:domain-state-changed',{detail:{key,domain:key===SUPPLY_STORAGE_KEY?'supply':'storage',value,source,at:Date.now()}}));
  }catch(_error){}
}

function readLiveDomainObject(key,fallback){
  if(!liveDomainObjects.has(key))liveDomainObjects.set(key,{});
  const target=liveDomainObjects.get(key);
  const current=parseJSON(localStorage.getItem(key),fallback);
  return replaceObjectContents(target,current);
}

function syncSupplyWithRuntime(snapshot){
  let runtime=null;
  try{runtime=window.top?.MoreFunStartup?.supplyRuntime||window.MoreFunStartup?.supplyRuntime||null;}catch(_error){}
  if(!runtime?.captureLocalSnapshot)return;
  const result=runtime.captureLocalSnapshot(snapshot);
  if(!result?.updates?.length)return;
  Promise.resolve(runtime.flushPending?.()).then(sync=>{
    try{window.dispatchEvent(new CustomEvent('morefun:supply-write-result',{detail:sync||{ok:false,error:'SUPPLY_SYNC_NO_RESULT'}}));}catch(_error){}
  }).catch(error=>{
    try{window.dispatchEvent(new CustomEvent('morefun:supply-write-result',{detail:{ok:false,error:String(error?.message||error)}}));}catch(_ignored){}
  });
}

export function readJSON(key,fallback){
  if(key===SUPPLY_STORAGE_KEY)return readLiveDomainObject(key,fallback||{});
  return parseJSON(localStorage.getItem(key),fallback);
}

export function writeJSON(key,value){
  const snapshot=key===SUPPLY_STORAGE_KEY?cloneObject(value):value;
  localStorage.setItem(key,JSON.stringify(snapshot));
  let publishedValue=snapshot;
  if(key===SUPPLY_STORAGE_KEY){
    const target=liveDomainObjects.get(key);
    if(target)publishedValue=replaceObjectContents(target,snapshot);
    dispatchDomainStateChanged(key,publishedValue,'local-write');
    syncSupplyWithRuntime(snapshot);
  }
  if(JOURNALED_KEYS.has(key)){
    const message={type:'morefun:critical-storage-written',storageKey:key,value:snapshot,createdAt:Date.now(),runtimeCaptured:key===SUPPLY_STORAGE_KEY};
    try{window.top?.postMessage(message,location.origin);}catch(_error){try{window.postMessage(message,location.origin);}catch(_ignored){}}
  }
}

if(typeof window!=='undefined'){
  window.addEventListener('storage',event=>{
    if(event.key!==SUPPLY_STORAGE_KEY)return;
    const next=parseJSON(event.newValue,{});
    const target=liveDomainObjects.get(SUPPLY_STORAGE_KEY)||{};
    if(!liveDomainObjects.has(SUPPLY_STORAGE_KEY))liveDomainObjects.set(SUPPLY_STORAGE_KEY,target);
    replaceObjectContents(target,next);
    dispatchDomainStateChanged(SUPPLY_STORAGE_KEY,target,'cross-context-storage');
  });
}

export function stableId(prefix='id'){return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;}
