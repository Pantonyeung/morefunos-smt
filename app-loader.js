const stage=document.getElementById('stage');
const frame=document.getElementById('page');
const hud=document.getElementById('device-hud');
const hudDetail=document.getElementById('device-hud-detail');

const routes={
  order:'pages/order/index.html',
  checkout:'pages/checkout/index.html',
  orders:'pages/orders/index.html',
  dine:'pages/dine/index.html',
  soldout:'pages/soldout/index.html',
  more:'pages/more/index.html'
};
const BUILD='smt-t2s-1280x800-rebuild.41';
const TARGET_WIDTH=1280;
const TARGET_HEIGHT=800;
let current='';
let childReady=false;
let loadTimer=0;
let watchdogTimer=0;
let loadSeq=0;

const checkoutReplicaCss=`
body[data-page="checkout"] .app{width:1280px!important;height:800px!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;background:#f7f5f1!important;color:#1f1b18!important}
body[data-page="checkout"] .statusbar{height:58px!important;min-height:58px!important;display:flex!important;align-items:center!important;gap:16px!important;padding:0 18px!important;background:#fff!important;border-bottom:1px solid #e8e0d9!important;box-shadow:0 1px 0 rgba(0,0,0,.025)!important}
body[data-page="checkout"] .statusbar .brand{font-size:24px!important;font-weight:950!important;color:#ef4b16!important;white-space:nowrap!important}
body[data-page="checkout"] .status-item{display:inline-flex!important;align-items:center!important;min-height:32px!important;font-size:13px!important;font-weight:850!important;color:#5d5550!important;white-space:nowrap!important}.statusbar .spacer{flex:1!important}
body[data-page="checkout"] .checkout{width:1280px!important;height:742px!important;display:grid!important;grid-template-columns:455px minmax(0,1fr)!important;gap:14px!important;padding:12px 14px!important;background:#f8f6f2!important;overflow:hidden!important}
body[data-page="checkout"] .checkout-cart.panel,body[data-page="checkout"] .checkout-main.panel{background:#fff!important;border:1px solid #e6ded7!important;border-radius:14px!important;box-shadow:0 6px 18px rgba(70,48,32,.06)!important;overflow:hidden!important}
body[data-page="checkout"] .checkout-cart{height:100%!important;display:grid!important;grid-template-rows:76px minmax(0,1fr)78px!important;padding:0!important;min-width:0!important;min-height:0!important}
body[data-page="checkout"] .checkout-cart>header{height:76px!important;min-height:76px!important;padding:18px 20px 12px!important;display:flex!important;align-items:flex-start!important;justify-content:space-between!important;border-bottom:1px solid #eee6df!important;margin:0!important;background:#fff!important}
body[data-page="checkout"] .checkout-cart h2{display:block!important;margin:0!important;font-size:27px!important;line-height:1.05!important;font-weight:950!important;letter-spacing:.02em!important}.checkout-subtitle{display:block!important;margin-top:8px!important;color:#746a63!important;font-size:13px!important;font-weight:800!important}.checkout-cart-count{font-size:13px!important;color:#746a63!important;font-weight:900!important;white-space:nowrap!important}
body[data-page="checkout"] .cart-lines{min-height:0!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important;padding:10px 18px 8px!important;background:#fff!important}
body[data-page="checkout"] .checkout-cart article{min-height:74px!important;display:grid!important;grid-template-columns:22px 58px minmax(0,1fr)auto!important;gap:10px!important;align-items:center!important;padding:10px 0!important;border-bottom:1px solid #eee9e4!important;background:#fff!important}
body[data-page="checkout"] .checkout-cart article .seq{grid-column:1!important;width:20px!important;height:20px!important;border-radius:999px!important;background:transparent!important;color:#111!important;font-size:12px!important;font-weight:950!important;display:grid!important;place-items:center!important}.checkout-thumb{grid-column:2!important;width:58px!important;height:58px!important;border-radius:10px!important;overflow:hidden!important;background:#f2ece6!important;display:block!important}.checkout-thumb img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}
body[data-page="checkout"] .checkout-cart article>span:not(.seq):not(.checkout-thumb){grid-column:3!important;display:grid!important;gap:3px!important;min-width:0!important}.checkout-cart article strong{font-size:15px!important;line-height:1.18!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.checkout-cart article small{font-size:11px!important;line-height:1.28!important;color:#6f675f!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.checkout-cart article>b{grid-column:4!important;font-size:15px!important;font-weight:950!important;white-space:nowrap!important}
body[data-page="checkout"] .detail-actions{height:78px!important;min-height:78px!important;display:grid!important;grid-template-columns:1fr 1fr 1fr 1fr!important;gap:8px!important;padding:12px!important;border-top:1px solid #eee6df!important;background:#fff!important}.detail-actions button{min-width:0!important;min-height:52px!important;border:1px solid #e1d5cc!important;border-radius:10px!important;background:#fff!important;color:#2b2521!important;font-size:13px!important;font-weight:900!important;display:grid!important;place-items:center!important;place-content:center!important;gap:2px!important}.detail-actions button.active{border-color:#ef4b16!important;background:#fff3ec!important;color:#ef4b16!important}.detail-actions button:disabled{opacity:.5!important}
body[data-page="checkout"] .checkout-main{height:100%!important;display:grid!important;grid-template-rows:22px 68px 22px 56px 164px minmax(0,1fr)82px!important;gap:7px!important;padding:12px 14px!important;min-width:0!important;min-height:0!important;overflow:hidden!important;background:#fff!important}.checkout-step{display:flex!important;align-items:center!important;gap:7px!important;color:#ef4b16!important;font-size:13px!important;font-weight:950!important;line-height:1!important}.checkout-step i{display:inline-grid!important;place-items:center!important;width:20px!important;height:20px!important;border-radius:999px!important;background:#ef4b16!important;color:#fff!important;font-style:normal!important;font-size:12px!important}.checkout-step span{white-space:nowrap!important}
body[data-page="checkout"] .row{gap:9px!important;min-width:0!important}.row.channels{grid-template-columns:repeat(5,minmax(0,1fr))!important}.row.payments{grid-template-columns:repeat(6,minmax(0,1fr))!important}.row.channels button,.row.payments button{height:56px!important;min-height:56px!important;max-height:56px!important;border:1px solid #ded5ce!important;border-radius:10px!important;background:#fff!important;display:grid!important;grid-template-rows:25px 18px!important;place-items:center!important;gap:1px!important;padding:5px 6px!important;font-size:11px!important;font-weight:950!important;line-height:1!important;overflow:hidden!important;white-space:nowrap!important;box-shadow:0 2px 8px rgba(50,35,24,.035)!important}.row.channels button.active,.row.payments button.active{border-color:#ef4b16!important;background:#fff6f0!important;color:#ef4b16!important;box-shadow:inset 0 0 0 1px rgba(239,75,22,.28)!important}.option-icon{width:24px!important;height:24px!important;max-width:24px!important;max-height:24px!important;object-fit:contain!important;display:block!important}
body[data-page="checkout"] .summary{display:grid!important;grid-template-columns:1.25fr .85fr!important;grid-template-rows:repeat(3,1fr)!important;gap:8px!important;min-height:0!important}.summary>span,.summary .received-summary{border:1px solid #e5dcd5!important;border-radius:10px!important;background:#fff!important;padding:9px 12px!important;font-size:14px!important;font-weight:900!important;display:flex!important;align-items:center!important;justify-content:space-between!important;min-height:0!important}.summary>span:nth-child(1){grid-column:1!important;grid-row:1!important}.summary>span:nth-child(2){grid-column:1!important;grid-row:2!important}.summary>span:nth-child(3){grid-column:1!important;grid-row:3!important}.summary .received-summary{grid-column:2!important;grid-row:1 / span 1!important}.summary>span:nth-last-child(1){grid-column:2!important;grid-row:2 / span 2!important}.summary b{font-size:20px!important;line-height:1!important;font-weight:950!important}.summary>span:nth-child(3) b,.summary>span:nth-last-child(1) b{font-size:34px!important;color:#ef4b16!important}.summary .received-summary.active{border:2px solid #ef4b16!important;background:#fff8f2!important;box-shadow:0 0 0 2px rgba(239,75,22,.08)!important}
body[data-page="checkout"] .cash-controls{min-height:0!important;overflow:hidden!important;display:block!important}.keypad-wrap{height:100%!important;display:grid!important;grid-template-rows:30px minmax(0,1fr)!important;gap:7px!important;min-height:0!important;overflow:hidden!important}.quick-amounts{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:7px!important}.quick-amounts button{height:30px!important;min-height:30px!important;border:1px solid #e6ded7!important;border-radius:8px!important;background:#fff!important;color:#267ddb!important;font-size:11px!important;font-weight:900!important}.keypad{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(54px,1fr))!important;gap:7px!important;min-height:0!important}.keypad button{height:auto!important;min-height:54px!important;border:1px solid #e7ded7!important;border-radius:10px!important;background:#fff8f4!important;color:#2b84ff!important;font-size:25px!important;font-weight:950!important}.keypad .clear-key{background:#fff!important;color:#963521!important}
body[data-page="checkout"] .checkout-context{border:1px solid #e5dcd5!important;border-radius:12px!important;background:#fffaf6!important;display:grid!important;place-content:center!important;text-align:center!important;color:#6f675f!important}.checkout-context strong{font-size:22px!important;color:#1f1b18!important}
body[data-page="checkout"] .checkout-action-zone{display:grid!important;grid-template-columns:1fr 1.45fr!important;grid-template-rows:34px 40px!important;gap:8px!important;align-items:stretch!important;margin:0!important}.zero-warning{grid-column:1/-1!important;margin:0!important;padding:6px 10px!important;font-size:12px!important;border-radius:8px!important}.checkout-note{grid-column:1!important;grid-row:1!important;height:34px!important;border:1px solid #e5dcd5!important;border-radius:8px!important;padding:0 10px!important;font-size:12px!important;color:#6f675f!important;display:flex!important;align-items:center!important;background:#fff!important}.save-draft{grid-column:1!important;grid-row:2!important;height:40px!important;border:1px solid #e5dcd5!important;border-radius:8px!important;background:#fff!important;font-size:13px!important;font-weight:900!important}.confirm{grid-column:2!important;grid-row:1 / span 2!important;height:82px!important;min-height:82px!important;border:0!important;border-radius:10px!important;background:#fa3c10!important;color:#fff!important;font-size:18px!important;font-weight:950!important;box-shadow:0 5px 16px rgba(239,75,22,.18)!important}.confirm:disabled{background:#c8beb8!important}
`;

