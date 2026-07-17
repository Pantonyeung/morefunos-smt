const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>`$${Number(n).toFixed(0)}`;
const uid=()=>Math.random().toString(36).slice(2,10);

const products=[
 {id:'f1',code:'F1',name:'原味飯團',price:20,cat:'飯團',img:'assets/products/f1.webp'},
 {id:'f2',code:'F2',name:'紫菜吞拿魚',price:23,cat:'飯團',img:'assets/products/f2.webp'},
 {id:'f3',code:'F3',name:'泡菜豬肉',price:25,cat:'飯團',img:'assets/products/f3.webp'},
 {id:'f4',code:'F4',name:'蜜糖雞絲＋鹽酥雞',price:28,cat:'人氣推薦',img:'assets/products/f4.webp',hot:true,opts:'多青瓜｜多醬｜少肉鬆｜少冰'},
 {id:'f5',code:'F5',name:'煙肉蛋飯團',price:24,cat:'飯團',img:'assets/products/f5.webp'},
 {id:'f6',code:'F6',name:'芝士肉鬆',price:22,cat:'飯團',img:'assets/products/f6.webp'},
 {id:'s1',code:'S1',name:'香脆雞翼（2件）',price:18,cat:'小食',img:'assets/products/s1.webp'},
 {id:'s2',code:'S2',name:'炸薯條',price:16,cat:'薯角餐',img:'assets/products/s2.webp'},
 {id:'d1',code:'D1',name:'爆檸檬茶',price:16,cat:'飲品',img:'assets/products/d1.webp',opts:'少冰'},
 {id:'d2',code:'D2',name:'凍奶茶',price:15,cat:'飲品',img:'assets/products/d2.webp'},
 {id:'d3',code:'D3',name:'凍檸水',price:12,cat:'飲品',img:'assets/products/d3.webp'},
 {id:'d4',code:'D4',name:'可樂',price:10,cat:'飲品',img:'assets/products/d4.webp'},
 {id:'b1',code:'B1',name:'香煎午餐肉飯盒',price:42,cat:'便當',img:'assets/products/b1.webp'},
 {id:'b2',code:'B2',name:'泡菜豬肉飯盒',price:48,cat:'便當',img:'assets/products/b2.webp'},
 {id:'b3',code:'B3',name:'照燒雞扒飯盒',price:48,cat:'便當',img:'assets/products/b3.webp'},
 {id:'b4',code:'B4',name:'香草雞排飯盒',price:46,cat:'便當',img:'assets/products/b4.webp'},
];
const categories=['全部','人氣推薦','飯團','飯團餐','便當','紫米沙律','薯角餐','小食','飲品','湯品','甜品','醬料','周邊'];
const themeDefs={
 theme01:{name:'暖橙',p:'#ff7a00',p2:'#ffb453',bg:'#fff9f1',ink:'#2c170d',surface:'#ffffff',line:'#ead9c7'},
 theme02:{name:'紫米',p:'#7b4b83',p2:'#b78fbd',bg:'#fbf7fc',ink:'#261529',surface:'#ffffff',line:'#e4d6e7'},
 theme03:{name:'抹茶',p:'#4f795b',p2:'#9ab49a',bg:'#f6faf4',ink:'#142419',surface:'#ffffff',line:'#d6e2d4'},
 theme04:{name:'海鹽',p:'#366b82',p2:'#8fb7c8',bg:'#f5fafc',ink:'#11242d',surface:'#ffffff',line:'#d2e2e9'},
 theme05:{name:'莓果',p:'#9d4051',p2:'#d68b96',bg:'#fff7f8',ink:'#301117',surface:'#ffffff',line:'#ead4d8'},
 theme06:{name:'焦糖',p:'#8a562f',p2:'#c99669',bg:'#fff8f1',ink:'#2b190e',surface:'#ffffff',line:'#ead9ca'}
};
const state={
 page:'order', category:'全部', query:'', quickMode:false, themeMode:'auto', themeId:'theme01', online:true,
 cart:[
  {line:'l1',productId:'f4',qty:1,opts:'多青瓜｜多醬｜少肉鬆｜少冰'},
  {line:'l2',productId:'s1',qty:1,opts:''},
  {line:'l3',productId:'d1',qty:1,opts:'少冰'}
 ],
 newOrders:[
  {id:'N-1042',source:'App',pickup:'A067',check:'4821',amount:86,items:'F4飯團餐 ×1、凍奶茶 ×1',payment:'FPS待核實',time:'12:45',status:'pending'},
  {id:'N-1043',source:'Web',pickup:'A068',check:'7016',amount:62,items:'B1便當 ×1、D1爆檸檬茶 ×1',payment:'到店付款',time:'12:49',status:'pending'}
 ],
 orders:[
  {id:'P0053',source:'現場',amount:58,created:Date.now()-11*60000,payment:'現金已收',print:'正常',items:'B2泡菜豬肉飯盒、D4可樂'},
  {id:'P0054',source:'WhatsApp',amount:84,created:Date.now()-19*60000,payment:'付款待核實',print:'正常',items:'F4 ×2、D1 ×1'},
  {id:'P0055',source:'App',amount:62,created:Date.now()-27*60000,payment:'FPS已核實',print:'標籤待重試',items:'F4、S1、D1'}
 ],
 soldOut:new Set(['f2']), paused:new Set(['b3']),
 tables:Array.from({length:18},(_,i)=>({id:`${i+1}`,status:i<5?'occupied':'free',mins:i===0?37:i===1?24:i===2?12:i===3?42:i===4?8:0,amount:i<5?[126,88,54,143,62][i]:0})),
 drawer:null, modal:null, toast:'', statusOpen:false
};

