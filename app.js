import {products, categories} from './smt-data.js';
import {
  addCartItem,
  changeCartItemQuantity,
  removeCartItem,
  updateCartItemOptions,
  getRequiredState,
  incrementOrderNumber,
  createLocalOrder
} from './smt-domain.js';
import {createStore, saveState} from './smt-state.js';
import {renderApp} from './smt-views.js';
import {applyMotionVariables, announce} from './smt-motion.js';

const IMAGE_FALLBACK_CLASS = 'image-fallback';
const IMAGE_FALLBACK_TEXT = '餐點圖片暫未提供';
const app = document.getElementById('app');
const store = createStore({storage: localStorage});
let renderQueued = false;
let lastFocusedAction = null;
let lastViewportState = null;

function reducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}


function captureViewportState() {
  const read = selector => {
    const node = document.querySelector(selector);
    return node ? {top: node.scrollTop, left: node.scrollLeft} : {top: 0, left: 0};
  };
  lastViewportState = {
    products: read('.product-grid'),
    categories: read('.category-list'),
    cart: read('.cart-scroll'),
    drawer: read('.drawer-body')
  };
}

function restoreViewportState() {
  if (!lastViewportState) return;
  const write = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) { node.scrollTop = value.top; node.scrollLeft = value.left; }
  };
  write('.product-grid', lastViewportState.products);
  write('.category-list', lastViewportState.categories);
  write('.cart-scroll', lastViewportState.cart);
  write('.drawer-body', lastViewportState.drawer);
}

function rememberFocus() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return;
  lastFocusedAction = {
    action: active.dataset.action ?? null,
    page: active.dataset.page ?? null,
    productId: active.dataset.productId ?? null,
    lineId: active.dataset.lineId ?? null,
    id: active.id || null
  };
}

function restoreFocus() {
  if (!lastFocusedAction) return;
  const selectors = [
    lastFocusedAction.id ? `#${CSS.escape(lastFocusedAction.id)}` : '',
    lastFocusedAction.action ? `[data-action="${CSS.escape(lastFocusedAction.action)}"]` : '',
    lastFocusedAction.page ? `[data-page="${CSS.escape(lastFocusedAction.page)}"]` : '',
    lastFocusedAction.productId ? `[data-product-id="${CSS.escape(lastFocusedAction.productId)}"]` : '',
    lastFocusedAction.lineId ? `[data-line-id="${CSS.escape(lastFocusedAction.lineId)}"]` : ''
  ].filter(Boolean);
  const target = selectors.map(selector => document.querySelector(selector)).find(Boolean);
  target?.focus({preventScroll: true});
}

function render({restore = true} = {}) {
  captureViewportState();
  rememberFocus();
  const state = store.getState();
  app.innerHTML = renderApp(state, {products, categories});
  document.body.classList.toggle('quick-mode', state.quickMode);
  applyMotionVariables(document.documentElement, {
    quickMode: state.quickMode,
    reducedMotion: reducedMotion()
  });
  updateClock();
  if (restore) requestAnimationFrame(() => { restoreViewportState(); restoreFocus(); });
}

function scheduleRender(options) {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    render(options);
  });
}

function replaceState(nextState, action) {
  store.replace(nextState, action);
}

function productById(id) {
  return products.find(product => product.id === id);
}

function openProductRule(product, cart) {
  const line = [...cart].reverse().find(item => item.productId === product.id);
  return line ? {type: 'product-rule', productId: product.id, lineId: line.lineId} : null;
}

function addProduct(productId, {openOptions = false} = {}) {
  const state = store.getState();
  const product = productById(productId);
  if (!product) return;
  const cart = addCartItem(state.cart, product, {});
  if (cart === state.cart) {
    replaceState({...state, toast: {message: product.availability === 'sold-out' ? '此商品今日售罄' : '此商品暫停供應'}}, {type:'PRODUCT_UNAVAILABLE'});
    return;
  }
  const required = Boolean(product.requiredGroups?.length);
  replaceState({
    ...state,
    cart,
    overlay: (required || openOptions) ? openProductRule(product, cart) : state.overlay,
    toast: required ? null : {message: `已加入 ${product.name}`}
  }, {type:'CART_PRODUCT_ADDED', productId});
  announce(required ? `${product.name} 已加入，請完成必選內容` : `${product.name} 已加入購物車`);
}

