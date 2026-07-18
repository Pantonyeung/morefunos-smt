function makeLineId() {
  return globalThis.crypto?.randomUUID?.() ?? `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function optionSignature(options = {}) {
  return JSON.stringify(Object.entries(options).sort(([a], [b]) => a.localeCompare(b)));
}

export function addCartItem(cart, product, options = {}) {
  if (product.availability === 'sold-out' || product.availability === 'paused') {
    return cart;
  }

  const signature = optionSignature(options);
  const existingIndex = cart.findIndex(item =>
    item.productId === product.id && item.optionSignature === signature
  );

  if (existingIndex >= 0) {
    return cart.map((item, index) => index === existingIndex
      ? {...item, qty: item.qty + 1}
      : item
    );
  }

  return [...cart, {
    lineId: makeLineId(),
    productId: product.id,
    code: product.code,
    name: product.name,
    qty: 1,
    unitPrice: product.price,
    options: {...options},
    optionSignature: signature,
    requiredGroups: [...(product.requiredGroups ?? [])]
  }];
}

export function changeCartItemQuantity(cart, lineId, delta) {
  return cart.map(item => item.lineId === lineId
    ? {...item, qty: Math.max(1, item.qty + delta)}
    : item
  );
}

export function removeCartItem(cart, lineId) {
  return cart.filter(item => item.lineId !== lineId);
}

export function updateCartItemOptions(cart, lineId, options) {
  return cart.map(item => {
    if (item.lineId !== lineId) return item;
    const nextOptions = {...item.options, ...options};
    return {
      ...item,
      options: nextOptions,
      optionSignature: optionSignature(nextOptions)
    };
  });
}

export function getCartSummary(cart) {
  return {
    itemCount: cart.reduce((sum, item) => sum + item.qty, 0),
    subtotal: cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
  };
}

export function getRequiredState(cart) {
  const missing = cart.flatMap(item => (item.requiredGroups ?? [])
    .filter(group => !item.options?.[group])
    .map(group => ({lineId: item.lineId, group}))
  );

  return {
    missing,
    missingCount: missing.length,
    canCheckout: missing.length === 0
  };
}

export function incrementOrderNumber(current) {
  const match = /^([A-Z]+)(\d+)$/.exec(current);
  if (!match) throw new Error('Invalid order number');
  return `${match[1]}${String(Number(match[2]) + 1).padStart(match[2].length, '0')}`;
}

export function createLocalOrder({state, now, nextOrderNumber, persist}) {
  const required = getRequiredState(state.cart);
  const hasPayment = Boolean(state.checkout?.paymentMethod);

  if (!state.cart.length || !required.canCheckout || !hasPayment) {
    return {ok: false, reason: 'invalid', nextState: state};
  }

  const summary = getCartSummary(state.cart);
  const order = {
    id: nextOrderNumber,
    createdAt: now,
    acceptedAt: now,
    timerStartedAt: now,
    source: state.checkout.source,
    paymentMethod: state.checkout.paymentMethod,
    items: state.cart,
    total: summary.subtotal,
    printJobsCreated: true
  };
  const nextState = {
    ...state,
    orders: [order, ...(state.orders ?? [])],
    cart: []
  };

  try {
    persist(nextState);
    return {ok: true, order, nextState};
  } catch (error) {
    return {
      ok: false,
      reason: 'persist-failed',
      error,
      nextState: state
    };
  }
}
