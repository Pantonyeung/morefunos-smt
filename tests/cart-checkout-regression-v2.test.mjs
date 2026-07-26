import fs from 'node:fs';
import assert from 'node:assert/strict';

const page=fs.readFileSync(new URL('../pages/order/page.js',import.meta.url),'utf8');
const pageCss=fs.readFileSync(new URL('../pages/order/page.css',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');
const menu=fs.readFileSync(new URL('../pages/order/menu-api.js',import.meta.url),'utf8');
const combo=fs.readFileSync(new URL('../pages/order/combo-rules.js',import.meta.url),'utf8');

assert.ok(page.includes("cartViewMode"),'cart view mode must live in the order store, not an add-on DOM layer');
assert.ok(page.includes("orderServiceMode"),'order service mode must live in the order store');
assert.ok(page.includes("toggle-cart-view"),'order core must own the single 原單/整理 toggle');
assert.ok(page.includes("toggle-order-service"),'order core must own the single 外賣/堂食 toggle');
assert.ok(page.includes("serviceModeOverride"),'line service mode exceptions must be explicit overrides');
assert.ok(page.includes("scrollTop=cart.scrollHeight"),'input-order mode must keep a newly appended line visible at the cart bottom');
assert.ok(page.includes("lastAffectedLineId"),'recent-item feedback must be state-driven by the order core');
assert.ok(pageCss.includes('.cart-row.is-recent'),'recent-item feedback must be rendered by the order page core stylesheet');

assert.ok(page.includes("cartViewMode:savedSettings.cartViewMode"),'原單/整理 preference must persist across restarts');
assert.ok(page.includes("writeJSON(SETTINGS_STORAGE_KEY"),'cart view preference must be written to settings storage');
assert.ok(page.includes("initialDineContext?'堂食':'外賣'"),'normal orders must default to 外賣 while dine-entry orders default to 堂食');

assert.ok(loader.includes("checkout"),'global shell must own checkout route lifecycle');
assert.ok(loader.includes("preloadQueue=['checkout'"),'checkout must be prepared immediately after order is ready');
assert.ok(loader.includes("morefun:checkout-enter"),'checkout activation must hydrate the latest transaction state');
assert.ok(page.includes('data-action="checkout"')&&page.includes('disabled'),'empty-cart checkout must be genuinely disabled in the order core');

assert.ok(menu.includes("from './combo-rules.js'"),'live menu mapping must use the formal combo rule core');
assert.ok(combo.includes('resolveRiceballComboRule')&&combo.includes('resolveSnackComboRule'),'riceball and snack compatibility must come from one formal combo rule module');

assert.ok(!page.includes('cart-experience'),'order core must not depend on the temporary cart-experience add-on');

console.log('SMT_CART_CHECKOUT_CORE_V4_OK');
