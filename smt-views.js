import {copy} from './smt-copy.js';
import {icon} from './smt-icons.js';
import {getCartSummary, getRequiredState} from './smt-domain.js';
import {optionGroups, demoOrders} from './smt-data.js';

const money = value => `$${Number(value || 0).toFixed(0)}`;
const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const navItems = [
  ['order', 'order', '點單'],
  ['orders', 'orders', '訂單'],
  ['dine', 'dine', '堂食'],
  ['sold', 'sold', '售罄'],
  ['more', 'more', '更多']
];

const categoryIcons = {
  '全部':'more','人氣推薦':'check','飯團':'package','飯團套餐':'receipt','便當':'order',
  '紫米沙律':'dine','薯角餐':'package','小食':'cart','飲品':'cash'
};

const pendingCount = state => state.incomingOrders.filter(order => order.status === 'pending').length;
const mockOrders = [
  {id:'A512', seq:'#1028', source:'App（iOS）', accepted:'12:10', elapsed:'10 分鐘', left:'20:00', items:'椒麻雞飯、黃金炸雞（辣）、可樂', count:'3 件', payment:'已付款', print:'已打印', sync:'已同步', amount:560, tone:'ok'},
  {id:'W331', seq:'#1027', source:'網站', accepted:'12:08', elapsed:'12 分鐘', left:'18:00', items:'滷肉飯、味噌湯', count:'2 件', payment:'付款待核', print:'列印異常', sync:'已同步', amount:340, tone:'warn'},
  {id:'A509', seq:'#1026', source:'App（Android）', accepted:'12:05', elapsed:'17 分鐘', left:'13:00', items:'牛肉丼、小菜三拼、紅茶', count:'4 件', payment:'已付款', print:'已打印', sync:'已同步', amount:620, tone:'ok'},
  {id:'W329', seq:'#1025', source:'網站', accepted:'11:58', elapsed:'27 分鐘', left:'03:00', items:'海鮮炒飯', count:'1 件', payment:'已付款', print:'列印異常', sync:'已同步', amount:260, tone:'danger'}
];

function brandMark() {
  return `<span class="brand-mark" aria-hidden="true"><i></i><b></b></span>`;
}

function topBar(state) {
  const pending = pendingCount(state);
  return `<header class="topbar replica-topbar" aria-label="店舖狀態">
    <div class="brand-lockup">${brandMark()}<span><strong>磨飯 SMT</strong><small>More Fun · 店舖操作台</small></span></div>
    <div class="top-status-row">
      <span class="top-chip top-chip-success">${icon('check')}<b>營業中</b></span>
      <span class="top-chip ${state.online ? 'top-chip-neutral' : 'top-chip-warning'}">${icon(state.online ? 'wifi' : 'warning')}<b>${state.online ? '線上' : '離線可工作'}</b></span>
      <span class="top-chip top-chip-neutral">${icon('cloud')}<b>本機已保存</b></span>
      <span class="top-chip top-chip-neutral">${icon('sync')}<b>Outbox 58</b></span>
    </div>
    <div class="top-order-summary">
      <span><small>序號</small><strong>${esc(state.currentOrderNumber)}</strong></span>
      <button data-action="incoming-open" class="top-alert" ${pending ? '' : 'disabled'}>${icon('bell')}<em>${pending || 3}</em><span>新訂單</span></button>
    </div>
    <div class="top-actions">
      <span class="top-date">${icon('calendar')}<b>2026/07/18 六</b></span>
      <time id="clock">--:--</time>
      <button class="quick-toggle ${state.quickMode ? 'is-on' : ''}" data-action="quick-toggle" aria-pressed="${state.quickMode}"><span></span><b>快速模式</b></button>
      <button class="top-more-button" data-action="status-open">${icon('more')}<b>狀態</b></button>
    </div>
  </header>`;
}

function bottomNav(state) {
  const pending = pendingCount(state) || 3;
  return `<nav class="bottom-nav replica-bottom-nav" aria-label="主要功能">${navItems.map(([page, iconName, label]) => `
    <button class="nav-item ${state.page === page ? 'is-active' : ''}" data-page="${page}" aria-current="${state.page === page ? 'page' : 'false'}">
      ${icon(iconName)}<span>${label}</span>${page === 'orders' ? `<em>${pending}</em>` : ''}
    </button>`).join('')}</nav>`;
}

function imageMarkup(product) {
  return `<div class="product-image-wrap">
    <img class="product-image" src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy" decoding="async">
    <span class="image-fallback">餐點圖片暫未提供</span>
  </div>`;
}

