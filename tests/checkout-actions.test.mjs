import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {applyCheckoutDiscount,buildCheckoutRecord,enterKeypadValue,getChannelPolicy} from '../pages/checkout/checkout-domain.js';

const cart=[
  {lineId:'f4',name:'蜜糖雞扒紫米飯團',category:'飯團',qty:1,unitPrice:45,total:45},
  {lineId:'d1',name:'凍檸茶',category:'飲品',qty:1,unitPrice:18,total:18,studentDiscountEligible:false},
  {lineId:'d2',name:'冷泡玄米茶',category:'飲品',qty:2,unitPrice:24,total:48,studentDiscountEligible:true,specialDrinkSurcharge:6}
];

test('學生優惠只將六元或以上合資格特飲的加價減半，普通凍檸茶不減價',()=>{
  const result=applyCheckoutDiscount(cart,{type:'student',studentCount:1},'現場外賣');
  assert.equal(result.subtotal,111);
  assert.equal(result.discountAmount,3);
  assert.equal(result.payable,108);
  assert.equal(result.appliedUnits,1);
});

test('學生優惠人數不可超過合資格飲品數量',()=>{
  const result=applyCheckoutDiscount(cart,{type:'student',studentCount:5},'現場外賣');
  assert.equal(result.appliedUnits,2);
  assert.equal(result.discountAmount,6);
});

test('未有明確資格或特飲加價少於六元，一律不可自行推斷為學生優惠',()=>{
  const drinks=[
    {name:'凍奶茶',category:'飲品',qty:1,unitPrice:20,total:20},
    {name:'限定特飲',category:'飲品',qty:1,unitPrice:22,total:22,studentDiscountEligible:true,specialDrinkSurcharge:5}
  ];
  const result=applyCheckoutDiscount(drinks,{type:'student',studentCount:2},'現場外賣');
  assert.equal(result.discountAmount,0);
  assert.equal(result.appliedUnits,0);
});

test('團體整單折扣與學生優惠互斥，現場可使用',()=>{
  const takeaway=applyCheckoutDiscount(cart,{type:'group',percent:10},'現場');
  assert.equal(takeaway.discountAmount,11.1);
  assert.equal(takeaway.payable,99.9);
});

test('平台訂單不可使用本店優惠',()=>{
  assert.throws(()=>applyCheckoutDiscount(cart,{type:'student',studentCount:1},'Keeta'),/平台訂單不可使用本店優惠/);
});

test('數字鍵盤支援數字、小數、退格及清除',()=>{
  assert.equal(enterKeypadValue('','2'),'2');
  assert.equal(enterKeypadValue('2','0'),'20');
  assert.equal(enterKeypadValue('20','.'),'20.');
  assert.equal(enterKeypadValue('20.','5'),'20.5');
  assert.equal(enterKeypadValue('20.5','backspace'),'20.');
  assert.equal(enterKeypadValue('20.','clear'),'');
});

test('數字鍵盤的 00 是獨立雙零鍵',()=>{
  assert.equal(enterKeypadValue('2','00'),'200');
  assert.equal(enterKeypadValue('','00'),'0');
});

test('完成結帳保存優惠、應付金額及實際操作終端',()=>{
  const pricing=applyCheckoutDiscount(cart,{type:'group',percent:10},'現場');
  const record=buildCheckoutRecord({id:'P0060',cart,channel:'現場',payment:'現金',pricing,discount:{type:'group',percent:10},terminalId:'SMM',now:1000});
  assert.equal(record.subtotal,111);
  assert.equal(record.discountAmount,11.1);
  assert.equal(record.amount,99.9);
  assert.equal(record.checkoutTerminalId,'SMM');
  assert.equal(record.audit.at(-1).type,'order.checked_out');
  assert.equal(record.audit.some(event=>event.type==='discount.applied'),true);
});

