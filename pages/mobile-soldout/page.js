import {SUPPLY_STORAGE_KEY,readJSON,writeJSON} from '../../shared/store.js';
import {categories as fallbackCategories,products as fallbackProducts} from '../order/page-data.js';
import {loadMenuCatalog} from '../order/menu-api.js';

const app=document.getElementById('app');
const fallback={categories:fallbackCategories,products:fallbackProducts,drinks:[]};
let categories=fallbackCategories.filter(name=>!['全部','搜尋'].includes(name));
let products=[...fallbackProducts].filter(product=>product.isVisible!==false);
let supply=readJSON(SUPPLY_STORAGE_KEY,{})||{};
let category='全部';
let filter='全部';
let query='';

function businessDayStart(){
  const now=new Date();
  const start=new Date(now);
  start.setHours(5,0,0,0);
  if(now<start)start.setDate(start.getDate()-1);
  return start.getTime();
}
function clearExpiredSoldout(){
  const cutoff=businessDayStart();
  let changed=false;
  for(const [id,row] of Object.entries(supply)){
    if(row?.status==='soldout'&&Number(row.updatedAt||0)<cutoff){delete supply[id];changed=true}
  }
  if(changed)writeJSON(SUPPLY_STORAGE_KEY,supply);
}
clearExpiredSoldout();

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const statusOf=id=>supply[id]?.status||'available';
const statusLabel=status=>status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';
const isPurpleRice=product=>/紫米|飯團|飯糰/.test(`${product.category||''} ${product.name||''} ${product.code||''}`);
function showToast(message){const node=document.getElementById('toast');if(!node)return;node.textContent=message;node.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>node.classList.remove('show'),1700)}

function visibleProducts(){
  return products
    .filter(product=>product.isVisible!==false)
    .filter(product=>category==='全部'||product.category===category)
    .filter(product=>filter==='全部'||statusOf(product.id)===filter)
    .filter(product=>!query||`${product.code||''} ${product.name||''} ${product.category||''}`.toLowerCase().includes(query.toLowerCase()))
    .map((product,index)=>({product,index}))
    .sort((left,right)=>Number(statusOf(left.product.id)==='paused')-Number(statusOf(right.product.id)==='paused')||left.index-right.index)
    .map(row=>row.product);
}
function counts(){
  return products.reduce((result,product)=>{result[statusOf(product.id)]=(result[statusOf(product.id)]||0)+1;return result},{available:0,soldout:0,paused:0});
}
function productCard(product){
  const status=statusOf(product.id);
  return `<article class="product"><div class="product-head"><div><h2>${esc([product.code,product.name].filter(Boolean).join(' '))}</h2><small>${esc(product.category||'未分類')} · $${Number(product.price||0).toFixed(1)}</small></div><span class="state ${status}">${statusLabel(status)}</span></div><div class="actions">${[['soldout','今日售罄'],['paused','暫停供應'],['available','恢復供應']].map(([value,label])=>`<button data-product="${esc(product.id)}" data-status="${value}" class="${status===value?'active':''}">${label}</button>`).join('')}</div></article>`;
}
function render(){
  const summary=counts();
  const rows=visibleProducts();
  app.innerHTML=`<main class="smm-page"><header class="page-statusbar"><button class="back" data-back>‹</button><div><h1>SMM 售罄管理</h1><p>同 SMT／Customer 共用即時供應狀態</p></div></header><section class="summary"><article><span>供應中</span><b>${summary.available}</b></article><article><span>今日售罄</span><b>${summary.soldout}</b></article><article><span>暫停供應</span><b>${summary.paused}</b></article></section><section class="tools"><label class="search">⌕<input data-search value="${esc(query)}" placeholder="搜尋產品名稱或編號"></label><div class="chips" data-status-filters>${[['全部','全部'],['available','供應中'],['soldout','今日售罄'],['paused','暫停供應']].map(([value,label])=>`<button data-filter="${value}" class="${filter===value?'active':''}">${label}</button>`).join('')}</div><div class="chips">${['全部',...categories].map(value=>`<button data-category="${esc(value)}" class="${category===value?'active':''}">${esc(value)}</button>`).join('')}</div><div class="quick"><button class="soldout" data-purple="soldout">紫米全部售罄</button><button class="available" data-purple="available">紫米全部恢復</button></div></section><section class="catalog">${rows.map(productCard).join('')||'<div class="empty">未有符合條件嘅產品</div>'}</section></main><div id="toast" class="toast"></div>`;
}
function persist(next,message){supply=next;writeJSON(SUPPLY_STORAGE_KEY,supply);render();showToast(message)}
function setStatus(ids,status){
  const next={...supply};
  for(const id of ids){
    if(status==='available')delete next[id];
    else next[id]={status,updatedAt:Date.now()};
  }
  persist(next,status==='available'?'已恢復供應':status==='paused'?'已暫停供應':'已設為今日售罄');
}

app.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.back!==undefined){window.parent?.postMessage?.({type:'morefun:navigate',route:'order'},'*');return}
  if(button.dataset.filter){filter=button.dataset.filter;render();return}
  if(button.dataset.category){category=button.dataset.category;render();return}
  if(button.dataset.product&&button.dataset.status){setStatus([button.dataset.product],button.dataset.status);return}
  if(button.dataset.purple){setStatus(products.filter(isPurpleRice).map(product=>product.id),button.dataset.purple)}
});
app.addEventListener('input',event=>{
  if(!event.target.matches('[data-search]'))return;
  query=event.target.value;
  render();
  requestAnimationFrame(()=>{const input=app.querySelector('[data-search]');input?.focus();input?.setSelectionRange?.(query.length,query.length)});
});

render();
window.parent?.postMessage?.({type:'morefun:page-ready',page:'mobile-soldout'},'*');
loadMenuCatalog({fallback}).then(result=>{
  categories=(result.categories||fallbackCategories).filter(name=>!['全部','搜尋'].includes(name));
  products=(result.products||fallbackProducts).filter(product=>product.isVisible!==false);
  render();
}).catch(error=>{console.error('SMM_SOLDOUT_MENU_FAILED',error);showToast('餐牌連線失敗，已使用本機資料')});
