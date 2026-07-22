import test from 'node:test';
import assert from 'node:assert/strict';

let layoutModule=null;
try{layoutModule=await import('../pages/order/category-layout.js')}catch{}

test('分類版面設定只接受每行五至七格、一至兩行及搜尋開關',()=>{
  assert.ok(layoutModule,'尚未建立分類版面設定模組');
  const {normalizeCategoryLayout}=layoutModule;
  assert.deepEqual(normalizeCategoryLayout({columns:5,rows:2,showSearch:false}),{columns:5,rows:2,showSearch:false});
  assert.deepEqual(normalizeCategoryLayout({columns:7,rows:1,showSearch:true}),{columns:7,rows:1,showSearch:true});
  assert.deepEqual(normalizeCategoryLayout({columns:9,rows:3,showSearch:'yes'}),{columns:6,rows:1,showSearch:true});
});

test('搜尋開啟時佔最後一行最後一格，超出首屏分類保留在可操作溢出清單',()=>{
  assert.ok(layoutModule,'尚未建立分類版面設定模組');
  const {buildCategoryLayout}=layoutModule;
  const categories=Array.from({length:13},(_,index)=>`分類${index+1}`);
  const layout=buildCategoryLayout(categories,{columns:6,rows:2,showSearch:true});
  assert.equal(layout.capacity,12);
  assert.equal(layout.categoryCapacity,11);
  assert.deepEqual(layout.primary,categories.slice(0,11));
  assert.deepEqual(layout.overflow,categories.slice(11));
  assert.equal(layout.searchSlot,12);
});
