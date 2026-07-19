/* More Fun SMT V16.1 — single-runtime 5 Root rebuild */
'use strict';

const DATA=window.MoreFunSMTData;
const API=window.MoreFunSMTApi;
const app=document.getElementById('app');
const stage=document.getElementById('smt-stage');
const productMap=new Map(DATA.products.map(p=>[p.id,p]));
const drinkMap=new Map(DATA.drinks.map(d=>[d.id,d]));
const STORAGE='morefun:smt:v16.1';

const clone=v=>{try{return structuredClone(v);}catch{return JSON.parse(JSON.stringify(v));}};
const money=v=>`$${Number(v||0).toFixed(0)}`;
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const id=(p='id')=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f;}catch{return f;}};
const save=()=>localStorage.setItem(STORAGE,JSON.stringify(state));

const defaultSettings=clone(DATA.orderPageConfig);
const persisted=read(STORAGE,{});
const state={
  category:persisted.category||'全部',
  cart:Array.isArray(persisted.cart)?persisted.cart:[],
  settings:{...defaultSettings,...persisted.settings,catalog:{...defaultSettings.catalog,...persisted.settings?.catalog},cart:{...defaultSettings.cart,...persisted.settings?.cart},quickDrinks:{...defaultSettings.quickDrinks,...persisted.settings?.quickDrinks},quickAssist:{...defaultSettings.quickAssist,...persisted.settings?.quickAssist}},
  side:null,
  pendingOrders:8,
  pendingExpanded:false,
  modal:null
};

function viewportSize(){
  const vv=window.visualViewport;
  return {
    width:Math.max(1,Math.round(vv?.width||window.innerWidth||document.documentElement.clientWidth||1)),
    height:Math.max(1,Math.round(vv?.height||window.innerHeight||document.documentElement.clientHeight||1))
  };
}
function updateOrientationGate(){
  const {width,height}=viewportSize();
  const isPortrait=height>width;
  document.body.classList.toggle('is-portrait',isPortrait);
  return !isPortrait;
}
function fitStage(){
  if(!updateOrientationGate())return;
  const viewport=viewportSize();
  const {width,height}=DATA.orderPageConfig.canvas;
  const scale=Math.min(viewport.width/width,viewport.height/height);
  stage.style.width=`${width}px`;stage.style.height=`${height}px`;
  stage.style.transform=`scale(${scale})`;
  stage.style.left=`${Math.max(0,(viewport.width-width*scale)/2)}px`;
  stage.style.top=`${Math.max(0,(viewport.height-height*scale)/2)}px`;
}
const scheduleFit=()=>requestAnimationFrame(()=>requestAnimationFrame(fitStage));
addEventListener('resize',scheduleFit,{passive:true});
addEventListener('orientationchange',()=>setTimeout(scheduleFit,180),{passive:true});
window.visualViewport?.addEventListener('resize',scheduleFit,{passive:true});
window.visualViewport?.addEventListener('scroll',scheduleFit,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleFit();});
scheduleFit();

function productImage(src,name,cls=''){return `<span class="image-shell ${cls}"><img src="${esc(src)}" alt="${esc(name)}"><span>餐點圖片</span></span>`;}
function normalizeLine(line){const p=productMap.get(line.productId)||{};const qty=Math.max(1,Number(line.qty)||1);return {...line,lineId:line.lineId||id('line'),qty,unitPrice:Number(line.unitPrice??p.price??0),total:Number(line.unitPrice??p.price??0)*qty,options:{...(line.options||{})},drinks:Array.isArray(line.drinks)?line.drinks:[],required:line.required||p.required||[],optional:line.optional||p.optional||[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),createdAt:line.createdAt||Date.now()};}
state.cart=state.cart.map(normalizeLine);

