const listeners=new Set();
let state={phase:'idle',startedAt:0,readyAt:0,error:null,session:null};
let runtimePromise=null;

function publish(next){
  state=Object.freeze({...state,...next});
  for(const listener of listeners){
    try{listener(state);}catch(error){console.warn('BOOTSTRAP_LISTENER_FAILED',error);}
  }
  window.dispatchEvent(new CustomEvent('morefun:bootstrap-state',{detail:state}));
  return state;
}

export function getBootstrapState(){return state;}

export function subscribeBootstrap(listener){
  if(typeof listener!=='function')return()=>{};
  listeners.add(listener);
  listener(state);
  return()=>listeners.delete(listener);
}

export async function startBootstrap({session,loadRuntime}={}){
  if(runtimePromise)return runtimePromise;
  if(!session?.username)throw new Error('BOOTSTRAP_SESSION_REQUIRED');
  if(typeof loadRuntime!=='function')throw new Error('BOOTSTRAP_RUNTIME_LOADER_REQUIRED');

  runtimePromise=(async()=>{
    publish({phase:'starting',startedAt:Date.now(),readyAt:0,error:null,session});
    try{
      await loadRuntime();
      publish({phase:'ready',readyAt:Date.now(),error:null,session});
      return state;
    }catch(error){
      runtimePromise=null;
      publish({phase:'failed',error:{code:'RUNTIME_START_FAILED',message:String(error?.message||error)},session});
      throw error;
    }
  })();

  return runtimePromise;
}

export function resetBootstrap(){
  runtimePromise=null;
  publish({phase:'idle',startedAt:0,readyAt:0,error:null,session:null});
}
