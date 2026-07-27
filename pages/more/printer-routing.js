const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

export const PRINT_DOCUMENT_TYPES=['receipt','production','packing','label'];
export const FALLBACK_MODES=['manual','auto'];

export function normalizeFallbackMode(value){
  return value==='auto'?'auto':'manual';
}

export function inferredSupportedDocuments(printer={}){
  if(Array.isArray(printer.supportedDocuments)&&printer.supportedDocuments.length)return [...new Set(printer.supportedDocuments.filter(type=>PRINT_DOCUMENT_TYPES.includes(type)))];
  const width=Number(printer.paperWidth||0);
  const purposes=Array.isArray(printer.purposes)?printer.purposes:[];
  const labelLike=width>0&&width<=58||purposes.includes('label')||purposes.includes('label-backup');
  if(labelLike)return ['label'];
  return ['receipt','production','packing'];
}

export function printerCanHandle(printer,documentType){
  if(!printer?.enabled||!PRINT_DOCUMENT_TYPES.includes(documentType))return false;
  return inferredSupportedDocuments(printer).includes(documentType);
}

export function normalizePrinterRouting(state={}){
  const routes={...(state.routes||{})};
  const fallbackRoutes={...(state.fallbackRoutes||{})};
  const fallbackMode=normalizeFallbackMode(state.fallbackMode);
  return {...clone(state),routes,fallbackRoutes,fallbackMode};
}

export function setPrimaryPrinter(state,documentType,printerId){
  if(!PRINT_DOCUMENT_TYPES.includes(documentType))throw new Error('打印用途不支援');
  const next=normalizePrinterRouting(state);
  const printer=(next.printers||[]).find(row=>row.id===printerId);
  if(!printerCanHandle(printer,documentType))throw new Error('所選打印機不支援此文件類型');
  next.routes[documentType]=printerId;
  if(next.fallbackRoutes[documentType]===printerId)delete next.fallbackRoutes[documentType];
  return next;
}

export function setFallbackPrinter(state,documentType,printerId=''){
  if(!PRINT_DOCUMENT_TYPES.includes(documentType))throw new Error('打印用途不支援');
  const next=normalizePrinterRouting(state);
  if(!printerId){delete next.fallbackRoutes[documentType];return next;}
  const printer=(next.printers||[]).find(row=>row.id===printerId);
  if(!printerCanHandle(printer,documentType))throw new Error('所選後備打印機不支援此文件類型');
  if(next.routes[documentType]===printerId)throw new Error('主打印機與後備打印機不可相同');
  next.fallbackRoutes[documentType]=printerId;
  return next;
}

export function resolvePrinterRoute(state,documentType,{primaryUnavailable=false}={}){
  const next=normalizePrinterRouting(state);
  const printers=next.printers||[];
  const primaryId=next.routes[documentType]||'';
  const fallbackId=next.fallbackRoutes[documentType]||'';
  const primary=printers.find(row=>row.id===primaryId&&printerCanHandle(row,documentType))||null;
  const fallback=printers.find(row=>row.id===fallbackId&&printerCanHandle(row,documentType))||null;
  if(!primaryUnavailable&&primary)return {printer:primary,route:'primary',fallbackAvailable:Boolean(fallback)};
  if(fallback)return {printer:fallback,route:'fallback',fallbackAvailable:true};
  if(primary)return {printer:primary,route:'primary',fallbackAvailable:false};
  const compatible=printers.find(row=>printerCanHandle(row,documentType))||null;
  return {printer:compatible,route:compatible?'compatible':'none',fallbackAvailable:false};
}

export function failoverPrintJob(job,state,{reason='primary_unavailable',now=Date.now()}={}){
  const route=resolvePrinterRoute(state,job?.documentType,{primaryUnavailable:true});
  if(!route.printer)throw new Error('未有可用後備打印機');
  if(route.printer.id===job?.printerId)throw new Error('未有不同的後備打印機');
  return {
    ...clone(job),
    printerId:route.printer.id,
    status:'queued',
    bridgeStatus:'waiting_bridge',
    updatedAt:Number(now),
    failoverFromPrinterId:job?.printerId||'',
    failoverReason:reason,
    history:[...(job?.history||[]),{type:'print_job.failover',at:Number(now),fromPrinterId:job?.printerId||'',toPrinterId:route.printer.id,reason}]
  };
}