function configKey(l){return JSON.stringify([l.productId,l.options,l.drinks.map(d=>[d.drinkId,d.sweetness,d.ice])]);}
function mergeCart(lines){if(state.settings.cart.mergeMode==='never')return lines.map(normalizeLine);const out=[];for(const row of lines.map(normalizeLine)){const hit=out.find(x=>x.productId===row.productId&&(state.settings.cart.mergeMode==='always'||configKey(x)===configKey(row)));if(!hit){out.push(row);continue;}hit.qty+=row.qty;hit.total=hit.qty*hit.unitPrice;hit.drinkSlots+=row.drinkSlots;hit.drinks.push(...row.drinks);}return out;}
function lineMissing(line){let n=0;for(const g of line.required){if(g==='drink')n+=Math.max(0,line.drinkSlots-line.drinks.length);else if(!line.options[g])n++;}return n;}
function totalMissing(){return state.cart.reduce((n,l)=>n+lineMissing(l),0);}
function missingDrinkSlots(){return state.cart.reduce((n,l)=>n+Math.max(0,l.drinkSlots-l.drinks.length),0);}
function lineDescription(l){const parts=[];Object.entries(l.options).forEach(([k,v])=>v&&parts.push(v));const grouped=new Map();l.drinks.forEach(d=>{const k=[d.name,d.sweetness||'',d.ice||''].join('|');grouped.set(k,(grouped.get(k)||0)+1);});for(const [k,n] of grouped){const [name,sweet,ice]=k.split('|');parts.push(`${name}${sweet&&sweet!=='正常甜'?` · ${sweet}`:''}${ice&&ice!=='正常冰'?` · ${ice}`:''}${n>1?` ×${n}`:''}`);}const miss=lineMissing(l);if(miss)parts.push(`尚欠 ${miss} 項`);return parts.join(' · ')||'標準';}

function renderProductCard(p){const t=state.settings.catalog.productOverrides?.[p.id]||state.settings.catalog.defaultTemplate;const code=state.settings.catalog.showCode?`<small>${esc(p.code)}</small>`:'';const desc=state.settings.catalog.showDescription&&p.description?`<p>${esc(p.description)}</p>`:'';return `<button class="product-card ${t}" data-action="open-product" data-id="${p.id}">${t!=='text'?productImage(p.image,p.name,t==='large'?'product-hero':'product-thumb'):''}<span>${code}<strong>${esc(p.name)}</strong>${desc}</span><b>${money(p.price)}</b></button>`;}
function renderDrinkCard(d,action='quick-drink'){return `<button class="drink-card" data-action="${action}" data-id="${d.id}">${state.settings.quickDrinks.showImages?productImage(d.image,d.name,'drink-thumb'):''}<span>${esc(d.name)}</span></button>`;}
function renderCart(){if(!state.cart.length)return '<div class="empty">購物車未有餐點</div>';return state.cart.map((l,i)=>`<button class="cart-row" data-action="edit-line" data-id="${l.lineId}"><span class="seq">${i+1}</span>${productImage(productMap.get(l.productId)?.image||'',productMap.get(l.productId)?.name||'餐點','cart-img')}<span><strong>${esc(productMap.get(l.productId)?.name||'餐點')}</strong><small>${esc(lineDescription(l))}</small></span><b>×${l.qty}<br>${money(l.total)}</b></button>`).join('');}
function renderSide(){if(state.side==='settings')return `<aside class="side-panel"><header><strong>顯示及快捷設定</strong><button data-action="close-side">×</button></header><section><label>產品卡預設</label><div class="chips">${[['large','大圖'],['small','小圖'],['text','純文字']].map(([v,t])=>`<button data-action="set-template" data-value="${v}" class="${state.settings.catalog.defaultTemplate===v?'active':''}">${t}</button>`).join('')}</div></section><section><label><input type="checkbox" data-action="toggle-code" ${state.settings.catalog.showCode?'checked':''}> 顯示產品代碼</label></section><section><label><input type="checkbox" data-action="toggle-quick-drinks" ${state.settings.quickDrinks.enabled?'checked':''}> 顯示快捷飲品列</label></section><section><label><input type="checkbox" data-action="toggle-quick-images" ${state.settings.quickDrinks.showImages?'checked':''}> 快捷飲品顯示圖片</label></section><section><label><input type="checkbox" data-action="toggle-quick-assist" ${state.settings.quickAssist.enabled?'checked':''}> 顯示快捷補選</label></section><section><label>購物籃合拼</label><div class="chips">${[['same_config','相同設定'],['always','永遠'],['never','不合拼']].map(([v,t])=>`<button data-action="set-merge" data-value="${v}" class="${state.settings.cart.mergeMode===v?'active':''}">${t}</button>`).join('')}</div></section></aside>`;
if(state.side==='pending')return `<aside class="side-panel pending-panel ${state.pendingExpanded?'expanded':''}"><header><strong>待處理訂單</strong><button data-action="close-side">×</button></header><div class="pending-scroll"><article><b>磨飯 App</b><span>5 張</span></article><article><b>電話／WhatsApp</b><span>3 張</span></article></div><button class="expand-btn" data-action="toggle-pending-expand">${state.pendingExpanded?'收起':'展開至半屏'}</button></aside>`;return '';}