function openFirstMissingRequired() {
  const state = store.getState();
  const required = getRequiredState(state.cart);
  const missing = required.missing[0];
  if (!missing) return false;
  const line = state.cart.find(item => item.lineId === missing.lineId);
  replaceState({...state, overlay: {type:'product-rule', productId:line.productId, lineId:line.lineId}}, {type:'REQUIRED_OPENED'});
  announce(`尚欠 ${required.missingCount} 項必選內容`);
  return true;
}

function showTransientToast(message, undo = null) {
  const state = store.getState();
  replaceState({...state, toast:{message, undo}, undo}, {type:'TOAST_SHOWN'});
  window.clearTimeout(showTransientToast.timer);
  showTransientToast.timer = window.setTimeout(() => {
    const current = store.getState();
    if (current.toast?.message === message) replaceState({...current, toast:null}, {type:'TOAST_HIDDEN'});
  }, 2600);
}

function confirmOrder() {
  const state = store.getState();
  if (state.checkout.saving) return;
  if (openFirstMissingRequired()) return;
  if (!state.checkout.paymentMethod) {
    showTransientToast('請先選擇付款方式');
    return;
  }

  const savingState = {...state, checkout:{...state.checkout, saving:true}, toast:null};
  replaceState(savingState, {type:'ORDER_SAVING'});

  const result = createLocalOrder({
    state: savingState,
    now: Date.now(),
    nextOrderNumber: state.currentOrderNumber,
    persist: next => saveState(localStorage, next)
  });

  if (!result.ok) {
    const failed = {...state, checkout:{...state.checkout, saving:false}, toast:{message:'訂單內容已保留，請重試'}};
    replaceState(failed, {type:'ORDER_SAVE_FAILED', reason:result.reason});
    announce('訂單保存失敗，內容已保留');
    return;
  }

  const completedNumber = state.currentOrderNumber;
  const nextState = {
    ...result.nextState,
    currentOrderNumber: incrementOrderNumber(completedNumber),
    checkout: {...state.checkout, paymentMethod:null, note:'', saving:false},
    overlay:null,
    toast:{message:`${completedNumber} 已安全建立`}
  };
  replaceState(nextState, {type:'ORDER_CREATED', orderId:completedNumber});
  announce(`訂單 ${completedNumber} 已安全建立`);
}

