const app=document.getElementById('app');

const view={productsTop:0,categoryLeft:0,cartTop:0};
const collapsedCategories=new Set();
let knownLineIds=null;
let preferredServiceMode='';
let pendingServiceMode='';
let pendingHighlightLineId='';
let pendingRevealProductName='';
let lastEditedLineId='';
let prepareFrame=0;
let resetProductsOnRestore=false;
let revealFrame=0;
let checkoutPrewarmed=false;
let pendingDrinkAssignment=null;
let lastDrinkAssignment=null;
let drinkFeedbackTimer=0;

function rememberScroll(){
  const products=app?.querySelector('.products');
  const categories=app?.querySelector('.category-scroll');
  const cart=app?.querySelector('.cart-list');
  if(products)view.productsTop=products.scrollTop;
  if(categories)view.categoryLeft=categories.scrollLeft;
  if(cart)view.cartTop=cart.scrollTop;
}

function restoreScroll(){
  const products=app?.querySelector('.products');
  const categories=app?.querySelector('.category-scroll');
  const cart=app?.querySelector('.cart-list');
  if(products)products.scrollTop=resetProductsOnRestore?0:view.productsTop;
  if(categories)categories.scrollLeft=view.categoryLeft;
  if(cart)cart.scrollTop=view.cartTop;
  resetProductsOnRestore=false;
}

function categoryName(section){
  return section.querySelector(':scope > header strong')?.textContent?.trim()||'';
}

function prepareCategories(){
  app?.querySelectorAll('.cart-category').forEach(section=>{
    const header=section.querySelector(':scope > header');
    const name=categoryName(section);
    if(!header||!name)return;
    const collapsed=collapsedCategories.has(name);
    section.classList.toggle('is-collapsed',collapsed);
    header.classList.add('cart-category-toggle');
    header.setAttribute('role','button');
    header.setAttribute('tabindex','0');
    header.setAttribute('aria-expanded',String(!collapsed));
    header.setAttribute('aria-label',(collapsed?'展開':'收起')+name+'分類');
  });
}

function activeLineMode(row){
  const active=row.querySelector('.service-mode .mode-choice.active');
  return active?.dataset.value==='外賣'?'外賣':'堂食';
}

function prepareLineModeToggles(){
  app?.querySelectorAll('.cart-row').forEach(row=>{
    const seq=row.querySelector('.seq');
    if(!seq)return;
    if(!seq.dataset.cartSequence)seq.dataset.cartSequence=seq.textContent.trim();
    const mode=activeLineMode(row);
    seq.classList.add('cart-line-mode-toggle');
    seq.setAttribute('role','button');
    seq.setAttribute('tabindex','0');
    seq.setAttribute('aria-label',`第 ${seq.dataset.cartSequence} 項，目前${mode}，按下切換`);
    seq.innerHTML=`<b>${seq.dataset.cartSequence}</b><small>${mode==='外賣'?'外':'堂'}</small>`;
  });
}

function cartModes(){
  return [...(app?.querySelectorAll('.cart-row')||[])].map(activeLineMode);
}

function serviceModeState(){
  const modes=cartModes();
  if(!modes.length)return preferredServiceMode||'堂食';
  if(modes.every(mode=>mode==='堂食'))return '堂食';
  if(modes.every(mode=>mode==='外賣'))return '外賣';
  return '混合';
}

function prepareOrderServiceSelector(){
  const actions=app?.querySelector('.cart > header .cart-header-actions');
  if(!actions)return;
  let selector=actions.querySelector('.cart-service-selector');
  if(!selector){
    selector=document.createElement('span');
    selector.className='cart-service-selector';
    selector.setAttribute('role','group');
    selector.setAttribute('aria-label','全單用餐方式');
    selector.innerHTML='<button type="button" data-cart-service-mode="堂食">堂食</button><button type="button" data-cart-service-mode="外賣">外賣</button><small></small>';
    actions.insertBefore(selector,actions.lastElementChild||null);
  }
  const state=serviceModeState();
  selector.querySelectorAll('[data-cart-service-mode]').forEach(button=>button.classList.toggle('active',button.dataset.cartServiceMode===state));
  const label=selector.querySelector('small');
  if(label)label.textContent=state==='混合'?'混合':'';
}

function clickLineMode(row,mode){
  const source=[...row.querySelectorAll('.service-mode .mode-choice')].find(button=>button.dataset.value===mode);
  if(source&&!source.classList.contains('active')){source.click();return true;}
  return false;
}

function applyPendingServiceMode(){
  if(!pendingServiceMode)return;
  const row=[...(app?.querySelectorAll('.cart-row')||[])].find(item=>activeLineMode(item)!==pendingServiceMode);
  if(row&&clickLineMode(row,pendingServiceMode))return;
  preferredServiceMode=pendingServiceMode;
  pendingServiceMode='';
  prepareOrderServiceSelector();
}

