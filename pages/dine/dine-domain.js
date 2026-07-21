const TABLE_IDS=['1','2','3','4','5','6','7','8','戶外'];

const clone=value=>JSON.parse(JSON.stringify(value));

export function createInitialDineState(now=Date.now()){
  return {
    tables:TABLE_IDS.map(id=>({id,status:'free',openedAt:null,session:null})),
    waiting:[],
    selectedTableId:null,
    panel:null,
    createdAt:now
  };
}

export function tableView(table,now=Date.now()){
  const occupied=table.status==='occupied';
  const minutes=occupied&&table.openedAt?Math.max(0,Math.floor((now-table.openedAt)/60_000)):0;
  const session=table.session||table;
  const items=session.items||[];
  const total=items.reduce((sum,item)=>sum+Number(item.unitPrice||0)*Number(item.qty||0),0);
  const paid=items.reduce((sum,item)=>sum+Number(item.unitPrice||0)*Number(item.paidQty||0),0);
  return {...table,status:occupied?'occupied':'free',minutes,isLate:occupied&&minutes>=35,total,paid,unpaid:Math.max(0,total-paid),pendingCount:(session.pendingSubmissions||[]).length};
}

export function openTable(table,now=Date.now()){
  if(table.status==='occupied')return clone(table);
  return {...clone(table),status:'occupied',openedAt:now,session:{id:`DINE-${table.id}-${now}`,items:[],orderBatches:[],pendingSubmissions:[],payments:[]}};
}

export function applyItemPayment(session,selections,method,now=Date.now()){
  if(!method)throw new Error('必須選擇付款方式');
  const next=clone(session);
  let amount=0;
  for(const selected of selections){
    const item=next.items.find(entry=>entry.lineId===selected.lineId);
    const qty=Number(selected.qty);
    if(!item||!Number.isInteger(qty)||qty<=0)throw new Error('付款餐品資料無效');
    const unpaid=Number(item.qty)-Number(item.paidQty||0);
    if(qty>unpaid)throw new Error('超出未付數量');
    item.paidQty=Number(item.paidQty||0)+qty;
    amount+=qty*Number(item.unitPrice||0);
  }
  if(!amount)throw new Error('未有選擇付款餐品');
  next.payments.push({id:`PAY-${now}-${next.payments.length+1}`,method,amount,selections:clone(selections),createdAt:now});
  return next;
}

export function applyFullPayment(session,method,now=Date.now()){
  const selections=(session.items||[]).map(item=>({lineId:item.lineId,qty:Number(item.qty)-Number(item.paidQty||0)})).filter(item=>item.qty>0);
  return applyItemPayment(session,selections,method,now);
}

export function acceptQrSubmission(session,submissionId,now=Date.now()){
  const next=clone(session);
  const index=next.pendingSubmissions.findIndex(entry=>entry.id===submissionId);
  if(index<0)throw new Error('找不到待確認落單');
  const [submission]=next.pendingSubmissions.splice(index,1);
  const items=(submission.items||[]).map((item,itemIndex)=>({...item,lineId:item.lineId||`${submission.id}-${itemIndex+1}`,paidQty:Number(item.paidQty||0)}));
  next.items.push(...items);
  next.orderBatches.push({id:submission.id,source:'QR',createdAt:submission.createdAt||now,acceptedAt:now,items:clone(items)});
  return next;
}
