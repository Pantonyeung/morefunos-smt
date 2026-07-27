import assert from 'node:assert/strict';
import {printerCanHandle,setPrimaryPrinter,setFallbackPrinter,resolvePrinterRoute,failoverPrintJob} from '../pages/more/printer-routing.js';

const state={
  printers:[
    {id:'receipt',enabled:true,purposes:['receipt']},
    {id:'kitchen',enabled:true,purposes:['production','packing','receipt']},
    {id:'packing',enabled:true,purposes:['packing','receipt']},
    {id:'label-a',enabled:true,purposes:['label']},
    {id:'label-b',enabled:true,purposes:['label-backup']}
  ],
  routes:{receipt:'receipt',production:'kitchen',packing:'packing',label:'label-a'},
  fallbackRoutes:{receipt:'packing',packing:'kitchen',label:'label-b'},
  fallbackMode:'manual'
};

assert.equal(printerCanHandle(state.printers[1],'packing'),true);
assert.equal(printerCanHandle(state.printers[4],'label'),true);
assert.equal(resolvePrinterRoute(state,'packing').printer.id,'packing');
assert.equal(resolvePrinterRoute(state,'packing',{primaryUnavailable:true}).printer.id,'kitchen');
assert.equal(resolvePrinterRoute(state,'label',{primaryUnavailable:true}).printer.id,'label-b');
assert.equal(resolvePrinterRoute(state,'receipt',{primaryUnavailable:true}).printer.id,'packing');

const changed=setFallbackPrinter(state,'production','packing');
assert.equal(changed.fallbackRoutes.production,'packing');
assert.throws(()=>setFallbackPrinter(state,'packing','packing'),/不可相同/);
assert.throws(()=>setPrimaryPrinter(state,'label','kitchen'),/不支援/);

const failed=failoverPrintJob({id:'J1',documentType:'packing',printerId:'packing',status:'failed',history:[]},state,{now:123});
assert.equal(failed.printerId,'kitchen');
assert.equal(failed.status,'queued');
assert.equal(failed.history.at(-1).type,'print_job.failover');
assert.equal(failed.history.at(-1).fromPrinterId,'packing');
assert.equal(failed.history.at(-1).toPrinterId,'kitchen');

console.log('printer routing contract PASS');
