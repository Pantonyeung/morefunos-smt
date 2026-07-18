const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const routes = Object.freeze({
  boot: 'pages/boot/index.html',
  order: 'pages/order/index.html',
  checkout: 'pages/checkout/index.html',
  orders: 'pages/placeholder/index.html?page=orders&label=訂單',
  dine: 'pages/placeholder/index.html?page=dine&label=堂食',
  supply: 'pages/placeholder/index.html?page=supply&label=售罄',
  more: 'pages/placeholder/index.html?page=more&label=更多'
});

const viewport = document.getElementById('viewport');
const stage = document.getElementById('t2-stage');
const frame = document.getElementById('page-frame');
const status = document.getElementById('route-status');
let activeRoute = '';

function normalizedRoute(value) {
  const route = String(value || '').replace(/^#\/?/, '').replace(/^\//, '').split(/[?&]/)[0];
  return routes[route] ? route : 'order';
}

function fitStage() {
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  const scale = Math.min(1, width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const scaledWidth = DESIGN_WIDTH * scale;
  const scaledHeight = DESIGN_HEIGHT * scale;
  stage.style.transform = `scale(${scale})`;
  stage.style.left = `${Math.max(0, (width - scaledWidth) / 2)}px`;
  stage.style.top = `${Math.max(0, (height - scaledHeight) / 2)}px`;
  stage.dataset.scale = scale.toFixed(6);
}

function routeFromHash() {
  return normalizedRoute(location.hash || '#/order');
}

function navigate(route, {replace = false} = {}) {
  const next = normalizedRoute(route);
  const hash = `#/${next}`;
  if (replace) history.replaceState(null, '', hash);
  else if (location.hash !== hash) location.hash = hash;
  loadRoute(next);
}

function loadRoute(route) {
  const next = normalizedRoute(route);
  if (activeRoute === next && frame.src) return;
  activeRoute = next;
  frame.src = routes[next];
  frame.dataset.route = next;
  status.textContent = `已載入${next}`;
  document.title = `磨飯 SMT｜${next}`;
}

window.addEventListener('message', event => {
  const data = event.data;
  if (!data || data.type !== 'morefun:navigate') return;
  navigate(data.route);
});
window.addEventListener('hashchange', () => loadRoute(routeFromHash()));
window.addEventListener('resize', fitStage, {passive:true});
window.addEventListener('orientationchange', fitStage, {passive:true});
new ResizeObserver(fitStage).observe(viewport);

window.MoreFunSMTRouter = Object.freeze({navigate, fitStage, routes, DESIGN_WIDTH, DESIGN_HEIGHT});
fitStage();
if (!location.hash) navigate('order', {replace:true});
else loadRoute(routeFromHash());