const orderStableCss=`
body[data-page="order"] .quick-drawer-panel{height:138px!important;min-height:138px!important;max-height:138px!important}body[data-page="order"] .quick-drawer-panel>header{height:28px!important;min-height:28px!important;padding:0 8px!important}body[data-page="order"] .quick-drawer-panel>div{height:108px!important;padding:4px 8px 8px!important;display:flex!important;align-items:center!important;gap:8px!important;overflow-x:auto!important;overflow-y:hidden!important}
body[data-page="order"] .quick-drawer-panel .drink-choice-card{width:82px!important;min-width:82px!important;max-width:82px!important;height:96px!important;padding:3px 5px 5px!important;grid-template-rows:18px 70px!important;align-self:center!important}body[data-page="order"] .quick-drawer-panel .drink-choice-card>span:not(.drink-choice-img){line-height:18px!important;font-size:10px!important}body[data-page="order"] .quick-drawer-panel .drink-choice-img{height:70px!important;align-self:center!important}body[data-page="order"] .quick-drawer-panel .drink-choice-img img{object-fit:contain!important}
body[data-page="order"] .completion-drinks>div,body[data-page="order"] .detail-drinks,body[data-page="order"] .combo-candidates.is-drink-candidates,body[data-page="order"] .drink-link-candidates{padding:5px 6px 7px!important;align-items:center!important;overflow-x:auto!important;overflow-y:hidden!important}body[data-page="order"] .completion-drinks .drink-choice-card,body[data-page="order"] .detail-drinks .drink-choice-card,body[data-page="order"] .combo-candidates .drink-choice-card,body[data-page="order"] .drink-link-candidates .drink-choice-card{width:74px!important;min-width:74px!important;max-width:74px!important;height:88px!important;padding:3px 4px 5px!important;grid-template-rows:17px 63px!important}body[data-page="order"] .completion-drinks .drink-choice-img,body[data-page="order"] .detail-drinks .drink-choice-img,body[data-page="order"] .combo-candidates .drink-choice-img,body[data-page="order"] .drink-link-candidates .drink-choice-img{height:63px!important;align-self:center!important}
body[data-page="order"] .modal-card.is-anchored-popover,body[data-page="order"] .confirm-card.is-anchored-popover{overflow:visible!important}body[data-page="order"] .modal-card.is-anchored-popover::before,body[data-page="order"] .confirm-card.is-anchored-popover::before{content:""!important;position:absolute!important;width:0!important;height:0!important;background:transparent!important;border:7px solid transparent!important;box-shadow:none!important;filter:none!important;z-index:0!important;transform:none!important}.is-anchored-popover[data-pointer-side="top"]::before{left:var(--pointer-x)!important;top:-14px!important;bottom:auto!important;border-bottom-color:#fff!important}.is-anchored-popover[data-pointer-side="bottom"]::before{left:var(--pointer-x)!important;bottom:-14px!important;top:auto!important;border-top-color:#fff!important}.is-anchored-popover[data-pointer-side="left"]::before{left:-14px!important;top:var(--pointer-y)!important;right:auto!important;border-right-color:#fff!important}.is-anchored-popover[data-pointer-side="right"]::before{right:-14px!important;top:var(--pointer-y)!important;left:auto!important;border-left-color:#fff!important}
body[data-page="order"] .modifier-card.is-anchored-popover{width:172px!important;min-width:172px!important;max-width:172px!important;max-height:150px!important;z-index:1400!important;contain:layout paint!important}.modifier-card>header{min-height:26px!important;padding:4px 6px!important}.modifier-card>header strong{font-size:10px!important}.modifier-card>.drink-base-qty{margin:3px 5px!important;padding:3px 4px!important;font-size:9px!important}.modifier-card>.wide{min-height:23px!important;margin:2px 5px 5px!important;font-size:9px!important}
`;

