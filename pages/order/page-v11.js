import {
  categories,products,quickDrinks,sweetnessOptions,iceOptions,riceOptions,sauceOptions,pendingOrders,
  ORDER_STORAGE_KEY,DRAFT_STORAGE_KEY,INCOMING_ORDER_STORAGE_KEY,
  createInitialCart,getProductAddDecision,addProductToCart,getPendingState,getMissingDrinkSlots,
  addQuickDrink,removeQuickDrink,quickDrinkGroupQuantity,quickDrinkTotalQuantity,getCartTotal,getCartItemCount,
  describeLine,createDraft,restoreDraft
} from './page-data-v11.js';

const app=document.getElementById('app');
const clone=value=>JSON.parse(JSON.stringify(value));
const money=value=>`$${Number(value||0).toFixed(0)}`;
const productById=id=>products.find(item=>item.id===id);
const drinkById=id=>quickDrinks.find(item=>item.id===id);

function loadJSON(key,fallback){
  try{
    const value=JSON.parse(localStorage.getItem(key)||'null');
    return value??fallback;
  }catch{return fallback}
}

const saved=loadJSON(ORDER_STORAGE_KEY,null);
const state={
  category:'全部',
  cart:Array.isArray(saved?.cart)?saved.cart:createInitialCart(),
  drafts:Array.isArray(loadJSON(DRAFT_STORAGE_KEY,[]))?loadJSON(DRAFT_STORAGE_KEY,[]):[],
  card:null,
  cardDirty:false,
  editId:null,
  editDraft:null,
  search:false,
  settings:false,
  quick:saved?.quick??true,
  drinkMode:saved?.drinkMode||'all',
  showDrinks:saved?.showDrinks??true,
  modal:null,
  modalDirty:false,
  modalSnapshot:null,
  drinkDraft:null,
  productDraft:null,
  pendingOrderId:null,
  toast:''
};
let toastTimer=null;

function persist(){
  localStorage.setItem(ORDER_STORAGE_KEY,JSON.stringify({cart:state.cart,quick:state.quick,drinkMode:state.drinkMode,showDrinks:state.showDrinks}));
  localStorage.setItem(DRAFT_STORAGE_KEY,JSON.stringify(state.drafts));
}
function flash(text){
  state.toast=text;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{state.toast='';render()},1500);
}
function confirmDiscard(){return window.confirm('有未儲存改動，確定離開並放棄改動？')}
function openModal(type,{snapshot=null}={}){
  state.modal=type;
  state.modalDirty=false;
  state.modalSnapshot=snapshot?clone(snapshot):null;
}
function restoreModalSnapshot(){
  if(!state.modalSnapshot)return;
  if(state.modal==='drink')state.cart=clone(state.modalSnapshot.cart);
  if(state.modal==='settings'){
    state.quick=state.modalSnapshot.quick;
    state.drinkMode=state.modalSnapshot.drinkMode;
    state.showDrinks=state.modalSnapshot.showDrinks;
  }
}
function closeModal({force=false,discard=true}={}){
  if(!force&&state.modalDirty&&!confirmDiscard())return false;
  if(discard&&state.modalDirty)restoreModalSnapshot();
  state.modal=null;
  state.modalDirty=false;
  state.modalSnapshot=null;
  state.drinkDraft=null;
  state.productDraft=null;
  state.pendingOrderId=null;
  return true;
}
function openCard(type,{lineId=null}={}){
  state.card=type;
  state.cardDirty=false;
  state.editId=lineId;
  state.editDraft=lineId?clone(state.cart.find(row=>row.lineId===lineId)||null):null;
}
function closeCard({force=false}={}){
  if(!force&&state.cardDirty&&!confirmDiscard())return false;
  state.card=null;
  state.cardDirty=false;
  state.editId=null;
  state.editDraft=null;
  return true;
}

