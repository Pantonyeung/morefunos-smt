import {readJSON,writeJSON,SUPPLY_STORAGE_KEY,SETTINGS_STORAGE_KEY,ORDER_HISTORY_STORAGE_KEY,DINE_STORAGE_KEY} from '../../shared/store.js';
import {createRenderQueue} from '../../shared/runtime.js';
import {money,imageBlock,bindImageFallbacks,escapeHtml,showToast} from '../../shared/components.js';
import {categories as fallbackCategories,products as fallbackProducts} from '../order/page-data.js';
import {loadMenuCatalog} from '../order/menu-api.js';
import {renderGlobalStatusBar,renderBottomNav} from '../../shared/shell.js';
import {activeDineOrderIdentities,latestOrderDisplayNumber} from '../../shared/order-identity.js';

const app=document.getElementById('app');
const PANEL_KEY='morefun:smt:v1:soldout-panel';
const fallbackCatalog={categories:fallbackCategories,products:fallbackProducts};
const supply=readJSON(SUPPLY_STORAGE_KEY,{})||{};
const settings=readJSON(SETTINGS_STORAGE_KEY,{})||{};
let panel={images:true,open:true,cardMode:'large',...readJSON(PANEL_KEY,{})};
let products=[];
let categories=[];
let category='全部';
let filter='全部';
let query='';
let batch=false;
let selected=new Set();
let detailId='';
let collapsed=new Set();

const normalizeStatus=value=>{
  const status=String(value||'available').toLowerCase().replace(/[-\s]+/g,'_');
  if(['soldout','sold_out','out_of_stock','unavailable'].includes(status))return 'soldout';
  if(['paused','pause','suspended','disabled'].includes(status))return 'paused';
  return 'available';
};
const statusOf=id=>normalizeStatus(supply[id]?.status);
const statusLabel=status=>status==='soldout'?'今日售罄':status==='paused'?'暫停供應':'供應中';
const template=()=>['large','small','text'].includes(panel.cardMode)?panel.cardMode:'large';
const isPurpleRice=product=>['紫米','飯團'].some(word=>[product.category,product.name,product.code].join(' ').includes(word));
const uniqueProducts=rows=>[...new Map((rows||[]).filter(item=>item?.id).map(item=>[String(item.id),item])).values()];

function expireLocalSoldout(){
  const boundary=new Date();
  boundary.setHours(5,0,0,0);
  if(Date.now()<boundary.getTime())boundary.setDate(boundary.getDate()-1);
  let changed=false;
  Object.keys(supply).forEach(id=>{
    if(statusOf(id)==='soldout'&&Number(supply[id]?.updatedAt||0)<boundary.getTime()){
      delete supply[id];
      changed=true;
    }
  });
  if(changed)writeJSON(SUPPLY_STORAGE_KEY,supply);
}

function visibleProducts(){
  const text=query.trim().toLowerCase();
  return products
    .filter(product=>product.isVisible!==false)
    .filter(product=>category==='全部'||category==='售罄'&&statusOf(product.id)==='soldout'||category!=='售罄'&&product.category===category)
    .filter(product=>filter==='全部'||filter==='售罄'&&statusOf(product.id)==='soldout'||filter==='停售'&&statusOf(product.id)==='paused'||filter==='供應中'&&statusOf(product.id)==='available')
    .filter(product=>!text||[product.code,product.name,product.category].join(' ').toLowerCase().includes(text))
    .map((product,index)=>({product,index}))
    .sort((left,right)=>Number(statusOf(left.product.id)==='paused')-Number(statusOf(right.product.id)==='paused')||left.index-right.index)
    .map(row=>row.product);
}

