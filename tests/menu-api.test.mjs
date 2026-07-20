import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {FIREBASE_CATALOG_URL,mapMenuToOrderCatalog,normalizeMenuPayload,loadMenuCatalog} from '../pages/order/menu-api.js';

const fallback={
  categories:['全部','飯團','飲品'],
  products:[
    {id:'f1',code:'F1',name:'原味紫米飯團',category:'飯團',price:41,required:[],combinable:true,image:'fallback.webp'},
    {id:'d1',code:'D1',name:'手打檸檬茶',category:'飲品',price:18,required:[],linkRole:'drink',image:'drink.webp'}
  ],
  drinks:[{id:'iced-lemon-tea',code:'D1',name:'手打檸檬茶',price:18,image:'drink.webp',sweet:true,ice:true}]
};

test('Firebase keyed catalog normalizes categories, products and availability',()=>{
  const menu=normalizeMenuPayload({categories:{riceball:{category_id:'riceball',category_name:'飯團',is_visible:true}},products:{'remote-f1':{product_id:'remote-f1',product_name:'原味紫米飯團',category_id:'riceball',base_price:45,is_visible:true}},availability:{'remote-f1':{product_id:'remote-f1',is_sold_out:true}}});
  assert.equal(menu.products[0].product_id,'remote-f1');
  assert.equal(menu.availability[0].is_sold_out,true);
});

test('remote products use live values while inheriting locked SMT behaviour by code',()=>{
  const catalog=mapMenuToOrderCatalog({categories:[{category_id:'riceball',category_name:'飯團'}],products:[{product_id:'remote-f1',product_code:'F1',product_name:'原味紫米飯團（新）',category_id:'riceball',price:45,image_url:'https://img.test/f1.webp',is_visible:true}],availability:[]},fallback);
  assert.equal(catalog.products[0].id,'remote-f1');
  assert.equal(catalog.products[0].price,45);
  assert.equal(catalog.products[0].combinable,true);
  assert.equal(catalog.products[0].image,'https://img.test/f1.webp');
  assert.deepEqual(catalog.categories,['全部','飯團']);
});

test('live drink products become quick drinks and retain modifier capabilities',()=>{
  const catalog=mapMenuToOrderCatalog({categories:[{category_id:'drink',category_name:'飲品'}],products:[{product_id:'remote-d1',product_code:'D1',product_name:'手打檸檬茶',category_id:'drink',price:20,is_visible:true}],availability:[]},fallback);
  assert.equal(catalog.drinks[0].id,'remote-d1');
  assert.equal(catalog.drinks[0].sweet,true);
  assert.equal(catalog.drinks[0].ice,true);
  assert.equal(catalog.products[0].linkRole,'drink');
});

test('menu loader caches a successful response and falls back to cache offline',async()=>{
  const memory=new Map();
  const storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value)};
  let request;
  const response={ok:true,json:async()=>({categories:{riceball:{category_id:'riceball',category_name:'飯團'}},products:{'remote-f1':{product_id:'remote-f1',product_name:'原味紫米飯團',category_id:'riceball',base_price:45,is_visible:true}},availability:{}})};
  const first=await loadMenuCatalog({fetchImpl:async(...args)=>(request=args,response),storage,fallback,url:'https://firebase.test/public/catalogV1.json'});
  assert.equal(first.source,'firebase');
  assert.equal(request[0],'https://firebase.test/public/catalogV1.json');
  assert.equal(request[1].method,'GET');
  assert.equal(request[1].body,undefined);
  const second=await loadMenuCatalog({fetchImpl:async()=>{throw new Error('offline');},storage,fallback,url:'https://firebase.test/public/catalogV1.json'});
  assert.equal(second.source,'cache');
  assert.equal(second.products[0].id,'remote-f1');
});

test('runtime uses Firebase RTDB and contains no Apps Script transport',async()=>{
  assert.match(FIREBASE_CATALOG_URL,/firebasedatabase\.app\/public\/catalogV1\.json$/);
  const source=await readFile(new URL('../pages/order/menu-api.js',import.meta.url),'utf8');
  assert.doesNotMatch(source,/script\.google\.com|menu\.read/);
});
