const renderQueue = new Set();
let renderFrame = 0;

export function safeClone(value) {
  if (typeof structuredClone === 'function') {
    try { return structuredClone(value); } catch {}
  }
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

export function queueRender(task) {
  if (typeof task !== 'function') return;
  renderQueue.add(task);
  if (renderFrame) return;
  renderFrame = requestAnimationFrame(() => {
    renderFrame = 0;
    const tasks = [...renderQueue];
    renderQueue.clear();
    for (const current of tasks) {
      try { current(); } catch (error) { reportRuntimeError(error); }
    }
  });
}

export function showToast(message, {duration = 1600, target = document.getElementById('toast')} = {}) {
  if (!target) return;
  target.textContent = String(message || '');
  target.classList.add('show');
  window.clearTimeout(Number(target.dataset.timer || 0));
  const timer = window.setTimeout(() => target.classList.remove('show'), duration);
  target.dataset.timer = String(timer);
}

export function createErrorBoundary({mount = document.body, preserve = () => {}} = {}) {
  let shown = false;
  return error => {
    console.error('[MoreFun SMT]', error);
    try { preserve(); } catch {}
    if (shown || !mount) return;
    shown = true;
    const card = document.createElement('section');
    card.className = 'runtime-error-card';
    card.dataset.runtimeError = 'true';
    card.innerHTML = '<strong>系統顯示發生錯誤</strong><p>訂單及暫存資料仍保存在本機。請重新載入此頁。</p><button type="button" data-action="runtime-reload">重新載入</button>';
    card.querySelector('[data-action="runtime-reload"]').addEventListener('click', () => location.reload());
    mount.append(card);
  };
}

const globalBoundary = typeof document === 'undefined' ? null : createErrorBoundary();
if (typeof window !== 'undefined' && globalBoundary) {
  window.addEventListener('error', event => globalBoundary(event.error || new Error(event.message)));
  window.addEventListener('unhandledrejection', event => globalBoundary(event.reason instanceof Error ? event.reason : new Error(String(event.reason))));
}
