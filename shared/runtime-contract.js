export const RUNTIME_SCHEMA_VERSION='smt-runtime-v1';
export const RUNTIME_STATUSES=Object.freeze(['open','paused','closed']);

export function normalizeRuntimePayload(input={}){
  const payload=input&&typeof input==='object'?input:{};
  const waitMinutes=Number(payload.waitMinutes??0);
  const runtimeVersion=Number(payload.runtimeVersion??0);
  return Object.freeze({
    schemaVersion:String(payload.schemaVersion||RUNTIME_SCHEMA_VERSION),
    storeStatus:String(payload.storeStatus||'open'),
    waitMinutes:Number.isFinite(waitMinutes)&&waitMinutes>=0?waitMinutes:0,
    holidays:Array.isArray(payload.holidays)?payload.holidays:[],
    holidayNoticeDays:Number.isFinite(Number(payload.holidayNoticeDays))?Number(payload.holidayNoticeDays):0,
    availability:payload.availability&&typeof payload.availability==='object'?payload.availability:{},
    soldoutPolicy:payload.soldoutPolicy&&typeof payload.soldoutPolicy==='object'?payload.soldoutPolicy:{},
    runtimeVersion:Number.isFinite(runtimeVersion)&&runtimeVersion>=0?runtimeVersion:0,
    source:String(payload.source||'smt-local'),
    updatedAt:String(payload.updatedAt||new Date().toISOString())
  });
}

export function validateRuntimePayload(input){
  const errors=[];
  if(!input||typeof input!=='object')errors.push('runtime_payload_required');
  const payload=normalizeRuntimePayload(input);
  if(!RUNTIME_STATUSES.includes(payload.storeStatus))errors.push('store_status_invalid');
  return Object.freeze({ok:errors.length===0,errors,payload});
}

export function makeRuntimePatch(current,patch,{source='smt'}={}){
  const base=normalizeRuntimePayload(current);
  return normalizeRuntimePayload({
    ...base,
    ...(patch&&typeof patch==='object'?patch:{}),
    runtimeVersion:base.runtimeVersion+1,
    source,
    updatedAt:new Date().toISOString()
  });
}
