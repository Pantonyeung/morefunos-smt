import fs from 'node:fs';
import assert from 'node:assert/strict';

const cart=fs.readFileSync(new URL('../pages/order/cart-experience.js',import.meta.url),'utf8');
const menu=fs.readFileSync(new URL('../pages/order/menu-api.js',import.meta.url),'utf8');
const combo=fs.readFileSync(new URL('../pages/order/combo-rules.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../pages/order/cart-experience.css',import.meta.url),'utf8');
const prepareBody=cart.slice(cart.indexOf('function prepare(){'),cart.indexOf('function schedulePrepare(){'));

assert.ok(cart.includes('pendingRevealProductName'),'new/merged product must keep an explicit reveal target');
assert.ok(cart.includes("scrollIntoView({block:'nearest'"),'revealed cart row must be scrolled into the visible cart viewport');
assert.ok(prepareBody.indexOf('restoreScroll();')>=0&&prepareBody.indexOf('restoreScroll();')<prepareBody.indexOf('scheduleRevealRecentRow();'),'view restore must happen before forced reveal so reveal is not overwritten');

assert.ok(menu.includes("from './combo-rules.js'"),'live menu mapping must use the formal combo rule core');
assert.ok(menu.includes("['便當','紫米沙律','沙律','麵餐','拌麵','薯角餐','薯蓉餐']"),'meal categories that include a drink must infer the drink requirement');
assert.ok(menu.includes("matched.combinable"),'known live/fallback combo eligibility must not be overwritten by inference');
assert.ok(menu.includes("knownRole==='snack'"),'known snack role must survive live menu mapping');
assert.ok(combo.includes('resolveRiceballComboRule')&&combo.includes('resolveSnackComboRule'),'riceball and snack compatibility must come from one formal combo rule module');

assert.ok(cart.includes('function prewarmCheckout()'),'checkout resources must warm as soon as the cart becomes usable');
assert.ok(cart.includes("frame.src='../checkout/index.html?prewarm=1'"),'checkout prewarm must use a disposable hidden checkout document');
assert.ok(css.includes('.checkout-prewarm-frame{display:none}'),'checkout prewarm frame must never affect layout');
assert.ok(!cart.includes('location.reload()'),'cart continuity must not use page reloads');

console.log('SMT_CART_CHECKOUT_REGRESSION_V2_OK');
