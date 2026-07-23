const app=document.getElementById('app');
const collapsedCategories=new Set();
const collapsedModalSections=new Set();
const popoverMemory=new Map();
const scrollMemory=new Map();
let lastTriggerRect=null;
let prepareFrame=0;

const pointerStyle=document.createElement('style');
pointerStyle.textContent='.modal-card.is-anchored-popover::before,.confirm-card.is-anchored-popover::before{display:none!important}';
document.head.appendChild(pointerStyle);

const externalArrow=document.createElement('div');
externalArrow.setAttribute('aria-hidden','true');
Object.assign(externalArrow.style,{
  position:'fixed',width:'14px',height:'14px',display:'none',background:'#fff',
  borderLeft:'1px solid #ddd3cc',borderTop:'1px solid #ddd3cc',
  boxShadow:'-2px -2px 5px rgba(44,34,29,.06)',pointerEvents:'none',zIndex:'5002'
});
document.body.appendChild(externalArrow);

function categoryName(section){return section.querySelector('.cart-category>header strong')?.textContent?.trim()||'';}
function prepareCategory(section){
  const header=section.querySelector(':scope>header');if(!header)return;
  const name=categoryName(section);
  header.setAttribute('role','button');header.setAttribute('tabindex','0');
  header.setAttribute('aria-expanded',String(!collapsedCategories.has(name)));
  section.classList.toggle('collapsed',collapsedCategories.has(name));
}
function prepareEditButtons(){
  app.querySelectorAll('.cart-actions .edit-button').forEach(button=>{
    if(button.textContent.trim()!=='改')button.textContent='改';
    button.setAttribute('aria-label','修改產品或套餐');button.setAttribute('title','修改產品或套餐');
  });
}
function modalSectionKey(section,index){
  const card=section.closest('.modal-card');
  const cardKey=card?.classList.contains('specified-link-card')?'specified':card?.classList.contains('combo-editor-card')?'combo':'modal';
  const heading=section.querySelector(':scope>strong,:scope>header strong')?.textContent?.trim()||String(index);
  return cardKey+':'+heading;
}
function prepareModalSections(){
  const sections=[...app.querySelectorAll('.specified-link-card .pairing-body>section'),...app.querySelectorAll('.combo-editor-card .combo-role')];
  sections.forEach((section,index)=>{
    const trigger=section.querySelector(':scope>strong')||section.querySelector(':scope>header');if(!trigger)return;
    const key=modalSectionKey(section,index);section.dataset.foldKey=key;section.classList.add('foldable-section');
    trigger.classList.add('fold-trigger');trigger.setAttribute('role','button');trigger.setAttribute('tabindex','0');
    const collapsed=collapsedModalSections.has(key);section.classList.toggle('collapsed',collapsed);trigger.setAttribute('aria-expanded',String(!collapsed));
  });
}
function scrollKey(node){if(node.classList.contains('pairing-body'))return 'specified-body';if(node.closest('.combo-editor-card'))return 'combo-body';return '';}
function restoreScrollPositions(){
  app.querySelectorAll('.pairing-body,.combo-editor-card .product-settings-body').forEach(node=>{const key=scrollKey(node);if(key&&scrollMemory.has(key))node.scrollTop=scrollMemory.get(key);});
}
function safeViewport(){
  const viewport=window.visualViewport,width=viewport?.width||window.innerWidth,height=viewport?.height||window.innerHeight;
  const offsetLeft=viewport?.offsetLeft||0,offsetTop=viewport?.offsetTop||0;
  const topbar=document.querySelector('.topbar')?.getBoundingClientRect(),nav=document.querySelector('.bottom-nav')?.getBoundingClientRect();
  return {left:offsetLeft+12,top:Math.max(offsetTop+12,(topbar?.bottom||offsetTop)+12),right:offsetLeft+width-12,bottom:Math.min(offsetTop+height-12,(nav?.top||offsetTop+height)-12)};
}
function preferredSize(card,safe){
  const maxWidth=safe.right-safe.left,maxHeight=safe.bottom-safe.top;
  let width=card.getBoundingClientRect().width||360;
  if(card.classList.contains('order-transfer-card'))width=900;
  else if(card.classList.contains('specified-link-card'))width=640;
  else if(card.classList.contains('combo-editor-card'))width=700;
  else if(card.classList.contains('product-settings-card'))width=760;
  else if(card.classList.contains('modifier-card'))width=320;
  else if(card.classList.contains('completion-card'))width=500;
  else if(card.classList.contains('pending-review-card'))width=720;
  else if(card.classList.contains('pending-panel'))width=420;
  else if(card.classList.contains('side-card'))width=420;
  else if(card.classList.contains('confirm-card'))width=Math.min(460,maxWidth);
  width=Math.min(width,maxWidth);
  let height=card.scrollHeight||card.getBoundingClientRect().height||360;
  if(card.classList.contains('specified-link-card'))height=Math.min(560,maxHeight);
  if(card.classList.contains('combo-editor-card'))height=Math.min(580,maxHeight);
  height=Math.min(height,maxHeight);
  return {width,height,maxWidth,maxHeight};
}
function popoverKey(card){
  if(card.classList.contains('specified-link-card'))return 'specified-link';
  if(card.classList.contains('combo-editor-card'))return 'combo-editor';
  if(card.classList.contains('modifier-card'))return 'modifier';
  return '';
}
function choosePlacement(trigger,width,height,safe,gap=12){
  const spaces={bottom:safe.bottom-trigger.bottom,top:trigger.top-safe.top,right:safe.right-trigger.right,left:trigger.left-safe.left};
  const found=['bottom','top','right','left'].find(side=>spaces[side]>=(side==='bottom'||side==='top'?height:width)+gap);
  return found||Object.entries(spaces).sort((a,b)=>b[1]-a[1])[0][0];
}
function showExternalArrow(placement,size,zIndex=5002){
  const side=placement.side;if(!['bottom','top','right','left'].includes(side)){externalArrow.style.display='none';return;}
  let x=placement.left,y=placement.top,rotate='45deg';
  if(side==='bottom'){x+=Number(placement.pointerX??size.width/2)-7;y-=7;rotate='45deg';}
  else if(side==='top'){x+=Number(placement.pointerX??size.width/2)-7;y+=Number(placement.height||size.height)-7;rotate='225deg';}
  else if(side==='right'){x-=7;y+=Number(placement.pointerY??size.height/2)-7;rotate='-45deg';}
  else{x+=size.width-7;y+=Number(placement.pointerY??size.height/2)-7;rotate='135deg';}
  externalArrow.style.left=Math.round(x)+'px';externalArrow.style.top=Math.round(y)+'px';
  externalArrow.style.transform='rotate('+rotate+')';externalArrow.style.zIndex=String(zIndex);externalArrow.style.display='block';
}
function applyPlacement(card,placement,size,zIndex){
  card.classList.add('is-anchored-popover');
  card.style.left=Math.round(placement.left)+'px';card.style.top=Math.round(placement.top)+'px';card.style.right='auto';card.style.bottom='auto';
  card.style.transform='none';card.style.width=Math.round(size.width)+'px';card.style.height=placement.height?Math.round(placement.height)+'px':'';
  card.style.maxWidth=Math.floor(size.maxWidth)+'px';card.style.maxHeight=Math.floor(size.maxHeight)+'px';card.style.overflow='visible';card.style.zIndex=String(zIndex);
  card.dataset.pointerSide=placement.side;
  if(placement.pointerX!=null)card.style.setProperty('--pointer-x',placement.pointerX+'px');
  if(placement.pointerY!=null)card.style.setProperty('--pointer-y',placement.pointerY+'px');
  card.dataset.popoverPositioned='1';
}
function positionPopover(card,zIndex){
  if(!card||card.dataset.popoverPositioned==='1'){if(card)card.style.zIndex=String(zIndex);return;}
  const safe=safeViewport(),size=preferredSize(card,safe),key=popoverKey(card),remembered=key&&popoverMemory.get(key);
  if(remembered){applyPlacement(card,remembered,size,zIndex);return;}
  const trigger=lastTriggerRect;let side='center',left=safe.left+(size.maxWidth-size.width)/2,top=safe.top+(size.maxHeight-size.height)/2;
  if(trigger){
    side=choosePlacement(trigger,size.width,size.height,safe);
    if(side==='bottom'){left=trigger.left+trigger.width/2-size.width/2;top=trigger.bottom+12;}
    else if(side==='top'){left=trigger.left+trigger.width/2-size.width/2;top=trigger.top-size.height-12;}
    else if(side==='right'){left=trigger.right+12;top=trigger.top+trigger.height/2-size.height/2;}
    else{left=trigger.left-size.width-12;top=trigger.top+trigger.height/2-size.height/2;}
  }
  left=Math.max(safe.left,Math.min(left,safe.right-size.width));top=Math.max(safe.top,Math.min(top,safe.bottom-size.height));
  const placement={left,top,side,height:(card.classList.contains('specified-link-card')||card.classList.contains('combo-editor-card'))?size.height:0};
  if(trigger){placement.pointerX=Math.max(22,Math.min(trigger.left+trigger.width/2-left,size.width-22));placement.pointerY=Math.max(22,Math.min(trigger.top+trigger.height/2-top,size.height-22));}
  if(key)popoverMemory.set(key,placement);applyPlacement(card,placement,size,zIndex);
}
function preparePopovers(){
  const cards=[...app.querySelectorAll('.modal-card,.confirm-card')];
  if(!cards.length){externalArrow.style.display='none';return;}
  cards.forEach((card,index)=>positionPopover(card,1200+index*40));
  const active=cards[cards.length-1],rect=active.getBoundingClientRect();
  if(active?.dataset.popoverPositioned==='1'){
    const placement={left:Number.parseFloat(active.style.left)||rect.left,top:Number.parseFloat(active.style.top)||rect.top,side:active.dataset.pointerSide||'center',pointerX:Number.parseFloat(active.style.getPropertyValue('--pointer-x'))||null,pointerY:Number.parseFloat(active.style.getPropertyValue('--pointer-y'))||null,height:Number.parseFloat(active.style.height)||rect.height};
    showExternalArrow(placement,{width:rect.width,height:rect.height},1220+(cards.length-1)*40);
  }
}
function prepareAll(){
  app.querySelectorAll('.cart-category').forEach(prepareCategory);prepareEditButtons();prepareModalSections();cancelAnimationFrame(prepareFrame);
  prepareFrame=requestAnimationFrame(()=>requestAnimationFrame(()=>{preparePopovers();restoreScrollPositions();}));
}
function toggleCategory(section){const name=categoryName(section);if(!name)return;if(collapsedCategories.has(name))collapsedCategories.delete(name);else collapsedCategories.add(name);prepareCategory(section);}
function toggleModalSection(section){const key=section.dataset.foldKey;if(!key)return;if(collapsedModalSections.has(key))collapsedModalSections.delete(key);else collapsedModalSections.add(key);prepareModalSections();}

