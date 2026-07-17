import {copy} from './smt-copy.js';
import {icon} from './smt-icons.js';
import {getCartSummary, getRequiredState} from './smt-domain.js';
import {optionGroups, demoOrders} from './smt-data.js';

const money = value => `$${Number(value || 0).toFixed(0)}`;
const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const navItems = [
  ['order', 'order', copy.nav.order],
  ['orders', 'orders', copy.nav.orders],
  ['dine', 'dine', copy.nav.dine],
  ['sold', 'sold', copy.nav.sold],
  ['more', 'more', copy.nav.more]
];

function pendingCount(state) {
  return state.incomingOrders.filter(order => order.status === 'pending').length;
}

function topBar(state) {
  const pending = pendingCount(state);
  return `<header class="topbar" aria-label="店舖狀態">
    <div class="brand-lockup">
      <span class="brand-seed" aria-hidden="true"></span>
      <span><strong>${copy.app.name}</strong><small>${copy.app.subtitle}</small></span>
    </div>
    <div class="status-cluster" aria-label="營業及連線狀態">
      <span class="state-chip state-chip-success">${copy.app.open}</span>
      <span class="state-line">${icon('wifi')}<span><strong>${state.online ? copy.app.online : copy.app.offline}</strong><small>${state.online ? copy.app.syncing : copy.app.syncLater}</small></span></span>
    </div>
    <div class="priority-summary">
      <span><small>當前流水</small><strong class="order-number">${esc(state.currentOrderNumber)}</strong></span>
      <button class="priority-button" data-action="incoming-open" ${pending ? '' : 'disabled'}>
        ${icon('orders')}<span><strong>${pending}</strong><small>${copy.status.newOrders}</small></span>
      </button>
    </div>
    <div class="top-actions">
      <button class="text-icon-button" data-action="quick-toggle" aria-pressed="${state.quickMode}">${state.quickMode ? '快速模式：開' : '快速模式：關'}</button>
      <button class="icon-text-compact" data-action="status-open">${icon('warning')}<span>${copy.status.statusCenter}</span></button>
      <time id="clock" aria-label="現在時間">--:--</time>
    </div>
  </header>`;
}

function bottomNav(state) {
  const pending = pendingCount(state);
  return `<nav class="bottom-nav" aria-label="主要功能">${navItems.map(([page, iconName, label]) => `
    <button class="nav-item ${state.page === page ? 'is-active' : ''}" data-page="${page}" aria-current="${state.page === page ? 'page' : 'false'}">
      ${icon(iconName)}<span>${label}</span>${page === 'orders' && pending ? `<em aria-label="${pending} 張新訂單">${pending}</em>` : ''}
    </button>`).join('')}</nav>`;
}

function imageMarkup(product) {
  return `<div class="product-image-wrap">
    <img class="product-image" src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy" decoding="async">
    <span class="image-fallback" data-image-fallback="餐點圖片暫未提供">餐點圖片暫未提供</span>
  </div>`;
}

function productCard(product, count) {
  const unavailable = product.availability !== 'available';
  const status = product.availability === 'sold-out' ? copy.status.soldOut : product.availability === 'paused' ? copy.status.paused : '';
  return `<article class="product-card ${unavailable ? 'is-unavailable' : ''}" data-product-card="${esc(product.id)}">
    <button class="product-main" data-action="product-add" data-product-id="${esc(product.id)}" ${unavailable ? 'disabled' : ''} aria-label="加入 ${esc(product.code)} ${esc(product.name)}">
      <span class="product-copy"><span class="product-code">${esc(product.code)}</span><strong>${esc(product.name)}</strong><span class="product-price">${money(product.price)}</span></span>
      ${imageMarkup(product)}
      ${product.hot ? '<span class="hot-label">人氣</span>' : ''}
      ${count ? `<span class="quantity-badge" aria-label="購物車已有 ${count} 件">${count}</span>` : ''}
      ${status ? `<span class="availability-label">${icon('warning')}<b>${status}</b></span>` : ''}
    </button>
    <button class="card-detail-button" data-action="product-open" data-product-id="${esc(product.id)}">查看選項</button>
  </article>`;
}

function readableOptionText(options = {}) {
  const labels = Object.entries(options).filter(([key, value]) => key.endsWith('Label') && value).map(([, value]) => value);
  if (labels.length) return labels.join(' · ');
  return Object.entries(options).filter(([key, value]) => !key.endsWith('Label') && value && !['braised','curry','vegetable'].includes(value)).map(([, value]) => value).join(' · ');
}