function firstMissingDrinkTarget(){
  const rows=[...(app?.querySelectorAll('.cart-row')||[])];
  for(const row of rows){
    const detail=row.querySelector('.cart-copy small')?.textContent||'';
    if(!detail.includes('尚欠飲品'))continue;
    return row.querySelector('.cart-copy strong')?.textContent?.trim()||'';
  }
  return '';
}

function clearDrinkFeedback(){
  lastDrinkAssignment=null;
  schedulePrepare();
}

function showDrinkAssignmentFeedback(){
  if(!lastDrinkAssignment)return;
  clearTimeout(drinkFeedbackTimer);
  drinkFeedbackTimer=setTimeout(clearDrinkFeedback,3200);
}

function prepareQuickDrinkTarget(){
  const target=firstMissingDrinkTarget();
  const panelTitle=app?.querySelector('.quick-drawer-panel > header strong');
  const handle=app?.querySelector('.quick-drawer-handle');
  const drawer=app?.querySelector('.quick-drawer');
  if(handle)handle.setAttribute('aria-label',target?`快捷飲品，正在補 ${target}`:'快捷飲品，目前沒有指定補選目標');
  if(panelTitle){
    const base=panelTitle.textContent.replace(/｜正在補：.*$/,'').replace(/｜已配對：.*$/,'');
    panelTitle.textContent=lastDrinkAssignment?`${base}｜已配對：${lastDrinkAssignment.drink} → ${lastDrinkAssignment.target}`:target?`${base}｜正在補：${target}`:base;
  }
  let feedback=drawer?.querySelector('.quick-drink-assignment-feedback');
  if(lastDrinkAssignment&&drawer){
    if(!feedback){feedback=document.createElement('div');feedback.className='quick-drink-assignment-feedback';drawer.appendChild(feedback);}
    feedback.textContent=`已配對：${lastDrinkAssignment.drink} → ${lastDrinkAssignment.target}`;
  }else feedback?.remove();
}

function cartRows(){return [...(app?.querySelectorAll('.cart-row[data-line-id]')||[])];}

function rowByProductName(name){
  if(!name)return null;
  return cartRows().find(row=>row.querySelector('.cart-copy strong')?.textContent?.trim()===name)||null;
}

function updateRecentRows(){
  const rows=cartRows();
  const ids=new Set(rows.map(row=>row.dataset.lineId).filter(Boolean));
  if(knownLineIds===null){knownLineIds=ids;return;}
  const added=rows.find(row=>row.dataset.lineId&&!knownLineIds.has(row.dataset.lineId));
  if(!pendingHighlightLineId&&added?.dataset.lineId)pendingHighlightLineId=added.dataset.lineId;
  knownLineIds=ids;
}

function revealRecentRow(){
  cancelAnimationFrame(revealFrame);
  revealFrame=0;
  const rows=cartRows();
  let target=pendingHighlightLineId?rows.find(row=>row.dataset.lineId===pendingHighlightLineId):null;
  if(!target&&pendingRevealProductName)target=rowByProductName(pendingRevealProductName);
  if(!target)return;
  pendingHighlightLineId='';
  pendingRevealProductName='';
  target.classList.remove('cart-row-recent');
  target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
  requestAnimationFrame(()=>{
    target.classList.add('cart-row-recent');
    target.setAttribute('data-recent-label','剛加入');
    setTimeout(()=>{target.classList.remove('cart-row-recent');target.removeAttribute('data-recent-label');},1500);
  });
}

function scheduleRevealRecentRow(){
  cancelAnimationFrame(revealFrame);
  revealFrame=requestAnimationFrame(()=>{
    revealFrame=requestAnimationFrame(()=>{
      revealFrame=0;
      revealRecentRow();
    });
  });
}

function applyPreferredModeToNewRows(){
  if(!preferredServiceMode||!knownLineIds)return;
  const rows=cartRows();
  const candidate=rows.find(row=>row.dataset.lineId&&!knownLineIds.has(row.dataset.lineId)&&activeLineMode(row)!==preferredServiceMode);
  if(candidate)clickLineMode(candidate,preferredServiceMode);
}

function preloadCheckoutOnOrderReady(){
  if(checkoutPrewarmed)return;
  checkoutPrewarmed=true;
  const frame=document.createElement('iframe');
  frame.className='checkout-prewarm-frame';
  frame.tabIndex=-1;
  frame.setAttribute('aria-hidden','true');
  frame.src='../checkout/index.html?preload=order-ready';
  frame.addEventListener('load',()=>setTimeout(()=>frame.remove(),120),{once:true});
  document.body.appendChild(frame);
}

