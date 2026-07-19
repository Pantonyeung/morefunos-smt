import {createRenderQueue,createStore,createOverlayManager,installErrorBoundary,safeClone} from '../../shared/runtime.js';
import {ORDER_STORAGE_KEY,SETTINGS_STORAGE_KEY,readJSON,writeJSON,stableId} from '../../shared/store.js';
import {money,imageBlock,bindImageFallbacks,showToast} from '../../shared/components.js';
import {orderPageConfig as defaults} from './page-config.js';
import {categories,products,drinks,optionSets} from './page-data.js';

const app=document.getElementById('app');
const productMap=new Map(products.map(function(item){return [item.id,item];}));
const drinkMap=new Map(drinks.map(function(item){return [item.id,item];}));
const overlay=createOverlayManager();

function makeLine(productId,qty,options,drinkAssignments,drinkSlots){
  const product=productMap.get(productId);
  qty=Math.max(1,Number(qty)||1);
  return {
    lineId:stableId('line'),productId:productId,name:product.name,image:product.image,
    qty:qty,unitPrice:product.price,total:product.price*qty,options:options||{},
    drinkAssignments:Array.isArray(drinkAssignments)?drinkAssignments:[],
    drinkSlots:drinkSlots==null?(product.drinkSlots||0)*qty:Number(drinkSlots),
    required:Array.isArray(product.required)?product.required:[],
    combinable:Boolean(product.combinable),createdOrder:Date.now()+Math.random()
  };
}
function drinkSelection(id,sweetness,ice){
  const drink=drinkMap.get(id);
  return {drinkId:id,name:drink?drink.name:id,unitPrice:drink?drink.price:0,sweetness:sweetness||'正常甜',ice:ice||'正常冰'};
}
function normalizeCart(cart){
  return (Array.isArray(cart)?cart:[]).map(function(line,index){
    const product=productMap.get(line.productId)||{};
    const qty=Math.max(1,Number(line.qty)||1);
    return Object.assign({},line,{
      lineId:line.lineId||stableId('line'),name:line.name||product.name||'餐點',image:line.image||product.image||'',
      qty:qty,unitPrice:Number(line.unitPrice==null?product.price||0:line.unitPrice),
      total:Number(line.unitPrice==null?product.price||0:line.unitPrice)*qty,
      options:Object.assign({},line.options||{}),drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],
      drinkSlots:Number(line.drinkSlots==null?(product.drinkSlots||0)*qty:line.drinkSlots),
      required:Array.isArray(line.required)?line.required:(product.required||[]),
      createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:index
    });
  }).sort(function(a,b){return a.createdOrder-b.createdOrder;});
}
function mergeKey(line){
  return JSON.stringify({productId:line.productId,options:line.options,drinks:line.drinkAssignments.map(function(d){return [d.drinkId,d.sweetness,d.ice];})});
}
function mergeCart(cart,mode){
  const rows=normalizeCart(cart);
  if(mode==='never')return rows;
  const out=[];
  rows.forEach(function(line){
    const found=out.find(function(item){return item.productId===line.productId&&(mode==='always'||mergeKey(item)===mergeKey(line));});
    if(!found){out.push(safeClone(line));return;}
    found.qty+=line.qty;found.total=found.unitPrice*found.qty;found.drinkSlots+=line.drinkSlots;
    found.drinkAssignments=found.drinkAssignments.concat(safeClone(line.drinkAssignments));
  });
  return out;
}
function describe(line){
  const parts=Object.values(line.options||{}).filter(Boolean);
  const groups={};
  (line.drinkAssignments||[]).forEach(function(d){
    const key=[d.name,d.sweetness||'正常甜',d.ice||'正常冰'].join('|');groups[key]=(groups[key]||0)+1;
  });
  Object.keys(groups).forEach(function(key){
    const values=key.split('|');const mods=[values[1],values[2]].filter(function(x){return x.indexOf('正常')!==0;}).join(' · ');
    parts.push(values[0]+(mods?' · '+mods:'')+(groups[key]>1?' ×'+groups[key]:''));
  });
  const missing=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
  if(missing)parts.push('尚欠飲品 '+missing+' 份');
  return parts.join(' · ')||'標準';
}
function missingCount(cart){
  return cart.reduce(function(sum,line){
    let count=Math.max(0,Number(line.drinkSlots||0)-(line.drinkAssignments||[]).length);
    (line.required||[]).forEach(function(group){if(group!=='drink'&&!line.options[group])count+=1;});
    return sum+count;
  },0);
}

