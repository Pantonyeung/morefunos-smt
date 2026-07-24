# SMT Responsive Adaptive V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 以已驗證可運行的 1920×1080 SMT 基準為唯一乾淨來源，建立一套共用自適應系統，令同一套 SMT 在 1920×1080、1600×900、1440×900、1366×768、1280×800 等橫屏尺寸正常運行，而不再建立單一尺寸補丁。

**Architecture:** 保留 `smt-responsive-from-1920-baseline` 永久不動；所有改動只進入 `smt-responsive-adaptive-v1`。先建立中央 viewport/profile engine 與共用 CSS tokens，再逐步把 Shell、點單頁、結帳頁及其他頁面改為讀取中央 profile；禁止 loader 注入 CSS、禁止每頁另起 1280/1920 override、禁止以大量 `!important` 解決尺寸問題。

**Tech Stack:** 原生 HTML/CSS/JavaScript、ES Modules、iframe shell、Playwright、GitHub Actions。

## Global Constraints

- `smt-responsive-from-1920-baseline` 永久保持乾淨，禁止任何功能或測試提交。
- 所有開發只在 `smt-responsive-adaptive-v1`。
- 一套 UI、一套商業邏輯、一套元件，不建立 1920 版與 1280 版兩套程式。
- 主要驗收尺寸：1920×1080、1600×900、1440×900、1366×768、1280×800。
- 禁止新增單一尺寸專用補丁檔，例如 `t2s-1280.css` 類型方案。
- 禁止 loader 動態注入頁面修正 CSS。
- 禁止用大量 `!important`、z-index 疊層、固定高度補丁壓住版面問題。
- 功能與商業邏輯優先保持與 1920 基準一致。
- 每一個改動都必須經 1920 基準回歸測試及多尺寸驗收。

---

### Task 1: 建立中央自適應 Profile Engine

**Files:**
- Create: `shared/responsive.js`
- Modify: `app-loader.js`
- Modify: `shared/runtime.js`
- Test: `tests/responsive-profile.spec.js`

**Interfaces:**
- Produces: `getResponsiveProfile(width, height)`
- Produces: `applyResponsiveProfile(targetDocument, profile)`
- Produces CSS/document attributes: `data-responsive-profile`, `data-viewport-width`, `data-viewport-height`

- [ ] **Step 1:** 寫 profile 測試，覆蓋 1920×1080、1600×900、1440×900、1366×768、1280×800。
- [ ] **Step 2:** 執行測試，確認在功能尚未建立前失敗。
- [ ] **Step 3:** 建立 `shared/responsive.js`，只按可用 CSS viewport 判斷 profile，不按裝置品牌判斷。
- [ ] **Step 4:** 將 `app-loader.js` 由固定 1920 canvas scale 改為中央 profile 驅動；保留橫屏限制與現有 route/load/error 行為。
- [ ] **Step 5:** 加入 `resize`、`orientationchange`、`visualViewport.resize` 安全更新機制，避免重複 listener。
- [ ] **Step 6:** 執行 profile 測試及 1920 啟動測試。
- [ ] **Step 7:** Commit：`feat(responsive): add central viewport profile engine`。

### Task 2: 建立共用 Responsive Tokens

**Files:**
- Create: `shared/responsive.css`
- Modify: `app-shell.css`
- Modify: `shared/page-base.css`
- Test: `tests/responsive-shell.spec.js`

**Interfaces:**
- Consumes: `data-responsive-profile`
- Produces central tokens such as `--ui-scale`, `--space-unit`, `--topbar-height`, `--cart-ratio`, `--modal-max-width`, `--product-columns`

- [ ] **Step 1:** 寫 Shell 多尺寸測試，要求五個驗收尺寸均無水平溢出、iframe 可見、橫屏正常。
- [ ] **Step 2:** 建立 `shared/responsive.css`，以 profile + CSS variables 管理尺寸。
- [ ] **Step 3:** 移除 Shell 內 1920 專用尺寸作為唯一來源的做法，改成讀中央 tokens。
- [ ] **Step 4:** 保留 1920×1080 視覺比例作 Large profile 基準。
- [ ] **Step 5:** 執行 Shell 測試。
- [ ] **Step 6:** Commit：`feat(responsive): centralize shared layout tokens`。

### Task 3: 點單頁接入自適應系統

**Files:**
- Modify: `pages/order/index.html`
- Modify: `pages/order/page.css`
- Modify: `pages/order/page.js`
- Modify: `pages/order/page-config.js`
- Test: `tests/responsive-order.spec.js`

**Interfaces:**
- Consumes: central responsive profile and tokens
- Must preserve: product selection, cart, combo, required completion, quick drinks, pending orders, modal interactions

- [ ] **Step 1:** 先寫五尺寸點單頁測試：購物車與產品區同時可見、產品卡無重疊、底部操作可點、modal 不出 viewport。
- [ ] **Step 2:** 將 cart/catalog 比例改為中央 `--cart-ratio`，移除頁面內尺寸重複定義。
- [ ] **Step 3:** 產品 grid 改由 `--product-columns` 管理；Large/Standard/Compact 只改排版密度，不改產品邏輯。
- [ ] **Step 4:** 將 modal 寬高改為 viewport/token 驅動，禁止新增 inline patch。
- [ ] **Step 5:** 快捷飲品、修改卡、必選補齊卡全部改用相同 modal/card sizing 規則。
- [ ] **Step 6:** 跑原有功能壓測：200 次產品操作、150 次購物車加減、320 次彈窗開關。
- [ ] **Step 7:** Commit：`feat(order): adapt order page to shared responsive profiles`。