function cartLine(item) {
  const optionText = readableOptionText(item.options);
  return `<article class="cart-line" data-cart-line="${esc(item.lineId)}">
    <div class="cart-line-copy"><span class="line-code">${esc(item.code)}</span><strong>${esc(item.name)}</strong>${optionText ? `<small>${esc(optionText)}</small>` : ''}</div>
    <strong class="line-price">${money(item.unitPrice * item.qty)}</strong>
    <div class="quantity-stepper" aria-label="${esc(item.name)} 數量">
      <button data-action="cart-decrease" data-line-id="${esc(item.lineId)}" aria-label="減少一件">−</button>
      <span aria-live="polite">${item.qty}</span>
      <button data-action="cart-increase" data-line-id="${esc(item.lineId)}" aria-label="增加一件">＋</button>
    </div>
    <button class="remove-button" data-action="cart-remove" data-line-id="${esc(item.lineId)}">${copy.actions.remove}</button>
  </article>`;
}

function cartPanel(state) {
  const summary = getCartSummary(state.cart);
  const required = getRequiredState(state.cart);
  const primary = !state.cart.length
    ? copy.order.chooseFirst
    : !required.canCheckout
      ? `${copy.order.required} · 尚欠 ${required.missingCount} 項`
      : `${copy.actions.checkout} ${money(summary.subtotal)}`;
  return `<aside class="cart-panel" aria-label="目前訂單">
    <div class="panel-heading"><span><small>現場外賣</small><h1>目前訂單</h1></span><button class="quiet-danger" data-action="cart-clear" ${state.cart.length ? '' : 'disabled'}>${copy.actions.clearCart}</button></div>
    <div class="cart-scroll">${state.cart.length ? state.cart.map(cartLine).join('') : `<div class="empty-state">${icon('cart')}<strong>${copy.order.emptyTitle}</strong><span>${copy.order.emptyBody}</span></div>`}</div>
    <footer class="cart-footer">
      <dl class="summary-list"><div><dt>${copy.order.quantity}</dt><dd>${summary.itemCount}</dd></div><div><dt>${copy.order.subtotal}</dt><dd>${money(summary.subtotal)}</dd></div><div class="summary-total"><dt>${copy.order.total}</dt><dd>${money(summary.subtotal)}</dd></div></dl>
      <div class="cart-actions"><button class="secondary-button" data-action="draft">${state.cart.length ? copy.actions.draft : copy.actions.retrieve}</button><button class="primary-button" data-action="checkout-open" ${state.cart.length ? '' : 'disabled'}>${primary}</button></div>
    </footer>
  </aside>`;
}

function orderPage(state, products, categories) {
  const query = state.search.query.trim().toLowerCase();
  const visible = products.filter(product =>
    (state.category === '全部' || product.category === state.category) &&
    (!query || product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query))
  );
  return `<section class="order-layout">
    ${cartPanel(state)}
    <section class="catalog-panel" aria-label="商品目錄">
      <div class="catalog-toolbar">
        <div class="category-list" role="tablist" aria-label="商品分類">${categories.map(category => `<button role="tab" aria-selected="${state.category === category}" class="category-button ${state.category === category ? 'is-active' : ''}" data-category="${esc(category)}">${esc(category)}</button>`).join('')}</div>
        <button class="search-toggle" data-action="search-open">${icon('search')}<span>${copy.order.search}</span></button>
      </div>
      ${state.search.open ? `<label class="search-field">${icon('search')}<span class="sr-only">${copy.order.search}</span><input id="search-input" value="${esc(state.search.query)}" placeholder="${copy.order.searchPlaceholder}" autocomplete="off"><button data-action="search-clear">清除</button></label>` : ''}
      <div class="product-grid">${visible.length ? visible.map(product => productCard(product, state.cart.filter(item => item.productId === product.id).reduce((sum, item) => sum + item.qty, 0))).join('') : `<div class="empty-state catalog-empty">${icon('search')}<strong>${copy.order.noResult}</strong><span>請嘗試其他商品名稱或編號</span></div>`}</div>
    </section>
  </section>`;
}

