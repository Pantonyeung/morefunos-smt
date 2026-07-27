import test from 'node:test';
import assert from 'node:assert/strict';
import {MEDIA_KIND_ROLL,MEDIA_KIND_LABEL,applyMediaProfile,templateSupportsMedia,compatibleTemplates,templateLayoutScale} from '../pages/more/printer-media.js';

test('receipt production and packing printers are not hardcoded to 80mm',()=>{
  const printer=applyMediaProfile({id:'packing-1',paperWidth:80},{kind:MEDIA_KIND_ROLL,widthMm:58});
  assert.equal(printer.media.kind,MEDIA_KIND_ROLL);
  assert.equal(printer.media.widthMm,58);
  assert.equal(printer.paperWidth,58);
});

test('label printers support configurable width and height',()=>{
  const printer=applyMediaProfile({id:'label-1',paperWidth:50,labelHeight:30},{kind:MEDIA_KIND_LABEL,widthMm:60,heightMm:40});
  assert.deepEqual(printer.media,{kind:MEDIA_KIND_LABEL,widthMm:60,heightMm:40});
  assert.equal(printer.paperWidth,60);
  assert.equal(printer.labelHeight,40);
});

test('templates can be filtered by document type and media range',()=>{
  const templates=[
    {id:'a',documentType:'receipt',status:'published',minWidthMm:55,maxWidthMm:82,designWidthMm:80},
    {id:'b',documentType:'receipt',status:'published',minWidthMm:76,maxWidthMm:82,designWidthMm:80},
    {id:'c',documentType:'label',status:'published',minWidthMm:40,maxWidthMm:70,minHeightMm:20,maxHeightMm:60,designWidthMm:50}
  ];
  const roll={kind:MEDIA_KIND_ROLL,widthMm:58};
  assert.equal(templateSupportsMedia(templates[0],'receipt',roll),true);
  assert.equal(templateSupportsMedia(templates[1],'receipt',roll),false);
  assert.deepEqual(compatibleTemplates(templates,'receipt',roll).map(x=>x.id),['a']);
  assert.equal(templateSupportsMedia(templates[2],'label',{kind:MEDIA_KIND_LABEL,widthMm:60,heightMm:40}),true);
});

test('template layout scale follows selected media width',()=>{
  assert.deepEqual(templateLayoutScale({designWidthMm:80},{kind:MEDIA_KIND_ROLL,widthMm:58}),{scale:0.725,widthMm:58,heightMm:0});
});
