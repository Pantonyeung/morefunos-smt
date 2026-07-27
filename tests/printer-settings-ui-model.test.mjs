import test from 'node:test';
import assert from 'node:assert/strict';
import {printerSettingsViewModel,printerListViewModels} from '../pages/more/printer-settings-ui-model.js';

const state={
  printers:[
    {id:'receipt-1',name:'小票機',enabled:true,transport:'network',host:'10.0.0.20',port:9100,media:{kind:'roll',widthMm:58},paperWidth:58,purposes:['receipt'],templateAssignments:{receipt:'receipt-58'}},
    {id:'packing-1',name:'打包機',enabled:true,transport:'network',host:'10.0.0.21',port:9101,media:{kind:'roll',widthMm:80},paperWidth:80,purposes:['packing']},
    {id:'label-a',name:'飯團標籤機',enabled:true,transport:'network',host:'10.0.0.22',port:9102,media:{kind:'label',widthMm:60,heightMm:40},paperWidth:60,labelHeight:40,purposes:['label']}
  ],
  templates:[
    {id:'receipt-58',name:'58mm 小票',documentType:'receipt',status:'published',minWidthMm:55,maxWidthMm:60},
    {id:'receipt-80',name:'80mm 小票',documentType:'receipt',status:'published',minWidthMm:76,maxWidthMm:82},
    {id:'label-60x40',name:'60×40 標籤',documentType:'label',status:'published',minWidthMm:55,maxWidthMm:65,minHeightMm:35,maxHeightMm:45}
  ],
  routes:{receipt:'receipt-1',packing:'packing-1',label:'label-a'},
  fallbackRoutes:{receipt:'packing-1'},
  fallbackMode:'auto'
};

test('view model exposes media, template and fallback settings from one source',()=>{
  const vm=printerSettingsViewModel(state,'receipt-1');
  assert.equal(vm.media.kind,'roll');
  assert.equal(vm.media.widthMm,58);
  assert.deepEqual(vm.templates.map(x=>x.id),['receipt-58']);
  assert.equal(vm.fallbackPrinterId,'packing-1');
  assert.equal(vm.fallbackMode,'auto');
  assert.equal(vm.fallbackOptions.some(x=>x.value==='packing-1'),true);
});

test('list view shows arbitrary label dimensions without hardcoded 50mm',()=>{
  const rows=printerListViewModels(state);
  const label=rows.find(x=>x.id==='label-a');
  assert.equal(label.mediaLabel,'60×40 mm');
  assert.equal(label.networkTarget,'10.0.0.22:9102');
});
