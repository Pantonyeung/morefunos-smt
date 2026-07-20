import {createRenderQueue,createStore,installErrorBoundary,safeClone} from '../../shared/runtime.js';
import {ORDER_STORAGE_KEY,SETTINGS_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';
import {money,imageBlock,bindImageFallbacks,showToast,escapeHtml} from '../../shared/components.js';
import {orderPageConfig as defaults} from './page-config.js';
import {categories,products,drinks,optionSets} from './page-data.js';
import {acceptPendingOrder,completeExpiredOrders,createWhatsAppLink,updateCartLineQuantity} from './order-domain.js';

const app=document.getElementById('app');
const productMap=new Map(products.map(item=>[item.id,item]));
const drinkMap=new Map(drinks.map(item=>[item.id,item]));
const snackProducts=products.filter(item=>item.linkRole==='snack');
const drinkProducts=products.filter(item=>item.linkRole==='drink');
let modal=null;
let confirmState=null;
let newOrderNotice={id:'A516',source:'磨飯 App',items:3,amount:104,visible:true};
const demoPendingOrders={
  online:[{id:'A512',source:'磨飯 App',contact:'陳小姐',phone:'85291234567',items:5,amount:168,wait:'2 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'FPS',proof:'../../assets/products/f4.webp',lines:[['蜜糖雞絲＋鹽酥雞',2,90],['台式奶茶',2,32],['香脆雞翼',1,18]]},{id:'W331',source:'網頁',contact:'梁先生',phone:'85262345678',items:3,amount:62,wait:'1 分鐘',paymentStatus:'已付款，待核對',paymentMethod:'PayMe',proof:'../../assets/products/f1.webp',lines:[['原味紫米飯團',1,41],['味噌湯',1,12],['可樂',1,9]]}],
  queue:[{id:'T1824',source:'電話',contact:'電話尾號 1824',phone:'85261231824',items:2,amount:96,wait:'4 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'待確認',proof:'',lines:[['自選便當',2,96]]},{id:'T6631',source:'WhatsApp',contact:'WhatsApp 尾號 6631',phone:'85261236631',items:1,amount:59,wait:'6 分鐘',paymentStatus:'等候客人付款證明',paymentMethod:'FPS',proof:'',lines:[['紫米飯團 A 餐',1,59]]}]
};

const saved=readJSON(ORDER_STORAGE_KEY,null);
const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
const settings={
  catalog:{...defaults.catalog,...(savedSettings.catalog||{}),productOverrides:{}},
  cart:{...defaults.cart,...(savedSettings.cart||{})},
  quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}
};

function drinkSelection(id,sweetness='',ice=''){
  const d=drinkMap.get(id);
  return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice};
}
function makeLine(productId,qty=1,{options={},drinkAssignments=[],linkedComboId='',linkedQty=0}={}){
  const p=productMap.get(productId);
  qty=Math.max(1,Number(qty)||1);
  return {
    lineId:stableId('line'),productId,name:p.name,image:p.image,qty,
    unitPrice:p.price,total:p.price*qty,options:safeClone(options),
    drinkAssignments:safeClone(drinkAssignments),drinkSlots:(p.drinkSlots||0)*qty,
    required:[...(p.required||[])],combinable:Boolean(p.combinable),linkRole:p.linkRole||'',
    linkedComboId,linkedQty,createdOrder:Date.now()+Math.random()
  };
}
function normalizeCart(cart){
  return (Array.isArray(cart)?cart:[]).map((line,index)=>{
    const p=productMap.get(line.productId)||{};
    const qty=Math.max(1,Number(line.qty)||1);
    const unitPrice=Number(line.unitPrice??p.price??0);
    return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',qty,unitPrice,total:unitPrice*qty,options:{...(line.options||{})},drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:[...(p.required||[])],combinable:Boolean(line.combinable??p.combinable),linkRole:line.linkRole||p.linkRole||'',linkedComboId:line.linkedComboId||'',linkedQty:Number(line.linkedQty||0),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};
  }).sort((a,b)=>a.createdOrder-b.createdOrder);
}
function mergeKey(line){return JSON.stringify({productId:line.productId,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||'']),linkedComboId:line.linkedComboId});}
function mergeCart(cart,mode){
  const rows=normalizeCart(cart);if(mode==='never')return rows;
  const out=[];
  rows.forEach(line=>{
    const found=out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));
    if(!found){out.push(safeClone(line));return;}
    found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));
  });
  return out;
}
function describe(line){
  const parts=[];
  Object.entries(line.options||{}).forEach(([key,value])=>{if(value)parts.push(Array.isArray(value)?value.join('、'):value);});
  const grouped={};
  (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});
  Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});
  if(line.linkedComboId)parts.push('已組合套餐'+(line.linkedQty>1?' ×'+line.linkedQty:''));
  const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
  if(missing&&line.required.includes('drink'))parts.push('尚欠飲品 '+missing+' 份');
  return parts.join(' · ')||'標準';
}
function missingGroups(line){
  const groups=[];
  (line.required||[]).forEach(group=>{
    if(group==='drink'){
      const count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
      if(count)groups.push({group,label:'飲品',count});
    }else if(!line.options?.[group]) groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:line.qty||1});
  });
  return groups;
}
function pendingSummary(cart){
  const out={rice:0,sauce:0,snack:0,drink:0,total:0};
  cart.forEach(line=>missingGroups(line).forEach(item=>{out[item.group]+=item.count;out.total+=item.count;}));
  return out;
}
function cartTotal(cart){return cart.reduce((sum,line)=>sum+Number(line.total||0),0);}
function linkUpSummary(cart){
  const available=cart.filter(line=>!line.linkedComboId);
  const riceballs=available.filter(line=>line.combinable).reduce((n,line)=>n+line.qty,0);
  const snacks=available.filter(line=>line.linkRole==='snack').reduce((n,line)=>n+line.qty,0);
  const standaloneDrinks=available.filter(line=>line.linkRole==='drink').reduce((n,line)=>n+line.qty,0);
  return {riceballs,snacks,drinks:standaloneDrinks,count:Math.min(riceballs,snacks,standaloneDrinks)};
}
function applyLinkUp(count){
  if(!count)return;
  store.set(state=>{
    let riceLeft=count,snackLeft=count,drinkLeft=count;
    const comboId=stableId('combo');
    const next=[];
    state.cart.forEach(line=>{
      if(line.linkedComboId){next.push(line);return;}
      let take=0;
      if(line.combinable&&riceLeft){take=Math.min(line.qty,riceLeft);riceLeft-=take;}
      else if(line.linkRole==='snack'&&snackLeft){take=Math.min(line.qty,snackLeft);snackLeft-=take;}
      else if(line.linkRole==='drink'&&drinkLeft){take=Math.min(line.qty,drinkLeft);drinkLeft-=take;}
      if(!take){next.push(line);return;}
      next.push({...line,lineId:stableId('line'),qty:take,total:line.unitPrice*take,drinkSlots:Math.min(line.drinkSlots||0,take),drinkAssignments:(line.drinkAssignments||[]).slice(0,take),linkedComboId:comboId,linkedQty:take});
      const remain=line.qty-take;
      if(remain)next.push({...line,lineId:stableId('line'),qty:remain,total:line.unitPrice*remain,drinkSlots:Math.max(0,(line.drinkSlots||0)-take),drinkAssignments:(line.drinkAssignments||[]).slice(take),linkedComboId:'',linkedQty:0,createdOrder:line.createdOrder+.0001});
    });
    state.cart=normalizeCart(next);
    return state;
  });
  showToast('已組合 '+count+' 份飯團套餐');
}

