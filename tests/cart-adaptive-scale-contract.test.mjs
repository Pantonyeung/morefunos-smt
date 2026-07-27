import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const adaptive=fs.readFileSync(new URL('../shared/adaptive-layout.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../shared/adaptive-layout.css',import.meta.url),'utf8');

test('cart adaptive scale must not shrink from cart height at 1920 baseline',()=>{
  assert.equal(adaptive.includes('rect.height/890'),false,'cart height must not be used as a second scale authority');
  assert.match(adaptive,/innerWidth\/1920/);
  assert.match(adaptive,/innerHeight\/1080/);
});

test('cart marker remains exactly 90% of cart image token',()=>{
  assert.match(css,/--adaptive-cart-marker:calc\(var\(--adaptive-cart-image\) \* \.9\)/);
  assert.match(adaptive,/const markerSize=clamp\(imageSize\*\.9,42,70\)/);
});
