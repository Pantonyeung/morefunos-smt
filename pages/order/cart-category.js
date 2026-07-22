const app=document.getElementById('app');
const collapsedCategories=new Set();
let lastTriggerRect=null;

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
  return {left:offsetLeft+12,top:offsetTop+68,right:offsetLeft+width-12,bottom:offsetTop+height-76};
}

function positionPopover(card){
  if(!card||card.dataset.popoverPositioned==='1')return;
  const safe=safeViewport();
  const trigger=lastTriggerRect;
  const preferredWidth=Math.min(card.classList.contains('order-transfer-card')?820:card.classList.contains('product-detail')?960:Math.max(card.offsetWidth||320,280),safe.right-safe.left);
  const preferredHeight=Math.min(card.scrollHeight||card.offsetHeight||360,safe.bottom-safe.top);
  let left=trigger?trigger.left:safe.left+(safe.right-safe.left-preferredWidth)/2;
  let top=trigger?trigger.bottom+8:safe.top+(safe.bottom-safe.top-preferredHeight)/2;
  if(trigger&&top+preferredHeight>safe.bottom)top=trigger.top-preferredHeight-8;
  if(trigger&&left+preferredWidth>safe.right)left=trigger.right-preferredWidth;
  left=Math.max(safe.left,Math.min(left,safe.right-preferredWidth));
  top=Math.max(safe.top,Math.min(top,safe.bottom-preferredHeight));
  card.classList.add('is-anchored-popover');
  card.style.left=Math.round(left)+'px';
  card.style.top=Math.round(top)+'px';
  card.style.right='auto';
  card.style.bottom='auto';
  card.style.transform='none';
  card.style.maxWidth=Math.floor(safe.right-safe.left)+'px';
  card.style.maxHeight=Math.floor(safe.bottom-safe.top)+'px';
  card.dataset.popoverPositioned='1';
}

function preparePopovers(){
  app.querySelectorAll('.modal-card,.confirm-card').forEach(positionPopover);
}

function prepareAll(){
  app.querySelectorAll('.cart-category').forEach(prepareCategory);
  prepareEditButtons();
  requestAnimationFrame(preparePopovers);
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

addEventListener('resize',()=>{
  app.querySelectorAll('.modal-card,.confirm-card').forEach(card=>{
    card.dataset.popoverPositioned='';
    positionPopover(card);
  });
});

new MutationObserver(prepareAll).observe(app,{childList:true,subtree:true});
prepareAll();