function viewportSize(){
  const viewport=window.visualViewport;
  return {width:Math.round(viewport?.width||window.innerWidth),height:Math.round(viewport?.height||window.innerHeight)};
}
function isExactTarget(size){return size.width===TARGET_WIDTH&&size.height===TARGET_HEIGHT;}
function applyT2SViewport(){
  const size=viewportSize();
  const orientation=size.width>=size.height?'橫屏':'直屏';
  document.documentElement.dataset.orientation=orientation==='橫屏'?'landscape':'portrait';
  const exact=isExactTarget(size);
  const scale=exact?1:Math.min(size.width/TARGET_WIDTH,size.height/TARGET_HEIGHT);
  const renderedWidth=Math.round(TARGET_WIDTH*scale);
  const renderedHeight=Math.round(TARGET_HEIGHT*scale);
  stage.style.width=TARGET_WIDTH+'px';
  stage.style.height=TARGET_HEIGHT+'px';
  stage.style.left=Math.max(0,Math.round((size.width-renderedWidth)/2))+'px';
  stage.style.top=Math.max(0,Math.round((size.height-renderedHeight)/2))+'px';
  stage.style.zoom='1';
  stage.style.transform=scale===1?'none':'scale('+scale+')';
  stage.dataset.profile=exact?'sunmi-t2s-native':'sunmi-t2s-simulator';
  stage.dataset.viewportWidth=String(size.width);
  stage.dataset.viewportHeight=String(size.height);
  stage.dataset.scale=scale.toFixed(4);
  stage.dataset.fitted='1';
  document.documentElement.dataset.previewMode=exact?'native':'simulator';
  if(hud&&hudDetail){
    hud.hidden=exact;
    hudDetail.textContent='裝置 '+size.width+'×'+size.height+'（'+orientation+'）｜完整框縮放 '+Math.round(scale*100)+'%｜黃色框內固定為 1280×800｜版本 '+BUILD;
  }
}
function route(){
  const key=(location.hash.replace(/^#\/?/,'')||'order').split('?')[0];
  return routes[key]?key:'order';
}
function showLoaderError(message){
  frame.srcdoc='<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><meta name="viewport" content="width=1280,initial-scale=1"><style>body{margin:0;display:grid;place-items:center;width:1280px;height:800px;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{max-width:520px;padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}.card button{min-height:48px;margin-top:12px;padding:0 20px;border:0;border-radius:10px;background:#ef5b23;color:#fff;font-weight:800}</style><body><section class="card"><strong>頁面未能載入</strong><p>'+String(message||'請重新整理後再試')+'</p><button onclick="location.reload()">重新載入</button></section></body></html>';
}
function upsertStyle(doc,id,css){
  if(!doc?.head||!css)return;
  let style=doc.getElementById(id);
  if(!style){style=doc.createElement('style');style.id=id;doc.head.appendChild(style);}
  style.textContent=css;
}
function escapeAttr(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function lineDesc(line){
  const parts=[];
  const small=Array.isArray(line?.drinkAssignments)?line.drinkAssignments.map(d=>[d.name,d.sweetness,d.ice].filter(Boolean).join(' · ')).filter(Boolean):[];
  if(small.length)parts.push(...small.slice(0,2));
  if(line?.options){Object.values(line.options).flat().filter(Boolean).slice(0,2).forEach(v=>parts.push(String(v)));}
  return parts.join(' · ')||'標準';
}
function decorateCheckout(doc,win){
  const app=doc.getElementById('app');
  if(!app)return;
  const order=(()=>{try{return JSON.parse(win.localStorage.getItem('morefun:smt:v16:order')||'{"cart":[]}');}catch{return {cart:[]};}})();
  const cart=Array.isArray(order.cart)?order.cart:[];
  const h2=doc.querySelector('.checkout-cart h2');
  if(h2&&h2.textContent.trim()!=='結帳'){
    h2.textContent='結帳';
    const sub=doc.createElement('small');sub.className='checkout-subtitle';sub.textContent='核對餐點，確認後結帳';
    h2.insertAdjacentElement('afterend',sub);
  }
  const cartCount=doc.querySelector('.checkout-cart>header>span');
  if(cartCount)cartCount.className='checkout-cart-count';
  doc.querySelectorAll('.checkout-cart article').forEach((article,index)=>{
    const line=cart[index]||{};
    if(!article.querySelector('.checkout-thumb')){
      const img=doc.createElement('span');img.className='checkout-thumb';
      img.innerHTML=line.image?'<img src="'+escapeAttr(line.image)+'" alt="">':'<span></span>';
      const copy=Array.from(article.children).find(el=>el.tagName==='SPAN'&&!el.classList.contains('seq'));
      if(copy)article.insertBefore(img,copy);
    }
    const small=Array.from(article.querySelectorAll('small')).at(-1);
    if(small)small.textContent='x'+(line.qty||small.textContent.replace(/^x/,''))+'｜'+lineDesc(line);
  });
  const main=doc.querySelector('.checkout-main');
  if(main&&!main.querySelector('.checkout-step-source')){
    const source=doc.createElement('div');source.className='checkout-step checkout-step-source';source.innerHTML='<i>1</i><span>選擇來源</span>';
    const payment=doc.createElement('div');payment.className='checkout-step checkout-step-payment';payment.innerHTML='<i>2</i><span>付款方式</span>';
    const amount=doc.createElement('div');amount.className='checkout-step checkout-step-amount';amount.innerHTML='<i>3</i><span>金額結算</span>';
    const input=doc.createElement('div');input.className='checkout-step checkout-step-input';input.innerHTML='<i>4</i><span>輸入金額</span>';
    main.insertBefore(source,main.children[0]);
    main.insertBefore(payment,main.children[2]);
    main.insertBefore(amount,main.children[4]);
    main.insertBefore(input,main.children[6]);
  }
  const actions=doc.querySelector('.detail-actions');
  if(actions&&!actions.querySelector('[data-t2s-placeholder="coupon"]')){
    const student=actions.children[1];if(student){student.innerHTML='<span>學生優惠</span>';}
    const coupon=doc.createElement('button');coupon.type='button';coupon.disabled=true;coupon.dataset.t2sPlaceholder='coupon';coupon.textContent='磨飯優惠券';
    const discount=doc.createElement('button');discount.type='button';discount.dataset.action='discount-open';discount.dataset.t2sPlaceholder='discount';discount.textContent='整單折扣';
    actions.appendChild(coupon);actions.appendChild(discount);
  }
  const footer=doc.querySelector('.checkout-action-zone');
  if(footer&&!footer.querySelector('.checkout-note')){
    const note=doc.createElement('div');note.className='checkout-note';note.textContent='備註：不辣、少甜、少冰、互換補差…';
    const draft=doc.createElement('button');draft.type='button';draft.className='save-draft';draft.textContent='儲存為草稿';draft.disabled=true;
    footer.insertBefore(note,footer.firstChild);footer.insertBefore(draft,footer.children[1]||null);
  }
}
function installCheckoutObserver(doc,win){
  if(win.__t2sCheckoutObserverInstalled)return;
  win.__t2sCheckoutObserverInstalled=true;
  const app=doc.getElementById('app');
  if(!app)return;
  let timer=0;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>decorateCheckout(doc,win),0);};
  new win.MutationObserver(schedule).observe(app,{childList:true,subtree:true});
  schedule();
}
function installOrderGuard(doc,win){
  if(win.__t2sOrderGuardInstalled)return;
  win.__t2sOrderGuardInstalled=true;
  const app=doc.getElementById('app');
  if(!app)return;
  let lock=null;
  const apply=()=>{
    if(!lock||Date.now()-lock.t>900)return;
    const card=doc.querySelector('.modifier-card');
    if(!card)return;
    card.style.left=lock.left+'px';
    card.style.top=lock.top+'px';
    card.style.width=lock.width+'px';
    card.style.right='auto';
    card.style.bottom='auto';
    card.style.transform='none';
    card.style.zIndex='1400';
  };
  app.addEventListener('pointerdown',event=>{
    const card=event.target.closest('.modifier-card');
    const action=event.target.closest('[data-action]')?.dataset.action||'';
    if(card&&['modifier-qty','group-qty','toggle-drink-adjustment','detail-option','add-drink-group'].includes(action)){
      const r=card.getBoundingClientRect();
      lock={left:r.left,top:r.top,width:r.width,t:Date.now()};
      setTimeout(apply,0);setTimeout(apply,80);
    }
  },true);
  new win.MutationObserver(()=>win.requestAnimationFrame(apply)).observe(app,{childList:true,subtree:true});
}
function injectPageFixes(){
  try{
    const doc=frame.contentDocument,win=frame.contentWindow;
    if(!doc?.body||!doc.head||!win)return;
    const page=doc.body.dataset.page||'';
    if(page==='checkout'){
      upsertStyle(doc,'smt-t2s-checkout-replica',checkoutReplicaCss);
      decorateCheckout(doc,win);
      installCheckoutObserver(doc,win);
    }else if(page==='order'){
      upsertStyle(doc,'smt-t2s-order-stable',orderStableCss);
      installOrderGuard(doc,win);
    }else if(page==='more'){
      upsertStyle(doc,'smt-t2s-more-stable','body[data-page="more"] .app{width:1280px!important;height:800px!important;min-width:1280px!important;min-height:800px!important;overflow:hidden!important}');
    }
  }catch(error){console.warn('T2S_FIX_INJECT_FAILED',error);}
}
function ensurePageVisible(expected,seq){
  if(seq!==loadSeq)return;
  try{
    const doc=frame.contentDocument;
    const app=doc?.getElementById('app');
    const page=doc?.body?.dataset?.page||'';
    const hasRealContent=app&&app.children.length&&app.textContent.trim().length>12;
    if(page!==expected||!hasRealContent){
      frame.src=routes[expected]+'?build='+encodeURIComponent(BUILD)+'&retry='+Date.now();
    }
  }catch(_error){frame.src=routes[expected]+'?build='+encodeURIComponent(BUILD)+'&retry='+Date.now();}
}
function load({force=false}={}){
  const key=route();
  if(!force&&key===current&&childReady)return;
  current=key;
  childReady=false;
  const seq=++loadSeq;
  clearTimeout(loadTimer);
  clearTimeout(watchdogTimer);
  frame.removeAttribute('srcdoc');
  frame.style.visibility='visible';
  frame.style.opacity='1';
  frame.src='about:blank';
  const stamp=Date.now();
  loadTimer=setTimeout(()=>{
    if(seq!==loadSeq)return;
    frame.src=routes[key]+'?build='+encodeURIComponent(BUILD)+'&t='+stamp;
    watchdogTimer=setTimeout(()=>ensurePageVisible(key,seq),key==='more'?900:1500);
  },20);
}

frame.addEventListener('error',()=>showLoaderError('子頁載入失敗，資料仍保存在本機。'));
frame.addEventListener('load',()=>{
  applyT2SViewport();
  setTimeout(injectPageFixes,30);
  setTimeout(injectPageFixes,220);
  setTimeout(injectPageFixes,700);
});
addEventListener('hashchange',()=>load({force:true}));
addEventListener('pageshow',()=>{applyT2SViewport();if(!childReady)load({force:true});});
addEventListener('resize',applyT2SViewport,{passive:true});
addEventListener('orientationchange',()=>setTimeout(applyT2SViewport,120),{passive:true});
addEventListener('message',event=>{
  if(event.source!==frame.contentWindow)return;
  if(event.data?.type==='morefun:page-ready'){
    childReady=true;
    clearTimeout(watchdogTimer);
    setTimeout(injectPageFixes,30);
  }
  if(event.data?.type==='morefun:navigate'){
    const next=String(event.data.route||'order');
    if(location.hash==='#/'+next)load({force:true});
    else location.hash='#/'+next;
  }
  if(event.data?.type==='morefun:exit-fullscreen'&&document.fullscreenElement)document.exitFullscreen?.();
  if(event.data?.type==='morefun:set-ui-scale'){
    frame.contentWindow?.postMessage({type:'morefun:ui-scale-disabled',reason:'T2S 使用固定 1280×800 測試框；請使用瀏覽器雙指縮放檢查細節。'},'*');
  }
  if(event.data?.type==='morefun:reload-current-page')load({force:true});
  if(event.data?.type==='morefun:page-runtime-error'){
    console.error(event.data);
    if(!childReady)showLoaderError('頁面啟動失敗，資料仍保存在本機，請重新整理後再試。');
  }
});

applyT2SViewport();
load({force:true});