function load(){
 try{const s=JSON.parse(localStorage.getItem('morefun-smt-state')||'{}');Object.assign(state,s);state.soldOut=new Set(s.soldOut||['f2']);state.paused=new Set(s.paused||['b3']);}catch{}
 const day=Math.floor(Date.now()/86400000)%6+1;
 if(state.themeMode==='auto') state.themeId=`theme0${day}`;
}
function save(){
 localStorage.setItem('morefun-smt-state',JSON.stringify({...state,soldOut:[...state.soldOut],paused:[...state.paused],drawer:null,modal:null,toast:'',statusOpen:false}));
}
function applyTheme(){const t=themeDefs[state.themeId]||themeDefs.theme01;Object.entries(t).forEach(([k,v])=>document.documentElement.style.setProperty(`--${k}`,v));document.body.classList.toggle('quick',state.quickMode)}
const icon=(name)=>({order:'▣',orders:'▤',dine:'♨',sold:'⊠',more:'•••',bell:'♧',wifi:'⌁',clock:'◷',calendar:'▦',status:'◉'}[name]||'•');

function cartTotal(){return state.cart.reduce((sum,l)=>sum+products.find(p=>p.id===l.productId).price*l.qty,0)}
function currentNo(){return 'P0056'}
function pendingCount(){return state.newOrders.filter(o=>o.status==='pending').length}
function paymentPending(){return state.orders.filter(o=>o.payment.includes('待核')).length+state.newOrders.filter(o=>o.payment.includes('待核')).length}
function topbar(){
 return `<header class="topbar">
  <button class="brand" data-action="home"><span class="brandmark">◓</span><span>磨飯 SMT</span></button>
  <button class="status-pill success" data-action="toggle-online"><span>●</span><b>營業中</b></button>
  <button class="status-block" data-action="status"><span class="status-icon">${icon('wifi')}</span><span><b>${state.online?'系統在線':'離線可工作'}</b><small>${state.online?'同步正常':'雲端稍後同步'}</small></span></button>
  <div class="status-block"><span><small>當前流水</small><b class="flow">${currentNo()}</b></span></div>
  <button class="status-block bell" data-action="new-orders"><span class="status-icon">${icon('bell')}</span><span><b>${pendingCount()}</b><small>新單</small></span>${pendingCount()?`<em>${pendingCount()}</em>`:''}</button>
  <div class="status-block"><span class="status-icon">${icon('calendar')}</span><span><b>${new Date().toLocaleDateString('zh-HK',{month:'2-digit',day:'2-digit'})}</b><small>營業日</small></span></div>
  <div class="status-block time"><span class="status-icon">${icon('clock')}</span><b id="clock">--:--:--</b></div>
  <button class="compact-control" data-action="quick">快速 ${state.quickMode?'開':'關'}</button>
  <button class="compact-control" data-action="theme">${themeDefs[state.themeId].name}</button>
 </header>`;
}
function nav(){const items=[['order','點單'],['orders','訂單'],['dine','堂食'],['sold','售罄'],['more','更多']];return `<nav class="bottom-nav">${items.map(([id,label])=>`<button class="nav-item ${state.page===id?'active':''}" data-page="${id}"><span>${icon(id)}</span><b>${label}</b>${id==='orders'&&pendingCount()?`<em>${pendingCount()}</em>`:''}${id==='dine'&&state.tables.some(t=>t.mins>=35)?`<em>${state.tables.filter(t=>t.mins>=35).length}</em>`:''}</button>`).join('')}</nav>`}
function shell(content){return `<div class="app-shell">${topbar()}<main class="workspace">${content}</main>${nav()}${overlays()}</div>`}

