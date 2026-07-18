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
  assert.match(sw, /morefun-smt-slice1-v2/);
  for (const file of ['accessibility.css','slice1-readability-fixes.css','smt-data.js','smt-copy.js','smt-domain.js','smt-state.js','smt-icons.js','smt-motion.js','smt-views.js']) {
    assert.match(sw, new RegExp(file.replace('.', '\\.')));
  }
});

test('every visible POS control meets the 48px touch target lock', async () => {
  const css = `${await text('styles.css')}\n${await text('slice1-readability-fixes.css')}`;
  for (const selector of [
    '.quiet-danger',
    '.category-button, .search-toggle',
    '.card-detail-button',
    '.quantity-stepper button, .quantity-stepper span',
    '.remove-button',
    '.close-button',
    '.toast button'
  ]) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(css, new RegExp(`${escaped}\\s*\\{[^}]*min-height:\\s*(?:var\\(--touch\\)|48px)`, 's'), selector);
  }
});

test('checkout drawer keeps its confirmation footer visible while content scrolls', async () => {
  const css = `${await text('styles.css')}\n${await text('slice1-readability-fixes.css')}`;
  assert.match(css, /\.checkout-drawer\s*\{[^}]*grid-template-rows:\s*auto\s+minmax\(0,\s*1fr\)\s+auto/s);
});

test('badges and large T2s screens preserve strong readability', async () => {
  const css = `${await text('styles.css')}\n${await text('slice1-readability-fixes.css')}`;
  assert.match(css, /\.hot-label, \.quantity-badge[^}]*font-size:\s*var\(--text-secondary\)/s);
  assert.match(css, /\.nav-item em[^}]*font-size:\s*var\(--text-secondary\)/s);
  assert.match(css, /@media \(min-width:\s*1600px\)[\s\S]*--text-body:\s*18px/);
});

test('Android QA pack is ready for Sunmi T2s landscape evidence capture', async () => {
  const readme = await text('android-qa/README.md');
  const script = await text('android-qa/run-sunmi-t2s-qa.sh');
  assert.match(readme, /1920×1080/);
  assert.match(readme, /1024×600/);
  assert.match(readme, /Android 9/);
  assert.match(script, /adb devices/);
  assert.match(script, /uiautomator dump/);
  assert.match(script, /screencap -p/);
  assert.match(script, /logcat/);
});

test('SMT checkout core remains independent from OpenAI API keys', async () => {
  const files = await Promise.all(['app.js','smt-domain.js','smt-state.js','smt-views.js'].map(text));
  const runtime = files.join('\n');
  assert.doesNotMatch(runtime, /OPENAI_API_KEY|api\.openai\.com|sk-proj-/);
  const boundary = await text('docs/openai-developer-boundary.md');
  assert.match(boundary, /不得阻塞點單、付款、打印或日結/);
});