function ordersPage(state) {
  const rows = state.orders.length ? state.orders : demoOrders;
  return `<section class="simple-page"><header class="page-heading"><span><small>開單後 30 分鐘</small><h1>${copy.nav.orders}</h1></span><span class="state-chip">${rows.length} 張進行中</span></header><div class="order-list">${rows.map(order => `<article class="order-card"><div><small>${esc(order.source)}</small><strong>${esc(order.id)}</strong></div><div><span>${esc(order.payment)}</span><span>${esc(order.print)}</span></div><strong>${money(order.amount ?? order.total)}</strong></article>`).join('')}</div></section>`;
}

function placeholderPage(title, body) {
  return `<section class="simple-page"><header class="page-heading"><span><small>SMT 操作區</small><h1>${title}</h1></span></header><div class="empty-state page-empty">${icon('order')}<strong>${title}</strong><span>${body}</span></div></section>`;
}

function optionLabel(groupId, valueId) {
  const group = optionGroups[groupId];
  return group?.values.find(value => value.id === valueId)?.label ?? valueId;
}

function productRuleDrawer(state, products) {
  if (state.overlay?.type !== 'product-rule') return '';
  const product = products.find(item => item.id === state.overlay.productId);
  const line = state.cart.find(item => item.lineId === state.overlay.lineId);
  if (!product || !line) return '';
  const required = (product.requiredGroups ?? []).map(groupId => {
    const group = optionGroups[groupId];
    const selected = line.options?.[groupId];
    return `<fieldset class="option-section"><legend><span>${esc(group.label)}</span><em>${selected ? copy.order.completed : copy.order.missing}</em></legend><div class="option-grid">${group.values.map(value => `<button type="button" class="option-button ${selected === value.id ? 'is-selected' : ''}" data-action="option-select" data-line-id="${esc(line.lineId)}" data-group-id="${esc(groupId)}" data-value-id="${esc(value.id)}"><span>${selected === value.id ? icon('check') : ''}<strong>${esc(value.label)}</strong></span><small>${esc(value.detail)}</small></button>`).join('')}</div></fieldset>`;
  }).join('');
  const missing = getRequiredState([line]).missingCount;
  return `<div class="overlay-layer" data-overlay-backdrop><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="product-drawer-title">
    <header class="drawer-header"><span><small>${product.code} · ${money(product.price)}</small><h2 id="product-drawer-title">${esc(product.name)}</h2></span><button class="close-button" data-action="overlay-close">${copy.actions.close}</button></header>
    <div class="drawer-progress ${missing ? 'is-warning' : 'is-complete'}">${missing ? `尚欠 ${missing} 項必選內容` : '必選內容已完成'}</div>
    <div class="drawer-body">${required || '<p class="plain-message">此商品沒有必選內容，可以直接加入。</p>'}</div>
    <footer class="drawer-footer"><button class="secondary-button" data-action="overlay-close">${copy.actions.cancel}</button><button class="primary-button" data-action="product-rule-save" ${missing ? 'disabled' : ''}>${copy.actions.save}</button></footer>
  </aside></div>`;
}

function checkoutChoice({label, field, value, selected}) {
  return `<button class="choice-button ${selected ? 'is-selected' : ''}" data-action="checkout-field-select" data-field="${esc(field)}" data-value="${esc(value)}">${selected ? icon('check') : ''}<strong>${esc(label)}</strong>${selected ? '<span>已選擇</span>' : ''}</button>`;
}

