/* More Fun SMT V16 — 5 Root Files Baseline
 * Source: locked V16 FINAL BASELINE.
 * Purpose: one-page-at-a-time development with one event source and no page folders.
 */
'use strict';

function createRenderQueue(renderFn){
  let scheduled=false;
  let rendering=false;
  let pending=false;
  const run=()=>{
    scheduled=false;
    if(rendering){pending=true;return;}
    rendering=true;
    try{renderFn();}catch(error){window.dispatchEvent(new CustomEvent('morefun:runtime-error',{detail:error}));}
    finally{rendering=false;if(pending){pending=false;schedule();}}
  };
  const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(run);};
  return {schedule,flush:run};
}

function createStore(initialState,{storageKey,normalize}={}){
  let state=normalize?normalize(initialState):structuredClone(initialState);
  const listeners=new Set();
  const get=()=>state;
  const persist=()=>{if(storageKey)localStorage.setItem(storageKey,JSON.stringify(state));};
  const set=updater=>{
    const next=typeof updater==='function'?updater(structuredClone(state)):updater;
    state=normalize?normalize(next):next;
    persist();
    listeners.forEach(fn=>fn(state));
  };
  const subscribe=fn=>{listeners.add(fn);return()=>listeners.delete(fn);};
  return {get,set,subscribe,persist};
}

function createOverlayManager(){
  let overlay=null;
  const close=()=>{overlay?.remove();overlay=null;};
  const open=({anchor,content,className='anchored-popover',onClose})=>{
    close();
    const scrim=document.createElement('button');
    scrim.className='overlay-scrim';
    scrim.setAttribute('aria-label','返回');
    const panel=document.createElement('section');
    panel.className=className;
    panel.innerHTML=content;
    document.body.append(scrim,panel);
    overlay={scrim,panel,remove(){scrim.remove();panel.remove();onClose?.();}};
    const position=()=>{
      const rect=anchor.getBoundingClientRect();
      const width=Math.min(420,Math.max(260,rect.width));
      panel.style.width=`${width}px`;
      const left=Math.max(12,Math.min(window.innerWidth-width-12,rect.left+(rect.width-width)/2));
      panel.style.left=`${left}px`;
      const top=Math.max(12,rect.top-panel.offsetHeight-10);
      panel.style.top=`${top}px`;
    };
    requestAnimationFrame(position);
    scrim.addEventListener('click',close,{once:true});
    return {panel,close,position};
  };
  return {open,close,get panel(){return overlay?.panel||null;}};
}

function installErrorBoundary({toast,report}={}){
  const handle=error=>{
    console.error('MORE_FUN_RUNTIME_ERROR',error);
    toast?.('操作未完成，資料已保留，請再試一次');
    report?.(error);
  };
  window.addEventListener('error',event=>{event.preventDefault();handle(event.error||event.message);});
  window.addEventListener('unhandledrejection',event=>{event.preventDefault();handle(event.reason);});
  return handle;
}

function createViewportFitter(stage,{width=1920,height=1080}={}){
  let raf=0,last='';
  const fit=()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      const scale=Math.min(1,innerWidth/width,innerHeight/height);
      const left=Math.max(0,(innerWidth-width*scale)/2);
      const top=Math.max(0,(innerHeight-height*scale)/2);
      const key=`${scale.toFixed(6)}|${left.toFixed(2)}|${top.toFixed(2)}`;
      if(key===last)return;last=key;
      stage.style.transform=`scale(${scale})`;
      stage.style.left=`${left}px`;stage.style.top=`${top}px`;
      stage.dataset.scale=scale.toFixed(6);
    });
  };
  addEventListener('resize',fit,{passive:true});
  addEventListener('orientationchange',fit,{passive:true});
  fit();
  return fit;
}


const ORDER_STORAGE_KEY='morefun:smt:v16:order';
const SETTINGS_STORAGE_KEY='morefun:smt:v16:settings';
const DRAFT_STORAGE_KEY='morefun:smt:v16:drafts';

function readJSON(key,fallback){
  try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}
}
function writeJSON(key,value){localStorage.setItem(key,JSON.stringify(value));}
function stableId(prefix='id'){return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;}