function productCard(product, count) {
  const unavailable = product.availability !== 'available';
  const status = product.availability === 'sold-out' ? '售罄' : product.availability === 'paused' ? '暫停' : '';
  return `<article class="product-card ${unavailable ? 'is-unavailable' : ''}">
    <button class="product-main" data-action="product-add" data-product-id="${esc(product.id)}" ${unavailable ? 'disabled' : ''}>
      ${imageMarkup(product)}
      <span class="product-meta"><span class="product-code">${esc(product.code)}</span><strong>${esc(product.name)}</strong><b>${money(product.price)}</b></span>
      ${product.hot ? '<span class="hot-label">熱門</span>' : ''}
      ${count ? `<span class="quantity-badge">${count}</span>` : ''}
      ${status ? `<span class="availability-label">${status}</span>` : ''}
    </button>
    <button class="card-add-button" data-action="product-open" data-product-id="${esc(product.id)}" ${unavailable ? 'disabled' : ''}>${icon('plus')}<span>加入／選項</span></button>
  </article>`;
}

function categoryRail(state, categories) {
  return `<aside class="category-rail" aria-label="商品分類">
    <button class="category-rail-head" data-category="全部">${icon('more')}<span>全部分類</span></button>
    <div class="category-list">${categories.filter(item => item !== '全部').map(category => `
      <button class="category-rail-item ${state.category === category ? 'is-active' : ''}" data-category="${esc(category)}">
        ${icon(categoryIcons[category] || 'order')}<span>${esc(category)}</span>
      </button>`).join('')}</div>
  </aside>`;
}

function readableOptionText(options = {}) {
  return Object.entries(options)
    .filter(([key, value]) => key.endsWith('Label') && value)
    .map(([, value]) => value).join(' · ');
}

function cartLine(item) {
  const optionText = readableOptionText(item.options);
  return `<article class="cart-line">
    <div class="cart-line-copy"><span>${esc(item.code)}</span><strong>${esc(item.name)}</strong>${optionText ? `<small>${esc(optionText)}</small>` : ''}</div>
    <div class="cart-line-side"><strong>${money(item.unitPrice * item.qty)}</strong><button class="line-menu" data-action="product-open" data-product-id="${esc(item.productId)}">•••</button></div>
    <div class="quantity-stepper">
      <button data-action="cart-decrease" data-line-id="${esc(item.lineId)}">−</button><span>${item.qty}</span><button data-action="cart-increase" data-line-id="${esc(item.lineId)}">＋</button>
    </div>
    <button class="remove-button" data-action="cart-remove" data-line-id="${esc(item.lineId)}">移除</button>
  </article>`;
}

function cartPanel(state) {
  const summary = getCartSummary(state.cart);
  const required = getRequiredState(state.cart);
  const primary = !state.cart.length ? '先選擇餐點' : !required.canCheckout ? `先整理 · 尚欠 ${required.missingCount} 項` : `結帳 ${money(summary.subtotal)}`;
  return `<aside class="cart-panel replica-cart" aria-label="目前訂單">
    <header class="cart-header"><div><small>現場外賣</small><h1>目前訂單</h1></div><span class="cart-source-chip">取餐號 ${esc(state.currentOrderNumber)}</span></header>
    <div class="cart-scroll">${state.cart.length ? state.cart.map(cartLine).join('') : `<div class="empty-state cart-empty">${icon('cart')}<strong>購物車為空</strong><span>由中間商品卡直接加入餐點</span></div>`}</div>
    <div class="quick-drinks"><strong>快速飲品</strong><div><button data-action="demo-action">可樂 $10</button><button data-action="demo-action">檸檬紅茶 $18</button><button data-action="demo-action">凍咖啡 $22</button></div></div>
    <footer class="cart-footer">
      <dl><div><dt>小計</dt><dd>${money(summary.subtotal)}</dd></div><div><dt>服務費</dt><dd>$0</dd></div><div><dt>合計</dt><dd>${money(summary.subtotal)}</dd></div></dl>
      ${!required.canCheckout && state.cart.length ? `<div class="required-banner">${icon('warning')}<span><strong>尚有 ${required.missingCount} 項必選未完成</strong><small>完成後才可正式結帳</small></span></div>` : ''}
      <div class="cart-actions"><button class="secondary-button" data-action="draft">${state.cart.length ? '暫存' : '取單'}</button><button class="primary-button" data-action="checkout-open" ${state.cart.length ? '' : 'disabled'}>${primary}</button></div>
    </footer>
  </aside>`;
}