function checkoutDrawer(state) {
  if (state.overlay?.type !== 'checkout') return '';
  const summary = getCartSummary(state.cart);
  const sourceOptions = [['walk-in','現場外賣'],['whatsapp','WhatsApp'],['phone','電話']];
  const modeOptions = [['takeaway','外賣自取'],['dine-in','堂食']];
  const packagingOptions = [['standard','標準包裝'],['no-cutlery','毋須餐具']];
  const discountOptions = [['none','不使用優惠'],['memory-voucher','記憶優惠券']];
  const paymentOptions = [['cash','現金'],['fps','FPS'],['payme','PayMe'],['store','到店付款']];
  return `<div class="overlay-layer" data-overlay-backdrop><aside class="drawer checkout-drawer" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
    <header class="drawer-header"><span><small>確認資料後才建立正式流水</small><h2 id="checkout-title">${copy.checkout.title}</h2></span><button class="close-button" data-action="overlay-close">${copy.actions.close}</button></header>
    <div class="drawer-body checkout-flow">
      <section><h3>1 · ${copy.checkout.source}</h3><div class="choice-grid">${sourceOptions.map(([value,label]) => checkoutChoice({label,field:'source',value,selected:state.checkout.source===value})).join('')}</div></section>
      <section><h3>2 · ${copy.checkout.mode}</h3><div class="choice-grid">${modeOptions.map(([value,label]) => checkoutChoice({label,field:'mode',value,selected:state.checkout.mode===value})).join('')}</div></section>
      <section><h3>3 · ${copy.checkout.packaging}</h3><div class="choice-grid">${packagingOptions.map(([value,label]) => checkoutChoice({label,field:'packaging',value,selected:state.checkout.packaging===value})).join('')}</div></section>
      <section><h3>4 · ${copy.checkout.discount}</h3><div class="choice-grid">${discountOptions.map(([value,label]) => checkoutChoice({label,field:'discount',value,selected:(state.checkout.discount ?? 'none')===value})).join('')}</div></section>
      <section><h3>5 · ${copy.checkout.payment}</h3><div class="choice-grid payment-grid">${paymentOptions.map(([id,label]) => `<button class="choice-button ${state.checkout.paymentMethod === id ? 'is-selected' : ''}" data-action="payment-select" data-payment="${id}">${state.checkout.paymentMethod === id ? icon('check') : ''}<strong>${label}</strong>${state.checkout.paymentMethod === id ? '<span>已選擇</span>' : ''}</button>`).join('')}</div></section>
      <details class="optional-details" ${state.checkout.optionalOpen ? 'open' : ''}><summary>6 · ${copy.checkout.optional}</summary><label>訂單備註<textarea data-field="note" placeholder="一般備註不會阻塞落單">${esc(state.checkout.note)}</textarea></label></details>
      <div class="checkout-total"><span>${copy.order.total}</span><strong>${money(summary.subtotal)}</strong></div>
    </div>
    <footer class="drawer-footer"><button class="secondary-button" data-action="overlay-close">${copy.actions.back}</button><button class="primary-button" data-action="order-confirm" ${state.checkout.paymentMethod && !state.checkout.saving ? '' : 'disabled'}>${state.checkout.saving ? copy.checkout.saving : copy.actions.confirmOrder}</button></footer>
  </aside></div>`;
}

function incomingBatchModal(state) {
  if (!state.incomingBatch.visible) return '';
  const orders = state.incomingOrders.filter(order => state.incomingBatch.orderIds.includes(order.id));
  const total = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
  return `<div class="modal-layer"><section class="modal-card" role="alertdialog" aria-modal="true" aria-labelledby="incoming-title">
    <div class="modal-kicker">${copy.status.newOrders}</div><h2 id="incoming-title">收到 ${orders.length} 張待處理訂單</h2><p>先查看供應、付款及重要備註，再決定是否接受或先製作。</p>
    <div class="batch-summary"><span><small>訂單數量</small><strong>${orders.length}</strong></span><span><small>合計金額</small><strong>${money(total)}</strong></span></div>
    <footer class="modal-actions"><button class="secondary-button" data-action="incoming-later">${copy.actions.later}</button><button class="primary-button" data-action="incoming-review">${copy.actions.review}</button></footer>
  </section></div>`;
}

function toast(state) {
  if (!state.toast) return '';
  return `<div class="toast" role="status"><span>${esc(state.toast.message)}</span>${state.toast.undo ? `<button data-action="undo">${copy.actions.undo}</button>` : ''}</div>`;
}

function mainPage(state, products, categories) {
  if (state.page === 'order') return orderPage(state, products, categories);
  if (state.page === 'orders') return ordersPage(state);
  if (state.page === 'dine') return placeholderPage(copy.nav.dine, '枱卡、30 分鐘訂單計時及 35 分鐘枱面提示會在下一切片接入。');
  if (state.page === 'sold') return placeholderPage(copy.nav.sold, '商品保持原位置，售罄及暫停狀態會清楚標示。');
  return placeholderPage(copy.nav.more, '打印、日結、報表及裝置狀態會按 Lock 分區整理。');
}

export function renderApp(state, {products = [], categories = []} = {}) {
  return `<div class="app-shell ${state.quickMode ? 'is-quick' : ''}">
    ${topBar(state)}
    <main id="workspace" class="workspace" tabindex="-1">${mainPage(state, products, categories)}</main>
    ${bottomNav(state)}
    ${productRuleDrawer(state, products)}
    ${checkoutDrawer(state)}
    ${incomingBatchModal(state)}
    ${toast(state)}
  </div>`;
}

export {optionLabel};
