function clone(value){
  return typeof structuredClone==='function'?structuredClone(value):JSON.parse(JSON.stringify(value));
}

export function normalizeTerminalId(value='SMT'){
  const id=String(value||'SMT').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
  return id||'SMT';
}

export function nextDraftNumber(drafts,terminalId,counters={}){
  const prefix=normalizeTerminalId(terminalId);
  const highest=(Array.isArray(drafts)?drafts:[]).reduce((max,draft)=>{
    const match=String(draft?.draftNumber||'').match(new RegExp('^'+prefix+'-(\\d+)$'));
    return match?Math.max(max,Number(match[1])):max;
  },Math.max(0,Number(counters?.[prefix]||0)));
  return prefix+'-'+String(highest+1).padStart(2,'0');
}

function event(type,terminalId,at,extra={}){
  return {type,terminalId:normalizeTerminalId(terminalId),at:Number(at),...extra};
}

export function createDraftRecord({cart,terminalId,drafts=[],counters={},session=null,context=null,now=Date.now()}){
  const ownerTerminalId=normalizeTerminalId(terminalId);
  const draftNumber=nextDraftNumber(drafts,ownerTerminalId,counters);
  const previousAudit=clone(session?.audit||[]);
  const originDraftNumber=session?.originDraftNumber||draftNumber;
  const type=previousAudit.length?'draft.resaved':'draft.created';
  return {
    id:'draft-'+ownerTerminalId+'-'+Number(now),
    draftNumber,
    originDraftNumber,
    previousDraftNumber:session?.sourceDraftNumber||null,
    ownerTerminalId,
    cart:clone(Array.isArray(cart)?cart:[]),
    createdAt:Number(now),
    updatedAt:Number(now),
    status:'saved',
    context:context?clone(context):null,
    audit:previousAudit.concat(event(type,ownerTerminalId,now,{draftNumber,originDraftNumber}))
  };
}

export function restoreDraftForTerminal(draft,terminalId,now=Date.now()){
  const activeTerminalId=normalizeTerminalId(terminalId);
  const audit=clone(draft?.audit||[]);
  if(activeTerminalId!==normalizeTerminalId(draft?.ownerTerminalId)){
    audit.push(event('draft.taken_over',activeTerminalId,now,{fromTerminalId:draft.ownerTerminalId,draftNumber:draft.draftNumber}));
  }else{
    audit.push(event('draft.restored',activeTerminalId,now,{draftNumber:draft.draftNumber}));
  }
  return {
    cart:clone(draft?.cart||[]),
    context:draft?.context?clone(draft.context):null,
    session:{
      originDraftNumber:draft?.originDraftNumber||draft?.draftNumber||null,
      sourceDraftNumber:draft?.draftNumber||null,
      activeTerminalId,
      audit
    }
  };
}

export function recordCheckoutOperator(order,terminalId,now=Date.now()){
  const checkoutTerminalId=normalizeTerminalId(terminalId);
  return {
    ...clone(order),checkoutTerminalId,checkedOutByTerminalId:checkoutTerminalId,checkedOutAt:Number(now),
    audit:clone(order?.audit||[]).concat(event('order.checked_out',checkoutTerminalId,now,{orderId:order?.id||''}))
  };
}
