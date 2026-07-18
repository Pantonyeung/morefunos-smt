import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('root loader locks a 1920x1080 T2 canvas and scales uniformly', () => {
  const html = read('index.html');
  const css = read('app-shell.css');
  const js = read('app-loader.js');
  assert.match(html, /id="t2-stage"/);
  assert.match(html, /id="page-frame"/);
  assert.match(css, /--design-width:\s*1920/);
  assert.match(css, /--design-height:\s*1080/);
  assert.match(css, /background:\s*#000/);
  assert.match(css, /safe-area-inset-left/);
  assert.match(js, /DESIGN_WIDTH\s*=\s*1920/);
  assert.match(js, /DESIGN_HEIGHT\s*=\s*1080/);
  assert.match(js, /Math\.min\(1,\s*width\s*\/\s*DESIGN_WIDTH,\s*height\s*\/\s*DESIGN_HEIGHT\)/);
  assert.doesNotMatch(css, /@media[^{]*\{[^}]*grid-template-columns/s);
});

test('root loader maps completed pages and unfinished navigation placeholders', () => {
  const js = read('app-loader.js');
  for (const route of ['boot','order','checkout','orders','dine','supply','more']) {
    assert.match(js, new RegExp(`${route}:`));
  }
  assert.match(js, /morefun:navigate/);
  assert.match(js, /pages\/order\/index\.html/);
  assert.match(js, /pages\/checkout\/index\.html/);
  assert.match(js, /pages\/boot\/index\.html/);
  assert.match(js, /pages\/placeholder\/index\.html/);
});

test('shared bridge exposes route postMessage and local fallback', () => {
  assert.ok(existsSync(new URL('../shared/page-bridge.js', import.meta.url)));
  const bridge = read('shared/page-bridge.js');
  assert.match(bridge, /parent\.postMessage/);
  assert.match(bridge, /type:\s*['"]morefun:navigate['"]/);
  assert.match(bridge, /data-route/);
  assert.match(bridge, /location\.hash/);
});

test('completed page folders and contracts exist', () => {
  for (const page of ['boot','order','checkout','placeholder']) {
    assert.ok(existsSync(new URL(`../pages/${page}/index.html`, import.meta.url)), `${page} index missing`);
    assert.ok(existsSync(new URL(`../pages/${page}/page.css`, import.meta.url)), `${page} css missing`);
    assert.ok(existsSync(new URL(`../pages/${page}/page.js`, import.meta.url)), `${page} js missing`);
  }
  for (const page of ['boot','order','checkout']) {
    assert.ok(existsSync(new URL(`../pages/${page}/page-contract.json`, import.meta.url)), `${page} contract missing`);
  }
});
