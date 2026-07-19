import {createRenderQueue,createStore,createOverlayManager,installErrorBoundary,safeClone} from '../../shared/runtime.js';
import {ORDER_STORAGE_KEY,SETTINGS_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';
import {money,imageBlock,bindImageFallbacks,showToast} from '../../shared/components.js';
import {orderPageConfig as defaults} from './page-config.js';
import {categories,products,drinks,optionSets} from './page-data.js';

const app=document.getElementById('app');
const productMap=new Map(products.map(item=>[item.id,item]));
const drinkMap=new Map(drinks.map(item=>[item.id,item]));
const overlay=createOverlayManager();

function makeLine(productId,qty=1,options={},drinkAssignments=[],drinkSlots){
  const product=productMap.get(productId);
  qty=Math.max(1,Number(qty)||1);
  return {
    lineId:stableId('line'),productId,name:product.name,image:product.image,qty,
    unitPrice:product.price,total:product.price*qty,options,
    drinkAssignments:Array.isArray(drinkAssignments)?drinkAssignments:[],
    drinkSlots:drinkSlots==null?(product.drinkSlots||0)*qty:Number(drinkSlots),
    required:Array.isArray(product.required)?product.required:[],
    combinable:Boolean(product.combinable),createdOrder:Date.now()+Math.random()
  };
}
function drinkSelection(id,sweetness='',ice=''){
  const drink=drinkMap.get(id);
  return {drinkId:id,name:drink?.name||id,unitPrice:drink?.price||0,sweetness,ice};
}
function normalizeCart(cart){
  return (Array.isArray(cart)?cart:[]).map((line,index)=>{
    const product=productMap.get(line.productId)||{};
    const qty=Math.max(1,Number(line.qty)||1);
    const unitPrice=Number(line.unitPrice??product.price??0);
    return {...line,lineId:line.lineId||stableId('line'),name:line.name||product.name||'餐點',image:line.image||product.image||'',qty,unitPrice,total:unitPrice*qty,options:{...(line.options||{})},drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(product.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:(product.required||[]),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index};
  }).sort((a,b)=>a.createdOrder-b.createdOrder);
}
function mergeKey(line){return JSON.stringify({productId:line.productId,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness||'',d.ice||''])});}
function mergeCart(cart,mode){
  const rows=normalizeCart(cart);
  if(mode==='never')return rows;
  const out=[];
  rows.forEach(line=>{
    const found=out.find(item=>item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line)));
    if(!found){out.push(safeClone(line));return;}
    found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;found.drinkAssignments.push(...safeClone(line.drinkAssignments));
  });
  return out;
}
function describe(line){
  const parts=Object.values(line.options||{}).filter(Boolean);
  const grouped={};
  (line.drinkAssignments||[]).forEach(d=>{const key=[d.name,d.sweetness||'',d.ice||''].join('|');grouped[key]=(grouped[key]||0)+1;});
  Object.entries(grouped).forEach(([key,count])=>{const [name,sweet,ice]=key.split('|');const mods=[sweet,ice].filter(Boolean).join(' · ');parts.push(name+(mods?' · '+mods:'')+(count>1?' ×'+count:''));});
  const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
  if(missing)parts.push('尚欠飲品 '+missing+' 份');
  return parts.join(' · ')||'標準';
}
function missingGroups(line){
  const groups=[];
  (line.required||[]).forEach(group=>{
    if(group==='drink'){
      const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
      if(missing)groups.push({group:'drink',label:'飲品',count:missing});
    }else if(!line.options?.[group]){
      groups.push({group,label:group==='rice'?'飯底':group==='sauce'?'醬汁':'小食',count:1});
    }
  });
  return groups;
}
function missingCount(cart){return cart.reduce((sum,line)=>sum+missingGroups(line).reduce((n,item)=>n+item.count,0),0);}