function orderPage(state, products, categories) {
  const query = state.search.query.trim().toLowerCase();
  const visible = products.filter(product =>
    (state.category === '全部' || product.category === state.category || (state.category === '人氣推薦' && product.hot)) &&
    (!query || product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query))
  );
  return `<section class="order-workspace replica-page">
    ${categoryRail(state, categories)}
    <section class="catalog-panel">
      <header class="catalog-header">
        <div><small>SMT-02 + SMT-03</small><h1>點單主頁</h1></div>
        <div class="catalog-tools">
          <button class="search-toggle" data-action="search-open">${icon('search')}<span>搜尋餐點名稱</span></button>
          <button class="filter-button" data-action="demo-action">${icon('filter')}<span>分類／篩選</span></button>
        </div>
      </header>
      ${state.search.open ? `<label class="search-field">${icon('search')}<input id="search-input" value="${esc(state.search.query)}" placeholder="搜尋商品名稱或編號"><button data-action="search-clear">清除</button></label>` : ''}
      <div class="catalog-tabs"><button class="is-active">人氣推薦</button><button>飯團</button><button>便當</button><button>小食</button><button>飲品</button></div>
      <div class="product-grid">${visible.map(product => productCard(product, state.cart.filter(item => item.productId === product.id).reduce((sum, item) => sum + item.qty, 0))).join('')}</div>
    </section>
    ${cartPanel(state)}
  </section>`;
}

function timerCircle(order) {
  return `<div class="timer-circle timer-${order.tone}"><span>${order.left}</span><small>剩餘時間</small></div>`;
}

function ordersPage(state) {
  const rows = state.orders.length ? state.orders.map((order, index) => ({
    id: order.id, seq:`#${1029 + index}`, source:order.source || '現場外賣', accepted:'剛剛', elapsed:'0 分鐘', left:'30:00', items:order.items?.map(item => item.name).join('、') || '餐點', count:`${order.items?.length || 1} 件`, payment:'已付款', print:'已打印', sync:'已同步', amount:order.total, tone:'ok'
  })) : mockOrders;
  return `<section class="orders-page replica-page">
    <header class="page-toolbar"><div><small>SMT-05 + SMT-06 · 新 App／Web 訂單提醒＋30 分鐘</small><h1>訂單</h1></div><div class="segmented"><button class="is-active">進行中</button><button>歷史</button></div></header>
    <div class="order-filters"><label>來源 <button>全部⌄</button></label><label>付款核實 <button>全部⌄</button></label><label>打印異常 <button>全部⌄</button></label><label class="order-search">${icon('search')}<input placeholder="搜尋取餐號／核對碼／備註"></label></div>
    <div class="order-table-head"><span>序號／取餐號</span><span>來源</span><span>接單時間</span><span>餐點摘要</span><span>倒數計時</span><span>付款狀態</span><span>列印狀態</span><span>同步狀態</span><span>金額</span></div>
    <div class="live-order-list">${rows.map(order => `<article class="live-order-row">
      <div class="order-id"><small>${order.seq}</small><strong>${esc(order.id)}</strong></div>
      <div class="source-cell">${icon(order.source.includes('App') ? 'device' : order.source.includes('網站') ? 'cloud' : 'order')}<span>${esc(order.source)}</span></div>
      <div><strong>${order.accepted}</strong><small>${order.elapsed}</small></div>
      <div class="items-cell"><strong>${esc(order.items)}</strong><small>${order.count}</small></div>
      ${timerCircle(order)}
      <span class="status-pill status-success">${order.payment}</span>
      <span class="status-pill ${order.print.includes('異常') ? 'status-danger' : 'status-success'}">${order.print}</span>
      <span class="status-pill status-success">${order.sync}</span>
      <strong>${money(order.amount)}</strong>
    </article>`).join('')}</div>
    <footer class="orders-rule-strip"><span>${icon('lock')}<b>不提供「製作中／完成」手動流程</b></span><span>${icon('cash')}<b>付款核實與列印異常不阻擋自動完成</b></span><span>${icon('refresh')}<b>重複提交不重複建立訂單</b></span></footer>
  </section>`;
}

const tableData = [
  ['A1','已清',4,'12:05','$680','ok'],['A2','已付',2,'12:10','$520','ok'],['A3','35 分鐘',3,'11:55','$980','danger'],['A5','未付',6,'12:15','$1,260','warn'],
  ['B1','35 分鐘',4,'11:20','$690','danger'],['B2','已付',2,'12:02','$1,140','ok'],['B3','空枱',0,'—','$0','empty'],['B5','未付',3,'12:18','$1,890','warn'],
  ['C1','空枱',0,'—','$0','empty'],['C2','未付',2,'12:20','$320','warn'],['C3','35 分鐘',3,'11:40','$860','danger'],['C5','空枱',0,'—','$0','empty']
];

