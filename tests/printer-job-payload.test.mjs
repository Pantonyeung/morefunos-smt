import test from 'node:test';
import assert from 'node:assert/strict';
import {assertPrinterPayloadMatchesRoute,buildPrinterJobPayload} from '../pages/more/printer-job-payload.js';

const printer={
  id:'packing-1',name:'打包機',enabled:true,transport:'network',host:'192.168.1.202',port:9100,timeoutMs:5000,
  media:{kind:'roll',widthMm:80},driver:{commandLanguage:'escpos',encoding:'utf-8',cutMode:'partial'},purposes:['packing']
};
const asset={
  documentType:'packing',templateId:'packing-v1',templateVersion:2,commandLanguage:'escpos',
  media:{kind:'roll',widthMm:80},base64:'AQID',byteLength:3,checksum:'sha256:test'
};

test('LAN payload uses Print Job id as idempotency key and exact binary asset',()=>{
  const job={id:'PRINT-ORDER-1-packing',documentType:'packing',copies:2};
  const payload=buildPrinterJobPayload(job,printer,asset);
  assert.equal(payload.contract,'morefun.print.v1');
  assert.equal(payload.idempotencyKey,job.id);
  assert.equal(payload.target.host,'192.168.1.202');
  assert.equal(payload.target.port,9100);
  assert.equal(payload.content.base64,'AQID');
  assert.equal(payload.content.mode,'binary');
  assert.equal(payload.completion.doNotTreatQueuedAsPrinted,true);
  assert.equal(assertPrinterPayloadMatchesRoute(payload,job,printer).ok,true);
});

test('payload blocks asset rendered for the wrong driver language',()=>{
  assert.throws(()=>buildPrinterJobPayload({id:'J1',documentType:'packing'},printer,{...asset,commandLanguage:'tspl'}),/指令語言/);
});

test('payload blocks disabled or incomplete LAN printer configuration',()=>{
  assert.throws(()=>buildPrinterJobPayload({id:'J1'}, {...printer,enabled:false},asset),/停用/);
  assert.throws(()=>buildPrinterJobPayload({id:'J1'}, {...printer,host:''},asset),/IP／Port/);
});