const saved=readJSON(ORDER_STORAGE_KEY,null);
const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
const settings={catalog:{...defaults.catalog,...(savedSettings.catalog||{}),productOverrides:{}},cart:{...defaults.cart,...(savedSettings.cart||{})},quickDrinks:{...defaults.quickDrinks,...(savedSettings.quickDrinks||{})}};
const initialCart=saved&&Array.isArray(saved.cart)?saved.cart:[makeLine('f4',2,{},[],0),makeLine('a1',2,{},[],2),makeLine('b1',3,{rice:'肉燥飯'},[drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea')],3)];
const store=createStore({category:'全部',cart:normalizeCart(initialCart),settings,activeCard:null,online:true,pendingOpen:true},{storageKey:ORDER_STORAGE_KEY,normalize:state=>({...state,cart:normalizeCart(state.cart||[])})});
const queue=createRenderQueue(render);
store.subscribe(()=>queue.schedule());
installErrorBoundary({toast:showToast,report:error=>window.parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*')});

function productTemplate(){return store.get().settings.catalog.defaultTemplate;}
function productCard(product){
  const template=productTemplate();
  const showCode=store.get().settings.catalog.showCode;
  const showDescription=store.get().settings.catalog.showDescription;
  const code=showCode?'<small class="product-code">'+product.code+'</small>':'';
  if(template==='text')return '<button class="product-card text" data-action="add" data-id="'+product.id+'"><span class="product-copy">'+code+'<strong>'+product.name+'</strong></span><b class="product-price">'+money(product.price)+'</b></button>';
  if(template==='small')return '<button class="product-card small" data-action="add" data-id="'+product.id+'">'+imageBlock(product.image,product.name,'product-thumb')+'<span class="product-copy">'+code+'<strong>'+product.name+'</strong></span><b class="product-price">'+money(product.price)+'</b></button>';
  const description=showDescription&&product.description?'<p class="product-description">'+product.description+'</p>':'';
  return '<button class="product-card large" data-action="add" data-id="'+product.id+'">'+imageBlock(product.image,product.name,'product-hero')+'<div class="product-info"><span class="product-copy">'+code+'<strong>'+product.name+'</strong>'+description+'</span><b class="product-price">'+money(product.price)+'</b></div></button>';
}
function cartRows(){
  const cart=store.get().cart;
  if(!cart.length)return '<div class="empty">購物車未有餐點</div>';
  return cart.map((line,index)=>'<button class="cart-row" data-action="edit-line" data-id="'+line.lineId+'"><span class="seq">'+(index+1)+'</span>'+imageBlock(line.image,line.name,'cart-img')+'<span><strong>'+line.name+'</strong><small>'+describe(line)+'</small></span><b>x'+line.qty+'<br>'+money(line.total)+'</b></button>').join('');
}
function pendingArea(){
  const state=store.get();
  const rows=[];
  state.cart.forEach(line=>missingGroups(line).forEach(item=>rows.push({line,item})));
  if(!rows.length)return '<section class="pending-area complete"><button class="pending-head" data-action="toggle-pending"><strong>待補區</strong><span>已完成</span></button></section>';
  return '<section class="pending-area '+(state.pendingOpen?'open':'')+'"><button class="pending-head" data-action="toggle-pending"><strong>待補區</strong><span class="badge">'+missingCount(state.cart)+'</span><i>⌄</i></button>'+(state.pendingOpen?'<div class="pending-list">'+rows.map(({line,item})=>'<button data-action="pending-edit" data-id="'+line.lineId+'"><span><strong>'+line.name+'</strong><small>'+item.label+'尚欠 '+item.count+' 份</small></span><b>處理</b></button>').join('')+'</div>':'')+'</section>';
}
function quickDrinks(){
  const order=store.get().settings.quickDrinks.order||drinks.map(d=>d.id);
  return order.map(id=>drinkMap.get(id)).filter(Boolean).map(drink=>'<button class="quick-drink" data-action="quick-drink" data-id="'+drink.id+'">'+(store.get().settings.quickDrinks.showImages?imageBlock(drink.image,drink.name,'quick-img'):'')+'<span>'+drink.name+'</span></button>').join('');
}
function topbar(){
  const state=store.get();
  return '<header class="topbar"><div class="brand">磨飯 SMT</div><button class="online-state '+(state.online?'is-online':'is-offline')+'" data-action="toggle-online"><span></span>'+(state.online?'線上':'離線')+'</button><div class="order-number">訂單：<strong>10248</strong></div><div class="spacer"></div><button class="top-btn" data-action="toggle-card" data-card="pending">待處理 <span class="badge">8</span></button><button class="top-btn '+(state.activeCard==='settings'?'active':'')+'" data-action="toggle-card" data-card="settings">顯示設定</button></header>';
}
function sideCard(){
  const state=store.get();
  if(state.activeCard==='settings'){
    const template=state.settings.catalog.defaultTemplate;const merge=state.settings.cart.mergeMode;
    return '<aside class="side-card"><header><strong>顯示設定</strong><button class="close" data-action="close-card">×</button></header><div class="setting"><label>產品卡樣式</label><div class="chips">'+['large','small','text'].map(v=>'<button data-action="setting-card" data-value="'+v+'" class="'+(template===v?'active':'')+'">'+(v==='large'?'大圖':v==='small'?'小圖':'純文字')+'</button>').join('')+'</div></div><div class="setting"><label><input type="checkbox" data-action="toggle-code" '+(state.settings.catalog.showCode?'checked':'')+'> 顯示產品代碼</label></div><div class="setting"><label>購物籃合併方式</label><div class="chips">'+['always','same_config','never'].map(v=>'<button data-action="merge-mode" data-value="'+v+'" class="'+(merge===v?'active':'')+'">'+(v==='always'?'永遠合併':v==='same_config'?'相同設定合併':'不合併')+'</button>').join('')+'</div></div></aside>';
  }
  if(state.activeCard==='pending')return '<aside class="side-card"><header><strong>待處理</strong><button class="close" data-action="close-card">×</button></header><div class="setting">磨飯 App <span class="badge">5</span></div><div class="setting">電話／WhatsApp 核對 <span class="badge">3</span></div></aside>';
  return '';
}
function render(){
  const state=store.get();
  const filtered=products.filter(p=>state.category==='全部'||p.category===state.category||(state.category==='人氣推薦'&&p.tag));
  const total=state.cart.reduce((n,line)=>n+line.total,0);
  app.innerHTML='<div class="app">'+topbar()+'<main class="workspace"><section class="order-grid"><aside class="cart panel"><header><h2>購物車（'+state.cart.reduce((n,l)=>n+l.qty,0)+'）</h2><button class="btn" data-action="clear-cart" '+(state.cart.length?'':'disabled')+'>清空</button></header><div class="cart-list">'+cartRows()+'</div>'+pendingArea()+'<footer><button class="btn">暫存</button><button class="btn primary" data-action="checkout">'+(missingCount(state.cart)?'先整理':'結帳 '+money(total))+'</button></footer></aside><section class="catalog panel"><div class="categories">'+categories.map(c=>'<button data-action="category" data-value="'+c+'" class="'+(state.category===c?'active':'')+'">'+c+'</button>').join('')+'</div><div class="products products-'+productTemplate()+'">'+filtered.map(productCard).join('')+'</div><div class="quick-strip"><strong>快捷飲品</strong><div>'+quickDrinks()+'</div></div></section>'+sideCard()+'</section></main><nav class="bottom-nav"><button class="active">點單</button><button>訂單</button><button>堂食</button><button>售罄</button><button>更多</button></nav></div><div id="toast" class="toast"></div>';
  bindImageFallbacks(app);bind();
}
function bind(){app.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',event=>handle(event,button)));}
function updateSettings(mutator){store.set(state=>{mutator(state.settings);writeJSON(SETTINGS_STORAGE_KEY,state.settings);state.cart=mergeCart(state.cart,state.settings.cart.mergeMode);return state;});}
function addProduct(id){const product=productMap.get(id);if(!product)return;store.set(state=>{state.cart=mergeCart(state.cart.concat([makeLine(id,1,{},[],product.drinkSlots||0)]),state.settings.cart.mergeMode);return state;});showToast('已加入購物車');}

function openDrinkPopover(anchor,{drinkId,maxQty,onApply}){
  const drink=drinkMap.get(drinkId);let qty=1;let sweet='';let ice='';
  const sweetOptions=(optionSets.sweetness||[]).filter(v=>!v.startsWith('正常'));
  const iceOptions=(optionSets.ice||[]).filter(v=>!v.startsWith('正常'));
  const opened=overlay.open({anchor,content:'',width:360});
  function draw(){
    opened.panel.innerHTML='<header><strong>'+drink.name+'</strong><button class="close" data-close>×</button></header>'+(maxQty>1?'<label>修改份數</label><div class="stepper"><button data-minus '+(qty<=1?'disabled':'')+'>−</button><strong>'+qty+'</strong><button data-plus '+(qty>=maxQty?'disabled':'')+'>＋</button></div>':'')+(drink.sweet?'<label>甜度（不選即正常）</label><div class="chips">'+sweetOptions.map(v=>'<button data-sweet="'+v+'" class="'+(sweet===v?'active':'')+'">'+v+'</button>').join('')+'</div>':'')+(drink.ice?'<label>冰量（不選即正常）</label><div class="chips">'+iceOptions.map(v=>'<button data-ice="'+v+'" class="'+(ice===v?'active':'')+'">'+v+'</button>').join('')+'</div>':'')+'<button class="btn primary apply" data-apply>套用 '+qty+' 份</button>';
    opened.panel.querySelector('[data-close]').onclick=overlay.close;
    opened.panel.querySelector('[data-minus]')?.addEventListener('click',()=>{qty=Math.max(1,qty-1);draw();});
    opened.panel.querySelector('[data-plus]')?.addEventListener('click',()=>{qty=Math.min(maxQty,qty+1);draw();});
    opened.panel.querySelectorAll('[data-sweet]').forEach(button=>button.onclick=()=>{sweet=sweet===button.dataset.sweet?'':button.dataset.sweet;draw();});
    opened.panel.querySelectorAll('[data-ice]').forEach(button=>button.onclick=()=>{ice=ice===button.dataset.ice?'':button.dataset.ice;draw();});
    opened.panel.querySelector('[data-apply]').onclick=()=>{onApply(qty,drinkSelection(drink.id,sweet,ice));overlay.close();};
    opened.position();
  }
  draw();
}
function openOptionPopover(anchor,line,group){
  const values=optionSets[group]||[];let value=line.options?.[group]||'';const opened=overlay.open({anchor,content:'',width:360});
  function draw(){opened.panel.innerHTML='<header><strong>'+(group==='rice'?'飯底':group==='sauce'?'醬汁':'小食')+'</strong><button class="close" data-close>×</button></header><div class="chips">'+values.map(v=>'<button data-value="'+v+'" class="'+(value===v?'active':'')+'">'+v+'</button>').join('')+'</div><button class="btn primary apply" data-apply '+(value?'':'disabled')+'>套用</button>';opened.panel.querySelector('[data-close]').onclick=overlay.close;opened.panel.querySelectorAll('[data-value]').forEach(button=>button.onclick=()=>{value=button.dataset.value;draw();});opened.panel.querySelector('[data-apply]').onclick=()=>{store.set(state=>{const target=state.cart.find(item=>item.lineId===line.lineId);if(target)target.options[group]=value;return state;});overlay.close();};opened.position();}
  draw();
}
function openEditCard(lineId){
  document.querySelector('.edit-card')?.remove();
  const line=store.get().cart.find(item=>item.lineId===lineId);if(!line)return;
  const card=document.createElement('aside');card.className='edit-card';
  card.innerHTML='<header><div><strong>修改卡｜'+line.name+'</strong><small>'+line.qty+' 份</small></div><button class="close">×</button></header><div class="edit-body">'+(line.required.includes('rice')?'<button data-group="rice">飯底 <span>'+(line.options.rice||'未選')+'</span></button>':'')+(line.required.includes('sauce')?'<button data-group="sauce">醬汁 <span>'+(line.options.sauce||'未選')+'</span></button>':'')+(line.required.includes('snack')?'<button data-group="snack">小食 <span>'+(line.options.snack||'未選')+'</span></button>':'')+(line.required.includes('drink')?'<div class="edit-drinks">'+drinks.map(d=>'<button data-drink="'+d.id+'">'+imageBlock(d.image,d.name,'edit-drink-img')+'<span>'+d.name+'</span></button>').join('')+'</div>':'')+'<p>'+describe(line)+'</p></div>';
  document.querySelector('.order-grid').appendChild(card);bindImageFallbacks(card);card.querySelector('.close').onclick=()=>card.remove();
  card.querySelectorAll('[data-group]').forEach(button=>button.onclick=()=>openOptionPopover(button,line,button.dataset.group));
  card.querySelectorAll('[data-drink]').forEach(button=>button.onclick=()=>openDrinkPopover(button,{drinkId:button.dataset.drink,maxQty:line.qty,onApply:(qty,selection)=>{store.set(state=>{const index=state.cart.findIndex(item=>item.lineId===lineId);if(index<0)return state;const original=state.cart[index];const edited=safeClone(original);edited.lineId=qty===original.qty?original.lineId:stableId('line');edited.qty=qty;edited.total=edited.unitPrice*qty;edited.drinkSlots=Math.round((original.drinkSlots/original.qty)*qty);edited.drinkAssignments=Array.from({length:edited.drinkSlots},()=>safeClone(selection));const replacement=[edited];if(qty<original.qty)replacement.push({...safeClone(original),qty:original.qty-qty,total:original.unitPrice*(original.qty-qty),createdOrder:original.createdOrder+0.001});state.cart=normalizeCart(state.cart.slice(0,index).concat(replacement,state.cart.slice(index+1)));return state;});card.remove();}}));
}
function handle(event,button){
  const action=button.dataset.action;
  if(action==='category')store.set(state=>({...state,category:button.dataset.value}));
  if(action==='add')addProduct(button.dataset.id);
  if(action==='edit-line'||action==='pending-edit')openEditCard(button.dataset.id);
  if(action==='toggle-pending')store.set(state=>({...state,pendingOpen:!state.pendingOpen}));
  if(action==='toggle-online'){store.set(state=>({...state,online:!state.online}));showToast(store.get().online?'已切換為線上':'已切換為離線');}
  if(action==='quick-drink'){
    const missing=store.get().cart.reduce((n,line)=>n+Math.max(0,line.drinkSlots-line.drinkAssignments.length),0);if(!missing){showToast('目前沒有待補飲品');return;}
    openDrinkPopover(button,{drinkId:button.dataset.id,maxQty:missing,onApply:(qty,selection)=>store.set(state=>{let left=qty;state.cart=state.cart.map(line=>{if(!left)return line;const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const take=Math.min(left,miss);left-=take;return take?{...line,drinkAssignments:line.drinkAssignments.concat(Array.from({length:take},()=>safeClone(selection)))}:line;});return state;})});
  }
  if(action==='clear-cart'&&confirm('清空後不可恢復，確定清空整張購物車？'))store.set(state=>({...state,cart:[]}));
  if(action==='toggle-card')store.set(state=>({...state,activeCard:state.activeCard===button.dataset.card?null:button.dataset.card}));
  if(action==='close-card')store.set(state=>({...state,activeCard:null}));
  if(action==='setting-card')updateSettings(settings=>{settings.catalog.defaultTemplate=button.dataset.value;settings.catalog.productOverrides={};});
  if(action==='toggle-code')updateSettings(settings=>{settings.catalog.showCode=!settings.catalog.showCode;});
  if(action==='merge-mode')updateSettings(settings=>{settings.cart.mergeMode=button.dataset.value;});
  if(action==='checkout'){if(missingCount(store.get().cart)){showToast('請先完成待補項目');return;}window.parent?.postMessage?.({type:'morefun:navigate',route:'checkout'},'*');}
}

queue.flush();
