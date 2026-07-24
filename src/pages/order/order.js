import {MOCK_CATEGORIES,MOCK_PRODUCTS,MOCK_PENDING} from '../../data/mock-catalog.js';

const state={category:'all',query:'',ratio:localStorage.getItem('smt-workspace-ratio')||'30-70',fast:false,cart:[],draft:null,quickDrink:null,modal:null};

const money=v=>`$${Number(v||0).toFixed(0)}`;
const total=()=>state.cart.reduce((s,l)=>s+l.price*l.qty,0);
const count=()=>state.cart.reduce((s,l)=>s+l.qty,0);
const productById=id=>MOCK_PRODUCTS.find(p=>p.id===id);

function addLine(product,config={}){
  const key=`${product.id}:${JSON.stringify(config)}`;
  const found=state.cart.find(l=>l.key===key);
  if(found)found.qty+=1;else state.cart.push({key,id:product.id,name:product.name,price:product.price,qty:1,config});
}

function updateQty(key,delta){
  const line=state.cart.find(l=>l.key===key);if(!line)return;
  line.qty+=delta;if(line.qty<=0)state.cart=state.cart.filter(l=>l.key!==key);
}

function filtered(){
  const q=state.query.trim().toLowerCase();
  return MOCK_PRODUCTS.filter(p=>{
    const categoryOk=state.category==='all'||p.category===state.category;
    const searchOk=!q||`${p.name} ${p.code} ${p.subtitle}`.toLowerCase().includes(q);
    return categoryOk&&searchOk;
  });
}

function openProduct(product){
  if(product.soldout)return;
  if(product.required||product.combo){state.modal={type:'product',productId:product.id,selected:null,drink:null};return;}
  addLine(product);state.modal=null;
}

function renderProductGrid(){
  const list=filtered();
  if(!list.length)return `<div class="empty-state">沒有符合搜尋條件的測試商品</div>`;
  return list.map(p=>`<button type="button" class="product-card product-card--${p.card}${p.soldout?' is-soldout':''}" data-product="${p.id}" ${p.soldout?'disabled':''}><span class="product-code">${p.code}</span><strong>${p.name}</strong><span>${p.subtitle}</span><b>${money(p.price)}</b>${p.soldout?'<em>售罄</em>':''}</button>`).join('');
}

function renderCart(){
  if(!state.cart.length)return `<div class="cart-empty"><strong>購物車暫時未有項目</strong><span>按右側測試商品加入。</span></div>`;
  return state.cart.map(line=>`<article class="cart-line"><div class="cart-line__main"><strong>${line.name}</strong><span>${Object.values(line.config||{}).filter(Boolean).join('｜')||'標準'}</span></div><b>${money(line.price*line.qty)}</b><div class="cart-line__actions"><button data-cart="minus" data-key='${line.key}'>－</button><span>${line.qty}</span><button data-cart="plus" data-key='${line.key}'>＋</button><button data-cart="modify" data-key='${line.key}'>修改</button><button data-cart="delete" data-key='${line.key}'>刪除</button></div></article>`).join('');
}

function renderQuickDrinks(){
  return MOCK_PRODUCTS.filter(p=>p.drink).map(p=>`<button type="button" class="quick-drink${state.quickDrink===p.id?' is-active':''}" data-quick-drink="${p.id}"><span>${p.name}</span></button>`).join('');
}

