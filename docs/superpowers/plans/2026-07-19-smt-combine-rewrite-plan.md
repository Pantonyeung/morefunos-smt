# More Fun SMT Combine Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 V16 前已確認點單閉環與 V16 後有效技術修正合併成無 Patch、可手機上載的完整 SMT 母版。

**Architecture:** Root、Shared、Order Page 各自最多 5 個文件。Root 管理固定畫布與 Router；Shared 管理 runtime/store/components/bridge；Order Page 單一擁有點單商業邏輯。所有資料先寫入版本化 LocalStorage，UI 重繪只讀取狀態，不以 DOM 作權威。

**Tech Stack:** HTML5、CSS3、原生 ES Modules、LocalStorage、Service Worker、Node.js 靜態測試。

## Global Constraints

- 只修改 `feat/smt-master-v1`，禁止修改或合併 `main`。
- 每次輸出完整文件，不建立 Hotfix／Patch 正式引用。
- Root、Shared、每個 Page 各最多 5 個文件。
- 禁止 MutationObserver、文字 Action 判斷、productOverrides、一般 resize fit listener。
- iPhone 只支援橫屏；固定 1920×1080 等比畫布。
- Cart／Draft 在錯誤、重繪、顯示設定切換後必須保留。

---

### Task 1: 建立重寫測試 Harness

**Files:**
- Create: `tests/static-check.mjs`
- Create: `tests/order-behavior.mjs`
- Create: `package.json`

**Interfaces:**
- Produces: `npm test`，同時執行靜態與行為檢查。

- [ ] **Step 1:** 寫入失敗測試，檢查正式文件、禁用字串、Cart merge、Required、Draft。
- [ ] **Step 2:** 執行 `npm test`，確認現況至少一項失敗。
- [ ] **Step 3:** Commit `test: add SMT rewrite gates`。

### Task 2: 完整重寫 Shared Runtime 與 Store

**Files:**
- Modify: `shared/runtime.js`
- Modify: `shared/store.js`
- Modify: `shared/components.js`
- Modify: `shared/page-base.css`
- Modify: `shared/page-bridge.js`

**Interfaces:**
- Produces: `safeClone(value)`, `queueRender(task)`, `createErrorBoundary()`, `readStore(key, schema)`, `writeStore(key, value)`, `migrateStore()`, `createAnchoredCard()`, `renderDrinkCard()`。

- [ ] **Step 1:** 擴充測試，令 safeClone fallback、損壞 JSON fallback、schema migration 先失敗。
- [ ] **Step 2:** 重寫五個完整 Shared 文件。
- [ ] **Step 3:** 執行 `npm test`，預期 Shared 測試通過。
- [ ] **Step 4:** Commit `feat: rebuild shared SMT runtime`。

### Task 3: 重寫 Order 純資料與設定層

**Files:**
- Modify: `pages/order/page-data.js`
- Modify: `pages/order/page-config.js`

**Interfaces:**
- Produces: `createInitialOrderState()`, `createCartItem()`, `cartItemSignature()`, `addCartItem()`, `updateCartItem()`, `removeCartItem()`, `requiredTasks()`, `canCheckout()`, `draftVisibility()`。

- [ ] **Step 1:** 為 Cart sequence、三種 merge mode、Required blocking、暫存／取單互斥寫失敗測試。
- [ ] **Step 2:** 完整重寫 `page-data.js` 與 `page-config.js`。
- [ ] **Step 3:** 執行 `npm test`，預期資料層測試全部通過。
- [ ] **Step 4:** Commit `feat: rebuild order state model`。

### Task 4: 重寫 Order Page UI 與 Action Routing

**Files:**
- Modify: `pages/order/index.html`
- Modify: `pages/order/page.js`
- Modify: `pages/order/page.css`

**Interfaces:**
- Consumes: Shared Runtime/Store/Components；Order data/config API。
- Produces: 完整點單閉環、明確 `data-action`、Anchored Card、Drink Card、Cart、Required、Draft UI。

- [ ] **Step 1:** 新增 DOM fixture 靜態檢查：所有操作入口必須有 `data-action`。
- [ ] **Step 2:** 完整重寫三個文件，不沿用 page-vXX 引用。
- [ ] **Step 3:** 執行 `npm test`，預期 Action 與引用檢查通過。
- [ ] **Step 4:** Commit `feat: rebuild complete order page`。

### Task 5: 完整重寫 Root Shell 與 Cache

**Files:**
- Modify: `index.html`
- Modify: `app-loader.js`
- Modify: `app-shell.css`
- Modify: `manifest.webmanifest`
- Modify: `service-worker.js`

**Interfaces:**
- Produces: `navigate(route)`, `fitStage(reason)`, Page error UI、橫屏 Gate、版本化 cache。

- [ ] **Step 1:** 新增測試，禁止 `resize` 驅動 fit，要求 `pageshow` 及 orientation change。
- [ ] **Step 2:** 完整重寫 Root 五文件。
- [ ] **Step 3:** 執行 `npm test`，預期 Root Gate 全通過。
- [ ] **Step 4:** Commit `feat: finalize SMT root shell`。

### Task 6: 建立交付包與驗證報告

**Files:**
- Create: `delivery/V1.1/README_UPLOAD.md`
- Create: `delivery/V1.1/MANIFEST.md`
- Create: `delivery/V1.1/CHANGELOG.md`
- Create: `delivery/V1.1/SHA256SUMS.txt`
- Create: `delivery/V1.1/ROLLBACK.md`

**Interfaces:**
- Produces: `01_ROOT_UPLOAD.zip`、`02_SHARED_UPLOAD.zip`、`03_ORDER_PAGE_UPLOAD.zip`、`04_FULL_BACKUP.zip`。

- [ ] **Step 1:** 執行 `npm test` 及 ZIP 完整性檢查。
- [ ] **Step 2:** 建立手機平面 ZIP 與完整備份 ZIP。
- [ ] **Step 3:** 計算 SHA-256，核對 ZIP 內文件數。
- [ ] **Step 4:** Commit `chore: package SMT master V1.1 delivery`。

### Task 7: 最終分支驗證

- [ ] **Step 1:** 比較 `main...feat/smt-master-v1`，確認 `main` 未改。
- [ ] **Step 2:** 再跑 `npm test`、JS syntax、路徑、SHA、ZIP 測試。
- [ ] **Step 3:** 記錄未執行的 iPhone／T2S／Android 9 實機 Gate，不作虛假通過聲明。
