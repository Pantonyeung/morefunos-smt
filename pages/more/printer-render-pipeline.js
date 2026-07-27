import {buildPrintLayoutPlan,validatePrintLayoutPlan} from './printer-template-layout.js';
import {rasterizePrintLayout} from './printer-browser-rasterizer.js';
import {renderRasterPrintAsset} from './printer-command-renderer.js';

export function renderDocumentForPrinter(document={},printer={},options={}){
  const plan=buildPrintLayoutPlan(document,printer,options.layout||{});
  const validation=validatePrintLayoutPlan(plan);
  if(!validation.ok)throw new Error(validation.errors.join('；'));
  const rasterizer=options.rasterizer||rasterizePrintLayout;
  const raster=rasterizer(plan,options.raster||{});
  return renderRasterPrintAsset({
    raster,
    documentType:document.documentType,
    templateId:document.templateId,
    templateVersion:document.templateVersion,
    printer,
    now:options.now
  });
}
