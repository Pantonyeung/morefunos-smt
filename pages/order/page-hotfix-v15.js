import {ORDER_STORAGE_KEY,quickDrinks,riceOptions,sauceOptions} from './page-data.js';

const snackOptions=['薯角','鹽酥雞','沙律','味噌湯'];
let activeLineId=null;
const clone=v=>JSON.parse(JSON.stringify(v));
const readOrder=()=>{try{return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)||'{}')}catch{return {}}};
const writeOrder=order=>localStorage.setItem(ORDER_STORAGE_KEY,JSON.stringify(order));
const lineById=(cart,id)=>(cart||[]).find(x=>x.lineId===id);
const drinkById=id=>quickDrinks.find(x=>x.id===id);

function preserveInsertionOrder(cart=[]){
  return cart.map((line,index)=>({...line,createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:(Number.isFinite(line._stableOrder)?line._stableOrder:index)})).sort((a,b)=>a.createdOrder-b.createdOrder);
}
function refreshCartOrder(){
  const order=readOrder();
  const sorted=preserveInsertionOrder(order.cart||[]);
  order.cart=sorted;writeOrder(order);
  const list=document.querySelector('.cart-list');if(!list)return;
  const rows=[...list.querySelectorAll('.cart-row')];
  const byId=new Map(rows.map(row=>[row.dataset.id,row]));
  sorted.forEach((line,index)=>{const row=byId.get(line.lineId);if(!row)return;const badge=row.querySelector('.cart-seq');if(badge)badge.textContent=String(index+1);list.appendChild(row);});
}
function ensureProductMeta(){
  document.querySelectorAll('.product').forEach(card=>{
    const meta=card.querySelector('.meta');
    if(meta){meta.style.display='block';meta.style.visibility='visible';meta.style.opacity='1';}
    card.querySelectorAll('h3,small,strong').forEach(el=>{el.style.display='block';el.style.visibility='visible';el.style.opacity='1';});
    const img=card.querySelector('img');if(img&&!img.dataset.hotfixFallback){img.dataset.hotfixFallback='1';img.addEventListener('error',()=>{img.hidden=true;const fallback=img.nextElementSibling;if(fallback)fallback.hidden=false;},{once:true});}
  });
}
function closeEditor(){document.getElementById('v15-editor')?.remove();}
function optionsFor(group){return group==='rice'?riceOptions:group==='sauce'?sauceOptions:snackOptions;}
function renderEditor(request){
  closeEditor();
  const order=readOrder();const line=lineById(order.cart,request.lineId);if(!line)return;
  const qty=Math.max(1,Number(line.qty)||1);let selectedQty=1;let selectedValue=request.value||'';let sweetness='正常甜';let ice='正常冰';
  const drink=request.type==='drink'?drinkById(request.drinkId):null;
  const overlay=document.createElement('div');overlay.id='v15-editor';overlay.className='modal-backdrop';
  const draw=()=>{
    const quantity=qty>1?`<div class="v15-step"><button data-v15="minus" ${selectedQty<=1?'disabled':''}>−</button><strong>${selectedQty}</strong><button data-v15="plus" ${selectedQty>=qty?'disabled':''}>＋</button></div>`:'';
    const opts=request.type==='option'?`<div class="v15-options">${optionsFor(request.group).map(v=>`<button data-v15="pick" data-value="${v}" class="${selectedValue===v?'active':''}">${v}</button>`).join('')}</div>`:`${drink?.options?.includes('sweetness')?`<h3>甜度</h3><div class="v15-options">${['正常甜','多甜','少甜','走甜'].map(v=>`<button data-v15="sweet" data-value="${v}" class="${sweetness===v?'active':''}">${v}</button>`).join('')}</div>`:''}${drink?.options?.includes('ice')?`<h3>冰量</h3><div class="v15-options">${['正常冰','少冰','多冰'].map(v=>`<button data-v15="ice" data-value="${v}" class="${ice===v?'active':''}">${v}</button>`).join('')}</div>`:''}`;
    overlay.innerHTML=`<section class="modal v15-modal"><header><div><h2>${request.type==='option'?'修改選項':drink?.name||'修改飲品'}</h2><small>${line.name} · 共 ${qty} 份</small></div><button data-v15="close" class="close">×</button></header>${quantity}${opts}<button data-v15="apply" class="btn primary" style="width:100%;margin-top:18px" ${request.type==='option'&&!selectedValue?'disabled':''}>套用到 ${selectedQty} 份</button></section>`;
  };
  overlay.addEventListener('click',event=>{
    if(event.target===overlay)return closeEditor();
    const button=event.target.closest('[data-v15]');if(!button)return;
    const action=button.dataset.v15;
    if(action==='close')return closeEditor();
    if(action==='minus')selectedQty=Math.max(1,selectedQty-1);
    if(action==='plus')selectedQty=Math.min(qty,selectedQty+1);
    if(action==='pick')selectedValue=button.dataset.value;
    if(action==='sweet')sweetness=button.dataset.value;
    if(action==='ice')ice=button.dataset.value;
    if(action==='apply'){
      const fresh=readOrder();const index=(fresh.cart||[]).findIndex(x=>x.lineId===request.lineId);if(index<0)return closeEditor();
      const original=clone(fresh.cart[index]);const applyQty=Math.min(original.qty,selectedQty);const slotsPerUnit=original.qty?Number(original.drinkSlots||0)/original.qty:0;const selectedSlots=Math.round(slotsPerUnit*applyQty);
      const edited={...clone(original),lineId:applyQty===original.qty?original.lineId:`${original.lineId}-edit-${Date.now()}`,qty:applyQty,total:Number(original.unitPrice||0)*applyQty,options:{...(original.options||{})},createdOrder:Number.isFinite(original.createdOrder)?original.createdOrder:index};
      if(request.type==='option')edited.options[request.group]=selectedValue;
      else edited.drinkAssignments=Array.from({length:selectedSlots},()=>({drinkId:drink.id,name:drink.name,unitPrice:drink.price,sweetness,ice}));
      const replacement=[edited];
      if(applyQty<original.qty)replacement.push({...clone(original),qty:original.qty-applyQty,total:Number(original.unitPrice||0)*(original.qty-applyQty),drinkSlots:Math.max(0,Number(original.drinkSlots||0)-selectedSlots),drinkAssignments:(original.drinkAssignments||[]).slice(selectedSlots),createdOrder:(Number.isFinite(original.createdOrder)?original.createdOrder:index)+0.001});
      fresh.cart=[...fresh.cart.slice(0,index),...replacement,...fresh.cart.slice(index+1)];writeOrder(fresh);closeEditor();location.reload();return;
    }
    draw();
  });
  draw();document.body.appendChild(overlay);
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-action]');if(!target)return;
  const action=target.dataset.action;
  if(action==='edit')activeLineId=target.dataset.id;
  if(action==='edit-option-request'||action==='edit-drink-request'){
    event.preventDefault();event.stopImmediatePropagation();
    renderEditor({type:action==='edit-option-request'?'option':'drink',lineId:target.dataset.lineId||activeLineId,group:target.dataset.group,value:target.dataset.value,drinkId:target.dataset.value});
  }
  if(action==='clear'){
    event.preventDefault();event.stopImmediatePropagation();
    if(confirm('清空後不可恢復，確定清空整張購物車？')){const order=readOrder();order.cart=[];writeOrder(order);location.reload();}
  }
},true);

const observer=new MutationObserver(()=>{refreshCartOrder();ensureProductMeta();});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('error',event=>{console.error('SMT_V15_GUARD',event.error||event.message);event.preventDefault?.();});
window.addEventListener('unhandledrejection',event=>{console.error('SMT_V15_PROMISE_GUARD',event.reason);event.preventDefault?.();});
refreshCartOrder();ensureProductMeta();