function dinePage() {
  return `<section class="dine-page replica-page">
    <header class="page-toolbar dine-toolbar"><div><small>SMT-07 + SMT-08</small><h1>堂食枱面</h1></div><div class="dine-switch"><button class="is-active">堂食</button><button>外賣</button><button>外送</button></div><label>${icon('search')}<input placeholder="搜尋枱號／客戶／電話"></label><button class="primary-small">＋ 開枱</button></header>
    <div class="dine-layout">
      <section class="table-grid">${tableData.map(([table,status,people,time,total,tone]) => `<article class="table-card table-${tone}">
        <header><strong>${table}</strong><span>${status}</span></header>
        ${tone === 'empty' ? `<button class="empty-table" data-action="demo-action">${icon('plus')}<span>開枱</span></button>` : `<div class="table-body"><span>${icon('dine')} ${people} 人</span><span>${icon('clock')} 食 ${time}</span><span>待確認 ${tone === 'warn' ? 2 : tone === 'danger' ? 3 : 0}</span><strong>${total}</strong></div>`}
      </article>`).join('')}</section>
      <aside class="table-detail">
        <header><div><h2>A3</h2><span>${icon('dine')} 3 人　食 11:55　已開 23 分鐘</span></div><span class="status-pill status-warning">未付</span></header>
        <div class="table-order-meta"><b>Order ID　2026071801234</b><span>序號 SN-000123</span></div>
        <section><h3>第一輪 · 12:05</h3><ul><li><span>香煎雞腿飯</span><b>x1　$260　已送</b></li><li><span>蒜香鮮蝦意大利麵</span><b>x1　$240　已送</b></li><li><span>可樂</span><b>x2　$80　已送</b></li></ul></section>
        <section><h3>新加單 1 · 12:18</h3><ul><li><span>炸雞翅（6入）</span><b>x1　$180　製作中</b></li><li><span>檸檬紅茶</span><b>x2　$80　製作中</b></li></ul></section>
        <section><h3>新加單 2 · 12:26</h3><ul><li><span>海鮮炒烏龍</span><b>x1　$260　待出單</b></li></ul></section>
        <footer><div><small>小計</small><strong>$1,100</strong></div><div><small>服務費 10%</small><strong>$110</strong></div><div class="grand"><small>總額</small><strong>$1,210</strong></div></footer>
      </aside>
    </div>
    <div class="dine-bottom-panels">
      <section class="shared-draft"><header><div><small>共享草稿／QR 草稿抽屜</small><h3>枱號 A3　共享草稿（待確認 2）</h3></div><span>QR 加入</span></header><div><p><b>香煎雞腿飯</b><span>x1　$260　12:18</span></p><p><b>蒜香鮮蝦意大利麵</b><span>x1　$240　12:20</span></p><p><b>可樂</b><span>x2　$80　12:21</span></p></div><button>確認並建立訂單</button></section>
      <section class="split-payment"><header><h3>A3 · 分項付款</h3><span>應付總額 $1,210</span></header><div class="split-groups"><article><b>組別 A · 未付</b><strong>$700</strong><small>香煎雞腿飯、炸雞翅、檸檬紅茶</small></article><article><b>組別 B · 已付</b><strong>$510</strong><small>蒜香鮮蝦意大利麵、可樂</small></article></div><div class="split-actions"><button class="primary-button">分項付款</button><button class="secondary-button">整單付款</button><button class="secondary-button">部分外賣</button><button class="secondary-button">清枱</button></div></section>
    </div>
  </section>`;
}

const supplyItems = [
  ['鹽酥雞拌飯','$280','售賣中','ok'],['炸雞腿排定食','$240','今日售罄','danger'],['豚骨叉燒拉麵','$260','暫停供應','warn'],['蒲燒鰻魚飯','$320','Admin 停用','muted'],
  ['和風沙律','$120','售賣中','ok'],['味噌湯','$40','售賣中','ok'],['可樂','$40','今日售罄','danger'],['抹茶冰淇淋','$80','暫停供應','warn']
];
const printJobs = [
  ['廚房','#1024','2 份 香煎雞腿飯','XP-N160II 1','正常列印','10:24:13','ok'],
  ['打包','#1024','1 份 滷肉飯定食','XP-N160II 2','自動重試中','10:24:15','warn'],
  ['飯團標籤','#1025','飯團標籤 × 4','T271U 1','改送後成功','10:25:01','info'],
  ['包裝標籤','#1026','便當盒 × 4','T271U 2','需手動','10:25:30','danger'],
  ['顧客小票','#1027','桌號 3 卓','Sunmi T2s','補印 1 次','10:26:12','muted']
];

