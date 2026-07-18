import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {WEEKDAY_THEMES, themeForDate, resolveTheme} from '../seven-day-theme.js';

const root = new URL('../', import.meta.url);
const text = path => readFile(new URL(path, root), 'utf8');

function luminance(hex) {
  const rgb = hex.slice(1).match(/.{2}/g).map(value => parseInt(value, 16) / 255).map(value => value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + .05) / (low + .05);
}

test('provides exactly seven Traditional Chinese weekday themes', () => {
  assert.equal(WEEKDAY_THEMES.length, 7);
  assert.deepEqual(WEEKDAY_THEMES.map(theme => theme.day), ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']);
});

test('automatic theme follows local weekday and manual selection wins', () => {
  const saturday = new Date(2026, 6, 18);
  assert.equal(themeForDate(saturday).id, 'sat');
  assert.equal(resolveTheme({mode:'manual', id:'wed'}, saturday).id, 'wed');
});

test('all primary theme colours keep readable white button text', () => {
  for (const theme of WEEKDAY_THEMES) assert.ok(contrast(theme.primary, '#FFFFFF') >= 4.5, `${theme.name} contrast`);
});

test('index loads theme CSS and JavaScript after the core app', async () => {
  const html = await text('index.html');
  assert.match(html, /seven-day-theme\.css/);
  assert.match(html, /app\.js[\s\S]*seven-day-theme\.js/);
});

test('theme styles strengthen active controls without changing semantic colours', async () => {
  const css = await text('seven-day-theme.css');
  assert.match(css, /category-button\.is-active/);
  assert.match(css, /nav-item\.is-active/);
  assert.match(css, /primary-button/);
  assert.doesNotMatch(css, /--color-success\s*:/);
  assert.doesNotMatch(css, /--color-warning\s*:/);
  assert.doesNotMatch(css, /--color-danger\s*:/);
});

test('service worker caches seven-day theme assets with a new version', async () => {
  const sw = await text('service-worker.js');
  assert.match(sw, /morefun-smt-seven-day-v3/);
  assert.match(sw, /seven-day-theme\.css/);
  assert.match(sw, /seven-day-theme\.js/);
});