app.addEventListener('pointerdown',event=>{
  const trigger=event.target.closest('[data-action]');if(!trigger)return;
  const action=trigger.dataset.action||'';
  if(['dismiss-modal','confirm-cancel','confirm-discard','confirm-save','confirm-dissolve'].includes(action))return;
  const nestedActions=['detail-drink','quick-drink','completion-drink','request-dissolve-combo'];
  const insideModal=Boolean(trigger.closest('.modal-card,.confirm-card'));
  if(insideModal&&!nestedActions.includes(action))return;
  lastTriggerRect=trigger.getBoundingClientRect();popoverMemory.clear();scrollMemory.clear();
});
app.addEventListener('scroll',event=>{const node=event.target.closest?.('.pairing-body,.combo-editor-card .product-settings-body');if(!node)return;const key=scrollKey(node);if(key)scrollMemory.set(key,node.scrollTop);},true);
app.addEventListener('click',event=>{
  const dismiss=event.target.closest('[data-action="dismiss-modal"]');if(dismiss){popoverMemory.clear();scrollMemory.clear();externalArrow.style.display='none';return;}
  const categoryHeader=event.target.closest('.cart-category>header');if(categoryHeader){event.preventDefault();toggleCategory(categoryHeader.parentElement);return;}
  const foldTrigger=event.target.closest('.fold-trigger');if(foldTrigger&&!event.target.closest('[data-action]')){event.preventDefault();toggleModalSection(foldTrigger.closest('.foldable-section'));}
});
app.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  const categoryHeader=event.target.closest('.cart-category>header');if(categoryHeader){event.preventDefault();toggleCategory(categoryHeader.parentElement);return;}
  const foldTrigger=event.target.closest('.fold-trigger');if(foldTrigger){event.preventDefault();toggleModalSection(foldTrigger.closest('.foldable-section'));}
});
function resetAndPosition(){popoverMemory.clear();app.querySelectorAll('.modal-card,.confirm-card').forEach(card=>{card.dataset.popoverPositioned='';});prepareAll();}
addEventListener('resize',resetAndPosition);window.visualViewport?.addEventListener('resize',resetAndPosition);window.visualViewport?.addEventListener('scroll',resetAndPosition);
new MutationObserver(prepareAll).observe(app,{childList:true,subtree:true});
prepareAll();
