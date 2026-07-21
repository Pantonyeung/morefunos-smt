# 渠道、付款與核數流程 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立按渠道分流的付款、待核實、完成核對、部分取消及平台結算鏈路。

**Architecture:** 把渠道規則及狀態轉換放入純資料 domain，頁面只根據 domain 結果渲染。訂單頁與結帳頁共用同一組正式狀態名稱，所有更正以 append-only audit 保存。

**Tech Stack:** 原生 JavaScript ES modules、localStorage 示範資料鏈路、Node `node:test`、HTML/CSS。

## Global Constraints

- 不修改已鎖定點單產品選擇及購物車邏輯。
- 只有現場外賣及堂食可選付款方式；只有現金顯示數字鍵盤。
- 非現場渠道不顯示付款方式及鍵盤。
- 平台百分之二十五記為佣金預估，不記為客人折扣。
- 所有更正保存原值、新值、原因、終端及時間。
- 自動測試不等於 iPad／Sunmi T2S 實機 Lock。

---

### Task 1: 渠道與付款狀態 domain

**Files:**
- Modify: `pages/checkout/checkout-domain.js`
- Modify: `pages/orders/orders-domain.js`
- Test: `tests/checkout-actions.test.mjs`
- Test: `tests/orders-actions.test.mjs`

**Interfaces:**
- Produces: `getChannelPolicy(channel)`, `buildCheckoutRecord(input)`, `changeOrderPayment(order, change, terminalId, at)`, `reconcilePayment(order, input, terminalId, at)`。

- [ ] 寫失敗測試，覆蓋現場、電話／WhatsApp、磨飯 App、平台四種政策，以及稍後付款進入待核實。
- [ ] 執行 `node --test tests/checkout-actions.test.mjs tests/orders-actions.test.mjs`，確認因政策函數或狀態缺失而失敗。
- [ ] 最小實作渠道政策、正式狀態、平台佣金及 append-only audit。
- [ ] 再跑兩份測試並確認通過。
- [ ] 提交 `feat(checkout): model channel payment policies`。

### Task 2: 動態結帳與完成核對卡

**Files:**
- Modify: `pages/checkout/page.js`
- Modify: `pages/checkout/page.css`
- Modify: `pages/checkout/page-config.js`
- Test: `tests/checkout-layout.test.mjs`

**Interfaces:**
- Consumes: `getChannelPolicy`, `buildCheckoutRecord`。
- Produces: 按渠道顯示的輸入區、現金大鍵盤、完成核對及更正資料 UI。

- [ ] 寫失敗頁面測試，要求非現場不渲染付款／鍵盤、現金先顯示鍵盤、完成後保留核對卡及更正入口。
- [ ] 跑 `node --test tests/checkout-layout.test.mjs`，確認舊頁面結構未符合。
- [ ] 重構渲染及事件處理；完成後不自動跳頁，更正必須有原因。
- [ ] 再跑結帳 domain 及 layout 測試。
- [ ] 提交 `feat(checkout): add channel-aware settlement flow`。

### Task 3: 待核實與通知客戶鏈路

**Files:**
- Modify: `pages/orders/page.js`
- Modify: `pages/orders/page.css`
- Modify: `pages/orders/orders-domain.js`
- Test: `tests/orders-actions.test.mjs`

**Interfaces:**
- Consumes: `reconcilePayment`。
- Produces: `flagPaymentIssue(order, issue, terminalId, at)` 及共用核數卡。

- [ ] 寫失敗測試，要求待核實篩選可找出稍後付款、自有渠道，並驗證成功核數及問題通知 audit。
- [ ] 跑 orders 測試確認失敗。
- [ ] 加入核數卡、核實成功、資料有問題、通知客戶及保留待處理操作。
- [ ] 再跑 orders 測試並確認通過。
- [ ] 提交 `feat(orders): connect payment reconciliation workflow`。

### Task 4: 行內部分取消

**Files:**
- Modify: `pages/orders/page.js`
- Modify: `pages/orders/page.css`
- Test: `tests/orders-actions.test.mjs`

**Interfaces:**
- Consumes: `partiallyCancelItem`。
- Produces: 行內取消草稿、單次最終確認及新總額預覽。

- [ ] 寫失敗結構測試，禁止逐項 select，要求商品行減號及單次確認摘要。
- [ ] 跑測試確認舊彈窗流程失敗。
- [ ] 實作行內加減、預覽及最後一次確認。
- [ ] 再跑 orders 測試並確認通過。
- [ ] 提交 `feat(orders): simplify inline partial cancellation`。

### Task 5: 文件、版本及完整驗證

**Files:**
- Modify: `docs/ai-context/SMT_DECISION_LEDGER.md`
- Modify: `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md`
- Modify: `docs/ai-context/SMT_CODE_MAP.md`
- Modify: `SMT_AI_START_HERE.md`
- Modify: `SMT_CONTEXT_MIN.md`
- Modify: `VERSION.txt`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: 可供下一位 AI 分辨「程式已做」與「待實機驗收」的真相記錄。

- [ ] 更新決策、狀態、程式地圖及版本，明確標記真實 API／硬件未接入。
- [ ] 執行 `node scripts/validate-ai-context.mjs`。
- [ ] 執行 `node --test tests/*.test.mjs`。
- [ ] 檢查 `git diff --check` 及 `git status --short`。
- [ ] 提交 `docs: record channel payment reconciliation flow`。