const money=value=>`$${Number(value||0).toFixed(0)}`;
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
function imageBlock(src,alt,className=''){
  return `<span class="image-shell ${className}"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy"><span class="image-fallback">餐點圖片</span></span>`;
}
function bindImageFallbacks(root=document){
  root.querySelectorAll('.image-shell img').forEach(img=>{
    const fallback=img.nextElementSibling;
    const fail=()=>{img.hidden=true;if(fallback)fallback.hidden=false;};
    if(fallback)fallback.hidden=true;
    img.addEventListener('error',fail,{once:true});
    if(img.complete&&!img.naturalWidth)fail();
  });
}
function toastHost(){return '<div id="toast" class="toast"></div>';}
function showToast(message){const node=document.getElementById('toast');if(!node)return;node.textContent=message;node.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>node.classList.remove('show'),1600);}


function navigate(route){if(parent&&parent!==window)parent.postMessage({type:'morefun:navigate',route},'*');else location.hash=`#/${route}`;}
function ready(){if(parent&&parent!==window)parent.postMessage({type:'morefun:page-ready',page:document.body.dataset.page||'unknown'},'*');}
document.addEventListener('DOMContentLoaded',ready,{once:true});window.MoreFunPageBridge={navigate,ready};


/* ----- V16 order page ----- */





const productMap=new Map(products.map((p,i)=>[p.id,{...p,menuOrder:i}]));
const drinkMap=new Map(drinks.map(d=>[d.id,d]));
const app=document.getElementById('app');
const overlay=createOverlayManager();
const savedSettings=readJSON(SETTINGS_STORAGE_KEY,{});
const settings={...defaults,...savedSettings,catalog:{...defaults.catalog,...savedSettings.catalog},cart:{...defaults.cart,...savedSettings.cart},quickDrinks:{...defaults.quickDrinks,...savedSettings.quickDrinks}};

