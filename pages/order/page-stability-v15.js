import {ORDER_STORAGE_KEY} from './page-data.js';

const nativeAppend=Element.prototype.appendChild;
Element.prototype.appendChild=function(child){
  if(this.classList?.contains('cart-list')&&child?.parentNode===this)return child;
  return nativeAppend.call(this,child);
};

function readCart(){try{return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)||'{}').cart||[]}catch{return []}}
function reorderCart(){
  const list=document.querySelector('.cart-list');if(!list)return;
  const cart=readCart().map((line,index)=>({...line,createdOrder:Number.isFinite(line.createdOrder)?line.createdOrder:(Number.isFinite(line._stableOrder)?line._stableOrder:index)})).sort((a,b)=>a.createdOrder-b.createdOrder);
  const rows=[...list.querySelectorAll('.cart-row')];
  const map=new Map(rows.map(row=>[row.dataset.id,row]));
  const current=rows.map(row=>row.dataset.id).join('|');
  const desired=cart.map(line=>line.lineId).join('|');
  cart.forEach((line,index)=>{const row=map.get(line.lineId);const badge=row?.querySelector('.cart-seq');if(badge)badge.textContent=String(index+1);});
  if(current!==desired)cart.forEach(line=>{const row=map.get(line.lineId);if(row)nativeAppend.call(list,row);});
}

const observer=new MutationObserver(()=>queueMicrotask(reorderCart));
observer.observe(document.documentElement,{childList:true,subtree:true});
reorderCart();