const saved=readJSON(ORDER_STORAGE_KEY,null);
const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
const settings={
  catalog:Object.assign({},defaults.catalog,savedSettings.catalog||{}),
  cart:Object.assign({},defaults.cart,savedSettings.cart||{}),
  quickDrinks:Object.assign({},defaults.quickDrinks,savedSettings.quickDrinks||{})
};
const initialCart=saved&&Array.isArray(saved.cart)?saved.cart:[
  makeLine('f4',2,{},[],0),makeLine('a1',2,{},[],2),
  makeLine('b1',3,{rice:'肉燥飯'},[drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea')],3)
];
const store=createStore({category:'全部',cart:normalizeCart(initialCart),settings:settings,activeCard:null},{
  storageKey:ORDER_STORAGE_KEY,normalize:function(state){state.cart=normalizeCart(state.cart||[]);return state;}
});
const queue=createRenderQueue(render);
store.subscribe(function(){queue.schedule();});
installErrorBoundary({toast:showToast,report:function(error){
  if(window.parent&&window.parent!==window)window.parent.postMessage({type:'morefun:page-runtime-error',page:'order',message:String(error&&error.message||error)},'*');
}});

function productTemplate(product){
  return store.get().settings.catalog.productOverrides[product.id]||store.get().settings.catalog.defaultTemplate;
}
function productCard(product){
  const template=productTemplate(product);
  const showCode=store.get().settings.catalog.showCode;
  const showDescription=store.get().settings.catalog.showDescription;
  const code=showCode?'<small class="product-code">'+product.code+'</small>':'';
  const description=showDescription&&product.description?'<p>'+product.description+'</p>':'';
  if(template==='text')return '<button class="product-card text" data-action="add" data-id="'+product.id+'"><span>'+code+'<strong>'+product.name+'</strong>'+description+'</span><b>'+money(product.price)+'</b></button>';
  if(template==='small')return '<button class="product-card small" data-action="add" data-id="'+product.id+'">'+imageBlock(product.image,product.name,'product-thumb')+'<span>'+code+'<strong>'+product.name+'</strong>'+description+'</span><b>'+money(product.price)+'</b></button>';
  return '<button class="product-card large" data-action="add" data-id="'+product.id+'">'+imageBlock(product.image,product.name,'product-hero')+'<div class="product-info"><span>'+code+'<strong>'+product.name+'</strong>'+description+'</span><b>'+money(product.price)+'</b></div></button>';
}
function cartRows(){
  const cart=store.get().cart;
  if(!cart.length)return '<div class="empty">購物車未有餐點</div>';
  return cart.map(function(line,index){
    return '<button class="cart-row" data-action="edit-line" data-id="'+line.lineId+'"><span class="seq">'+(index+1)+'</span>'+imageBlock(line.image,line.name,'cart-img')+'<span><strong>'+line.name+'</strong><small>'+describe(line)+'</small></span><b>x'+line.qty+'<br>'+money(line.total)+'</b></button>';
  }).join('');
}
function quickDrinks(){
  const order=store.get().settings.quickDrinks.order||drinks.map(function(d){return d.id;});
  return order.map(function(id){return drinkMap.get(id);}).filter(Boolean).map(function(drink){
    return '<button class="quick-drink" data-action="quick-drink" data-id="'+drink.id+'">'+(store.get().settings.quickDrinks.showImages?imageBlock(drink.image,drink.name,'quick-img'):'')+'<span>'+drink.name+'</span></button>';
  }).join('');
}
function topbar(){
  const s=store.get();
  return '<header class="topbar"><div class="brand">磨飯 SMT</div><div class="serial"><small>流水號</small><strong>10248</strong></div><div class="spacer"></div><button class="top-btn" data-action="toggle-card" data-card="pending">待處理 <span class="badge">8</span></button><button class="top-btn '+(s.activeCard==='settings'?'active':'')+'" data-action="toggle-card" data-card="settings">顯示設定</button><button class="top-btn">● 線上</button></header>';
}
function sideCard(){
  const s=store.get();
  if(s.activeCard==='settings'){
    const template=s.settings.catalog.defaultTemplate;
    const merge=s.settings.cart.mergeMode;
    return '<aside class="side-card"><header><strong>顯示設定</strong><button class="close" data-action="close-card">×</button></header><div class="setting"><label>產品卡樣式</label><div class="chips">'+['large','small','text'].map(function(v){return '<button data-action="setting-card" data-value="'+v+'" class="'+(template===v?'active':'')+'">'+(v==='large'?'大圖':v==='small'?'小圖':'純文字')+'</button>';}).join('')+'</div></div><div class="setting"><label><input type="checkbox" data-action="toggle-code" '+(s.settings.catalog.showCode?'checked':'')+'> 顯示產品代碼</label></div><div class="setting"><label>購物籃合併方式</label><div class="chips">'+['always','same_config','never'].map(function(v){return '<button data-action="merge-mode" data-value="'+v+'" class="'+(merge===v?'active':'')+'">'+(v==='always'?'永遠合併':v==='same_config'?'相同設定合併':'不合併')+'</button>';}).join('')+'</div></div></aside>';
  }
  if(s.activeCard==='pending')return '<aside class="side-card"><header><strong>待處理</strong><button class="close" data-action="close-card">×</button></header><div class="setting">磨飯 App <span class="badge">5</span></div><div class="setting">電話／WhatsApp 核對 <span class="badge">3</span></div></aside>';
  return '';
}
function render(){
  const s=store.get();
  const filtered=products.filter(function(p){return s.category==='全部'||p.category===s.category||(s.category==='人氣推薦'&&p.tag);});
  const total=s.cart.reduce(function(n,line){return n+line.total;},0);
  app.innerHTML='<div class="app">'+topbar()+'<main class="workspace"><section class="order-grid"><aside class="cart panel"><header><h2>購物車（'+s.cart.reduce(function(n,l){return n+l.qty;},0)+'）</h2><button class="btn" data-action="clear-cart" '+(s.cart.length?'':'disabled')+'>清空</button></header><div class="cart-list">'+cartRows()+'</div><footer><button class="btn">暫存</button><button class="btn primary" data-action="checkout">'+(missingCount(s.cart)?'先整理':'結帳 '+money(total))+'</button></footer></aside><section class="catalog panel"><div class="categories">'+categories.map(function(c){return '<button data-action="category" data-value="'+c+'" class="'+(s.category===c?'active':'')+'">'+c+'</button>';}).join('')+'</div><div class="products">'+filtered.map(productCard).join('')+'</div><div class="quick-strip"><strong>快捷飲品</strong><div>'+quickDrinks()+'</div></div></section>'+sideCard()+'</section></main><nav class="bottom-nav"><button class="active">點單</button><button>訂單</button><button>堂食</button><button>售罄</button><button>更多</button></nav></div><div id="toast" class="toast"></div>';
  bindImageFallbacks(app);bind();
}
function bind(){app.querySelectorAll('[data-action]').forEach(function(button){button.addEventListener('click',function(event){handle(event,button);});});}
function updateSettings(mutator){
  store.set(function(s){mutator(s.settings);writeJSON(SETTINGS_STORAGE_KEY,s.settings);s.cart=mergeCart(s.cart,s.settings.cart.mergeMode);return s;});
}
function addProduct(id){
  const product=productMap.get(id);if(!product)return;
  const line=makeLine(id,1,{},[],(product.drinkSlots||0));
  store.set(function(s){s.cart=mergeCart(s.cart.concat([line]),s.settings.cart.mergeMode);return s;});
  showToast('已加入購物車');
}
function openDrinkPopover(anchor,options){
  const drink=drinkMap.get(options.drinkId);let qty=1;let sweet='正常甜';let ice='正常冰';
  const opened=overlay.open({anchor:anchor,content:''});
  function draw(){
    opened.panel.innerHTML='<header><strong>'+drink.name+'</strong><button class="close" data-close>×</button></header>'+(options.maxQty>1?'<label>修改份數</label><div class="stepper"><button data-minus '+(qty<=1?'disabled':'')+'>−</button><strong>'+qty+'</strong><button data-plus '+(qty>=options.maxQty?'disabled':'')+'>＋</button></div>':'')+(drink.sweet?'<label>甜度</label><div class="chips">'+optionSets.sweetness.map(function(v){return '<button data-sweet="'+v+'" class="'+(sweet===v?'active':'')+'">'+v+'</button>';}).join('')+'</div>':'')+(drink.ice?'<label>冰量</label><div class="chips">'+optionSets.ice.map(function(v){return '<button data-ice="'+v+'" class="'+(ice===v?'active':'')+'">'+v+'</button>';}).join('')+'</div>':'')+'<button class="btn primary apply" data-apply>套用 '+qty+' 份</button>';
    opened.panel.querySelector('[data-close]').onclick=overlay.close;
    const minus=opened.panel.querySelector('[data-minus]');if(minus)minus.onclick=function(){qty=Math.max(1,qty-1);draw();};
    const plus=opened.panel.querySelector('[data-plus]');if(plus)plus.onclick=function(){qty=Math.min(options.maxQty,qty+1);draw();};
    opened.panel.querySelectorAll('[data-sweet]').forEach(function(b){b.onclick=function(){sweet=b.dataset.sweet;draw();};});
    opened.panel.querySelectorAll('[data-ice]').forEach(function(b){b.onclick=function(){ice=b.dataset.ice;draw();};});
    opened.panel.querySelector('[data-apply]').onclick=function(){options.onApply(qty,drinkSelection(drink.id,sweet,ice));overlay.close();};
    opened.position();
  }
  draw();
}
function openEditCard(lineId){
  const old=document.querySelector('.edit-card');if(old)old.remove();
  const line=store.get().cart.find(function(l){return l.lineId===lineId;});if(!line)return;
  const card=document.createElement('aside');card.className='edit-card';
  card.innerHTML='<header><div><strong>修改卡｜'+line.name+'</strong><small>'+line.qty+' 份</small></div><button class="close">×</button></header><div class="edit-body">'+(line.required.indexOf('rice')>=0?'<button data-group="rice">飯底 <span>'+(line.options.rice||'未選')+'</span></button>':'')+(line.required.indexOf('sauce')>=0?'<button data-group="sauce">醬汁 <span>'+(line.options.sauce||'未選')+'</span></button>':'')+(line.required.indexOf('snack')>=0?'<button data-group="snack">小食 <span>'+(line.options.snack||'未選')+'</span></button>':'')+(line.required.indexOf('drink')>=0?'<div class="edit-drinks">'+drinks.map(function(d){return '<button data-drink="'+d.id+'">'+imageBlock(d.image,d.name,'edit-drink-img')+'<span>'+d.name+'</span></button>';}).join('')+'</div>':'')+'<p>'+describe(line)+'</p></div>';
  document.querySelector('.order-grid').appendChild(card);bindImageFallbacks(card);
  card.querySelector('.close').onclick=function(){card.remove();};
  card.querySelectorAll('[data-drink]').forEach(function(b){b.onclick=function(){openDrinkPopover(b,{drinkId:b.dataset.drink,maxQty:line.qty,onApply:function(qty,selection){
    store.set(function(s){const index=s.cart.findIndex(function(l){return l.lineId===lineId;});if(index<0)return s;const original=s.cart[index];const edited=safeClone(original);edited.lineId=qty===original.qty?original.lineId:stableId('line');edited.qty=qty;edited.total=edited.unitPrice*qty;edited.drinkSlots=Math.round((original.drinkSlots/original.qty)*qty);edited.drinkAssignments=Array.from({length:edited.drinkSlots},function(){return safeClone(selection);});const replacement=[edited];if(qty<original.qty)replacement.push(Object.assign({},safeClone(original),{qty:original.qty-qty,total:original.unitPrice*(original.qty-qty),createdOrder:original.createdOrder+0.001}));s.cart=normalizeCart(s.cart.slice(0,index).concat(replacement,s.cart.slice(index+1)));return s;});card.remove();
  }});};});
}
function handle(event,button){
  const action=button.dataset.action;
  if(action==='category')store.set(function(s){s.category=button.dataset.value;return s;});
  if(action==='add')addProduct(button.dataset.id);
  if(action==='edit-line')openEditCard(button.dataset.id);
  if(action==='quick-drink'){
    const missing=store.get().cart.reduce(function(n,l){return n+Math.max(0,l.drinkSlots-l.drinkAssignments.length);},0);
    if(!missing){showToast('目前沒有待補飲品');return;}
    openDrinkPopover(button,{drinkId:button.dataset.id,maxQty:missing,onApply:function(qty,selection){store.set(function(s){let left=qty;s.cart=s.cart.map(function(line){if(!left)return line;const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const take=Math.min(left,miss);left-=take;return take?Object.assign({},line,{drinkAssignments:line.drinkAssignments.concat(Array.from({length:take},function(){return safeClone(selection);}))}):line;});return s;});}});
  }
  if(action==='clear-cart'&&window.confirm('清空後不可恢復，確定清空整張購物車？'))store.set(function(s){s.cart=[];return s;});
  if(action==='toggle-card')store.set(function(s){s.activeCard=s.activeCard===button.dataset.card?null:button.dataset.card;return s;});
  if(action==='close-card')store.set(function(s){s.activeCard=null;return s;});
  if(action==='setting-card')updateSettings(function(x){x.catalog.defaultTemplate=button.dataset.value;});
  if(action==='toggle-code')updateSettings(function(x){x.catalog.showCode=!x.catalog.showCode;});
  if(action==='merge-mode')updateSettings(function(x){x.cart.mergeMode=button.dataset.value;});
  if(action==='checkout'){
    if(missingCount(store.get().cart)){showToast('請先完成待補項目');return;}
    if(window.parent&&window.parent!==window)window.parent.postMessage({type:'morefun:navigate',route:'checkout'},'*');
  }
}

queue.flush();
