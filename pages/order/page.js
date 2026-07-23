import {categories as baseCategories, products as baseProducts, drinks as baseDrinks, optionSets} from './page-data.js';
import {renderGlobalStatusBar, renderBottomNav, installShellNavigation, escape} from '../../shared/shell.js';

const app = document.getElementById('app');
const KEY = 'morefun.smt.t2s.rewrite.state';
const sources = ['現場外賣', '網站單', 'App 單', 'WhatsApp 單', '電話單', '平台單'];
const categories = ['全部', ...baseCategories.filter(item => item !== '全部')];
const products = baseProducts.map(item => ({...item, price: Number(item.price) || 0, required: Array.isArray(item.required) ? item.required : []}));
const drinks = baseDrinks.map(item => ({...item, price: Number(item.price) || 0}));
const productMap = new Map(products.map(item => [item.id, item]));
const drinkMap = new Map(drinks.map(item => [item.id, item]));
const fallback = {
  rice: ['肉燥飯', '咖喱飯', '菜飯', '白飯', '少飯', '半飯'],
  snack: ['薯角', '鹽酥雞', '香脆雞翼', '味噌湯'],
  sauce: ['不需要', '標準', '少醬', '多醬'],
  sweetness: ['正常甜', '少甜', '多甜', '走甜'],
  ice: ['正常冰', '少冰', '多冰', '走冰']
};

let state = load();
let modal = null;
let draft = null;
let toastText = '';
let toastTimer = 0;

function defaults(){
  return {category:'全部', search:'', source:'現場外賣', accepting:true, cart:[], soldout:{}, ready:[], prints:[], lastOrder:'—', nextNo:1001};
}

function normalize(raw){
  const base = defaults();
  const value = {...base, ...(raw || {})};
  value.category = categories.includes(value.category) ? value.category : '全部';
  value.source = sources.includes(value.source) ? value.source : '現場外賣';
  value.search = String(value.search || '');
  value.accepting = value.accepting !== false;
  value.cart = Array.isArray(value.cart) ? value.cart : [];
  value.soldout = value.soldout && typeof value.soldout === 'object' ? value.soldout : {};
  value.ready = Array.isArray(value.ready) ? value.ready : [];
  value.prints = Array.isArray(value.prints) ? value.prints : [];
  value.nextNo = Number.isFinite(Number(value.nextNo)) ? Number(value.nextNo) : 1001;
  return value;
}

