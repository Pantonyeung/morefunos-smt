import {getRuntimeSnapshot,reserveOrderNumber,subscribeRuntime} from '../shared/unified-runtime.js';
const app=document.getElementById('app');
const AUTH='morefun.smm.preview.auth';
let tab='dashboard';
let authed=localStorage.getItem(AUTH)==='1';
const demoOrders=[{id:'A512',source:'磨飯 App',detail:'已付款待核對｜5件｜$168'},{id:'W331',source:'網頁',detail:'PayMe 待核對｜3件｜$62'},{id:'T6631',source:'WhatsApp',detail:'等候付款證明｜1件｜$59'}];
const demoPrints=[{id:'P1007',label:'A512｜收據＋後廚＋標籤',status:'待 SMT 打印'},{id:'P1006',label:'W331｜標籤',status:'已完成'}];
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(){
  if(!authed){renderLogin();return;}
  const runtime=getRuntimeSnapshot();
  app.innerHTML=`<header class="top"><h1>磨飯 SMM</h1><p>手機營運端｜同一網址｜最近流水：${esc(runtime.lastOrderId||'未建立')}</p></header>${body(runtime)}${nav()}`;
}
function body(runtime){
  if(tab==='dashboard')return `<section class="card"><strong>今日狀態</strong><div class="status-grid"><span class="stat"><small>待處理</small><b>3</b></span><span class="stat"><small>待打印</small><b>1</b></span><span class="stat"><small>售罄</small><b>0</b></span><span class="stat"><small>流水</small><b>${esc(runtime.lastOrderId||'—')}</b></span></div><div class="actions"><button class="primary" data-action="reserve">測試建立流水</button><button data-tab="orders">睇訂單</button><button data-tab="print">列印任務</button></div></section><section class="card"><strong>入口區分</strong><p>SMT 真機頁負責主 POS 及打印 host；SMM 手機端負責管理、查看、下達任務。兩邊放喺同一 origin，之後接同一流水號權威。</p></section>`;
  if(tab==='orders')return `<section class="card"><strong>訂單處理</strong><div class="list">${demoOrders.map(o=>`<article class="row"><span><strong>${esc(o.id)}｜${esc(o.source)}</strong><small>${esc(o.detail)}</small></span><b class="pill">查看</b></article>`).join('')}</div></section>`;
  if(tab==='soldout')return `<section class="card"><strong>售罄管理</strong><div class="actions"><button>紫米專用售罄</button><button>飯團暫停</button><button>飲品恢復</button><button>每日重設檢查</button></div></section>`;
  if(tab==='print')return `<section class="card"><strong>列印任務</strong><div class="list">${demoPrints.map(p=>`<article class="row"><span><strong>${esc(p.id)}</strong><small>${esc(p.label)}</small></span><b class="pill">${esc(p.status)}</b></article>`).join('')}</div><p>手機端只建立／重試／取消 print job；實際打印由 SMT Android host 執行。</p></section>`;
  return `<section class="card"><strong>更多</strong><div class="actions"><button>同步狀態</button><button>日結</button><button>報表</button><button data-action="logout">登出</button></div></section>`;
}
function nav(){return `<nav class="nav"><button class="${tab==='dashboard'?'active':''}" data-tab="dashboard">首頁</button><button class="${tab==='orders'?'active':''}" data-tab="orders">訂單</button><button class="${tab==='soldout'?'active':''}" data-tab="soldout">售罄</button><button class="${tab==='print'?'active':''}" data-tab="print">列印</button><button class="${tab==='more'?'active':''}" data-tab="more">更多</button></nav>`;}
function renderLogin(){app.className='login';app.innerHTML=`<section class="card"><h1>磨飯 SMM</h1><p>開發預覽登入。正式版需接 Staff Session，不提交密碼或 secret。</p><input id="u" autocomplete="username" placeholder="帳號"><input id="p" autocomplete="current-password" type="password" placeholder="密碼"><button data-action="login">登入預覽</button></section>`;}
app.addEventListener('click',e=>{const node=e.target.closest('[data-action],[data-tab]');if(!node)return;if(node.dataset.tab){tab=node.dataset.tab;app.className='smm-app';render();return;}if(node.dataset.action==='login'){localStorage.setItem(AUTH,'1');authed=true;app.className='smm-app';render();}else if(node.dataset.action==='logout'){localStorage.removeItem(AUTH);authed=false;render();}else if(node.dataset.action==='reserve'){reserveOrderNumber();render();}});
subscribeRuntime(()=>{if(authed)render();});
render();
