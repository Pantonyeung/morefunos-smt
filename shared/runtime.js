const queued = new Set();
let frame = 0;

export function safeClone(value) {
  if (typeof structuredClone === 'function') {
    try { return structuredClone(value); } catch {}
  }
  return JSON.parse(JSON.stringify(value));
}

export function queueRender(task) {
  if (typeof task !== 'function') return;
  queued.add(task);
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const tasks = [...queued];
    queued.clear();
    for (const fn of tasks) {
      try { fn(); } catch (error) { reportRuntimeError(error); }
    }
  });
}

export function reportRuntimeError(error, mount = document.body) {
  console.error('[MoreFun SMT]', error);
  if (!mount || mount.querySelector?.('[data-runtime-error]')) return;
  const card = document.createElement('section');
  card.dataset.runtimeError = 'true';
  card.className = 'runtime-error-card';
  card.innerHTML = '<strong>系統顯示發生錯誤</strong><p>訂單資料仍保存在本機。請重新載入此頁。</p><button type="button">重新載入</button>';
  card.querySelector('button').addEventListener('click', () => location.reload());
  mount.append(card);
}

window.addEventListener('error', event => reportRuntimeError(event.error || new Error(event.message)));
window.addEventListener('unhandledrejection', event => reportRuntimeError(event.reason instanceof Error ? event.reason : new Error(String(event.reason))));