function top(){
  return `<header class="topbar"><div class="brand"><span class="logo"></span><span>磨飯 SMT</span></div><div class="serial"><small>流水號</small><strong>10248</strong></div><div class="top-spacer"></div><button class="top-action" data-action="pending">待處理 <span class="badge">${pendingOrders.length}</span></button><button class="top-action" data-action="quick-settings">快速 <span class="switch ${state.quick?'on':''}"></span></button><button class="top-action online">● 線上</button></header>`;
}
function nav(){
  return `<nav class="bottom-nav"><button class="active" data-route="order">點單</button><button data-route="orders">訂單</button><button data-route="dine">堂食</button><button data-route="supply">售罄</button><button data-route="more">更多</button></nav>`;
}
function cartRows(){
  if(!state.cart.length)return '<div class="empty-cart"><strong>購物車未有餐點</strong><small>由右側商品卡開始點單</small></div>';
  return state.cart.map(row=>`<button class="cart-row" data-action="edit" data-id="${row.lineId}"><img src="${row.image}" alt=""><span><h3>${row.name}</h3><small class="${describeLine(row).includes('尚欠')?'missing-copy':''}">${describeLine(row)}</small></span><span class="cart-price">x${row.qty}<br>${money(row.total)}</span></button>`).join('');
}
function productRows(){
  return products.filter(p=>state.category==='全部'||(state.category==='人氣推薦'&&p.tag)||p.category===state.category).map(p=>`<button class="product" data-action="add" data-id="${p.id}">${p.tag?`<span class="tag">${p.tag}</span>`:''}<img src="${p.image}" alt=""><div class="meta"><h3>${p.name}</h3><small>${p.code}${p.requiredGroups?.length?' · 有必選':''}</small><strong>${money(p.price)}</strong></div></button>`).join('');
}
function fieldOptions(title,action,group,values,selected){
  return `<div class="field"><h4>${title}</h4><div class="options">${values.map(value=>`<button class="option ${selected===value?'active':''}" data-action="${action}" data-group="${group}" data-value="${value}">${value}</button>`).join('')}</div></div>`;
}
function editCard(){
  const row=state.editDraft;
  if(!row)return '';
  const missing=getPendingState([row]).requiredMissing;
  return `<section class="workspace-card card-edit" data-overlay-panel><header><strong>修改卡｜${row.name}</strong><button class="close" data-action="close-card">×</button></header><div class="body">${row.requiredGroups?.includes('rice')?fieldOptions('飯底','edit-option','rice',riceOptions,row.options?.rice):''}${row.requiredGroups?.includes('sauce')?fieldOptions('醬汁','edit-option','sauce',sauceOptions,row.options?.sauce):''}${row.requiredGroups?.includes('drink')?`<div class="field"><h4>飲品</h4><p>${describeLine(row)}</p><button class="btn primary" data-action="completion-drink-open">快捷補選飲品</button></div>`:''}<div class="field"><h4>狀態</h4><p>${missing.length?`尚欠 ${missing.reduce((n,x)=>n+x.count,0)} 項必選內容`:'必選內容已完成'}</p></div><button class="btn primary" style="width:100%" data-action="edit-save">儲存修改</button></div></section>`;
}
function completionCard(){
  const pending=getPendingState(state.cart);
  const rows=pending.requiredMissing.map(item=>{
    const line=state.cart.find(row=>row.lineId===item.lineId);
    const action=item.group==='drink'?'completion-drink-open':'completion-edit';
    return `<article class="pending-required-row"><span><strong>${line?.name||'餐點'}</strong><small>${item.label}尚欠 ${item.count} 份</small></span><button class="btn primary" data-action="${action}" data-line-id="${item.lineId}">立即補選</button></article>`;
  }).join('');
  return `<section class="workspace-card card-edit" data-overlay-panel><header><strong>待補區 ${pending.requiredMissingCount?`<span class="badge">${pending.requiredMissingCount}</span>`:''}</strong><button class="close" data-action="close-card">×</button></header><div class="body"><section class="completion-section"><header><h3 style="color:var(--red)">必須項目</h3><b>${pending.requiredMissingCount?'不可結帳':'全部完成'}</b></header>${rows||'<p class="complete-message">目前沒有待補項目。</p>'}</section><section class="completion-section"><header><h3 style="color:var(--green)">可組合</h3><b>可略過</b></header><p>目前沒有需要處理的可組合建議。</p></section></div></section>`;
}
function pendingCard(){
  const appOrders=pendingOrders.filter(item=>item.source==='磨飯 App');
  const phone=pendingOrders.filter(item=>item.source!=='磨飯 App');
  const group=(title,items)=>`<section class="pending-section"><strong>${title} <span class="badge">${items.length}</span></strong>${items.map(item=>`<button class="pending-order-row" data-action="pending-order-open" data-id="${item.id}"><span><b>${item.id} ${item.customer}</b><small>${item.source} · ${item.payment}</small></span><strong>${item.itemCount}件 · ${money(item.total)}</strong></button>`).join('')}</section>`;
  return `<section class="workspace-card card-pending" data-overlay-panel><header><strong>待處理</strong><button class="close" data-action="close-card">×</button></header><div class="body">${group('新 App 單',appOrders)}${group('電話／WhatsApp 核對',phone)}</div></section>`;
}
function draftsCard(){
  return `<section class="workspace-card card-edit" data-overlay-panel><header><strong>取回暫存單</strong><button class="close" data-action="close-card">×</button></header><div class="body">${state.drafts.length?state.drafts.map(draft=>`<article class="draft-row"><span><strong>${draft.label}</strong><small>${new Date(draft.createdAt).toLocaleString('zh-HK')} · ${draft.itemCount}件 · ${money(draft.total)}</small></span><div><button class="btn" data-action="draft-delete" data-id="${draft.id}">刪除</button><button class="btn primary" data-action="draft-restore" data-id="${draft.id}">取單</button></div></article>`).join(''):'<p class="complete-message">目前沒有暫存單。</p>'}</div></section>`;
}
function workspaceOverlay(){
  const card=state.card==='edit'?editCard():state.card==='completion'?completionCard():state.card==='pending'?pendingCard():state.card==='drafts'?draftsCard():'';
  if(!card)return '';
  return `<div class="workspace-backdrop" data-action="backdrop-close"></div>${card}`;
}
function modalShell(content,classes=''){
  return `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal ${classes}" data-overlay-panel>${content}</section></div>`;
}
function settingsModal(){
  return modalShell(`<header><h2>快速模式與快捷飲品設定</h2><button class="close" data-action="modal-close">×</button></header><section class="settings-section"><button class="settings-head">A　快速模式 <span>⌃</span></button><div class="settings-body"><div class="mode-grid"><button class="mode-card ${!state.quick?'active':''}" data-action="mode" data-value="normal"><h3>普通模式</h3><p>無必選直接加入；有必選先完成產品設定，之後才加入購物車。</p></button><button class="mode-card ${state.quick?'active':''}" data-action="mode" data-value="quick"><h3>快速模式</h3><p>所有商品直接加入；未完成必選即時進入待補區。</p></button></div></div></section><section class="settings-section"><button class="settings-head">B　快捷飲品 <span>⌃</span></button><div class="settings-body"><div class="mode-grid"><button class="mode-card ${state.drinkMode==='all'?'active':''}" data-action="drink-mode" data-value="all"><h3>全部套餐可選飲品</h3><p>顯示全部可補選飲品。</p></button><button class="mode-card ${state.drinkMode==='custom'?'active':''}" data-action="drink-mode" data-value="custom"><h3>自訂飲品</h3><p>按後台設定順序顯示。</p></button></div><div class="settings-row"><span>顯示快捷飲品區域</span><button class="switch ${state.showDrinks?'on':''}" data-action="toggle-drinks"></button></div></div></section><div class="settings-foot"><button class="btn" data-action="settings-reset">重設</button><button class="btn primary" data-action="settings-apply">套用設定</button></div>`,'settings-modal');
}
function quickDrinkRail(){
  const missing=getMissingDrinkSlots(state.cart);
  const drinks=state.drinkMode==='custom'?quickDrinks.slice(0,6):quickDrinks;
  return `<div class="quick-drinks"><div class="quick-drink-summary"><strong>快捷飲品補充</strong><small>${missing?`尚需選擇 ${missing} 杯飲品`:'沒有待補飲品'}</small></div><div class="quick-drink-scroll">${drinks.map(item=>{const qty=quickDrinkTotalQuantity(state.cart,item.id);return `<button data-action="drink" data-value="${item.id}" ${missing?'':'disabled'}>${item.name}${qty?` <span class="drink-count">${qty}</span>`:''}</button>`}).join('')}</div></div>`;
}
function drinkPicker(){
  const drink=drinkById(state.drinkDraft?.drinkId);
  if(!drink)return '';
  const sweetness=state.drinkDraft.sweetness||'正常甜';
  const ice=state.drinkDraft.ice||'正常冰';
  const qty=quickDrinkGroupQuantity(state.cart,drink.id,sweetness,ice);
  const missing=getMissingDrinkSlots(state.cart);
  const choice=(name,values,selected,action)=>`<div class="picker-field"><h3>${name}</h3><div class="picker-options">${values.map(value=>`<button class="${selected===value?'active':''}" data-action="${action}" data-value="${value}">${value}</button>`).join('')}</div></div>`;
  return modalShell(`<header><div><h2>${drink.name}</h2><small>尚可補選 ${missing} 杯；同一設定會合併計數</small></div><button class="close" data-action="modal-close">×</button></header>${drink.options.includes('sweetness')?choice('甜度',sweetnessOptions,sweetness,'drink-sweet'):''}${drink.options.includes('ice')?choice('冰量',iceOptions,ice,'drink-ice'):''}<div class="drink-qty"><button data-action="drink-minus" ${qty?'':'disabled'}>−</button><div><strong>${qty}</strong><small>${[sweetness,ice].filter(value=>!value.startsWith('正常')).join(' · ')||'正常設定'}</small></div><button data-action="drink-plus" ${missing?'':'disabled'}>＋</button></div><p class="picker-note">冰量只提供正常冰、少冰、多冰，沒有走冰。</p><button class="btn primary" style="width:100%;margin-top:14px" data-action="drink-apply">完成</button>`,'drink-picker');
}
function productConfig(){
  const draft=state.productDraft;
  const product=productById(draft?.productId);
  if(!product)return '';
  const opts=draft.options||{};
  const drink=draft.drink;
  const selectedDrink=drinkById(drink?.drinkId);
  const complete=(product.requiredGroups||[]).every(group=>group==='drink'?Boolean(drink):Boolean(opts[group]));
  return modalShell(`<header><div><h2>${product.name}</h2><small>普通模式：完成必選後才加入購物車</small></div><button class="close" data-action="modal-close">×</button></header>${product.requiredGroups.includes('rice')?fieldOptions('飯底','draft-option','rice',riceOptions,opts.rice):''}${product.requiredGroups.includes('sauce')?fieldOptions('醬汁','draft-option','sauce',sauceOptions,opts.sauce):''}${product.requiredGroups.includes('drink')?`<div class="field"><h4>必選飲品</h4><div class="picker-options">${quickDrinks.slice(0,5).map(item=>`<button class="${drink?.drinkId===item.id?'active':''}" data-action="draft-drink" data-value="${item.id}">${item.name}</button>`).join('')}</div>${selectedDrink?.options.includes('sweetness')?fieldOptions('甜度','draft-drink-sweet','sweetness',sweetnessOptions,drink.sweetness):''}${selectedDrink?.options.includes('ice')?fieldOptions('冰量','draft-drink-ice','ice',iceOptions,drink.ice):''}</div>`:''}<button class="btn primary" style="width:100%" data-action="product-config-save" ${complete?'':'disabled'}>完成並加入購物車</button>`,'product-config');
}
function pendingOrderModal(){
  const item=pendingOrders.find(order=>order.id===state.pendingOrderId);
  if(!item)return '';
  return modalShell(`<header><div><h2>${item.id}｜${item.customer}</h2><small>${item.source}</small></div><button class="close" data-action="modal-close">×</button></header><div class="pending-detail-summary"><span>${item.itemCount} 件餐點</span><strong>${money(item.total)}</strong></div><div class="pending-detail-items">${item.items.map(row=>`<div>${row}</div>`).join('')}</div><div class="pending-payment">付款狀態：<strong>${item.payment}</strong></div><button class="btn primary" style="width:100%" data-action="pending-order-accept">開啟並處理訂單</button>`,'pending-detail');
}
function modalOverlay(){
  if(state.modal==='settings')return settingsModal();
  if(state.modal==='drink')return drinkPicker();
  if(state.modal==='product')return productConfig();
  if(state.modal==='pending-order')return pendingOrderModal();
  return '';
}

