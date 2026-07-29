const DB_NAME='morefun-smt-offline-v1';
const DB_VERSION=1;
const STORE='packages';
const META_KEY='morefun:smt:offline-package-meta:v1';

function openDb(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'});
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('offline_db_open_failed'));
  });
}

async function withStore(mode,work){
  const db=await openDb();
  try{
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);
      let value;
      try{value=work(store);}catch(error){reject(error);return;}
      tx.oncomplete=()=>resolve(value);
      tx.onerror=()=>reject(tx.error||new Error('offline_db_transaction_failed'));
      tx.onabort=()=>reject(tx.error||new Error('offline_db_transaction_aborted'));
    });
  }finally{db.close();}
}

function stableStringify(value){
  if(value===null||typeof value!=='object')return JSON.stringify(value);
  if(Array.isArray(value))return '['+value.map(stableStringify).join(',')+']';
  return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+stableStringify(value[key])).join(',')+'}';
}

function checksum(value){
  const text=stableStringify(value);let hash=2166136261;
  for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);}
  return (hash>>>0).toString(16).padStart(8,'0');
}

function readMeta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'null');}catch{return null;}}
function writeMeta(value){localStorage.setItem(META_KEY,JSON.stringify(value));}

export function validateOfflinePackage(input){
  const errors=[];
  if(!input||typeof input!=='object')errors.push('package_required');
  if(!input?.schemaVersion)errors.push('schema_version_required');
  if(!input?.data||typeof input.data!=='object')errors.push('package_data_required');
  const calculated=input?.data?checksum(input.data):'';
  if(input?.checksum&&input.checksum!==calculated)errors.push('package_checksum_invalid');
  return {ok:errors.length===0,errors,checksum:calculated};
}

export async function saveOfflinePackage(payload,{source='local',revision=0}={}){
  const data=payload&&typeof payload==='object'?payload:{};
  const packageChecksum=checksum(data);
  const id=`offline-${Date.now()}-${packageChecksum}`;
  const row={id,schemaVersion:'morefun-smt-offline-v1',revision:Number(revision||0),source,createdAt:new Date().toISOString(),checksum:packageChecksum,status:'ready',data};
  const validation=validateOfflinePackage(row);
  if(!validation.ok)throw new Error(validation.errors.join(';'));
  await withStore('readwrite',store=>store.put(row));
  const previous=readMeta()?.activeId||null;
  writeMeta({activeId:id,previousId:previous,revision:row.revision,checksum:row.checksum,createdAt:row.createdAt,source});
  window.dispatchEvent(new CustomEvent('morefun:offline-package-saved',{detail:{id,revision:row.revision,source}}));
  return row;
}

export async function readOfflinePackage(id=readMeta()?.activeId){
  if(!id)return null;
  const db=await openDb();
  try{return await new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).get(id);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error);});}
  finally{db.close();}
}

export async function readLastKnownGoodPackage(){
  const meta=readMeta();
  const active=await readOfflinePackage(meta?.activeId);
  if(active&&validateOfflinePackage(active).ok)return active;
  const previous=await readOfflinePackage(meta?.previousId);
  return previous&&validateOfflinePackage(previous).ok?previous:null;
}

export async function getOfflinePackageStatus(){
  const meta=readMeta(),row=await readLastKnownGoodPackage();
  return Object.freeze({ready:Boolean(row),activeId:row?.id||null,revision:Number(row?.revision||0),createdAt:row?.createdAt||null,source:row?.source||meta?.source||'none',checksum:row?.checksum||null});
}

export async function pruneOfflinePackages({keep=3}={}){
  const db=await openDb();
  try{
    const rows=await new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).getAll();request.onsuccess=()=>resolve(request.result||[]);request.onerror=()=>reject(request.error);});
    const remove=rows.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(Math.max(1,keep));
    if(remove.length)await withStore('readwrite',store=>remove.forEach(row=>store.delete(row.id)));
    return remove.length;
  }finally{db.close();}
}