function orderPage(){
 const visible=products.filter(p=>(state.category==='全部'||p.cat===state.category)&&(p.name.includes(state.query)||p.code.toLowerCase().includes(state.query.toLowerCase())));
 return `<section class="order-layout">
  <aside class="cart-panel">
   <div class="cart-head"><button class="mode-btn">▢ 外賣⌄</button><button class="danger-link" data-action="clear-cart">清空購物車</button></div>
   <div class="cart-lines">${state.cart.length?state.cart.map(cartLine).join(''):`<div class="empty-state"><b>未有餐點</b><span>由右邊選擇商品</span></div>`}</div>
   <div class="cart-summary">
    <div><span>商品數量</span><b>${state.cart.reduce((s,l)=>s+l.qty,0)}</b></div>
    <div><span>小計</span><b>${money(cartTotal())}</b></div>
    <div class="total"><span>總計</span><b>${money(cartTotal())}</b></div>
    <div class="cart-actions"><button class="secondary" data-action="draft">${state.cart.length?'暫存':'取單'}</button><button class="primary" data-action="checkout" ${state.cart.length?'':'disabled'}>結帳 ${money(cartTotal())}</button></div>
   </div>
  </aside>
  <section class="catalog-panel">
   <div class="category-grid">${categories.map(c=>`<button class="category ${state.category===c?'active':''}" data-category="${c}">${c}</button>`).join('')}<button class="category search-btn" data-action="search">⌕ 搜尋</button></div>
   ${state.query?`<div class="search-row"><input id="searchInput" value="${state.query}" placeholder="搜尋商品、編號或關鍵字"><button data-action="clear-search">清除</button></div>`:''}
   <div class="product-grid">${visible.map(productCard).join('')||`<div class="empty-state wide"><b>搵唔到相關商品</b><span>試其他名稱或返回分類</span></div>`}</div>
   <div class="quick-drinks">${products.filter(p=>p.cat==='飲品').map(p=>`<button data-product="${p.id}">${p.name}<em>${state.cart.filter(l=>l.productId===p.id).reduce((s,l)=>s+l.qty,0)||''}</em></button>`).join('')}</div>
  </section>
 </section>`;
}
function cartLine(l){const p=products.find(x=>x.id===l.productId);return `<article class="cart-line" data-line="${l.line}">
 <div class="qty-badge">${l.qty}</div><div class="line-main"><b>${p.code} ${p.name}</b>${l.opts?`<small>${l.opts}</small>`:''}</div><b>${money(p.price*l.qty)}</b><button class="icon-btn" data-action="remove-line" data-line="${l.line}">×</button>
 <div class="stepper"><button data-action="dec" data-line="${l.line}">−</button><span>${l.qty}</span><button data-action="inc" data-line="${l.line}">＋</button></div>
 </article>`}
function productCard(p){const sold=state.soldOut.has(p.id),paused=state.paused.has(p.id),count=state.cart.filter(l=>l.productId===p.id).reduce((s,l)=>s+l.qty,0);return `<article class="product-card ${sold||paused?'disabled':''}" data-product="${p.id}">
 <div class="product-copy"><b class="code">${p.code}</b><strong>${p.name}</strong><span>${money(p.price)}</span></div><img src="${p.img}" alt="${p.name}">${p.hot?'<i class="hot">熱賣</i>':''}${count?`<em class="count">${count}</em>`:''}${sold?'<div class="state-mask">今日售罄</div>':paused?'<div class="state-mask">暫停供應</div>':''}<button class="more-dot" data-action="product-options" data-product="${p.id}">⋯</button>
 </article>`}

