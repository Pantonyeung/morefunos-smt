const SNAPSHOT_KEY='morefun:smt:runtime-snapshot:v1';

function clone(value){
  if(value===undefined)return null;
  try{return structuredClone(value);}catch{return JSON.parse(JSON.stringify(value));}
}

export function readRuntimeSnapshot(){
  try{
    const raw=localStorage.getItem(SNAPSHOT_KEY);
    if(!raw)return null;
    const parsed=JSON.parse(raw);
    if(!parsed||typeof parsed!=='object')return null;
    return Object.freeze({...parsed,snapshot:clone(parsed.snapshot)});
  }catch(error){
    console.warn('RUNTIME_SNAPSHOT_READ_FAILED',error);
    return null;
  }
}

export function applyRuntimeSnapshot(snapshot,{revision=null,source='remote'}={}){
  if(snapshot===undefined||snapshot===null)throw new Error('runtime_snapshot_empty');
  const previous=readRuntimeSnapshot();
  const record={
    revision:revision||snapshot.revision||snapshot.version||null,
    snapshot:clone(snapshot),
    source,
    updatedAt:new Date().toISOString()
  };
  try{
    localStorage.setItem(SNAPSHOT_KEY,JSON.stringify(record));
  }catch(error){
    const wrapped=new Error('runtime_snapshot_persist_failed');
    wrapped.cause=error;
    throw wrapped;
  }
  const detail=Object.freeze({...record,previousRevision:previous?.revision||null});
  window.dispatchEvent(new CustomEvent('morefun:runtime-snapshot',{detail}));
  return detail;
}

export function clearRuntimeSnapshot(){
  localStorage.removeItem(SNAPSHOT_KEY);
  window.dispatchEvent(new CustomEvent('morefun:runtime-snapshot-cleared'));
}