import {createViewportFitter} from './shared/runtime.js';
const stage=document.getElementById('stage');const frame=document.getElementById('page');const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html'};let current='';createViewportFitter(stage,{width:1920,height:1080});
function route(){const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}
function load(){const key=route();if(key===current)return;current=key;frame.src=`${routes[key]}?build=v16`;}
addEventListener('hashchange',load);addEventListener('message',event=>{if(event.source!==frame.contentWindow)return;if(event.data?.type==='morefun:navigate'){location.hash=`#/${event.data.route}`;}if(event.data?.type==='morefun:page-runtime-error')console.error(event.data);});load();