const initialCart=saved&&Array.isArray(saved.cart)?saved.cart:[
  makeLine('f4',2),
  makeLine('a1',2,{drinkAssignments:[drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea')]}),
  makeLine('b1',3,{options:{rice:'肉燥飯'},drinkAssignments:[drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea')]})
];
const defaultHealth={api:{ok:false,label:'API',detail:'未連接'},printer:{ok:false,label:'打印機',detail:'未連接'},sync:{ok:false,label:'同步',detail:'等待 API'},backup:{ok:true,label:'備份',detail:'本機資料正常'}};
const store=createStore({category:'全部',cart:normalizeCart(initialCart),settings,quickDrawerOpen:false,pendingOrders:safeClone(demoPendingOrders),runningOrders:[],completedOrders:[],operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false},health:defaultHealth},{storageKey:ORDER_STORAGE_KEY,normalize:state=>({...state,quickDrawerOpen:Boolean(state.quickDrawerOpen),cart:normalizeCart(state.cart||[]),pendingOrders:state.pendingOrders||safeClone(demoPendingOrders),runningOrders:Array.isArray(state.runningOrders)?state.runningOrders:[],completedOrders:Array.isArray(state.completedOrders)?state.completedOrders:[],settings:{...settings,...(state.settings||{}),catalog:{...settings.catalog,...(state.settings?.catalog||{})},cart:{...settings.cart,...(state.settings?.cart||{})},quickDrinks:{...settings.quickDrinks,...(state.settings?.quickDrinks||{})}},operations:{acceptingOrders:true,scheduledClose:'',immediateStopped:false,...(state.operations||{})},health:{...defaultHealth,...(state.health||{})}})});
const queue=createRenderQueue(render);store.subscribe(()=>queue.schedule());
installErrorBoundary({toast:showToast,report:error=>window.parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*')});

function updateSettings(mutator){
  store.set(state=>{mutator(state.settings);writeJSON(SETTINGS_STORAGE_KEY,state.settings);return state;});
}
function productTemplate(){return store.get().settings.catalog.defaultTemplate;}
function drinkChoiceCard(d,action='select-drink',selected=false){
  const imageMode=store.get().settings.quickDrinks.showImages!==false;
  return '<button class="drink-choice-card '+(imageMode?'is-image':'is-text')+' '+(selected?'selected':'')+'" data-action="'+action+'" data-id="'+d.id+'">'+(imageMode?imageBlock(d.image,d.name,'drink-choice-img'):'')+'<span>'+escapeHtml(d.name)+'</span></button>';
}
function productCard(p){
  const template=productTemplate();const showCode=store.get().settings.catalog.showCode;const showDescription=store.get().settings.catalog.showDescription;
  const action=store.get().quickMode?'quick-add-product':'open-product';
  const code=showCode?'<small class="product-code">'+p.code+'</small>':'';
  if(template==='text')return '<button class="product-card text" data-action="'+action+'" data-id="'+p.id+'"><span class="product-copy">'+code+'<strong>'+p.name+'</strong></span><b class="product-price">'+money(p.price)+'</b></button>';
  if(template==='small')return '<button class="product-card small" data-action="'+action+'" data-id="'+p.id+'">'+imageBlock(p.image,p.name,'product-thumb')+'<span class="product-copy">'+code+'<strong>'+p.name+'</strong></span><b class="product-price">'+money(p.price)+'</b></button>';
  const description=showDescription&&p.description?'<p class="product-description">'+p.description+'</p>':'';
  return '<button class="product-card large" data-action="'+action+'" data-id="'+p.id+'">'+imageBlock(p.image,p.name,'product-hero')+'<div class="product-info"><span class="product-copy">'+code+'<strong>'+p.name+'</strong>'+description+'</span><b class="product-price">'+money(p.price)+'</b></div></button>';
}
function cartRows(){
  const state=store.get(),cart=state.cart,showImages=state.settings.cart.showImages!==false;if(!cart.length)return '<div class="empty">購物車未有餐點</div>';
  const grouped=new Map();cart.forEach((line,index)=>{const category=productMap.get(line.productId)?.category||'其他';if(!grouped.has(category))grouped.set(category,[]);grouped.get(category).push({line,index});});
  return [...grouped].map(([category,rows])=>'<section class="cart-category"><header><strong>'+escapeHtml(category)+'</strong><span>'+rows.reduce((n,x)=>n+x.line.qty,0)+' 件</span></header>'+rows.map(({line,index})=>'<article class="cart-row '+(showImages?'':'no-image')+'" data-line-id="'+line.lineId+'"><span class="seq">'+(index+1)+'</span>'+(showImages?imageBlock(line.image,line.name,'cart-img'):'')+'<span class="cart-copy"><strong>'+line.name+'</strong><small>'+describe(line)+'</small></span><b class="cart-price">'+money(line.total)+'</b><span class="cart-actions"><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="-1">−</button><strong>'+line.qty+'</strong><button data-action="cart-qty" data-id="'+line.lineId+'" data-delta="1">＋</button><button class="edit-button" data-action="edit-line" data-id="'+line.lineId+'">修改</button></span></article>').join('')+'</section>').join('');
}
function pendingArea(){
  const state=store.get();const required=pendingSummary(state.cart);const link=linkUpSummary(state.cart);
  return '<section class="pending-area '+(!required.total?'complete':'')+'"><button class="pending-receipt" data-action="open-completion"><strong>必選補齊</strong><span>'+(required.total?'尚欠 '+required.total+' 項':'全部完成')+'</span><b>整理</b></button><button data-action="linkup-all" data-count="'+link.count+'" '+(link.count?'':'disabled')+'>一鍵自動組合 '+link.count+'</button><button data-action="open-specified-link">指定配對</button></section>';
}
function quickDrinks(){
  const state=store.get();if(state.settings.quickDrinks.visible===false)return '';
  const order=state.settings.quickDrinks.order||drinks.map(d=>d.id);
  const missing=pendingSummary(state.cart).drink;
  return '<section class="quick-drawer '+(state.quickDrawerOpen?'open':'')+'"><button class="quick-drawer-handle" data-action="toggle-quick-drawer"><span>快捷飲品</span><em>待補 '+missing+'</em><b>'+(state.quickDrawerOpen?'⌄':'⌃')+'</b></button>'+(state.quickDrawerOpen?'<div class="quick-drawer-panel"><header><strong>快捷飲品｜待補 '+missing+'</strong><button data-action="toggle-quick-drawer">×</button></header><div>'+order.map(id=>drinkMap.get(id)).filter(Boolean).map(d=>drinkChoiceCard(d,'quick-drink',modal?.type==='drink'&&modal.drinkId===d.id)).join('')+'</div></div>':'')+'</section>';
}
function operationLabel(state){if(state.operations.immediateStopped||!state.operations.acceptingOrders)return '已停止接單';if(state.operations.scheduledClose)return '接單至 '+state.operations.scheduledClose;return '接單中';}
function healthIssueCount(state){return Object.values(state.health).filter(item=>!item.ok).length;}
function topbar(){
  const state=store.get();const issues=healthIssueCount(state),pendingCount=Object.values(state.pendingOrders).flat().length;
  return '<header class="topbar"><div class="brand">磨飯 SMT</div><button class="online-state '+(state.operations.acceptingOrders&&!state.operations.immediateStopped?'is-online':'is-offline')+'" data-action="open-status"><span>⌁</span>'+operationLabel(state)+'</button><div class="order-number">訂單：<strong>10248</strong></div><div class="spacer"></div><button class="top-btn" data-action="toggle-pending-panel">▤ 待處理 <span class="badge">'+pendingCount+'</span></button><button class="top-btn" data-action="open-soldout">⊗ 售罄 2</button><button class="top-btn" data-action="open-quick-settings">快捷 '+(state.quickMode?'ON':'OFF')+'</button><button class="top-btn health-button '+(issues?'has-error':'is-ok')+'" data-action="open-health"><span>'+(issues?'!':'✓')+'</span>'+(issues?'設備 '+issues:'設備正常')+'</button><button class="top-btn" data-action="open-settings">顯示設定</button></header>';
}
function pendingPanel(){
  const pendingOrders=store.get().pendingOrders;
  const rows=list=>list.map(x=>'<button data-action="process-pending-order" data-id="'+x.id+'"><span><strong>'+x.id+' · '+x.source+'</strong><small>'+x.contact+'</small></span><b>'+x.items+' 件 · '+money(x.amount)+'</b><small>等待 '+x.wait+' · 按下處理</small></button>').join('');
  return '<aside class="pending-panel modal-card"><header><strong>待處理</strong><button data-action="dismiss-modal">×</button></header><div class="pending-split"><section><h3>磨飯 App／網頁訂單</h3><div class="pending-scroll">'+rows(pendingOrders.online)+'</div></section><section><h3>電話／WhatsApp 排隊單</h3><div class="pending-scroll">'+rows(pendingOrders.queue)+'</div></section></div><footer class="single-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
}
function pendingDetailModal(){
  const x=modal.order;
  return '<aside class="pending-panel modal-card"><header><div><small>'+x.source+'</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-order-detail"><span>產品數量 <b>'+x.items+' 件</b></span><span>訂單金額 <b>'+money(x.amount)+'</b></span><span>等候時間 <b>'+x.wait+'</b></span><span>付款狀態 <b>'+x.paymentStatus+'</b></span><p>開始核對後會顯示完整產品、金額及付款證明；此時仍未正式接單。</p></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="start-pending-review">開始核對</button></footer></aside>';
}
function pendingReviewModal(){
  const x=modal.order;const whatsapp=createWhatsAppLink(x.phone,(x.contact||'客人')+'，你好。磨飯訂單 '+x.id+' 正在核對中，請回覆或補充付款證明，謝謝。');
  const lines=(x.lines||[]).map(line=>'<div><span>'+escapeHtml(line[0])+' ×'+line[1]+'</span><b>'+money(line[2])+'</b></div>').join('');
  const proof=x.proof?'<button class="payment-proof" data-action="enlarge-proof">'+imageBlock(x.proof,'付款證明','payment-proof-image')+'<span>按下放大付款證明</span></button>':'<div class="payment-proof empty"><strong>尚未收到付款證明</strong><span>請用右方 WhatsApp QR Code 聯絡客人</span></div>';
  return '<aside class="pending-review-card modal-card"><header><div><small>'+x.source+' · 訂單核對</small><strong>'+x.id+' · '+x.contact+'</strong></div><button data-action="dismiss-modal">×</button></header><div class="pending-review-body"><section class="review-order"><div class="review-summary"><span>產品 <b>'+x.items+' 件</b></span><span>總額 <b>'+money(x.amount)+'</b></span><span>付款 <b>'+x.paymentMethod+'</b></span></div><div class="review-lines">'+lines+'</div><div class="payment-status"><span>付款狀態</span><strong>'+x.paymentStatus+'</strong></div>'+proof+'</section><aside class="whatsapp-qr"><strong>WhatsApp QR Code</strong><p>公司電話掃描後，直接開啟客人對話及預設訊息。</p><div class="qr-code" data-qr="'+escapeHtml(whatsapp)+'"></div><a href="'+escapeHtml(whatsapp)+'" target="_blank" rel="noopener">在此裝置開啟 WhatsApp</a></aside></div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button data-action="report-payment-issue">資料有問題</button><button class="primary" data-action="accept-pending-order" '+(x.proof?'':'disabled')+'>確認接單</button></footer></aside>';
}
function enlargedProofModal(){const x=modal.order;return '<aside class="proof-lightbox modal-card"><header><strong>'+x.id+' · 付款證明</strong><button data-action="back-to-pending-review">×</button></header>'+imageBlock(x.proof,'付款證明放大圖','proof-full')+'<footer class="right-action"><button data-action="back-to-pending-review">返回核對</button></footer></aside>';}
function modalScrim(){return modal?'<div class="modal-scrim" aria-hidden="true"></div>':'';}
function quickSettingsModal(){
  const state=store.get();const q=state.settings.quickDrinks;
  const order=q.order||drinks.map(d=>d.id);
  return '<aside class="side-card modal-card quick-mode-card"><header><strong>快捷模式</strong><button data-action="dismiss-modal">×</button></header><div class="card-scroll"><div class="setting-block"><strong>點單模式</strong><div class="segmented"><button class="'+(!state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="normal">普通模式</button><button class="'+(state.quickMode?'active':'')+'" data-action="set-order-mode" data-value="quick">快捷模式</button></div><small>快捷模式：點產品直接加入購物籃</small></div><div class="setting-row"><div><strong>快捷飲品抽屜</strong><small>平時收起，按下向上展開</small></div><button class="switch '+(q.visible!==false?'on':'')+'" data-action="toggle-quick-drink-strip"><i></i></button></div><div class="setting-block"><strong>飲品卡顯示</strong><div class="segmented"><button class="'+(q.showImages!==false?'active':'')+'" data-action="quick-display" data-value="image">圖片</button><button class="'+(q.showImages===false?'active':'')+'" data-action="quick-display" data-value="text">純文字</button></div></div><div class="setting-block"><strong>飲品排列</strong><div class="quick-order-list">'+order.map((id,index)=>{const d=drinkMap.get(id);return d?'<div><span><b>'+(index+1)+'</b>'+escapeHtml(d.name)+'</span><span><button data-action="move-quick-drink" data-id="'+id+'" data-delta="-1" '+(!index?'disabled':'')+'>↑</button><button data-action="move-quick-drink" data-id="'+id+'" data-delta="1" '+(index===order.length-1?'disabled':'')+'>↓</button></span></div>':'';}).join('')+'</div></div><div class="setting-row"><div><strong>快捷補選</strong><small>只控制待補飲品快捷套用</small></div><button class="switch '+(q.quickAssist!==false?'on':'')+'" data-action="toggle-quick-assist"><i></i></button></div></div></aside>';
}
function settingsModal(){
  const state=store.get();const c=state.settings.catalog,w=Number(state.settings.cart.widthPercent||32);
  return '<aside class="side-card modal-card"><header><strong>顯示設定</strong><button data-action="dismiss-modal">×</button></header><div class="setting-block"><strong>購物籃比例</strong><div class="segmented three">'+[25,30,32].map(x=>'<button data-action="cart-width" data-value="'+x+'" class="'+(w===x?'active':'')+'">'+x+' / '+(100-x)+'</button>').join('')+'</div></div><div class="setting-row"><div><strong>顯示購物車產品圖片</strong><small>關閉後保留名稱、描述、價格與操作</small></div><button class="switch '+(state.settings.cart.showImages!==false?'on':'')+'" data-action="toggle-cart-images"><i></i></button></div><div class="setting-block"><strong>產品卡</strong><div class="segmented three"><button data-action="setting-card" data-value="large" class="'+(c.defaultTemplate==='large'?'active':'')+'">大圖</button><button data-action="setting-card" data-value="small" class="'+(c.defaultTemplate==='small'?'active':'')+'">小圖</button><button data-action="setting-card" data-value="text" class="'+(c.defaultTemplate==='text'?'active':'')+'">純文字</button></div></div><div class="setting-row"><div><strong>顯示產品 Code</strong><small>例如 F4、B1、S1</small></div><button class="switch '+(c.showCode?'on':'')+'" data-action="toggle-code"><i></i></button></div></aside>';
}
function healthModal(){
  const state=store.get();return '<aside class="side-card modal-card"><header><strong>系統狀態</strong><button data-action="dismiss-modal">×</button></header><div class="health-list">'+Object.values(state.health).map(item=>'<div class="health-row '+(item.ok?'ok':'bad')+'"><span>'+(item.ok?'✓':'!')+'</span><div><strong>'+item.label+'</strong><small>'+item.detail+'</small></div><b>'+(item.ok?'正常':'異常')+'</b></div>').join('')+'</div></aside>';
}
function statusModal(){
  const state=store.get(),ops=state.operations;
  return '<aside class="side-card modal-card"><header><strong>今日接單狀態</strong><button data-action="dismiss-modal">×</button></header><div class="setting-row"><div><strong>接受網絡／預約訂單</strong><small>'+operationLabel(state)+'</small></div><button class="switch '+(ops.acceptingOrders&&!ops.immediateStopped?'on':'')+'" data-action="toggle-accepting"><i></i></button></div><div class="setting-block"><label>今日停止接單時間</label><div class="time-row"><input id="scheduled-close" type="time" value="'+(ops.scheduledClose||'')+'"><button data-action="save-close-time">儲存</button></div></div><div class="setting-block"><button class="danger wide" data-action="immediate-stop">即時停止接單</button><button class="wide" data-action="resume-orders">恢復接單</button></div></aside>';
}
function soldoutModal(){
  return '<aside class="side-card modal-card soldout-preview"><header><strong>售罄列表</strong><button data-action="dismiss-modal">×</button></header><div class="status-list"><div><span><b>F2 紫菜吞拿魚飯團</b><small>今日售罄</small></span><em>售罄</em></div><div><span><b>B3 照燒雞扒便當</b><small>暫停至今日收舖</small></span><em>停售</em></div></div><footer class="right-action"><button data-action="dismiss-modal">返回</button></footer></aside>';
}
function specifiedLinkModal(){
  const available=store.get().cart.filter(line=>!line.linkedComboId);
  return '<aside class="side-card modal-card specified-link-card"><header><strong>指定配對</strong><button data-action="dismiss-modal">×</button></header><div class="card-scroll"><p>依次選擇飯團、小食、飲品；每次確認建立一組套餐。</p>'+['飯團','小食','飲品'].map((label,index)=>'<section><strong>'+(index+1)+'. '+label+'</strong><div class="link-candidates">'+available.filter(line=>index===0?line.combinable:index===1?line.linkRole==='snack':line.linkRole==='drink').map(line=>'<button data-action="select-link-item" data-role="'+index+'" data-id="'+line.lineId+'" class="'+(modal.draft[index]===line.lineId?'selected':'')+'">'+escapeHtml(line.name)+' ×'+line.qty+'</button>').join('')+'</div></section>').join('')+'</div><footer class="single-action"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-specified-link" '+(modal.draft.filter(Boolean).length===3?'':'disabled')+'>確認組合</button></footer></aside>';
}
function completionModal(){
  const state=store.get(),required=pendingSummary(state.cart),link=linkUpSummary(state.cart),assist=state.settings.quickDrinks.quickAssist!==false;
  return '<aside class="completion-card modal-card"><header><strong>統一整理</strong><button data-action="dismiss-modal">×</button></header><div class="completion-section required"><div><small>必須完成</small><strong>'+(required.total?'共欠 '+required.total+' 項':'全部完成')+'</strong><span>未完成項目會阻止結帳</span></div>'+['rice','sauce','snack','drink'].filter(k=>required[k]).map(k=>'<button data-action="complete-group" data-group="'+k+'"><span>'+({rice:'飯底',sauce:'醬汁',snack:'小食',drink:'飲品'}[k])+'</span><b>'+required[k]+' 份</b><em>選擇</em></button>').join('')+'</div><div class="completion-section optional"><div><small>可補選</small><strong>唔影響結帳</strong><span>單點飯團可加小食及飲品升級套餐</span></div></div><div class="completion-section linkup"><div><small>可組合套餐</small><strong>'+link.count+' 份</strong><span>飯團 '+link.riceballs+'｜小食 '+link.snacks+'｜飲品 '+link.drinks+'</span></div>'+(link.count?'<button class="primary" data-action="linkup-all" data-count="'+link.count+'">一鍵組合</button>':'')+'</div>'+(assist&&required.drink?'<div class="completion-drinks"><strong>選擇飲品</strong><div>'+drinks.map(d=>drinkChoiceCard(d,'completion-drink')).join('')+'</div></div>':'')+'</aside>';
}
function optionButtons(group,values,selected,multi=false){
  return '<div class="option-chips">'+values.map(value=>'<button data-action="detail-option" data-group="'+group+'" data-value="'+escapeHtml(value)+'" data-multi="'+multi+'" class="'+((multi?selected.includes(value):selected===value)?'selected':'')+'">'+escapeHtml(value)+'</button>').join('')+'</div>';
}
function detailGroups(product,draft){
  const rows=[];
  if(product.required.includes('rice'))rows.push('<section><header><strong>飯底</strong><span class="required-tag">必選</span></header>'+optionButtons('rice',optionSets.rice,draft.options.rice||'')+'</section>');
  if(product.required.includes('sauce'))rows.push('<section><header><strong>醬汁</strong><span class="required-tag">必選</span></header>'+optionButtons('sauce',optionSets.sauce,draft.options.sauce||'')+'</section>');
  rows.push('<section><header><strong>飯量／份量</strong><span>可選</span></header>'+optionButtons('portion',['少飯','標準','多飯','加飯 +$5'],draft.options.portion||'標準')+'</section>');
  rows.push('<section><header><strong>口味調整</strong><span>可多選</span></header>'+optionButtons('taste',['走蔥','少辣','走蒜','走香菜','不要花生'],draft.options.taste||[],true)+'</section>');
  if(product.required.includes('snack'))rows.push('<section><header><strong>套餐小食</strong><span class="required-tag">必選</span></header>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
  if(product.combinable)rows.push('<section class="upgrade-section"><header><strong>升級飯團套餐</strong><span>可補選</span></header><p>小食及飲品都選擇後，會直接組合成飯團套餐。</p>'+optionButtons('snack',optionSets.snack,draft.options.snack||'')+'</section>');
  if(product.required.includes('drink')||product.combinable){
    rows.push('<section><header><strong>'+(product.required.includes('drink')?'套餐飲品':'加配飲品')+'</strong><span class="'+(product.required.includes('drink')?'required-tag':'')+'">'+(product.required.includes('drink')?'必選':'可補選')+'</span></header><div class="detail-drinks">'+drinks.map(d=>drinkChoiceCard(d,'detail-drink',draft.drink?.drinkId===d.id)).join('')+'</div></section>');
  }
  rows.push('<section><header><strong>備註</strong><span>可選</span></header><textarea data-action="detail-note" maxlength="80" placeholder="例如：醬汁分開、謝謝">'+escapeHtml(draft.note||'')+'</textarea></section>');
  return rows.join('');
}
function productDetailModal(){
  const {productId,draft}=modal;const p=productMap.get(productId);const missing=[];
  p.required.forEach(group=>{if(group==='drink'){if(!draft.drink)missing.push('飲品');}else if(!draft.options[group])missing.push(group==='rice'?'飯底':group==='sauce'?'醬汁':'小食');});
  const subtotal=p.price*draft.qty;
  return '<aside class="product-settings-card modal-card" data-editing="'+Boolean(modal.editLineId)+'"><header class="settings-product-head"><div><small>'+(modal.editLineId?'修改產品':'新增產品')+'</small><h2>'+p.name+'</h2><strong>'+money(p.price)+'</strong></div><button data-action="dismiss-modal" aria-label="返回">×</button></header><div class="product-settings-body"><div class="qty-row"><span>數量</span><button data-action="detail-qty" data-delta="-1">−</button><strong>'+draft.qty+'</strong><button data-action="detail-qty" data-delta="1">＋</button></div>'+detailGroups(p,draft)+'</div><footer class="product-settings-actions"><button data-action="dismiss-modal">返回</button><button class="primary" data-action="apply-product" '+(missing.length?'disabled':'')+'>確認 '+money(subtotal)+'</button></footer>'+(missing.length?'<p class="missing-hint">還欠：'+missing.join('、')+'</p>':'')+'</aside>';
}
function drinkModifierModal(){
  const d=drinkMap.get(modal.drinkId),draft=modal.draft;
  const groups=draft.groups||[];const total=draft.qty+groups.reduce((n,g)=>n+g.qty,0);
  return '<aside class="modifier-card modal-card"><header><strong>'+d.name+'</strong><button data-action="dismiss-modal">×</button></header><div class="drink-base-qty"><span>正常</span><span><button data-action="modifier-qty" data-delta="-1">−</button><b>'+draft.qty+'</b><button data-action="modifier-qty" data-delta="1">＋</button></span></div><div class="drink-groups">'+groups.map((g,index)=>'<section class="drink-group '+(g.open?'open':'')+'"><header><button class="group-summary" data-action="toggle-drink-adjustment" data-index="'+index+'">'+([g.sweetness,g.ice].filter(Boolean).join('・')||'選擇調整')+' ×'+g.qty+'</button><span><button data-action="group-qty" data-index="'+index+'" data-delta="-1">−</button><b>'+g.qty+'</b><button data-action="group-qty" data-index="'+index+'" data-delta="1">＋</button></span></header>'+(g.open?'<div class="adjustment-options">'+(d.sweet?optionButtons('group-sweetness-'+index,['多甜','少甜','走甜'],g.sweetness||''):'')+(d.ice?optionButtons('group-ice-'+index,['少冰','多冰'],g.ice||''):'')+'</div>':'')+'</section>').join('')+'</div><button data-action="add-drink-group" class="add-group">＋ 新增調整</button><button class="primary wide" data-action="apply-drink" '+(total?'':'disabled')+'>套用 '+total+' 份</button></aside>';
}
function bulkOptionModal(){
  const values=optionSets[modal.group]||[];
  const label={rice:'飯底',sauce:'醬汁',snack:'小食'}[modal.group]||'選項';
  return '<aside class="modifier-card modal-card"><header><strong>統一補'+label+'</strong><button data-action="dismiss-modal">×</button></header><section><strong>選擇'+label+' <small>套用到所有未完成項目</small></strong>'+optionButtons('bulk',values,modal.draft.value||'')+'</section><button class="primary wide" data-action="apply-bulk" '+(modal.draft.value?'':'disabled')+'>確認套用</button></aside>';
}
function customConfirm(){
  const notice=newOrderNotice?.visible?'<aside class="new-order-toast"><div><small>'+newOrderNotice.source+' 新訂單</small><strong>'+newOrderNotice.id+'</strong><span>'+newOrderNotice.items+' 件 · '+money(newOrderNotice.amount)+'</span></div><button data-action="later-new-order">稍後處理</button><button class="primary" data-action="process-new-order">立即處理</button></aside>':'';
  if(!confirmState)return notice;
  return notice+'<div class="confirm-layer"><section class="confirm-card"><strong>'+confirmState.title+'</strong><p>'+confirmState.message+'</p><div><button data-action="confirm-cancel">繼續修改</button><button class="danger" data-action="confirm-discard">放棄修改</button></div></section></div>';
}
function activeModal(){
  if(!modal)return '';
  if(modal.type==='quick')return quickSettingsModal();
  if(modal.type==='settings')return settingsModal();
  if(modal.type==='health')return healthModal();
  if(modal.type==='status')return statusModal();
  if(modal.type==='soldout')return soldoutModal();
  if(modal.type==='specified-link')return specifiedLinkModal();
  if(modal.type==='completion')return completionModal();
  if(modal.type==='product')return productDetailModal();
  if(modal.type==='drink')return drinkModifierModal();
  if(modal.type==='bulk')return bulkOptionModal();
  if(modal.type==='pending')return pendingPanel();
  if(modal.type==='pending-detail')return pendingDetailModal();
  if(modal.type==='pending-review')return pendingReviewModal();
  if(modal.type==='proof')return enlargedProofModal();
  return '';
}
function anchorRect(button){const r=button?.getBoundingClientRect?.();return r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null;}
function positionActiveCard(){
  const card=document.querySelector('.side-card,.product-settings-card,.modifier-card,.pending-panel,.pending-review-card,.proof-lightbox');const a=modal?.anchor;if(!card||!a)return;
  const topbarRect=document.querySelector('.topbar')?.getBoundingClientRect(),bottomNavRect=document.querySelector('.bottom-nav')?.getBoundingClientRect();
  const cartRect=document.querySelector('.cart')?.getBoundingClientRect();
  if(modal?.type==='pending'&&cartRect)card.style.maxHeight=Math.min(cartRect.height,(bottomNavRect?.top||innerHeight)-(topbarRect?.bottom||0)-32)+'px';
  const gap=14,w=card.offsetWidth,h=card.offsetHeight,margin=16,minTop=(topbarRect?.bottom||0)+margin,maxBottom=(bottomNavRect?.top||innerHeight)-margin;
  const room={top:a.top-minTop,bottom:maxBottom-a.bottom,left:a.left-margin,right:innerWidth-margin-a.right};
  let side,left,top;
  if(a.top<minTop+90){side='top';left=a.left+a.width/2-w/2;top=a.bottom+gap;}
  else if(a.bottom>maxBottom-110){side='bottom';left=a.left+a.width/2-w/2;top=a.top-h-gap;}
  else if(room.right>=w+gap){side='left';left=a.right+gap;top=a.top+a.height/2-h/2;}
  else {side='right';left=a.left-w-gap;top=a.top+a.height/2-h/2;}
  left=Math.max(margin,Math.min(left,innerWidth-w-margin));top=Math.max(minTop,Math.min(top,maxBottom-h));
  card.style.left=left+'px';card.style.right='auto';card.style.top=top+'px';card.style.transform='none';card.dataset.pointerSide=side;
  card.style.setProperty('--pointer-y',Math.max(24,Math.min(a.top+a.height/2-top,h-24))+'px');card.style.setProperty('--pointer-x',Math.max(24,Math.min(a.left+a.width/2-left,w-24))+'px');
}
function render(){
  const state=store.get();const filtered=state.category==='全部'?products:products.filter(p=>p.category===state.category);const template=productTemplate();
  app.innerHTML='<main>'+topbar()+'<section class="workspace"><section class="order-grid" style="--cart-width:'+Number(state.settings.cart.widthPercent||32)+'%"><aside class="cart"><header><h2>購物車（'+state.cart.reduce((n,l)=>n+l.qty,0)+'）</h2><button data-action="clear-cart">清空</button></header><div class="cart-list">'+cartRows()+'</div>'+pendingArea()+'<footer><button data-action="save">暫存</button><button class="primary" data-action="checkout">結帳 '+money(cartTotal(state.cart))+'</button></footer></aside><section class="catalog"><nav class="categories">'+categories.map(cat=>'<button data-action="category" data-value="'+cat+'" class="'+(cat===state.category?'active':'')+'">'+cat+'</button>').join('')+'</nav><div class="products products-'+template+'">'+filtered.map(productCard).join('')+'</div>'+quickDrinks()+'</section></section></section><nav class="bottom-nav"><button class="active">點餐</button><button>訂單</button><button>堂食</button><button>售罄</button><button>更多</button></nav></main>'+modalScrim()+activeModal()+customConfirm()+'<div id="toast" class="toast"></div>';
  document.body.classList.toggle('has-modal',Boolean(modal));
  bindImageFallbacks(app);
  if(modal?.type==='settings'){const first=document.querySelector('.side-card .setting-row');first?.insertAdjacentHTML('beforebegin','<div class="setting-block"><strong>購物車相同產品</strong><div class="segmented"><button data-action="cart-merge" data-value="same" class="'+(state.settings.cart.mergeMode!=='never'?'active':'')+'">相同配置合併</button><button data-action="cart-merge" data-value="never" class="'+(state.settings.cart.mergeMode==='never'?'active':'')+'">逐項顯示</button></div></div>');}
  document.querySelectorAll('[data-qr]').forEach(node=>{if(typeof window.qrcode!=='function')return;const qr=window.qrcode(0,'M');qr.addData(node.dataset.qr);qr.make();node.innerHTML=qr.createImgTag(5,8,'WhatsApp QR Code');});
  requestAnimationFrame(positionActiveCard);
}
function markDirty(){if(modal)modal.dirty=true;}
function requestDismiss(){
  if(!modal)return;
  if(modal.dirty&&['product','drink','bulk'].includes(modal.type)){
    confirmState={title:'尚未套用修改',message:'返回後今次選擇將不會保存。',returnModal:modal.type==='drink'&&modal.parent?modal.parent:null};render();return;
  }
  modal=modal.type==='drink'&&modal.parent?modal.parent:null;confirmState=null;render();
}
function openProduct(productId,lineId='',anchor=null){
  const p=productMap.get(productId),line=lineId?store.get().cart.find(x=>x.lineId===lineId):null;
  modal={type:'product',productId,editLineId:lineId,anchor,dirty:false,draft:{qty:line?.qty||1,options:safeClone(line?.options||{}),drink:line?.drinkAssignments?.[0]||null,note:line?.options?.note||'',keypad:false,keypadValue:''}};
  render();
}
function quickAddProduct(productId){
  const p=productMap.get(productId);if(!p)return;
  const line=makeLine(productId);
  store.set(state=>{state.cart=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);return state;});
  showToast('已加入 '+p.name);
}
function changeCartQuantity(lineId,delta){
  store.set(state=>{
    state.cart=updateCartLineQuantity(state.cart,lineId,delta,Object.fromEntries(products.map(p=>[p.id,p.drinkSlots||0])));
    return state;
  });
}
function openDrink(drinkId,context,maxQty=1,anchor=null){modal={type:'drink',drinkId,context,maxQty,anchor,dirty:false,draft:{qty:1,sweetness:'',ice:'',groups:[]}};render();}
function applyProduct(){
  const editing=Boolean(modal.editLineId);
  const p=productMap.get(modal.productId),d=modal.draft,options={...d.options};if(d.note)options.note=d.note;
  const drinkAssignments=d.drink?Array.from({length:d.qty},()=>safeClone(d.drink)):[];
  const line=makeLine(p.id,d.qty,{options,drinkAssignments,linkedComboId:p.combinable&&d.options.snack&&d.drink?stableId('combo'):'',linkedQty:p.combinable&&d.options.snack&&d.drink?d.qty:0});
  store.set(state=>{
    if(modal.editLineId)state.cart=state.cart.map(item=>item.lineId===modal.editLineId?{...line,lineId:item.lineId,createdOrder:item.createdOrder}:item);
    else state.cart=mergeCart(state.cart.concat(line),state.settings.cart.mergeMode);
    return state;
  });
  modal=null;render();showToast(editing?'已更新產品':'已加入購物車');
}
function applyDrink(){
  const groups=modal.draft.groups||[];
  const selections=Array.from({length:modal.draft.qty},()=>drinkSelection(modal.drinkId)).concat(groups.flatMap(group=>Array.from({length:group.qty},()=>drinkSelection(modal.drinkId,group.sweetness,group.ice)))),qty=selections.length,context=modal.context;
  if(context==='detail'){
    const productModal=modal.parent;productModal.draft.drink=selections[0];productModal.dirty=true;modal=productModal;render();return;
  }
  store.set(state=>{let remaining=selections.slice();state.cart=state.cart.map(line=>{if(!remaining.length)return line;const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const taken=remaining.splice(0,miss);return taken.length?{...line,drinkAssignments:line.drinkAssignments.concat(taken)}:line;});return state;});
  modal=null;render();showToast('已補選飲品');
}
function handle(button){
  const action=button.dataset.action;
  if(action==='category')store.set(state=>({...state,category:button.dataset.value}));
  else if(action==='open-product')openProduct(button.dataset.id,'',anchorRect(button));
  else if(action==='quick-add-product')quickAddProduct(button.dataset.id);
  else if(action==='cart-qty')changeCartQuantity(button.dataset.id,Number(button.dataset.delta)||0);
  else if(action==='edit-line'){const line=store.get().cart.find(x=>x.lineId===button.dataset.id);if(line)openProduct(line.productId,line.lineId,anchorRect(button));}
  else if(action==='open-completion'){modal={type:'completion',dirty:false};render();}
  else if(action==='open-quick-settings'){modal={type:'quick',anchor:anchorRect(button),dirty:false};render();}
  else if(action==='open-settings'){modal={type:'settings',anchor:anchorRect(button),dirty:false};render();}
  else if(action==='open-health'){modal={type:'health',anchor:anchorRect(button),dirty:false};render();}
  else if(action==='open-status'){modal={type:'status',anchor:anchorRect(button),dirty:false};render();}
  else if(action==='open-soldout'){modal={type:'soldout',anchor:anchorRect(button),dirty:false};render();}
  else if(action==='toggle-quick-drawer')store.set(state=>({...state,quickDrawerOpen:!state.quickDrawerOpen}));
  else if(action==='move-quick-drink')updateSettings(s=>{const order=s.quickDrinks.order.slice(),from=order.indexOf(button.dataset.id),to=Math.max(0,Math.min(order.length-1,from+Number(button.dataset.delta)));if(from>=0&&from!==to)[order[from],order[to]]=[order[to],order[from]];s.quickDrinks.order=order;});
  else if(action==='ui-scale')window.parent?.postMessage?.({type:'morefun:set-ui-scale',value:Number(button.dataset.value)},'*');
  else if(action==='dismiss-modal')requestDismiss();
  else if(action==='confirm-cancel'){confirmState=null;render();}
  else if(action==='confirm-discard'){modal=confirmState?.returnModal||null;confirmState=null;render();}
  else if(action==='toggle-pending-panel'){if(modal?.type==='pending')modal=null;else modal={type:'pending',anchor:anchorRect(button),dirty:false};render();}
  else if(action==='process-pending-order'){const pendingOrders=store.get().pendingOrders;const order=Object.values(pendingOrders).flat().find(x=>x.id===button.dataset.id);if(order){modal={type:'pending-detail',order,anchor:modal?.anchor,dirty:false};showToast('開啟 '+order.id+' 核對流程');render();}}
  else if(action==='start-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
  else if(action==='enlarge-proof'){modal={type:'proof',order:modal.order,anchor:modal.anchor,dirty:false};render();}
  else if(action==='back-to-pending-review'){modal={type:'pending-review',order:modal.order,anchor:modal.anchor,dirty:false};render();}
  else if(action==='report-payment-issue'){showToast('請掃描 WhatsApp QR Code 聯絡客人');}
  else if(action==='accept-pending-order'){
    const accepted=acceptPendingOrder(modal.order);
    store.set(state=>{state.pendingOrders={online:state.pendingOrders.online.filter(x=>x.id!==accepted.id),queue:state.pendingOrders.queue.filter(x=>x.id!==accepted.id)};state.runningOrders=state.runningOrders.concat(accepted);return state;});
    showToast('已接單 '+accepted.id+'；30分鐘後自動完成');modal=null;render();
  }
  else if(action==='set-order-mode')store.set(state=>({...state,quickMode:button.dataset.value==='quick'}));
  else if(action==='toggle-quick-drink-strip')updateSettings(s=>{s.quickDrinks.visible=s.quickDrinks.visible===false;});
  else if(action==='quick-display')updateSettings(s=>{s.quickDrinks.showImages=button.dataset.value==='image';});
  else if(action==='toggle-quick-assist')updateSettings(s=>{s.quickDrinks.quickAssist=s.quickDrinks.quickAssist===false;});
  else if(action==='setting-card')updateSettings(s=>{s.catalog.defaultTemplate=button.dataset.value;s.catalog.productOverrides={};});
  else if(action==='cart-width')updateSettings(s=>{s.cart.widthPercent=Number(button.dataset.value)||32;});
  else if(action==='cart-merge')updateSettings(s=>{s.cart.mergeMode=button.dataset.value;});
  else if(action==='toggle-cart-images')updateSettings(s=>{s.cart.showImages=s.cart.showImages===false;});
  else if(action==='toggle-code')updateSettings(s=>{s.catalog.showCode=!s.catalog.showCode;});
  else if(action==='toggle-accepting')store.set(state=>{state.operations.acceptingOrders=!state.operations.acceptingOrders;state.operations.immediateStopped=false;return state;});
  else if(action==='save-close-time'){const v=document.getElementById('scheduled-close')?.value||'';store.set(state=>{state.operations.scheduledClose=v;return state;});showToast('接單時間已更新');}
  else if(action==='immediate-stop')store.set(state=>{state.operations.acceptingOrders=false;state.operations.immediateStopped=true;return state;});
  else if(action==='resume-orders')store.set(state=>{state.operations.acceptingOrders=true;state.operations.immediateStopped=false;state.operations.scheduledClose='';return state;});
  else if(action==='detail-option'){
    markDirty();const g=button.dataset.group,v=button.dataset.value,multi=button.dataset.multi==='true';
    if(modal.type==='drink'){
      if(g==='sweetness')modal.draft.sweetness=modal.draft.sweetness===v?'':v;
      if(g==='ice')modal.draft.ice=modal.draft.ice===v?'':v;
      if(g.startsWith('group-sweetness-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.sweetness=group.sweetness===v?'':v;}
      if(g.startsWith('group-ice-')){const x=Number(g.split('-').pop()),group=modal.draft.groups[x];group.ice=group.ice===v?'':v;}
    }else if(modal.type==='bulk'){
      modal.draft.value=modal.draft.value===v?'':v;
    }else if(multi){const arr=modal.draft.options[g]||[];modal.draft.options[g]=arr.includes(v)?arr.filter(x=>x!==v):arr.concat(v);}else modal.draft.options[g]=modal.draft.options[g]===v?'':v;
    render();
  }
  else if(action==='detail-drink'){
    const parent=modal;modal={type:'drink',drinkId:button.dataset.id,context:'detail',maxQty:parent.draft.qty,parent,anchor:anchorRect(button),dirty:false,draft:{qty:parent.draft.qty,sweetness:'',ice:'',groups:[]}};render();
  }
  else if(action==='detail-qty'){markDirty();modal.draft.qty=Math.max(1,modal.draft.qty+Number(button.dataset.delta));render();}
  else if(action==='toggle-keypad'){modal.draft.keypad=!modal.draft.keypad;render();}
  else if(action==='keypad'){
    const key=button.dataset.key;if(key==='完成'){modal.draft.keypad=false;}else if(key==='←'){modal.draft.keypadValue=modal.draft.keypadValue.slice(0,-1);}else modal.draft.keypadValue=(modal.draft.keypadValue+key).replace(/^0+(?=\d)/,'');
    if(modal.draft.keypadValue)modal.draft.qty=Math.max(1,Number(modal.draft.keypadValue));markDirty();render();
  }
  else if(action==='apply-product')applyProduct();
  else if(action==='modifier-qty'){markDirty();modal.draft.qty=Math.max(0,Math.min(modal.maxQty,modal.draft.qty+Number(button.dataset.delta)));render();}
  else if(action==='group-qty'){markDirty();const g=modal.draft.groups[Number(button.dataset.index)];const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);g.qty=Math.max(1,Math.min(g.qty+Number(button.dataset.delta),modal.maxQty-used+g.qty));render();}
  else if(action==='add-drink-group'){markDirty();const used=modal.draft.qty+modal.draft.groups.reduce((n,x)=>n+x.qty,0);if(used<modal.maxQty)modal.draft.groups.push({qty:1,sweetness:'',ice:'',open:true});else showToast('已達可補數量');render();}
  else if(action==='toggle-drink-adjustment'){const g=modal.draft.groups[Number(button.dataset.index)];g.open=!g.open;render();}
  else if(action==='apply-drink')applyDrink();
  else if(action==='quick-drink'){
    if(store.get().settings.quickDrinks.quickAssist===false){showToast('快捷補選已關閉');return;}
    const missing=pendingSummary(store.get().cart).drink;if(!missing){showToast('目前沒有待補飲品');return;}openDrink(button.dataset.id,'global',missing,anchorRect(button));
  }
  else if(action==='completion-drink')openDrink(button.dataset.id,'global',pendingSummary(store.get().cart).drink,anchorRect(button));
  else if(action==='complete-group'){
    const g=button.dataset.group;if(g==='drink'){showToast('請在下方選擇飲品');return;}
    modal={type:'bulk',group:g,dirty:false,draft:{value:''}};render();
  }
  else if(action==='apply-bulk'){
    const g=modal.group,value=modal.draft.value;
    store.set(state=>{state.cart=state.cart.map(line=>line.required.includes(g)&&!line.options[g]?{...line,options:{...line.options,[g]:value}}:line);return state;});
    modal={type:'completion',dirty:false};render();showToast('已統一補選 '+value);
  }
  else if(action==='linkup-all')applyLinkUp(Number(button.dataset.count)||0);
  else if(action==='open-specified-link'){modal={type:'specified-link',anchor:anchorRect(button),dirty:false,draft:['','','']};render();}
  else if(action==='select-link-item'){modal.draft[Number(button.dataset.role)]=button.dataset.id;render();}
  else if(action==='apply-specified-link'){const ids=modal.draft,comboId=stableId('combo');store.set(state=>{state.cart=state.cart.map(line=>ids.includes(line.lineId)?{...line,linkedComboId:comboId,linkedQty:1}:line);return state;});modal=null;render();showToast('已建立指定套餐');}
  else if(action==='later-new-order'){newOrderNotice.visible=false;render();}
  else if(action==='process-new-order'){newOrderNotice.visible=false;modal={type:'pending',anchor:null,dirty:false};render();}
  else if(action==='clear-cart'){if(window.confirm('清空後不可恢復，確定清空整張購物車？'))store.set(state=>({...state,cart:[]}));}
  else if(action==='checkout'){if(pendingSummary(store.get().cart).total){showToast('請先完成必選項目');return;}window.parent?.postMessage?.({type:'morefun:navigate',route:'checkout'},'*');}
}
app.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(button&&!button.disabled)handle(button);});
app.addEventListener('input',event=>{if(event.target.matches('[data-action="detail-note"]')&&modal?.type==='product'){modal.draft.note=event.target.value;markDirty();}});
render();
setTimeout(()=>{if(newOrderNotice?.visible){newOrderNotice.visible=false;render();}},3000);
setInterval(()=>{store.set(state=>{const next=completeExpiredOrders(state.runningOrders);const completed=next.filter((order,index)=>order.status==='completed'&&state.runningOrders[index]?.status!=='completed');if(!completed.length)return state;state.runningOrders=next.filter(order=>order.status==='running');state.completedOrders=state.completedOrders.concat(completed);return state;});},30000);
