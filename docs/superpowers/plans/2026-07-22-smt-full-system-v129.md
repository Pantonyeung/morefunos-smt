# SMT Full-System V1.29 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 `order-v1-28` 真機驗收發現嘅日結、訂單、結帳、點單搜尋、堂食彈窗、共用介面及打印資料問題整合為一個可再次真機全測嘅版本。

**Architecture:** 保留現有本機資料與路由契約，將計算規則放入純資料模組，將跨頁狀態欄、底部導航、圖標及來源定位彈窗收口到共用元件。每組先以回歸測試證明現有失敗，再作最小修正；實體打印與商米／iPad 驗收仍明確列為待實機。

**Tech Stack:** 原生 ES modules、HTML、CSS、Node.js `node:test`、localStorage、現有 `morefun.print.v1` 安卓橋接合約。

**Execution status:** Task 1–7 已完成；`order-v1-29` 全套 186／186、Context OS、非第三方 JavaScript 語法及差異格式檢查通過。iPad／Sunmi T2S、安卓橋接及實體出紙按規格保留待真機驗收。

## Global Constraints

- 正式基準為 `origin/feat/smt-order-page-v1` 的 `order-v1-28`。
- 紙幣只接受 $10、$20、$50、$100、$500；硬幣只接受 $1、$2、$5。
- 不接受 $1,000、$0.5、$0.2、$0.1；$10 只歸紙幣。
- 點單頁現有全域狀態欄必須喺所有主要頁面保留；頁面專用狀態只可加喺其下。
- 五項底部導航固定同高、同字體、同線性圖標、同選中規則；內容不可推動頂欄、底欄或結帳確認掣。
- 來源型操作卡須有箭嘴指向觸發來源；中央確認窗不加箭嘴。
- 快捷飲品展開後無操作八秒自動收起。
- 接單後運行滿三十分鐘自動完成並進入歷史，不設中間狀態。
- 未接通安卓橋接或未完成實體出紙，不得聲稱打印成功。

---

### Task 1: 日結現金、渠道、開機留底及營業分析

**Files:**
- Modify: `pages/more/more-domain.js`
- Modify: `pages/more/page.js`
- Modify: `pages/more/page.css`
- Test: `tests/more-operations-domain.test.mjs`
- Test: `tests/more-page.test.mjs`

**Interfaces:**
- Produces: `CASH_DENOMINATIONS`、`buildOperationalReport()` 嘅渠道／付款細分、`openingCashAdjustment()`、`createDayClose()` 留底延續資料。
- Consumes: `ORDER_HISTORY_STORAGE_KEY`、`BACKUP_STORAGE_KEY` 及既有營業日規則。

- [ ] 寫失敗測試，鎖定八種面額、渠道／付款各自單數與金額、上次留底及翌日調整。
- [ ] 執行 `node --test tests/more-operations-domain.test.mjs tests/more-page.test.mjs`，確認因舊面額及欠缺資料而失敗。
- [ ] 修正純資料計算，再接入日結及報表畫面；日結保留實點總額→提取→留底守恆。
- [ ] 重新執行兩份測試並確認通過。

### Task 2: 訂單三十分鐘歸檔及歷史資料流

**Files:**
- Modify: `pages/orders/orders-domain.js`
- Modify: `pages/orders/page.js`
- Test: `tests/orders-actions.test.mjs`

**Interfaces:**
- Produces: `archiveExpiredOrders(orders, now)`，把 `running` 且達期限訂單寫成 `completed`、`completedAt` 及系統 audit。
- Consumes: `acceptedAt`／`autoCompleteAt` 與 `ORDER_HISTORY_STORAGE_KEY`。

- [ ] 寫失敗測試，重現二十九分鐘仍運行、三十分鐘完成、四十八分鐘必須歷史可見。
- [ ] 執行 `node --test tests/orders-actions.test.mjs`，確認現有訂單頁資料流失敗。
- [ ] 頁面載入及分鐘更新時套用歸檔並持久化，避免只改畫面篩選。
- [ ] 重跑測試並驗證歷史數量及活動欄一致。

### Task 3: 固定結帳操作區、分類搜尋及新單提示

**Files:**
- Modify: `pages/checkout/page.js`
- Modify: `pages/checkout/page.css`
- Modify: `pages/order/page.js`
- Modify: `pages/order/page.css`
- Create: `pages/order/category-layout.js`
- Modify: `pages/more/page.js`
- Modify: `pages/more/page.css`
- Test: `tests/checkout-layout.test.mjs`
- Test: `tests/order-edit-flow.test.mjs`
- Test: `tests/category-layout.test.mjs`
- Test: `tests/more-page.test.mjs`

**Interfaces:**
- Produces: 固定 `checkout-action-zone`、可設定分類網格、固定末格 `category-search`、`searchQuery` 篩選、加大 `new-order-toast`。
- Consumes: 現有渠道政策、產品名稱／Code、分類排序、`SETTINGS_STORAGE_KEY`。

