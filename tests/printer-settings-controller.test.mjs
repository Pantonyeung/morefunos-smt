import test from 'node:test';
import assert from 'node:assert/strict';
import {applyPrinterSettingsForm,printerSettingsFormSnapshot} from '../pages/more/printer-settings-controller.js';
import {printerSettingsViewModel} from '../pages/more/printer-settings-ui-model.js';

const base={
  printers:[
    {id:'receipt-1',name:'小票機',enabled:true,transport:'network',host:'10.0.0.20',port:9100,media:{kind:'roll',widthMm:58},paperWidth:58,purposes:['receipt'],templateAssignments:{receipt:'receipt-58'}},
    {id:'packing-1',name:'打包機',enabled:true,transport:'network',host:'10.0.0.21',port:9101,media:{kind:'roll',widthMm:80},paperWidth:80,purposes:['packing']}
  ],
  templates:[
    {id:'receipt-58',name:'58mm 小票',documentType:'receipt',status:'published',minWidthMm:55,maxWidthMm:60},
    {id:'receipt-80',name:'80mm 小票',documentType:'receipt',status:'published',minWidthMm:76,maxWidthMm:82}
  ],
  routes:{receipt:'receipt-1',packing:'packing-1'},fallbackRoutes:{},fallbackMode:'manual'
};

test('controller applies transport, media, template and fallback in one transaction',()=>{
  const next=applyPrinterSettingsForm(base,'receipt-1',{
    name:'前台小票機',documentType:'receipt',transport:'network',host:'192.168.1.88',port:9100,
    mediaKind:'roll',widthMm:58,copies:2,timeoutMs:6000,templateId:'receipt-58',fallbackPrinterId:'packing-1',fallbackMode:'auto'
  });
  const printer=next.printers.find(x=>x.id==='receipt-1');
  assert.equal(printer.name,'前台小票機');
  assert.equal(printer.host,'192.168.1.88');
  assert.equal(printer.media.widthMm,58);
  assert.equal(printer.templateAssignments.receipt,'receipt-58');
  assert.equal(next.fallbackRoutes.receipt,'packing-1');
  assert.equal(next.fallbackMode,'auto');
});

test('controller rejects template/media mismatch',()=>{
  assert.throws(()=>applyPrinterSettingsForm(base,'receipt-1',{
    documentType:'receipt',transport:'network',host:'192.168.1.88',port:9100,mediaKind:'roll',widthMm:58,
    templateId:'receipt-80',fallbackPrinterId:'packing-1'
  }),/不支援目前紙張／標籤尺寸/);
});

test('form snapshot is derived from the shared UI model',()=>{
  const vm=printerSettingsViewModel(base,'receipt-1');
  const form=printerSettingsFormSnapshot(vm);
  assert.equal(form.documentType,'receipt');
  assert.equal(form.widthMm,58);
  assert.equal(form.templateId,'receipt-58');
});
