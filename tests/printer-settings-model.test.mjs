import test from 'node:test';
import assert from 'node:assert/strict';
import {assignPrinterTemplate,availableTemplatesForPrinter,configurePrinterRoute,printerSettingsSnapshot,updatePrinterDevice} from '../pages/more/printer-settings-model.js';

const base={
  printers:[
    {id:'receipt-1',name:'小票機',enabled:true,transport:'sunmi-native',media:{kind:'roll',widthMm:80},purposes:['receipt']},
    {id:'kitchen-1',name:'後廚機',enabled:true,transport:'network',media:{kind:'roll',widthMm:80},purposes:['production'],host:'192.168.1.201',port:9100},
    {id:'packing-1',name:'打包機',enabled:true,transport:'network',media:{kind:'roll',widthMm:80},purposes:['packing'],host:'192.168.1.202',port:9100},
    {id:'label-riceball',name:'飯團標籤機',enabled:true,transport:'network',media:{kind:'label',widthMm:50,heightMm:30},purposes:['label'],host:'192.168.1.203',port:9100},
    {id:'label-pack',name:'外賣標籤機',enabled:true,transport:'network',media:{kind:'label',widthMm:50,heightMm:30},purposes:['label-backup'],host:'192.168.1.204',port:9100}
  ],
  templates:[
    {id:'receipt-wide',documentType:'receipt',status:'published',minWidthMm:76,maxWidthMm:90,designWidthMm:80},
    {id:'receipt-compact',documentType:'receipt',status:'published',minWidthMm:55,maxWidthMm:70,designWidthMm:58},
    {id:'packing-flex',documentType:'packing',status:'published',minWidthMm:55,maxWidthMm:90,designWidthMm:80},
    {id:'label-flex',documentType:'label',status:'published',minWidthMm:40,maxWidthMm:70,minHeightMm:20,maxHeightMm:60,designWidthMm:50}
  ],
  routes:{receipt:'receipt-1',production:'kitchen-1',packing:'packing-1',label:'label-riceball'},
  fallbackRoutes:{},fallbackMode:'manual'
};

test('all five printers can independently update LAN address and port',()=>{
  let state=base;
  for(const [index,printer] of base.printers.entries()){
    state=updatePrinterDevice(state,printer.id,{transport:'network',host:`10.0.0.${20+index}`,port:9100+index});
  }
  const snapshot=printerSettingsSnapshot(state);
  assert.equal(snapshot.printers.length,5);
  snapshot.printers.forEach((printer,index)=>{
    assert.equal(printer.host,`10.0.0.${20+index}`);
    assert.equal(printer.port,9100+index);
  });
});

test('roll printers can back up receipt, production and packing regardless of configured width',()=>{
  let state=updatePrinterDevice(base,'packing-1',{media:{kind:'roll',widthMm:58}});
  state=configurePrinterRoute(state,'packing',{fallbackPrinterId:'kitchen-1'});
  state=configurePrinterRoute(state,'receipt',{fallbackPrinterId:'packing-1'});
  assert.equal(state.fallbackRoutes.packing,'kitchen-1');
  assert.equal(state.fallbackRoutes.receipt,'packing-1');
});

test('label printers can use arbitrary label size and back up each other',()=>{
  let state=updatePrinterDevice(base,'label-pack',{media:{kind:'label',widthMm:60,heightMm:40}});
  state=configurePrinterRoute(state,'label',{fallbackPrinterId:'label-pack'});
  assert.equal(state.fallbackRoutes.label,'label-pack');
  assert.equal(printerSettingsSnapshot(state).printers.find(x=>x.id==='label-pack').media.widthMm,60);
  assert.throws(()=>configurePrinterRoute(base,'label',{fallbackPrinterId:'packing-1'}),/不支援/);
});

test('template list and assignment follow selected media size',()=>{
  let state=updatePrinterDevice(base,'receipt-1',{media:{kind:'roll',widthMm:58}});
  assert.deepEqual(availableTemplatesForPrinter(state,'receipt-1','receipt').map(x=>x.id),['receipt-compact']);
  state=assignPrinterTemplate(state,'receipt-1','receipt','receipt-compact');
  assert.equal(state.printers.find(x=>x.id==='receipt-1').templateAssignments.receipt,'receipt-compact');
  assert.throws(()=>assignPrinterTemplate(state,'receipt-1','receipt','receipt-wide'),/不兼容/);
});

test('fallback mode supports manual or auto without changing routing data',()=>{
  const state=configurePrinterRoute(base,'packing',{fallbackPrinterId:'kitchen-1',fallbackMode:'auto'});
  assert.equal(state.fallbackMode,'auto');
  assert.equal(state.routes.packing,'packing-1');
  assert.equal(state.fallbackRoutes.packing,'kitchen-1');
});
