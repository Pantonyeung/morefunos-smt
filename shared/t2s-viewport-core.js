export const T2S_VIEWPORT = Object.freeze({
  width: 1280,
  height: 800
});

export function getViewportSize() {
  const viewport = window.visualViewport;
  return {
    width: Math.round(viewport?.width || window.innerWidth),
    height: Math.round(viewport?.height || window.innerHeight)
  };
}

export function isNativeT2S(size) {
  return size.width === T2S_VIEWPORT.width && size.height === T2S_VIEWPORT.height;
}

export function fitT2SStage(stage, size = getViewportSize()) {
  const exact = isNativeT2S(size);
  const scale = exact ? 1 : Math.min(size.width / T2S_VIEWPORT.width, size.height / T2S_VIEWPORT.height);
  const renderedWidth = Math.round(T2S_VIEWPORT.width * scale);
  const renderedHeight = Math.round(T2S_VIEWPORT.height * scale);

  stage.style.width = `${T2S_VIEWPORT.width}px`;
  stage.style.height = `${T2S_VIEWPORT.height}px`;
  stage.style.left = `${Math.max(0, Math.round((size.width - renderedWidth) / 2))}px`;
  stage.style.top = `${Math.max(0, Math.round((size.height - renderedHeight) / 2))}px`;
  stage.style.zoom = '1';
  stage.style.transform = scale === 1 ? 'none' : `scale(${scale})`;
  stage.dataset.profile = exact ? 'sunmi-t2s-native' : 'sunmi-t2s-simulator';
  stage.dataset.viewportWidth = String(size.width);
  stage.dataset.viewportHeight = String(size.height);
  stage.dataset.scale = scale.toFixed(4);
  stage.dataset.fitted = '1';
  document.documentElement.dataset.previewMode = exact ? 'native' : 'simulator';
  document.documentElement.dataset.orientation = size.width >= size.height ? 'landscape' : 'portrait';

  return { exact, scale, size, orientation: size.width >= size.height ? '橫屏' : '直屏' };
}

export function renderT2SHud({ hud, hudDetail, result, build }) {
  if (!hud || !hudDetail) return;
  hud.hidden = result.exact;
  hudDetail.textContent = `裝置 ${result.size.width}×${result.size.height}（${result.orientation}）｜完整框縮放 ${Math.round(result.scale * 100)}%｜黃色框內固定為 1280×800｜版本 ${build}`;
}
