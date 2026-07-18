const STORAGE_KEY = 'morefun-smt-theme-v3';

export const WEEKDAY_THEMES = Object.freeze([
  {id:'sun', weekday:0, day:'星期日', name:'金柚茶', primary:'#8C5514', primaryDark:'#6A3C08', primarySoft:'#F7E5C8', panel:'#FBF3E6', surfaceSoft:'#F4E9D8', line:'#CFC0AB'},
  {id:'mon', weekday:1, day:'星期一', name:'朝霧橙', primary:'#A94416', primaryDark:'#7B2C0B', primarySoft:'#F8DDCF', panel:'#FBEEE7', surfaceSoft:'#F3E5DD', line:'#CDBAAF'},
  {id:'tue', weekday:2, day:'星期二', name:'山茶紅', primary:'#A23848', primaryDark:'#762431', primarySoft:'#F5DDE1', panel:'#FBEDEF', surfaceSoft:'#F2E4E6', line:'#CFB9BD'},
  {id:'wed', weekday:3, day:'星期三', name:'青竹綠', primary:'#2F6B50', primaryDark:'#204B38', primarySoft:'#DCECE3', panel:'#EDF5F0', surfaceSoft:'#E3EEE8', line:'#B9CBC1'},
  {id:'thu', weekday:4, day:'星期四', name:'湖水青', primary:'#1E6870', primaryDark:'#124B52', primarySoft:'#D9ECEE', panel:'#ECF5F5', surfaceSoft:'#E0EDEE', line:'#B6CACB'},
  {id:'fri', weekday:5, day:'星期五', name:'暮靛藍', primary:'#4D5892', primaryDark:'#35406E', primarySoft:'#E1E4F2', panel:'#EFF0F8', surfaceSoft:'#E6E8F1', line:'#BEC2D3'},
  {id:'sat', weekday:6, day:'星期六', name:'紫蘇莓', primary:'#6F4B78', primaryDark:'#503454', primarySoft:'#EADFEB', panel:'#F5EEF5', surfaceSoft:'#ECE4EC', line:'#C9BCC9'}
]);

export function themeForDate(date = new Date()) {
  return WEEKDAY_THEMES.find(theme => theme.weekday === date.getDay()) ?? WEEKDAY_THEMES[0];
}

export function readThemePreference(storage = localStorage) {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) || '{"mode":"auto"}');
    if (value.mode === 'manual' && WEEKDAY_THEMES.some(theme => theme.id === value.id)) return value;
  } catch {}
  return {mode:'auto', id:null};
}

export function resolveTheme(preference = readThemePreference(), date = new Date()) {
  if (preference.mode === 'manual') {
    return WEEKDAY_THEMES.find(theme => theme.id === preference.id) ?? themeForDate(date);
  }
  return themeForDate(date);
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return theme;
  const root = document.documentElement;
  root.dataset.themeV3 = theme.id;
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-dark', theme.primaryDark);
  root.style.setProperty('--color-primary-soft', theme.primarySoft);
  root.style.setProperty('--theme-panel', theme.panel);
  root.style.setProperty('--theme-surface-soft', theme.surfaceSoft);
  root.style.setProperty('--theme-line', theme.line);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.primaryDark);
  return theme;
}

function paletteIcon() {
  return '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18h1.4a2 2 0 0 0 1.3-3.5c-.7-.6-.3-1.7.6-1.7H17a4 4 0 0 0 4-4A9 9 0 0 0 12 3Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="6.8" r="1"/><circle cx="14" cy="6.8" r="1"/><circle cx="17" cy="10" r="1"/></svg>';
}

function currentTheme() {
  return resolveTheme(readThemePreference());
}

function setPreference(preference) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  const theme = applyTheme(resolveTheme(preference));
  updateTrigger(theme, preference);
  return theme;
}

function updateTrigger(theme = currentTheme(), preference = readThemePreference()) {
  const button = document.querySelector('.theme-v3-trigger');
  if (!button) return;
  const mode = preference.mode === 'auto' ? '跟隨星期' : '手動主題';
  button.title = `${mode}：${theme.day} · ${theme.name}`;
  button.setAttribute('aria-label', button.title);
  const label = button.querySelector('.theme-v3-trigger-label');
  if (label) label.textContent = `${theme.day.replace('星期','週')} · ${theme.name}`;
}

function ensureTrigger() {
  const topActions = document.querySelector('.top-actions');
  if (!topActions || topActions.querySelector('.theme-v3-trigger')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-text-compact theme-v3-trigger';
  button.innerHTML = `${paletteIcon()}<span class="theme-v3-trigger-label"></span>`;
  button.addEventListener('click', openThemePicker);
  const clock = topActions.querySelector('#clock');
  topActions.insertBefore(button, clock ?? null);
  updateTrigger();
}

function closeThemePicker() {
  document.querySelector('.theme-v3-backdrop')?.remove();
}

function openThemePicker() {
  closeThemePicker();
  const preference = readThemePreference();
  const active = resolveTheme(preference);
  const backdrop = document.createElement('div');
  backdrop.className = 'theme-v3-backdrop';
  backdrop.innerHTML = `<section class="theme-v3-dialog" role="dialog" aria-modal="true" aria-labelledby="theme-v3-title">
    <header><span><small>每日保持熟悉，顏色輕微轉換</small><h2 id="theme-v3-title">七日主題</h2></span><button class="theme-v3-close" type="button" aria-label="關閉主題選擇">×</button></header>
    <button class="theme-v3-auto ${preference.mode === 'auto' ? 'is-selected' : ''}" type="button"><span class="theme-v3-auto-mark">自動</span><span><strong>跟隨星期</strong><small>每日自動選用對應主題</small></span>${preference.mode === 'auto' ? '<b>✓</b>' : ''}</button>
    <div class="theme-v3-grid">${WEEKDAY_THEMES.map(theme => `<button type="button" class="theme-v3-choice ${active.id === theme.id && preference.mode === 'manual' ? 'is-selected' : ''}" data-theme-id="${theme.id}"><i style="--swatch:${theme.primary};--swatch-soft:${theme.primarySoft}"></i><span><small>${theme.day}</small><strong>${theme.name}</strong></span>${active.id === theme.id && preference.mode === 'manual' ? '<b>✓</b>' : ''}</button>`).join('')}</div>
    <p>成功、警告、錯誤及離線顏色不會隨主題改變，避免操作混淆。</p>
  </section>`;
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop || event.target.closest('.theme-v3-close')) return closeThemePicker();
    if (event.target.closest('.theme-v3-auto')) {
      setPreference({mode:'auto', id:null});
      closeThemePicker();
      return;
    }
    const choice = event.target.closest('[data-theme-id]');
    if (choice) {
      setPreference({mode:'manual', id:choice.dataset.themeId});
      closeThemePicker();
    }
  });
  document.body.append(backdrop);
  backdrop.querySelector('.theme-v3-close')?.focus();
}

export function initializeSevenDayTheme() {
  if (typeof document === 'undefined') return;
  applyTheme(currentTheme());
  ensureTrigger();
  const app = document.getElementById('app');
  if (app) new MutationObserver(ensureTrigger).observe(app, {childList:true, subtree:true});
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeThemePicker();
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeSevenDayTheme, {once:true});
  else initializeSevenDayTheme();
}
