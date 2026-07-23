const RUNTIME_KEY='morefun.os.unified.runtime.v1';
const CHANNEL='morefun-os-unified-runtime';
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel(CHANNEL):null;
function readRuntime(){
  try{return {...defaults(),...(JSON.parse(localStorage.getItem(RUNTIME_KEY)||'{}')||{})};}
  catch{return defaults();}
}
function defaults(){return{businessDate:new Date().toISOString().slice(0,10),orderSeq:1000,lastOrderId:'',updatedAt:0,source:'local-preview'};}
function writeRuntime(next){
  const value={...defaults(),...next,updatedAt:Date.now()};
  localStorage.setItem(RUNTIME_KEY,JSON.stringify(value));
  channel?.postMessage({type:'runtime:update',value});
  window.dispatchEvent(new CustomEvent('morefun-runtime-update',{detail:value}));
  return value;
}
export function getRuntimeSnapshot(){return readRuntime();}
export function reserveOrderNumber(prefix='MF'){
  const state=readRuntime();
  const nextSeq=Math.max(1000,Number(state.orderSeq)||1000)+1;
  const orderId=prefix+String(nextSeq).padStart(4,'0');
  return writeRuntime({...state,orderSeq:nextSeq,lastOrderId:orderId,source:'shared-runtime-preview'});
}
export function subscribeRuntime(callback){
  const handler=event=>callback(event.detail||readRuntime());
  window.addEventListener('morefun-runtime-update',handler);
  if(channel)channel.onmessage=event=>{if(event.data?.type==='runtime:update')callback(event.data.value);};
  return()=>window.removeEventListener('morefun-runtime-update',handler);
}
window.MoreFunUnifiedRuntime={getRuntimeSnapshot,reserveOrderNumber};
