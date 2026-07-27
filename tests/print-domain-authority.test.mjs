import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAndroidPrintPayload,validatePrinter} from '../pages/more/print-domain.js';

const networkPrinter={
  id:'label-pack',name:'外賣標籤機',enabled:true,transport:'network',host:'192.168.1.204',port:9100,
  media:{kind:'label',widthMm:60,heightMm:40},paperWidth:60,labelHeight:40,purposes:['label'],copies:1,
  templateAssignments:{label:'label-v1'},driver:{commandLanguage:'tspl',encoding:'utf-8',cutMode:'none'}
};

const binaryAsset={
  contract:'morefun.print.asset.v1',documentType:'label',templateId:'label-v1',templateVersion:1,
  commandLanguage:'tspl',media:{kind:'label',widthMm:60,heightMm:40},base64:'AQID',byteLength:3,
  checksum:'sha256:test',renderedAt:1
};

test('Print Domain accepts arbitrary valid media dimensions instead of fixed 50/58/80 widths',()=>{
  assert.equal(validatePrinter(networkPrinter).ok,true);
  const roll={...networkPrinter,id:'packing-1',name:'打包機',media:{kind:'roll',widthMm:72},paperWidth:72,labelHeight:0,purposes:['packing'],templateAssignments:{packing:'packing-v1'},driver:{commandLanguage:'escpos',encoding:'utf-8',cutMode:'partial'}};
  assert.equal(validatePrinter(roll).ok,true);
});

test('LAN production payload only accepts pre-rendered binary asset',()=>{
  const job={id:'PRINT-1',documentType:'label',copies:1};
  const payload=buildAndroidPrintPayload(job,networkPrinter,binaryAsset);
  assert.equal(payload.target.transport,'tcp');
  assert.equal(payload.content.mode,'binary');
  assert.equal(payload.content.base64,'AQID');
  assert.equal(payload.idempotencyKey,'PRINT-1');
  assert.throws(()=>buildAndroidPrintPayload(job,networkPrinter,{text:'磨飯'}),/Rendered Binary Asset/);
});