function render(){
  const visible=DATA.products.filter(p=>state.category==='全部'||(state.category==='人氣推薦'&&p.category==='人氣推薦')||p.category===state.category);
  const miss=totalMissing(), total=state.cart.reduce((n,l)=>n+l.total,0), count=state.cart.reduce((n,l)=>n+l.qty,0);
  app.innerHTML=`<div class="app-shell"><header class="topbar"><div class="brand">磨飯 SMT</div><div class="serial"><small>流水號</small><strong>10248</strong></div><div class="top-spacer"></div><button data-action="toggle-side" data-side="pending" class="top-action ${state.side==='pending'?'active':''}">待處理 <i>${state.pendingOrders}</i></button><button data-action="toggle-side" data-side="settings" class="top-action ${state.side==='settings'?'active':''}">顯示設定</button><span class="online">● 線上</span></header><main class="workspace"><section class="order-layout"><aside class="cart panel"><header><h2>購物車（${count}）</h2><button data-action="clear-cart" ${state.cart.length?'':'disabled'}>清空</button></header><div class="cart-list">${renderCart()}</div><footer><button data-action="open-pending-zone" class="secondary">待補區 ${miss?`<i>${miss}</i>`:'0'}</button><button data-action="checkout" class="primary" ${state.cart.length?'':'disabled'}>${miss?'先整理待補項目':`結帳 ${money(total)}`}</button></footer></aside><section class="catalog panel"><div class="categories">${DATA.categories.map(c=>`<button data-action="category" data-value="${c}" class="${state.category===c?'active':''}">${c}</button>`).join('')}</div><div class="products">${visible.map(renderProductCard).join('')}</div>${state.settings.quickDrinks.enabled?`<div class="quick-strip"><button class="quick-entry" data-action="open-quick-settings"><span>快選</span><b>飲品</b></button><div>${state.settings.quickDrinks.order.map(id=>drinkMap.get(id)).filter(Boolean).map(renderDrinkCard).join('')}</div></div>`:''}</section>${renderSide()}</section></main><nav class="bottom-nav"><button class="active">點單</button><button disabled>訂單</button><button disabled>堂食</button><button disabled>售罄</button><button disabled>更多</button></nav></div><div id="overlay-root"></div><div id="toast" class="toast"></div>`;
  bindImages();save();
}

function bindImages(){document.querySelectorAll('.image-shell img').forEach(img=>{const fail=()=>img.parentElement.classList.add('failed');img.addEventListener('error',fail,{once:true});if(img.complete&&!img.naturalWidth)fail();});}
function toast(msg){const n=document.getElementById('toast');if(!n)return;n.textContent=msg;n.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>n.classList.remove('show'),1600);}
function closeModal(force=false){if(!state.modal)return;const dirty=state.modal.dirty;if(dirty&&!force)return openConfirm('尚未套用修改','離開會失去今次修改。',()=>{state.modal=null;render();});state.modal=null;render();}
function modalFrame(body,cls='detail-modal'){return `<button class="scrim" data-action="close-modal" aria-label="關閉"></button><section class="${cls}">${body}</section>`;}
function mountModal(html){document.getElementById('overlay-root').innerHTML=html;bindImages();}
function openConfirm(title,text,onConfirm){state.modal={type:'confirm',dirty:false,onConfirm};mountModal(modalFrame(`<header><strong>${esc(title)}</strong></header><p>${esc(text)}</p><footer><button data-action="cancel-confirm">取消</button><button class="danger" data-action="confirm-leave">離開</button></footer>`,'confirm-modal'));}

