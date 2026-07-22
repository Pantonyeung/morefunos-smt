# SMT 歷史報表與統一訂單識別 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改動已鎖定點單操作的前提下，加入可查六個月的 SMT 報表、付款對數及全系統三位每日流水。

**Architecture:** 新增無 DOM 的共用訂單識別模組，讓結帳、堂食及五個主頁共用同一顯示號碼與永久識別規則。擴充 `more-domain.js` 接受明確日期範圍並輸出營業、渠道、付款、商品、時段及異常資料；`more/page.js` 只負責日期狀態、五分頁、下鑽及畫面。

**Tech Stack:** 原生 JavaScript ES modules、localStorage、Node.js 內置 test runner、HTML／CSS。

## Global Constraints

- 以 `order-v1-30`／`ba44d43` 為唯一程式基準。
- 每日顯示流水固定 `P001` 至 `P999`，營業日分界為 05:00。
- 永久訂單編號與每日顯示流水分開；舊訂單必須可讀。
- 報表由訂單明細重算，不建立第二套權威總數。
- SMT 只加入查看、對數及下鑽；商品、付款戶口、權限及成本設定留給 Admin。
- 所有介面繁體中文，沿用現有固定頂底欄及共用膠囊規則。

---

### Task 1: 共用訂單識別

**Files:**
- Create: `shared/order-identity.js`
- Modify: `shared/store.js`
- Test: `tests/order-identity.test.mjs`

**Interfaces:**
- Produces: `createOrderIdentity(history,{terminalId,tableId,now,startHour})`
- Produces: `orderDisplayNumber(order)`
- Produces: `latestOrderDisplayNumber(history)`
- Produces: `orderBusinessDate(order,startHour)`

- [ ] **Step 1: Write failing tests** for 05:00 boundary, cross-channel sequence, `P001`/`P999`, overflow, permanent ID and legacy fallback.
- [ ] **Step 2: Run** `node --test tests/order-identity.test.mjs` and confirm failures are missing exports.
- [ ] **Step 3: Implement** pure identity functions without reading localStorage inside the domain.
- [ ] **Step 4: Run** `node --test tests/order-identity.test.mjs` and confirm all pass.
- [ ] **Step 5: Commit** `test/order-identity` and `shared/order-identity.js` together.

### Task 2: 新訂單寫入及全頁最近訂單

**Files:**
- Modify: `pages/checkout/page.js`
- Modify: `pages/checkout/checkout-domain.js`
- Modify: `pages/dine/dine-domain.js`
- Modify: `pages/order/page.js`
- Modify: `pages/orders/page.js`
- Modify: `pages/dine/page.js`
- Modify: `pages/soldout/page.js`
- Modify: `pages/more/page.js`
- Modify: `tests/checkout-actions.test.mjs`
- Modify: `tests/dine-page.test.mjs`
- Modify: `tests/shell-ui.test.mjs`

**Interfaces:**
- Consumes: Task 1 identity functions.
- Produces: new orders with permanent `id`, `displayOrderNo`, `dailySequence`, `businessDate`, `createdTerminalId`, `dineTableId` where applicable.

- [ ] **Step 1: Write failing tests** proving checkout and dine-in create the shared identity and every topbar reads the same latest display number.
- [ ] **Step 2: Run focused tests** and confirm the hard-coded `10248`, four-digit/channel prefixes and `.at(-1)` behavior fail.
- [ ] **Step 3: Replace checkout ID generation** with `createOrderIdentity`; keep legacy records readable.
- [ ] **Step 4: Apply identity to dine completion** using the supplied history and table context.
- [ ] **Step 5: Replace all topbar literals/direct array access** with `latestOrderDisplayNumber`.
- [ ] **Step 6: Run focused tests** and confirm all pass.

### Task 3: 日期範圍及完整營運報表

**Files:**
- Modify: `pages/more/more-domain.js`
- Modify: `tests/more-operations-domain.test.mjs`

**Interfaces:**
- Produces: `buildReportRange(preset,{now,startHour,startDate,endDate})`
- Extends: `buildOperationalReport(orders,{range,now,startHour})`
- Report returns `summary`, `channels`, `payments`, `products`, `categories`, `hours`, `anomalies`, `orders` and `orderIndex`.

- [ ] **Step 1: Write failing tests** for today, yesterday, 7/30 days, 3/6 months and custom ranges.
- [ ] **Step 2: Write failing tests** for gross/net/discount/refund/outstanding/average, payment expected/received/difference, category and anomaly grouping.
- [ ] **Step 3: Run focused tests** and confirm failures describe missing range/report fields.
- [ ] **Step 4: Implement range normalization** with local 05:00 boundaries and maximum six-month validation.
- [ ] **Step 5: Extend report aggregation** while preserving existing fields used by day close and CSV.
- [ ] **Step 6: Run focused tests** and confirm all pass.

### Task 4: SMT 五分頁報表及訂單下鑽

**Files:**
- Modify: `pages/more/page.js`
- Modify: `pages/more/page.css`
- Modify: `pages/more/index.html`
- Modify: `tests/more-page.test.mjs`

**Interfaces:**
- Consumes: Task 3 range/report output.
- Produces: date controls, tabs `營業／渠道／付款／商品／異常`, custom dates, rows with `data-report-group` and corresponding order drilldown.

- [ ] **Step 1: Write failing interface tests** for seven date choices, five tabs, payment reconciliation columns, product/category toggle and drilldown actions.
- [ ] **Step 2: Run** `node --test tests/more-page.test.mjs` and confirm expected failures.
- [ ] **Step 3: Add report state and date controls** without changing the six main More cards.
- [ ] **Step 4: Render five report tabs** from one selected report object.
- [ ] **Step 5: Add inline drilldown** showing display number, time, channel, payment, amount and status.
- [ ] **Step 6: Make CSV export use the selected range** and include range in filename/audit.
- [ ] **Step 7: Add responsive CSS** inside the existing fixed dialog scroll region.
- [ ] **Step 8: Run focused tests** and confirm all pass.

### Task 5: 版本、快取及專案真相文件

**Files:**
- Modify: `VERSION.txt`
- Modify: `CHANGELOG.md`
- Modify: `service-worker.js`
- Modify: HTML resource query strings
- Modify: `SMT_AI_START_HERE.md`
- Modify: `SMT_CONTEXT_MIN.md`
- Modify: `docs/ai-context/SMT_CODE_MAP.md`
- Modify: `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md`
- Modify: `docs/ai-context/SMT_DECISION_LEDGER.md`
- Modify: `docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`

- [ ] **Step 1: Set version** to `order-v1-31` and update every cache marker.
- [ ] **Step 2: Record** implemented behavior, compatibility and device-verification boundary.
- [ ] **Step 3: Run** `node scripts/validate-ai-context.mjs` and fix any consistency error.

### Task 6: 完整驗證及發佈

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run syntax checks** for every JavaScript file.
- [ ] **Step 2: Run** `node scripts/validate-ai-context.mjs`.
- [ ] **Step 3: Run** `node --test tests/*.test.mjs`.
- [ ] **Step 4: Run first-render smoke checks** for order and more pages and confirm no uncaught error.
- [ ] **Step 5: Inspect** `git diff --check`, version markers and final diff.
- [ ] **Step 6: Commit** as one reviewed release commit after all evidence is fresh.
- [ ] **Step 7: Fetch remote, verify fast-forward ancestry, then push** `feat/smt-analytics-v131` without force.

