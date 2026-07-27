import {PRINTER_TRANSPORT_OPTIONS,printerTransportFields} from './printer-transport.js';
import {MEDIA_KIND_ROLL,MEDIA_KIND_LABEL,normalizeMediaProfile,compatibleTemplates} from './printer-media.js';
import {PRINT_DOCUMENT_TYPES,printerCanHandle} from './printer-routing.js';
import {normalizePrinterDevice} from './printer-settings-model.js';

export const PRINT_DOCUMENT_LABELS={receipt:'顧客小票',production:'製作單',packing:'打包單',label:'標籤'};
export const MEDIA_KIND_OPTIONS=[
  {value:MEDIA_KIND_ROLL,label:'卷紙'},
  {value:MEDIA_KIND_LABEL,label:'標籤'}
];

export function printerSettingsViewModel(state,printerId){
  const printer=normalizePrinterDevice((state?.printers||[]).find(row=>row.id===printerId)||{});
  const media=normalizeMediaProfile(printer.media||{}, {widthMm:printer.paperWidth||80,heightMm:printer.labelHeight||50});
  const transport=printerTransportFields(printer);
  const supportedDocuments=(printer.supportedDocuments||[]).filter(type=>PRINT_DOCUMENT_TYPES.includes(type));
  const primaryDocument=supportedDocuments[0]||'receipt';
  const templates=compatibleTemplates(state?.templates||[],primaryDocument,media);
  const routeOptions=(state?.printers||[]).filter(row=>row.id!==printer.id&&printerCanHandle(row,primaryDocument)).map(row=>({value:row.id,label:row.name||row.id}));
  return {
    printer,
    transport,
    media,
    transportOptions:PRINTER_TRANSPORT_OPTIONS,
    mediaKindOptions:MEDIA_KIND_OPTIONS,
    documentOptions:PRINT_DOCUMENT_TYPES.map(value=>({value,label:PRINT_DOCUMENT_LABELS[value]})),
    supportedDocuments,
    primaryDocument,
    templates,
    selectedTemplateId:printer.templateAssignments?.[primaryDocument]||'',
    primaryPrinterId:state?.routes?.[primaryDocument]||'',
    fallbackPrinterId:state?.fallbackRoutes?.[primaryDocument]||'',
    fallbackMode:state?.fallbackMode==='auto'?'auto':'manual',
    fallbackOptions:routeOptions
  };
}

export function printerListViewModels(state={}){
  return (state.printers||[]).map(row=>{
    const printer=normalizePrinterDevice(row);
    const media=normalizeMediaProfile(printer.media||{}, {widthMm:printer.paperWidth||80,heightMm:printer.labelHeight||50});
    return {
      id:printer.id,
      name:printer.name,
      model:printer.model,
      transportLabel:printer.transport==='network'?'LAN TCP/IP':'Sunmi 內置',
      networkTarget:printer.transport==='network'?`${printer.host||'未設定 IP'}:${printer.port||9100}`:'',
      mediaLabel:media.kind===MEDIA_KIND_LABEL?`${media.widthMm}×${media.heightMm} mm`:`${media.widthMm} mm`,
      supportedDocuments:printer.supportedDocuments||[]
    };
  });
}
