import assert from 'node:assert/strict';
import test from 'node:test';
import {applyCheckoutDiscount,buildCheckoutRecord,enterKeypadValue} from '../pages/checkout/checkout-domain.js';

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

test('團體整單折扣與學生優惠互斥，而且堂食不可使用',()=>{
  const takeaway=applyCheckoutDiscount(cart,{type:'group',percent:10},'現場外賣');
  assert.equal(takeaway.discountAmount,11.1);
  assert.equal(takeaway.payable,99.9);
  assert.throws(()=>applyCheckoutDiscount(cart,{type:'group',percent:10},'堂食'),/堂食不提供團體優惠/);
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
  const pricing=applyCheckoutDiscount(cart,{type:'group',percent:10},'現場外賣');
  const record=buildCheckoutRecord({id:'P0060',cart,channel:'現場外賣',payment:'現金付款',pricing,discount:{type:'group',percent:10},terminalId:'SMM',now:1000});
  assert.equal(record.subtotal,111);
  assert.equal(record.discountAmount,11.1);
  assert.equal(record.amount,99.9);
  assert.equal(record.checkoutTerminalId,'SMM');
  assert.equal(record.audit.at(-1).type,'order.checked_out');
  assert.equal(record.audit.some(event=>event.type==='discount.applied'),true);
});
