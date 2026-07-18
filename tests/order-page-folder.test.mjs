import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('order page keeps 34/66 layout, 7x2 categories and fixed T2 geometry',()=>{
 const css=read('pages/order/page.css');
 assert.match(css,/grid-template-columns:34% 66%/);
 assert.match(css,/grid-template-columns:repeat\(7,minmax\(0,1fr\)\)/);
 assert.match(css,/grid-template-rows:repeat\(2,52px\)/);
 assert.doesNotMatch(css,/@media/);
});

test('order page has correct five-item navigation and checkout route',()=>{
 const js=read('pages/order/page.js');
 for(const label of ['點單','訂單','堂食','售罄','更多']) assert.match(js,new RegExp(label));
 assert.match(js,/navigate\('checkout'\)/);
 assert.match(js,/快速模式與快捷飲品設定/);
 assert.match(js,/待補區/);
 assert.match(js,/待處理/);
});

test('order page exposes fourteen categories and More Fun menu data',()=>{
 const data=read('pages/order/page-data.js');
 const values=['全部','人氣推薦','飯團','飯團套餐','便當','紫米沙律','薯角餐','小食','飲品','湯品','甜品','加購','更多','搜尋'];
 for(const value of values) assert.match(data,new RegExp(value));
 assert.match(data,/蜜糖雞絲＋鹽酥雞/);
 assert.match(data,/紫米飯團 A 餐/);
});