function ordersPage(){return `<section class="page-column"><div class="page-heading"><div><h1>訂單</h1><p>正式訂單由接受時間起計30分鐘，自動完成後移入歷史。</p></div><div class="segmented"><button class="active">進行中</button><button>歷史</button></div></div>
 <div class="order-stats"><div><span>待處理新單</span><b>${pendingCount()}</b></div><div><span>付款待核實</span><b>${paymentPending()}</b></div><div><span>打印異常</span><b>${state.orders.filter(o=>o.print!=='正常').length}</b></div><div><span>今日訂單</span><b>56</b></div></div>
 <div class="orders-grid">${state.orders.map(orderCard).join('')}</div></section>`}
function orderCard(o){const elapsed=Math.floor((Date.now()-o.created)/60000),remain=Math.max(0,30-elapsed);return `<article class="order-card"><div class="order-card-head"><div><small>${o.source}</small><h2>${o.id}</h2></div><div class="countdown ${remain<=5?'warn':''}"><small>自動完成</small><b>${remain}分鐘</b></div></div><p>${o.items}</p><div class="order-tags"><span>${o.payment}</span><span class="${o.print==='正常'?'ok':'warn'}">${o.print}</span></div><div class="order-card-foot"><b>${money(o.amount)}</b><button class="secondary" data-action="order-detail" data-order="${o.id}">查看及處理</button></div></article>`}

function dinePage(){return `<section class="page-column"><div class="page-heading"><div><h1>堂食</h1><p>同一枱會話沿用同一Order ID及流水；訂單30分鐘、枱位35分鐘雙軌運行。</p></div><button class="primary" data-action="open-table">＋ 開枱</button></div><div class="table-grid">${state.tables.map(t=>`<button class="table-card ${t.status} ${t.mins>=35?'late':''}" data-table="${t.id}"><span class="table-no">${t.id}</span><b>${t.status==='free'?'空枱':`${t.mins}分鐘`}</b><small>${t.status==='free'?'可立即開枱':money(t.amount)}</small>${t.mins>=35?'<em>35分鐘提示</em>':''}</button>`).join('')}</div></section>`}

function soldPage(){return `<section class="page-column"><div class="page-heading"><div><h1>售罄管理</h1><p>只處理現場供應狀態；Admin停用產品不會在此顯示。</p></div><div class="segmented"><button class="active">全部</button><button>已售罄</button><button>暫停供應</button></div></div><div class="supply-grid">${products.map(p=>`<article class="supply-card"><img src="${p.img}" alt=""><div><b>${p.code} ${p.name}</b><small>${p.cat}</small></div><div class="supply-actions">${state.soldOut.has(p.id)||state.paused.has(p.id)?`<button class="success-btn" data-action="restore" data-product="${p.id}">恢復供應</button>`:`<button data-action="soldout" data-product="${p.id}">今日售罄</button><button data-action="pause" data-product="${p.id}">暫停供應</button>`}</div></article>`).join('')}</div></section>`}

function morePage(){const cards=[['收銀與日結','營業摘要、現金核對、支出、差異與版本化日結','dayclose'],['報表與分析','營運、渠道、商品、付款異常及 CSV 匯出','reports'],['打印與設備','五部打印機、路由、重試、補印及改送','printers'],['備份與恢復','本機快照、USB 匯出、驗證及安全恢復','backup'],['顯示與操作','快速模式、六套主題與全局狀態','display'],['系統與同步','Catalog、Outbox、裝置、更新與 Audit','system']];return `<section class="page-column"><div class="page-heading"><div><h1>更多</h1><p>低頻營運、設備及系統功能。所有正式資料仍以本機為準。</p></div></div><div class="settings-grid">${cards.map(([t,d,a])=>`<button class="settings-card" data-action="settings" data-settings="${a}"><span class="settings-icon">${a==='dayclose'?'$':a==='reports'?'▥':a==='printers'?'▧':a==='backup'?'⇩':a==='display'?'◐':'⚙'}</span><div><b>${t}</b><small>${d}</small></div><span>›</span></button>`).join('')}</div></section>`}

