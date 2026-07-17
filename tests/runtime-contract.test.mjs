import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const text = path => readFile(new URL(path, root), 'utf8');

test('runtime wires the state, domain and view modules instead of fixed fake state', async () => {
  const js = await text('app.js');
  assert.match(js, /from '\.\/smt-state\.js'/);
  assert.match(js, /from '\.\/smt-domain\.js'/);
  assert.match(js, /from '\.\/smt-views\.js'/);
  assert.doesNotMatch(js, /function currentNo\(\)\{return 'P0056'\}/);
  assert.doesNotMatch(js, /state\.query=' '/);
});

test('runtime handles image failures with readable text fallback', async () => {
  const js = await text('app.js');
  assert.match(js, /image-fallback/);
  assert.match(js, /餐點圖片暫未提供/);
});

test('stylesheet locks readable type, touch and icon minimums', async () => {
  const css = await text('styles.css');
  assert.match(css, /--text-secondary:\s*14px/);
  assert.match(css, /--text-body:\s*16px/);
  assert.match(css, /--touch-normal:\s*48px/);
  assert.match(css, /--touch-quick:\s*56px/);
  assert.match(css, /--icon-size:\s*24px/);
  assert.match(css, /prefers-reduced-motion/);
});


test('rerenders preserve catalog and cart scroll positions', async () => {
  const js = await text('app.js');
  assert.match(js, /function captureViewportState/);
  assert.match(js, /function restoreViewportState/);
});

test('1024px layout does not force fixed-width cart actions beyond the panel', async () => {
  const css = await text('styles.css');
  assert.doesNotMatch(css, /\.cart-actions[^}]*minmax\(120px/);
  assert.match(css, /@media \(max-width: 1100px\)/);
});

test('service worker caches every runtime module and uses a new slice cache version', async () => {
  const sw = await text('service-worker.js');
  assert.match(sw, /morefun-smt-slice1-v1/);
  for (const file of ['accessibility.css','smt-data.js','smt-copy.js','smt-domain.js','smt-state.js','smt-icons.js','smt-motion.js','smt-views.js']) {
    assert.match(sw, new RegExp(file.replace('.', '\\.')));
  }
});
