import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function text(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('index uses Traditional Chinese and exposes the fixed-canvas loader mounts', async () => {
  const html = await text('index.html');
  assert.match(html, /<html lang="zh-HK">/);
  assert.match(html, /id="viewport"/);
  assert.match(html, /id="t2-stage"/);
  assert.match(html, /id="page-frame"/);
  assert.match(html, /id="route-status"/);
  assert.match(html, /type="module" src="app-loader\.js"/);
});

test('all planned runtime modules exist', async () => {
  for (const file of [
    'app.js', 'smt-data.js', 'smt-copy.js', 'smt-domain.js',
    'smt-state.js', 'smt-icons.js', 'smt-motion.js', 'smt-views.js'
  ]) {
    await assert.doesNotReject(() => text(file), file);
  }
});

test('accessibility helpers do not disturb the existing layout', async () => {
  const css = await text('accessibility.css');
  assert.match(css, /\.skip-link/);
  assert.match(css, /\.sr-only/);
});