- [ ] 寫失敗版面測試，要求非現場渠道確認掣仍固定底部、搜尋入口不隨分類捲走、搜尋可清除、新單提示最少一張卡闊兩張卡高。
- [ ] 寫失敗設定測試，鎖定後台只可選每行 5／6／7 格、顯示 1／2 行、搜尋開關；搜尋開啟時佔最後一行最後一格，分類超出首屏容量仍可橫向操作而不可靜默消失。
- [ ] 執行指定測試確認失敗。
- [ ] 實作固定底部、分類設定、搜尋彈層及提示尺寸；產品結果同時按名稱、Code 搜尋。設定先保存為本機全局契約，保留日後 Admin／雲端同步覆蓋入口。
- [ ] 重跑指定測試。

### Task 4: 堂食掛單單層化、快捷飲品自動收起及來源定位彈窗

**Files:**
- Modify: `pages/order/page.js`
- Modify: `pages/order/page.css`
- Modify: `shared/runtime.js`
- Modify: `shared/page-base.css`
- Test: `tests/order-edit-flow.test.mjs`
- Test: `tests/orders-drafts-ui.test.mjs`

**Interfaces:**
- Produces: 同時只存在一個主彈層、四方向共用箭嘴、八秒無操作收起計時器。
- Consumes: `modal` 單一控制器、`positionActiveCard()`、快捷抽屜狀態。

- [ ] 寫失敗測試，鎖定掛單只一層、四方向箭嘴、八秒計時重設及收起。
- [ ] 執行指定測試確認失敗。
- [ ] 修正 overlay 擁有權、共用箭嘴樣式及計時生命週期。
- [ ] 重跑指定測試。

### Task 5: 共用全域狀態欄、底部導航、圖標與視覺節奏

**Files:**
- Create: `shared/shell.js`
- Modify: `shared/page-base.css`
- Modify: `pages/order/page.js`
- Modify: `pages/orders/page.js`
- Modify: `pages/dine/page.js`
- Modify: `pages/soldout/page.js`
- Modify: `pages/more/page.js`
- Modify: corresponding page CSS files
- Test: `tests/shell-ui.test.mjs`
- Test: existing page layout tests

**Interfaces:**
- Produces: `renderGlobalStatusBar()`、`renderBottomNav(activeRoute)`、同一套 inline SVG 線性圖標。
- Consumes: 終端、接單、待處理、售罄、快捷、設備狀態快照。

- [ ] 寫失敗測試，要求五頁共用同一 shell 輸出，底欄高度及選中樣式只由共用 CSS 定義。
- [ ] 執行測試確認現有逐頁字串與覆蓋樣式失敗。
- [ ] 接入共用 shell；頁面額外狀態保留喺全域欄下方；移除衝突底欄覆蓋。
- [ ] 加入統一卡片淺陰影、固定三級圓角、減少多餘產品卡底部留白。
- [ ] 重跑 shell 及全部頁面測試。

### Task 6: 舊單據資料對齊及打印模板

**Files:**
- Modify: `pages/more/print-domain.js`
- Modify: `tests/print-core.test.mjs`
- Modify: `pages/more/more-domain.js`
- Modify: `tests/more-operations-domain.test.mjs`

**Interfaces:**
- Produces: 日結打印摘要、顧客小票、製作單、打包單、逐件標籤所需完整欄位。
- Consumes: 訂單號、來源、平台單號、電話、時間、產品配置、用餐方式、餐具、備註、付款拆分。

- [ ] 寫失敗測試，按真機相片要求不同單據各自包含必要資料及突出層級。
- [ ] 產品標籤鎖定品牌、訂單號、逐件張數（例如 `1/1`）、對內短碼／產品名、用餐方式、全部實際配置、備註及包裝／收費狀態；不可只印產品名。
- [ ] 飯團必須逐件標籤；其他產品依外賣及後台打印規則決定，數量大於一時每件有獨立張數。
- [ ] 執行打印測試確認現模板欠欄位。
- [ ] 擴充純文字打印文件，標籤按產品數量逐件建立內容，保留 `morefun.print.v1` 契約。
- [ ] 重跑打印及日結測試。

### Task 7: 版本、回歸及發佈證據

**Files:**
- Modify: `VERSION.txt`、`CHANGELOG.md`、`VERIFICATION_REPORT.md`
- Modify: `SMT_AI_START_HERE.md`、`SMT_CONTEXT_MIN.md`、`SMT_AI_CONTEXT_PACK.md`
- Modify: `docs/ai-context/*` 相關狀態、決策、程式地圖及清單
- Modify: all HTML cache-busting query strings

**Interfaces:**
- Produces: 單一新版本真相、完整測試數、回滾點及待實機清單。

- [ ] 將版本升級為 `order-v1-29`，更新所有載入 URL 及狀態文件。
- [ ] 執行 `node scripts/validate-ai-context.mjs`。
- [ ] 執行 `node --test tests/*.test.mjs`。
- [ ] 對所有非 vendor JavaScript 執行 `node --check`。
- [ ] 執行 `git diff --check`、審查 `git diff --stat` 及實際差異。
- [ ] 只將自動驗證標為通過；iPad、Sunmi T2S、實體打印保留待真機驗收。
