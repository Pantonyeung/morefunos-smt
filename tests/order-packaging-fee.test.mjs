import test from 'node:test';
import assert from 'node:assert/strict';
import {cartPricingSummary,packagingFeeForLine,SERVICE_TAKEAWAY,SERVICE_DINE_IN} from '../pages/order/order-domain.js';
import {applyCheckoutDiscount} from '../pages/checkout/checkout-domain.js';
import {defaultPrinterState,createPrintJobs} from '../pages/more/print-domain.js';

const row=(category,qty=1,serviceMode=SERVICE_TAKEAWAY,total=10)=>({lineId:category+qty,category,name:category,qty,unitPrice:total/qty,total,serviceMode,options:{}});

test('takeaway packaging fee exempts standalone riceballs and drinks',()=>{
  const cart=[row('飯團',2,SERVICE_TAKEAWAY,40),row('飲品',2,SERVICE_TAKEAWAY,20),row('便當',2,SERVICE_TAKEAWAY,100),row('小食',1,SERVICE_DINE_IN,20)];
  assert.equal(packagingFeeForLine(cart[0]),0);assert.equal(packagingFeeForLine(cart[1]),0);assert.equal(packagingFeeForLine(cart[2]),2);assert.equal(packagingFeeForLine(cart[3]),0);
  assert.deepEqual(cartPricingSummary(cart),{foodSubtotal:180,packagingUnits:2,packagingFee:2,total:182});
});

test('checkout discount does not discount packaging fee',()=>{
  const cart=[row('便當',2,SERVICE_TAKEAWAY,100)];
  const result=applyCheckoutDiscount(cart,{type:'group',percent:10},'現場');
  assert.equal(result.foodSubtotal,100);assert.equal(result.packagingFee,2);assert.equal(result.subtotal,102);assert.equal(result.discountAmount,10);assert.equal(result.payable,92);
});

test('mixed service order splits production and packing jobs',()=>{
  const order={id:'TEST-MIX',source:'現場',acceptedAt:Date.now(),items:[row('便當',1,SERVICE_TAKEAWAY,50),row('小食',1,SERVICE_DINE_IN,20)]};
  const state=defaultPrinterState();state.printers.forEach(p=>{if(p.transport==='network')p.host='127.0.0.1';});
  const next=createPrintJobs(order,state,{documents:['production','packing']});
  assert.equal(next.jobs.length,4);
  const text=next.jobs.map(job=>job.document?.text||'').join('\n');assert.match(text,/服務：外賣/);assert.match(text,/服務：堂食/);
});