function soldPage() {
  return `<section class="sold-page replica-page">
    <header class="page-toolbar"><div><small>SMT-09 + SMT-10</small><h1>售罄／暫停供應／恢復 ＋ 打印中心</h1></div><div class="status-overview"><span><b>4</b> 售賣中</span><span><b>2</b> 今日售罄</span><span><b>1</b> 暫停供應</span><span><b>1</b> 停用</span></div></header>
    <div class="sold-layout">
      <section class="supply-control">
        <div class="sub-toolbar"><button>全部分類⌄</button><label>${icon('search')}<input placeholder="搜尋商品名稱／條碼"></label><button>${icon('filter')} 篩選</button></div>
        <div class="supply-grid">${supplyItems.map(([name,price,status,tone], index) => `<article class="supply-card supply-${tone}">
          <label><input type="checkbox" ${index === 1 || index === 6 ? 'checked' : ''}><span></span></label>
          <div class="supply-image"><img src="assets/products/${['b1','b2','b3','f4','s1','d2','d4','f6'][index]}.webp" alt="${name}"></div>
          <header><strong>${name}</strong><small>${price}</small></header><span class="supply-status">${status}</span>
        </article>`).join('')}</div>
        <footer><span>已選擇 2 項商品</span><button class="danger-button">今日售罄</button><button class="warning-button">暫停供應</button><button class="success-button">恢復供應</button></footer>
      </section>
      <section class="print-center">
        <header><div><small>集中管理所有打印工作與設備路由</small><h2>打印中心</h2></div><button>${icon('refresh')} 重新整理</button></header>
        <div class="printer-route">${[['Sunmi T2s','顧客小票','online'],['XP-N160II 1','廚房','online'],['XP-N160II 2','出餐台','online'],['T271U 1','飯團標籤','online'],['T271U 2','包裝標籤','warn']].map(([name,area,tone], i) => `<article><span>${i+1}</span>${icon(i === 0 ? 'device' : 'printer')}<strong>${name}</strong><small>${area}</small><em class="${tone}">${tone === 'online' ? '線上' : '警告'}</em></article>`).join('')}</div>
        <div class="print-table"><header><span>類型</span><span>訂單／內容</span><span>設備</span><span>狀態</span><span>時間</span><span>操作</span></header>${printJobs.map(job => `<article><span>${job[0]}</span><span><b>${job[1]}</b><small>${job[2]}</small></span><span>${job[3]}</span><span class="status-pill status-${job[6]}">${job[4]}</span><span>${job[5]}</span><button>詳情</button></article>`).join('')}</div>
        <div class="print-rule-panels"><section><h3>打印失敗不影響營運流程</h3><p>訂單仍安全保存、可正常結帳與日結，打印異常由狀態中心集中處理。</p></section><section><h3>自動重試與備用路由</h3><p>自動重試最多 3 次，失敗後改送至備用打印機並保留完整紀錄。</p></section></div>
      </section>
    </div>
  </section>`;
}

function metricCard(iconName, title, value, note, tone='normal') {
  return `<article class="metric-card metric-${tone}">${icon(iconName)}<span><small>${title}</small><strong>${value}</strong><em>${note}</em></span></article>`;
}

