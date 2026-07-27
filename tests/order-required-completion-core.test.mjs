import fs from 'node:fs';
import assert from 'node:assert/strict';

const page=fs.readFileSync(new URL('../pages/order/page.js',import.meta.url),'utf8');
const cartCss=fs.readFileSync(new URL('../pages/order/cart.css',import.meta.url),'utf8');
const adaptiveCss=fs.readFileSync(new URL('../shared/adaptive-layout.css',import.meta.url),'utf8');

assert.ok(page.includes('function requiredTargets('),'required completion must enumerate exact cart targets');
assert.ok(page.includes('function applyRequiredGroup('),'required completion must apply target-aware assignments in the order core');
assert.ok(page.includes('completion-required-choice'),'required workflow must support per-target choices');
assert.ok(page.includes('completion-target'),'required workflow must let staff explicitly select the target item');
assert.ok(page.includes('其餘未選全部用同一選項'),'same-choice bulk fill may exist only as an explicit staff shortcut');
assert.ok(!page.includes('apply-bulk'),'legacy force-same bulk required completion must not return');
assert.ok(!page.includes('bulkOptionModal'),'legacy bulk option modal must not return');

assert.ok(page.includes('seq-service'),'cart sequence and 堂/外 must share the compact vertical service badge');
assert.ok(cartCss.includes('.cart-row>.seq-service'),'service badge visual must remain owned by cart.css');
assert.ok(cartCss.includes('width:var(--adaptive-cart-marker')&&cartCss.includes('height:var(--adaptive-cart-marker'),'service badge geometry must consume the adaptive marker token rather than a fixed pixel size');
assert.ok(adaptiveCss.includes('--adaptive-cart-marker:calc(var(--adaptive-cart-image) * .9)'),'service badge must remain exactly 90% of the cart image token');
assert.ok(cartCss.includes('.required-workflow-grid'),'checkout-blocking required work must use the large central workflow');

for(const action of ['open-product','edit-line','open-quick-settings','open-settings','open-health','open-soldout']){
  assert.ok(page.includes(action),`anchored action ${action} must remain in order core`);
}
assert.ok(page.includes('anchorRect(button)'),'optional button-triggered flows must preserve source anchors');
for(const side of ['left','right','top','bottom']){
  assert.ok(cartCss.includes(`data-pointer-side="${side}"`),`popover pointer must support ${side} in the component core`);
}

console.log('SMT_ORDER_REQUIRED_COMPLETION_TOKEN_CORE_OK');
