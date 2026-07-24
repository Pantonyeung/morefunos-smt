import {renderOrderPage} from './src/pages/order/order.js';

const workspace=document.getElementById('workspace');
const nav=[...document.querySelectorAll('.bottom-nav [data-route]')];
const networkStatus=document.getElementById('network-status');
const clockStatus=document.getElementById('clock-status');
const toast=document.getElementById('system-toast');

const routes={
  order:{render:()=>renderOrderPage(workspace)},
  orders:{title:'訂單',note:'保留完整 SMT 功能範圍；下一階段以原生 1280×800 重建。'},
  dine:{title:'堂食',note:'堂食頁將獨立擁有 layout，不載入舊縮放頁。'},
  soldout:{title:'售罄',note:'售罄頁使用同一資料模型，但頁面自己管理樣式與互動。'},
  more:{title:'更多',note:'設定、打印、日結、報表等功能會逐區重建。'}
};

function routeKey(){
  const value=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];
  return routes[value]?value:'order';
}

function renderPlaceholder(route){
  workspace.innerHTML=`<section class="route-placeholder"><article class="route-card"><h1>${route.title}</h1><p>${route.note}</p></article></section>`;
}

function render(){
  const key=routeKey();
  const route=routes[key];
  nav.forEach(button=>button.setAttribute('aria-current',button.dataset.route===key?'page':'false'));
  if(route.render)route.render();else renderPlaceholder(route);
}

function showToast(message){
  if(!toast)return;
  toast.textContent=message;
  toast.hidden=false;
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>{toast.hidden=true},1800);
}

function updateNetwork(){
  const online=navigator.onLine;
  networkStatus.textContent=online?'網絡：在線':'網絡：離線';
  networkStatus.dataset.state=online?'online':'offline';
  if(!online)showToast('已進入離線狀態。');
}

function updateClock(){
  clockStatus.textContent=new Intl.DateTimeFormat('zh-HK',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
}

nav.forEach(button=>button.addEventListener('click',()=>{
  const next=button.dataset.route;
  if(next!==routeKey())location.hash=`#/${next}`;
}));

window.addEventListener('hashchange',render);
window.addEventListener('online',updateNetwork);
window.addEventListener('offline',updateNetwork);
window.addEventListener('error',event=>{
  console.error('SMT_APP_ERROR',event.error||event.message);
  showToast('系統發生錯誤；未提交任何正式交易資料。');
});

updateNetwork();
updateClock();
setInterval(updateClock,30000);
render();
