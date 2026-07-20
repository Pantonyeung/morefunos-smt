# Cart Pairing Drink Language Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正購物車實機對齊、加入動態 A–Z 指定配對，並讓所有飲品選擇入口共用直向卡視覺語言。

**Architecture:** 保留現有單頁 store/modal 架構；擴充共用 `drinkChoiceCard` 的尺寸 context，指定配對 draft 改為多組資料，並在 CSS 最後建立唯一有效的實機覆蓋規則。

**Tech Stack:** Vanilla JavaScript、CSS、Node test runner。

## Global Constraints

- 頂欄與底部導航固定。
- 同一時間只允許一張 modal。
- 所有飲品卡名稱置頂，選中使用橙框與箭嘴。
- 實作完成仍需 iPad／Sunmi T2S 實機驗收。

---

### Task 1: 購物車單行對齊

**Files:** `pages/order/page.css`, `tests/order-edit-flow.test.mjs`

- [ ] 加入失敗測試，要求金額 `justify-self:end` 並讓操作區與圖片同列。
- [ ] 重整 cart row grid，放大名稱並鎖定右側 price/actions。
- [ ] 執行全部測試。

### Task 2: 動態 A–Z 指定配對

**Files:** `pages/order/page.js`, `pages/order/page.css`, `tests/order-edit-flow.test.mjs`

- [ ] 加入動態組數及多組 draft 測試。
- [ ] 依主餐／小食可用數量建立 A、B、C…組別。
- [ ] 每組獨立選擇及一次確認全部完整組別。
- [ ] 增加卡片安全內距、邊框及內部滾動。

### Task 3: 統一飲品卡語言

**Files:** `pages/order/page.js`, `pages/order/page.css`, `tests/order-edit-flow.test.mjs`

- [ ] 擴充共用飲品卡 context class。
- [ ] 抽屜改為較高直向卡，名稱置頂、圖片置中、選中箭嘴。
- [ ] 產品修改及統一整理使用相同卡片元件的小尺寸版本。
- [ ] 移除會把直向卡覆蓋成橫向卡的尾段規則。

### Task 4: 版本、文件及驗證

**Files:** `app-loader.js`, `index.html`, `pages/order/index.html`, `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`, `docs/design-lock-v1/ORDER_PAGE_IMPLEMENTATION_STATUS.md`

- [ ] 更新快取版本。
- [ ] 記錄新標準及實機待驗收狀態。
- [ ] 執行 Node tests、語法檢查及 diff check。
- [ ] 提交並同步 `feat/smt-order-page-v1`。
