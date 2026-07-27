import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPrintLayoutPlan,validatePrintLayoutPlan,wrapPrintText} from '../pages/more/printer-template-layout.js';

test('layout plan follows arbitrary printer media width instead of fixed presets',()=>{
  const plan=buildPrintLayoutPlan({documentType:'packing',templateId:'packing-v1',templateVersion:1,lines:['磨飯 打包單','雞肉便當 ×2']},{media:{kind:'roll',widthMm:72},driver:{dotsPerMm:8}});
  assert.equal(plan.widthDots,576);
  assert.equal(plan.media.widthMm,72);
  assert.equal(validatePrintLayoutPlan(plan).ok,true);
});

test('roll media grows vertically with document content',()=>{
  const shortPlan=buildPrintLayoutPlan({documentType:'receipt',templateId:'r1',lines:['磨飯']},{media:{kind:'roll',widthMm:58},driver:{dotsPerMm:8}});
  const longPlan=buildPrintLayoutPlan({documentType:'receipt',templateId:'r1',lines:['磨飯','第一項','第二項','第三項']},{media:{kind:'roll',widthMm:58},driver:{dotsPerMm:8}});
  assert.equal(shortPlan.media.heightMm,0);
  assert.ok(longPlan.heightDots>shortPlan.heightDots);
  assert.equal(validatePrintLayoutPlan(longPlan).ok,true);
});

test('CJK characters consume wider layout units and wrap predictably',()=>{
  assert.deepEqual(wrapPrintText('AB磨飯CD',6),['AB磨飯','CD']);
});

test('fixed label media reports overflow instead of silently clipping',()=>{
  const plan=buildPrintLayoutPlan({documentType:'label',templateId:'label-v1',templateVersion:1,lines:Array.from({length:20},(_,i)=>`第${i+1}行`)},{media:{kind:'label',widthMm:60,heightMm:20},driver:{dotsPerMm:8}});
  assert.equal(plan.overflow,true);
  assert.equal(validatePrintLayoutPlan(plan).ok,false);
});
