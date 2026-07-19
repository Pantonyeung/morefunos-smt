export const money = value => `$${Number(value || 0).toFixed(0)}`;

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

export function renderDrinkCard(drink, {quantity = 0, disabled = false, action = 'drink-open'} = {}) {
  return `<button class="drink-card" data-action="${action}" data-value="${drink.id}" ${disabled ? 'disabled' : ''}><span class="drink-card__title">${drink.name}</span><span class="drink-card__price">${money(drink.price)}</span>${quantity ? `<b class="drink-card__qty">${quantity}</b>` : ''}</button>`;
}

export function anchoredCardStyle(anchorElement, cardElement, preferredSide = 'bottom') {
  if (!anchorElement || !cardElement) return {side: preferredSide, left: 8, top: 8};
  const anchor = anchorElement.getBoundingClientRect();
  const card = cardElement.getBoundingClientRect();
  const gap = 12;
  const positions = {
    bottom:{left:anchor.left + anchor.width / 2 - card.width / 2, top:anchor.bottom + gap},
    top:{left:anchor.left + anchor.width / 2 - card.width / 2, top:anchor.top - card.height - gap},
    right:{left:anchor.right + gap, top:anchor.top + anchor.height / 2 - card.height / 2},
    left:{left:anchor.left - card.width - gap, top:anchor.top + anchor.height / 2 - card.height / 2}
  };
  const fits = point => point.left >= 8 && point.top >= 8 && point.left + card.width <= innerWidth - 8 && point.top + card.height <= innerHeight - 8;
  const side = [preferredSide,'bottom','top','right','left'].find(name => positions[name] && fits(positions[name])) || preferredSide;
  const point = positions[side];
  return {side,left:Math.max(8,Math.min(point.left,innerWidth-card.width-8)),top:Math.max(8,Math.min(point.top,innerHeight-card.height-8))};
}

export function applyAnchoredCard(cardElement, anchorElement, preferredSide = 'bottom') {
  const position = anchoredCardStyle(anchorElement, cardElement, preferredSide);
  cardElement.dataset.anchorSide = position.side;
  cardElement.style.left = `${position.left}px`;
  cardElement.style.top = `${position.top}px`;
  return position;
}
