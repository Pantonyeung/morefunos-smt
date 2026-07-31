import {bootSupplyRuntimeBridge} from './supply-runtime.js?v=g1-shared-availability-mainline-v1';

void bootSupplyRuntimeBridge({surface:'shell',source:'smt'}).then(runtime=>{
  window.__MOREFUN_SUPPLY_SHELL__=Object.freeze({
    ok:true,
    source:runtime.source,
    deviceId:runtime.deviceId,
    baseUrl:runtime.baseUrl
  });
}).catch(error=>{
  window.__MOREFUN_SUPPLY_SHELL__=Object.freeze({ok:false,error:String(error?.message||error)});
});

window.addEventListener('morefun:supply-runtime-remote-change',()=>{
  const frame=document.querySelector('.page-frame.is-active')||document.getElementById('page');
  try{frame?.contentWindow?.location?.reload?.()}catch{if(frame?.src)frame.src=frame.src}
});
