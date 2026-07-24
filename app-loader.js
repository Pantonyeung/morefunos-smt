import {renderOrderPage} from './src/pages/order/order.js';

const workspace=document.getElementById('workspace');
const nav=[...document.querySelectorAll('.bottom-nav [data-route]')];
const networkStatus=document.getElementById('network-status');
const clockStatus=document.getElementById('clock-status');
const toast=document.getElementById('system-toast');

const routes={
  order:{render:()=>renderOrderPage(workspace)},
  orders:{title:'訂單',note:'保留完整 SMT 訂單功能範圍，暫未搬入舊頁面實作。',items:['30 分鐘訂單生命週期屬後續 Gate','頁面將獨立擁有自己的 layout','不使用 Loader 注入頁面樣式']},
  dine:{title:'堂食',note:'堂食功能保留，1280×800 畫面將原生重排。',items:['Table Session 與 Order Timer 分離','35 分鐘只作提示','後續 Gate 再接正式互動']},
  soldout:{title:'售罄',note:'售罄屬正式功能，現階段只保留入口。',items:['離線供應控制後續接入','正式商品清單由 Admin 資料提供','舊商品資料不得成為正式來源']},
  more:{title:'更多',note:'設備、日結、報表、備份與更新會逐區重建。',items:['每區獨立 owner','先完成結構再接資料','不以補丁方式搬舊 UI']}
};

function currentRoute(){
  const value=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];
  return routes[value]?value:'order';
}

function renderPlaceholder(route){
  workspace.innerHTML=`<section class="gate-panel"><article class="gate-card"><span class="badge">1280×800 原生重建</span><h1>${route.title}</h1><p>${route.note}</p><ul>${route.items.map(item=>`<li>${item}</li>`).join('')}</ul></article></section>`;
}

function render(){
  const key=currentRoute();
  const route=routes[key];
  nav.forEach(button=>button.setAttribute('aria-current',button.dataset.route===key?'page':'false'));
  if(route.render)route.render();else renderPlaceholder(route);
  workspace.focus({preventScroll:true});
}

function showToast(message){
  if(!toast)return;
  toast.textContent=message;
  toast.hidden=false;
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>{toast.hidden=true;},1800);
}

function updateNetwork(){
  const online=navigator.onLine;
  networkStatus.textContent=online?'網絡：在線':'網絡：離線';
  networkStatus.dataset.state=online?'online':'offline';
  if(!online)showToast('已進入離線狀態；正式本機資料流程將於後續 Gate 接入。');
}

function updateClock(){
  clockStatus.textContent=new Intl.DateTimeFormat('zh-HK',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
}

nav.forEach(button=>button.addEventListener('click',()=>{
  const next=button.dataset.route;
  if(next===currentRoute())return;
  location.hash=`#/${next}`;
}));

window.addEventListener('hashchange',render);
window.addEventListener('online',updateNetwork);
window.addEventListener('offline',updateNetwork);
window.addEventListener('error',event=>{
  console.error('SMT_SHELL_ERROR',event.error||event.message);
  showToast('Shell 發生錯誤；未有正式交易資料被提交。');
});

updateNetwork();
updateClock();
setInterval(updateClock,30000);
render();