function prepareCheckoutAvailability(){
  const button=app?.querySelector('[data-action="checkout"]');
  if(!button)return;
  const hasCart=cartRows().length>0;
  button.disabled=!hasCart;
  button.setAttribute('aria-disabled',hasCart?'false':'true');
  button.classList.toggle('is-disabled',!hasCart);
  if(!hasCart){button.textContent='購物車未有餐點';button.title='請先加入餐點';}
  else button.removeAttribute('title');
}

function prepare(){
  prepareFrame=0;
  prepareCategories();
  prepareLineModeToggles();
  prepareOrderServiceSelector();
  prepareQuickDrinkTarget();
  applyPreferredModeToNewRows();
  updateRecentRows();
  restoreScroll();
  applyPendingServiceMode();
  prepareCheckoutAvailability();
  preloadCheckoutOnOrderReady();
  scheduleRevealRecentRow();
}

function schedulePrepare(){
  if(prepareFrame)return;
  prepareFrame=requestAnimationFrame(prepare);
}

function toggleCategory(section){
  const name=categoryName(section);
  if(!name)return;
  if(collapsedCategories.has(name))collapsedCategories.delete(name);else collapsedCategories.add(name);
  prepareCategories();
}

function toggleLineMode(toggle){
  const row=toggle.closest('.cart-row');
  if(!row)return;
  const next=activeLineMode(row)==='外賣'?'堂食':'外賣';
  clickLineMode(row,next);
}

function productNameFromTrigger(trigger){
  if(!trigger)return '';
  return trigger.querySelector('.product-copy strong')?.textContent?.trim()||trigger.querySelector('strong')?.textContent?.trim()||'';
}

function drinkNameFromQuickTrigger(trigger){
  if(!trigger)return '';
  return trigger.querySelector('strong')?.textContent?.trim()||trigger.querySelector('.drink-copy strong')?.textContent?.trim()||trigger.textContent?.trim().replace(/\s+/g,' ')||'';
}

app?.addEventListener('scroll',event=>{
  const target=event.target;
  if(target.matches?.('.products'))view.productsTop=target.scrollTop;
  else if(target.matches?.('.category-scroll'))view.categoryLeft=target.scrollLeft;
  else if(target.matches?.('.cart-list'))view.cartTop=target.scrollTop;
},true);

app?.addEventListener('pointerdown',event=>{
  rememberScroll();
  const action=event.target.closest?.('[data-action]');
  if(action?.dataset.action==='category')resetProductsOnRestore=true;
  if(action?.dataset.action==='edit-line')lastEditedLineId=action.dataset.id||'';
  if(action?.dataset.action==='apply-product'&&lastEditedLineId)pendingHighlightLineId=lastEditedLineId;
  if(action&&['open-product','quick-add-product'].includes(action.dataset.action))pendingRevealProductName=productNameFromTrigger(action);
  if(action?.dataset.action==='apply-product'&&!lastEditedLineId){
    const modal=action.closest('.product-settings-card');
    pendingRevealProductName=modal?.querySelector('.settings-product-head h2')?.textContent?.trim()||pendingRevealProductName;
  }
  if(action?.dataset.action==='quick-drink'){
    const target=firstMissingDrinkTarget();
    if(target)pendingDrinkAssignment={target,drink:drinkNameFromQuickTrigger(action)};
  }
  if(action?.dataset.action==='apply-drink'&&pendingDrinkAssignment){
    lastDrinkAssignment={...pendingDrinkAssignment};
    pendingDrinkAssignment=null;
    showDrinkAssignmentFeedback();
  }
},true);

app?.addEventListener('click',event=>{
  const service=event.target.closest?.('[data-cart-service-mode]');
  if(service){
    event.preventDefault();
    event.stopPropagation();
    pendingServiceMode=service.dataset.cartServiceMode;
    applyPendingServiceMode();
    return;
  }
  const lineToggle=event.target.closest?.('.cart-line-mode-toggle');
  if(lineToggle){
    event.preventDefault();
    event.stopPropagation();
    toggleLineMode(lineToggle);
    return;
  }
  const header=event.target.closest?.('.cart-category-toggle');
  if(header&&!event.target.closest('[data-action]')){
    event.preventDefault();
    toggleCategory(header.closest('.cart-category'));
  }
},true);

app?.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  const lineToggle=event.target.closest?.('.cart-line-mode-toggle');
  if(lineToggle){event.preventDefault();toggleLineMode(lineToggle);return;}
  const header=event.target.closest?.('.cart-category-toggle');
  if(header){event.preventDefault();toggleCategory(header.closest('.cart-category'));}
},true);

new MutationObserver(schedulePrepare).observe(app,{childList:true,subtree:true});
addEventListener('resize',schedulePrepare,{passive:true});
window.visualViewport?.addEventListener('resize',schedulePrepare,{passive:true});
preloadCheckoutOnOrderReady();
schedulePrepare();