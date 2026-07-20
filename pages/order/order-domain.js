export function updateCartLineQuantity(cart,lineId,delta,drinkSlotsByProduct={}){
  return cart.flatMap(line=>{
    if(line.lineId!==lineId)return [line];
    const qty=Number(line.qty||0)+Number(delta||0);
    if(qty<=0)return [];
    const slotsPerUnit=Number(drinkSlotsByProduct[line.productId]||0);
    return [{
      ...line,
      qty,
      total:Number(line.unitPrice||0)*qty,
      drinkSlots:slotsPerUnit*qty,
      drinkAssignments:(line.drinkAssignments||[]).slice(0,slotsPerUnit*qty)
    }];
  });
}

export const ORDER_AUTO_COMPLETE_MS=30*60*1000;

export function acceptPendingOrder(order,acceptedAt=Date.now()){
  return {...order,status:'running',acceptedAt,autoCompleteAt:acceptedAt+ORDER_AUTO_COMPLETE_MS};
}

export function completeExpiredOrders(orders,now=Date.now()){
  return orders.map(order=>order.status==='running'&&Number(order.autoCompleteAt)<=now?{...order,status:'completed',completedAt:now}:order);
}

export function createWhatsAppLink(phone,message){
  const normalized=String(phone||'').replace(/\D/g,'');
  return 'https://wa.me/'+normalized+'?text='+encodeURIComponent(String(message||''));
}
