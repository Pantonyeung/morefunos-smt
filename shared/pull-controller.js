import {getHealthState} from './health-state.js';

const listeners=new Set();
let state=Object.freeze({status:'idle',lastPulledAt:null,lastVersion:null,lastError:null,inFlight:false});
let activePromise=null;

function emit(patch={}){
  state=Object.freeze({...state,...patch});
  for(const listener of listeners){
    try{listener(state);}catch(error){console.error('PULL_LISTENER_FAILED',error);}
  }
  window.dispatchEvent(new CustomEvent('morefun:pull-change',{detail:state}));
  return state;
}

export function getPullState(){return state;}

export function subscribePull(listener,{emitCurrent=true}={}){
  if(typeof listener!=='function')throw new TypeError('listener must be a function');
  listeners.add(listener);
  if(emitCurrent)listener(state);
  return()=>listeners.delete(listener);
}

export async function runPull({fetcher,apply,force=false}={}){
  if(activePromise)return activePromise;
  if(typeof fetcher!=='function')throw new TypeError('fetcher must be a function');
  if(typeof apply!=='function')throw new TypeError('apply must be a function');
  if(!force&&getHealthState().status==='offline'){
    return emit({status:'skipped_offline',lastError:'offline',inFlight:false});
  }

  activePromise=(async()=>{
    emit({status:'pulling',lastError:null,inFlight:true});
    try{
      const payload=await fetcher({sinceVersion:state.lastVersion});
      if(!payload||typeof payload!=='object')throw new Error('invalid_pull_payload');
      const version=payload.version??payload.revision??null;
      if(version!==null&&String(version)===String(state.lastVersion)){
        return emit({status:'unchanged',lastPulledAt:new Date().toISOString(),inFlight:false});
      }
      await apply(payload);
      return emit({status:'applied',lastPulledAt:new Date().toISOString(),lastVersion:version,lastError:null,inFlight:false});
    }catch(error){
      return emit({status:'failed',lastError:String(error?.message||error||'pull_failed'),inFlight:false});
    }finally{
      activePromise=null;
    }
  })();

  return activePromise;
}

export function resetPullState(){
  activePromise=null;
  return emit({status:'idle',lastPulledAt:null,lastVersion:null,lastError:null,inFlight:false});
}
