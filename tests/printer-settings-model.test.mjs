import test from 'node:test';
import assert from 'node:assert/strict';
import {configurePrinterRoute,printerSettingsSnapshot,updatePrinterDevice} from '../pages/more/printer-settings-model.js';

const base={
  printers:[
    {id:'receipt-1',name:'小票機',enabled:true,transport:'sunmi-native',paperWidth:80,purposes:['receipt']},
    {id:'kitchen-1',name:'後廚機',enabled:true,transport:'network',paperWidth:80,purposes:['production'],host:'192.168.1.201',port:9100},
    {id:'packing-1',name:'打包機',enabled:true,transport:'network',paperWidth:80,purposes:['packing'],host:'192.168.1.202',port:9100},
    {id:'label-riceball',name:'飯團標籤機',enabled:true,transport:'network',paperWidth:50,purposes:['label'],host:'192.168.1.203',port:9100},
    {id:'label-pack',name:'外賣標籤機',enabled:true,transport:'network',paperWidth:50,purposes:['label-backup'],host:'192.168.1.204',port:9100}
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

test('80mm printers can back up receipt, production and packing across original roles',()=>{
  let state=configurePrinterRoute(base,'packing',{fallbackPrinterId:'kitchen-1'});
  state=configurePrinterRoute(state,'receipt',{fallbackPrinterId:'packing-1'});
  assert.equal(state.fallbackRoutes.packing,'kitchen-1');
  assert.equal(state.fallbackRoutes.receipt,'packing-1');
});

test('label printers can back up each other but not an 80mm receipt printer',()=>{
  const state=configurePrinterRoute(base,'label',{fallbackPrinterId:'label-pack'});
  assert.equal(state.fallbackRoutes.label,'label-pack');
  assert.throws(()=>configurePrinterRoute(base,'label',{fallbackPrinterId:'packing-1'}),/不支援/);
});

test('fallback mode supports manual or auto without changing routing data',()=>{
  const state=configurePrinterRoute(base,'packing',{fallbackPrinterId:'kitchen-1',fallbackMode:'auto'});
  assert.equal(state.fallbackMode,'auto');
  assert.equal(state.routes.packing,'packing-1');
  assert.equal(state.fallbackRoutes.packing,'kitchen-1');
});
