import test from 'node:test';
import assert from 'node:assert/strict';
import {packagingFeeForLine,cartPricingSummary,SERVICE_TAKEAWAY,SERVICE_DINE_IN} from '../pages/order/order-domain.js';

const line=(overrides={})=>({lineId:'x',name:'產品',category:'其他',categories:[],qty:1,unitPrice:23,total:23,serviceMode:SERVICE_TAKEAWAY,...overrides});

test('standalone riceball is packaging-fee exempt even when display category is popularity',()=>{
  assert.equal(packagingFeeForLine(line({category:'人氣推薦',categories:['人氣推薦','飯團'],combinable:true})),0);
});

test('standalone drink is packaging-fee exempt',()=>{
  assert.equal(packagingFeeForLine(line({category:'人氣推薦',categories:['飲品'],linkRole:'drink'})),0);
});

test('standalone riceball plus discounted drink remains packaging-fee exempt',()=>{
  const cart=[line({lineId:'r',category:'人氣推薦',combinable:true,total:23}),line({lineId:'d',category:'飲品',linkRole:'drink',total:3})];
  assert.equal(cartPricingSummary(cart).packagingFee,0);
});

test('riceball combo and other takeaway boxed meals still charge packaging',()=>{
  assert.equal(packagingFeeForLine(line({lineType:'combo',category:'飯團套餐'})),1);
  assert.equal(packagingFeeForLine(line({category:'便當'})),1);
  assert.equal(packagingFeeForLine(line({category:'便當',serviceMode:SERVICE_DINE_IN})),0);
});
