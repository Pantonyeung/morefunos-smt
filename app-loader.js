import { fitT2SStage, getViewportSize, renderT2SHud } from './shared/t2s-viewport-core.js';

const stage = document.getElementById('stage');
const frame = document.getElementById('page');
const hud = document.getElementById('device-hud');
const hudDetail = document.getElementById('device-hud-detail');

const routes = {
  order: 'pages/order/index.html',
  checkout: 'pages/checkout/index.html',
  orders: 'pages/orders/index.html',
  dine: 'pages/dine/index.html',
  soldout: 'pages/soldout/index.html',
  more: 'pages/more/index.html'
};

const BUILD = 'smt-t2s-1280x800-core-rewrite.6';
let current = '';
let childReady = false;
let loadSeq = 0;
let readyTimer = 0;
let retriedRoute = '';

function applyT2SViewport() {
  const result = fitT2SStage(stage, getViewportSize());
  renderT2SHud({ hud, hudDetail, result, build: BUILD });
}

function route() {
  const key = (location.hash.replace(/^#\/?/, '') || 'order').split('?')[0];
  return routes[key] ? key : 'order';
}

function childHasContent() {
  try {
    const doc = frame.contentDocument;
    const app = doc?.getElementById('app');
    return Boolean(app && (app.children.length || app.textContent.trim().length > 12));
  } catch (_error) {
    return false;
  }
}

function showLoaderError(message) {
  frame.srcdoc = '<!doctype html><html lang="zh-HK"><meta charset="UTF-8"><meta name="viewport" content="width=1280,initial-scale=1"><style>body{margin:0;display:grid;place-items:center;width:1280px;height:800px;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif;background:#fff8f3;color:#382b24}.card{max-width:520px;padding:28px;border:1px solid #ead9ce;border-radius:16px;background:#fff;text-align:center}.card strong{display:block;font-size:24px;color:#e84b12;margin-bottom:10px}.card button{min-height:48px;margin-top:12px;padding:0 20px;border:0;border-radius:10px;background:#ef5b23;color:#fff;font-weight:800}</style><body><section class="card"><strong>頁面未能載入</strong><p>' + String(message || '請重新整理後再試') + '</p><button onclick="location.reload()">重新載入</button></section></body></html>';
}

function load({ force = false } = {}) {
  const key = route();
  if (!force && key === current && childReady) return;
  current = key;
  childReady = false;
  const seq = ++loadSeq;
  clearTimeout(readyTimer);
  frame.removeAttribute('srcdoc');
  frame.style.visibility = 'visible';
  frame.style.opacity = '1';
  frame.src = routes[key] + '?build=' + encodeURIComponent(BUILD) + '&t=' + Date.now();

  readyTimer = setTimeout(() => {
    if (seq !== loadSeq || childReady) return;
    if (childHasContent()) {
      childReady = true;
      return;
    }
    if (retriedRoute === key) return;
    retriedRoute = key;
    frame.src = routes[key] + '?build=' + encodeURIComponent(BUILD) + '&retry=' + Date.now();
  }, key === 'more' ? 2600 : 3200);
}

frame.addEventListener('error', () => showLoaderError('子頁載入失敗，資料仍保存在本機。'));
frame.addEventListener('load', applyT2SViewport);

addEventListener('hashchange', () => load({ force: true }));
addEventListener('pageshow', () => {
  applyT2SViewport();
  if (!childReady) load({ force: true });
});
addEventListener('resize', applyT2SViewport, { passive: true });
addEventListener('orientationchange', () => setTimeout(applyT2SViewport, 120), { passive: true });

addEventListener('message', event => {
  if (event.source !== frame.contentWindow) return;
  if (event.data?.type === 'morefun:page-ready') {
    childReady = true;
    retriedRoute = '';
    clearTimeout(readyTimer);
  }
  if (event.data?.type === 'morefun:navigate') {
    const next = String(event.data.route || 'order');
    if (location.hash === '#/' + next) load({ force: true });
    else location.hash = '#/' + next;
  }
  if (event.data?.type === 'morefun:exit-fullscreen' && document.fullscreenElement) document.exitFullscreen?.();
  if (event.data?.type === 'morefun:set-ui-scale') {
    frame.contentWindow?.postMessage({ type: 'morefun:ui-scale-disabled', reason: 'T2S 使用固定 1280×800 測試框；請使用瀏覽器雙指縮放檢查細節。' }, '*');
  }
  if (event.data?.type === 'morefun:reload-current-page') load({ force: true });
  if (event.data?.type === 'morefun:page-runtime-error') {
    console.error(event.data);
    if (!childReady) showLoaderError('頁面啟動失敗，資料仍保存在本機，請重新整理後再試。');
  }
});

applyT2SViewport();
load({ force: true });