function load(){
  try { return normalize(JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch { return defaults(); }
}

function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
function money(value){ return '$' + Math.round(Number(value) || 0); }
function uid(prefix){ return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7); }
function opts(group){ return optionSets?.[group] || fallback[group] || []; }
function label(group){ return {rice:'飯底', drink:'飲品', snack:'小食', sauce:'醬汁'}[group] || group; }
function isSoldout(id){ return state.soldout?.[id] === true; }
function lineDrinkTarget(line){ return (Number(line.drinkSlots) || 0) * Math.max(1, Number(line.qty) || 1); }
function total(){ return state.cart.reduce((sum, line) => sum + Number(line.price || 0) * Number(line.qty || 1), 0); }

function missing(line){
  return (line.required || []).flatMap(group => {
    if(group === 'drink'){
      const count = Math.max(0, lineDrinkTarget(line) - (line.drinks || []).length);
      return count ? [{group, label:'飲品', count, lineId:line.id, lineName:line.name}] : [];
    }
    return !line.options?.[group] ? [{group, label:label(group), count:1, lineId:line.id, lineName:line.name}] : [];
  });
}

function missingTotal(){
  return state.cart.reduce((sum, line) => sum + missing(line).reduce((n, item) => n + item.count, 0), 0);
}

function image(src, name){
  if(!src) return '<span class="image-shell"><span class="image-fallback">磨</span></span>';
  return `<span class="image-shell"><img src="${escape(src)}" alt="${escape(name)}"></span>`;
}

function describe(line){
  const parts = [];
  Object.entries(line.options || {}).forEach(([key, value]) => { if(value) parts.push(label(key) + '：' + value); });
  (line.drinks || []).forEach(drink => parts.push([drink.name, drink.sweetness, drink.ice].filter(Boolean).join(' · ')));
  const miss = missing(line);
  if(miss.length) parts.push('尚欠 ' + miss.map(item => item.label + (item.count > 1 ? ' ×' + item.count : '')).join('、'));
  return parts.join('｜') || '標準';
}

function showToast(text){
  toastText = text;
  clearTimeout(toastTimer);
  render();
  toastTimer = setTimeout(() => { toastText = ''; render(); }, 1500);
}

function filtered(){
  const query = state.search.trim().toLowerCase();
  return products.filter(product => {
    const matchCategory = state.category === '全部' || product.category === state.category;
    const matchQuery = !query || [product.name, product.code, product.category, product.description].some(value => String(value || '').toLowerCase().includes(query));
    return matchCategory && matchQuery;
  });
}

function makeLine(product, options, selectedDrinks, qty = 1){
  return {
    id: uid('line'),
    productId: product.id,
    code: product.code || '',
    name: product.name,
    category: product.category,
    image: product.image,
    price: product.price,
    qty: Math.max(1, Number(qty) || 1),
    required: [...(product.required || [])],
    drinkSlots: Number(product.drinkSlots) || 0,
    options: {...options},
    drinks: selectedDrinks.map(drink => ({...drink})),
    source: state.source
  };
}

function addSimple(id){
  const product = productMap.get(id);
  if(!product) return;
  if(isSoldout(id)){ showToast(product.name + ' 已售罄'); return; }
  if(product.required.length){ openDraft(id); return; }
  state.cart.push(makeLine(product, {}, []));
  save();
  showToast('已加入 ' + product.name);
}

function openDraft(productId, lineId = ''){
  const product = productMap.get(productId);
  const line = state.cart.find(item => item.id === lineId);
  if(!product) return;
  draft = {
    productId,
    lineId,
    qty: Math.max(1, Number(line?.qty) || 1),
    options: {...(line?.options || {})},
    drinks: (line?.drinks || []).map(drink => ({...drink})),
    activeDrink: '',
    sweetness: '正常甜',
    ice: '正常冰'
  };
  modal = 'product';
  render();
}

function confirmDraft(){
  const product = productMap.get(draft?.productId);
  if(!product) return;
  const line = makeLine(product, draft.options, draft.drinks, draft.qty);
  const miss = missing(line);
  if(miss.length){
    showToast('尚欠 ' + miss.map(item => item.label + (item.count > 1 ? ' ×' + item.count : '')).join('、'));
    return;
  }
  if(draft.lineId){
    const old = state.cart.find(item => item.id === draft.lineId);
    if(old) Object.assign(old, {options: line.options, drinks: line.drinks, drinkSlots: line.drinkSlots});
  } else {
    state.cart.push(line);
  }
  modal = null;
  draft = null;
  save();
  showToast('已儲存');
}

function completeOrder(){
  if(!state.cart.length){ showToast('購物車未有餐點'); return; }
  const miss = state.cart.flatMap(missing);
  if(miss.length){ modal = 'missing'; render(); return; }
  const order = {
    id: 'MF' + String(state.nextNo).padStart(4, '0'),
    source: state.source,
    items: state.cart.reduce((sum, line) => sum + Number(line.qty || 1), 0),
    amount: total()
  };
  state.ready.unshift(order);
  state.prints.unshift({id: uid('print'), orderId: order.id, type: '收據＋後廚＋標籤', status: '待列印', amount: order.amount});
  state.lastOrder = order.id;
  state.nextNo += 1;
  state.cart = [];
  modal = 'ready';
  save();
  render();
}

function render(){
  const shell = renderGlobalStatusBar({
    terminalId: 'SMT-T2S',
    operationLabel: state.accepting ? '接單中' : '停止接單',
    operationTone: state.accepting ? 'online' : 'offline',
    lastOrder: state.lastOrder,
    context: state.source,
    rightActions: `<button class="top-btn" data-action="status">${state.accepting ? '停止接單' : '恢復接單'}</button><button class="top-btn primary" data-action="complete">完成／可取餐</button>`
  });
  app.innerHTML = `<main class="smt-app">${shell}<section class="workspace">${workspace()}</section>${renderBottomNav('order', {badges:{orders: state.ready.length || '', soldout: Object.values(state.soldout).filter(Boolean).length || '', more: state.prints.filter(job => job.status !== '完成').length || ''}})}${renderModal()}${toastText ? `<div class="toast">${escape(toastText)}</div>` : ''}</main>`;
  installShellNavigation(app);
}

function workspace(){
  return `<div class="order-workspace"><section class="catalog-panel"><header class="catalog-head"><div class="category-row">${categories.map(category => `<button class="${state.category === category ? 'active' : ''}" data-action="cat" data-cat="${escape(category)}">${escape(category)}</button>`).join('')}</div><input class="search-input" value="${escape(state.search)}" placeholder="搜尋產品／編號"></header><div class="product-grid">${productCards()}</div></section><aside class="flow-panel">${flow()}</aside><aside class="cart-panel">${cart()}</aside></div>`;
}

function productCards(){
  const rows = filtered().map(card).join('');
  return rows || '<div class="empty-cart"><strong>未找到產品</strong><small>試下改分類或搜尋字</small></div>';
}

function renderProductGrid(){
  const grid = app.querySelector('.product-grid');
  if(grid) grid.innerHTML = productCards();
}

function card(product){
  return `<button class="product-card ${isSoldout(product.id) ? 'is-soldout' : ''}" data-action="add" data-id="${escape(product.id)}">${image(product.image, product.name)}<span class="product-code">${escape(product.code || '')}</span><span><strong>${escape(product.name)}</strong><small>${escape(product.description || product.category || '')}</small></span><b>${money(product.price)}</b></button>`;
}

function flow(){
  return `<section class="flow-block"><h2>單源</h2><div class="source-grid">${sources.map(source => `<button class="${state.source === source ? 'active' : ''}" data-action="source" data-source="${escape(source)}">${escape(source)}</button>`).join('')}</div></section><section class="flow-block"><h2>狀態</h2><div class="status-grid"><button class="${state.accepting ? 'active' : ''}" data-action="accept" data-value="1">接單中</button><button class="${!state.accepting ? 'active' : ''}" data-action="accept" data-value="0">停止接單</button><button data-action="soldout">售罄入口</button><button data-action="print">列印</button></div></section><section class="flow-block"><h2>補選狀態</h2><div class="flow-summary"><span><small>購物車</small><b>${state.cart.length}</b></span><span><small>待補選</small><b>${missingTotal()}</b></span><span><small>可取餐</small><b>${state.ready.length}</b></span><span><small>售罄</small><b>${Object.values(state.soldout).filter(Boolean).length}</b></span></div></section><section class="flow-block quick-drinks"><h2>飲品加購</h2>${drinks.slice(0, 6).map(drink => `<button data-action="quick-drink" data-id="${escape(drink.id)}"><span>${escape(drink.name)}</span><small>${money(drink.price)}</small></button>`).join('')}</section>`;
}

function cart(){
  const rows = state.cart.map(line => `<article class="cart-row"><strong>${escape(line.name)}</strong><b>${money(Number(line.price || 0) * Number(line.qty || 1))}</b><small>${escape(describe(line))}</small><div class="qty-row"><button data-action="qty" data-id="${escape(line.id)}" data-delta="-1">－</button><span>${line.qty}</span><button data-action="qty" data-id="${escape(line.id)}" data-delta="1">＋</button><button data-action="edit" data-id="${escape(line.id)}">補選</button></div></article>`).join('');
  return `<header><h2>購物車</h2><button data-action="clear">清空</button></header><div class="cart-list">${rows || '<div class="empty-cart"><strong>未有餐點</strong><small>先選左邊產品</small></div>'}</div><footer class="cart-footer"><div class="total-box"><span>合計</span><b>${money(total())}</b></div><button data-action="clear">取消</button><button class="btn primary" data-action="complete">完成／可取餐</button></footer>`;
}

function renderModal(){
  if(!modal) return '';
  if(modal === 'product') return productModal();
  if(modal === 'missing') return missingModal();
  if(modal === 'soldout') return soldoutModal();
  if(modal === 'print') return printModal();
  if(modal === 'ready') return `<section class="modal-layer"><section class="modal-card compact"><header><h2>完成／可取餐</h2><button data-action="close">關閉</button></header><div class="modal-body"><section class="choice-section"><h3>${escape(state.lastOrder)}</h3><p>已建立收據、後廚及標籤列印工作。</p></section></div><footer><button data-action="print">查看列印</button><button class="btn primary" data-action="close">繼續點單</button></footer></section></section>`;
  return '';
}

function productModal(){
  const product = productMap.get(draft.productId);
  const groups = product.required.filter(group => group !== 'drink');
  const activeDrink = drinkMap.get(draft.activeDrink);
  const drinkTarget = (Number(product.drinkSlots) || 0) * Math.max(1, Number(draft.qty) || 1);
  return `<section class="modal-layer"><section class="modal-card wide"><header><h2>${escape(product.name)}</h2><button data-action="close">關閉</button></header><div class="modal-body"><section class="choice-section"><h3>${escape(product.code || '')}｜${money(product.price)}</h3><p>${escape(product.description || '')}</p></section>${groups.map(group => `<section class="choice-section"><h3>${label(group)}</h3><div class="choice-grid">${opts(group).map(value => `<button class="${draft.options[group] === value ? 'active' : ''}" data-action="opt" data-group="${escape(group)}" data-value="${escape(value)}">${escape(value)}</button>`).join('')}</div></section>`).join('')}${product.required.includes('drink') ? `<section class="choice-section"><h3>飲品加購／甜度冰量 <small>${draft.drinks.length}/${drinkTarget || 1}</small></h3><div class="choice-grid drinks">${drinks.map(drink => `<button class="drink-pick ${draft.activeDrink === drink.id ? 'active' : ''}" data-action="pick-drink" data-id="${escape(drink.id)}"><b>${escape(drink.name)}</b><small>${money(drink.price)}</small></button>`).join('')}</div>${activeDrink ? `<div class="choice-section"><div class="adjust-row"><strong>甜度</strong><div class="chip-row">${opts('sweetness').map(value => `<button class="${draft.sweetness === value ? 'active' : ''}" data-action="drink-opt" data-field="sweetness" data-value="${escape(value)}">${escape(value)}</button>`).join('')}</div></div><div class="adjust-row"><strong>冰量</strong><div class="chip-row">${opts('ice').map(value => `<button class="${draft.ice === value ? 'active' : ''}" data-action="drink-opt" data-field="ice" data-value="${escape(value)}">${escape(value)}</button>`).join('')}</div></div><button class="btn primary" data-action="add-drink">加入飲品</button></div>` : ''}${draft.drinks.length ? `<div class="chip-row">${draft.drinks.map((drink, index) => `<button data-action="remove-drink" data-index="${index}">${escape(drink.name)} ×</button>`).join('')}</div>` : ''}</section>` : ''}</div><footer><button data-action="close">取消</button><button class="btn primary" data-action="confirm-draft">${draft.lineId ? '儲存補選' : '加入購物車'}</button></footer></section></section>`;
}

function missingModal(){
  const items = state.cart.flatMap(missing);
  return `<section class="modal-layer"><section class="modal-card compact"><header><h2>尚有必選項</h2><button data-action="close">關閉</button></header><div class="modal-body missing-list">${items.map(item => `<article><span><strong>${escape(item.lineName)}</strong><small>尚欠：${escape(item.label)}${item.count > 1 ? ' ×' + item.count : ''}</small></span><button data-action="edit" data-id="${escape(item.lineId)}">補選</button></article>`).join('')}</div><footer><button data-action="close">返回</button><button class="btn primary" data-action="edit" data-id="${escape(items[0]?.lineId || '')}">補第一項</button></footer></section></section>`;
}

function soldoutModal(){
  return `<section class="modal-layer"><section class="modal-card wide"><header><h2>售罄管理</h2><button data-action="close">關閉</button></header><div class="modal-body"><div class="soldout-grid">${products.map(product => `<button class="${isSoldout(product.id) ? 'active' : ''}" data-action="toggle-soldout" data-id="${escape(product.id)}"><strong>${escape(product.code || '')}</strong><br>${escape(product.name)}</button>`).join('')}</div></div><footer><button data-action="close">返回</button><button class="btn primary" data-action="close">完成</button></footer></section></section>`;
}

function printModal(){
  const jobs = state.prints.map(job => `<article><span><strong>${escape(job.orderId)}</strong><small>${escape(job.type)}｜${escape(job.status)}｜${money(job.amount)}</small></span><button data-action="printed" data-id="${escape(job.id)}">標記完成</button></article>`).join('');
  return `<section class="modal-layer"><section class="modal-card compact"><header><h2>列印工作</h2><button data-action="close">關閉</button></header><div class="modal-body print-list">${jobs || '<section class="choice-section"><h3>未有待列印工作</h3><p>完成訂單後會自動建立收據、後廚、標籤列印工作。</p></section>'}</div><footer><button data-action="close">返回</button><button class="btn primary" data-action="close">知道</button></footer></section></section>`;
}

app.addEventListener('input', event => {
  if(!event.target.matches('.search-input')) return;
  state.search = event.target.value;
  save();
  renderProductGrid();
});

app.addEventListener('click', event => {
  const node = event.target.closest('[data-action]');
  if(!node) return;
  const action = node.dataset.action;
  if(action === 'cat'){ state.category = node.dataset.cat; save(); render(); }
  else if(action === 'add') addSimple(node.dataset.id);
  else if(action === 'source'){ state.source = node.dataset.source; save(); render(); }
  else if(action === 'accept'){ state.accepting = node.dataset.value === '1'; save(); render(); }
  else if(action === 'status'){ state.accepting = !state.accepting; save(); render(); }
  else if(action === 'soldout'){ modal = 'soldout'; render(); }
  else if(action === 'print'){ modal = 'print'; render(); }
  else if(action === 'close'){ modal = null; draft = null; render(); }
  else if(action === 'clear'){ state.cart = []; save(); render(); }
  else if(action === 'qty'){
    const line = state.cart.find(item => item.id === node.dataset.id);
    if(line){
      line.qty = Math.max(0, Number(line.qty || 1) + Number(node.dataset.delta));
      if(!line.qty) state.cart = state.cart.filter(item => item.id !== line.id);
      save();
      render();
    }
  }
  else if(action === 'edit'){
    const line = state.cart.find(item => item.id === node.dataset.id);
    if(line) openDraft(line.productId, line.id);
  }
  else if(action === 'complete') completeOrder();
  else if(action === 'opt'){ draft.options[node.dataset.group] = node.dataset.value; render(); }
  else if(action === 'pick-drink'){ draft.activeDrink = node.dataset.id; render(); }
  else if(action === 'drink-opt'){ draft[node.dataset.field] = node.dataset.value; render(); }
  else if(action === 'add-drink'){
    const drink = drinkMap.get(draft.activeDrink);
    const product = productMap.get(draft.productId);
    const target = (Number(product?.drinkSlots) || 0) * Math.max(1, Number(draft.qty) || 1);
    if(drink && draft.drinks.length < target){
      draft.drinks.push({drinkId: drink.id, name: drink.name, sweetness: draft.sweetness, ice: draft.ice});
      draft.activeDrink = '';
      render();
    }
  }
  else if(action === 'remove-drink'){ draft.drinks.splice(Number(node.dataset.index), 1); render(); }
  else if(action === 'confirm-draft') confirmDraft();
  else if(action === 'toggle-soldout'){
    state.soldout[node.dataset.id] = !state.soldout[node.dataset.id];
    save();
    render();
  }
  else if(action === 'quick-drink'){
    const drink = drinkMap.get(node.dataset.id);
    if(drink){
      state.cart.push({id: uid('line'), productId: drink.id, code: '飲品', name: drink.name, category: '飲品', image: drink.image, price: drink.price, qty: 1, required: [], drinkSlots: 0, options: {}, drinks: [], source: state.source});
      save();
      showToast('已加入 ' + drink.name);
    }
  }
  else if(action === 'printed'){
    const job = state.prints.find(item => item.id === node.dataset.id);
    if(job) job.status = '完成';
    save();
    render();
  }
});

render();
window.parent?.postMessage({type:'morefun:page-ready', page:'order'}, '*');