function overlays(){return `${state.drawer?drawer():''}${state.modal?modal():''}${state.detail?detailPanel():''}${state.statusOpen?statusCenter():''}${pendingCount()&&!sessionStorage.getItem('newOrderDismissed')?newOrderPopup():''}${state.toast?`<div class="toast">${state.toast}</div>`:''}`}
function newOrderPopup(){const o=state.newOrders.find(x=>x.status==='pending');return `<div class="overlay"><section class="modal-card new-order"><div class="modal-title"><div><small>新${o.source}訂單</small><h2>${o.pickup}</h2></div><span class="pulse">新單</span></div><div class="new-order-meta"><div><span>核對碼</span><b>${o.check}</b></div><div><span>取餐時間</span><b>${o.time}</b></div><div><span>金額</span><b>${money(o.amount)}</b></div><div><span>付款</span><b>${o.payment}</b></div></div><p>${o.items}</p><div class="modal-actions"><button class="secondary" data-action="later-new">稍後處理</button><button class="primary" data-action="review-new" data-order="${o.id}">查看及處理</button></div></section></div>`}
function drawer(){if(state.drawer.type==='checkout')return `<div class="drawer-wrap"><aside class="drawer"><div class="drawer-head"><h2>結帳</h2><button data-action="close-drawer">×</button></div><div class="checkout-summary"><div><span>訂單來源</span><b>現場外賣</b></div><div><span>商品</span><b>${state.cart.reduce((s,l)=>s+l.qty,0)}件</b></div><div><span>外賣盒費</span><b>$1</b></div><div class="total"><span>應付</span><b>${money(cartTotal()+1)}</b></div></div><label>付款方式</label><div class="payment-grid">${['現金','FPS','PayMe','Alipay','WeChat Pay','稍後付款'].map((x,i)=>`<button class="${i===0?'active':''}">${x}</button>`).join('')}</div><label>備註（可填可不填）</label><textarea placeholder="平台單號、客人稱呼、取餐備註等"></textarea><div class="drawer-actions"><button class="secondary" data-action="close-drawer">返回修改</button><button class="primary" data-action="confirm-order">確認落單 ${money(cartTotal()+1)}</button></div></aside></div>`;
 if(state.drawer.type==='product'){const p=products.find(x=>x.id===state.drawer.productId);return `<div class="drawer-wrap"><aside class="drawer"><div class="drawer-head"><h2>${p.code} ${p.name}</h2><button data-action="close-drawer">×</button></div><img class="drawer-product" src="${p.img}"><h3>快捷設定</h3><div class="option-grid">${['標準','少飯','多飯','走蛋','少醬','多醬'].map((x,i)=>`<button class="${i===0?'active':''}">${x}</button>`).join('')}</div><label>商品備註</label><textarea placeholder="可填可不填"></textarea><div class="drawer-actions"><button class="secondary" data-action="close-drawer">取消</button><button class="primary" data-action="add-product" data-product="${p.id}">加入 ${money(p.price)}</button></div></aside></div>`;
 }
 return ''
}
function modal(){return `<div class="overlay"><section class="modal-card"><div class="modal-title"><h2>${state.modal.title}</h2><button data-action="close-modal">×</button></div><p>${state.modal.body}</p><div class="modal-actions"><button class="primary" data-action="close-modal">完成</button></div></section></div>`}
function detailPanel(){const d=state.detail;const blocks={
 dayclose:['收銀與日結','營業日 05:00–翌日 04:59｜草稿日結不阻止新營業日','淨銷售 $8,246｜現金應有 $1,860｜電子付款待核 $124','現金點算','支出：$80 食材補貨（現金）｜差異門檻：$247（淨銷售 3%）','確認日結會建立新版本並保存差異原值；不改動原訂單。'],
 reports:['報表與分析','即時由 SMT 本機正式資料計算，不等待雲端或 Google Sheet。','營運摘要','現場外賣 $3,120｜WhatsApp $1,840｜App／Web $2,270｜堂食 $1,016','付款與異常：待核實 2｜打印待重試 1｜退款待處理 0','可匯出 CSV／本機分享／USB；平台銷售額不等於實際入帳。'],
 printers:['打印與設備','安全成單後才建立 Print Job；失敗不刪除 Order。','Sunmi T2s：顧客小票｜正常','XP-N160II #1：後廚｜正常｜XP-N160II #2：打包｜正常','T271U #1：飯團 Label｜待重試｜T271U #2：包裝 Label｜正常','補印一律標示「補印｜不要重複製作」；可使用同一 Job 重試或改送。'],
 backup:['備份與恢復','備份只在完整快照驗證後標記成功；恢復不覆蓋未安全保存資料。','最近完整備份：今日 05:00｜本機資料安全','可用：立即建立安全快照、USB 匯出、驗證備份','可恢復：完整資料／Catalog／打印路由／顯示設定','雲端、更新或備份失敗只記狀態與 Outbox，不鎖住 POS。'],
 display:['顯示與操作','快速模式只調整密度與觸控尺寸，不改任何訂單、定價、計時或打印規則。',`目前：${state.quickMode?'快速模式':'一般模式'}｜觸控最小 ${state.quickMode?'56':'48'}px`,'六套品牌主題可每日自動輪換或手動切換','全局狀態含：離線可工作、付款待核、打印失敗、同步積壓、35分鐘提示','重要狀態永遠同時使用文字與圖示，不單靠顏色。'],
 system:['系統與同步','V1.0 只允許一部正式 SMT 主機；外部端只同步、查詢或提交草稿。','Catalog：最後完整有效版本｜供應：本機 override 優先',`Outbox：${state.online?'0 項待同步':'3 項待同步，恢復連線後上傳'}｜更新：上一有效版本可回退`,'Audit：訂單、付款、退款、售罄、打印、日結、備份與裝置事件','裝置、雲端、Token、更新異常均不得重新計價、重複成單或遠端鎖機。']};const x=blocks[d];return `<div class="drawer-wrap"><aside class="drawer detail-drawer"><div class="drawer-head"><h2>${x[0]}</h2><button data-action="close-detail">×</button></div><p class="detail-lead">${x[1]}</p><div class="detail-stack">${x.slice(2).map((v,i)=>`<article><span>${i+1}</span><div>${v}</div></article>`).join('')}</div><div class="drawer-actions"><button class="secondary" data-action="close-detail">返回</button><button class="primary" data-action="detail-action" data-detail="${d}">${d==='backup'?'建立安全快照':d==='printers'?'查看 Print Job':d==='reports'?'準備 CSV 匯出':d==='dayclose'?'儲存日結草稿':'儲存設定'}</button></div></aside></div>`}
