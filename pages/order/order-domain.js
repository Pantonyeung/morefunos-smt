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
