import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync(new URL('../pages/order/index.html',import.meta.url),'utf8');
const adaptive=fs.readFileSync(new URL('../pages/order/adaptive.css',import.meta.url),'utf8');
const product=fs.readFileSync(new URL('../pages/order/product-card.css',import.meta.url),'utf8');

assert.ok(index.includes('product-card.css'),'order page must load the product-card visual authority');
assert.ok(!adaptive.includes('.product-card.'),'adaptive.css must not own product-card internal geometry');
assert.ok(!adaptive.includes('.product-hero'),'adaptive.css must not own product hero internals');
assert.ok(!adaptive.includes('.product-thumb'),'adaptive.css must not own product thumbnail internals');
assert.ok(product.includes('.product-card.large'),'product-card authority must own large card geometry');
assert.ok(product.includes('.product-hero>img'),'product-card authority must own the actual product image element');
assert.ok(product.includes('width:70%'),'product image must render at 70% of the image stage width');
assert.ok(product.includes('height:70%'),'product image must render at 70% of the image stage height');
assert.ok(product.includes('object-fit:contain'),'product image must remain fully visible without crop');
assert.ok(product.includes('min-height:48px'),'product copy area must keep an operable/readable minimum instead of a literal unusable 10% row');
console.log('PRODUCT_CARD_AUTHORITY_CONTRACT_OK');
