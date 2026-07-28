export const INCOMING_STATUS_PENDING='pending';
export const INCOMING_STATUS_ACCEPTED='accepted';
export const INCOMING_STATUS_REJECTED='rejected';

const SOURCE_GROUP={
  '現場':'onsite',
  '電話／WhatsApp':'owned',
  '電話':'owned',
  'WhatsApp':'owned',
  '磨飯 App':'owned',
  '磨飯 Web':'owned',
  'Keeta':'platform',
  'Foodpanda':'platform'
};

export function normalizeIncomingOrder(raw={},now=Date.now()){
  const source=String(raw.source||'').trim();
  const externalId=String(raw.externalId||raw.id||'').trim();
  const idempotencyKey=String(raw.idempotencyKey||`${source}:${externalId}`).trim();
  if(!source)throw new Error('incoming source required');
  if(!externalId)throw new Error('incoming externalId required');
  if(!idempotencyKey)throw new Error('incoming idempotencyKey required');
  const items=Array.isArray(raw.items)?raw.items.map(item=>({...item,qty:Math.max(1,Number(item.qty)||1)})):[];
  return {
    intakeId:String(raw.intakeId||`in-${idempotencyKey}`),
    externalId,
    idempotencyKey,
    source,
    group:SOURCE_GROUP[source]||'owned',
    status:raw.status||INCOMING_STATUS_PENDING,
    receivedAt:Number(raw.receivedAt||now),
    customer:raw.customer?{...raw.customer}:null,
    payment:raw.payment?{...raw.payment}:null,
    channelData:raw.channelData?{...raw.channelData}:{},
    items,
    amount:Number(raw.amount)||items.reduce((sum,item)=>sum+Number(item.total||0),0)
  };
}

export function enqueueIncoming(queue=[],raw={},now=Date.now()){
  const next=normalizeIncomingOrder(raw,now);
  const duplicate=(queue||[]).find(item=>item.idempotencyKey===next.idempotencyKey);
  if(duplicate)return {queue:[...(queue||[])],item:duplicate,duplicate:true};
  return {queue:[...(queue||[]),next],item:next,duplicate:false};
}

export function acceptIncoming(queue=[],intakeId,acceptedAt=Date.now()){
  let accepted=null;
  const next=(queue||[]).map(item=>{
    if(item.intakeId!==intakeId)return item;
    if(item.status!==INCOMING_STATUS_PENDING)throw new Error('incoming order not pending');
    accepted={...item,status:INCOMING_STATUS_ACCEPTED,acceptedAt};
    return accepted;
  });
  if(!accepted)throw new Error('incoming order not found');
  return {queue:next,item:accepted};
}

export function rejectIncoming(queue=[],intakeId,reason,rejectedAt=Date.now()){
  const cleanReason=String(reason||'').trim();
  if(!cleanReason)throw new Error('reject reason required');
  let rejected=null;
  const next=(queue||[]).map(item=>{
    if(item.intakeId!==intakeId)return item;
    if(item.status!==INCOMING_STATUS_PENDING)throw new Error('incoming order not pending');
    rejected={...item,status:INCOMING_STATUS_REJECTED,rejectReason:cleanReason,rejectedAt};
    return rejected;
  });
  if(!rejected)throw new Error('incoming order not found');
  return {queue:next,item:rejected};
}

export function pendingIncoming(queue=[]){
  return (queue||[]).filter(item=>item.status===INCOMING_STATUS_PENDING).sort((a,b)=>Number(a.receivedAt)-Number(b.receivedAt));
}
