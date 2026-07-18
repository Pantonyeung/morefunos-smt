import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');

test('checkout page keeps 34/66 full-screen layout without bottom navigation',()=>{
 const css=read('pages/checkout/page.css');
 const js=read('pages/checkout/page.js');
 assert.match(css,/grid-template-columns:34% 66%/);
 assert.doesNotMatch(css,/@media/);
 assert.doesNotMatch(js,/bottom-nav/);
});

test('checkout page fills one row with five channels and six payment methods',()=>{
 const css=read('pages/checkout/page.css');
 const js=read('pages/checkout/page.js');
 assert.match(css,/\.channel-row\{grid-template-columns:repeat\(5,1fr\)\}/);
 assert.match(css,/\.payment-row\{grid-template-columns:repeat\(6,1fr\)\}/);
 for(const label of ['現場外賣','電話／WhatsApp','磨飯 App','Foodpanda','Keeta']) assert.match(js,new RegExp(label));
 for(const label of ['現金付款','FPS／轉數快','PayMe','AlipayHK','WeChat Pay HK','組合付款']) assert.match(js,new RegExp(label));
});

test('checkout quick amounts restore exact, 20, 50, 100 and 500 without 10',()=>{
 const js=read('pages/checkout/page.js');
 for(const value of ['剛好 $43','$20','$50','$100','$500']) assert.match(js,new RegExp(value.replace('$','\\$')));
 assert.doesNotMatch(js,/data-value="10"/);
 assert.match(js,/優惠方案／折扣/);
 assert.match(js,/返回訂單/);
});