function statusCenter(){return `<div class="drawer-wrap"><aside class="drawer status-drawer"><div class="drawer-head"><h2>全局狀態中心</h2><button data-action="status">×</button></div><div class="status-list"><article><span class="ok-dot"></span><div><b>本機資料安全</b><small>最後保存：剛剛</small></div></article><article><span class="warn-dot"></span><div><b>付款待核實 ${paymentPending()}張</b><small>不影響已接受訂單製作</small></div></article><article><span class="warn-dot"></span><div><b>標籤打印待重試 1個</b><small>訂單資料已安全保存</small></div></article><article><span class="${state.online?'ok-dot':'warn-dot'}"></span><div><b>${state.online?'雲端同步正常':'離線可工作'}</b><small>${state.online?'無待同步事件':'恢復網絡後自動同步'}</small></div></article><article><span class="ok-dot"></span><div><b>最近備份正常</b><small>今日 05:00</small></div></article></div></aside></div>`}

function render(){applyTheme();let content=state.page==='order'?orderPage():state.page==='orders'?ordersPage():state.page==='dine'?dinePage():state.page==='sold'?soldPage():morePage();$('#app').innerHTML=shell(content);bind();updateClock();save();}
function toast(msg){state.toast=msg;render();setTimeout(()=>{state.toast='';render()},1500)}
function addProduct(id,opts=''){if(state.soldOut.has(id)||state.paused.has(id))return;const existing=state.cart.find(l=>l.productId===id&&l.opts===opts);if(existing)existing.qty++;else state.cart.push({line:uid(),productId:id,qty:1,opts});toast('已加入購物車')}
function bind(){
 $$('[data-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.page;render()});
 $$('[data-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.category;state.query='';render()});
 $$('[data-product]').forEach(el=>{if(el.dataset.action)return;el.onclick=e=>{if(e.target.closest('[data-action]'))return;addProduct(el.dataset.product)}});
 $$('[data-action]').forEach(b=>b.onclick=e=>handle(b.dataset.action,b));
 const si=$('#searchInput');if(si){si.oninput=()=>{state.query=si.value;render()};si.focus()}
 $$('[data-table]').forEach(b=>b.onclick=()=>{const t=state.tables.find(x=>x.id===b.dataset.table);state.modal={title:`枱 ${t.id}`,body:t.status==='free'?'此枱目前空置，可直接開枱。':`已入座 ${t.mins}分鐘，現時消費 ${money(t.amount)}。`};render()});
}
function handle(a,b){
 if(a==='home'){state.page='order';render()} else if(a==='quick'){state.quickMode=!state.quickMode;render()} else if(a==='theme'){state.themeMode='manual';const keys=Object.keys(themeDefs),i=keys.indexOf(state.themeId);state.themeId=keys[(i+1)%keys.length];render()}
 else if(a==='toggle-online'){state.online=!state.online;render()} else if(a==='status'){state.statusOpen=!state.statusOpen;render()} else if(a==='new-orders'){sessionStorage.removeItem('newOrderDismissed');render()}
 else if(a==='inc'||a==='dec'){const l=state.cart.find(x=>x.line===b.dataset.line);if(a==='inc')l.qty++;else if(l.qty>1)l.qty--;render()} else if(a==='remove-line'){state.cart=state.cart.filter(x=>x.line!==b.dataset.line);render()}
 else if(a==='clear-cart'){state.cart=[];render()} else if(a==='checkout'){state.drawer={type:'checkout'};render()} else if(a==='close-drawer'){state.drawer=null;render()} else if(a==='product-options'){state.drawer={type:'product',productId:b.dataset.product};render()} else if(a==='add-product'){addProduct(b.dataset.product);state.drawer=null;render()}
 else if(a==='search'){state.query=' ';render()} else if(a==='clear-search'){state.query='';render()} else if(a==='draft'){const had=state.cart.length;if(had)state.cart=[];toast(had?'已暫存，購物車已清空':'暫存列表暫時沒有內容')}
 else if(a==='confirm-order'){state.orders.unshift({id:currentNo(),source:'現場',amount:cartTotal()+1,created:Date.now(),payment:'現金已收',print:'正常',items:state.cart.map(l=>products.find(p=>p.id===l.productId).name).join('、')});state.cart=[];state.drawer=null;state.page='orders';toast('訂單已建立並送出打印')}
 else if(a==='later-new'){sessionStorage.setItem('newOrderDismissed','1');render()} else if(a==='review-new'){const o=state.newOrders.find(x=>x.id===b.dataset.order);state.modal={title:`${o.pickup}｜${o.source}新單`,body:`核對碼 ${o.check}｜${o.items}｜${o.payment}。付款待核實時可確認付款、先製作或稍後處理。`};sessionStorage.setItem('newOrderDismissed','1');render()}
 else if(a==='close-modal'){state.modal=null;render()} else if(a==='soldout'){state.soldOut.add(b.dataset.product);state.paused.delete(b.dataset.product);render()} else if(a==='pause'){state.paused.add(b.dataset.product);state.soldOut.delete(b.dataset.product);render()} else if(a==='restore'){state.paused.delete(b.dataset.product);state.soldOut.delete(b.dataset.product);render()}
 else if(a==='open-table'){const t=state.tables.find(x=>x.status==='free');if(t){t.status='occupied';t.mins=0;t.amount=0;toast(`已開枱 ${t.id}`)}}
 else if(a==='order-detail'){const o=state.orders.find(x=>x.id===b.dataset.order);state.modal={title:`訂單 ${o.id}`,body:`${o.items}｜${o.payment}｜${o.print}。可繼續付款核實、退款、補收、補印及查看Timeline。`};render()}
 else if(a==='settings'){state.detail=b.dataset.settings;render()} else if(a==='close-detail'){state.detail=null;render()} else if(a==='detail-action'){toast(b.dataset.detail==='backup'?'安全快照已保存並完成驗證':b.dataset.detail==='printers'?'已開啟 Print Job 中心（示範）':'本機示範資料已安全保存')}
}
function updateClock(){const c=$('#clock');if(c)c.textContent=new Date().toLocaleTimeString('zh-HK',{hour12:false});}
load();render();setInterval(updateClock,1000);setInterval(()=>{if(state.page==='orders')render()},60000);
if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
