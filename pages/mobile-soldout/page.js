import {SUPPLY_STORAGE_KEY,readJSON,writeJSON} from '../../shared/store.js';
import {categories as fallbackCategories,products as fallbackProducts} from '../order/page-data.js';

const app=document.getElementById('app');
const PUBLIC_RUNTIME_URL='https://morefunos-admin.pages.dev/v1/runtime/customer';
const CATALOG_CACHE_KEY='morefun:smt:availability-catalog:v1';
let categories=[];
let products=[];
let supply=readJSON(SUPPLY_STORAGE_KEY,{})||{};
let category='全部';
let filter='全部';
let query='';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const rows=value=>Array.isArray(value)?value:value&&typeof value==='object'?Object.values(value):[];
const bool=(value,fallback=true)=>value===undefined||value===null?fallback:value!==false&&!['false','0','no','off'].includes(String(value).toLowerCase());
const productId=row=>String(row?.id||row?.product_id||row?.productId||'').trim();
const categoryId=row=>String(row?.customerCategoryId||row?.category_id||row?.categoryId||row?.category||'').trim();
const statusOf=id=>supply[id]?.status||'available';
const statusLabel=status=>status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';
const isPurpleRice=product=>/紫米|飯團|飯糰/.test(`${product.category||''} ${product.name||''} ${product.code||''}`);

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

function normalizeCatalog(payload){
  const published=payload?.published||payload?.data?.published||{};
  const categoryRows=rows(published.categories)
    .filter(row=>row?.enabled!==false&&row?.lifecycle!=='legacy-archive')
    .filter(row=>bool(row?.visibility?.smt,true)||bool(row?.visibility?.smm,true)||bool(row?.channels?.smt,true)||bool(row?.channels?.smm,true));
  const categoryMap=new Map(categoryRows.map(row=>[
    String(row.id||row.category_id||row.categoryId||''),
    String(row.name||row.customerName||row.category_name||row.categoryName||'未分類')
  ]));
  const normalizedProducts=rows(published.products)
    .filter(row=>row?.enabled!==false&&row?.lifecycle!=='legacy-archive')
    .filter(row=>bool(row?.visibility?.smt,true)||bool(row?.visibility?.smm,true)||bool(row?.channels?.smt,true)||bool(row?.channels?.smm,true))
    .map((row,index)=>{
      const id=productId(row);
      const catId=categoryId(row);
      return {
        id,
        code:String(row.code||row.product_code||row.productCode||row.sku||row.barcode||id),
        name:String(row.internalName||row.externalName||row.customerName||row.product_name||row.name||'未命名產品'),
        category:categoryMap.get(catId)||String(row.category_name||row.categoryName||'未分類'),
        price:Number(row.price??row.customerPrice??row.base_price??0)||0,
        image:String(row.storefrontImageUrl||row.customerImageUrl||row.image_url||row.image||''),
        sort:Number(row.sort??row.customerSort??row.sort_order??index+1)||index+1,
        isVisible:true
      };
    })
    .filter(row=>row.id)
    .sort((left,right)=>left.sort-right.sort||left.name.localeCompare(right.name,'zh-Hant'));
  if(!normalizedProducts.length)throw new Error('SMM_PUBLIC_CATALOG_EMPTY');
  return {
    categories:[...new Set(normalizedProducts.map(row=>row.category).filter(Boolean))],
    products:normalizedProducts,
    version:String(payload?.meta?.version||''),
    checksum:String(payload?.meta?.checksum||''),
    savedAt:new Date().toISOString()
  };
}

async function loadCatalog(){
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    const response=await fetch(PUBLIC_RUNTIME_URL,{headers:{accept:'application/json'},cache:'no-store',signal:controller.signal});
    clearTimeout(timer);
    const payload=await response.json();
    if(!response.ok||payload?.ok!==true)throw new Error(payload?.error||`SMM_PUBLIC_CATALOG_HTTP_${response.status}`);
    const catalog=normalizeCatalog(payload);
    localStorage.setItem(CATALOG_CACHE_KEY,JSON.stringify(catalog));
    return {...catalog,source:'live'};
  }catch(error){
    try{
      const cached=JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY)||'null');
      if(cached?.products?.length)return {...cached,source:'cache',error:String(error?.message||error)};
    }catch{}
    return {
      categories:fallbackCategories.filter(name=>!['全部','搜尋'].includes(name)),
      products:fallbackProducts.filter(row=>row.isVisible!==false),
      source:'fallback',
      error:String(error?.message||error)
    };
  }
}

