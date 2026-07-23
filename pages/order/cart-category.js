const app=document.getElementById('app');
const collapsedCategories=new Set();
let lastTriggerRect=null;
let prepareFrame=0;

function categoryName(section){
  return section.querySelector('.cart-category>header strong')?.textContent?.trim()||'';
}

function prepareCategory(section){
  const header=section.querySelector(':scope>header');
  if(!header)return;
  const name=categoryName(section);
  header.setAttribute('role','button');
  header.setAttribute('tabindex','0');
  header.setAttribute('aria-expanded',String(!collapsedCategories.has(name)));
  section.classList.toggle('collapsed',collapsedCategories.has(name));
}

function prepareEditButtons(){
  app.querySelectorAll('.cart-actions .edit-button').forEach(button=>{
    if(button.textContent.trim()!=='改')button.textContent='改';
    button.setAttribute('aria-label','修改產品');
    button.setAttribute('title','修改產品');
  });
}

function safeViewport(){
  const viewport=window.visualViewport;
  const width=viewport?.width||window.innerWidth;
  const height=viewport?.height||window.innerHeight;
  const offsetLeft=viewport?.offsetLeft||0;
  const offsetTop=viewport?.offsetTop||0;
  const topbar=document.querySelector('.topbar')?.getBoundingClientRect();
  const nav=document.querySelector('.bottom-nav')?.getBoundingClientRect();
  return {
    left:offsetLeft+12,
    top:Math.max(offsetTop+12,(topbar?.bottom||offsetTop)+12),
    right:offsetLeft+width-12,
    bottom:Math.min(offsetTop+height-12,(nav?.top||offsetTop+height)-12)
  };
}

function preferredSize(card,safe){
  const maxWidth=safe.right-safe.left;
  const maxHeight=safe.bottom-safe.top;
  let width=card.getBoundingClientRect().width||360;
  if(card.classList.contains('order-transfer-card'))width=900;
  else if(card.classList.contains('product-settings-card'))width=760;
  else if(card.classList.contains('modifier-card'))width=520;
  else if(card.classList.contains('completion-card'))width=500;
  else if(card.classList.contains('specified-link-card'))width=620;
  else if(card.classList.contains('pending-review-card'))width=720;
  else if(card.classList.contains('pending-panel'))width=420;
  else if(card.classList.contains('side-card'))width=420;
  width=Math.min(width,maxWidth);
  const height=Math.min(card.scrollHeight||card.getBoundingClientRect().height||360,maxHeight);
  return {width,height,maxWidth,maxHeight};
}

function choosePlacement(trigger,width,height,safe,gap=12){
  const spaces={
    bottom:safe.bottom-trigger.bottom,
    top:trigger.top-safe.top,
    right:safe.right-trigger.right,
    left:trigger.left-safe.left
  };
  const order=['bottom','top','right','left'];
  const found=order.find(side=>spaces[side]>=(side==='bottom'||side==='top'?height:width)+gap);
  return found||Object.entries(spaces).sort((a,b)=>b[1]-a[1])[0][0];
}

function positionPopover(card){
  if(!card||card.dataset.popoverPositioned==='1')return;
  const safe=safeViewport();
  const size=preferredSize(card,safe);
  const trigger=lastTriggerRect;
  let side='center';
  let left=safe.left+(size.maxWidth-size.width)/2;
  let top=safe.top+(size.maxHeight-size.height)/2;
  if(trigger){
    side=choosePlacement(trigger,size.width,size.height,safe);
    if(side==='bottom'){
      left=trigger.left+trigger.width/2-size.width/2;
      top=trigger.bottom+12;
    }else if(side==='top'){
      left=trigger.left+trigger.width/2-size.width/2;
      top=trigger.top-size.height-12;
    }else if(side==='right'){
      left=trigger.right+12;
      top=trigger.top+trigger.height/2-size.height/2;
    }else{
      left=trigger.left-size.width-12;
      top=trigger.top+trigger.height/2-size.height/2;
    }
  }
  left=Math.max(safe.left,Math.min(left,safe.right-size.width));
  top=Math.max(safe.top,Math.min(top,safe.bottom-size.height));
  card.classList.add('is-anchored-popover');
  card.style.left=Math.round(left)+'px';
  card.style.top=Math.round(top)+'px';
  card.style.right='auto';
  card.style.bottom='auto';
  card.style.transform='none';
  card.style.width=Math.round(size.width)+'px';
  card.style.maxWidth=Math.floor(size.maxWidth)+'px';
  card.style.maxHeight=Math.floor(size.maxHeight)+'px';
  card.dataset.pointerSide=side;
  if(trigger){
    card.style.setProperty('--pointer-x',Math.max(22,Math.min(trigger.left+trigger.width/2-left,size.width-22))+'px');
    card.style.setProperty('--pointer-y',Math.max(22,Math.min(trigger.top+trigger.height/2-top,size.height-22))+'px');
  }
  card.dataset.popoverPositioned='1';
}

function preparePopovers(){
  app.querySelectorAll('.modal-card,.confirm-card').forEach(positionPopover);
}

function prepareAll(){
  app.querySelectorAll('.cart-category').forEach(prepareCategory);
  prepareEditButtons();
  cancelAnimationFrame(prepareFrame);
  prepareFrame=requestAnimationFrame(()=>requestAnimationFrame(preparePopovers));
}

function toggle(section){
  const name=categoryName(section);
  if(!name)return;
  if(collapsedCategories.has(name))collapsedCategories.delete(name);
  else collapsedCategories.add(name);
  prepareCategory(section);
}

app.addEventListener('pointerdown',event=>{
  const trigger=event.target.closest('[data-action]');
  if(!trigger)return;
  const action=trigger.dataset.action||'';
  if(['dismiss-modal','confirm-cancel','confirm-discard','confirm-save'].includes(action))return;
  lastTriggerRect=trigger.getBoundingClientRect();
});

app.addEventListener('click',event=>{
  const header=event.target.closest('.cart-category>header');
  if(!header)return;
  event.preventDefault();
  toggle(header.parentElement);
});

app.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  const header=event.target.closest('.cart-category>header');
  if(!header)return;
  event.preventDefault();
  toggle(header.parentElement);
});

function resetAndPosition(){
  app.querySelectorAll('.modal-card,.confirm-card').forEach(card=>{card.dataset.popoverPositioned='';});
  prepareAll();
}

addEventListener('resize',resetAndPosition);
window.visualViewport?.addEventListener('resize',resetAndPosition);
window.visualViewport?.addEventListener('scroll',resetAndPosition);

new MutationObserver(prepareAll).observe(app,{childList:true,subtree:true});
prepareAll();
