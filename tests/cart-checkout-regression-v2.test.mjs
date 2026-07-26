import fs from 'node:fs';
import assert from 'node:assert/strict';

const cart=fs.readFileSync(new URL('../pages/order/cart-experience.js',import.meta.url),'utf8');
const menu=fs.readFileSync(new URL('../pages/order/menu-api.js',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');
const checkout=fs.readFileSync(new URL('../pages/checkout/page.js',import.meta.url),'utf8');

assert.ok(cart.includes('pendingRevealProductName'),'new/merged product must keep an explicit reveal target');
assert.ok(cart.includes("scrollIntoView({block:'nearest'"),'revealed cart row must be scrolled into the visible cart viewport');
assert.ok(cart.indexOf('restoreScroll();') < cart.indexOf('revealRecentRow();'),'view restore must happen before forced reveal so reveal is not overwritten');

assert.ok(menu.includes("from './combo-rules.js'"),'live menu mapping must use the formal combo rule core');
assert.ok(menu.includes("['便當','紫米沙律','沙律','麵餐','拌麵','薯角餐','薯蓉餐']"),'meal categories that include a drink must infer the drink requirement');
assert.ok(menu.includes("temporary?.role==='riceball_main'"),'live single riceballs must retain combo eligibility');
assert.ok(menu.includes("temporary?.role==='combo_snack'"),'eligible live snacks must retain combo snack role');

assert.ok(loader.includes("['checkout',...mainRoutes.filter"),'checkout must be preloaded before secondary main pages');
assert.ok(checkout.includes("message.type==='morefun:page-activate'"),'preloaded checkout must refresh transaction state on activation');
assert.ok(checkout.includes('readJSON(ORDER_STORAGE_KEY'),'checkout activation must reread the current cart instead of using the preload snapshot');

console.log('SMT_CART_CHECKOUT_REGRESSION_V2_OK');
