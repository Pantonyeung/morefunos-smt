import {
  ORDER_HISTORY_STORAGE_KEY,
  ORDER_STORAGE_KEY,
  DINE_STORAGE_KEY,
  TERMINAL_ID_STORAGE_KEY,
  PRINTER_STORAGE_KEY,
  readJSON,
  writeJSON,
} from "../../shared/store.js";
import { normalizeTerminalId } from "../../shared/operations.js";
import { money, showToast, escapeHtml } from "../../shared/components.js";
import {
  applyCheckoutDiscount,
  buildCheckoutRecord,
  enterKeypadValue,
  getChannelPolicy,
} from "./checkout-domain.js";
import { checkoutConfig } from "./page-config.js";
import { defaultPrinterState, createPrintJobs } from "../more/print-domain.js";
import { activeDineOrderIdentities, createOrderIdentity, orderDisplayNumber } from "../../shared/order-identity.js";

const app = document.getElementById("app"),
  order = readJSON(ORDER_STORAGE_KEY, { cart: [] });
const terminalId = normalizeTerminalId(
  localStorage.getItem(TERMINAL_ID_STORAGE_KEY) ||
    new URLSearchParams(location.search).get("terminal") ||
    "SMT",
);
localStorage.setItem(TERMINAL_ID_STORAGE_KEY, terminalId);

let channel = "現場",
  payment = "現金",
  receivedInput = "",
  discount = { type: "none" },
  discountPanel = false,
  keypadTarget = "received",
  channelData = {},
  completedRecord = null,
  correctionOpen = false,
  correctionReason = "";

function pricing() {
  try {
    return applyCheckoutDiscount(order.cart, discount, channel);
  } catch (error) {
    return {
      ...applyCheckoutDiscount(order.cart, { type: "none" }, channel),
      error: error.message,
    };
  }
}

function discountLabel(result) {
  if (discount.type === "student") return `學生優惠 · ${result.appliedUnits} 份`;
  if (discount.type === "group") return `整單折扣 · ${Number(discount.percent) || 0}%`;
  return "未使用";
}

const fieldLabels = {
  pickupCode: "取餐碼（可略過）",
  verificationCode: "核對碼（可略過）",
  platformOrderId: "平台單號（可略過）",
  note: "備註（可略過）",
};

const channelIcon = {
  現場: "channel-onsite.webp",
  "電話／WhatsApp": "channel-phone-whatsapp.webp",
  "磨飯 App": "channel-morefun-app.webp",
  Keeta: "channel-keeta.webp",
  Foodpanda: "channel-foodpanda.webp",
};
const paymentIcon = {
  現金: "payment-cash.webp",
  Alipay: "payment-alipay.webp",
  "WeChat Pay": "payment-wechat-pay.webp",
  FPS: "payment-fps.webp",
  PayMe: "payment-payme.webp",
  組合付款: "payment-combined.webp",
};
const labelled = (value, map) =>
  `<img class="option-icon" src="../../assets/checkout-icons/${map[value]}" alt="" aria-hidden="true"><span>${escapeHtml(value)}</span>`;

function lineDesc(line) {
  const parts = [];
  const drinks = Array.isArray(line?.drinkAssignments)
    ? line.drinkAssignments.map((d) => [d.name, d.sweetness, d.ice].filter(Boolean).join(" · ")).filter(Boolean)
    : [];
  if (line?.combo?.components?.length) {
    const comboNames = line.combo.components.map((item) => item.name).filter(Boolean).slice(0, 3);
    if (comboNames.length) parts.push(comboNames.join("、"));
  }
  if (drinks.length) parts.push(...drinks.slice(0, 2));
  if (line?.options) Object.values(line.options).flat().filter(Boolean).slice(0, 2).forEach((value) => parts.push(String(value)));
  return parts.join("｜") || "標準";
}

