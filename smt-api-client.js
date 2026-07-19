window.MoreFunSMTApi = {
  async reprice(order) {
    await new Promise(resolve => setTimeout(resolve, 120));
    return { ok: true, total: order.items.reduce((sum, item) => sum + item.price * item.qty, 0) };
  },
  async createDraft(order) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ok: true, draftId: `SMT${String(Date.now()).slice(-2)}` };
  },
  async submitOrder(order) {
    await new Promise(resolve => setTimeout(resolve, 180));
    return { ok: true, orderNo: `P${String(Math.floor(Math.random()*999)+1).padStart(3,"0")}` };
  }
};
