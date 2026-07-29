import {readRuntimeSnapshot} from './runtime-snapshot-store.js';
import {saveOfflinePackage,readLastKnownGoodPackage,getOfflinePackageStatus,pruneOfflinePackages} from './offline-package-store.js';

const REQUIRED_SECTIONS=Object.freeze(['catalog','categories','optionGroups','combos','pricing','runtime','printing','settings']);

function cloneJson(value){return JSON.parse(JSON.stringify(value??null));}
function localJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}}

export function buildLocalOfflinePackage(){
  const runtime=readRuntimeSnapshot()?.snapshot||{};
  const settings=localJson('morefun:smt:settings',{});
  const order=localJson('morefun:smt:order',{});
  const printers=localJson('morefun:smt:printers',{});
  const data={
    catalog:cloneJson(order.catalog||settings.catalog||{}),
    categories:cloneJson(order.categories||settings.categories||[]),
    optionGroups:cloneJson(order.optionGroups||settings.optionGroups||[]),
    combos:cloneJson(order.combos||settings.combos||[]),
    pricing:cloneJson(order.pricing||settings.pricing||{}),
    runtime:cloneJson(runtime),
    printing:cloneJson(printers),
    settings:cloneJson(settings),
    terminal:{capturedAt:new Date().toISOString(),userAgent:navigator.userAgent}
  };
  return data;
}

export function validateOfflineData(data){
  const errors=[];
  if(!data||typeof data!=='object')errors.push('offline_data_required');
  for(const section of REQUIRED_SECTIONS){if(!(section in (data||{})))errors.push(`offline_section_missing:${section}`);}
  return {ok:errors.length===0,errors};
}

export async function refreshOfflinePackage({adapter=null,force=false}={}){
  const current=await getOfflinePackageStatus();
  let data=null,source='local',revision=Number(current.revision||0);
  if(adapter&&typeof adapter.downloadFullPackage==='function'&&navigator.onLine){
    const result=await adapter.downloadFullPackage({currentRevision:revision,force});
    if(result?.ok&&result.data){data=result.data;source=adapter.mode||'remote';revision=Number(result.revision??result.dataRevision??revision+1);}
    else if(result&&!result.ok&&!current.ready)throw new Error(result.error||'offline_package_download_failed');
  }
  if(!data)data=buildLocalOfflinePackage();
  const validation=validateOfflineData(data);
  if(!validation.ok)throw new Error(validation.errors.join(';'));
  const saved=await saveOfflinePackage(data,{source,revision});
  await pruneOfflinePackages({keep:3});
  return saved;
}

export async function ensureOfflineSurvival(options={}){
  const existing=await readLastKnownGoodPackage();
  if(existing&&!navigator.onLine)return {ok:true,mode:'offline',package:existing};
  try{
    const saved=await refreshOfflinePackage(options);
    return {ok:true,mode:navigator.onLine?'online':'offline',package:saved};
  }catch(error){
    const fallback=await readLastKnownGoodPackage();
    if(fallback)return {ok:true,mode:'fallback',warning:String(error?.message||error),package:fallback};
    return {ok:false,error:String(error?.message||error),package:null};
  }
}

export async function registerOfflineServiceWorker(){
  if(!('serviceWorker' in navigator))return {ok:false,error:'service_worker_unsupported'};
  try{const registration=await navigator.serviceWorker.register('./service-worker.js',{scope:'./'});return {ok:true,registration};}
  catch(error){return {ok:false,error:String(error?.message||error)};}
}

export async function getOfflineSurvivalStatus(){
  const packageStatus=await getOfflinePackageStatus();
  const registration='serviceWorker' in navigator?await navigator.serviceWorker.getRegistration('./').catch(()=>null):null;
  return Object.freeze({...packageStatus,online:navigator.onLine,serviceWorker:Boolean(registration),longRunReady:Boolean(packageStatus.ready&&registration)});
}
