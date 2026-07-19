(() => {
  const data = window.MoreFunSMTData;
  const api = window.MoreFunSMTApi;
  const state = {
    category: "人氣", search: "", items: [], quickOrder: true, taskIndex: 0,
    source: "現場", payment: "現金", drafts: [], soldOut: new Set(),
  };

  const app = document.getElementById("app");
  const money = n => `$${Number(n).toFixed(0)}`;
  const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const findProduct = id => data.products.find(p => p.id === id);
  const total = () => state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = () => state.items.reduce((s, i) => s + i.qty, 0);
  const unresolved = () => state.items.flatMap(item => item.required.filter(r => !item.resolved[r]).map(r => ({item, type:r})));
  const quickDrinkCount = id => state.items.filter(i => i.productId === id).reduce((s,i) => s+i.qty,0);

  function addProduct(id, openSettings=false){
    const p = findProduct(id); if(!p || state.soldOut.has(id)) return toast("此商品已售罄");
    const existing = state.items.find(i => i.productId===id && i.required.length===0);
    if(existing && !openSettings){ existing.qty++; }
    else state.items.push({id:uid(),productId:p.id,name:p.name,code:p.code,price:p.price,qty:1,kind:p.kind,required:[...p.required],resolved:{},notes:[],save:p.save||0});
    render(); toast(`${p.name} 已加入`);
    if(openSettings){ openItemSheet(state.items[state.items.length-1].id); }
  }
  function changeQty(id, delta){
    const i=state.items.find(x=>x.id===id); if(!i)return;i.qty+=delta;if(i.qty<=0)state.items=state.items.filter(x=>x.id!==id);render();
  }
  function resolveTask(itemId,type,value){
    const i=state.items.find(x=>x.id===itemId); if(!i)return;i.resolved[type]=value;state.taskIndex=Math.min(state.taskIndex,Math.max(0,unresolved().length-1));render();
  }
  function taskOptions(type){
    if(type==="drink") return ["台式奶茶","手打檸檬茶 +$2","玄米冷泡茶","無需飲品 −$1"];
    if(type==="riceball") return ["F1","F2 +$2","F4 +$4","F5 +$6"];
    if(type==="snack") return ["香脆薯角","香烤雞件 +$4","不要小食"];
    return ["預設"];
  }
  function taskLabel(type){return {drink:"飲品待補",riceball:"飯團待補",snack:"小食待補"}[type]||"待補"}
  function filteredProducts(){
    return data.products.filter(p=>(state.category==="人氣"?p.category==="人氣":p.category===state.category) && (!state.search || `${p.name}${p.code}${p.description}`.toLowerCase().includes(state.search.toLowerCase())));
  }
  function render(){
    const tasks=unresolved(); if(state.taskIndex>=tasks.length)state.taskIndex=Math.max(0,tasks.length-1);
    const currentTask=tasks[state.taskIndex]; const needOrganize=tasks.length>0;
    app.innerHTML=`<main class="app">
      <header class="topbar">
        <div class="brand">磨飯 <small>SMT 快速點單</small></div>
        <div class="status"><span class="ok">● 本機正常</span><span>快速點單：${state.quickOrder?"開":"關"}</span><span>打印代理：正常</span><span>電話待核數：2</span></div>
        <div class="top-actions"><button class="ghost-btn" data-action="toggle-quick">快速點單 ${state.quickOrder?"開":"關"}</button><button class="icon-btn" data-action="phone-check">待核數 2</button></div>
      </header>
      <section class="workspace">
        <aside class="order-panel">
          <div class="order-head"><h2>目前訂單</h2><span class="count">${itemCount()} 件</span></div>
          <div class="cart">${state.items.length?state.items.map(cartRow).join(""):`<div class="empty"><div><strong>未有餐點</strong>從右邊選餐，產品會直接加入。<br>空車時只可取單。</div></div>`}</div>
          <div class="task-zone ${currentTask?"":"hidden"}">${currentTask?taskPanel(currentTask,tasks.length):""}</div>
          <div class="summary">
            <div class="summary-line"><span>餐點</span><strong>${itemCount()} 件</strong></div>
            <div class="summary-line"><span>套餐節省</span><strong>${money(state.items.reduce((s,i)=>s+i.save*i.qty,0))}</strong></div>
            <div class="summary-line total"><span>應付</span><span>${money(total())}</span></div>
            ${needOrganize?`<div class="summary-alert">尚有 ${tasks.length} 項 Required。未完成前禁止打印、收款及完成。</div>`:""}
            <div class="order-actions"><button class="ghost-btn" data-action="draft">${state.items.length?"掛單":"取單"}</button><button class="primary-btn" data-action="checkout">${needOrganize?"先整理":`結帳 ${money(total())}`}</button></div>
          </div>
        </aside>
        <section class="catalog-panel">
          <div class="catalog-toolbar"><div class="categories">${data.categories.map(c=>`<button class="category ${c===state.category?"active":""}" data-category="${c}">${c}</button>`).join("")}</div><input class="search" id="search" value="${state.search}" placeholder="搜尋產品／編號" /></div>
          <div class="products">${filteredProducts().map(productCard).join("")||`<div class="empty"><div><strong>找不到產品</strong>請改用其他關鍵字。</div></div>`}</div>
          <div class="quick-drinks">${data.quickDrinks.map(id=>quickDrink(findProduct(id))).join("")}</div>
        </section>
      </section>
      <nav class="bottom-nav">${["點單","訂單","堂食","售罄","更多"].map((n,i)=>`<button class="nav-btn ${i===0?"active":""}" data-nav="${n}">${n}</button>`).join("")}</nav>
      <div class="toast" id="toast"></div>
    </main>`;
    bind();
  }
  function cartRow(i){
    const remain=i.required.filter(r=>!i.resolved[r]);
    const summary=Object.values(i.resolved).join("、") || (remain.length?`${remain.length} 項待補`:"按預設加入");
    return `<div class="cart-row ${remain.length?"required":""}"><div class="cart-row-top"><div><div class="cart-name">${i.name}</div><div class="cart-code">${i.code} · ${summary}</div></div><div class="row-controls"><button class="qty-btn" data-minus="${i.id}">−</button><strong>${i.qty}</strong><button class="qty-btn" data-plus="${i.id}">＋</button><button class="edit-btn" data-edit="${i.id}">⋯</button></div></div><div class="cart-meta"><span class="${remain.length?"required-tag":""}">${remain.length?"Required":"已就緒"}</span><strong>${money(i.price*i.qty)}</strong></div></div>`
  }
  function taskPanel(t,totalTasks){
    const {item,type}=t;return `<div class="task-head"><strong>${item.name}</strong><span class="task-chip">${state.taskIndex+1} / ${totalTasks} · ${taskLabel(type)}</span></div><div class="task-options">${taskOptions(type).map(o=>`<button class="task-option" data-resolve-item="${item.id}" data-resolve-type="${type}" data-value="${o}">${o}</button>`).join("")}</div>`
  }
  function productCard(p){
    const sold=state.soldOut.has(p.id);return `<button class="product ${sold?"soldout":""}" data-product="${p.id}"><span class="product-code">${p.code}</span><button class="more-dot" data-product-more="${p.id}" aria-label="先設定後加入">⋯</button><div class="product-name">${p.name}</div><div class="product-desc">${sold?"售罄｜保留原位":p.description}</div><div class="product-bottom"><span class="price">${money(p.price)}</span>${p.save?`<span class="save">套餐慳 ${money(p.save)}</span>`:""}</div></button>`
  }
  function quickDrink(p){const n=quickDrinkCount(p.id);return `<button class="quick-drink" data-quick-drink="${p.id}">${p.name}<small>${money(p.price)}</small>${n?`<span class="badge">${n}</span>`:""}</button>`}
  function bind(){
    app.querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>{state.category=b.dataset.category;render()});
    app.querySelector("#search").oninput=e=>{state.search=e.target.value;render()};
    app.querySelectorAll("[data-product]").forEach(b=>b.onclick=e=>{if(e.target.closest("[data-product-more]"))return;addProduct(b.dataset.product)});
    app.querySelectorAll("[data-product-more]").forEach(b=>b.onclick=e=>{e.stopPropagation();addProduct(b.dataset.productMore,true)});
    app.querySelectorAll("[data-quick-drink]").forEach(b=>b.onclick=()=>addProduct(b.dataset.quickDrink));
    app.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.minus,-1));app.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.plus,1));
    app.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openItemSheet(b.dataset.edit));
    app.querySelectorAll("[data-resolve-item]").forEach(b=>b.onclick=()=>resolveTask(b.dataset.resolveItem,b.dataset.resolveType,b.dataset.value));
    app.querySelector("[data-action='toggle-quick']").onclick=()=>{state.quickOrder=!state.quickOrder;render()};
    app.querySelector("[data-action='draft']").onclick=()=>state.items.length?saveDraft():openDrafts();
    app.querySelector("[data-action='checkout']").onclick=()=>checkout();
    app.querySelector("[data-action='phone-check']").onclick=()=>toast("電話待核數浮層：正式串接時讀取未核實訂單");
    app.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>b.dataset.nav==="點單"?null:toast(`${b.dataset.nav} 頁保留為現有 SMT 模組入口`));
  }
  async function saveDraft(){const res=await api.createDraft({items:state.items});state.drafts.push({id:res.draftId,items:structuredClone(state.items),time:new Date().toLocaleTimeString("zh-HK",{hour:"2-digit",minute:"2-digit"})});state.items=[];render();toast(`${res.draftId} 已掛單`)}
  function openDrafts(){if(!state.drafts.length)return toast("沒有未完成草稿");const d=state.drafts.pop();state.items=d.items;render();toast(`${d.id} 已恢復，已套用最新規則`)}
  async function checkout(){const tasks=unresolved();if(tasks.length){state.taskIndex=0;render();return toast("請先完成 Required")};if(!state.items.length)return toast("請先加入餐點");const repriced=await api.reprice({items:state.items});openCheckout(repriced.total)}
  function openCheckout(amount){
    const wrap=document.createElement("div");wrap.className="sheet-backdrop";wrap.innerHTML=`<section class="sheet"><h3>渠道與付款</h3><div class="sheet-grid">${["現場","電話／WhatsApp","磨飯App","Keeta","Foodpanda"].map(x=>`<button class="sheet-option ${state.source===x?"selected":""}" data-source="${x}">${x}</button>`).join("")}</div><h3 style="margin-top:16px">付款方式</h3><div class="sheet-grid">${["現金","Alipay","WeChat Pay","轉數快","PayMe","組合付款"].map(x=>`<button class="sheet-option" data-payment="${x}">${x}</button>`).join("")}</div><div class="summary-line total" style="margin-top:16px"><span>應付</span><span>${money(amount)}</span></div><div class="sheet-actions"><button class="ghost-btn" data-close>返回訂單</button><button class="primary-btn" data-submit>完成收款</button></div></section>`;document.body.appendChild(wrap);
    wrap.querySelectorAll("[data-source]").forEach(b=>b.onclick=()=>{state.source=b.dataset.source;openCheckoutReplace(wrap,amount)});wrap.querySelectorAll("[data-payment]").forEach(b=>b.onclick=()=>{state.payment=b.dataset.payment;wrap.querySelectorAll("[data-payment]").forEach(x=>x.classList.toggle("selected",x===b))});wrap.querySelector("[data-close]").onclick=()=>wrap.remove();wrap.querySelector("[data-submit]").onclick=async()=>{const res=await api.submitOrder({items:state.items,source:state.source,payment:state.payment,total:amount});wrap.remove();state.items=[];render();toast(`${res.orderNo} 已成立，已建立打印工作`)};wrap.onclick=e=>{if(e.target===wrap)wrap.remove()}
  }
  function openCheckoutReplace(wrap,amount){wrap.remove();openCheckout(amount)}
  function openItemSheet(itemId){const i=state.items.find(x=>x.id===itemId);if(!i)return;const wrap=document.createElement("div");wrap.className="sheet-backdrop";wrap.innerHTML=`<section class="sheet"><h3>${i.name}</h3><div class="sheet-grid"><button class="sheet-option" data-note="少飯">少飯</button><button class="sheet-option" data-note="半飯">半飯</button><button class="sheet-option" data-note="走蛋">走蛋</button><button class="sheet-option" data-note="雙倍醬 +$2">雙倍醬 +$2</button></div><div class="sheet-actions"><button class="danger-btn" data-delete>刪除</button><button class="primary-btn" data-close>保存</button></div></section>`;document.body.appendChild(wrap);wrap.querySelectorAll("[data-note]").forEach(b=>b.onclick=()=>{i.notes.push(b.dataset.note);b.classList.add("selected")});wrap.querySelector("[data-delete]").onclick=()=>{state.items=state.items.filter(x=>x.id!==itemId);wrap.remove();render()};wrap.querySelector("[data-close]").onclick=()=>{wrap.remove();render();toast("修改已保存並重新計價")};wrap.onclick=e=>{if(e.target===wrap)wrap.remove()}}
  function toast(msg){let t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800)}
  render();
})();