function openProduct(productId,lineId=null){
  const p=productMap.get(productId);if(!p)return;
  const existing=lineId?state.cart.find(l=>l.lineId===lineId):null;
  const draft=existing?clone(existing):normalizeLine({productId:p.id,qty:1,options:{},drinks:[],required:p.required,optional:p.optional,drinkSlots:p.drinkSlots||0});
  state.modal={type:'product',productId,lineId,draft,dirty:false};drawProductModal();
}
function drawProductModal(){const m=state.modal;if(!m||m.type!=='product')return;const p=productMap.get(m.productId),d=m.draft;const groups=[...new Set([...(p.required||[]),...(p.optional||[])])];const groupHtml=groups.filter(g=>!['drink','sweetness','ice'].includes(g)).map(g=>`<section class="option-group"><header><strong>${g==='rice'?'飯底':g==='sauce'?'醬汁':'小食'}</strong><span>${p.required.includes(g)?'必選':'選填'}</span></header><div class="chips">${DATA.optionSets[g].map(v=>`<button data-action="choose-option" data-group="${g}" data-value="${v}" class="${d.options[g]===v?'active':''}">${v}</button>`).join('')}</div></section>`).join('');
const drinkNeeded=p.required.includes('drink')||p.optional.includes('drink');
mountModal(modalFrame(`<header class="detail-head"><div>${productImage(p.image,p.name,'detail-img')}<span><small>${p.code}</small><strong>${esc(p.name)}</strong><b>${money(p.price)}</b></span></div><button data-action="close-modal">×</button></header><div class="detail-body"><div class="detail-left">${groupHtml}${drinkNeeded?`<section class="option-group"><header><strong>飲品</strong><span>${p.required.includes('drink')?'必選':'選填／Link Up'}</span></header><div class="drink-scroll">${DATA.drinks.map(x=>renderDrinkCard(x,'choose-detail-drink')).join('')}</div><small>${d.drinks.length?d.drinks.map(x=>x.name).join('、'):'未選飲品'}</small></section>`:''}${p.linkUp?`<section class="linkup-box"><strong>Link Up 套餐提示</strong><span>${d.options.snack&&d.drinks.length?'已齊飯團＋小食＋飲品，可組成飯團套餐':'可補選小食及飲品；未選小食不算欠項'}</span></section>`:''}</div><aside class="detail-right"><div class="qty"><button data-action="qty-minus">−</button><button data-action="open-keypad">${d.qty}</button><button data-action="qty-plus">＋</button></div><dl><dt>單價</dt><dd>${money(d.unitPrice)}</dd><dt>小計</dt><dd>${money(d.unitPrice*d.qty)}</dd></dl><footer>${m.lineId?`<button class="danger ghost" data-action="delete-line">刪除產品</button>`:'<button data-action="close-modal">取消</button>'}<button class="primary" data-action="apply-product">${m.lineId?'確認修改':'加入購物車'}</button></footer></aside></div>`));}
function openDrinkEditor(drinkId,context='detail'){const d=drinkMap.get(drinkId);state.modal.sub={drinkId,context,sweetness:'正常甜',ice:'正常冰'};drawDrinkEditor();}
function drawDrinkEditor(){const s=state.modal.sub,d=drinkMap.get(s.drinkId);mountModal(modalFrame(`<header><strong>${esc(d.name)}</strong><button data-action="back-product">×</button></header>${d.sweet?`<label>甜度</label><div class="chips">${DATA.optionSets.sweetness.map(v=>`<button data-action="set-drink-mod" data-key="sweetness" data-value="${v}" class="${s.sweetness===v?'active':''}">${v}</button>`).join('')}</div>`:''}${d.ice?`<label>冰量</label><div class="chips">${DATA.optionSets.ice.map(v=>`<button data-action="set-drink-mod" data-key="ice" data-value="${v}" class="${s.ice===v?'active':''}">${v}</button>`).join('')}</div>`:''}<button class="primary full" data-action="apply-drink">套用</button>`,'drink-modal'));}

function applyProduct(){const m=state.modal,d=normalizeLine(m.draft),missing=lineMissing(d);if(missing)return toast(`尚欠 ${missing} 個必選項目`);if(m.lineId){const i=state.cart.findIndex(l=>l.lineId===m.lineId);if(i>=0)state.cart[i]=d;}else state.cart=mergeCart([...state.cart,d]);state.modal=null;render();toast(m.lineId?'修改已套用':'已加入購物車');}
function assignQuickDrink(drinkId){const slots=missingDrinkSlots();if(!slots)return toast('目前沒有待補飲品');const d=drinkMap.get(drinkId);let left=1;for(const line of state.cart){const miss=Math.max(0,line.drinkSlots-line.drinks.length);if(miss&&left){line.drinks.push({drinkId:d.id,name:d.name,unitPrice:d.price,sweetness:'正常甜',ice:'正常冰'});left--;}}render();toast('已補選 1 份飲品');}
function updateSetting(fn){fn(state.settings);state.cart=mergeCart(state.cart);render();}