function morePage() {
  return `<section class="more-page replica-page">
    <header class="page-toolbar"><div><small>SMT-11 至 SMT-16</small><h1>更多／設定／報表／日結／狀態中心</h1></div><span class="status-pill status-success">系統就緒</span></header>
    <div class="more-grid">
      <button>${icon('receipt')}<strong>收銀與日結</strong><span>日結、班次、交更、對帳</span></button>
      <button>${icon('report')}<strong>報表與分析</strong><span>營運、付款、商品、來源分析</span></button>
      <button>${icon('printer')}<strong>打印與設備</strong><span>設備、測試、路由、IP 設定</span></button>
      <button>${icon('eye')}<strong>顯示與操作</strong><span>快速模式、圖片、聲音、介面</span></button>
      <button>${icon('backup')}<strong>備份與恢復</strong><span>本機、USB、雲端備份</span></button>
      <button>${icon('settings')}<strong>系統與更新</strong><span>版本、更新、日誌、狀態</span></button>
    </div>
    <div class="more-content-grid">
      <section class="report-overview panel-card">
        <header><div><small>SMT-13</small><h2>營運摘要</h2></div><div class="segmented"><button class="is-active">營運摘要</button><button>銷售分析</button><button>付款異常</button><button>商品分析</button></div></header>
        <div class="metrics-row">${metricCard('cash','今日銷售額','$28,640','↑ 12.4%','success')}${metricCard('orders','訂單數','326','↑ 8.7%','success')}${metricCard('report','客單價','$87.85','↑ 3.6%','success')}${metricCard('warning','付款待核實','$640','3 張訂單','warning')}${metricCard('cloud','平台單佔比','58.3%','↑ 2.1%','info')}</div>
        <div class="chart-and-table"><div class="mock-chart"><header><strong>今日 vs. 上一營業日同一時間</strong><span>■ 今日　■ 昨日</span></header><div class="bars"><i style="--h:78%"></i><i style="--h:68%"></i><i style="--h:45%"></i><i style="--h:38%"></i><i style="--h:72%"></i><i style="--h:63%"></i></div><footer><span>銷售額</span><span>訂單數</span><span>客單價</span></footer></div><div class="channel-table"><header><span>渠道</span><span>今日銷售額</span><span>訂單數</span><span>客單價</span><span>趨勢</span></header>${[['現場外賣','$8,420','98','$85.92','↑10.2%'],['電話','$2,860','33','$86.67','↑6.1%'],['WhatsApp','$3,250','38','$85.53','↑7.3%'],['Web','$2,910','36','$80.83','↑4.1%'],['App','$2,530','29','$87.24','↑5.6%'],['Foodpanda','$3,640','47','$77.45','↑9.9%'],['堂食','$1,450','15','$96.67','↑8.0%']].map(row => `<article>${row.map((cell,i)=>`<span class="${i===4?'trend':''}">${cell}</span>`).join('')}</article>`).join('')}</div></div>
      </section>
      <section class="refund-panel panel-card"><header><div><small>SMT-11</small><h2>退款／補收／反結帳</h2></div><span class="status-pill status-success">版本 v2</span></header><div class="version-compare"><article><small>原版本 v1</small><strong>訂單 #0012345</strong><p>炸雞腿 ×1　$80</p><p>紅茶 ×1　$40</p><b>總計 $440</b></article><span>VS</span><article><small>目前版本 v2</small><strong>訂單 #0012345</strong><p>炸雞腿 ×3　-$80</p><p>紅茶 ×2　$80</p><b>總計 $396</b></article></div><div class="refund-actions"><button class="danger-button">退款</button><button class="warning-button">補收</button><button class="primary-button">反結帳</button><button class="secondary-button">儲存版本</button></div></section>
      <section class="day-close-panel panel-card"><header><div><small>SMT-12</small><h2>日結／現金核對／支出</h2></div><span>營業日 05:00–04:59</span></header><div class="day-summary">${metricCard('orders','訂單數','156','營業日','normal')}${metricCard('cash','銷售額','$32,680','全部來源','normal')}${metricCard('cash','現金銷售額','$10,840','應收','normal')}${metricCard('cash','電子付款','$21,640','已核實','normal')}${metricCard('refund','退款／折扣','-$1,200','已記錄','warning')}</div><div class="cash-check"><label>實際錢箱<input value="$10,600"></label><label>抽取金額<input value="$500"></label><label>目標留底<input value="$1,000"></label><strong>應有現金 $10,100</strong></div><div class="difference-box"><span>差異總額</span><strong>-$240</strong><em>3% 門檻內可接受</em></div><button class="primary-button">確認日結</button></section>
      <section class="system-status panel-card"><header><div><small>SMT-15</small><h2>全局狀態中心</h2></div><span>已處理 7</span></header><div class="status-list">${[
        ['lock','本機資料安全','本機資料尚未損毀，所有操作正常','高優先','danger'],['cash','付款待核實','有 $860 付款待核實','高優先','warning'],['printer','打印失敗','有 3 筆打印失敗','高優先','danger'],['sync','售罄未同步','有 5 項售罄未同步至雲端','中優先','warning'],['database','同步積壓／離線可工作','暫存 Outbox 58 筆','中優先','info'],['backup','最近備份','今日 14:08 自動備份成功','低優先','success'],['refresh','更新提醒','新版本 SMT 1.0.8 可用','低優先','info']
      ].map(([ico,title,body,priority,tone])=>`<article>${icon(ico)}<span><strong>${title}</strong><small>${body}</small></span><em class="status-${tone}">${priority}</em><b>›</b></article>`).join('')}</div></section>
      <section class="backup-panel panel-card"><header><div><small>SMT-14</small><h2>備份與恢復／系統更新</h2></div><span class="status-pill status-success">上次備份 OK</span></header><div class="backup-flow"><article>${icon('database')}<b>本機資料</b></article><span>→</span><article>${icon('device')}<b>USB</b></article><span>→</span><article>${icon('cloud')}<b>雲端備份</b></article></div><div class="backup-schedule"><button>每日保留 7 份</button><button>每週保留 4 份</button><button>每月保留 6 份</button></div><div class="update-list"><p>${icon('check')}<span>下載更新包</span></p><p>${icon('check')}<span>驗證數位簽章</span></p><p>${icon('check')}<span>建立系統備份</span></p><p>${icon('check')}<span>Migration 驗證</span></p><p>${icon('refresh')}<span>失敗回退至上一版本</span></p></div></section>
      <section class="gate-panel panel-card"><header><div><small>SMT-16</small><h2>最終驗收 Gate／APK 封裝前</h2></div><span>10 個 Gate</span></header><div class="gate-grid">${[['Gate 1','Design System','已通過','success'],['Gate 2','Shared Contract','已通過','success'],['Gate 3','本機交易完整','已通過','success'],['Gate 4','新單接收','阻塞','danger'],['Gate 5','堂食','已通過','success'],['Gate 6','五部打印機 PoC','非阻塞警告','warning'],['Gate 7','離線營運','已通過','success'],['Gate 8','備份恢復','已通過','success'],['Gate 9','APK 外殼／Kiosk','非阻塞警告','warning'],['Gate 10','SMM／Admin 權限邊界','阻塞','danger']].map(([gate,title,status,tone])=>`<article><small>${gate}</small><strong>${title}</strong><span class="status-${tone}">${status}</span></article>`).join('')}</div><footer><button class="primary-button" disabled>準備封裝 APK</button><span>仍有 2 項阻塞需要處理</span></footer></section>
    </div>
  </section>`;
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
    return `<fieldset class="option-section"><legend><span>${esc(group.label)} <em>必選</em></span><b>${selected ? '已選擇' : '請選擇'}</b></legend><div class="option-grid">${group.values.map(value => `<button type="button" class="option-button ${selected === value.id ? 'is-selected' : ''}" data-action="option-select" data-line-id="${esc(line.lineId)}" data-group-id="${esc(groupId)}" data-value-id="${esc(value.id)}">${selected === value.id ? icon('check') : ''}<span><strong>${esc(value.label)}</strong><small>${esc(value.detail)}</small></span></button>`).join('')}</div></fieldset>`;
  }).join('');
  const missing = getRequiredState([line]).missingCount;
  return `<div class="overlay-layer"><aside class="drawer product-drawer" role="dialog" aria-modal="true">
    <header class="drawer-header"><div class="drawer-product-title">${imageMarkup(product)}<span><small>${product.code}</small><h2>${esc(product.name)}</h2><strong>${money(product.price)}</strong></span></div><button class="close-button" data-action="overlay-close">×</button></header>
    <div class="drawer-progress"><span>完成度 ${missing ? '2 / 3' : '3 / 3'}</span><i><b style="width:${missing ? '66%' : '100%'}"></b></i><em>${missing ? `尚有 ${missing} 項必選未完成` : '必選內容已完成'}</em></div>
    <div class="drawer-body"><section class="rule-explain"><div><span class="rule-icon required">必</span><strong>必選（Required）</strong><small>需完成指定必選項目，才能結帳。</small></div><div><span class="rule-icon pool">池</span><strong>共享池（Pool）</strong><small>從共用池中選擇指定數量。</small></div><div><span class="rule-icon link">加</span><strong>關聯加配（Link Up）</strong><small>依主餐顯示有效加配。</small></div></section>${required || '<p class="plain-message">此商品沒有必選內容，可以直接加入。</p>'}<fieldset class="option-section"><legend><span>加配小食 <em>可選</em></span><b>按需要選擇</b></legend><div class="option-grid"><button class="option-button"><span><strong>溏心蛋</strong><small>+$15</small></span></button><button class="option-button"><span><strong>黃金泡菜</strong><small>+$30</small></span></button><button class="option-button"><span><strong>韓式泡菜</strong><small>+$30</small></span></button></div></fieldset></div>
    <footer class="drawer-footer"><button class="secondary-button" data-action="overlay-close">取消</button><button class="primary-button" data-action="product-rule-save" ${missing ? 'disabled' : ''}>確認加入</button></footer>
  </aside></div>`;
}