function handleAction(button) {
  const action = button.dataset.action;
  const state = store.getState();

  switch (action) {
    case 'quick-toggle':
      store.dispatch({type:'QUICK_MODE_SET', value:!state.quickMode});
      return;
    case 'status-open':
      showTransientToast(state.online ? '本機保存、同步及主要裝置狀態正常' : '目前離線，本機仍可繼續點單');
      return;
    case 'incoming-open':
      replaceState({...state, incomingBatch:{...state.incomingBatch, visible:true, orderIds:state.incomingOrders.filter(order => order.status === 'pending').map(order => order.id)}}, {type:'INCOMING_MODAL_OPENED'});
      return;
    case 'search-open':
      store.dispatch({type:'SEARCH_OPEN'});
      requestAnimationFrame(() => document.getElementById('search-input')?.focus());
      return;
    case 'search-clear':
      store.dispatch({type:'SEARCH_CLEAR'});
      return;
    case 'product-add':
      addProduct(button.dataset.productId);
      return;
    case 'product-open': {
      const productId = button.dataset.productId;
      const existing = [...state.cart].reverse().find(item => item.productId === productId);
      if (existing) {
        replaceState({...state, overlay:{type:'product-rule', productId, lineId:existing.lineId}}, {type:'PRODUCT_RULE_OPENED'});
      } else {
        addProduct(productId, {openOptions:true});
      }
      return;
    }
    case 'cart-increase':
      replaceState({...state, cart:changeCartItemQuantity(state.cart, button.dataset.lineId, 1)}, {type:'CART_QUANTITY_CHANGED'});
      return;
    case 'cart-decrease':
      replaceState({...state, cart:changeCartItemQuantity(state.cart, button.dataset.lineId, -1)}, {type:'CART_QUANTITY_CHANGED'});
      return;
    case 'cart-remove': {
      const item = state.cart.find(line => line.lineId === button.dataset.lineId);
      if (!item) return;
      replaceState({...state, cart:removeCartItem(state.cart, item.lineId), toast:{message:`已移除 ${item.name}`, undo:{type:'RESTORE_ITEM', item}}}, {type:'CART_ITEM_REMOVED'});
      return;
    }
    case 'cart-clear':
      if (state.cart.length && window.confirm('確定清空目前購物車？此操作會移除所有尚未落單的餐點。')) {
        replaceState({...state, cart:[], toast:{message:'購物車已清空'}}, {type:'CART_CLEARED'});
      }
      return;
    case 'draft':
      showTransientToast(state.cart.length ? '目前訂單已暫存在本機，不會派流水或打印' : '未有可取回的暫存單');
      return;
    case 'checkout-open':
      if (!openFirstMissingRequired()) replaceState({...state, overlay:{type:'checkout'}}, {type:'CHECKOUT_OPENED'});
      return;
    case 'overlay-close':
      replaceState({...state, overlay:null}, {type:'OVERLAY_CLOSED'});
      return;
    case 'option-select': {
      const groupId = button.dataset.groupId;
      const valueId = button.dataset.valueId;
      const valueLabel = groupId === 'rice'
        ? ({braised:'肉燥飯', curry:'咖喱飯', vegetable:'菜飯'}[valueId] ?? valueId)
        : valueId;
      replaceState({...state, cart:updateCartItemOptions(state.cart, button.dataset.lineId, {[groupId]:valueId, [`${groupId}Label`]:valueLabel})}, {type:'CART_OPTION_SELECTED'});
      return;
    }
    case 'product-rule-save':
      if (getRequiredState(state.cart).canCheckout || state.overlay?.type === 'product-rule') {
        const line = state.cart.find(item => item.lineId === state.overlay?.lineId);
        const lineRequired = line ? getRequiredState([line]) : {canCheckout:true};
        if (lineRequired.canCheckout) {
          replaceState({...state, overlay:null, toast:{message:'餐點選項已儲存'}}, {type:'PRODUCT_RULE_SAVED'});
        }
      }
      return;
    case 'checkout-field-select':
      store.dispatch({type:'CHECKOUT_FIELD_SET', field:button.dataset.field, value:button.dataset.value === 'none' ? null : button.dataset.value});
      announce(`${button.textContent.trim()} 已選擇`);
      return;
    case 'payment-select':
      store.dispatch({type:'CHECKOUT_PAYMENT_SET', value:button.dataset.payment});
      announce(`${button.textContent.trim()} 已選擇`);
      return;
    case 'order-confirm':
      confirmOrder();
      return;
    case 'incoming-later':
      store.dispatch({type:'INCOMING_LATER'});
      announce('新訂單已保留在待處理列表');
      return;
    case 'incoming-review':
      replaceState({...state, page:'orders', incomingBatch:{...state.incomingBatch, visible:false, reminderRequired:true}, toast:{message:'已開啟待處理訂單列表'}}, {type:'INCOMING_REVIEW_OPENED'});
      return;
    case 'undo':
      if (state.undo?.type === 'RESTORE_ITEM') {
        replaceState({...state, cart:[...state.cart, state.undo.item], undo:null, toast:{message:'餐點已復原'}}, {type:'UNDO_COMPLETED'});
      }
      return;
  }
}

app.addEventListener('click', event => {
  const pageButton = event.target.closest('[data-page]');
  if (pageButton) {
    store.dispatch({type:'PAGE_SET', page:pageButton.dataset.page});
    return;
  }
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    store.dispatch({type:'CATEGORY_SET', value:categoryButton.dataset.category});
    return;
  }
  const actionButton = event.target.closest('[data-action]');
  if (actionButton instanceof HTMLButtonElement) handleAction(actionButton);
});

app.addEventListener('input', event => {
  if (event.target.id === 'search-input') {
    store.dispatch({type:'SEARCH_QUERY_SET', value:event.target.value});
  }
  if (event.target.matches('[data-field="note"]')) {
    store.dispatch({type:'CHECKOUT_FIELD_SET', field:'note', value:event.target.value});
  }
});

app.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.classList.contains('product-image')) return;
  const wrap = image.closest('.product-image-wrap');
  wrap?.classList.add('is-missing');
  const fallback = wrap?.querySelector(`.${IMAGE_FALLBACK_CLASS}`);
  if (fallback) fallback.textContent = IMAGE_FALLBACK_TEXT;
  image.alt = IMAGE_FALLBACK_TEXT;
}, true);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && store.getState().overlay) {
    const state = store.getState();
    replaceState({...state, overlay:null}, {type:'OVERLAY_CLOSED_BY_KEYBOARD'});
  }
});

window.addEventListener('online', () => store.dispatch({type:'ONLINE_SET', value:true}));
window.addEventListener('offline', () => store.dispatch({type:'ONLINE_SET', value:false}));
window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', () => scheduleRender());
store.subscribe(() => scheduleRender());

function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Intl.DateTimeFormat('zh-HK', {hour:'2-digit', minute:'2-digit', hour12:false}).format(new Date());
}
setInterval(updateClock, 30_000);

render({restore:false});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