function handleAction(e){const el=e.target.closest('[data-action]');if(!el)return;const a=el.dataset.action;
if(a==='category'){state.category=el.dataset.value;render();}
else if(a==='open-product')openProduct(el.dataset.id);
else if(a==='edit-line'){const l=state.cart.find(x=>x.lineId===el.dataset.id);if(l)openProduct(l.productId,l.lineId);}
else if(a==='toggle-side'){state.side=state.side===el.dataset.side?null:el.dataset.side;render();}
else if(a==='close-side'){state.side=null;render();}
else if(a==='toggle-pending-expand'){state.pendingExpanded=!state.pendingExpanded;render();}
else if(a==='set-template')updateSetting(s=>s.catalog.defaultTemplate=el.dataset.value);
else if(a==='toggle-code')updateSetting(s=>s.catalog.showCode=!s.catalog.showCode);
else if(a==='toggle-quick-drinks')updateSetting(s=>s.quickDrinks.enabled=!s.quickDrinks.enabled);
else if(a==='toggle-quick-images')updateSetting(s=>s.quickDrinks.showImages=!s.quickDrinks.showImages);
else if(a==='toggle-quick-assist')updateSetting(s=>s.quickAssist.enabled=!s.quickAssist.enabled);
else if(a==='set-merge')updateSetting(s=>s.cart.mergeMode=el.dataset.value);
else if(a==='quick-drink')assignQuickDrink(el.dataset.id);
else if(a==='open-quick-settings'){state.side='settings';render();}
else if(a==='clear-cart'){if(confirm('清空後不可恢復，確定清空整張購物車？')){state.cart=[];render();}}
else if(a==='checkout'){const miss=totalMissing();if(miss)return toast(`請先完成 ${miss} 個必選項目`);API.submitOrder({items:state.cart,total:state.cart.reduce((n,l)=>n+l.total,0)}).then(()=>toast('訂單已準備提交'));}
else if(a==='close-modal')closeModal();
else if(a==='choose-option'){state.modal.draft.options[el.dataset.group]=el.dataset.value;state.modal.dirty=true;drawProductModal();}
else if(a==='choose-detail-drink')openDrinkEditor(el.dataset.id,'detail');
else if(a==='set-drink-mod'){state.modal.sub[el.dataset.key]=el.dataset.value;drawDrinkEditor();}
else if(a==='apply-drink'){const s=state.modal.sub,d=drinkMap.get(s.drinkId);state.modal.draft.drinks=[{drinkId:d.id,name:d.name,unitPrice:d.price,sweetness:s.sweetness,ice:s.ice}];state.modal.dirty=true;delete state.modal.sub;drawProductModal();}
else if(a==='back-product'){delete state.modal.sub;drawProductModal();}
else if(a==='qty-minus'){state.modal.draft.qty=Math.max(1,state.modal.draft.qty-1);state.modal.draft.drinkSlots=(productMap.get(state.modal.productId).drinkSlots||0)*state.modal.draft.qty;state.modal.dirty=true;drawProductModal();}
else if(a==='qty-plus'){state.modal.draft.qty++;state.modal.draft.drinkSlots=(productMap.get(state.modal.productId).drinkSlots||0)*state.modal.draft.qty;state.modal.dirty=true;drawProductModal();}
else if(a==='open-keypad'){const n=Number(prompt('輸入數量',state.modal.draft.qty));if(Number.isFinite(n)&&n>0){state.modal.draft.qty=Math.min(99,Math.floor(n));state.modal.dirty=true;drawProductModal();}}
else if(a==='apply-product')applyProduct();
else if(a==='delete-line'){state.cart=state.cart.filter(l=>l.lineId!==state.modal.lineId);state.modal=null;render();toast('產品已刪除');}
else if(a==='cancel-confirm'){state.modal=null;render();}
else if(a==='confirm-leave'){const fn=state.modal.onConfirm;state.modal=null;fn?.();}
}

document.addEventListener('click',handleAction);
window.addEventListener('error',e=>{console.error(e.error||e.message);toast('操作未完成，資料已保留');});
window.addEventListener('unhandledrejection',e=>{console.error(e.reason);toast('操作未完成，資料已保留');});
render();