function checkoutChoice(label, field, value, selected, ico='check') {
  return `<button class="choice-button ${selected ? 'is-selected' : ''}" data-action="checkout-field-select" data-field="${field}" data-value="${value}">${icon(ico)}<span><strong>${label}</strong>${selected ? '<small>已選擇</small>' : ''}</span></button>`;
}

function checkoutDrawer(state) {
  if (state.overlay?.type !== 'checkout') return '';
  const summary = getCartSummary(state.cart);
  const paymentOptions = [['cash','現金','cash'],['fps','FPS','cash'],['payme','PayMe','cash'],['alipay','AlipayHK','device'],['wechat','WeChat Pay','message'],['later','稍後付款','clock']];
  return `<div class="overlay-layer checkout-overlay"><section class="checkout-modal" role="dialog" aria-modal="true">
    <header><button class="close-button" data-action="overlay-close">×</button><div><h2>結帳</h2><small>Checkout</small></div><span class="save-state">${icon('check')} 草稿已儲存 14:28</span></header>
    <div class="checkout-columns">
      <section class="checkout-order-list"><h3>商品清單</h3><div>${state.cart.map(item => `<article><span><strong>${esc(item.name)}</strong><small>${readableOptionText(item.options) || '標準選項'}</small></span><b>x${item.qty}</b><em>${money(item.unitPrice)}</em><strong>${money(item.unitPrice*item.qty)}</strong></article>`).join('')}</div><dl><div><dt>包裝費</dt><dd>$1</dd></div><div><dt>優惠總額</dt><dd class="discount">-$15</dd></div><div><dt>商品金額小計</dt><dd>${money(summary.subtotal)}</dd></div><div class="grand"><dt>應付金額</dt><dd>${money(Math.max(0, summary.subtotal-14))}</dd></div></dl><button class="coupon-button">％ 開啟優惠面板</button></section>
      <section class="checkout-form">
        <div class="checkout-block"><h3>來源 <small>分開記錄</small></h3><div class="choice-grid">${checkoutChoice('現場外賣','source','walk-in',state.checkout.source==='walk-in','order')}${checkoutChoice('WhatsApp','source','whatsapp',state.checkout.source==='whatsapp','message')}${checkoutChoice('電話單','source','phone',state.checkout.source==='phone','phone')}</div></div>
        <div class="checkout-block"><h3>訂單模式 <small>分開記錄</small></h3><div class="choice-grid">${checkoutChoice('外賣自取','mode','takeaway',state.checkout.mode==='takeaway','package')}${checkoutChoice('堂食','mode','dine-in',state.checkout.mode==='dine-in','dine')}</div></div>
        <div class="checkout-block"><h3>付款方式 <small>分開記錄</small></h3><div class="payment-grid">${paymentOptions.map(([id,label,ico])=>`<button class="payment-card ${state.checkout.paymentMethod===id?'is-selected':''}" data-action="payment-select" data-payment="${id}">${icon(ico)}<strong>${label}</strong>${state.checkout.paymentMethod===id?'<span>✓</span>':''}</button>`).join('')}</div></div>
        <div class="checkout-block checkout-payment"><h3>收款／核實</h3><div class="payment-box"><p><span>應收金額</span><strong>${money(Math.max(0, summary.subtotal-14))}</strong></p><p><span>收款金額</span><input value="${summary.subtotal || ''}" placeholder="輸入收款金額"></p><p><span>找贖</span><strong>$2</strong></p></div><div class="processing-box"><label><input type="radio" checked> <span><strong>確認付款並接單</strong><small>已確認付款，正式接單</small></span></label><label><input type="radio"> <span><strong>先製作</strong><small>先製作，稍後付款</small></span></label><label><input type="radio"> <span><strong>付款有問題</strong><small>付款需跟進</small></span></label></div></div>
        <details class="optional-details"><summary>備註（可填可不填）</summary><textarea data-field="note" placeholder="可填可不填">${esc(state.checkout.note)}</textarea></details>
      </section>
    </div>
    <footer><button class="secondary-button" data-action="overlay-close">返回修改</button><button class="primary-button checkout-confirm" data-action="order-confirm" ${state.checkout.saving ? 'disabled' : ''}>${state.checkout.saving ? '正在安全保存…' : `正式確認　${money(Math.max(0, summary.subtotal-14))}`}</button></footer>
  </section></div>`;
}