function fieldRows(policy) {
  return policy.fields.length
    ? `<section class="channel-fields"><h3>渠道資料</h3>${policy.fields
        .map(
          (field) =>
            `<label><span>${fieldLabels[field]}</span>${field === "note" ? `<textarea data-field="${field}" placeholder="可留空">${escapeHtml(channelData[field] || "")}</textarea>` : `<input data-field="${field}" value="${escapeHtml(channelData[field] || "")}" placeholder="可留空">`}</label>`,
        )
        .join("")}</section>`
    : "";
}

function keypad(disabled = false) {
  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "clear"];
  return `<section class="keypad-wrap"><div class="quick-amounts"><button data-action="amount" data-value="${Math.max(0, Number(pricing().payable) || 0)}" ${disabled ? "disabled" : ""}>剛剛好</button>${checkoutConfig.quickAmounts.map((value) => `<button data-action="amount" data-value="${value}" ${disabled ? "disabled" : ""}>${value}</button>`).join("")}<button data-action="keypad" data-key="backspace" ${disabled ? "disabled" : ""}>退格</button></div><section class="keypad" aria-label="數字鍵盤">${keys.map((key) => `<button class="${key === "clear" ? "clear-key" : ""}" data-action="keypad" data-key="${key}" ${disabled ? "disabled" : ""}>${key === "clear" ? "清除" : key}</button>`).join("")}</section></section>`;
}

function cashControls(result, cash) {
  return `<section class="cash-controls ${cash ? "is-cash" : "is-locked"}">${keypad(!cash)}</section>`;
}

function discountCard(result) {
  if (!discountPanel) return "";
  return `<div class="modal-scrim"><section class="discount-card panel"><header><div><small>同一時間只可使用一種</small><h2>優惠</h2></div><button data-action="discount-close">×</button></header><div class="discount-options"><button data-action="discount-type" data-value="none" class="${discount.type === "none" ? "active" : ""}"><strong>不使用優惠</strong><small>按原價結帳</small></button><button data-action="discount-type" data-value="student" class="${discount.type === "student" ? "active" : ""}"><strong>學生優惠</strong><small>已核實學生人數</small></button><button data-action="discount-type" data-value="group" class="${discount.type === "group" ? "active" : ""}"><strong>整單折扣</strong><small>${channel === "堂食" ? "堂食不可使用" : "輸入折扣百分比"}</small></button></div>${discount.type === "student" ? `<button class="discount-input" data-action="keypad-target" data-value="student"><span>學生優惠份數</span><b>${Number(discount.studentCount) || 0} 份</b></button>` : ""}${discount.type === "group" ? `<button class="discount-input" data-action="keypad-target" data-value="group" ${channel === "堂食" ? "disabled" : ""}><span>整單折扣</span><b>${Number(discount.percent) || 0}%</b></button>` : ""}<footer><span>折扣 ${money(result.discountAmount)}　應付 ${money(result.payable)}</span><button data-action="discount-close">套用優惠</button></footer></section></div>`;
}

function correctionCard() {
  const policy = getChannelPolicy(channel);
  return `<section class="correction-card panel"><header><h3>更正資料</h3><button data-action="correction-close">×</button></header><label>渠道</label><div class="row channels">${checkoutConfig.channels.map((value) => `<button data-action="correction-channel" data-value="${value}" class="${channel === value ? "active" : ""}">${escapeHtml(value)}</button>`).join("")}</div>${policy.requiresPaymentMethod ? `<label>付款方式</label><div class="row payments">${policy.paymentMethods.filter(Boolean).map((value) => `<button data-action="correction-payment" data-value="${value}" class="${payment === value ? "active" : ""}">${escapeHtml(value)}</button>`).join("")}</div>` : ""}<label>更正原因（必填）</label><textarea data-correction-reason placeholder="例如：揀錯付款方式">${escapeHtml(correctionReason)}</textarea><footer><button data-action="correction-save">保存更正</button></footer></section>`;
}