function showToast(message){
  const node=document.getElementById('toast');
  if(!node)return;
  node.textContent=message;
  node.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>node.classList.remove('show'),1700);
}

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
  return products.reduce((result,product)=>{
    const status=statusOf(product.id);
    result[status]=(result[status]||0)+1;
    return result;
  },{available:0,soldout:0,paused:0});
}

function productCard(product){
  const status=statusOf(product.id);
  return `<article class="product"><div class="product-head"><div><h2>${esc([product.code,product.name].filter(Boolean).join(' '))}</h2><small>${esc(product.category||'未分類')} · $${Number(product.price||0).toFixed(1)}</small></div><span class="state ${status}">${statusLabel(status)}</span></div><div class="actions">${[['soldout','今日售罄'],['paused','暫停供應'],['available','恢復供應']].map(([value,label])=>`<button data-product="${esc(product.id)}" data-status="${value}" class="${status===value?'active':''}">${label}</button>`).join('')}</div></article>`;
}

function runtimeStatus(){
  const runtime=window.MoreFunSupplyRuntime;
  const state=runtime?.getState?.()||{};
  const pending=runtime?.getPending?.().length||0;
  const session=runtime?.getSession?.();
  if(!session)return pending?`離線待同步 ${pending}`:'未登入同步';
  if(state.connected)return pending?`同步中 ${pending}`:'同步已連線';
  return pending?`離線待同步 ${pending}`:'同步離線';
}

function render(){
  const summary=counts();
  const list=visibleProducts();
  app.innerHTML=`<main class="smm-page"><header class="page-statusbar"><div><h1>SMM 售罄管理</h1><p>${esc(runtimeStatus())} · 同 SMT／Customer 共用狀態</p></div></header><section class="summary"><article><span>供應中</span><b>${summary.available}</b></article><article><span>今日售罄</span><b>${summary.soldout}</b></article><article><span>暫停供應</span><b>${summary.paused}</b></article></section><section class="tools"><label class="search">⌕<input data-search value="${esc(query)}" placeholder="搜尋產品名稱或編號"></label><div class="chips">${[['全部','全部'],['available','供應中'],['soldout','今日售罄'],['paused','暫停供應']].map(([value,label])=>`<button data-filter="${value}" class="${filter===value?'active':''}">${label}</button>`).join('')}</div><div class="chips">${['全部',...categories].map(value=>`<button data-category="${esc(value)}" class="${category===value?'active':''}">${esc(value)}</button>`).join('')}</div><div class="quick"><button class="soldout" data-purple="soldout">紫米全部售罄</button><button class="available" data-purple="available">紫米全部恢復</button></div></section><section class="catalog">${list.map(productCard).join('')||'<div class="empty">未有符合條件嘅產品</div>'}</section></main><div id="toast" class="toast"></div>`;
}

function setStatus(ids,status){
  const next={...supply};
  for(const id of ids){
    if(status==='available')delete next[id];
    else next[id]={status,updatedAt:Date.now(),source:'smm'};
  }
  supply=next;
  writeJSON(SUPPLY_STORAGE_KEY,supply);
  render();
  showToast(status==='available'?'已恢復供應':status==='paused'?'已暫停供應':'已設為今日售罄');
}

app.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  if(button.dataset.filter){filter=button.dataset.filter;render();return}
  if(button.dataset.category){category=button.dataset.category;render();return}
  if(button.dataset.product&&button.dataset.status){setStatus([button.dataset.product],button.dataset.status);return}
  if(button.dataset.purple)setStatus(products.filter(isPurpleRice).map(product=>product.id),button.dataset.purple);
});

app.addEventListener('input',event=>{
  if(!event.target.matches('[data-search]'))return;
  query=event.target.value;
  render();
  requestAnimationFrame(()=>{
    const input=app.querySelector('[data-search]');
    input?.focus();
    input?.setSelectionRange?.(query.length,query.length);
  });
});

window.addEventListener('morefun:supply-runtime-state',()=>{
  supply=readJSON(SUPPLY_STORAGE_KEY,{})||{};
  render();
});

clearExpiredSoldout();
render();
const catalog=await loadCatalog();
categories=catalog.categories||[];
products=catalog.products||[];
render();
if(catalog.source!=='live')showToast(catalog.source==='cache'?'餐牌離線，使用最近資料':'餐牌連線失敗，使用本機資料');