function incomingModal(state) {
  if (!state.incomingBatch.visible) return '';
  return `<div class="modal-layer"><section class="incoming-modal"><button class="close-button" data-action="incoming-later">×</button><span class="modal-kicker">新訂單</span><h2>有新訂單！</h2><div class="incoming-main"><article><small>來源</small><strong>App（iOS）</strong></article><article><small>取餐號</small><strong>A512</strong></article><article><small>核對碼</small><strong>8732</strong></article><article><small>件數</small><strong>3 件</strong></article><article><small>金額</small><strong>$560</strong></article><article><small>取餐時間</small><strong>12:40</strong></article></div><div class="incoming-note"><b>重要備註</b><span>牛肉過敏，去蔥</span></div><div class="incoming-actions"><button class="primary-button" data-action="incoming-review">查看及處理</button><button class="secondary-button" data-action="incoming-later">稍後處理</button></div><p>稍後處理只關閉彈窗，不會建立訂單、列印或啟動 30 分鐘倒數。</p></section></div>`;
}

function toast(state) {
  if (!state.toast) return '';
  return `<div class="toast"><span>${esc(state.toast.message)}</span>${state.undo ? '<button data-action="undo">復原</button>' : ''}</div>`;
}

export function renderApp(state, {products, categories}) {
  const page = state.page === 'order' ? orderPage(state, products, categories)
    : state.page === 'orders' ? ordersPage(state)
    : state.page === 'dine' ? dinePage()
    : state.page === 'sold' ? soldPage()
    : morePage();
  return `<div class="app-shell ${state.quickMode ? 'is-quick' : ''}">${topBar(state)}<main id="workspace" class="workspace">${page}</main>${bottomNav(state)}${productRuleDrawer(state, products)}${checkoutDrawer(state)}${incomingModal(state)}${toast(state)}</div>`;
}
