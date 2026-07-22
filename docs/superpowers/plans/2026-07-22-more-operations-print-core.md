# 磨飯 SMT 更多頁六入口接通實作計劃

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將更多頁六個入口接成可離線運作、可保存、可查核及可供安卓橋接的本機營運功能。

**Architecture:** 純資料邏輯分拆到 `more-domain.js` 及 `print-domain.js`，畫面層只處理儲存、檔案及互動。所有外部能力用明確工作狀態及橋接合約表示。

**Tech Stack:** 原生 ES Modules、localStorage、Blob／File API、Node.js 內置測試。

## Global Constraints

- 基準 `order-v1-26／8db4294a`；只向前更新 `feat/smt-order-page-v1`。
- 實體打印留待安卓橋接及店內設備測試，今輪不可假裝成功。
- 日結、恢復、更新、退出全螢幕須二次確認且不設密碼。
- 自動測試不等於 iPad／T2S 實機通過。

---

### Task 1: 本機營運資料合約

**Files:**
- Create: `pages/more/more-domain.js`
- Modify: `shared/store.js`
- Test: `tests/more-operations-domain.test.mjs`

**Interfaces:**
- Produces: `businessWindow`, `ordersForWindow`, `buildOperationalReport`, `createDayClose`, `createBackupEnvelope`, `validateBackupEnvelope`, `restoreBackupValues`, `buildCsvExport`。

- [x] 先寫營業日、報表、日結、CSV、快照及恢復失敗測試。
- [x] 執行 `node --test tests/more-operations-domain.test.mjs`，確認因函式未存在而失敗。
- [x] 實作最小純資料函式及新儲存鍵。
- [x] 重跑測試至全部通過。

### Task 2: 打印設定、格式及工作合約

**Files:**
- Create: `pages/more/print-domain.js`
- Test: `tests/print-core.test.mjs`

**Interfaces:**
- Produces: `defaultPrinterState`, `validatePrinter`, `aggregateProductionSummary`, `renderPrintDocument`, `createPrintJobs`, `retryPrintJob`, `reroutePrintJob`, `buildAndroidPrintPayload`。

- [x] 先寫五部設備、網絡設定驗證、四款格式、統計、路由、重試及橋接封包失敗測試。
- [x] 執行 `node --test tests/print-core.test.mjs`，確認正確失敗。
- [x] 實作打印純資料核心及四款示範格式。
- [x] 重跑測試至全部通過。

### Task 3: 更多頁六入口互動

**Files:**
- Modify: `pages/more/page.js`
- Modify: `pages/more/page.css`
- Modify: `pages/more/index.html`
- Modify: `tests/more-page.test.mjs`

**Interfaces:**
- Consumes: Task 1 及 Task 2 所有公開函式。
- Produces: 日結表單、報表匯出、打印機編輯／格式預覽／工作中心、備份匯入恢復、顯示設定及系統診斷。

- [x] 將六入口驗收改成真實操作測試，確認舊頁失敗。
- [x] 接入三個本機狀態、檔案下載／匯入、表單保存及二次確認。
- [x] 為打印機、格式、工作、日結及恢復加入明確狀態與錯誤回饋。
- [x] 執行 `node --test tests/more-page.test.mjs` 至通過。

### Task 4: 全局設定及現有打印工作接入

**Files:**
- Modify: `shared/page-bridge.js`
- Modify: `shared/page-base.css`
- Modify: `pages/order/page.js`
- Modify: `pages/orders/orders-domain.js`
- Modify: `pages/dine/dine-domain.js`
- Test: `tests/more-integrations.test.mjs`

**Interfaces:**
- Consumes: 共用設定及 `print-domain.js` 儲存合約。
- Produces: 各子頁主題／圖片／快速模式一致設定；現有重印及堂食打印工作可被打印中心讀取。

- [x] 先寫設定跨頁及打印工作匯集失敗測試。
- [x] 套用全局主題及點單設定映射。
- [x] 正規化現有打印工作欄位，使打印中心可讀取及重試。
- [x] 執行整合測試至通過。

### Task 5: 版本、脈絡及發佈驗證

**Files:**
- Modify: `VERSION.txt`, `CHANGELOG.md`, `VERIFICATION_REPORT.md`, `README.md`, `SMT_AI_START_HERE.md`, `SMT_CONTEXT_MIN.md`
- Modify: `docs/ai-context/SMT_CODE_MAP.md`, `docs/ai-context/SMT_DECISION_LEDGER.md`, `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md`, `docs/ai-context/SMT_CHANGE_IMPACT.md`, `docs/ai-context/SMT_KNOWLEDGE_GRAPH.json`, `docs/ai-context/manifest.json`
- Modify: version queries in HTML／loader files

- [x] 更新為 `order-v1-27`，將程式完成、外部接口及實機驗收分開記錄。
- [x] 執行 `node scripts/validate-ai-context.mjs`。
- [x] 執行 `node --test tests/*.test.mjs`。
- [x] 執行所有改動 JS 的 `node --check`、`git diff --check` 及版本一致性搜尋。
- [ ] 建立經驗證提交，以非強制方式更新指定 GitHub 分支並核對遠端樹。