### Task 4: 結帳頁接入自適應系統

**Files:**
- Modify: `pages/checkout/index.html`
- Modify: `pages/checkout/page.css`
- Test: `tests/responsive-checkout.spec.js`

**Interfaces:**
- Consumes: central responsive tokens
- Must preserve: cart summary, payment channels, cash input, keypad, confirm action

- [ ] **Step 1:** 寫五尺寸結帳頁測試，確認 keypad、付款按鈕、確認鍵均可見可點。
- [ ] **Step 2:** 將左右欄、付款按鈕、summary、keypad 改成中央 profile 驅動。
- [ ] **Step 3:** 確認 1280×800 不需要 loader 注入 CSS 或額外 restore stylesheet。
- [ ] **Step 4:** 執行結帳回歸測試及多尺寸測試。
- [ ] **Step 5:** Commit：`feat(checkout): adapt checkout to shared responsive profiles`。

### Task 5: 其他 SMT 頁面接入同一套尺寸規則

**Files:**
- Modify: `pages/orders/index.html`
- Modify: `pages/orders/page.css`
- Modify: `pages/dine/index.html`
- Modify: `pages/dine/page.css`
- Modify: `pages/soldout/index.html`
- Modify: `pages/soldout/page.css`
- Modify: `pages/more/index.html`
- Modify: `pages/more/page.css`
- Test: `tests/responsive-secondary-pages.spec.js`

**Interfaces:**
- Consumes: central responsive profile/tokens
- Must preserve route names and current business behavior

- [ ] **Step 1:** 寫 orders/dine/soldout/more 五尺寸 smoke tests。
- [ ] **Step 2:** 每頁只移除會阻礙自適應的固定畫布規則，不做無關 UI redesign。
- [ ] **Step 3:** 將 modal、panel、table/grid 接入共用 tokens。
- [ ] **Step 4:** 執行所有 secondary-page tests。
- [ ] **Step 5:** Commit：`feat(responsive): adapt remaining SMT pages`。

### Task 6: 清除舊尺寸補丁來源

**Files:**
- Review/Delete if present on adaptive branch only: `pages/order/t2s-1280.css`
- Review/Delete if present on adaptive branch only: `pages/checkout/t2s-restore.css`
- Modify: any HTML that loads retired override files
- Test: `tests/no-size-patches.spec.js`

**Interfaces:**
- Produces invariant: no standalone 1280/1920 page override stylesheet is loaded

- [ ] **Step 1:** 寫測試掃描 HTML/CSS，禁止載入 `t2s-1280.css`、`t2s-restore.css`、loader injected style IDs。
- [ ] **Step 2:** 刪除只為單一尺寸存在的 override 檔及引用。
- [ ] **Step 3:** 搜尋新增 `!important`，只容許有明確必要且通過 review 的少量個案。
- [ ] **Step 4:** 執行完整測試。
- [ ] **Step 5:** Commit：`refactor(responsive): remove legacy size-specific overrides`。

### Task 7: 多尺寸強力壓力測試與回歸

**Files:**
- Modify/Create: `tests/stress-1920-baseline.spec.js`
- Create: `tests/stress-responsive-matrix.spec.js`
- Create/Modify: `.github/workflows/qa-responsive.yml`

**Interfaces:**
- Consumes the complete adaptive build
- Produces pass/fail evidence and artifacts

- [ ] **Step 1:** 保留已通過的 1920 壓測內容作回歸基準。
- [ ] **Step 2:** 新增 viewport matrix：1920×1080、1600×900、1440×900、1366×768、1280×800。
- [ ] **Step 3:** 每尺寸執行快速產品操作、購物車加減、modal open/close、route hammer、reload/resize。
- [ ] **Step 4:** 分開記錄已知產品圖片 404，不把圖片缺失誤判為 runtime crash；真正 `pageerror`、module load error、blank screen 必須 fail。
- [ ] **Step 5:** GitHub Actions 完整跑通後保存 report artifact。
- [ ] **Step 6:** Commit：`test(responsive): add multi-size stress regression suite`。

### Task 8: 最終驗收與保護規則

**Files:**
- Create: `docs/SMT_RESPONSIVE_LOCK.md`
- Modify: CI workflow to include guard checks

**Interfaces:**
- Produces future-development lock: all future UI changes must pass responsive matrix

- [ ] **Step 1:** 文件鎖定「所有共用 UI 修改必須一次驗收全部尺寸」。
- [ ] **Step 2:** CI 加 guard：偵測新 `t2s-*` override、loader CSS injection、固定 canvas-only 回歸。
- [ ] **Step 3:** 比對 `smt-responsive-from-1920-baseline`，確認乾淨基準 SHA 沒有任何變化。
- [ ] **Step 4:** 跑最終全套 tests + stress matrix。
- [ ] **Step 5:** 建立驗收 commit：`chore(responsive): lock adaptive SMT v1 acceptance baseline`。

## Final Acceptance Criteria

1. `smt-responsive-from-1920-baseline` SHA 與內容保持不變。
2. `smt-responsive-adaptive-v1` 在五個主要尺寸均正常載入及操作。
3. 點單、購物車、套餐／飲品、待處理、結帳、堂食、售罄、更多頁無白屏或 runtime crash。
4. 無 loader 注入尺寸修正 CSS。
5. 無新增單一 1280 或 1920 專用補丁架構。
6. 將來修改共用 layout/component 時，由同一套 tokens/profile 自動影響所有尺寸，並由 CI matrix 強制驗收。
7. 已知產品圖片 404 必須獨立列為資源修復項目，不可掩蓋真正 runtime error。
