import test from 'node:test';
import assert from 'node:assert/strict';
import {renderDocumentForPrinter} from '../pages/more/printer-render-pipeline.js';

const fakeRasterizer=plan=>({widthDots:plan.widthDots,heightDots:plan.heightDots,data:new Uint8Array(Math.ceil(plan.widthDots/8)*plan.heightDots)});

test('roll document renders through one pipeline into ESC/POS binary asset',()=>{
  const printer={media:{kind:'roll',widthMm:58},driver:{commandLanguage:'escpos',cutMode:'partial',dotsPerMm:8}};
  const asset=renderDocumentForPrinter({documentType:'receipt',templateId:'receipt-v1',templateVersion:3,lines:['磨飯','訂單：P001']},printer,{rasterizer:fakeRasterizer,now:123});
  assert.equal(asset.contract,'morefun.print.asset.v1');
  assert.equal(asset.commandLanguage,'escpos');
  assert.equal(asset.documentType,'receipt');
  assert.ok(asset.base64.length>0);
});

test('label document renders through same pipeline into TSPL binary asset',()=>{
  const printer={media:{kind:'label',widthMm:60,heightMm:40},driver:{commandLanguage:'tspl',density:8,speed:4,dotsPerMm:8}};
  const asset=renderDocumentForPrinter({documentType:'label',templateId:'label-v1',templateVersion:2,lines:['磨飯','飯團 1/1']},printer,{rasterizer:fakeRasterizer,now:123});
  assert.equal(asset.commandLanguage,'tspl');
  assert.equal(asset.media.widthMm,60);
  assert.equal(asset.media.heightMm,40);
});
