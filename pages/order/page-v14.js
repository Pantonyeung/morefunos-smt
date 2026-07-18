import {
  categories, products, quickDrinks, sweetnessOptions, iceOptions, riceOptions, sauceOptions, pendingOrders,
  ORDER_STORAGE_KEY, DRAFT_STORAGE_KEY, CHECKOUT_CONTEXT_KEY,
  createInitialCart, createStoredDraft, addStoredDraft, takeStoredDraft
} from './page-data.js';

const clone=value=>JSON.parse(JSON.stringify(value));
const money=value=>`$${Number(value||0).toFixed(0)}`;
const snackOptions=['薯角','鹽酥雞','沙律','味噌湯'];
const productIndex=new Map(products.map((item,index)=>[item.id,index]));
const productById=id=>products.find(item=>item.id===id);
const drinkById=id=>quickDrinks.find(item=>item.id===id);
const lineId=()=>`line-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

function productRules(product={}){
  const required=new Set(product.requiredGroups||[]);
  if(product.id==='custom-riceball-set'){required.add('snack');required.add('drink');}
  if(product.category==='便當'){required.add('rice');required.add('drink');}
  if(product.category==='紫米沙律'){required.add('sauce');required.add('drink');}
  if(product.category==='薯角餐'){required.add('drink');}
  const drinkSlotsPerUnit=required.has('drink')?Number(product.drinkSlotsPerUnit||1):0;
  const combinableGroup=product.combinableGroup||(product.category==='飯團'&&!required.size?'single-riceball':null);
  return {requiredGroups:[...required],drinkSlotsPerUnit,combinableGroup};
}

export function normalizeCartLine(input,index=0){
  const source=input||{};
  const product=productById(source.productId)||{};
  const rules=productRules(product);
  const qty=Math.max(1,Number(source.qty)||1);
  const unitPrice=Number(source.unitPrice??product.price??0);
  const requiredGroups=Array.isArray(source.requiredGroups)&&source.requiredGroups.length?[...new Set([...source.requiredGroups,...rules.requiredGroups])]:rules.requiredGroups;
  const slotsPerUnit=requiredGroups.includes('drink')?Math.max(1,Number(product.drinkSlotsPerUnit||source.drinkSlots/qty||1)):0;
  const drinkSlots=requiredGroups.includes('drink')?Math.max(0,Number(source.drinkSlots)||slotsPerUnit*qty):0;
  return {
    ...source,
    lineId:source.lineId||lineId(),
    productId:source.productId||product.id||`unknown-${index}`,
    name:source.name||product.name||'未命名餐點',
    detail:source.detail||product.code||'',
    qty,
    unitPrice,
    total:unitPrice*qty,
    image:source.image||product.image||'',
    category:source.category||product.category||'其他',
    requiredGroups,
    combinableGroup:source.combinableGroup||rules.combinableGroup||null,
    options:{...(source.options||{})},
    drinkSlots,
    drinkAssignments:Array.isArray(source.drinkAssignments)?clone(source.drinkAssignments):[],
    _stableOrder:Number.isFinite(source._stableOrder)?source._stableOrder:index
  };
}

export function normalizeCart(cart){return (Array.isArray(cart)?cart:[]).map(normalizeCartLine);}

export function sortCartByMenuOrder(cart){
  return normalizeCart(cart).map((line,index)=>({line,index})).sort((a,b)=>{
    const productDiff=(productIndex.get(a.line.productId)??9999)-(productIndex.get(b.line.productId)??9999);
    if(productDiff)return productDiff;
    return (a.line._stableOrder??a.index)-(b.line._stableOrder??b.index);
  }).map(({line})=>line);
}

function splitAssignments(line,applyQty){
  const perUnit=line.qty?line.drinkSlots/line.qty:0;
  const selectedSlots=Math.max(0,Math.round(perUnit*applyQty));
  return {
    selectedSlots,
    selected:(line.drinkAssignments||[]).slice(0,selectedSlots),
    remaining:(line.drinkAssignments||[]).slice(selectedSlots)
  };
}

export function applyEditToQuantity(cart,targetLineId,requestedQty,patch={}){
  const source=normalizeCart(cart);
  const targetIndex=source.findIndex(line=>line.lineId===targetLineId);
  if(targetIndex<0)return sortCartByMenuOrder(source);
  const original=source[targetIndex];
  const applyQty=Math.max(1,Math.min(original.qty,Number(requestedQty)||1));
  const assignmentSplit=splitAssignments(original,applyQty);
  const edited={
    ...clone(original),
    lineId:applyQty===original.qty?original.lineId:lineId(),
    qty:applyQty,
    total:original.unitPrice*applyQty,
    options:{...original.options,...(patch.options||{})},
    drinkSlots:assignmentSplit.selectedSlots,
    drinkAssignments:patch.drinkSelection
      ?Array.from({length:assignmentSplit.selectedSlots},()=>clone(patch.drinkSelection))
      :assignmentSplit.selected
  };
  const replacement=[edited];
  if(applyQty<original.qty){
    const remainingQty=original.qty-applyQty;
    replacement.push({
      ...clone(original),
      qty:remainingQty,
      total:original.unitPrice*remainingQty,
      drinkSlots:Math.max(0,original.drinkSlots-assignmentSplit.selectedSlots),
      drinkAssignments:assignmentSplit.remaining,
      _stableOrder:(original._stableOrder??targetIndex)+0.01
    });
  }
  return sortCartByMenuOrder([...source.slice(0,targetIndex),...replacement,...source.slice(targetIndex+1)]);
}

function getLineMissing(line){
  const missing=[];
  for(const group of line.requiredGroups||[]){
    if(group==='drink'){
      const count=Math.max(0,(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
      if(count)missing.push({lineId:line.lineId,group,label:'飲品',count});
    }else if(!line.options?.[group]){
      missing.push({lineId:line.lineId,group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':group==='snack'?'小食':group,count:1});
    }
  }
  return missing;
}
function getPending(cart){
  const normalized=normalizeCart(cart);
  const requiredMissing=normalized.flatMap(getLineMissing);
  const requiredMissingCount=requiredMissing.reduce((sum,item)=>sum+item.count,0);
  const combinable=normalized.filter(line=>line.combinableGroup).map(line=>({lineId:line.lineId,label:'單點飯團可組合',count:line.qty}));
  return {requiredMissing,requiredMissingCount,combinable,canCheckout:requiredMissingCount===0};
}
function missingDrinkSlots(cart){return normalizeCart(cart).reduce((sum,line)=>sum+Math.max(0,line.drinkSlots-line.drinkAssignments.length),0);}
function sameDrink(a,b){return a?.drinkId===b?.drinkId&&(a?.sweetness||'正常甜')===(b?.sweetness||'正常甜')&&(a?.ice||'正常冰')===(b?.ice||'正常冰');}
function drinkGroupQty(cart,selection){return normalizeCart(cart).reduce((sum,line)=>sum+line.drinkAssignments.filter(item=>sameDrink(item,selection)).length,0);}
function drinkTotalQty(cart,drinkId){return normalizeCart(cart).reduce((sum,line)=>sum+line.drinkAssignments.filter(item=>item.drinkId===drinkId).length,0);}
function addDrinkToLine(cart,targetLineId,selection){
  return sortCartByMenuOrder(normalizeCart(cart).map(line=>line.lineId===targetLineId&&line.drinkAssignments.length<line.drinkSlots?{...line,drinkAssignments:[...line.drinkAssignments,clone(selection)]}:line));
}
function removeDrinkFromLine(cart,targetLineId,selection){
  return sortCartByMenuOrder(normalizeCart(cart).map(line=>{
    if(line.lineId!==targetLineId)return line;
    let index=-1;for(let i=line.drinkAssignments.length-1;i>=0;i--){if(sameDrink(line.drinkAssignments[i],selection)){index=i;break;}}
    return index<0?line:{...line,drinkAssignments:line.drinkAssignments.filter((_,i)=>i!==index)};
  }));
}
function addDrinkToFirstMissing(cart,selection){const target=normalizeCart(cart).find(line=>line.drinkAssignments.length<line.drinkSlots);return target?addDrinkToLine(cart,target.lineId,selection):cart;}
function removeDrinkAnywhere(cart,selection){const normalized=normalizeCart(cart);for(let i=normalized.length-1;i>=0;i--){if(normalized[i].drinkAssignments.some(item=>sameDrink(item,selection)))return removeDrinkFromLine(normalized,normalized[i].lineId,selection);}return normalized;}
function cartTotal(cart){return normalizeCart(cart).reduce((sum,line)=>sum+line.total,0);}
function cartCount(cart){return normalizeCart(cart).reduce((sum,line)=>sum+line.qty,0);}
function describe(line){
  const parts=[];
  for(const key of ['rice','sauce','snack','adjustment'])if(line.options?.[key])parts.push(line.options[key]);
  const grouped=new Map();
  for(const drink of line.drinkAssignments||[]){const key=[drink.name,drink.sweetness||'正常甜',drink.ice||'正常冰'].join('|');grouped.set(key,(grouped.get(key)||0)+1);}
  for(const [key,qty] of grouped){const [name,sweetness,ice]=key.split('|');const modifiers=[sweetness,ice].filter(value=>!value.startsWith('正常')).join(' · ');parts.push(`${name}${modifiers?` · ${modifiers}`:''}${qty>1?` ×${qty}`:''}`);}
  const missing=Math.max(0,(line.drinkSlots||0)-(line.drinkAssignments||[]).length);if(missing)parts.push(`尚欠飲品 ${missing} 份`);
  return parts.join(' · ')||line.detail||'標準';
}

if(typeof document!=='undefined')initOrderPage();

function initOrderPage(){
  const app=document.getElementById('app');
  const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}};
  const saved=readJSON(ORDER_STORAGE_KEY,null);
  const state={category:'全部',cart:sortCartByMenuOrder(saved?.cart||createInitialCart()),drafts:readJSON(DRAFT_STORAGE_KEY,[]),card:null,modal:null,quick:saved?.quick??true,drinkMode:saved?.drinkMode||'all',showDrinks:saved?.showDrinks??true,quickDrinkOrder:Array.isArray(saved?.quickDrinkOrder)?saved.quickDrinkOrder:quickDrinks.map(item=>item.id),editId:null,editRequest:null,productDraft:null,drinkDraft:null,quickPopover:null,pendingOrderId:null,pendingExpandedAll:false,pendingGroupOpen:{app:true,phone:true},pendingGroupExpanded:{app:false,phone:false},quickCardDraft:null,dirty:false,toast:''};
  let toastTimer=0;

  function persist(){localStorage.setItem(ORDER_STORAGE_KEY,JSON.stringify({cart:state.cart,quick:state.quick,drinkMode:state.drinkMode,showDrinks:state.showDrinks,quickDrinkOrder:state.quickDrinkOrder}));localStorage.setItem(DRAFT_STORAGE_KEY,JSON.stringify(state.drafts));}
  function flash(text){state.toast=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{state.toast='';render();},1500);}
  function confirmDiscard(){return window.confirm('尚未儲存變更，確定返回？');}
  function closeOverlay(force=false){if(!force&&state.dirty&&!confirmDiscard())return false;state.modal=null;state.quickPopover=null;state.editRequest=null;state.productDraft=null;state.drinkDraft=null;state.pendingOrderId=null;state.dirty=false;return true;}
  function openCard(name){if(state.card===name){state.card=null;return;}state.card=name;state.modal=null;state.quickPopover=null;state.dirty=false;if(name==='quick')state.quickCardDraft={quick:state.quick,drinkMode:state.drinkMode,showDrinks:state.showDrinks,quickDrinkOrder:[...state.quickDrinkOrder]};}
  function orderedDrinks(order=state.quickDrinkOrder){const map=new Map(quickDrinks.map(item=>[item.id,item]));const result=[];for(const id of order){if(map.has(id)){result.push(map.get(id));map.delete(id);}}return [...result,...map.values()];}
  function safeHandle(button){try{handle(button);}catch(error){console.error('SMT_ORDER_ACTION_ERROR',error);state.modal=null;state.quickPopover=null;state.dirty=false;flash('操作未完成，資料已保留，請再試一次');window.parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*');}}
  function imageMarkup(src,alt,className=''){return `<span class="image-shell ${className}"><img src="${src||''}" alt="${alt}" data-image-fallback><span class="product-image-fallback">餐點圖片</span></span>`;}

  function top(){const pendingOpen=state.card==='pending';const quickOpen=state.card==='quick';return `<header class="topbar"><div class="brand"><span class="logo"></span><span>磨飯 SMT</span></div><div class="serial"><small>流水號</small><strong>10248</strong></div><div class="top-spacer"></div><button class="top-action card-toggle ${pendingOpen?'is-open':'is-closed'}" data-action="pending">待處理 <span class="badge">${pendingOrders.length}</span><span>${pendingOpen?'⌃':'⌄'}</span></button><button class="top-action card-toggle ${quickOpen?'is-open':'is-closed'}" data-action="quick-settings">快速 <span class="mode-state ${state.quick?'on':'off'}">${state.quick?'ON':'OFF'}</span><span>${quickOpen?'⌃':'⌄'}</span></button><button class="top-action online">● 線上</button></header>`;}
  function nav(){return `<nav class="bottom-nav"><button class="active" data-route="order">點單</button><button data-route="orders">訂單</button><button data-route="dine">堂食</button><button data-route="supply">售罄</button><button data-route="more">更多</button></nav>`;}
  function cartRows(){const cart=sortCartByMenuOrder(state.cart);if(!cart.length)return '<div class="empty-cart"><strong>購物車未有餐點</strong><small>由右側商品卡開始點單</small></div>';return cart.map((line,index)=>`<button class="cart-row" data-action="edit" data-id="${line.lineId}"><span class="cart-seq">${index+1}</span>${imageMarkup(line.image,line.name,'cart-image')}<span class="cart-copy"><h3>${line.name}</h3><small class="${describe(line).includes('尚欠')?'missing-copy':''}">${describe(line)}</small></span><span class="cart-price">x${line.qty}<br>${money(line.total)}</span></button>`).join('');}
  function productRows(){return products.filter(product=>state.category==='全部'||(state.category==='人氣推薦'&&product.tag)||product.category===state.category).map(product=>`<button class="product" data-action="add" data-id="${product.id}">${product.tag?`<span class="tag">${product.tag}</span>`:''}${imageMarkup(product.image,product.name,'product-image')}<div class="meta"><h3>${product.name}</h3><small>${product.code}${productRules(product).requiredGroups.length?' · 有必選':productRules(product).combinableGroup?' · 可組合':''}</small><strong>${money(product.price)}</strong></div></button>`).join('');}
  function optionButtons(action,group,values,selected){return `<div class="options">${values.map(value=>`<button class="option ${selected===value?'active':''}" data-action="${action}" data-group="${group}" data-value="${value}">${value}</button>`).join('')}</div>`;}
  function drinkButtons(action,lineId=''){return `<div class="completion-drink-choices">${orderedDrinks().map(drink=>`<button data-action="${action}" data-value="${drink.id}" ${lineId?`data-line-id="${lineId}"`:''}>${imageMarkup(drink.image||'',drink.name,'mini-drink-image')}<span>${drink.name}</span></button>`).join('')}</div>`;}

  function editCard(){const line=state.cart.find(item=>item.lineId===state.editId);if(!line)return '';return `<section class="workspace-card edit-card"><header><div><strong>修改卡｜${line.name}</strong><small>本行 ${line.qty} 份</small></div><button class="close" data-action="card-close">×</button></header><div class="body">${line.requiredGroups.includes('rice')?`<div class="field"><h4>飯底</h4>${optionButtons('edit-option-request','rice',riceOptions,line.options.rice)}</div>`:''}${line.requiredGroups.includes('sauce')?`<div class="field"><h4>醬汁</h4>${optionButtons('edit-option-request','sauce',sauceOptions,line.options.sauce)}</div>`:''}${line.requiredGroups.includes('snack')?`<div class="field"><h4>小食</h4>${optionButtons('edit-option-request','snack',snackOptions,line.options.snack)}</div>`:''}${line.requiredGroups.includes('drink')?`<div class="field"><h4>飲品</h4>${drinkButtons('edit-drink-request',line.lineId)}</div>`:''}<div class="field"><h4>目前內容</h4><p>${describe(line)}</p></div><p class="edit-help">單份會直接套用；多份會先選擇修改數量。</p></div></section>`;}

  function completionCard(){const pending=getPending(state.cart);const required=pending.requiredMissing.map(item=>{const line=state.cart.find(row=>row.lineId===item.lineId);if(item.group==='drink')return `<article class="pending-required-row drink-required-row"><span><strong>${line?.name}</strong><small>尚欠 ${item.count} 份飲品</small></span>${drinkButtons('edit-drink-request',item.lineId)}</article>`;return `<article class="pending-required-row"><span><strong>${line?.name}</strong><small>${item.label}尚欠 ${item.count} 份</small></span><button class="btn primary" data-action="edit" data-id="${item.lineId}">立即補選</button></article>`;}).join('');const combinable=pending.combinable.map(item=>{const line=state.cart.find(row=>row.lineId===item.lineId);return `<article class="combinable-row"><span><strong>${line?.name}</strong><small>單點飯團可組合，不阻止結帳</small></span><b>${item.count}</b></article>`;}).join('');return `<section class="workspace-card edit-card"><header><strong>待補區 ${pending.requiredMissingCount?`<span class="badge">${pending.requiredMissingCount}</span>`:''}</strong><button class="close" data-action="card-close">×</button></header><div class="body"><section class="completion-section"><header><h3>必須項目</h3><b>${pending.requiredMissingCount?'不可結帳':'全部完成'}</b></header>${required||'<p>目前沒有待補項目。</p>'}</section><section class="completion-section"><header><h3>可組合</h3><b>可略過</b></header>${combinable||'<p>目前沒有可組合建議。</p>'}</section></div></section>`;}

  function pendingGroup(key,title,items){const open=state.pendingGroupOpen[key];const expanded=state.pendingExpandedAll||state.pendingGroupExpanded[key];const visible=expanded?items:items.slice(0,2);return `<section class="pending-group ${open?'open':'closed'}" style="--group-weight:${Math.max(1,Math.min(items.length,8))}"><button class="pending-group-head" data-action="pending-group-toggle" data-value="${key}"><span>${title} <b class="badge">${items.length}</b></span><span>${open?'⌃':'⌄'}</span></button>${open?`<div class="pending-group-list">${visible.map(item=>`<button class="pending-order-row" data-action="pending-order-open" data-id="${item.id}"><span><b>${item.id} ${item.customer}</b><small>${item.payment}</small></span><strong>${item.itemCount}件 · ${money(item.total)}</strong></button>`).join('')}</div>${items.length>2&&!state.pendingExpandedAll?`<button class="group-expand" data-action="pending-group-expand" data-value="${key}">${expanded?'收合':'展開全部'}</button>`:''}`:''}</section>`;}
  function pendingCard(){const appOrders=pendingOrders.filter(item=>item.source==='磨飯 App');const phone=pendingOrders.filter(item=>item.source!=='磨飯 App');return `<section class="workspace-card pending-card"><header><strong>待處理</strong><div class="card-head-actions"><button class="subtle-action" data-action="pending-card-expand-all">${state.pendingExpandedAll?'收合':'全部展開'}</button><button class="close" data-action="card-close">×</button></div></header><div class="body pending-groups">${pendingGroup('app','磨飯App',appOrders)}${pendingGroup('phone','電話／WhatsApp 核對',phone)}</div></section>`;}
  function draftsCard(){return `<section class="workspace-card edit-card"><header><strong>暫存單（${state.drafts.length}）</strong><button class="close" data-action="card-close">×</button></header><div class="body">${state.drafts.length?state.drafts.map(draft=>`<article class="draft-row"><span><strong>${draft.id}</strong><small>${draft.itemCount}件 · ${money(draft.total)}</small></span><button class="btn primary" data-action="draft-restore" data-id="${draft.id}">取單</button></article>`).join(''):'<p>目前沒有暫存單。</p>'}</div></section>`;}
  function quickCard(){const draft=state.quickCardDraft;return `<section class="workspace-card quick-card"><header><strong>快速模式</strong><button class="close" data-action="card-close">×</button></header><div class="body"><div class="mode-stack"><button class="mode-card compact ${!draft.quick?'active':''}" data-action="quick-card-mode" data-value="normal"><strong>普通模式</strong><small>有必選先完成設定</small></button><button class="mode-card compact ${draft.quick?'active':''}" data-action="quick-card-mode" data-value="quick"><strong>快速模式</strong><small>先加入，未完成進待補區</small></button></div><div class="mode-stack"><button class="mode-card compact ${draft.drinkMode==='all'?'active':''}" data-action="quick-card-drink-mode" data-value="all"><strong>全部套餐飲品</strong></button><button class="mode-card compact ${draft.drinkMode==='custom'?'active':''}" data-action="quick-card-drink-mode" data-value="custom"><strong>自訂飲品</strong></button></div><div class="settings-row"><span>顯示快捷飲品</span><button class="switch ${draft.showDrinks?'on':''}" data-action="quick-card-toggle-drinks"></button></div><div class="drink-order-list">${orderedDrinks(draft.quickDrinkOrder).map((drink,index,all)=>`<div class="drink-order-row"><span>${imageMarkup(drink.image||'',drink.name,'order-drink-image')}${drink.name}</span><div><button data-action="drink-order-up" data-value="${drink.id}" ${index===0?'disabled':''}>↑</button><button data-action="drink-order-down" data-value="${drink.id}" ${index===all.length-1?'disabled':''}>↓</button></div></div>`).join('')}</div><div class="settings-foot"><button class="btn" data-action="quick-card-reset">重設</button><button class="btn primary" data-action="quick-card-apply">套用</button></div></div></section>`;}
  function quickDrinkRail(){const missing=missingDrinkSlots(state.cart);return `<div class="quick-drinks ${state.drinkMode==='custom'?'custom-mode':'all-mode'}"><div class="quick-drink-summary"><strong>快捷飲品</strong><small>${missing?`尚需 ${missing} 杯`:'沒有待補飲品'}</small></div><div class="quick-drink-scroll">${orderedDrinks().map(drink=>`<button class="quick-drink-anchor ${state.quickPopover===drink.id?'selected':''}" data-action="drink-open" data-value="${drink.id}" data-quick-drink-id="${drink.id}" ${missing?'':'disabled'}>${state.drinkMode==='custom'?imageMarkup(drink.image||'',drink.name,'quick-drink-icon'):''}<span>${drink.name}</span>${drinkTotalQty(state.cart,drink.id)?`<b class="drink-count">${drinkTotalQty(state.cart,drink.id)}</b>`:''}</button>`).join('')}</div></div>`;}

  function modalWrap(content,className=''){return `<div class="modal-backdrop" data-backdrop="modal"><section class="modal ${className}">${content}</section></div>`;}
  function quantityModal(){const req=state.editRequest;const line=state.cart.find(item=>item.lineId===req?.lineId);if(!req||!line)return '';return modalWrap(`<header><div><h2>選擇修改數量</h2><small>${line.name} · 共 ${line.qty} 份</small></div><button class="close" data-action="modal-close">×</button></header><div class="edit-quantity"><button data-action="edit-qty-minus" ${req.quantity<=1?'disabled':''}>−</button><strong>${req.quantity}</strong><button data-action="edit-qty-plus" ${req.quantity>=line.qty?'disabled':''}>＋</button></div><button class="btn primary" style="width:100%" data-action="edit-qty-confirm">確認修改 ${req.quantity} 份</button>`,'edit-quantity-modal');}
  function drinkConfigModal(){const req=state.editRequest;const drink=drinkById(req?.drinkId);if(!req||!drink)return '';const sweetness=req.sweetness||'正常甜';const ice=req.ice||'正常冰';const chips=(label,values,selected,action)=>`<div class="picker-field"><h3>${label}</h3><div class="picker-options">${values.map(value=>`<button class="${selected===value?'active':''}" data-action="${action}" data-value="${value}">${value}</button>`).join('')}</div></div>`;return modalWrap(`<header><div><h2>${drink.name}</h2><small>套用 ${req.quantity} 份</small></div><button class="close" data-action="modal-close">×</button></header>${drink.options.includes('sweetness')?chips('甜度',sweetnessOptions,sweetness,'edit-drink-sweet'):''}${drink.options.includes('ice')?chips('冰量',iceOptions,ice,'edit-drink-ice'):''}<button class="btn primary" style="width:100%" data-action="edit-drink-apply">套用到 ${req.quantity} 份</button>`,'edit-drink-modal');}
  function productConfigModal(){const draft=state.productDraft;const product=productById(draft?.productId);if(!draft||!product)return '';const rules=productRules(product);const complete=rules.requiredGroups.every(group=>group==='drink'?draft.drink:draft.options[group]);return modalWrap(`<header><div><h2>${product.name}</h2><small>完成必選後加入購物車</small></div><button class="close" data-action="modal-close">×</button></header>${rules.requiredGroups.includes('rice')?`<div class="field"><h4>飯底</h4>${optionButtons('product-option','rice',riceOptions,draft.options.rice)}</div>`:''}${rules.requiredGroups.includes('sauce')?`<div class="field"><h4>醬汁</h4>${optionButtons('product-option','sauce',sauceOptions,draft.options.sauce)}</div>`:''}${rules.requiredGroups.includes('snack')?`<div class="field"><h4>小食</h4>${optionButtons('product-option','snack',snackOptions,draft.options.snack)}</div>`:''}${rules.requiredGroups.includes('drink')?`<div class="field"><h4>飲品</h4>${drinkButtons('product-drink-select')}</div>`:''}<button class="btn primary" style="width:100%" data-action="product-save" ${complete?'':'disabled'}>加入購物車</button>`,'product-config');}
  function pendingOrderModal(){const order=pendingOrders.find(item=>item.id===state.pendingOrderId);if(!order)return '';return modalWrap(`<header><h2>${order.id}｜${order.customer}</h2><button class="close" data-action="modal-close">×</button></header><div class="pending-detail-summary"><span>${order.itemCount} 件</span><strong>${money(order.total)}</strong></div>${order.items.map(item=>`<p>${item}</p>`).join('')}<button class="btn primary" style="width:100%" data-action="pending-order-accept">開啟並處理</button>`,'pending-detail');}
  function clearModal(step){return modalWrap(`<header><h2>${step===1?'第一次確認':'第二次確認'}</h2><button class="close" data-action="modal-close">×</button></header><p>${step===1?'確定要清空整張購物車？':'清空後不可恢復，請再次確認。'}</p><button class="btn ${step===2?'danger':'primary'}" style="width:100%" data-action="clear-step-${step}">${step===1?'繼續':'確定清空'}</button>`,'clear-confirm');}
  function activeModal(){if(state.modal==='edit-quantity')return quantityModal();if(state.modal==='edit-drink')return drinkConfigModal();if(state.modal==='product')return productConfigModal();if(state.modal==='pending-order')return pendingOrderModal();if(state.modal==='clear-1')return clearModal(1);if(state.modal==='clear-2')return clearModal(2);return '';}
  function activeCard(){if(state.card==='edit')return editCard();if(state.card==='completion')return completionCard();if(state.card==='pending')return pendingCard();if(state.card==='drafts')return draftsCard();if(state.card==='quick')return quickCard();return '';}
  function quickPopover(){const drink=drinkById(state.quickPopover);if(!drink||!state.drinkDraft)return '';const selection={drinkId:drink.id,sweetness:state.drinkDraft.sweetness,ice:state.drinkDraft.ice};const qty=drinkGroupQty(state.cart,selection);const chips=(values,selected,action)=>`<div class="popover-chips">${values.map(value=>`<button class="${selected===value?'active':''}" data-action="${action}" data-value="${value}">${value}</button>`).join('')}</div>`;return `<button class="quick-popover-scrim" data-action="quick-popover-close"></button><section class="quick-drink-popover"><header><strong>${drink.name}</strong><button data-action="quick-popover-close">×</button></header>${drink.options.includes('sweetness')?chips(sweetnessOptions,state.drinkDraft.sweetness,'quick-sweet'):''}${drink.options.includes('ice')?chips(iceOptions,state.drinkDraft.ice,'quick-ice'):''}<div class="compact-stepper"><button data-action="quick-minus" ${qty?'':'disabled'}>−</button><b>${qty}</b><button data-action="quick-plus" ${missingDrinkSlots(state.cart)?'':'disabled'}>＋</button></div></section>`;}

  function render(){state.cart=sortCartByMenuOrder(state.cart);const pending=getPending(state.cart);app.innerHTML=`<div class="app">${top()}<main class="workspace"><section class="order-layout"><aside class="cart panel"><div class="cart-head"><h2>購物車（${cartCount(state.cart)}）</h2><button class="btn" data-action="clear" ${state.cart.length?'':'disabled'}>清空</button></div><div class="cart-list">${cartRows()}</div><div class="cart-foot"><button class="completion-bar ${pending.requiredMissingCount?'has-pending':''}" data-action="completion" ${pending.requiredMissingCount||pending.combinable.length?'':'disabled'}><span>待補區</span><span>${pending.requiredMissingCount?`<b class="badge">${pending.requiredMissingCount}</b>`:'0'}　⌄</span></button><div class="cart-actions"><button class="btn" data-action="draft-toggle">${state.cart.length?'暫存':'取單'}</button><button class="btn primary" data-action="checkout" ${state.cart.length?'':'disabled'}>${pending.canCheckout?`結帳 ${money(cartTotal(state.cart))}`:'先整理'}</button></div></div></aside><section class="catalog panel"><div class="catalog-top"><div class="category-grid">${categories.map(item=>`<button class="${state.category===item?'active':''}" data-action="category" data-value="${item}">${item}</button>`).join('')}</div></div><div class="product-area"><div class="products">${productRows()}</div></div>${state.showDrinks?quickDrinkRail():''}${quickPopover()}</section>${state.card?'<button class="workspace-scrim" data-action="card-close"></button>':''}${activeCard()}</section></main>${nav()}</div>${activeModal()}<div class="toast ${state.toast?'show':''}">${state.toast}</div>`;bind();positionPopover();}
  function bind(){document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>window.MoreFunPageBridge.navigate(button.dataset.route)));document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>safeHandle(button)));document.querySelectorAll('[data-backdrop]').forEach(backdrop=>backdrop.addEventListener('click',event=>{if(event.target===event.currentTarget&&closeOverlay())render();}));document.querySelectorAll('img[data-image-fallback]').forEach(img=>{const fail=()=>{img.hidden=true;img.nextElementSibling.hidden=false;};img.nextElementSibling.hidden=true;img.addEventListener('error',fail,{once:true});if(img.complete&&!img.naturalWidth)fail();});}
  function positionPopover(){if(!state.quickPopover)return;const anchor=document.querySelector(`[data-quick-drink-id="${state.quickPopover}"]`);const popover=document.querySelector('.quick-drink-popover');const catalog=document.querySelector('.catalog');const product=document.querySelector('.product');if(!anchor||!popover||!catalog)return;const ar=anchor.getBoundingClientRect();const cr=catalog.getBoundingClientRect();const width=Math.max(200,Math.round((product?.getBoundingClientRect().width||300)*2/3));popover.style.width=`${width}px`;popover.style.left=`${Math.max(10,Math.min(cr.width-width-10,ar.left-cr.left+(ar.width-width)/2))}px`;popover.style.top=`${Math.max(10,ar.top-cr.top-popover.offsetHeight-8)}px`;}
  function moveOrder(order,id,delta){const index=order.indexOf(id),next=index+delta;if(index<0||next<0||next>=order.length)return order;const copy=[...order];[copy[index],copy[next]]=[copy[next],copy[index]];return copy;}
  function beginEditRequest(request){const line=state.cart.find(item=>item.lineId===request.lineId);if(!line)return;state.editRequest={...request,quantity:1,sweetness:'正常甜',ice:'正常冰'};const drink=request.type==='drink'?drinkById(request.drinkId):null;if(line.qty>1){state.modal='edit-quantity';state.dirty=false;}else if(drink&&(drink.options||[]).length){state.modal='edit-drink';state.dirty=false;}else{applyEditRequest();}}
  function applyEditRequest(){const req=state.editRequest;if(!req)return;if(req.type==='option')state.cart=applyEditToQuantity(state.cart,req.lineId,req.quantity,{options:{[req.group]:req.value}});else{const drink=drinkById(req.drinkId);state.cart=applyEditToQuantity(state.cart,req.lineId,req.quantity,{drinkSelection:{drinkId:drink.id,name:drink.name,unitPrice:drink.price,sweetness:req.sweetness,ice:req.ice}});}state.modal=null;state.editRequest=null;flash('修改已套用');}

  function handle(button){const action=button.dataset.action;
    if(action==='pending')openCard('pending');
    else if(action==='quick-settings')openCard('quick');
    else if(action==='card-close'){state.card=null;state.editId=null;}
    else if(action==='edit'){state.editId=button.dataset.id;state.card='edit';}
    else if(action==='completion')state.card='completion';
    else if(action==='category')state.category=button.dataset.value;
    else if(action==='clear')state.modal='clear-1';
    else if(action==='clear-step-1')state.modal='clear-2';
    else if(action==='clear-step-2'){state.cart=[];closeOverlay(true);state.card=null;flash('購物車已清空');}
    else if(action==='add'){
      const product=productById(button.dataset.id);const rules=productRules(product);
      if(!rules.requiredGroups.length||state.quick){const newLine=normalizeCartLine({lineId:lineId(),productId:product.id,name:product.name,detail:product.code,qty:1,unitPrice:product.price,image:product.image,category:product.category,requiredGroups:rules.requiredGroups,combinableGroup:rules.combinableGroup,options:{},drinkSlots:rules.drinkSlotsPerUnit,drinkAssignments:[]},state.cart.length);state.cart=sortCartByMenuOrder([...state.cart,newLine]);flash(rules.requiredGroups.length?'已加入，請到待補區完成必選':'已加入購物車');}
      else{state.productDraft={productId:product.id,options:{},drink:null};state.modal='product';}
    }
    else if(action==='product-option'){state.productDraft.options[button.dataset.group]=button.dataset.value;state.dirty=true;}
    else if(action==='product-drink-select'){const drink=drinkById(button.dataset.value);state.productDraft.drink={drinkId:drink.id,name:drink.name,unitPrice:drink.price,sweetness:'正常甜',ice:'正常冰'};state.dirty=true;}
    else if(action==='product-save'){const product=productById(state.productDraft.productId);const rules=productRules(product);state.cart=sortCartByMenuOrder([...state.cart,normalizeCartLine({lineId:lineId(),productId:product.id,name:product.name,detail:product.code,qty:1,unitPrice:product.price,image:product.image,category:product.category,requiredGroups:rules.requiredGroups,combinableGroup:rules.combinableGroup,options:state.productDraft.options,drinkSlots:rules.drinkSlotsPerUnit,drinkAssignments:state.productDraft.drink?[state.productDraft.drink]:[]},state.cart.length)]);closeOverlay(true);flash('已加入購物車');}
    else if(action==='edit-option-request')beginEditRequest({type:'option',lineId:state.editId||button.dataset.lineId,group:button.dataset.group,value:button.dataset.value});
    else if(action==='edit-drink-request')beginEditRequest({type:'drink',lineId:button.dataset.lineId||state.editId,drinkId:button.dataset.value});
    else if(action==='edit-qty-minus'){state.editRequest.quantity=Math.max(1,state.editRequest.quantity-1);}
    else if(action==='edit-qty-plus'){const line=state.cart.find(item=>item.lineId===state.editRequest.lineId);state.editRequest.quantity=Math.min(line.qty,state.editRequest.quantity+1);}
    else if(action==='edit-qty-confirm'){const drink=state.editRequest.type==='drink'?drinkById(state.editRequest.drinkId):null;if(drink&&(drink.options||[]).length)state.modal='edit-drink';else applyEditRequest();}
    else if(action==='edit-drink-sweet'){state.editRequest.sweetness=button.dataset.value;state.dirty=true;}
    else if(action==='edit-drink-ice'){state.editRequest.ice=button.dataset.value;state.dirty=true;}
    else if(action==='edit-drink-apply')applyEditRequest();
    else if(action==='modal-close'){if(!closeOverlay())return;}
    else if(action==='drink-open'){state.quickPopover=button.dataset.value;state.drinkDraft={sweetness:'正常甜',ice:'正常冰'};}
    else if(action==='quick-popover-close'){state.quickPopover=null;state.drinkDraft=null;}
    else if(action==='quick-sweet')state.drinkDraft.sweetness=button.dataset.value;
    else if(action==='quick-ice')state.drinkDraft.ice=button.dataset.value;
    else if(action==='quick-plus'){const drink=drinkById(state.quickPopover);state.cart=addDrinkToFirstMissing(state.cart,{drinkId:drink.id,name:drink.name,unitPrice:drink.price,sweetness:state.drinkDraft.sweetness,ice:state.drinkDraft.ice});}
    else if(action==='quick-minus'){const drink=drinkById(state.quickPopover);state.cart=removeDrinkAnywhere(state.cart,{drinkId:drink.id,sweetness:state.drinkDraft.sweetness,ice:state.drinkDraft.ice});}
    else if(action==='checkout'){const pending=getPending(state.cart);if(!pending.canCheckout){state.card='completion';flash(`尚欠 ${pending.requiredMissingCount} 項必選內容`);}else{persist();localStorage.setItem(CHECKOUT_CONTEXT_KEY,JSON.stringify({channel:'現場外賣',appCoupon:null}));window.MoreFunPageBridge.navigate('checkout');return;}}
    else if(action==='draft-toggle'){if(state.cart.length){state.drafts=addStoredDraft(state.drafts,createStoredDraft(state.cart));state.cart=[];flash('訂單已暫存');}else if(state.drafts.length)state.card='drafts';else flash('目前沒有暫存單');}
    else if(action==='draft-restore'){const result=takeStoredDraft(state.drafts,button.dataset.id);state.cart=sortCartByMenuOrder(result.cart);state.drafts=result.drafts;state.card=null;flash('暫存單已恢復');}
    else if(action==='pending-card-expand-all'){state.pendingExpandedAll=!state.pendingExpandedAll;}
    else if(action==='pending-group-toggle')state.pendingGroupOpen[button.dataset.value]=!state.pendingGroupOpen[button.dataset.value];
    else if(action==='pending-group-expand')state.pendingGroupExpanded[button.dataset.value]=!state.pendingGroupExpanded[button.dataset.value];
    else if(action==='pending-order-open'){state.pendingOrderId=button.dataset.id;state.modal='pending-order';}
    else if(action==='pending-order-accept'){closeOverlay(true);flash('已開啟訂單處理流程');}
    else if(action==='quick-card-mode'){state.quickCardDraft.quick=button.dataset.value==='quick';}
    else if(action==='quick-card-drink-mode'){state.quickCardDraft.drinkMode=button.dataset.value;}
    else if(action==='quick-card-toggle-drinks')state.quickCardDraft.showDrinks=!state.quickCardDraft.showDrinks;
    else if(action==='drink-order-up')state.quickCardDraft.quickDrinkOrder=moveOrder(state.quickCardDraft.quickDrinkOrder,button.dataset.value,-1);
    else if(action==='drink-order-down')state.quickCardDraft.quickDrinkOrder=moveOrder(state.quickCardDraft.quickDrinkOrder,button.dataset.value,1);
    else if(action==='quick-card-reset')state.quickCardDraft={quick:true,drinkMode:'all',showDrinks:true,quickDrinkOrder:quickDrinks.map(item=>item.id)};
    else if(action==='quick-card-apply'){Object.assign(state,{quick:state.quickCardDraft.quick,drinkMode:state.quickCardDraft.drinkMode,showDrinks:state.quickCardDraft.showDrinks,quickDrinkOrder:[...state.quickCardDraft.quickDrinkOrder]});state.card=null;flash('快速模式設定已套用');}
    persist();render();
  }

  state.cart=sortCartByMenuOrder(state.cart);persist();render();
}