function render(){
  const pending=getPendingState(state.cart);
  const total=getCartTotal(state.cart);
  app.innerHTML=`<div class="app">${top()}<main class="workspace"><section class="order-layout"><aside class="cart panel"><div class="cart-head"><h2>購物車（${getCartItemCount(state.cart)}）</h2><button class="btn" data-action="clear" ${state.cart.length?'':'disabled'}>清空</button></div><div class="cart-list">${cartRows()}</div><div class="cart-foot"><button class="completion-bar ${pending.requiredMissingCount?'has-pending':''}" data-action="completion" ${pending.requiredMissingCount?'':'disabled'}><span>待補區</span><span>${pending.requiredMissingCount?`<b class="badge">${pending.requiredMissingCount}</b>`:'0'}　⌄</span></button><div class="cart-actions"><button class="btn" data-action="${state.cart.length?'draft-save':'draft-open'}">${state.cart.length?'暫存':'取單'}</button><button class="btn primary" data-action="checkout" ${state.cart.length?'':'disabled'}>${pending.canCheckout?`結帳 ${money(total)}`:'先整理'}</button></div></div></aside><section class="catalog panel"><div class="catalog-top"><div class="category-grid">${categories.map(x=>`<button class="${state.category===x?'active':''}" data-action="category" data-value="${x}">${x}</button>`).join('')}</div></div><div class="product-area"><div class="products">${productRows()}</div></div>${state.showDrinks?quickDrinkRail():''}</section></section></main>${nav()}</div>${workspaceOverlay()}${state.search?`<div class="search-backdrop" data-action="backdrop-close"><section class="search-pop" data-overlay-panel><button class="close" data-action="search-close">×</button><h3>搜尋商品</h3><input placeholder="輸入商品名稱或編號"></section></div>`:''}${modalOverlay()}<div id="toast" class="toast ${state.toast?'show':''}">${state.toast}</div>`;
  bind();
}
function bind(){
  document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>window.MoreFunPageBridge.navigate(button.dataset.route)));
  document.querySelectorAll('[data-action]').forEach(element=>element.addEventListener('click',event=>{
    if(element.dataset.action==='backdrop-close'&&event.target!==element)return;
    event.preventDefault();
    event.stopPropagation();
    handle(element);
  }));
}
function handle(button){
  const a=button.dataset.action;
  if(a==='backdrop-close'){
    if(state.modal)closeModal();
    else if(state.card)closeCard();
    else if(state.search)state.search=false;
  }
  if(a==='pending')openCard('pending');
  if(a==='quick-settings'){
    openModal('settings',{snapshot:{quick:state.quick,drinkMode:state.drinkMode,showDrinks:state.showDrinks}});
  }
  if(a==='edit')openCard('edit',{lineId:button.dataset.id});
  if(a==='completion')openCard('completion');
  if(a==='close-card')closeCard();
  if(a==='category'){
    if(button.dataset.value==='搜尋')state.search=true;
    else state.category=button.dataset.value;
  }
  if(a==='search-close')state.search=false;
  if(a==='mode'){state.quick=button.dataset.value==='quick';state.modalDirty=true}
  if(a==='drink-mode'){state.drinkMode=button.dataset.value;state.modalDirty=true}
  if(a==='toggle-drinks'){state.showDrinks=!state.showDrinks;state.modalDirty=true}
  if(a==='settings-reset'){state.quick=true;state.drinkMode='all';state.showDrinks=true;state.modalDirty=true}
  if(a==='settings-apply'){persist();closeModal({force:true,discard:false})}
  if(a==='clear'){state.cart=[];closeCard({force:true});persist();flash('購物車已清空')}
  if(a==='add'){
    const product=productById(button.dataset.id);
    const decision=getProductAddDecision(product,state.quick);
    if(decision==='configure-before-add'){
      state.productDraft={productId:product.id,options:{},drink:null};
      openModal('product');
    }else{
      state.cart=addProductToCart(state.cart,product,{quickMode:state.quick});
      persist();
      flash(decision==='add-with-pending'?`已加入 ${product.name}，請到待補區完成必選`:`已加入 ${product.name}`);
    }
  }
  if(a==='checkout'){
    const pending=getPendingState(state.cart);
    if(!pending.canCheckout){openCard('completion');flash(`尚欠 ${pending.requiredMissingCount} 項必選內容`)}
    else{persist();window.MoreFunPageBridge.navigate('checkout');return}
  }
  if(a==='drink'){
    if(!getMissingDrinkSlots(state.cart))flash('目前沒有待補飲品');
    else{
      const drink=drinkById(button.dataset.value);
      state.drinkDraft={drinkId:drink.id,sweetness:'正常甜',ice:'正常冰'};
      openModal('drink',{snapshot:{cart:state.cart}});
    }
  }
  if(a==='completion-drink-open'){
    if(getMissingDrinkSlots(state.cart)){
      state.drinkDraft={drinkId:'taiwan-milk-tea',sweetness:'正常甜',ice:'正常冰'};
      openModal('drink',{snapshot:{cart:state.cart}});
    }else flash('飲品必選已完成');
  }
  if(a==='completion-edit')openCard('edit',{lineId:button.dataset.lineId});
  if(a==='drink-sweet'){state.drinkDraft.sweetness=button.dataset.value;state.modalDirty=true}
  if(a==='drink-ice'){state.drinkDraft.ice=button.dataset.value;state.modalDirty=true}
  if(a==='drink-plus'){
    const drink=drinkById(state.drinkDraft.drinkId);
    state.cart=addQuickDrink(state.cart,{drinkId:drink.id,name:drink.name,unitPrice:drink.price,sweetness:state.drinkDraft.sweetness,ice:state.drinkDraft.ice});
    state.modalDirty=true;
  }
  if(a==='drink-minus'){
    const drink=drinkById(state.drinkDraft.drinkId);
    state.cart=removeQuickDrink(state.cart,{drinkId:drink.id,name:drink.name,sweetness:state.drinkDraft.sweetness,ice:state.drinkDraft.ice});
    state.modalDirty=true;
  }
  if(a==='drink-apply'){persist();closeModal({force:true,discard:false})}
  if(a==='modal-close')closeModal();
  if(a==='draft-option'){state.productDraft.options[button.dataset.group]=button.dataset.value;state.modalDirty=true}
  if(a==='draft-drink'){
    const drink=drinkById(button.dataset.value);
    state.productDraft.drink={drinkId:drink.id,name:drink.name,unitPrice:drink.price,sweetness:'正常甜',ice:'正常冰'};
    state.modalDirty=true;
  }
  if(a==='draft-drink-sweet'){state.productDraft.drink.sweetness=button.dataset.value;state.modalDirty=true}
  if(a==='draft-drink-ice'){state.productDraft.drink.ice=button.dataset.value;state.modalDirty=true}
  if(a==='product-config-save'){
    const product=productById(state.productDraft.productId);
    state.cart=addProductToCart(state.cart,product,{quickMode:false,options:state.productDraft.options,drink:state.productDraft.drink});
    persist();
    closeModal({force:true,discard:false});
    flash(`已加入 ${product.name}`);
  }
  if(a==='edit-option'){
    state.editDraft.options=state.editDraft.options||{};
    state.editDraft.options[button.dataset.group]=button.dataset.value;
    state.cardDirty=true;
  }
  if(a==='edit-save'){
    state.cart=state.cart.map(row=>row.lineId===state.editDraft.lineId?clone(state.editDraft):row);
    persist();
    closeCard({force:true});
    flash('修改已儲存');
  }
  if(a==='draft-save'){
    const number=state.drafts.length+1;
    state.drafts.unshift(createDraft(state.cart,{label:`暫存單 ${number}`}));
    state.cart=[];
    persist();
    flash('已暫存，購物車已清空');
  }
  if(a==='draft-open')openCard('drafts');
  if(a==='draft-restore'){
    const draft=state.drafts.find(item=>item.id===button.dataset.id);
    if(draft){state.cart=restoreDraft(draft);state.drafts=state.drafts.filter(item=>item.id!==draft.id);persist();closeCard({force:true});flash('已取回暫存單')}
  }
  if(a==='draft-delete'){state.drafts=state.drafts.filter(item=>item.id!==button.dataset.id);persist()}
  if(a==='pending-order-open'){
    state.pendingOrderId=button.dataset.id;
    openModal('pending-order');
  }
  if(a==='pending-order-accept'){
    const order=pendingOrders.find(item=>item.id===state.pendingOrderId);
    if(order)localStorage.setItem(INCOMING_ORDER_STORAGE_KEY,JSON.stringify(order));
    closeModal({force:true,discard:false});
    flash('已開啟訂單處理流程');
  }
  persist();
  render();
}
render();
