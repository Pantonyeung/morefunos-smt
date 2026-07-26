import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync(new URL('../pages/order/index.html',import.meta.url),'utf8');
const module=fs.readFileSync(new URL('../pages/order/cart-experience.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../pages/order/cart-experience.css',import.meta.url),'utf8');

assert.ok(index.includes('cart-experience.css'),'order page must load cart experience styles');
assert.ok(index.includes('cart-experience.js'),'order page must load cart experience module');
assert.ok(module.includes('cart-service-selector'),'cart must provide an order-level service-mode selector');
assert.ok(module.includes('cart-category-toggle'),'cart category headers must be collapsible');
assert.ok(module.includes('cart-row-recent'),'cart must provide recent-row feedback');
assert.ok(module.includes('正在補'),'quick drink drawer must expose the current target');
assert.ok(!module.includes("createElement('style')"),'cart experience must not inject runtime style patches');
assert.ok(!module.includes('location.reload'),'cart experience must not reload the page to apply state');
assert.ok(!css.includes('!important'),'cart experience stylesheet must not depend on !important');
console.log('SMT_CART_EXPERIENCE_CONTRACT_OK');
