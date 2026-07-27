import {applyPrinterTransport,normalizePrinterTransport,PRINTER_TRANSPORT_NETWORK} from './printer-transport.js';
import {inferredSupportedDocuments,setPrimaryPrinter,setFallbackPrinter,normalizeFallbackMode} from './printer-routing.js';
import {applyMediaProfile,normalizeMediaProfile,compatibleTemplates,templateSupportsMedia} from './printer-media.js';

const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));

export function normalizePrinterDevice(printer={}){
  const transport=normalizePrinterTransport(printer.transport);
  const base=applyPrinterTransport({...printer,enabled:printer.enabled!==false},transport);
  const media=normalizeMediaProfile(base.media||{}, {
    widthMm:base.paperWidth||80,
    heightMm:base.labelHeight||50
  });
  const withMedia=applyMediaProfile(base,media);
  return {
    ...withMedia,
    name:String(withMedia.name||'打印機'),
    model:String(withMedia.model||''),
    copies:Math.max(1,Number(withMedia.copies)||1),
    timeoutMs:Math.max(1000,Number(withMedia.timeoutMs)||5000),
    supportedDocuments:inferredSupportedDocuments(withMedia),
    templateAssignments:{...(withMedia.templateAssignments||{})}
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
  if(patch.media||patch.paperWidth||patch.labelHeight){
    const requestedMedia=patch.media||{
      ...current.media,
      widthMm:patch.paperWidth??current.media.widthMm,
      heightMm:patch.labelHeight??current.media.heightMm
    };
    updated=applyMediaProfile(updated,requestedMedia);
  }
  if(Array.isArray(patch.supportedDocuments))updated.supportedDocuments=[...new Set(patch.supportedDocuments)];
  updated=normalizePrinterDevice(updated);
  next.printers[index]=updated;
  return next;
}

export function availableTemplatesForPrinter(state,printerId,documentType){
  const printer=(state?.printers||[]).find(row=>row.id===printerId);
  if(!printer)return [];
  const normalized=normalizePrinterDevice(printer);
  if(!normalized.supportedDocuments.includes(documentType))return [];
  return compatibleTemplates(state?.templates||[],documentType,normalized.media);
}

export function assignPrinterTemplate(state,printerId,documentType,templateId){
  const next=clone(state||{});
  const index=(next.printers||[]).findIndex(row=>row.id===printerId);
  if(index<0)throw new Error('找不到打印機');
  const printer=normalizePrinterDevice(next.printers[index]);
  if(!printer.supportedDocuments.includes(documentType))throw new Error('打印機不支援此文件類型');
  const template=(next.templates||[]).find(row=>row.id===templateId&&row.status==='published');
  if(!template)throw new Error('找不到可用打印模板');
  if(!templateSupportsMedia(template,documentType,printer.media))throw new Error('打印模板與目前紙張尺寸不兼容');
  printer.templateAssignments={...(printer.templateAssignments||{}),[documentType]:templateId};
  next.printers[index]=printer;
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
    templates:(state.templates||[]).map(clone),
    routes:{...(state.routes||{})},
    fallbackRoutes:{...(state.fallbackRoutes||{})},
    fallbackMode:normalizeFallbackMode(state.fallbackMode)
  };
}