function productCard(product){
  const style=template();
  const status=statusOf(product.id);
  const checked=selected.has(product.id);
  const action=batch?'toggle-select':'open-product';
  const code=settings.catalog?.showCode===false?'':`<small class="product-code">${escapeHtml(product.code||'')}</small>`;
  const state=status==='available'?'':`<em class="supply-state ${status}">${statusLabel(status)}</em>`;
  const mark=batch?`<span class="selection-mark">${checked?'✓':'＋'}</span>`:'';
  const classes=`product-card ${style} supply-product ${checked?'selected ':''}${status==='available'?'':status}`;
  const copy=`<span class="product-copy">${code}<strong>${escapeHtml(product.name||'未命名產品')}</strong>${settings.catalog?.showDescription!==false&&product.description?`<p class="product-description">${escapeHtml(product.description)}</p>`:''}${state}</span>`;
  if(style==='text')return `<article class="${classes}"><button class="card-open" data-action="${action}" data-id="${escapeHtml(product.id)}">${copy}<b class="product-price">${money(product.price)}</b>${mark}</button></article>`;
  if(style==='small')return `<article class="${classes}"><button class="card-open" data-action="${action}" data-id="${escapeHtml(product.id)}">${imageBlock(product.image,product.name,'product-thumb')}${copy}<b class="product-price">${money(product.price)}</b>${mark}</button></article>`;
  return `<article class="${classes}"><button class="card-open" data-action="${action}" data-id="${escapeHtml(product.id)}">${imageBlock(product.image,product.name,'product-hero')}<div class="product-info">${copy}<b class="product-price">${money(product.price)}</b></div>${mark}</button></article>`;
}

function groupedRows(items){
  const groups=new Map();
  items.forEach(product=>{
    const group=product.category||'未分類';
    if(!groups.has(group))groups.set(group,[]);
    groups.get(group).push(product);
  });
  return [...groups].map(([group,rows])=>`<section class="supply-list-group ${collapsed.has(group)?'collapsed':''}"><button class="group-head" data-action="toggle-section" data-value="${escapeHtml(group)}"><strong>${escapeHtml(group)}</strong><span>${rows.length} 項</span><b>${collapsed.has(group)?'＋':'−'}</b></button><div class="group-lines">${rows.map((product,index)=>`<button class="supply-row ${panel.images?'':'no-image'}" data-action="open-product" data-id="${escapeHtml(product.id)}"><span class="seq">${index+1}</span>${panel.images?imageBlock(product.image,product.name,'supply-row-img'):''}<span><strong>${escapeHtml([product.code,product.name].filter(Boolean).join(' '))}</strong><small>${statusLabel(statusOf(product.id))}</small></span></button>`).join('')}</div></section>`).join('');
}

function statusPanel(){
  const affected=products.filter(product=>statusOf(product.id)!=='available');
  if(!panel.open)return `<aside class="supply-panel is-collapsed"><header><div><small>供應狀態</small><h2>售罄列表（${affected.length}）</h2></div><button data-action="toggle-panel">展開</button></header></aside>`;
  return `<aside class="supply-panel"><header><div><small>按分類整理</small><h2>售罄列表（${affected.length}）</h2></div><button data-action="toggle-panel">收起</button></header><div class="panel-tools"><button data-action="toggle-list-images">${panel.images?'隱藏小圖':'顯示小圖'}</button><small>今日售罄於翌日早上五時恢復</small></div><div class="supply-list">${affected.length?groupedRows(affected):'<div class="empty-state"><strong>目前全部供應中</strong><p>可點擊單一產品或使用批量選擇。</p></div>'}</div><footer><button class="primary" data-action="start-batch">批量選擇</button></footer></aside>`;
}

function batchPanel(){
  const rows=products.filter(product=>selected.has(product.id));
  return `<aside class="supply-panel batch-panel"><header><div><small>批量處理</small><h2>待確認（${rows.length}）</h2></div></header><div class="supply-list">${rows.length?groupedRows(rows):'<div class="empty-state"><strong>未有選擇產品</strong><p>點擊產品卡任何位置加入。</p></div>'}</div><footer class="batch-actions"><button data-action="apply-bulk" data-value="soldout" ${rows.length?'':'disabled'}>今日售罄</button><button data-action="apply-bulk" data-value="paused" ${rows.length?'':'disabled'}>暫停供應</button><button data-action="apply-bulk" data-value="available" ${rows.length?'':'disabled'}>恢復供應</button><button data-action="cancel-batch">返回</button></footer></aside>`;
}

