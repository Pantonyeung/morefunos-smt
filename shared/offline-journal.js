const DB_NAME='morefun-smt-offline-journal-v1';
const DB_VERSION=1;
const STORE='entries';
const META='meta';
const MAX_ENTRIES=3000;

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

export async function appendOfflineJournalEntry({storageKey,value,source='web',businessDate=null,terminalId=null}={}){
  if(!storageKey)throw new Error('offline_journal_storage_key_required');
  const db=await openDb();
  const tx=db.transaction([STORE,META],'readwrite');
  const entry={storageKey:String(storageKey),value,source:String(source),businessDate:businessDate||null,terminalId:terminalId||null,createdAt:Date.now(),synced:false};
  const idRequest=tx.objectStore(STORE).add(entry);
  tx.objectStore(META).put({key:'lastWriteAt',value:entry.createdAt});
  await txDone(tx);
  const id=await new Promise((resolve,reject)=>{idRequest.onsuccess=()=>resolve(idRequest.result);idRequest.onerror=()=>reject(idRequest.error);});
  window.dispatchEvent(new CustomEvent('morefun:offline-journal-changed',{detail:{id,storageKey:entry.storageKey}}));
  void compactOfflineJournal();
  return {...entry,id};
}

export async function getOfflineJournalStatus(){
  const db=await openDb();
  const tx=db.transaction([STORE,META],'readonly');
  const countRequest=tx.objectStore(STORE).count();
  const lastRequest=tx.objectStore(META).get('lastWriteAt');
  await txDone(tx);
  const [count,last]=await Promise.all([
    Promise.resolve(countRequest.result),
    Promise.resolve(lastRequest.result)
  ]);
  return Object.freeze({count:Number(count||0),lastWriteAt:last?.value||null,ready:true});
}

export async function readLatestJournalValues(){
  const db=await openDb();
  const tx=db.transaction(STORE,'readonly');
  const request=tx.objectStore(STORE).getAll();
  await txDone(tx);
  const latest=new Map();
  for(const entry of request.result||[]){const previous=latest.get(entry.storageKey);if(!previous||Number(entry.createdAt)>=Number(previous.createdAt))latest.set(entry.storageKey,entry);}
  return Object.fromEntries([...latest.entries()].map(([key,entry])=>[key,entry.value]));
}

export async function markJournalSynced(ids=[]){
  if(!ids.length)return 0;
  const db=await openDb();
  const tx=db.transaction(STORE,'readwrite');
  const store=tx.objectStore(STORE);
  let updated=0;
  for(const id of ids){const request=store.get(id);request.onsuccess=()=>{if(!request.result)return;store.put({...request.result,synced:true,syncedAt:Date.now()});updated++;};}
  await txDone(tx);
  return updated;
}

export async function compactOfflineJournal({maxEntries=MAX_ENTRIES}={}){
  const db=await openDb();
  const readTx=db.transaction(STORE,'readonly');
  const request=readTx.objectStore(STORE).getAll();
  await txDone(readTx);
  const rows=(request.result||[]).sort((a,b)=>Number(a.id)-Number(b.id));
  if(rows.length<=maxEntries)return {removed:0,remaining:rows.length};
  const latestByKey=new Map();
  rows.forEach(row=>latestByKey.set(row.storageKey,row.id));
  const protectedIds=new Set(latestByKey.values());
  const removable=rows.filter(row=>!protectedIds.has(row.id)&&row.synced!==false).slice(0,rows.length-maxEntries);
  if(!removable.length)return {removed:0,remaining:rows.length};
  const writeTx=db.transaction(STORE,'readwrite');
  removable.forEach(row=>writeTx.objectStore(STORE).delete(row.id));
  await txDone(writeTx);
  return {removed:removable.length,remaining:rows.length-removable.length};
}

export async function exportOfflineJournal(){
  const db=await openDb();
  const tx=db.transaction(STORE,'readonly');
  const request=tx.objectStore(STORE).getAll();
  await txDone(tx);
  return {schemaVersion:'offline-journal-v1',exportedAt:new Date().toISOString(),entries:request.result||[]};
}
