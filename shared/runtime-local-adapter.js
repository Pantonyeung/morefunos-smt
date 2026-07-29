import {normalizeRuntimePayload,makeRuntimePatch,validateRuntimePayload} from './runtime-contract.js';

const STORAGE_KEY='morefun:smt:runtime-local-adapter:v1';
const listeners=new Set();

function read(){
  try{return normalizeRuntimePayload(JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'));}
  catch{return normalizeRuntimePayload({});}
}

function write(value){
  const validation=validateRuntimePayload(value);
  if(!validation.ok)return {ok:false,error:'runtime_payload_invalid',errors:validation.errors};
  const next=validation.payload;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
  for(const listener of listeners){
    try{listener(next);}catch(error){console.error('RUNTIME_LOCAL_LISTENER_FAILED',error);}
  }
  return {ok:true,data:next};
}

export function createLocalRuntimeAdapter(){
  return Object.freeze({
    mode:'local',
    async health(){return {ok:true,mode:'local',checkedAt:new Date().toISOString()};},
    async pull(){return {ok:true,data:read()};},
    async push(patch,{expectedVersion=null,source='smt'}={}){
      const current=read();
      if(expectedVersion!==null&&Number(expectedVersion)!==current.runtimeVersion){
        return {ok:false,conflict:true,error:'runtime_version_conflict',current};
      }
      return write(makeRuntimePatch(current,patch,{source}));
    },
    subscribe(listener){
      if(typeof listener!=='function')throw new TypeError('listener must be a function');
      listeners.add(listener);
      listener(read());
      return()=>listeners.delete(listener);
    },
    reset(){
      localStorage.removeItem(STORAGE_KEY);
      return write({});
    }
  });
}
