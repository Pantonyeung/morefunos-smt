import {runPull,getPullState} from './pull-controller.js';
import {flushPushQueue,getPushQueueState} from './push-queue.js';
import {subscribeHealth} from './health-state.js';
import {startFallbackCoordinator,stopFallbackCoordinator,getFallbackState} from './fallback-coordinator.js';

let adapters={fetcher:null,apply:null,sender:null};
let unsubscribeHealth=null;
let started=false;

export function configureSyncAdapters(next={}){
  adapters={...adapters,...next};
  return getSyncState();
}

async function syncNow({force=false}={}){
  const result={pull:null,push:null};
  if(adapters.fetcher&&adapters.apply){
    result.pull=await runPull({fetcher:adapters.fetcher,apply:adapters.apply,force});
  }
  if(adapters.sender){
    result.push=await flushPushQueue({sender:adapters.sender});
  }
  window.dispatchEvent(new CustomEvent('morefun:sync-cycle',{detail:result}));
  return result;
}

export function startSyncCoordinator(){
  if(started)return stopSyncCoordinator;
  started=true;
  startFallbackCoordinator();
  unsubscribeHealth=subscribeHealth(health=>{
    if(health.status==='healthy')syncNow().catch(error=>console.error('SYNC_CYCLE_FAILED',error));
  });
  return stopSyncCoordinator;
}

export function stopSyncCoordinator(){
  started=false;
  unsubscribeHealth?.();
  unsubscribeHealth=null;
  stopFallbackCoordinator();
}

export function getSyncState(){
  return Object.freeze({started,pull:getPullState(),push:getPushQueueState(),fallback:getFallbackState(),configured:{fetcher:!!adapters.fetcher,apply:!!adapters.apply,sender:!!adapters.sender}});
}

export {syncNow};