function detail(){
  const product=products.find(item=>item.id===detailId);
  if(!product)return '';
  const status=statusOf(product.id);
  return `<button class="detail-scrim" data-action="close-detail"></button><aside class="readonly-detail supply-detail"><header><div><small>供應狀態設定</small><h2>${escapeHtml([product.code,product.name].filter(Boolean).join(' '))}</h2></div><button data-action="close-detail">×</button></header><div class="detail-body">${imageBlock(product.image,product.name,'detail-image')}<dl><div><dt>分類</dt><dd>${escapeHtml(product.category||'未分類')}</dd></div><div><dt>價格</dt><dd>${money(product.price)}</dd></div><div><dt>目前狀態</dt><dd><em class="supply-state ${status}">${statusLabel(status)}</em></dd></div><div><dt>產品說明</dt><dd>${escapeHtml(product.description||'沒有額外說明')}</dd></div></dl><p>只會更改供應狀態；產品內容、價格及選項不能在此修改。</p></div><footer class="detail-actions"><button data-action="set-single-status" data-value="soldout">今日售罄</button><button data-action="set-single-status" data-value="paused">暫停供應</button><button data-action="set-single-status" data-value="available">恢復供應</button><button data-action="close-detail">返回</button></footer></aside>`;
}

function render(){
  const list=visibleProducts();
  const style=template();
  const width=Number(settings.cart?.widthPercent||32);
  const categorySelected=list.filter(product=>selected.has(product.id)).length;
  app.innerHTML=`<main><header class="topbar"><div class="brand">磨飯 SMT</div><div class="page-title"><strong>售罄管理</strong><small>只改供應狀態，不改產品內容</small></div><div class="spacer"></div><label class="search-box"><span>⌕</span><input id="search" value="${escapeHtml(query)}" placeholder="搜尋產品名稱或編號"></label><div class="segmented status-filter">${['全部','供應中','售罄','停售'].map(value=>`<button data-action="filter" data-value="${value}" class="${filter===value?'active':''}">${value}</button>`).join('')}</div></header><section class="workspace"><section class="soldout-grid" style="--side-width:${width}%"><section class="catalog soldout-catalog"><div class="purple-actions"><button data-action="purple-status" data-value="soldout">紫米售罄</button><button data-action="purple-status" data-value="available">紫米恢復</button><span>快速處理所有紫米及飯團產品</span></div><nav class="categories"><button data-action="category" data-value="全部" class="${category==='全部'?'active':''}">全部</button><button data-action="category" data-value="售罄" class="soldout-category ${category==='售罄'?'active':''}">售罄 ${products.filter(product=>statusOf(product.id)==='soldout').length}</button>${categories.map(value=>`<button data-action="category" data-value="${escapeHtml(value)}" class="${category===value?'active':''}">${escapeHtml(value)}</button>`).join('')}</nav><div class="catalog-caption"><span>${list.length} 款產品</span><div class="card-mode segmented">${[['large','大圖'],['small','小圖'],['text','純文字']].map(([value,label])=>`<button data-action="card-mode" data-value="${value}" class="${style===value?'active':''}">${label}</button>`).join('')}</div>${batch?`<div class="selection-tools"><b>此分類已選 ${categorySelected}／${list.length}</b><button data-action="select-category-all">全選</button><button data-action="select-category-none">全不選</button></div>`:'<button class="batch-entry" data-action="start-batch">一次性多選</button>'}</div><div class="products products-${style}">${list.map(productCard).join('')}</div></section>${batch?batchPanel():statusPanel()}</section></section><nav class="bottom-nav"><button data-action="navigate-order">點餐</button><button data-action="navigate-orders">訂單</button><button data-action="navigate-dine">堂食</button><button class="active">售罄</button><button data-action="navigate-more">更多</button></nav></main>${detail()}<div id="toast" class="toast"></div>`;
  bindImageFallbacks(app);
  const pageTools=app.querySelector('.topbar');
  pageTools?.querySelector('.brand')?.remove();
  if(pageTools){
    pageTools.className='page-statusbar';
    pageTools.insertAdjacentHTML('beforebegin',renderGlobalStatusBar({terminalId:document.documentElement.dataset.appProfile==='mobile'?'SMM':'SMT',operationLabel:'接單中',lastOrder:latestOrderDisplayNumber([...readJSON(ORDER_HISTORY_STORAGE_KEY,[]),...activeDineOrderIdentities(readJSON(DINE_STORAGE_KEY,null))])}));
  }
  const legacyNav=app.querySelector('.bottom-nav');
  if(legacyNav)legacyNav.outerHTML=renderBottomNav('soldout');
}

