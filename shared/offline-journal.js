const DB_NAME='morefun-smt-offline-journal-v1';
const DB_VERSION=1;
const STORE='entries';
const META='meta';
const MAX_ENTRIES=3000;
const DURABLE_RECOVERY_KEYS=new Set([
  'morefun:smt:v16c:settings',
  'morefun:smt:v16:orders',
  'morefun:smt:v1:operations',
  'morefun:smt:v1:printers',
  'morefun:smt:v1:supply-overrides'
]);

function openDb(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE)){
        const store=db.createObjectStore(STORE,{keyPath:'id',autoIncrement:true});
        store.createIndex('createdAt','createdAt');
        store.createIndex('storageKey','storageKey');
      }
      if(!db.objectStoreNames.contains(META))db.createObjectStore(META,{keyPath:'key'});
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('offline_journal_open_failed'));
  });
}

function txDone(tx){return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('offline_journal_transaction_aborted'));});}
function requestResult(request){return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}

export async function appendOfflineJournalEntry({storageKey,value,source='web',businessDate=null,terminalId=null}={}){
  if(!storageKey)throw new Error('offline_journal_storage_key_required');
  const db=await openDb();
  const tx=db.transaction([STORE,META],'readwrite');
  const entry={storageKey:String(storageKey),value,source:String(source),businessDate:businessDate||null,terminalId:terminalId||null,createdAt:Date.now()};
  const idPromise=requestResult(tx.objectStore(STORE).add(entry));
  tx.objectStore(META).put({key:'lastWriteAt',value:entry.createdAt});
  const [id]=await Promise.all([idPromise,txDone(tx)]);
  window.dispatchEvent(new CustomEvent('morefun:offline-journal-changed',{detail:{id,storageKey:entry.storageKey}}));
  void compactOfflineJournal();
  return {...entry,id};
}

export async function getOfflineJournalStatus(){
  const db=await openDb();
  const tx=db.transaction([STORE,META],'readonly');
  const countPromise=requestResult(tx.objectStore(STORE).count());
  const lastPromise=requestResult(tx.objectStore(META).get('lastWriteAt'));
  const [count,last]=await Promise.all([countPromise,lastPromise,txDone(tx)]);
  return Object.freeze({count:Number(count||0),lastWriteAt:last?.value||null,ready:true});
}

export async function readLatestJournalValues(){
  const db=await openDb();
  const tx=db.transaction(STORE,'readonly');
  const rows=await Promise.all([requestResult(tx.objectStore(STORE).getAll()),txDone(tx)]).then(([value])=>value||[]);
  const latest=new Map();
  for(const entry of rows){const previous=latest.get(entry.storageKey);if(!previous||Number(entry.createdAt)>=Number(previous.createdAt))latest.set(entry.storageKey,entry);}
  return Object.fromEntries([...latest.entries()].map(([key,entry])=>[key,entry.value]));
}

export async function recoverDurableStorageFromJournal(){
  const latest=await readLatestJournalValues();
  const restored=[];
  for(const key of DURABLE_RECOVERY_KEYS){
    if(localStorage.getItem(key)!==null||!Object.hasOwn(latest,key)||latest[key]===null)continue;
    try{localStorage.setItem(key,JSON.stringify(latest[key]));restored.push(key);}catch(error){return {ok:false,restored,error:String(error?.message||error)};}
  }
  if(restored.length)window.dispatchEvent(new CustomEvent('morefun:offline-journal-recovered',{detail:{restored}}));
  return {ok:true,restored,count:restored.length};
}

export async function compactOfflineJournal({maxEntries=MAX_ENTRIES}={}){
  const db=await openDb();
  const readTx=db.transaction(STORE,'readonly');
  const rows=await Promise.all([requestResult(readTx.objectStore(STORE).getAll()),txDone(readTx)]).then(([value])=>(value||[]).sort((a,b)=>Number(a.id)-Number(b.id)));
  if(rows.length<=maxEntries)return {removed:0,remaining:rows.length};
  const latestByKey=new Map();
  rows.forEach(row=>latestByKey.set(row.storageKey,row.id));
  const protectedIds=new Set(latestByKey.values());
  const removable=rows.filter(row=>!protectedIds.has(row.id)).slice(0,rows.length-maxEntries);
  if(!removable.length)return {removed:0,remaining:rows.length};
  const writeTx=db.transaction(STORE,'readwrite');
  removable.forEach(row=>writeTx.objectStore(STORE).delete(row.id));
  await txDone(writeTx);
  return {removed:removable.length,remaining:rows.length-removable.length};
}

export async function exportOfflineJournal(){
  const db=await openDb();
  const tx=db.transaction(STORE,'readonly');
  const entries=await Promise.all([requestResult(tx.objectStore(STORE).getAll()),txDone(tx)]).then(([value])=>value||[]);
  return {schemaVersion:'offline-journal-v1',exportedAt:new Date().toISOString(),entries};
}
