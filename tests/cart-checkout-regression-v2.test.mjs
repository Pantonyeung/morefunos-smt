import fs from 'node:fs';
import assert from 'node:assert/strict';

const cart=fs.readFileSync(new URL('../pages/order/cart-experience.js',import.meta.url),'utf8');
const menu=fs.readFileSync(new URL('../pages/order/menu-api.js',import.meta.url),'utf8');
const combo=fs.readFileSync(new URL('../pages/order/combo-rules.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../pages/order/cart-experience.css',import.meta.url),'utf8');
const prepareBody=cart.slice(cart.indexOf('function prepare(){'),cart.indexOf('function schedulePrepare(){'));

assert.ok(cart.includes('pendingRevealProductName'),'new/merged product must keep an explicit reveal target');
assert.ok(cart.includes("scrollIntoView({block:'nearest'"),'revealed cart row must be scrolled into the visible cart viewport');
assert.ok(cart.includes("data-recent-label','剛加入'"),'revealed cart row must expose a visible recent-item label');
assert.ok(css.includes('.cart-row.cart-row-recent::after'),'recent cart feedback must include a visible badge, not only a subtle animation');
assert.ok(prepareBody.indexOf('restoreScroll();')>=0&&prepareBody.indexOf('restoreScroll();')<prepareBody.indexOf('scheduleRevealRecentRow();'),'view restore must happen before forced reveal so reveal is not overwritten');

assert.ok(menu.includes("from './combo-rules.js'"),'live menu mapping must use the formal combo rule core');
assert.ok(menu.includes("['便當','紫米沙律','沙律','麵餐','拌麵','薯角餐','薯蓉餐']"),'meal categories that include a drink must infer the drink requirement');
assert.ok(menu.includes('matched.combinable'),'known live/fallback combo eligibility must not be overwritten by inference');
assert.ok(menu.includes("knownRole==='snack'"),'known snack role must survive live menu mapping');
assert.ok(combo.includes('resolveRiceballComboRule')&&combo.includes('resolveSnackComboRule'),'riceball and snack compatibility must come from one formal combo rule module');

assert.ok(cart.includes('pendingDrinkAssignment'),'quick drink flow must remember the cart target before the modifier opens');
assert.ok(cart.includes('lastDrinkAssignment'),'quick drink flow must keep a visible post-apply assignment result');
assert.ok(cart.includes('已配對：${lastDrinkAssignment.drink} → ${lastDrinkAssignment.target}'),'quick drink feedback must identify both drink and target meal');
assert.ok(css.includes('.quick-drink-assignment-feedback'),'quick drink assignment must have a visible in-drawer feedback surface');

assert.ok(cart.includes('function preloadCheckoutOnOrderReady()'),'checkout resources must preload when the order page is ready');
assert.ok(cart.includes("frame.src='../checkout/index.html?preload=order-ready'"),'order-ready preload must load checkout before the cart has items');
assert.ok(cart.includes('preloadCheckoutOnOrderReady();\nschedulePrepare();'),'checkout preload must start immediately at order-page initialization');
assert.ok(cart.includes('function prepareCheckoutAvailability()'),'order page must own checkout availability feedback');
assert.ok(cart.includes('button.disabled=!hasCart'),'empty cart must disable checkout interaction');
assert.ok(cart.includes("button.textContent='購物車未有餐點'"),'empty cart checkout must clearly explain why it cannot be used');
assert.ok(css.includes('[data-action="checkout"]:disabled'),'disabled checkout must have a distinct grey state');
assert.ok(!cart.includes('location.reload()'),'cart continuity must not use page reloads');

console.log('SMT_CART_CHECKOUT_REGRESSION_V3_OK');