function renderModal(){
  if(!state.modal)return '';
  if(state.modal.type==='pending')return `<div class="overlay"><section class="modal-card modal-card--wide" role="dialog" aria-modal="true"><header><h2>待處理訂單</h2></header><div class="modal-body pending-list">${MOCK_PENDING.map(o=>`<article><strong>${o.source}｜${o.id}</strong><span>${o.customer}</span><b>${money(o.amount)}</b><small>${o.wait}｜${o.payment}</small></article>`).join('')}</div><footer><button data-modal="close">返回</button></footer></section></div>`;
  if(state.modal.type==='retrieve')return `<div class="overlay"><section class="modal-card" role="dialog" aria-modal="true"><header><h2>取單</h2></header><div class="modal-body">${state.draft?`<button class="draft-card" data-draft="restore"><strong>暫存單</strong><span>${state.draft.cart.length} 行｜${money(state.draft.total)}</span></button>`:'<div class="empty-state">目前沒有暫存單</div>'}</div><footer><button data-modal="close">返回</button></footer></section></div>`;
  if(state.modal.type==='checkout')return `<div class="overlay"><section class="modal-card modal-card--wide" role="dialog" aria-modal="true"><header><h2>結帳</h2></header><div class="modal-body checkout-panel"><div><strong>商品件數</strong><b>${count()}</b></div><div><strong>應收總額</strong><b>${money(total())}</b></div><div class="payment-grid"><button data-payment="cash">現金</button><button data-payment="fps">轉數快</button><button data-payment="other">其他</button></div></div><footer><button data-modal="close">返回</button><button class="primary" data-checkout="confirm">確認測試付款</button></footer></section></div>`;
  if(state.modal.type==='quick-drink'){
    const p=productById(state.modal.productId);return `<div class="overlay"><section class="modal-card modal-card--small" role="dialog" aria-modal="true"><header><h2>${p.name}</h2></header><div class="modal-body option-list"><button data-drink-option="正常">正常</button><button data-drink-option="少甜">少甜</button><button data-drink-option="走甜">走甜</button></div><footer><button data-modal="close">返回</button><button class="primary" data-quick-apply="${p.id}">套用</button></footer></section></div>`;
  if(state.modal.type==='modify'){
    const line=state.cart.find(l=>l.key===state.modal.key);if(!line)return '';
    return `<div class="overlay"><section class="modal-card" role="dialog" aria-modal="true"><header><h2>修改｜${line.name}</h2></header><div class="modal-body option-list"><button data-mod-option="標準">標準</button><button data-mod-option="少">少</button><button data-mod-option="走">走</button></div><footer><button data-modal="close">返回</button><button class="primary" data-mod-save="${line.key}">確認修改</button></footer></section></div>`;
  const p=productById(state.modal.productId);
  return `<div class="overlay"><section class="modal-card" role="dialog" aria-modal="true"><header><h2>${p.name}</h2><span>${money(p.price)}</span></header><div class="modal-body">${p.required?`<section><h3>${p.required.title}</h3><div class="option-list">${p.required.options.map(o=>`<button data-required="${o}" class="${state.modal.selected===o?'is-active':''}">${o}</button>`).join('')}</div></section>`:''}${p.combo?`<section><h3>套餐飲品</h3><div class="option-list">${MOCK_PRODUCTS.filter(x=>x.drink).map(d=>`<button data-combo-drink="${d.id}" class="${state.modal.drink===d.id?'is-active':''}">${d.name}</button>`).join('')}</div></section>`:''}</div><footer><button data-modal="close">返回</button><button class="primary" data-product-confirm="${p.id}" ${p.required&&!state.modal.selected?'disabled':''}>確認加入 ${money(p.price)}</button></footer></section></div>`;
}

export function renderOrderPage(container){
  container.innerHTML=`<section class="order-page" data-ratio="${state.ratio}"><aside class="cart-panel"><header class="cart-head"><div><span class="test-badge">測試資料</span><h1>購物車</h1></div><button data-open="pending">待處理 ${MOCK_PENDING.length}</button></header><div class="cart-list">${renderCart()}</div><div class="cart-summary"><span>${count()} 件</span><strong>${money(total())}</strong></div><footer class="cart-footer">${state.cart.length?'<button data-draft-action="save">暫存</button>':'<button data-open="retrieve">取單</button>'}<button data-open="retrieve">取單</button><button class="checkout" data-open="checkout" ${state.cart.length?'':'disabled'}>結帳 ${money(total())}</button></footer></aside><section class="products-panel"><header class="product-toolbar"><div class="category-strip">${MOCK_CATEGORIES.map(c=>`<button data-category="${c.id}" aria-selected="${state.category===c.id}">${c.name}</button>`).join('')}</div><label class="search-box"><input id="search" type="search" value="${state.query.replaceAll('"','&quot;')}" placeholder="名稱或編號搜尋"><button type="button" data-search-clear ${state.query?'':'disabled'}>清除</button></label></header><div class="sub-toolbar"><div class="ratio-switch"><span>顯示比例</span>${['25-75','30-70','32-68'].map(r=>`<button data-ratio="${r}" aria-pressed="${state.ratio===r}">${r.replace('-', '/')}</button>`).join('')}</div><button data-fast aria-pressed="${state.fast}">${state.fast?'快捷模式':'普通模式'}</button></div><div class="product-grid">${renderProductGrid()}</div><footer class="quick-strip"><strong>快捷飲品</strong><div>${renderQuickDrinks()}</div></footer></section>${renderModal()}</section>`;
  bind(container);
}

function bind(container){
  container.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{state.category=b.dataset.category;renderOrderPage(container)}));
  const search=container.querySelector('#search');search?.addEventListener('input',e=>{state.query=e.currentTarget.value;const grid=container.querySelector('.product-grid');grid.innerHTML=renderProductGrid();bindProducts(container);const clear=container.querySelector('[data-search-clear]');clear.disabled=!state.query});
  container.querySelector('[data-search-clear]')?.addEventListener('click',()=>{state.query='';renderOrderPage(container)});
  bindProducts(container);
  container.querySelectorAll('[data-cart]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.cart,k=b.dataset.key;if(a==='plus')updateQty(k,1);if(a==='minus')updateQty(k,-1);if(a==='delete')state.cart=state.cart.filter(l=>l.key!==k);if(a==='modify')state.modal={type:'modify',key:k};renderOrderPage(container)}));
  container.querySelectorAll('[data-ratio]').forEach(b=>b.addEventListener('click',()=>{state.ratio=b.dataset.ratio;localStorage.setItem('smt-workspace-ratio',state.ratio);renderOrderPage(container)}));
  container.querySelector('[data-fast]')?.addEventListener('click',()=>{state.fast=!state.fast;renderOrderPage(container)});
  container.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{state.modal={type:b.dataset.open};renderOrderPage(container)}));
  container.querySelector('[data-draft-action="save"]')?.addEventListener('click',()=>{state.draft={cart:structuredClone(state.cart),total:total()};state.cart=[];renderOrderPage(container)});
  container.querySelectorAll('[data-quick-drink]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.quickDrink;if(state.quickDrink===id){state.quickDrink=null;renderOrderPage(container)}else{state.modal={type:'quick-drink',productId:id,option:'正常'};renderOrderPage(container)}}));
  container.querySelectorAll('[data-modal="close"]').forEach(b=>b.addEventListener('click',()=>{state.modal=null;renderOrderPage(container)}));
  container.querySelectorAll('[data-required]').forEach(b=>b.addEventListener('click',()=>{state.modal.selected=b.dataset.required;renderOrderPage(container)}));
  container.querySelectorAll('[data-combo-drink]').forEach(b=>b.addEventListener('click',()=>{state.modal.drink=b.dataset.comboDrink;renderOrderPage(container)}));
  container.querySelector('[data-product-confirm]')?.addEventListener('click',b=>{const p=productById(b.currentTarget.dataset.productConfirm);addLine(p,{required:state.modal.selected||'',drink:state.modal.drink?productById(state.modal.drink).name:''});state.modal=null;renderOrderPage(container)});
  container.querySelectorAll('[data-drink-option]').forEach(b=>b.addEventListener('click',()=>{state.modal.option=b.dataset.drinkOption;container.querySelectorAll('[data-drink-option]').forEach(x=>x.classList.toggle('is-active',x===b))}));
  container.querySelector('[data-quick-apply]')?.addEventListener('click',b=>{state.quickDrink=b.currentTarget.dataset.quickApply;addLine(productById(state.quickDrink),{drinkOption:state.modal.option||'正常'});state.modal=null;renderOrderPage(container)});
  container.querySelector('[data-draft="restore"]')?.addEventListener('click',()=>{if(state.draft){state.cart=structuredClone(state.draft.cart);state.draft=null}state.modal=null;renderOrderPage(container)});
  let modOption='標準';container.querySelectorAll('[data-mod-option]').forEach(b=>b.addEventListener('click',()=>{modOption=b.dataset.modOption;container.querySelectorAll('[data-mod-option]').forEach(x=>x.classList.toggle('is-active',x===b))}));
  container.querySelector('[data-mod-save]')?.addEventListener('click',b=>{const line=state.cart.find(l=>l.key===b.currentTarget.dataset.modSave);if(line)line.config={...line.config,adjustment:modOption};state.modal=null;renderOrderPage(container)});
  container.querySelector('[data-checkout="confirm"]')?.addEventListener('click',()=>{state.cart=[];state.modal=null;renderOrderPage(container)});
}

function bindProducts(container){container.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>{const p=productById(b.dataset.product);openProduct(p);renderOrderPage(container)}))}
