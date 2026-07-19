/* More Fun SMT V16 — five-root full-port runtime */
'use strict';

const DATA=window.MoreFunSMTData;
const API=window.MoreFunSMTApi;
const app=document.getElementById('app');
const stage=document.getElementById('smt-stage');
const productMap=new Map(DATA.products.map(item=>[item.id,item]));
const drinkMap=new Map(DATA.drinks.map(item=>[item.id,item]));
const STORAGE='morefun:smt:v16:full-port';
const DRAFT_STORAGE='morefun:smt:v16:drafts';

const clone=value=>{try{return structuredClone(value);}catch{return JSON.parse(JSON.stringify(value));}};
const money=value=>`$${Number(value||0).toFixed(0)}`;
const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const stableId=(prefix='id')=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}};
const writeJSON=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

function initialHealth(){return {api:{ok:false,label:'API',detail:'未連接'},printer:{ok:false,label:'打印機',detail:'未連接'},sync:{ok:false,label:'同步',detail:'等待 API'},backup:{ok:true,label:'備份',detail:'本機資料正常'}};}
function freshState(){return {
  route:'order',category:'全部',cart:[],drafts:readJSON(DRAFT_STORAGE,[]),
  settings:clone(DATA.orderPageConfig),card:null,modal:null,pendingExpanded:false,pendingOrderId:null,
  pendingGroupOpen:{'磨飯 App':true,'電話／WhatsApp':true},quick:true,quickMode:'all',
  operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false},health:initialHealth(),
  checkout:{channel:'現場外賣',payment:'現金付款',received:0},toast:''
};}
const persisted=readJSON(STORAGE,null);
const state=Object.assign(freshState(),persisted||{});
state.settings={...clone(DATA.orderPageConfig),...(state.settings||{}),catalog:{...DATA.orderPageConfig.catalog,...state.settings?.catalog},cart:{...DATA.orderPageConfig.cart,...state.settings?.cart},quickDrinks:{...DATA.orderPageConfig.quickDrinks,...state.settings?.quickDrinks},quickAssist:{...DATA.orderPageConfig.quickAssist,...state.settings?.quickAssist}};
state.cart=normalizeCart(state.cart||[]);

function persist(){writeJSON(STORAGE,{...state,modal:null,card:null,toast:''});writeJSON(DRAFT_STORAGE,state.drafts);}
function viewportSize(){return {width:Math.max(1,window.innerWidth||document.documentElement.clientWidth||screen.width||1),height:Math.max(1,window.innerHeight||document.documentElement.clientHeight||screen.height||1)};}
function orientationIsLandscape(){
  const type=screen.orientation?.type||'';
  if(type.includes('landscape'))return true;
  if(type.includes('portrait'))return false;
  const angle=Math.abs(Number(screen.orientation?.angle??window.orientation??0))%180;
  if(angle===90)return true;
  const {width,height}=viewportSize();
  return width>=height;
}
function fitStage(){
  const landscape=orientationIsLandscape();
  document.body.classList.toggle('is-portrait',!landscape);
  if(!landscape)return;
  const viewport=viewportSize();
  const canvas=DATA.orderPageConfig.canvas;
  const scale=Math.min(viewport.width/canvas.width,viewport.height/canvas.height);
  stage.style.width=`${canvas.width}px`;stage.style.height=`${canvas.height}px`;
  stage.style.transform=`scale(${scale})`;
  stage.style.left=`${Math.max(0,(viewport.width-canvas.width*scale)/2)}px`;
  stage.style.top=`${Math.max(0,(viewport.height-canvas.height*scale)/2)}px`;
}
const scheduleFit=()=>requestAnimationFrame(()=>requestAnimationFrame(fitStage));
addEventListener('resize',scheduleFit,{passive:true});
addEventListener('orientationchange',()=>setTimeout(scheduleFit,220),{passive:true});
screen.orientation?.addEventListener?.('change',scheduleFit);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleFit();});

