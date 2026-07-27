import fs from 'node:fs';
import assert from 'node:assert/strict';

const page=fs.readFileSync(new URL('../pages/order/page.js',import.meta.url),'utf8');
const cart=fs.readFileSync(new URL('../pages/order/cart.css',import.meta.url),'utf8');

const markerStart=page.indexOf('<span class="seq-service">');
assert.ok(markerStart>=0,'cartLineRow must render seq-service marker');
const markerSlice=page.slice(markerStart,markerStart+900);
const serviceIndex=markerSlice.indexOf('<button class="line-service-toggle');
const seqIndex=markerSlice.indexOf('<span class="seq">');
assert.ok(serviceIndex>=0&&seqIndex>=0,'marker must contain service toggle and sequence');
assert.ok(serviceIndex<seqIndex,'DOM source order must be 外/堂 first, sequence second');
assert.ok(!cart.includes('.seq-service>.seq{position:static;grid-row:2'),'cart visual authority must not reverse marker DOM rows');
assert.ok(!cart.includes('.seq-service>.line-service-toggle{position:static;grid-row:1'),'cart visual authority must not reverse marker DOM rows');
assert.ok(cart.includes('grid-template-rows:44% 56%'),'marker keeps two stacked areas');
console.log('CART_MARKER_DOM_CONTRACT_OK');