function completedCard() {
  if (!completedRecord) return "";
  const paid = Number(completedRecord.receivedAmount ?? completedRecord.paidAmount) || 0,
    change = Number(completedRecord.changeAmount ?? Math.max(0, paid - Number(completedRecord.amount || 0)));
  return `<div class="modal-scrim completion-layer"><section class="completion-card panel"><header><div><small>訂單 ${escapeHtml(orderDisplayNumber(completedRecord))}</small><h2>完成核對</h2></div><button data-action="correction-open">更正資料</button></header><div class="completion-status">✓ 結帳完成</div><div class="completion-grid"><span>渠道<b>${escapeHtml(completedRecord.source)}</b></span><span>付款方式<b>${escapeHtml(completedRecord.paymentMethod)}</b></span><span>原價<b>${money(completedRecord.subtotal)}</b></span><span>優惠<b>-${money(completedRecord.discountAmount)}</b></span><span>應付<b>${money(completedRecord.amount)}</b></span><span>實收<b>${money(paid)}</b></span><span>找續<b>${money(change)}</b></span><span>時間<b>${new Date(completedRecord.acceptedAt).toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit" })}</b></span></div><footer><button data-action="go-orders">完成並返回訂單</button></footer></section>${correctionOpen ? correctionCard() : ""}</div>`;
}

function saveCompleted(updated) {
  writeJSON(
    ORDER_HISTORY_STORAGE_KEY,
    readJSON(ORDER_HISTORY_STORAGE_KEY, []).map((row) => (row.id === updated.id ? updated : row)),
  );
  completedRecord = updated;
}

function completeCheckout() {
  if (completedRecord) return;
  if (!order.cart?.length) {
    showToast("購物籃沒有產品");
    return;
  }
  const result = pricing();
  if (result.error) {
    showToast(result.error);
    return;
  }
  if (result.payable <= 0) {
    showToast("訂單金額必須大於零");
    return;
  }
  const policy = getChannelPolicy(channel),
    received = Number(receivedInput) || 0;
  if (policy.requiresPaymentMethod && payment === "現金" && received < result.payable) {
    showToast("收款金額不足");
    return;
  }
  const history = readJSON(ORDER_HISTORY_STORAGE_KEY, []),
    now = Date.now(),
    identity = createOrderIdentity([...history, ...activeDineOrderIdentities(readJSON(DINE_STORAGE_KEY, null))], { terminalId, now }),
    record = buildCheckoutRecord({
      identity,
      cart: order.cart,
      channel,
      payment,
      pricing: result,
      discount,
      terminalId,
      now,
      channelData,
      receivedAmount: received,
      audit: [...(order.draftSession?.audit || []), ...(order.reuse?.audit || [])],
    });
  record.reusedFromOrderId = order.reuse?.orderId || null;
  const dineInOnly = channel === "現場" && order.cart.length > 0 && order.cart.every((line) => line.serviceMode === "堂食");
  record.status = dineInOnly ? "completed" : "running";
  if (dineInOnly) record.completedAt = now;
  const currentPrinterState = readJSON(PRINTER_STORAGE_KEY, null) || defaultPrinterState(now),
    before = currentPrinterState.jobs.length;
  const nextPrinterState = createPrintJobs(record, currentPrinterState, { now });
  const newJobs = nextPrinterState.jobs.slice(before);
  record.printJobs = newJobs;
  record.printStatus = newJobs.some((job) => job.status === "blocked") ? "待設定" : "已排隊";
  record.printBridgeStatus = "waiting_bridge";
  writeJSON(PRINTER_STORAGE_KEY, nextPrinterState);
  writeJSON(ORDER_HISTORY_STORAGE_KEY, [record, ...history]);
  writeJSON(ORDER_STORAGE_KEY, { cart: [], category: "全部", lastCheckout: { orderId: record.id, checkedOutByTerminalId: terminalId, checkedOutAt: now } });
  completedRecord = record;
  render();
}

