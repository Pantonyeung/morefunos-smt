import {appendOfflineJournalEntry,getOfflineJournalStatus,readLatestJournalValues,compactOfflineJournal} from './offline-journal.js';
import {getStorageHealth} from './storage-health.js';
import {getOfflineSurvivalStatus} from './offline-survival.js';

function row(name,ok,detail=null){return Object.freeze({name,ok:Boolean(ok),detail});}

async function serviceWorkerCacheStatus(){
  if(!('caches' in window))return {ok:false,error:'cache_storage_unsupported'};
  const names=await caches.keys();
  const offlineNames=names.filter(name=>name.startsWith('morefun-smt-shell-'));
  if(!offlineNames.length)return {ok:false,error:'offline_shell_cache_missing',names};
  const cache=await caches.open(offlineNames.at(-1));
  const required=['./','./index.html','./app-loader.js','./shell-startup.js','./pages/order/index.html','./pages/checkout/index.html','./pages/more/index.html'];
  const matches=await Promise.all(required.map(async url=>({url,found:Boolean(await cache.match(url))})));
  return {ok:matches.every(item=>item.found),cacheName:offlineNames.at(-1),matches};
}

export async function runOfflineEnduranceSelfTest({iterations=24}={}){
  const results=[];
  const startedAt=new Date().toISOString();
  const testKey='morefun:smt:selftest:offline-journal';
  try{
    for(let index=0;index<iterations;index++)await appendOfflineJournalEntry({storageKey:testKey,value:{index,payload:'x'.repeat(128)},source:'offline-endurance-self-test'});
    const status=await getOfflineJournalStatus();
    results.push(row('journal_sustained_writes',status.count>=iterations,{count:status.count,iterations}));
    const latest=await readLatestJournalValues();
    results.push(row('journal_latest_value_recovery',latest[testKey]?.index===iterations-1,{latestIndex:latest[testKey]?.index}));
    const compacted=await compactOfflineJournal({maxEntries:3000});
    results.push(row('journal_compaction_safe',compacted.remaining>=1,compacted));

    const storage=await getStorageHealth();
    results.push(row('storage_capacity_available',storage.supported&&storage.level!=='critical',storage));
    results.push(row('storage_persistence_requested',storage.persisted===true,{persisted:storage.persisted}));

    const offline=await getOfflineSurvivalStatus();
    results.push(row('offline_package_ready',offline.ready===true,offline));
    results.push(row('service_worker_registered',offline.serviceWorker===true,{serviceWorker:offline.serviceWorker}));

    const cache=await serviceWorkerCacheStatus();
    results.push(row('cold_start_shell_cached',cache.ok,cache));
  }catch(error){results.push(row('offline_endurance_execution',false,String(error?.message||error)));}

  const passed=results.filter(item=>item.ok).length;
  const report=Object.freeze({
    ok:passed===results.length,
    passed,
    failed:results.length-passed,
    total:results.length,
    startedAt,
    finishedAt:new Date().toISOString(),
    results,
    note:'此測試驗證瀏覽器層持久化、Journal、離線資料包及冷啟動快取；實體斷電與長時間營業仍需 Android 收銀機驗收。'
  });
  window.dispatchEvent(new CustomEvent('morefun:offline-endurance-self-test',{detail:report}));
  return report;
}
