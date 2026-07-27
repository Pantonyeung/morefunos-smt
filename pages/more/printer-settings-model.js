import {applyPrinterTransport,normalizePrinterTransport,PRINTER_TRANSPORT_NETWORK} from './printer-transport.js';
import {inferredSupportedDocuments,setPrimaryPrinter,setFallbackPrinter,normalizeFallbackMode} from './printer-routing.js';

const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

export function normalizePrinterDevice(printer={}){
  const transport=normalizePrinterTransport(printer.transport);
  const base=applyPrinterTransport({...printer,enabled:printer.enabled!==false},transport);
  return {
    ...base,
    name:String(base.name||'打印機'),
    model:String(base.model||''),
    paperWidth:Number(base.paperWidth)||80,
    copies:Math.max(1,Number(base.copies)||1),
    timeoutMs:Math.max(1000,Number(base.timeoutMs)||5000),
    supportedDocuments:inferredSupportedDocuments(base)
  };
}

export function updatePrinterDevice(state,printerId,patch={}){
  const next=clone(state||{});
  const index=(next.printers||[]).findIndex(row=>row.id===printerId);
  if(index<0)throw new Error('找不到打印機');
  const current=normalizePrinterDevice(next.printers[index]);
  const requestedTransport=patch.transport??current.transport;
  let updated=applyPrinterTransport({...current,...patch},requestedTransport);
  if(updated.transport===PRINTER_TRANSPORT_NETWORK){
    updated.host=String(patch.host??updated.host??'').trim();
    updated.port=Number(patch.port??updated.port)||9100;
  }
  if(Array.isArray(patch.supportedDocuments))updated.supportedDocuments=[...new Set(patch.supportedDocuments)];
  updated=normalizePrinterDevice(updated);
  next.printers[index]=updated;
  return next;
}

export function configurePrinterRoute(state,documentType,{primaryPrinterId='',fallbackPrinterId='',fallbackMode}={}){
  let next=clone(state||{});
  if(primaryPrinterId)next=setPrimaryPrinter(next,documentType,primaryPrinterId);
  next=setFallbackPrinter(next,documentType,fallbackPrinterId);
  next.fallbackMode=normalizeFallbackMode(fallbackMode??next.fallbackMode);
  return next;
}

export function printerSettingsSnapshot(state={}){
  return {
    printers:(state.printers||[]).map(normalizePrinterDevice),
    routes:{...(state.routes||{})},
    fallbackRoutes:{...(state.fallbackRoutes||{})},
    fallbackMode:normalizeFallbackMode(state.fallbackMode)
  };
}