test('渠道政策只容許現場單選付款方式，其他渠道只收必要參考資料',()=>{
  assert.deepEqual(getChannelPolicy('現場').paymentMethods,['現金','Alipay','WeChat Pay','FPS','PayMe','組合付款']);
  assert.equal(getChannelPolicy('現場').requiresPaymentMethod,true);
  assert.equal(getChannelPolicy('電話／WhatsApp').requiresPaymentMethod,false);
  assert.equal(getChannelPolicy('電話／WhatsApp').initialPaymentStatus,'付款待核實');
  assert.deepEqual(getChannelPolicy('磨飯 App').fields,['pickupCode','verificationCode','note']);
  assert.equal(getChannelPolicy('Keeta').initialPaymentStatus,'平台已付');
  assert.deepEqual(getChannelPolicy('Foodpanda').fields,['platformOrderId','note']);
});

test('現場渠道不提供稍後付款',()=>{
  const pricing=applyCheckoutDiscount(cart,{type:'none'},'現場');
  const record=buildCheckoutRecord({id:'P0061',cart,channel:'現場',payment:'現金',pricing,discount:{type:'none'},terminalId:'SMT',now:1000,receivedAmount:111});
  assert.equal(record.paymentMethod,'現金');
  assert.equal(record.paymentStatus,'已付款');
});

test('自有渠道不猜付款方式，平台訂單分開保存佣金及預計結算',()=>{
  const pricing=applyCheckoutDiscount(cart,{type:'none'},'電話／WhatsApp');
  const owned=buildCheckoutRecord({id:'P0062',cart,channel:'電話／WhatsApp',payment:'現金付款',pricing,discount:{type:'none'},terminalId:'SMT',now:1000,channelData:{note:'稍後對數'}});
  assert.equal(owned.paymentMethod,'待核實');
  assert.equal(owned.paymentStatus,'付款待核實');
  assert.equal(owned.channelData.note,'稍後對數');
  const platform=buildCheckoutRecord({id:'P0063',cart,channel:'Keeta',pricing,discount:{type:'none'},terminalId:'SMT',now:1000,channelData:{platformOrderId:'K-123'}});
  assert.equal(platform.paymentStatus,'平台已付');
  assert.equal(platform.platformSalesGross,111);
  assert.equal(platform.platformCommissionRate,.25);
  assert.equal(platform.estimatedPlatformCommission,27.75);
  assert.equal(platform.estimatedPlatformSettlement,83.25);
  assert.equal(platform.discountAmount,0);
});

test('零元訂單不可建立付款紀錄',()=>{
  const zeroPricing={subtotal:0,discountAmount:0,payable:0,appliedUnits:0};
  assert.throws(()=>buildCheckoutRecord({id:'P0064',cart:[{name:'測試產品',qty:1,total:0}],channel:'現場外賣',payment:'現金付款',pricing:zeroPricing,discount:{type:'none'},terminalId:'SMT',now:1000}),/訂單金額必須大於零/);
});

test('結帳頁使用共用三位每日流水及永久訂單識別',async()=>{
  const page=await readFile(new URL('../pages/checkout/page.js',import.meta.url),'utf8');
  assert.match(page,/shared\/order-identity\.js/);
  assert.match(page,/activeDineOrderIdentities/);
  assert.match(page,/createOrderIdentity\(\[\.\.\.history,\.\.\.activeDineOrderIdentities\(readJSON\(DINE_STORAGE_KEY,null\)\)\]/);
  assert.match(page,/identity,/);
  assert.match(page,/try \{ completeCheckout\(\); \} catch/);
  assert.doesNotMatch(page,/const nextOrderId/);
  assert.doesNotMatch(page,/padStart\(4/);
});

test('結帳紀錄同時保存永久編號及每日顯示流水',()=>{
  const identity={id:'MF-20260722-120000000-SMT01-P061',displayOrderNo:'P061',dailySequence:61,businessDate:'2026-07-22',createdTerminalId:'SMT01'};
  const pricing=applyCheckoutDiscount(cart,{type:'none'},'現場');
  const record=buildCheckoutRecord({identity,cart,channel:'現場',payment:'現金',pricing,discount:{type:'none'},terminalId:'SMT-01',now:1000,receivedAmount:120});
  assert.equal(record.id,identity.id);
  assert.equal(record.displayOrderNo,'P061');
  assert.equal(record.dailySequence,61);
  assert.equal(record.businessDate,'2026-07-22');
});
