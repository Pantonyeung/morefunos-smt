export const ORDER_ACTION={
  REOPEN:'reopen',
  VOID_ITEM:'void_item',
  DUPLICATE:'duplicate'
};

export const MANAGER_ACTIONS=new Set([ORDER_ACTION.REOPEN,ORDER_ACTION.VOID_ITEM]);

function nowMs(value){return Number.isFinite(Number(value))?Number(value):Date.now();}
function clone(value){return JSON.parse(JSON.stringify(value));}

export function canPerformOrderAction(action,actor={}){
  if(!MANAGER_ACTIONS.has(action))return Boolean(actor?.staffId);
  return Boolean(actor?.staffId)&&actor?.managerAuthorized===true;
}

export function createAuditEntry({action,orderId,actor,reason='',at=Date.now(),meta={}}){
  if(!action)throw new Error('AUDIT_ACTION_REQUIRED');
  if(!orderId)throw new Error('AUDIT_ORDER_REQUIRED');
  if(!actor?.staffId)throw new Error('AUDIT_ACTOR_REQUIRED');
  return {
    id:`audit-${orderId}-${nowMs(at)}-${action}`,
    action,
    orderId,
    staffId:String(actor.staffId),
    staffName:String(actor.staffName||''),
    managerAuthorized:actor.managerAuthorized===true,
    reason:String(reason||'').trim(),
    at:nowMs(at),
    meta:clone(meta||{})
  };
}

export function reopenCompletedOrder(order,{actor,reason='',at=Date.now()}={}){
  if(order?.status!=='completed')throw new Error('ORDER_NOT_COMPLETED');
  if(!canPerformOrderAction(ORDER_ACTION.REOPEN,actor))throw new Error('MANAGER_AUTH_REQUIRED');
  const reopenedAt=nowMs(at);
  const next={...clone(order),status:'running',reopenedAt,completedAt:null,autoCompleteAt:null};
  const audit=createAuditEntry({action:ORDER_ACTION.REOPEN,orderId:order.id||order.orderId,actor,reason,at:reopenedAt});
  return {order:next,audit};
}

export function voidOrderItem(order,lineId,{actor,reason='',at=Date.now()}={}){
  const cleanReason=String(reason||'').trim();
  if(!cleanReason)throw new Error('VOID_REASON_REQUIRED');
  if(!canPerformOrderAction(ORDER_ACTION.VOID_ITEM,actor))throw new Error('MANAGER_AUTH_REQUIRED');
  const lines=Array.isArray(order?.lines)?order.lines:[];
  const index=lines.findIndex(line=>line.lineId===lineId);
  if(index<0)throw new Error('ORDER_LINE_NOT_FOUND');
  const voidedAt=nowMs(at);
  const target=lines[index];
  const nextLines=lines.map((line,i)=>i===index?{
    ...clone(line),
    voided:true,
    voidReason:cleanReason,
    voidedAt,
    voidedBy:String(actor.staffId)
  }:clone(line));
  const next={...clone(order),lines:nextLines};
  const audit=createAuditEntry({
    action:ORDER_ACTION.VOID_ITEM,
    orderId:order.id||order.orderId,
    actor,
    reason:cleanReason,
    at:voidedAt,
    meta:{lineId,productId:target.productId||'',qty:Number(target.qty||0)}
  });
  return {order:next,audit};
}

export function duplicateOrderForNewCart(order,{idFactory,at=Date.now()}={}){
  const makeId=idFactory||((line,index)=>`dup-${line.lineId||index}-${nowMs(at)}-${index}`);
  const lines=(order?.lines||[])
    .filter(line=>line?.voided!==true)
    .map((line,index)=>({
      ...clone(line),
      lineId:makeId(line,index),
      createdOrder:index,
      voided:false,
      voidReason:'',
      voidedAt:null,
      voidedBy:''
    }));
  return {
    sourceOrderId:order?.id||order?.orderId||'',
    cart:lines,
    duplicatedAt:nowMs(at)
  };
}
