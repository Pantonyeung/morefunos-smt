import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPrinterSettingsEditor,renderPrinterDeviceList} from '../pages/more/printer-settings-renderer.js';

const state={
  printers:[
    {id:'receipt-1',name:'小票機',model:'LAN-A',enabled:true,transport:'network',host:'10.0.0.20',port:9100,media:{kind:'roll',widthMm:58},paperWidth:58,purposes:['receipt'],supportedDocuments:['receipt'],templateAssignments:{receipt:'receipt-58'}},
    {id:'packing-1',name:'打包機',model:'LAN-B',enabled:true,transport:'network',host:'10.0.0.21',port:9101,media:{kind:'roll',widthMm:80},paperWidth:80,purposes:['packing'],supportedDocuments:['receipt','production','packing']},
    {id:'label-a',name:'飯團標籤機',model:'LABEL-A',enabled:true,transport:'network',host:'10.0.0.22',port:9102,media:{kind:'label',widthMm:60,heightMm:40},paperWidth:60,labelHeight:40,purposes:['label'],supportedDocuments:['label'],templateAssignments:{label:'label-60x40'}}
  ],
  templates:[
    {id:'receipt-58',name:'58mm 小票',documentType:'receipt',status:'published',minWidthMm:55,maxWidthMm:60},
    {id:'label-60x40',name:'60×40 標籤',documentType:'label',status:'published',minWidthMm:55,maxWidthMm:65,minHeightMm:35,maxHeightMm:45}
  ],
  routes:{receipt:'receipt-1',label:'label-a'},
  fallbackRoutes:{receipt:'packing-1'},
  fallbackMode:'auto'
};

test('LAN roll printer renderer exposes configurable network and width fields',()=>{
  const html=renderPrinterSettingsEditor(state,'receipt-1');
  assert.match(html,/data-field="printer-transport"/);
  assert.match(html,/data-field="printer-host"[^>]*value="10\.0\.0\.20"/);
  assert.match(html,/data-field="printer-port"[^>]*value="9100"/);
  assert.match(html,/data-field="printer-width"[^>]*value="58"/);
  assert.doesNotMatch(html,/標籤高度（mm）/);
  assert.match(html,/58mm 小票/);
  assert.match(html,/打包機/);
  assert.match(html,/自動改送/);
});

test('label renderer supports arbitrary width and height',()=>{
  const html=renderPrinterSettingsEditor(state,'label-a');
  assert.match(html,/標籤寬度/);
  assert.match(html,/data-field="printer-width"[^>]*value="60"/);
  assert.match(html,/data-field="printer-height"[^>]*value="40"/);
  assert.match(html,/60×40 標籤/);
});

test('device list shows media dimensions and LAN target',()=>{
  const html=renderPrinterDeviceList(state);
  assert.match(html,/10\.0\.0\.22:9102/);
  assert.match(html,/60×40 mm/);
  assert.match(html,/58 mm/);
});
