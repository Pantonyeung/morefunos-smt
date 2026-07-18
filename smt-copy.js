export const copy = Object.freeze({
  app: {
    name: '磨飯 SMT',
    subtitle: '店舖操作台',
    open: '營業中',
    online: '系統在線',
    offline: '離線可工作',
    syncing: '同步正常',
    syncLater: '恢復網絡後同步'
  },
  nav: {
    order: '點單',
    orders: '訂單',
    dine: '堂食',
    sold: '售罄',
    more: '更多'
  },
  actions: {
    add: '加入',
    edit: '修改',
    remove: '移除',
    undo: '復原',
    draft: '暫存',
    retrieve: '取單',
    checkout: '結帳',
    confirmOrder: '確認落單',
    later: '稍後處理',
    review: '查看及處理',
    back: '返回修改',
    retry: '重試',
    clearCart: '清空購物車',
    close: '關閉',
    cancel: '取消',
    save: '儲存修改'
  },
  order: {
    emptyTitle: '未有餐點',
    emptyBody: '由右邊選擇商品',
    chooseFirst: '先由右邊選擇餐點',
    required: '先整理',
    missing: '尚欠項目',
    completed: '已完成',
    search: '搜尋',
    searchPlaceholder: '搜尋商品名稱或編號',
    noResult: '找不到相關商品',
    subtotal: '小計',
    total: '總計',
    quantity: '商品數量'
  },
  checkout: {
    title: '確認訂單',
    source: '訂單來源',
    mode: '用餐方式',
    packaging: '包裝',
    discount: '優惠',
    payment: '付款方式',
    optional: '其他資料（可選）',
    saving: '正在安全保存…'
  },
  status: {
    paymentPending: '付款待核實',
    printRetry: '打印待重試',
    soldOut: '今日售罄',
    paused: '暫停供應',
    saved: '本機資料已安全保存',
    newOrders: '新訂單',
    statusCenter: '狀態中心'
  }
});

export function flattenCopy(value) {
  if (typeof value === 'string') return [value];
  return Object.values(value).flatMap(flattenCopy);
}

export function getCopy(path) {
  return path.split('.').reduce((value, key) => value?.[key], copy);
}