const queue=createRenderQueue(render);

function setStatus(ids,status){
  const nextStatus=normalizeStatus(status);
  const now=Date.now();
  ids.forEach(id=>{
    if(nextStatus==='available')delete supply[id];
    else supply[id]={status:nextStatus,updatedAt:now,canonicalProductId:id};
  });
  writeJSON(SUPPLY_STORAGE_KEY,supply);
}

function handle(button){
  const action=button.dataset.action;
  if(action==='category')category=button.dataset.value;
  else if(action==='filter')filter=button.dataset.value;
  else if(action==='card-mode'){panel.cardMode=button.dataset.value;writeJSON(PANEL_KEY,panel);}
  else if(action==='start-batch'){batch=true;selected.clear();}
  else if(action==='cancel-batch'){batch=false;selected.clear();}
  else if(action==='toggle-select'){selected.has(button.dataset.id)?selected.delete(button.dataset.id):selected.add(button.dataset.id);}
  else if(action==='select-category-all')visibleProducts().forEach(product=>selected.add(product.id));
  else if(action==='select-category-none')visibleProducts().forEach(product=>selected.delete(product.id));
  else if(action==='apply-bulk'){
    const count=selected.size;
    setStatus([...selected],button.dataset.value);
    batch=false;
    selected.clear();
    showToast(`已處理 ${count} 款產品`);
  }else if(action==='purple-status'){
    const ids=products.filter(isPurpleRice).map(product=>product.id);
    setStatus(ids,button.dataset.value);
    showToast(`已處理 ${ids.length} 款紫米產品`);
  }else if(action==='open-product')detailId=button.dataset.id;
  else if(action==='set-single-status'){
    setStatus([detailId],button.dataset.value);
    detailId='';
    showToast('供應狀態已更新');
  }else if(action==='close-detail')detailId='';
  else if(action==='toggle-section')collapsed.has(button.dataset.value)?collapsed.delete(button.dataset.value):collapsed.add(button.dataset.value);
  else if(action==='toggle-panel'){panel.open=!panel.open;writeJSON(PANEL_KEY,panel);}
  else if(action==='toggle-list-images'){panel.images=!panel.images;writeJSON(PANEL_KEY,panel);}
  else if(action?.startsWith('navigate-')){
    window.parent?.postMessage?.({type:'morefun:navigate',route:action.replace('navigate-','')},location.origin);
    return;
  }
  queue.schedule();
}

app.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');
  if(button&&!button.disabled)handle(button);
});
app.addEventListener('input',event=>{
  if(event.target.id!=='search')return;
  query=event.target.value;
  queue.schedule();
});
app.addEventListener('click',event=>{
  const button=event.target.closest('[data-action="shell-navigate"]');
  if(!button)return;
  event.stopPropagation();
  if(button.dataset.route!=='soldout')window.parent?.postMessage?.({type:'morefun:navigate',route:button.dataset.route},location.origin);
});

expireLocalSoldout();
queue.flush();
loadMenuCatalog({fallback:fallbackCatalog}).then(catalog=>{
  products=uniqueProducts(catalog.products?.length?catalog.products:fallbackProducts);
  categories=[...new Set((catalog.categories?.length?catalog.categories:fallbackCategories).filter(value=>!['搜尋','全部'].includes(value)))];
  queue.schedule();
}).catch(error=>{
  console.error('SOLDOUT_MENU_BOOTSTRAP_FAILED',error);
  products=uniqueProducts(fallbackProducts);
  categories=fallbackCategories.filter(value=>!['搜尋','全部'].includes(value));
  queue.schedule();
  showToast('餐牌連接失敗，已載入本機售罄管理');
});
