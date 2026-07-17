export const STORAGE_KEY = 'morefun-smt-state-v2';
const LEGACY_STORAGE_KEY = 'morefun-smt-state';

export function createInitialState() {
  return {
    schemaVersion: 2,
    page: 'order',
    quickMode: false,
    online: true,
    currentOrderNumber: 'P0056',
    category: '全部',
    search: {open: false, query: ''},
    cart: [],
    checkout: {
      source: 'walk-in',
      mode: 'takeaway',
      packaging: 'standard',
      discount: null,
      paymentMethod: null,
      optionalOpen: false,
      note: '',
      saving: false
    },
    orders: [],
    incomingOrders: [],
    incomingBatch: {
      visible: false,
      reminderRequired: false,
      orderIds: []
    },
    overlay: null,
    toast: null,
    undo: null
  };
}

export function migrate(raw = {}) {
  const initial = createInitialState();

  if (raw.schemaVersion === 2) {
    return {
      ...initial,
      ...raw,
      search: {...initial.search, ...(raw.search ?? {})},
      checkout: {...initial.checkout, ...(raw.checkout ?? {})},
      incomingBatch: {...initial.incomingBatch, ...(raw.incomingBatch ?? {})}
    };
  }

  return {
    ...initial,
    page: raw.page ?? initial.page,
    quickMode: Boolean(raw.quickMode),
    online: raw.online !== false,
    currentOrderNumber: raw.currentOrderNumber ?? initial.currentOrderNumber,
    category: raw.category ?? initial.category,
    search: {
      open: Boolean(raw.query?.trim?.()),
      query: raw.query?.trim?.() ?? ''
    },
    cart: Array.isArray(raw.cart) ? raw.cart.filter(item => item && item.lineId && Number.isFinite(item.unitPrice)) : [],
    orders: Array.isArray(raw.orders) ? raw.orders : [],
    incomingOrders: Array.isArray(raw.newOrders) ? raw.newOrders : []
  };
}

export function loadState(storage = localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY) ?? storage.getItem(LEGACY_STORAGE_KEY) ?? '{}';
    return migrate(JSON.parse(raw));
  } catch {
    return createInitialState();
  }
}

export function saveState(storage, state) {
  const durable = {
    ...state,
    overlay: null,
    toast: null
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(durable));
}

export function reducer(state, action) {
  switch (action.type) {
    case 'PAGE_SET':
      return {...state, page: action.page};
    case 'QUICK_MODE_SET':
      return {...state, quickMode: Boolean(action.value)};
    case 'ONLINE_SET':
      return {...state, online: Boolean(action.value)};
    case 'CATEGORY_SET':
      return {...state, category: action.value, search: {open: false, query: ''}};
    case 'SEARCH_OPEN':
      return {...state, search: {...state.search, open: true}};
    case 'SEARCH_QUERY_SET':
      return {...state, search: {open: true, query: action.value}};
    case 'SEARCH_CLEAR':
      return {...state, search: {open: false, query: ''}};
    case 'CHECKOUT_PAYMENT_SET':
      return {...state, checkout: {...state.checkout, paymentMethod: action.value}};
    case 'CHECKOUT_FIELD_SET':
      return {...state, checkout: {...state.checkout, [action.field]: action.value}};
    case 'CHECKOUT_SAVING_SET':
      return {...state, checkout: {...state.checkout, saving: Boolean(action.value)}};
    case 'INCOMING_BATCH_RECEIVED':
      return {
        ...state,
        incomingOrders: [...state.incomingOrders, ...action.orders],
        incomingBatch: {
          visible: true,
          reminderRequired: false,
          orderIds: action.orders.map(order => order.id)
        }
      };
    case 'INCOMING_LATER':
      return {
        ...state,
        incomingBatch: {
          ...state.incomingBatch,
          visible: false,
          reminderRequired: true
        }
      };
    case 'INCOMING_REVIEW_OPEN':
      return {
        ...state,
        overlay: {type: 'incoming-review', orderId: action.orderId},
        incomingBatch: {...state.incomingBatch, visible: false}
      };
    case 'OVERLAY_SET':
      return {...state, overlay: action.overlay};
    case 'TOAST_SET':
      return {...state, toast: action.toast};
    default:
      return state;
  }
}

export function createStore({storage = localStorage, now = Date.now} = {}) {
  let state = loadState(storage);
  const listeners = new Set();

  function notify(action) {
    listeners.forEach(listener => listener(state, action));
  }

  return {
    getState() {
      return state;
    },
    dispatch(action) {
      const enrichedAction = {...action, at: now()};
      state = reducer(state, enrichedAction);
      saveState(storage, state);
      notify(enrichedAction);
    },
    replace(nextState, action = {type: 'STATE_REPLACED'}) {
      state = nextState;
      saveState(storage, state);
      notify(action);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
