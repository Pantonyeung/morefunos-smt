import {createViewportFitter} from './shared/runtime.js?v=16d';
const stage=document.getElementById('stage');
const frame=document.getElementById('page');
const routes={order:'pages/order/index.html',checkout:'pages/checkout/index.html'};
let current='';
createViewportFitter(stage,{width:1920,height:1080});
function route(){const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];return routes[key]?key:'order';}
function showLoaderError(message){frame.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><style>body{margin:0;display:grid;place-items:center;height:100vh;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p></section></body></html>';}
function load(){const key=route();if(key===current)return;current=key;frame.src=routes[key]+'?build=v16d';}
frame.addEventListener('error',function(){showLoaderError('子頁載入失敗，資料仍保存在本機。');});
addEventListener('hashchange',load);
addEventListener('message',function(event){if(event.source!==frame.contentWindow)return;if(event.data&&event.data.type==='morefun:navigate')location.hash='#/'+event.data.route;if(event.data&&event.data.type==='morefun:page-runtime-error')console.error(event.data);});
load();
