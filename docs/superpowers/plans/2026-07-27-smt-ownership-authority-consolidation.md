# SMT Ownership Authority Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 SMT 由「多文件可同時覆蓋同一責任」收口成「同一責任只有一個 Authority」，保持已驗收 1920×1080 視覺與營運流程不被大規模重構破壞。

**Architecture:** 採用 Shell → Page Composition → Component → Domain/State 四層責任模型；Adaptive 只提供 Token。CSS 過渡期使用 Cascade Layers 固定優先權，令舊 Page 規則失去 Component 最終決定權，再逐段移除舊定義，避免一次過搬動大型 CSS 造成回歸。

**Tech Stack:** 原生 HTML/CSS/JavaScript、ES Modules、CSS Cascade Layers、現有 SMT Domain/Store、Ownership Audit。

## Global Constraints

- 1920×1080 為唯一視覺封板模板；其他尺寸不得反向改動已封板 1920。
- 禁止 patch/override/hotfix 類永久補丁檔。
- 禁止大量 `!important`、極端 z-index、整頁 scale、hardcoded position 撞尺寸。
- 一個元件可以有多層協作，但同一責任只有一個 Authority。
- Page 只負責 Composition；Component 負責自身 Visual；Domain 負責 State/Business Logic；Adaptive 只提供 Token；Shell 只管理 Global Chrome。
- 已驗收區域除非證明係根因，不得順手重構。

---

### Task 1: 鎖定 Order CSS Authority

**Files:**
- Create: `pages/order/order-styles.css`
- Modify: `pages/order/index.html`
- Modify: `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`
- Modify: `scripts/audit-component-ownership.mjs`

**Interfaces:**
- Consumes: `page.css`、`cart.css`、`shared/adaptive-layout.css`
- Produces: 明確 Cascade Layer 順序；`cart.css` 對 Cart Visual 擁有最終 Authority。

- [ ] 建立 CSS Composition Entry，宣告 `page` 與 `component` layer。
- [ ] 將 `page.css` 置於 page layer、`cart.css` 置於 component layer。
- [ ] `index.html` 只載入單一 Order CSS Entry，不再平行載入兩個可互相覆蓋嘅檔案。
- [ ] Audit 鎖定 Order CSS Entry 與 Component Authority。
- [ ] 更新 Cache Key。

### Task 2: Cart Component Authority 收口

**Files:**
- Modify: `pages/order/cart.css`
- Modify: `shared/adaptive-layout.css`
- Test: `scripts/audit-component-ownership.mjs`

**Interfaces:**
- Consumes: `--adaptive-cart-*` token
- Produces: Cart Header、Row、Marker、Image、Copy、Price、Actions、Pending、Pricing Strip、Footer 唯一 Component Visual。

- [ ] 確認 Adaptive 不含 Cart direct selectors。
- [ ] 將 Cart 所有最終幾何值改用 token/fallback。
- [ ] 鎖定外／堂＋序號 Marker 只由 `cart.css` 決定。
- [ ] 保持 1920 已確認結構，不重新設計。

### Task 3: Drink Card Authority 收口

**Files:**
- Modify: `pages/order/page.css`
- Verify: `pages/order/cart.css`
- Test: `scripts/audit-component-ownership.mjs`

**Interfaces:**
- Produces: 快捷飲品／必選補齊共用同一 Drink Card Visual。

- [ ] `cart.css` 禁止 `.drink-choice-*` 內部 selector。
- [ ] Drink Card 名稱、圖片區、選中數量全部只由一個 Visual Owner 管理。
- [ ] 快捷飲品係標準卡；必選補齊只透過 context sizing 縮細，不複製另一套內部樣式。

### Task 4: Global Shell Authority 收口

**Files:**
- Modify: `shared/page-bridge.js`
- Modify: `shared/status-actions.js`
- Modify: `shared/shell.js`
- Modify: `app-loader.js`
- Modify: `shared/page-base.css`
- Test: `scripts/audit-component-ownership.mjs`

**Interfaces:**
- Produces: Global Status Actions 以 explicit descriptor 註冊；Overlay 以 explicit state message；Global Chrome Visual 只屬 `app-shell.css`。

- [ ] 禁止 MutationObserver/DOM 掃描作第二真相。
- [ ] Page render 時註冊 Action Descriptor。
- [ ] Shell 按固定 Action ID 回傳。
- [ ] Page Base 不包含 Global Chrome visual rules。

### Task 5: Domain Truth Audit

**Files:**
- Verify: `pages/order/order-domain.js`
- Verify: `pages/checkout/*`
- Verify: `pages/more/print-domain.js`
- Modify: `scripts/audit-component-ownership.mjs`

**Interfaces:**
- Produces: Pricing、Packaging、Service Mode、Link Up、Required 等商業規則只得一個 Domain 真相。

- [ ] UI 不重新計包裝費。
- [ ] Checkout/Print 只消費 Domain 結果。
- [ ] 新增重複常數或重新計價邏輯時 Audit Fail。

### Task 6: Responsive/Adaptive 逐頁收口

**Files:**
- Modify: `shared/adaptive-layout.css`
- Modify: `shared/responsive-pages.css`
- Modify: 各 Page 自身 CSS

**Interfaces:**
- Produces: Shared Responsive 只供 Token/Profile；Page Component 自己消費 Token。

- [ ] 逐頁搬 Orders direct selector。
- [ ] 逐頁搬 Dine direct selector。
- [ ] 逐頁搬 Soldout direct selector。
- [ ] 逐頁搬 More direct selector。
- [ ] 每頁完成後先鎖 Audit，再處理下一頁。

### Task 7: Verification Gate

**Files:**
- Test: `scripts/audit-component-ownership.mjs`
- Test: 現有 `tests/*.test.mjs`

**Interfaces:**
- Produces: 新 Architecture 只有一個責任 Authority，並保持既有營運回歸。

- [ ] Ownership Audit 必須 0 hard failure。
- [ ] 現有功能 regression 全跑。
- [ ] JavaScript syntax check 全跑。
- [ ] 1920×1080 實機視覺驗收先封板。
- [ ] 其他尺寸只喺 1920 封板後做 Adaptive regression。
