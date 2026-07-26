import fs from 'node:fs';
import assert from 'node:assert/strict';

const page=fs.readFileSync(new URL('../pages/order/page.js',import.meta.url),'utf8');
const cartCss=fs.readFileSync(new URL('../pages/order/cart.css',import.meta.url),'utf8');
const domain=fs.readFileSync(new URL('../pages/order/order-domain.js',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('../app-loader.js',import.meta.url),'utf8');
const menu=fs.readFileSync(new URL('../pages/order/menu-api.js',import.meta.url),'utf8');
const combo=fs.readFileSync(new URL('../pages/order/combo-rules.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../pages/order/index.html',import.meta.url),'utf8');
const shellHtml=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const previewHtml=fs.readFileSync(new URL('../dev-preview.html',import.meta.url),'utf8');

assert.ok(page.includes('cartViewMode'),'cart view mode must live in the order store, not an add-on DOM layer');
assert.ok(page.includes('orderServiceMode'),'order service mode must live in the order store');
assert.ok(page.includes('toggle-cart-view'),'order core must own the single 原單/整理 toggle');
assert.ok(page.includes('toggle-order-service'),'order core must own the single 外賣/堂食 toggle');
assert.ok(page.includes('toggle-line-service'),'each cart line must support an explicit reverse service-mode action');
assert.ok(domain.includes('serviceModeOverride'),'line service mode exceptions must be represented explicitly');
assert.ok(page.includes('cart.scrollTop=cart.scrollHeight'),'input-order mode must keep a newly appended line visible at the cart bottom');
assert.ok(page.includes('lastAffectedLineId'),'recent-item feedback must be state-driven by the order core');
assert.ok(cartCss.includes('.cart-row.is-recent'),'recent-item feedback must be rendered by the core cart stylesheet');

assert.ok(page.includes('cartViewMode:savedSettings.cartViewMode'),'原單/整理 preference must persist across restarts');
assert.ok(page.includes('writeJSON(SETTINGS_STORAGE_KEY'),'cart view preference must be written to settings storage');
assert.ok(domain.includes("if(dineContext)return SERVICE_DINE_IN")&&domain.includes('SERVICE_TAKEAWAY'),'normal orders must default to 外賣 while dine-entry orders default to 堂食');
assert.ok(domain.includes('organizeCartForDisplay'),'整理 must be a display transform rather than a destructive cart sort');

assert.ok(loader.includes("preloadQueue=['checkout'"),'checkout must be prepared immediately after order is ready');
assert.ok(loader.includes('morefun:checkout-enter'),'checkout activation must hydrate the latest transaction state');
assert.ok(page.includes('data-action="checkout"')&&page.includes("(hasCart?'':'disabled')"),'empty-cart checkout must be genuinely disabled in the order core');

assert.ok(page.includes('已配對：')&&page.includes('lastDrinkAssignment'),'quick drink feedback must remain in the order core after add-on removal');
assert.ok(menu.includes("from './combo-rules.js'"),'live menu mapping must use the formal combo rule core');
assert.ok(combo.includes('resolveRiceballComboRule')&&combo.includes('resolveSnackComboRule'),'riceball and snack compatibility must come from one formal combo rule module');

assert.ok(!html.includes('cart-experience'),'order page must not load the temporary cart-experience add-on');
assert.match(html,/cart\.css\?v=order-cart-core-v\d+/,'order page must load a versioned formal cart core stylesheet');
assert.ok(!page.includes('cart-experience'),'order core must not depend on the temporary cart-experience add-on');

assert.ok(shellHtml.includes('id="dev-preview-entry"')&&shellHtml.includes('dev-preview.html'),'production shell must keep the explicit mobile size QA entry');
assert.ok(previewHtml.includes('1920')&&previewHtml.includes('1280'),'size QA tool must expose the locked responsive profiles instead of silently choosing one runtime size');
assert.ok(cartCss.includes('.modifier-card:not([data-pointer-side])'),'modifier cards without an anchor must fall back to centered positioning');
assert.ok(cartCss.includes('暫時未有可用選項'),'empty bulk option sets must render an explicit safe fallback');
assert.ok(cartCss.includes('.cart-list>.cart-row:nth-child(even)'),'input-order cart must use restrained zebra rows');
assert.ok(cartCss.includes('.cart-category .cart-row:nth-of-type(even)'),'organized cart must use restrained zebra rows');
assert.ok(cartCss.includes('.service-mode .line-service-toggle{position:absolute;left:0'),'line service mode must sit with the sequence marker instead of consuming description space');

console.log('SMT_CART_CHECKOUT_CORE_V6_OK');
