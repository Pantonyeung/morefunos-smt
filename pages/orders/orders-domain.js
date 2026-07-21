const activeStatuses=new Set(['running','active','open','']);
export function channelGroup(source){
  if(source==='堂食'||source==='現場外賣')return 'onsite';
  if(source==='磨飯 App'||source==='電話／WhatsApp')return 'owned';
  return 'platform';
}
const event=(type,terminalId,at,detail={})=>({type,terminalId,at,...detail});
export function isHistory(order){return !activeStatuses.has(order.status||'');}
export function applyOrderFilters(orders,{source='all',exception='',view='active'}={}){
  return orders.filter(order=>{
    if(view==='active'&&isHistory(order))return false;
    if(view==='history'&&!isHistory(order))return false;
    if(source!=='all'&&order.group!==source)return false;
    if(exception==='payment'&&!String(order.paymentStatus||'').includes('待'))return false;
    if(exception==='print'&&order.printStatus!=='異常')return false;
    return true;
  });
}
export function changeOrderPayment(order,{source,paymentMethod},terminalId,at=Date.now()){
  return {...order,source,group:channelGroup(source),paymentMethod,audit:[...(order.audit||[]),event('order_payment_changed',terminalId,at,{source,paymentMethod})]};
}
export function partiallyCancelItem(order,itemIndex,quantity,terminalId,at=Date.now()){
  const items=(order.items||[]).map(x=>({...x}));
  const item=items[itemIndex],cancelQty=Math.min(Number(quantity)||0,Number(item?.qty)||0);
  if(!item||cancelQty<1)return order;
  const perUnit=Number(item.total||0)/Math.max(1,Number(item.qty)||1);
  item.qty-=cancelQty; item.cancelledQty=Number(item.cancelledQty||0)+cancelQty; item.total=Math.max(0,Number(item.total||0)-perUnit*cancelQty);
  return {...order,items,itemCount:items.reduce((n,x)=>n+Number(x.qty||0),0),amount:Math.max(0,Number(order.amount||0)-perUnit*cancelQty),version:Number(order.version||1)+1,audit:[...(order.audit||[]),event('order_item_partially_cancelled',terminalId,at,{itemIndex,quantity:cancelQty,amount:perUnit*cancelQty})]};
}
export function cancelOrder(order,terminalId,at=Date.now()){
  return {...order,status:'cancelled',cancelledAt:at,version:Number(order.version||1)+1,audit:[...(order.audit||[]),event('order_cancelled',terminalId,at)]};
}
export function queueReprint(order,documents,terminalId,at=Date.now()){
  const job={id:'PRINT-'+order.id+'-'+at,documents,status:'queued',terminalId,createdAt:at};
  return {...order,printStatus:'已排隊',printJobs:[...(order.printJobs||[]),job],audit:[...(order.audit||[]),event('order_reprint_queued',terminalId,at,{documents})]};
}