function productRules(product={}){
  const required=[...(product.requiredGroups||[])];
  const optional=[...(product.optionalGroups||[])];
  const slots=required.includes('drink')?Math.max(1,Number(product.drinkSlotsPerUnit||1)):0;
  return {requiredGroups:[...new Set(required)],optionalGroups:[...new Set(optional)],drinkSlotsPerUnit:slots,combinableGroup:product.combinableGroup||null};
}
function normalizeLine(input,index=0){
  const product=productMap.get(input?.productId)||{};
  const rules=productRules(product);
  const qty=Math.max(1,Number(input?.qty)||1);
  const unitPrice=Number(input?.unitPrice??product.price??0);
  const requiredGroups=Array.isArray(input?.requiredGroups)&&input.requiredGroups.length?[...new Set([...input.requiredGroups,...rules.requiredGroups])]:rules.requiredGroups;
  const drinkSlots=requiredGroups.includes('drink')?Math.max(0,Number(input?.drinkSlots)||rules.drinkSlotsPerUnit*qty):0;
  return {...input,lineId:input?.lineId||stableId('line'),productId:input?.productId||product.id,name:input?.name||product.name||'未命名餐點',detail:input?.detail||product.code||'',image:input?.image||product.image||'',category:input?.category||product.category||'其他',qty,unitPrice,total:unitPrice*qty,requiredGroups,optionalGroups:Array.isArray(input?.optionalGroups)?input.optionalGroups:rules.optionalGroups,combinableGroup:input?.combinableGroup||rules.combinableGroup,linkRole:input?.linkRole||product.linkRole||'',options:{...(input?.options||{})},drinkSlots,drinkAssignments:Array.isArray(input?.drinkAssignments)?clone(input.drinkAssignments):[],linkedComboId:input?.linkedComboId||'',_stableOrder:Number.isFinite(input?._stableOrder)?input._stableOrder:index};
}
function normalizeCart(cart){return (Array.isArray(cart)?cart:[]).map(normalizeLine).sort((a,b)=>a._stableOrder-b._stableOrder);}
function mergeKey(line){return JSON.stringify([line.productId,line.options,line.drinkAssignments.map(d=>[d.drinkId,d.sweetness,d.ice]),line.linkedComboId]);}
function mergeCart(cart){
  const rows=normalizeCart(cart);if(state.settings.cart.mergeMode==='never')return rows;
  const out=[];for(const row of rows){const found=out.find(item=>item.productId===row.productId&&(state.settings.cart.mergeMode==='always'||mergeKey(item)===mergeKey(row)));if(!found){out.push(clone(row));continue;}found.qty+=row.qty;found.total=found.qty*found.unitPrice;found.drinkSlots+=row.drinkSlots;found.drinkAssignments.push(...clone(row.drinkAssignments));}
  return out;
}
function missingGroups(line){
  const missing=[];for(const group of line.requiredGroups||[]){if(group==='drink'){const count=Math.max(0,line.drinkSlots-line.drinkAssignments.length);if(count)missing.push({group,label:'飲品',count});}else if(!line.options[group])missing.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:1});}
  return missing;
}
function pendingSummary(){const out={rice:0,sauce:0,snack:0,drink:0,total:0};state.cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]=(out[item.group]||0)+item.count;out.total+=item.count;}));return out;}
function linkUpSummary(){
  const available=state.cart.filter(line=>!line.linkedComboId);
  const riceballs=available.filter(line=>line.combinableGroup==='single-riceball').reduce((sum,line)=>sum+line.qty,0);
  const snacks=available.filter(line=>line.linkRole==='snack').reduce((sum,line)=>sum+line.qty,0);
  const drinks=available.filter(line=>line.linkRole==='drink').reduce((sum,line)=>sum+line.qty,0);
  return {riceballs,snacks,drinks,count:Math.min(riceballs,snacks,drinks)};
}
function applyLinkUp(count){
  if(!count)return;let riceLeft=count,snackLeft=count,drinkLeft=count;const comboId=stableId('combo');const next=[];
  for(const line of state.cart){if(line.linkedComboId){next.push(line);continue;}let take=0;if(line.combinableGroup==='single-riceball'&&riceLeft){take=Math.min(line.qty,riceLeft);riceLeft-=take;}else if(line.linkRole==='snack'&&snackLeft){take=Math.min(line.qty,snackLeft);snackLeft-=take;}else if(line.linkRole==='drink'&&drinkLeft){take=Math.min(line.qty,drinkLeft);drinkLeft-=take;}if(!take){next.push(line);continue;}next.push({...line,lineId:stableId('line'),qty:take,total:line.unitPrice*take,linkedComboId:comboId});const remain=line.qty-take;if(remain)next.push({...line,lineId:stableId('line'),qty:remain,total:line.unitPrice*remain,linkedComboId:'',_stableOrder:line._stableOrder+.01});}
  state.cart=normalizeCart(next);toast(`已組合 ${count} 份飯團套餐`);render();
}
function lineDescription(line){const parts=[];for(const key of ['rice','sauce','snack','adjustment'])if(line.options[key])parts.push(line.options[key]);const grouped=new Map();for(const drink of line.drinkAssignments){const key=[drink.name,drink.sweetness||'正常甜',drink.ice||'正常冰'].join('|');grouped.set(key,(grouped.get(key)||0)+1);}for(const [key,count] of grouped){const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(v=>v&&!v.startsWith('正常')).join(' · ');parts.push(`${name}${mods?` · ${mods}`:''}${count>1?` ×${count}`:''}`);}if(line.linkedComboId)parts.push('已組合套餐');for(const miss of missingGroups(line))parts.push(`尚欠${miss.label} ${miss.count}`);return parts.join(' · ')||line.detail||'標準';}
function cartCount(){return state.cart.reduce((sum,line)=>sum+line.qty,0);}
function cartTotal(){return state.cart.reduce((sum,line)=>sum+line.total,0);}
function imageBlock(src,alt,cls=''){return `<span class="image-shell ${cls}"><img src="${esc(src)}" alt="${esc(alt)}"><span class="image-fallback">餐點圖片</span></span>`;}
function drinkCard(drink,action='quick-drink'){return `<button class="drink-choice-card ${state.settings.quickDrinks.showImages?'is-image':'is-text'}" data-action="${action}" data-id="${drink.id}">${state.settings.quickDrinks.showImages?imageBlock(drink.image,drink.name,'drink-choice-img'):''}<span>${esc(drink.name)}</span></button>`;}
function productCard(product){
  const template=state.settings.catalog.productOverrides?.[product.id]||state.settings.catalog.defaultTemplate;
  const code=state.settings.catalog.showCode?`<small class="product-code">${esc(product.code)}</small>`:'';
  const description=state.settings.catalog.showDescription&&product.description?`<p class="product-description">${esc(product.description)}</p>`:'';
  if(template==='text')return `<button class="product-card text" data-action="open-product" data-id="${product.id}"><span class="product-copy">${code}<strong>${esc(product.name)}</strong></span><b class="product-price">${money(product.price)}</b></button>`;
  if(template==='small')return `<button class="product-card small" data-action="open-product" data-id="${product.id}">${imageBlock(product.image,product.name,'product-thumb')}<span class="product-copy">${code}<strong>${esc(product.name)}</strong></span><b class="product-price">${money(product.price)}</b></button>`;
  return `<button class="product-card large" data-action="open-product" data-id="${product.id}">${imageBlock(product.image,product.name,'product-hero')}<div class="product-info"><span class="product-copy">${code}<strong>${esc(product.name)}</strong>${description}</span><b class="product-price">${money(product.price)}</b></div></button>`;
}
function cartRows(){if(!state.cart.length)return '<div class="empty-cart"><strong>購物車未有餐點</strong><small>由右側商品卡開始點單</small></div>';return state.cart.map((line,index)=>`<button class="cart-row" data-action="edit-line" data-id="${line.lineId}"><span class="cart-seq">${index+1}</span>${imageBlock(line.image,line.name,'cart-image')}<span class="cart-copy"><h3>${esc(line.name)}</h3><small class="${missingGroups(line).length?'missing-copy':''}">${esc(lineDescription(line))}</small></span><span class="cart-total"><b>×${line.qty}</b><strong>${money(line.total)}</strong></span></button>`).join('');}
function operationLabel(){if(state.operations.immediateStopped||!state.operations.acceptingOrders)return '已停止接單';if(state.operations.scheduledClose)return `接單至 ${state.operations.scheduledClose}`;return '接單中';}
function healthIssueCount(){return Object.values(state.health).filter(item=>!item.ok).length;}
function topbar(){const issues=healthIssueCount();return `<header class="topbar"><div class="brand"><span class="logo-dot"></span><span>磨飯 SMT</span></div><button class="online-state ${state.operations.acceptingOrders&&!state.operations.immediateStopped?'is-online':'is-offline'}" data-action="open-status"><span></span>${operationLabel()}</button><div class="order-number">訂單：<strong>10248</strong></div><div class="spacer"></div><button class="top-btn" data-action="toggle-card" data-card="pending">待處理 <span class="badge">${DATA.pendingOrders.length}</span></button><button class="top-btn" data-action="toggle-card" data-card="quick">快捷 ${state.quick?'ON':'OFF'}</button><button class="top-btn health-button ${issues?'has-error':'is-ok'}" data-action="toggle-card" data-card="health">${issues?'! 系統異常 '+issues:'✓ 系統正常'}</button><button class="top-btn" data-action="toggle-card" data-card="settings">顯示設定</button></header>`;}
function pendingReceipt(){const required=pendingSummary(),link=linkUpSummary();return `<section class="pending-area ${required.total?'':'complete'}"><button class="pending-receipt" data-action="open-completion"><strong>待補區</strong><span>${required.total?`必須完成 ${required.total} 項`:'必選已完成'}</span><span>${link.count?`可組合 ${link.count} 份套餐`:'可補選／可組合'}</span><b>整理</b></button></section>`;}
function quickStrip(){if(!state.quick||!state.settings.quickDrinks.enabled)return '';return `<section class="quick-strip"><button class="quick-label" data-action="toggle-card" data-card="quick"><span>快選</span><span>飲品</span></button><div>${state.settings.quickDrinks.order.map(id=>drinkMap.get(id)).filter(Boolean).map(drink=>drinkCard(drink)).join('')}</div></section>`;}
function sideCard(){
  if(state.card==='settings')return `<aside class="side-card"><header><strong>顯示設定</strong><button data-action="close-card">×</button></header><section><label>產品卡預設</label><div class="chips">${[['large','大圖'],['small','小圖'],['text','純文字']].map(([value,label])=>`<button data-action="set-template" data-value="${value}" class="${state.settings.catalog.defaultTemplate===value?'active':''}">${label}</button>`).join('')}</div></section><section><label><input type="checkbox" data-action="toggle-code" ${state.settings.catalog.showCode?'checked':''}> 顯示產品代碼</label></section><section><label><input type="checkbox" data-action="toggle-quick" ${state.quick?'checked':''}> 顯示快捷飲品</label></section><section><label><input type="checkbox" data-action="toggle-images" ${state.settings.quickDrinks.showImages?'checked':''}> 快捷飲品顯示圖片</label></section><section><label>購物籃合拼</label><div class="chips">${[['same_config','相同設定'],['always','永遠'],['never','不合拼']].map(([value,label])=>`<button data-action="set-merge" data-value="${value}" class="${state.settings.cart.mergeMode===value?'active':''}">${label}</button>`).join('')}</div></section></aside>`;
  if(state.card==='health')return `<aside class="side-card"><header><strong>系統狀態</strong><button data-action="close-card">×</button></header>${Object.values(state.health).map(item=>`<section class="health-row ${item.ok?'ok':'bad'}"><b>${item.label}</b><span>${item.detail}</span></section>`).join('')}<button class="side-action" data-action="refresh-health">重新檢查</button></aside>`;
  if(state.card==='status')return `<aside class="side-card"><header><strong>接單狀態</strong><button data-action="close-card">×</button></header><section><div class="chips"><button data-action="set-operation" data-value="open" class="${state.operations.acceptingOrders&&!state.operations.immediateStopped?'active':''}">接單中</button><button data-action="set-operation" data-value="stop" class="${state.operations.immediateStopped?'active':''}">立即停單</button></div></section><section><label>預定停止時間</label><input class="time-input" type="time" data-action="set-close-time" value="${esc(state.operations.scheduledClose||'')}"></section></aside>`;
  if(state.card==='pending')return pendingPanel();
  if(state.card==='quick')return `<aside class="side-card quick-card"><header><strong>快捷設定</strong><button data-action="close-card">×</button></header><section><label><input type="checkbox" data-action="toggle-quick" ${state.quick?'checked':''}> 啟用快捷飲品</label></section><section><label><input type="checkbox" data-action="toggle-images" ${state.settings.quickDrinks.showImages?'checked':''}> 顯示飲品圖片</label></section><section><small>快捷飲品與待補必選飲品共用同一飲品卡，但兩者狀態分開。</small></section></aside>`;
  return '';
}
function pendingPanel(){const groups=[...new Set(DATA.pendingOrders.map(order=>order.source))];return `<aside class="pending-panel ${state.pendingExpanded?'expanded':''}"><header><strong>待處理訂單</strong><button data-action="close-card">×</button></header><div class="pending-scroll">${groups.map(group=>{const rows=DATA.pendingOrders.filter(order=>order.source===group);const open=state.pendingGroupOpen[group]!==false;return `<section class="pending-group"><button class="pending-group-head" data-action="toggle-pending-group" data-value="${esc(group)}"><b>${esc(group)}</b><span>${rows.length} 張 ${open?'⌃':'⌄'}</span></button>${open?rows.map(order=>`<button class="pending-order-row" data-action="open-pending-order" data-id="${order.id}"><span><b>${order.number}</b><small>${order.customer} · ${order.time}</small></span><span>${order.items} 件<br>${money(order.total)}</span></button>`).join(''):''}</section>`;}).join('')}</div><button class="expand-button" data-action="toggle-pending-expand">${state.pendingExpanded?'收起':'展開至半屏'}</button></aside>`;}
function orderPage(){const visible=DATA.products.filter(product=>state.category==='全部'||(state.category==='人氣推薦'&&product.category==='人氣推薦')||product.category===state.category);return `<div class="app-shell">${topbar()}<main class="workspace"><section class="order-grid"><aside class="cart-panel panel"><header><h2>購物車（${cartCount()}）</h2><div><button data-action="save-draft">暫存</button><button data-action="clear-cart" ${state.cart.length?'':'disabled'}>清空</button></div></header><div class="cart-list">${cartRows()}</div>${pendingReceipt()}<footer><button class="secondary" data-action="open-completion">整理待補</button><button class="primary" data-action="go-checkout" ${state.cart.length?'':'disabled'}>${pendingSummary().total?'先完成必選項目':`結帳 ${money(cartTotal())}`}</button></footer></aside><section class="catalog-panel panel"><div class="categories">${DATA.categories.map(category=>`<button data-action="category" data-value="${category}" class="${state.category===category?'active':''}">${category}</button>`).join('')}</div><div class="products products-${state.settings.catalog.defaultTemplate}">${visible.map(productCard).join('')}</div>${quickStrip()}</section>${sideCard()}</section></main>${bottomNav()}</div><div id="overlay-root"></div><div id="toast" class="toast"></div>`;}
function bottomNav(){return `<nav class="bottom-nav"><button data-action="route" data-value="order" class="${state.route==='order'?'active':''}">點單</button><button disabled>訂單</button><button disabled>堂食</button><button disabled>售罄</button><button disabled>更多</button></nav>`;}
function checkoutPage(){const total=cartTotal(),received=Number(state.checkout.received||0),change=Math.max(0,received-total);return `<div class="app-shell">${topbar()}<main class="workspace checkout-workspace"><section class="checkout-grid"><aside class="checkout-cart panel"><header><button data-action="route" data-value="order">← 返回點單</button><h2>確認訂單</h2></header><div>${cartRows()}</div><footer><span>共 ${cartCount()} 件</span><strong>${money(total)}</strong></footer></aside><section class="checkout-main panel"><h2>來源</h2><div class="choice-grid five">${DATA.checkoutConfig.channels.map(value=>`<button data-action="set-checkout" data-key="channel" data-value="${value}" class="${state.checkout.channel===value?'active':''}">${value}</button>`).join('')}</div><h2>付款方式</h2><div class="choice-grid six">${DATA.checkoutConfig.payments.map(value=>`<button data-action="set-checkout" data-key="payment" data-value="${value}" class="${state.checkout.payment===value?'active':''}">${value}</button>`).join('')}</div><div class="checkout-summary"><span><small>應收</small><b>${money(total)}</b></span><span><small>已收</small><b>${money(received)}</b></span><span><small>找續</small><b>${money(change)}</b></span></div><div class="quick-amounts">${DATA.checkoutConfig.quickAmounts.map(value=>`<button data-action="add-cash" data-value="${value}">+${money(value)}</button>`).join('')}<button data-action="exact-cash">剛好</button></div><button class="confirm-order" data-action="submit-order">確認收款及建立訂單</button></section></section></main>${bottomNav()}</div><div id="overlay-root"></div><div id="toast" class="toast"></div>`;}
function render(){app.innerHTML=state.route==='checkout'?checkoutPage():orderPage();bindImages();persist();scheduleFit();if(state.toast)showToastNode(state.toast);}
function bindImages(){document.querySelectorAll('.image-shell img').forEach(img=>{const fail=()=>img.parentElement.classList.add('failed');img.addEventListener('error',fail,{once:true});if(img.complete&&!img.naturalWidth)fail();});}
function toast(message){state.toast=message;render();clearTimeout(toast.timer);toast.timer=setTimeout(()=>{state.toast='';const node=document.getElementById('toast');node?.classList.remove('show');persist();},1600);}
function showToastNode(message){const node=document.getElementById('toast');if(!node)return;node.textContent=message;requestAnimationFrame(()=>node.classList.add('show'));}
function mountModal(html){const root=document.getElementById('overlay-root');if(root){root.innerHTML=html;bindImages();}}
function modalFrame(body,cls='detail-modal'){return `<button class="scrim" data-action="close-modal" aria-label="關閉"></button><section class="${cls}">${body}</section>`;}
function closeModal(force=false){if(!state.modal)return;if(state.modal.dirty&&!force){return openConfirm('尚未套用修改','離開會失去今次修改。',()=>{state.modal=null;render();});}state.modal=null;render();}
function openConfirm(title,text,onConfirm){state.modal={type:'confirm',dirty:false,onConfirm};mountModal(modalFrame(`<header><strong>${esc(title)}</strong></header><p>${esc(text)}</p><footer><button data-action="cancel-confirm">取消</button><button class="danger" data-action="confirm-leave">離開</button></footer>`,'confirm-modal'));}
function openProduct(productId,lineId=null){const product=productMap.get(productId);if(!product)return;const existing=lineId?state.cart.find(line=>line.lineId===lineId):null;const draft=existing?clone(existing):normalizeLine({productId,qty:1,options:{},drinkAssignments:[]});state.modal={type:'product',productId,lineId,draft,applyQty:existing?existing.qty:1,dirty:false};drawProductModal();}
function drawProductModal(){const modal=state.modal;if(!modal||modal.type!=='product')return;const product=productMap.get(modal.productId),draft=modal.draft;const groups=[...new Set([...(draft.requiredGroups||[]),...(draft.optionalGroups||[])])].filter(group=>!['drink','sweetness','ice'].includes(group));const groupHtml=groups.map(group=>`<section class="option-group"><header><strong>${group==='rice'?'飯底':group==='sauce'?'醬汁':group==='adjustment'?'飯量':'小食'}</strong><span>${draft.requiredGroups.includes(group)?'必選':'選填'}</span></header><div class="chips">${(DATA.optionSets[group]||[]).map(value=>`<button data-action="choose-option" data-group="${group}" data-value="${value}" class="${draft.options[group]===value?'active':''}">${value}</button>`).join('')}</div></section>`).join('');const hasDrink=draft.requiredGroups.includes('drink')||draft.optionalGroups.includes('drink');const link=product.combinableGroup==='single-riceball';mountModal(modalFrame(`<header class="detail-head"><div>${imageBlock(product.image,product.name,'detail-image')}<span><small>${product.code}</small><strong>${esc(product.name)}</strong><b>${money(product.price)}</b></span></div><button data-action="close-modal">×</button></header><div class="detail-body"><div class="detail-left">${groupHtml}${hasDrink?`<section class="option-group"><header><strong>飲品</strong><span>${draft.requiredGroups.includes('drink')?'必選':'選填／Link Up'}</span></header><div class="drink-scroll">${DATA.drinks.map(drink=>drinkCard(drink,'choose-detail-drink')).join('')}</div><small>${draft.drinkAssignments.length?draft.drinkAssignments.map(item=>item.name).join('、'):'未選飲品'}</small></section>`:''}${link?`<section class="linkup-box"><strong>Link Up 套餐提示</strong><span>單點飯團未選小食不計欠項；購物車有獨立小食和飲品時可整理成套餐。</span></section>`:''}</div><aside class="detail-right">${modal.lineId?`<label>套用數量</label><div class="chips quantity-split">${Array.from({length:modal.draft.qty},(_,i)=>i+1).map(value=>`<button data-action="set-apply-qty" data-value="${value}" class="${modal.applyQty===value?'active':''}">${value}</button>`).join('')}</div>`:''}<div class="qty"><button data-action="qty-minus">−</button><button data-action="open-keypad">${draft.qty}</button><button data-action="qty-plus">＋</button></div><dl><dt>單價</dt><dd>${money(draft.unitPrice)}</dd><dt>小計</dt><dd>${money(draft.unitPrice*draft.qty)}</dd></dl><footer>${modal.lineId?`<button class="danger ghost" data-action="delete-line">刪除產品</button>`:'<button data-action="close-modal">取消</button>'}<button class="primary" data-action="apply-product">${modal.lineId?'確認修改':'加入購物車'}</button></footer></aside></div>`));}
function openDrinkEditor(drinkId,context='detail'){const drink=drinkMap.get(drinkId);if(!drink)return;state.modal.sub={drinkId,context,sweetness:'正常甜',ice:'正常冰'};drawDrinkEditor();}
function drawDrinkEditor(){const sub=state.modal.sub,drink=drinkMap.get(sub.drinkId);mountModal(modalFrame(`<header><strong>${esc(drink.name)}</strong><button data-action="back-product">×</button></header>${drink.sweet?`<label>甜度</label><div class="chips">${DATA.optionSets.sweetness.map(value=>`<button data-action="set-drink-mod" data-key="sweetness" data-value="${value}" class="${sub.sweetness===value?'active':''}">${value}</button>`).join('')}</div>`:''}${drink.ice?`<label>冰量</label><div class="chips">${DATA.optionSets.ice.map(value=>`<button data-action="set-drink-mod" data-key="ice" data-value="${value}" class="${sub.ice===value?'active':''}">${value}</button>`).join('')}</div>`:''}<button class="primary full" data-action="apply-drink">套用</button>`,'drink-modal'));}
function openCompletion(){const required=pendingSummary(),link=linkUpSummary();mountModal(modalFrame(`<header class="completion-head"><strong>整理待補區</strong><button data-action="close-modal">×</button></header><div class="completion-body"><section><h3>必須完成</h3>${required.total?Object.entries(required).filter(([key,value])=>key!=='total'&&value).map(([key,value])=>`<p><span>${key==='rice'?'飯底':key==='sauce'?'醬汁':key==='snack'?'小食':'飲品'}</span><b>${value}</b></p>`).join(''):'<div class="complete-message">所有必選已完成</div>'}</section><section><h3>可選／可組合</h3><p><span>單點飯團</span><b>${link.riceballs}</b></p><p><span>獨立小食</span><b>${link.snacks}</b></p><p><span>獨立飲品</span><b>${link.drinks}</b></p>${link.count?`<button class="primary full" data-action="apply-link-up" data-value="${link.count}">組合 ${link.count} 份套餐</button>`:'<small>未有足夠組合項目</small>'}</section></div>`,'completion-modal'));}
function openPendingOrder(orderId){const order=DATA.pendingOrders.find(item=>item.id===orderId);if(!order)return;state.pendingOrderId=orderId;mountModal(modalFrame(`<header><strong>${order.number} · ${esc(order.source)}</strong><button data-action="close-modal">×</button></header><div class="pending-order-detail"><p>${esc(order.customer)}</p><p>${order.items} 件 · ${money(order.total)} · ${order.time}</p><button class="primary full" data-action="claim-pending-order" data-id="${order.id}">接收並建立訂單</button></div>`,'pending-order-modal'));}
function applyEditToQuantity(original,edited,applyQty){if(applyQty>=original.qty)return [normalizeLine({...edited,lineId:original.lineId,qty:original.qty})];const selectedSlots=Math.round((original.drinkSlots/original.qty)*applyQty);const first=normalizeLine({...edited,lineId:stableId('line'),qty:applyQty,drinkSlots:selectedSlots,drinkAssignments:edited.drinkAssignments.slice(0,selectedSlots),_stableOrder:original._stableOrder});const remainQty=original.qty-applyQty;const second=normalizeLine({...original,lineId:original.lineId,qty:remainQty,drinkSlots:Math.max(0,original.drinkSlots-selectedSlots),drinkAssignments:original.drinkAssignments.slice(selectedSlots),_stableOrder:original._stableOrder+.01});return [first,second];}
function applyProduct(){const modal=state.modal,draft=normalizeLine(modal.draft);const missing=missingGroups(draft).reduce((sum,item)=>sum+item.count,0);if(missing)return toast(`尚欠 ${missing} 個必選項目`);if(modal.lineId){const index=state.cart.findIndex(line=>line.lineId===modal.lineId);if(index>=0){const original=state.cart[index];state.cart.splice(index,1,...applyEditToQuantity(original,draft,modal.applyQty));}}else state.cart=mergeCart([...state.cart,draft]);state.modal=null;render();toast(modal.lineId?'修改已套用':'已加入購物車');}
function assignQuickDrink(drinkId){const drink=drinkMap.get(drinkId);const target=state.cart.find(line=>line.drinkAssignments.length<line.drinkSlots);if(!target)return toast('目前沒有待補飲品');target.drinkAssignments.push({drinkId:drink.id,name:drink.name,unitPrice:drink.price,sweetness:'正常甜',ice:'正常冰'});render();toast('已補選 1 份飲品');}
function saveDraft(){if(!state.cart.length)return toast('購物車未有餐點');state.drafts.unshift({id:stableId('draft'),time:new Date().toISOString(),cart:clone(state.cart),total:cartTotal()});state.cart=[];render();toast('訂單已暫存');}
async function refreshHealth(){state.health=await API.health();render();toast('系統狀態已更新');}
async function submitOrder(){if(pendingSummary().total)return toast('請先完成所有必選項目');const payload={items:clone(state.cart),total:cartTotal(),channel:state.checkout.channel,payment:state.checkout.payment,received:Number(state.checkout.received||0)};const result=await API.submitOrder(payload);if(!result.ok)return toast('訂單建立失敗');state.cart=[];state.route='order';state.checkout={channel:'現場外賣',payment:'現金付款',received:0};render();toast(`訂單已建立 ${result.orderId}`);}
function updateSetting(mutator){mutator(state.settings);state.cart=mergeCart(state.cart);render();}
function handleAction(event){const element=event.target.closest('[data-action]');if(!element)return;const action=element.dataset.action;
  if(action==='category'){state.category=element.dataset.value;render();}
  else if(action==='open-product')openProduct(element.dataset.id);
  else if(action==='edit-line'){const line=state.cart.find(item=>item.lineId===element.dataset.id);if(line)openProduct(line.productId,line.lineId);}
  else if(action==='toggle-card'){state.card=state.card===element.dataset.card?null:element.dataset.card;render();}
  else if(action==='close-card'){state.card=null;render();}
  else if(action==='open-status'){state.card='status';render();}
  else if(action==='toggle-pending-expand'){state.pendingExpanded=!state.pendingExpanded;render();}
  else if(action==='toggle-pending-group'){state.pendingGroupOpen[element.dataset.value]=state.pendingGroupOpen[element.dataset.value]===false;render();}
  else if(action==='open-pending-order')openPendingOrder(element.dataset.id);
  else if(action==='claim-pending-order'){API.claimPendingOrder(element.dataset.id).then(()=>{state.modal=null;render();toast('待處理訂單已接收');});}
  else if(action==='set-template')updateSetting(settings=>settings.catalog.defaultTemplate=element.dataset.value);
  else if(action==='toggle-code')updateSetting(settings=>settings.catalog.showCode=!settings.catalog.showCode);
  else if(action==='toggle-quick'){state.quick=!state.quick;render();}
  else if(action==='toggle-images')updateSetting(settings=>settings.quickDrinks.showImages=!settings.quickDrinks.showImages);
  else if(action==='set-merge')updateSetting(settings=>settings.cart.mergeMode=element.dataset.value);
  else if(action==='quick-drink')assignQuickDrink(element.dataset.id);
  else if(action==='clear-cart'){if(confirm('清空後不可恢復，確定清空整張購物車？')){state.cart=[];render();}}
  else if(action==='save-draft')saveDraft();
  else if(action==='open-completion')openCompletion();
  else if(action==='apply-link-up'){state.modal=null;applyLinkUp(Number(element.dataset.value));}
  else if(action==='route'){state.route=element.dataset.value;state.card=null;render();}
  else if(action==='go-checkout'){if(pendingSummary().total)return openCompletion();state.route='checkout';render();}
  else if(action==='set-checkout'){state.checkout[element.dataset.key]=element.dataset.value;render();}
  else if(action==='add-cash'){state.checkout.received=Number(state.checkout.received||0)+Number(element.dataset.value);render();}
  else if(action==='exact-cash'){state.checkout.received=cartTotal();render();}
  else if(action==='submit-order')submitOrder();
  else if(action==='refresh-health')refreshHealth();
  else if(action==='set-operation'){state.operations.immediateStopped=element.dataset.value==='stop';state.operations.acceptingOrders=element.dataset.value!=='stop';render();}
  else if(action==='close-modal')closeModal();
  else if(action==='choose-option'){state.modal.draft.options[element.dataset.group]=element.dataset.value;state.modal.dirty=true;drawProductModal();}
  else if(action==='choose-detail-drink')openDrinkEditor(element.dataset.id);
  else if(action==='set-drink-mod'){state.modal.sub[element.dataset.key]=element.dataset.value;drawDrinkEditor();}
  else if(action==='apply-drink'){const sub=state.modal.sub,drink=drinkMap.get(sub.drinkId);state.modal.draft.drinkAssignments=[{drinkId:drink.id,name:drink.name,unitPrice:drink.price,sweetness:sub.sweetness,ice:sub.ice}];state.modal.dirty=true;delete state.modal.sub;drawProductModal();}
  else if(action==='back-product'){delete state.modal.sub;drawProductModal();}
  else if(action==='qty-minus'){state.modal.draft.qty=Math.max(1,state.modal.draft.qty-1);state.modal.draft.drinkSlots=(productRules(productMap.get(state.modal.productId)).drinkSlotsPerUnit||0)*state.modal.draft.qty;state.modal.applyQty=Math.min(state.modal.applyQty,state.modal.draft.qty);state.modal.dirty=true;drawProductModal();}
  else if(action==='qty-plus'){state.modal.draft.qty++;state.modal.draft.drinkSlots=(productRules(productMap.get(state.modal.productId)).drinkSlotsPerUnit||0)*state.modal.draft.qty;state.modal.dirty=true;drawProductModal();}
  else if(action==='open-keypad'){const value=Number(prompt('輸入數量',state.modal.draft.qty));if(Number.isFinite(value)&&value>0){state.modal.draft.qty=Math.min(99,Math.floor(value));state.modal.applyQty=Math.min(state.modal.applyQty,state.modal.draft.qty);state.modal.dirty=true;drawProductModal();}}
  else if(action==='set-apply-qty'){state.modal.applyQty=Number(element.dataset.value);drawProductModal();}
  else if(action==='apply-product')applyProduct();
  else if(action==='delete-line'){state.cart=state.cart.filter(line=>line.lineId!==state.modal.lineId);state.modal=null;render();toast('產品已刪除');}
  else if(action==='cancel-confirm'){state.modal=null;render();}
  else if(action==='confirm-leave'){const callback=state.modal.onConfirm;state.modal=null;callback?.();}
}
function handleChange(event){const element=event.target.closest('[data-action]');if(!element)return;if(element.dataset.action==='set-close-time'){state.operations.scheduledClose=element.value;render();}}

document.addEventListener('click',event=>{try{handleAction(event);}catch(error){console.error('SMT_ACTION_ERROR',error);state.modal=null;toast('操作未完成，資料已保留，請再試一次');}});
document.addEventListener('change',handleChange);
window.addEventListener('error',event=>{console.error(event.error||event.message);toast('操作未完成，資料已保留');});
window.addEventListener('unhandledrejection',event=>{console.error(event.reason);toast('操作未完成，資料已保留');});

window.__SMT_TEST__={productRules,normalizeLine,normalizeCart,missingGroups,applyEditToQuantity,orientationIsLandscape};
API.health().then(result=>{state.health=result;render();}).catch(()=>render());
scheduleFit();render();