function render() {
  const result = pricing(),
    received = Number(receivedInput) || 0,
    policy = getChannelPolicy(channel),
    cash = policy.requiresPaymentMethod && payment === "現金",
    zero = result.payable <= 0,
    itemCount = (order.cart || []).reduce((n, line) => n + Number(line.qty || 0), 0);

  app.innerHTML = `<div class="app"><header class="topbar statusbar"><div class="brand">磨飯 SMT</div><span class="status-item">操作終端 ${escapeHtml(terminalId)}</span><div class="spacer"></div><span class="status-item">● 線上</span></header><main class="checkout"><aside class="checkout-cart panel"><header><div><h2>結帳</h2><small class="checkout-subtitle">核對餐點，確認後結帳</small></div><span class="checkout-cart-count">${itemCount} 件</span></header><div class="cart-lines">${(order.cart || []).map((line, index) => `<article><span class="seq">${index + 1}</span><span class="checkout-thumb">${line.image ? `<img src="${escapeHtml(line.image)}" alt="">` : ""}</span><span><strong>${escapeHtml(line.name)}</strong><small>x${Number(line.qty || 0)}｜${escapeHtml(lineDesc(line))}</small></span><b>${money(line.total)}</b></article>`).join("")}</div><div class="detail-actions"><button data-action="back">返回訂單</button><button data-action="discount-open" data-discount-preset="student" class="${discount.type === "student" ? "active" : ""}" ${policy.group !== "onsite" ? "disabled" : ""}><span>學生優惠</span><small>${discount.type === "student" ? discountLabel(result) : "選擇份數"}</small></button><button data-action="discount-open" data-discount-preset="group" class="${discount.type === "group" ? "active" : ""}" ${policy.group !== "onsite" ? "disabled" : ""}><span>整單折扣</span><small>${discount.type === "group" ? discountLabel(result) : "輸入百分比"}</small></button></div></aside><section class="checkout-main panel"><div class="checkout-step"><i>1</i><span>選擇來源</span></div><div class="row channels">${checkoutConfig.channels.map((value) => `<button data-action="channel" data-value="${escapeHtml(value)}" class="${channel === value ? "active" : ""}">${labelled(value, channelIcon)}</button>`).join("")}</div><div class="checkout-step"><i>2</i><span>付款方式</span></div>${policy.requiresPaymentMethod ? `<div class="row payments">${policy.paymentMethods.map((value) => `<button data-action="payment" data-value="${escapeHtml(value)}" class="${payment === value ? "active" : ""}">${labelled(value, paymentIcon)}</button>`).join("")}</div>` : fieldRows(policy)}<div class="checkout-step"><i>3</i><span>金額結算</span></div><div class="summary"><span>原價 <b>${money(result.subtotal)}</b></span><span>優惠 <b>-${money(result.discountAmount)}</b></span><span class="payable">應付 <b>${money(result.payable)}</b></span>${cash ? `<button class="received-summary ${keypadTarget === "received" ? "active" : ""}" data-action="keypad-target" data-value="received"><span>已收</span><b>${money(received)}</b></button><span class="change">找續 <b>${money(Math.max(0, received - result.payable))}</b></span>` : `<span class="summary-note">狀態 <b>${escapeHtml(policy.initialPaymentStatus)}</b></span>`}</div><div class="checkout-step"><i>4</i><span>輸入金額</span></div>${policy.group === "onsite" ? cashControls(result, cash) : `<div class="checkout-context"><strong>${escapeHtml(channel)}</strong><span>${escapeHtml(policy.initialPaymentStatus)}</span><small>渠道資料會連同訂單保存；確認操作固定在畫面最底。</small></div>`}<footer class="checkout-action-zone">${zero ? '<p class="zero-warning">訂單金額必須大於零，請先加入有效產品或更正優惠。</p>' : ""}<div class="checkout-note">備註：不辣、少甜、少冰、互換補差…</div><button class="save-draft" disabled>儲存為草稿</button><button class="confirm" data-action="confirm" ${zero ? "disabled" : ""}>${policy.initialPaymentStatus === "付款待核實" ? "建立並待核實" : policy.initialPaymentStatus === "平台已付" ? "確認平台訂單" : "確認結帳"} ${money(result.payable)}</button></footer></section></main></div>${discountCard(result)}${completedCard()}<div id="toast" class="toast"></div>`;

  app.querySelectorAll("[data-action]").forEach((button) => (button.onclick = () => handle(button)));
  app.querySelectorAll("[data-field]").forEach((input) => (input.oninput = () => { channelData[input.dataset.field] = input.value; }));
  const reason = app.querySelector("[data-correction-reason]");
  if (reason) reason.oninput = () => { correctionReason = reason.value; };
}

