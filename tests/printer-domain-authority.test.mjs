import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAndroidPrintPayload,validatePrinter} from '../pages/more/print-domain.js';

const rollPrinter={
  id:'packing-1',name:'打包機',enabled:true,transport:'network',host:'192.168.1.22',port:9100,
  paperWidth:76,media:{kind:'roll',widthMm:76},driver:{commandLanguage:'escpos',encoding:'utf-8',cutMode:'partial'},
  purposes:['packing'],copies:1,timeoutMs:5000,templateAssignments:{packing:'packing-v1'}
};

const labelPrinter={
  id:'label-riceball',name:'飯團標籤機',enabled:true,transport:'network',host:'192.168.1.23',port:9100,
  paperWidth:60,labelHeight:40,media:{kind:'label',widthMm:60,heightMm:40},driver:{commandLanguage:'tspl',encoding:'utf-8',cutMode:'none'},
  purposes:['label'],copies:1,timeoutMs:5000,templateAssignments:{label:'label-v1'}
};

const asset={
  contract:'morefun.print.asset.v1',documentType:'packing',templateId:'packing-v1',templateVersion:1,
  commandLanguage:'escpos',media:{kind:'roll',widthMm:76},base64:'AQID',byteLength:3,checksum:'sha256:test',renderedAt:1
};

test('Print Domain accepts configurable roll and label dimensions instead of a fixed 50/58/80 list',()=>{
  assert.equal(validatePrinter(rollPrinter).ok,true);
  assert.equal(validatePrinter(labelPrinter).ok,true);
});

test('LAN formal payload rejects legacy text document and requires rendered binary asset',()=>{
  const job={id:'PRINT-1',documentType:'packing',copies:1};
  assert.throws(()=>buildAndroidPrintPayload(job,rollPrinter,{text:'磨飯',paperWidth:76}),/Rendered Binary Asset/);
  const payload=buildAndroidPrintPayload(job,rollPrinter,asset);
  assert.equal(payload.content.mode,'binary');
  assert.equal(payload.content.base64,'AQID');
  assert.equal(payload.target.transport,'tcp');
  assert.equal(payload.completion.doNotTreatQueuedAsPrinted,true);
});
