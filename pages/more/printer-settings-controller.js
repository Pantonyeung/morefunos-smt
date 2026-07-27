import {updatePrinterDevice,configurePrinterRoute} from './printer-settings-model.js';
import {normalizeMediaProfile,templateSupportsMedia} from './printer-media.js';
import {PRINT_DOCUMENT_TYPES} from './printer-routing.js';

const text=value=>String(value??'').trim();
const number=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;

export function applyPrinterSettingsForm(state,printerId,form={}){
  const documentType=PRINT_DOCUMENT_TYPES.includes(form.documentType)?form.documentType:'receipt';
  const media=normalizeMediaProfile({
    kind:form.mediaKind,
    widthMm:number(form.widthMm,80),
    heightMm:number(form.heightMm,50)
  });
  const template=(state.templates||[]).find(row=>row.id===form.templateId);
  if(!template)throw new Error('請選擇打印模板');
  if(!templateSupportsMedia(template,documentType,media))throw new Error('所選打印模板不支援目前紙張／標籤尺寸');

  let next=updatePrinterDevice(state,printerId,{
    name:text(form.name)||'打印機',
    transport:form.transport,
    host:text(form.host),
    port:number(form.port,9100),
    media,
    paperWidth:media.widthMm,
    labelHeight:media.heightMm,
    copies:Math.max(1,number(form.copies,1)),
    timeoutMs:Math.max(1000,number(form.timeoutMs,5000)),
    supportedDocuments:[documentType]
  });

  const index=(next.printers||[]).findIndex(row=>row.id===printerId);
  if(index<0)throw new Error('找不到打印機');
  next.printers[index]={
    ...next.printers[index],
    purposes:[documentType],
    templateAssignments:{...(next.printers[index].templateAssignments||{}),[documentType]:template.id}
  };

  next=configurePrinterRoute(next,documentType,{
    primaryPrinterId:form.makePrimary===false?'':printerId,
    fallbackPrinterId:text(form.fallbackPrinterId),
    fallbackMode:form.fallbackMode
  });
  return next;
}

export function printerSettingsFormSnapshot(viewModel={}){
  const p=viewModel.printer||{};
  return {
    name:p.name||'',
    documentType:viewModel.primaryDocument||'receipt',
    transport:viewModel.transport?.transport||'sunmi-native',
    host:viewModel.transport?.host||'',
    port:viewModel.transport?.port||0,
    mediaKind:viewModel.media?.kind||'roll',
    widthMm:viewModel.media?.widthMm||80,
    heightMm:viewModel.media?.heightMm||0,
    copies:p.copies||1,
    timeoutMs:p.timeoutMs||5000,
    templateId:viewModel.selectedTemplateId||'',
    fallbackPrinterId:viewModel.fallbackPrinterId||'',
    fallbackMode:viewModel.fallbackMode||'manual'
  };
}