function handle(button) {
  const action = button.dataset.action;
  if (action === "back") parent.postMessage({ type: "morefun:navigate", route: "order" }, "*");
  else if (action === "channel") {
    channel = button.dataset.value;
    const policy = getChannelPolicy(channel);
    payment = policy.paymentMethods[0] || "";
    channelData = {};
    receivedInput = "";
    if (policy.group !== "onsite") discount = { type: "none" };
  } else if (action === "payment") {
    payment = button.dataset.value;
    receivedInput = "";
  } else if (action === "amount") {
    receivedInput = String(Number(button.dataset.value) || 0);
    keypadTarget = "received";
  } else if (action === "discount-open") {
    const preset = button.dataset.discountPreset;
    if (preset === "student" && discount.type !== "student") {
      discount = { type: "student", studentCount: 0 };
      keypadTarget = "student";
    }
    if (preset === "group" && discount.type !== "group") {
      discount = { type: "group", percent: 0 };
      keypadTarget = "group";
    }
    discountPanel = true;
  } else if (action === "discount-close") discountPanel = false;
  else if (action === "discount-type") {
    const type = button.dataset.value;
    discount = type === "student" ? { type, studentCount: 0 } : type === "group" ? { type, percent: 0 } : { type: "none" };
    keypadTarget = type === "student" ? "student" : type === "group" ? "group" : "received";
  } else if (action === "keypad-target") keypadTarget = button.dataset.value;
  else if (action === "keypad") {
    const key = button.dataset.key;
    if (keypadTarget === "student") {
      discount = { ...discount, studentCount: Math.floor(Number(enterKeypadValue(String(discount.studentCount || ""), key)) || 0) };
    } else if (keypadTarget === "group") {
      discount = { ...discount, percent: Math.min(100, Number(enterKeypadValue(String(discount.percent || ""), key)) || 0) };
    } else receivedInput = enterKeypadValue(receivedInput, key);
  } else if (action === "confirm") {
    try { completeCheckout(); } catch (error) { showToast(error.message || "未能建立訂單"); }
    return;
  } else if (action === "go-orders") parent.postMessage({ type: "morefun:navigate", route: "orders" }, "*");
  else if (action === "correction-open") {
    channel = completedRecord.source;
    payment = completedRecord.paymentMethod;
    correctionOpen = true;
  } else if (action === "correction-close") {
    correctionOpen = false;
    correctionReason = "";
  } else if (action === "correction-channel") {
    channel = button.dataset.value;
    payment = getChannelPolicy(channel).paymentMethods.filter(Boolean)[0] || "";
  } else if (action === "correction-payment") payment = button.dataset.value;
  else if (action === "correction-save") {
    if (!correctionReason.trim()) {
      showToast("請輸入更正原因");
      return;
    }
    const policy = getChannelPolicy(channel),
      previous = { source: completedRecord.source, paymentMethod: completedRecord.paymentMethod, paymentStatus: completedRecord.paymentStatus },
      next = { source: channel, paymentMethod: policy.requiresPaymentMethod ? payment : policy.group === "platform" ? "平台已付" : "待核實", paymentStatus: policy.initialPaymentStatus };
    saveCompleted({
      ...completedRecord,
      source: channel,
      group: policy.group,
      paymentMethod: next.paymentMethod,
      paymentStatus: next.paymentStatus,
      reconciliationStatus: policy.initialPaymentStatus === "付款待核實" ? "pending" : policy.group === "platform" ? "platform_paid" : "not_required",
      audit: [...(completedRecord.audit || []), { type: "checkout_data_corrected", terminalId, at: Date.now(), previous, next, reason: correctionReason.trim() }],
    });
    correctionOpen = false;
    correctionReason = "";
    showToast("結帳資料已更正並保留紀錄");
  }
  render();
}

render();