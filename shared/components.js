export function money(value) {
  return `$${Number(value || 0).toFixed(0)}`;
}

export function statusBadge(label, tone = 'normal') {
  return `<span class="status-badge status-badge--${tone}">${label}</span>`;
}

export function imageFallback(event) {
  const image = event?.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = 'true';
  image.removeAttribute('src');
  image.classList.add('image-fallback');
  image.alt = image.alt || '產品圖片暫未提供';
}

export function anchoredCardStyle(anchorElement, cardElement, preferredSide = 'bottom') {
  if (!anchorElement || !cardElement) return { side: preferredSide, left: 0, top: 0 };
  const anchor = anchorElement.getBoundingClientRect();
  const card = cardElement.getBoundingClientRect();
  const gap = 12;
  const candidates = {
    bottom: { left: anchor.left + anchor.width / 2 - card.width / 2, top: anchor.bottom + gap },
    top: { left: anchor.left + anchor.width / 2 - card.width / 2, top: anchor.top - card.height - gap },
    right: { left: anchor.right + gap, top: anchor.top + anchor.height / 2 - card.height / 2 },
    left: { left: anchor.left - card.width - gap, top: anchor.top + anchor.height / 2 - card.height / 2 }
  };
  const order = [preferredSide, 'bottom', 'top', 'right', 'left'];
  const fits = position => position.left >= 8 && position.top >= 8 && position.left + card.width <= innerWidth - 8 && position.top + card.height <= innerHeight - 8;
  const side = order.find(name => candidates[name] && fits(candidates[name])) || preferredSide;
  const position = candidates[side];
  return {
    side,
    left: Math.max(8, Math.min(position.left, innerWidth - card.width - 8)),
    top: Math.max(8, Math.min(position.top, innerHeight - card.height - 8))
  };
}