const initialCart=readJSON(ORDER_STORAGE_KEY,null)?.cart||[
  makeLine('f4',2,{},{},0),makeLine('a1',2,{},[],2),makeLine('b1',3,{rice:'肉燥飯'},[drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea'),drinkSelection('taiwan-milk-tea')],3)
];
const store=createStore({category:'全部',cart:normalizeCart(initialCart),settings,activeCard:null,pendingOrders:8},{storageKey:ORDER_STORAGE_KEY,normalize:s=>({...s,cart:normalizeCart(s.cart||[])})});
const queue=createRenderQueue(render);
store.subscribe(()=>queue.schedule());
installErrorBoundary({toast:showToast,report:error=>parent?.postMessage?.({type:'morefun:page-runtime-error',page:'order',message:String(error?.message||error)},'*')});

function drinkSelection(id,sweetness='正常甜',ice='正常冰'){const d=drinkMap.get(id);return {drinkId:id,name:d?.name||id,unitPrice:d?.price||0,sweetness,ice};}
function makeLine(productId,qty=1,options={},drinkAssignments=[],drinkSlots){const p=productMap.get(productId);return {lineId:stableId('line'),productId,qty,unitPrice:p.price,total:p.price*qty,options,drinkAssignments,drinkSlots:drinkSlots??(p.drinkSlots||0)*qty,createdOrder:Date.now()+Math.random(),name:p.name,image:p.image,required:p.required,combinable:p.combinable||false};}
function normalizeCart(cart){return cart.map((line,index)=>{const p=productMap.get(line.productId)||{};const qty=Math.max(1,Number(line.qty)||1);return {...line,lineId:line.lineId||stableId('line'),name:line.name||p.name||'餐點',image:line.image||p.image||'',qty,unitPrice:Number(line.unitPrice??p.price??0),total:Number(line.unitPrice??p.price??0)*qty,options:{...(line.options||{})},drinkAssignments:Array.isArray(line.drinkAssignments)?line.drinkAssignments:[],drinkSlots:Number(line.drinkSlots??(p.drinkSlots||0)*qty),required:Array.isArray(line.required)?line.required:(p.required||[]),createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:(Number.isFinite(line._stableOrder)?line._stableOrder:index)}}).sort((a,b)=>a.createdOrder-b.createdOrder);}
function configKey(line){return JSON.stringify({productId:line.productId,options:line.options,drinks:line.drinkAssignments.map(d=>[d.drinkId,d.sweetness,d.ice])});}
function mergeCart(cart,mode=store.get().settings.cart.mergeMode){if(mode==='never')return normalizeCart(cart);const out=[];for(const line of normalizeCart(cart)){const target=out.find(x=>x.productId===line.productId&&(mode==='always'||configKey(x)===configKey(line)));if(!target){out.push(structuredClone(line));continue;}target.qty+=line.qty;target.total=target.unitPrice*target.qty;target.drinkSlots+=line.drinkSlots;target.drinkAssignments.push(...line.drinkAssignments);}return out;}
function describe(line){const parts=Object.values(line.options||{}).filter(Boolean);const grouped=new Map();for(const d of line.drinkAssignments||[]){const k=[d.name,d.sweetness||'正常甜',d.ice||'正常冰'].join('|');grouped.set(k,(grouped.get(k)||0)+1);}for(const [k,n] of grouped){const [name,sweet,ice]=k.split('|');const mods=[sweet,ice].filter(x=>!x.startsWith('正常')).join(' · ');parts.push(`${name}${mods?` · ${mods}`:''}${n>1?` ×${n}`:''}`);}const miss=Math.max(0,line.drinkSlots-line.drinkAssignments.length);if(miss)parts.push(`尚欠飲品 ${miss} 份`);return parts.join(' · ')||'標準';}
function missingCount(cart){return cart.reduce((sum,line)=>sum+line.required.reduce((n,g)=>g==='drink'?n+Math.max(0,line.drinkSlots-line.drinkAssignments.length):n+(line.options[g]?0:1),0),0);}
function missingDrinkSlots(cart){return cart.reduce((n,l)=>n+Math.max(0,l.drinkSlots-l.drinkAssignments.length),0);}

function cardTemplate(product){return store.get().settings.catalog.productOverrides?.[product.id]||store.get().settings.catalog.defaultTemplate;}
function productCard(p){const template=cardTemplate(p);const code=store.get().settings.catalog.showCode?`<small class="product-code">${p.code}</small>`:'';const desc=store.get().settings.catalog.showDescription&&p.description?`<p>${p.description}</p>`:'';if(template==='text')return `<button class="product-card text" data-action="add" data-id="${p.id}"><span>${code}<strong>${p.name}</strong>${desc}</span><b>${money(p.price)}</b></button>`;if(template==='small')return `<button class="product-card small" data-action="add" data-id="${p.id}">${imageBlock(p.image,p.name,'product-thumb')}<span>${code}<strong>${p.name}</strong>${desc}</span><b>${money(p.price)}</b></button>`;return `<button class="product-card large" data-action="add" data-id="${p.id}">${imageBlock(p.image,p.name,'product-hero')}<div class="product-info"><span>${code}<strong>${p.name}</strong>${desc}</span><b>${money(p.price)}</b></div></button>`;}
function cartRows(){return store.get().cart.map((line,index)=>`<button class="cart-row" data-action="edit-line" data-id="${line.lineId}"><span class="seq">${index+1}</span>${imageBlock(line.image,line.name,'cart-img')}<span><strong>${line.name}</strong><small>${describe(line)}</small></span><b>x${line.qty}<br>${money(line.total)}</b></button>`).join('')||'<div class="empty">購物車未有餐點</div>';}
function quickDrinks(){const order=store.get().settings.quickDrinks.order||drinks.map(d=>d.id);return order.map(id=>drinkMap.get(id)).filter(Boolean).map(d=>`<button class="quick-drink" data-action="quick-drink" data-id="${d.id}">${store.get().settings.quickDrinks.showImages?imageBlock(d.image,d.name,'quick-img'):''}<span>${d.name}</span></button>`).join('');}
function topbar(){const s=store.get();return `<header class="topbar"><div class="brand">磨飯 SMT</div><div class="serial"><small>流水號</small><strong>10248</strong></div><div class="spacer"></div><button class="top-btn ${s.activeCard==='pending'?'active':''}" data-action="toggle-card" data-card="pending">待處理 <span class="badge">${s.pendingOrders}</span></button><button class="top-btn ${s.activeCard==='settings'?'active':''}" data-action="toggle-card" data-card="settings">顯示設定</button><button class="top-btn">● 線上</button></header>`;}
function sideCard(){const s=store.get();if(s.activeCard==='settings')return `<aside class="side-card"><header><strong>顯示設定</strong><button class="close" data-action="close-card">×</button></header><div class="setting"><label>產品卡預設</label><div class="chips">${['large','small','text'].map(v=>`<button data-action="setting-card" data-value="${v}" class="${s.settings.catalog.defaultTemplate===v?'active':''}">${v==='large'?'大圖':v==='small'?'小圖':'純文字'}</button>`).join('')}</div></div><div class="setting"><label><input type="checkbox" data-action="toggle-code" ${s.settings.catalog.showCode?'checked':''}> 顯示產品代碼</label></div><div class="setting"><label>購物籃合拼</label><div class="chips">${[['always','永遠'],['same_config','相同設定'],['never','不合拼']].map(([v,t])=>`<button data-action="merge-mode" data-value="${v}" class="${s.settings.cart.mergeMode===v?'active':''}">${t}</button>`).join('')}</div></div></aside>`;if(s.activeCard==='pending')return `<aside class="side-card"><header><strong>待處理</strong><button class="close" data-action="close-card">×</button></header><p>磨飯App 5 張</p><p>電話／WhatsApp 3 張</p></aside>`;return '';}
function render(){const s=store.get();const pending=missingCount(s.cart);const visible=products.filter(p=>s.category==='全部'||(s.category==='人氣推薦'&&p.id==='f4')||p.category===s.category);app.innerHTML=`<div class="app">${topbar()}<main class="workspace"><section class="order-grid"><aside class="cart panel"><header><h2>購物車（${s.cart.reduce((n,l)=>n+l.qty,0)}）</h2><button class="btn" data-action="clear-cart" ${s.cart.length?'':'disabled'}>清空</button></header><div class="cart-list">${cartRows()}</div><footer><button class="btn" data-action="pending-zone">待補區 ${pending?`<span class="badge">${pending}</span>`:'0'}</button><button class="btn primary" data-action="checkout" ${s.cart.length?'':'disabled'}>${pending?'先整理':`結帳 ${money(s.cart.reduce((n,l)=>n+l.total,0))}`}</button></footer></aside><section class="catalog panel"><div class="categories">${categories.map(c=>`<button data-action="category" data-value="${c}" class="${s.category===c?'active':''}">${c}</button>`).join('')}</div><div class="products">${visible.map(productCard).join('')}</div><div class="quick-strip"><strong>快捷飲品</strong><div>${quickDrinks()}</div></div></section>${sideCard()}</section></main><nav class="bottom-nav"><button class="active">點單</button><button>訂單</button><button>堂食</button><button>售罄</button><button>更多</button></nav></div><div id="toast" class="toast"></div>`;bindImageFallbacks(app);bind();}
function bind(){app.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',event=>handle(event,btn)));}
function updateSettings(mutator){store.set(s=>{mutator(s.settings);writeJSON(SETTINGS_STORAGE_KEY,s.settings);s.cart=mergeCart(s.cart,s.settings.cart.mergeMode);return s;});}
function addProduct(id){const p=productMap.get(id);if(!p)return;const line=makeLine(id);store.set(s=>{s.cart=mergeCart([...s.cart,line],s.settings.cart.mergeMode);return s;});showToast('已加入購物車');}
function openDrinkPopover(anchor,{lineId=null,drinkId,quantity=1,maxQuantity=1,onApply}){const d=drinkMap.get(drinkId);let qty=Math.min(quantity,maxQuantity),sweet='正常甜',ice='正常冰';const draw=panel=>{panel.innerHTML=`<header><strong>${d.name}</strong><button class="close" data-close>×</button></header>${maxQuantity>1?`<label>修改份數</label><div class="stepper"><button data-minus ${qty<=1?'disabled':''}>−</button><strong>${qty}</strong><button data-plus ${qty>=maxQuantity?'disabled':''}>＋</button></div>`:''}${d.sweet?`<label>甜度</label><div class="chips">${optionSets.sweetness.map(v=>`<button data-sweet="${v}" class="${sweet===v?'active':''}">${v}</button>`).join('')}</div>`:''}${d.ice?`<label>冰量</label><div class="chips">${optionSets.ice.map(v=>`<button data-ice="${v}" class="${ice===v?'active':''}">${v}</button>`).join('')}</div>`:''}<button class="btn primary apply" data-apply>套用 ${qty} 份</button>`;panel.querySelector('[data-close]').onclick=overlay.close;panel.querySelector('[data-minus]')?.addEventListener('click',()=>{qty=Math.max(1,qty-1);draw(panel);});panel.querySelector('[data-plus]')?.addEventListener('click',()=>{qty=Math.min(maxQuantity,qty+1);draw(panel);});panel.querySelectorAll('[data-sweet]').forEach(b=>b.onclick=()=>{sweet=b.dataset.sweet;draw(panel);});panel.querySelectorAll('[data-ice]').forEach(b=>b.onclick=()=>{ice=b.dataset.ice;draw(panel);});panel.querySelector('[data-apply]').onclick=()=>{onApply?.({qty,selection:drinkSelection(drinkId,sweet,ice),lineId});overlay.close();};};const opened=overlay.open({anchor,content:'',onClose:()=>{}});draw(opened.panel);}
function openOptionPopover(anchor,line,group){let qty=1,value=line.options[group]||'';const values=optionSets[group];const opened=overlay.open({anchor,content:''});const draw=()=>{opened.panel.innerHTML=`<header><strong>${group==='rice'?'飯底':group==='sauce'?'醬汁':'小食'}</strong><button class="close" data-close>×</button></header>${line.qty>1?`<label>修改份數</label><div class="stepper"><button data-minus ${qty<=1?'disabled':''}>−</button><strong>${qty}</strong><button data-plus ${qty>=line.qty?'disabled':''}>＋</button></div>`:''}<div class="chips">${values.map(v=>`<button data-value="${v}" class="${value===v?'active':''}">${v}</button>`).join('')}</div><button class="btn primary apply" data-apply ${value?'':'disabled'}>套用 ${qty} 份</button>`;opened.panel.querySelector('[data-close]').onclick=overlay.close;opened.panel.querySelector('[data-minus]')?.addEventListener('click',()=>{qty--;draw();});opened.panel.querySelector('[data-plus]')?.addEventListener('click',()=>{qty++;draw();});opened.panel.querySelectorAll('[data-value]').forEach(b=>b.onclick=()=>{value=b.dataset.value;draw();});opened.panel.querySelector('[data-apply]').onclick=()=>{applyPartialEdit(line.lineId,qty,{options:{[group]:value}});overlay.close();};};draw();}
function applyPartialEdit(lineId,qty,patch){store.set(s=>{const index=s.cart.findIndex(l=>l.lineId===lineId);if(index<0)return s;const original=s.cart[index];const applyQty=Math.min(original.qty,qty);const edited={...structuredClone(original),lineId:applyQty===original.qty?original.lineId:stableId('line'),qty:applyQty,total:original.unitPrice*applyQty,options:{...original.options,...(patch.options||{})},createdOrder:original.createdOrder};if(patch.drink){const slots=Math.round(original.drinkSlots/original.qty*applyQty);edited.drinkSlots=slots;edited.drinkAssignments=Array.from({length:slots},()=>structuredClone(patch.drink));}const rows=[edited];if(applyQty<original.qty)rows.push({...structuredClone(original),qty:original.qty-applyQty,total:original.unitPrice*(original.qty-applyQty),createdOrder:original.createdOrder+.001});s.cart=normalizeCart([...s.cart.slice(0,index),...rows,...s.cart.slice(index+1)]);return s;});showToast('修改已套用');}
function openEditCard(lineId){const line=store.get().cart.find(l=>l.lineId===lineId);if(!line)return;const card=document.createElement('aside');card.className='edit-card';card.innerHTML=`<header><div><strong>修改卡｜${line.name}</strong><small>${line.qty} 份</small></div><button class="close">×</button></header><div class="edit-body">${line.required.includes('rice')?`<button data-group="rice">飯底 <span>${line.options.rice||'未選'}</span></button>`:''}${line.required.includes('sauce')?`<button data-group="sauce">醬汁 <span>${line.options.sauce||'未選'}</span></button>`:''}${line.required.includes('snack')?`<button data-group="snack">小食 <span>${line.options.snack||'未選'}</span></button>`:''}${line.required.includes('drink')?`<div class="edit-drinks">${drinks.map(d=>`<button data-drink="${d.id}">${imageBlock(d.image,d.name,'edit-drink-img')}<span>${d.name}</span></button>`).join('')}</div>`:''}<p>${describe(line)}</p></div>`;document.querySelector('.order-grid').appendChild(card);bindImageFallbacks(card);card.querySelector('.close').onclick=()=>card.remove();card.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>openOptionPopover(b,line,b.dataset.group));card.querySelectorAll('[data-drink]').forEach(b=>b.onclick=()=>openDrinkPopover(b,{lineId,drinkId:b.dataset.drink,maxQuantity:line.qty,onApply:({qty,selection})=>applyPartialEdit(lineId,qty,{drink:selection})}));}
function handle(event,btn){const a=btn.dataset.action;if(a==='category')store.set(s=>({...s,category:btn.dataset.value}));if(a==='add')addProduct(btn.dataset.id);if(a==='edit-line')openEditCard(btn.dataset.id);if(a==='quick-drink'){const slots=missingDrinkSlots(store.get().cart);if(!slots)return showToast('目前沒有待補飲品');openDrinkPopover(btn,{drinkId:btn.dataset.id,maxQuantity:slots,onApply:({qty,selection})=>{store.set(s=>{let left=qty;s.cart=s.cart.map(line=>{if(!left)return line;const missing=Math.max(0,line.drinkSlots-line.drinkAssignments.length);const take=Math.min(left,missing);left-=take;return take?{...line,drinkAssignments:[...line.drinkAssignments,...Array.from({length:take},()=>structuredClone(selection))]}:line;});return s;});}});}if(a==='clear-cart'){if(confirm('清空後不可恢復，確定清空整張購物車？'))store.set(s=>({...s,cart:[]}));}if(a==='toggle-card')store.set(s=>({...s,activeCard:s.activeCard===btn.dataset.card?null:btn.dataset.card}));if(a==='close-card')store.set(s=>({...s,activeCard:null}));if(a==='setting-card')updateSettings(x=>x.catalog.defaultTemplate=btn.dataset.value);if(a==='toggle-code')updateSettings(x=>x.catalog.showCode=!x.catalog.showCode);if(a==='merge-mode')updateSettings(x=>x.cart.mergeMode=btn.dataset.value);if(a==='checkout'){if(missingCount(store.get().cart))showToast('請先完成待補項目');else parent?.postMessage?.({type:'morefun:navigate',route:'checkout'},'*');}}

queue.flush();


/* ----- Single-app shell ----- */
(function bootMoreFunSMT() {
  const DESIGN_WIDTH = 1920;
  const DESIGN_HEIGHT = 1080;
  const stage = document.getElementById('smt-stage');
  const gate = document.getElementById('orientation-gate');

  function isLandscape() {
    return window.innerWidth > window.innerHeight;
  }

  function fitStage() {
    const landscape = isLandscape();
    document.documentElement.classList.toggle('is-portrait', !landscape);
    gate.hidden = landscape;
    stage.hidden = !landscape;
    if (!landscape) return;

    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const scale = Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT);
    stage.style.width = DESIGN_WIDTH + 'px';
    stage.style.height = DESIGN_HEIGHT + 'px';
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  let orientationTimer = null;
  window.addEventListener('orientationchange', () => {
    clearTimeout(orientationTimer);
    orientationTimer = setTimeout(fitStage, 220);
  }, { passive: true });
  window.addEventListener('pageshow', fitStage, { passive: true });

  fitStage();

  // V16 page.js is preserved as the functional source.
  // Most builds self-start; expose a fallback hook for manual diagnostics.
  window.MoreFunSMT = window.MoreFunSMT || {};
  window.MoreFunSMT.fitStage = fitStage;
})();
