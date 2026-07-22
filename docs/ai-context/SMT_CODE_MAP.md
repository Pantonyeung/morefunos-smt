# SMT Code Map

## 執行入口

| 檔案 | 責任 | 主要依賴 |
|---|---|---|
| `index.html` | PWA shell入口 | loader、shell CSS |
| `app-loader.js` | route、viewport、安全縮放、iframe bridge及子頁錯誤可見後備 | pages、postMessage |
| `pages/order/index.html` | 點單DOM入口 | page.js、page.css |
| `pages/order/page.js` | 渲染、事件、modal、購物車、飲品、配對、待處理、共用待處理數量、餐牌啟動、售罄／停售預覽及堂食取消脈絡 | data、menu-api、domain、runtime、供應狀態、dine-domain |
| `pages/order/page.css` | 工作區、定位及視覺 | page.js class names |
| `pages/order/order-domain.js` | 純資料操作 | 無DOM |
| `pages/order/page-data.js` | catalog、drink、pending示範資料 | page.js |
| `pages/order/menu-api.js` | Firebase RTDB餐牌讀取、正規化、SMT規則合併、快取及離線回退 | `public/catalogV1`、page-data後備 |
| `pages/orders/page.js` | 三渠道總覽、核數／通知、行內部分取消、歷史及反結帳 | 訂單記錄、orders-domain、終端ID |
| `pages/orders/orders-domain.js` | 渠道／付款狀態、核數、問題通知、取消、重印及篩選 | checkout channel policy |
| `pages/checkout/page.js` | 渠道分流、WebP 渠道／付款圖標、摘要已收框直接輸入、現場收款、完成核對、更正及建立訂單 | checkout-domain、operations |
| `pages/checkout/checkout-domain.js` | 渠道政策、優惠、付款狀態、平台佣金及訂單記錄 | 純資料操作 |
| `pages/dine/page.js` | 九宮格、輪候、枱詳情、掃碼確認、付款、完成歷史、自動清枱及點餐意圖清理 | dine-domain、訂單／點單狀態、QR vendor |
| `pages/dine/dine-domain.js` | 枱位計時、點餐意圖、空會話清理、掃碼確認、付款、付清結算及歷史訂單規則 | 無DOM |
| `pages/soldout/page.js` | 售罄獨立分類、停售分類尾排序、批量操作、狀態詳情及餐牌失敗回退 | menu-api、供應狀態 |
| `pages/more/page.js` | 更多頁六入口、歷史日期範圍、營業／渠道／付款／商品／異常分析、訂單下鑽、日結、報表匯出、打印中心、備份／恢復、顯示設定、系統診斷及高風險二次確認 | more-domain、print-domain、本機訂單／設定 |
| `pages/more/more-domain.js` | 營業日、歷史範圍、港幣面額盤點、待核實付款反推、3% 授權日結、渠道／付款／商品／時段／異常報表、CSV、快照校驗／恢復及診斷純資料邏輯 | 無 DOM |
| `pages/more/print-domain.js` | 五部設備、四款格式、合併統計、打印工作、重試／改送、診斷及安卓橋接封包 | 無 DOM |
| `pages/more/page.css` | 更多頁主卡、細節彈窗、確認彈窗及固定畫布視覺 | page.js class names |
| `shared/operations.js` | 暫存流水、跨機接手、作廢、日結清理、再暫存 lineage、結帳稽核 | 純資料操作 |
| `shared/order-identity.js` | 同步歷史及活躍堂食每日三位顯示流水、早上五時營業日、舊編號兼容、最新開單及永久訂單識別；跨機原子派號待後台 | 純資料操作 |
| `shared/runtime.js` | 狀態及初始值 | local storage |
| `tests/order-edit-flow.test.mjs` | UI、CSS及domain回歸 | order頁檔案 |
| `tests/menu-api.test.mjs` | 真實餐牌合約、映射及離線回歸 | menu-api |

## 功能到程式

| 功能 | UI／函數 | 驗證 |
|---|---|---|
| 購物車 | `cartRows`, `cartRow`, `changeCartQuantity`, `openProduct` | cart tests |
| 快捷飲品 | `quickDrinks`, `drinkChoiceCard`, `openDrink`, `drinkModifierModal`, `applyDrink` | drink tests |
| 產品修改 | `productDetailModal`, `detailGroups`, `applyProduct` | edit flow |
| 指定配對 | `pairingGroupCount`, `specifiedLinkModal`, pairing actions | dynamic A–Z tests |
| 套餐父項 | `combineRiceballSet`, `comboEditorModal`, `dissolveRiceballSet` | combo domain／UI tests |
| 統一整理 | `completionModal`, `complete-group`, `linkup-all` | required／link tests |
| 待處理 | `pendingPanel`, `pendingDetailModal`, `pendingReviewModal` | review tests |
| 接單狀態 | `acceptPendingOrder`, `completeExpiredOrders` | domain tests |
| WhatsApp | `createWhatsAppLink`, review QR | URL tests |
| 卡片定位 | `anchorRect`, `positionActiveCard`, `activeModal` | modal／CSS tests |
| 顯示設定 | `settingsModal`, `quickSettingsModal` | settings tests |
| 真實餐牌 | `loadMenuCatalog`, `mapMenuToOrderCatalog`, `bootstrapLiveMenu` | menu API tests |
| 掛單／取單 | `hangModal`, `takeModal`, `createDraftRecord`, `restoreDraftForTerminal` | draft handoff／draft UI tests |
| 結帳終端稽核 | `recordCheckoutOperator`, `completeCheckout` | draft／orders UI tests |
| 訂單操作 | `changeOrderPayment`, `partiallyCancelItem`, `cancelOrder`, `queueReprint` | orders actions tests |
| 渠道付款政策 | `getChannelPolicy`, `buildCheckoutRecord` | checkout actions tests |
| 付款核數 | `reconcilePayment`, `flagPaymentIssue` | orders actions tests |
| 堂食 | `tableView`, `tableCard`, `commitTableOrder`, `settleTablePayment`, `reconcileSettledTables` | dine page tests |
| 草稿日結 | `clearDraftsForDayClose`, `clearExpiredBusinessDayDrafts` | draft handoff tests |
| 售罄啟動 | `loadMenuCatalog({fallback})`、後備餐牌 catch | soldout page tests |
| 售罄／停售一致性 | `statusOf`、`supplyStatus`、`sortPausedLast`、`soldoutModal` | soldout page／order edit flow tests |
| 更多頁營運 | `createDayClose`、`buildOperationalReport`、`createBackupEnvelope`、`buildDiagnosticReport` | more operations tests |
| 打印核心 | `validatePrinter`、`renderPrintDocument`、`createPrintJobs`、`buildAndroidPrintPayload` | print core／integration tests |
| 更多頁介面 | `mainPage`、`detailDialog`、`confirmDialog`、`saveDisplay` | more page tests |
| 日結盤點及反推 | `syncCashDenomination`、`totalCashBreakdown`、`calculateDayCloseReconciliation`、`createDayClose` | more operations tests |
| 堂食取消生命週期 | `createDineOrderContext`、`cleanupEmptyDineSessions`、`requestDineCancellation` | dine page tests |
| 全局觸控動效 | `shared/page-base.css` 共用 focus／press／dialog／drawer／reduced-motion | more page及全量回歸 |
| 共用介面骨架及選擇膠囊 | `shared/shell.js`、`shared/page-base.css`、`renderGlobalStatusBar`、`renderBottomNav`、`--choice-pill-radius` | shell UI tests |
| 分類格數及搜尋 | `category-layout.js`、`categoryBar`、更多頁顯示設定 | category layout／order UI tests |
| 訂單歷史歸檔 | `archiveExpiredOrders`、`archiveAndRender` | orders actions tests |
| 實物打印資料 | `shouldPrintProductLabel`、`labelDocuments`、`renderPrintDocument` | print core tests |
| 點單啟動安全 | `pendingOrderCount`、首次 `render`、`morefun:page-runtime-error` 後備畫面 | order edit flow及首次渲染驗證 |
| 訂單身份 | `createOrderIdentity`、`orderDisplayNumber`、`latestOrderDisplayNumber` | order identity、checkout、dine及 UI tests |
| 歷史報表 | `buildReportRange`、`ordersForRange`、`analyticsReport`、`reportTabs` | more operations／more page tests |
| 付款對數 | `paymentLegs`、`buildBreakdownRows`、付款分頁及 `reportDrilldown` | 混合付款、正負差額、別名及 more page tests |
| 異常操作 | audit event mapping、`anomalyTable`、跨日 `reportDrilldown` | more operations／more page tests |

## 資料流

1. 啟動 → Firebase RTDB `public/catalogV1` → Firebase餐牌／上次快取／內置後備 → SMT規則合併 → `render`。
2. 點產品 → 普通 `openProduct`／快捷 `quickAddProduct` → store cart → `render`。
3. 購物車修改 → `openProduct(lineId)` → draft → `applyProduct`。
4. 快捷飲品 → `openDrink` → adjustment groups → `applyDrink`。
5. 待處理 → detail → review → `acceptPendingOrder` → running → `completeExpiredOrders`。
6. 所有主卡 → 單一 `modal` → `activeModal` → `positionActiveCard`。
7. 完成訂單／堂食／重印 → 中央打印工作 → 格式化文件 → `morefun.print.v1` 安卓橋接 → 實體結果回寫。
8. 空枱點餐 → 只寫 `dineContext` → 取消則清除並返回堂食；正式提交餐品 → 校驗會話 → 開枱及建立正式批次。
9. 日結 → 面額盤點 → 實點現金 → 待核實現金／非現金反推 → 3% 覆核及授權 → 不可覆寫版本稽核。
10. 任一主要頁 → 共用全域狀態欄／底欄 → 頁面只附加專用狀態；來源操作卡 → 共用定位器 → 四方向箭嘴。
11. 完成單計時 → 三十分鐘 → 持久完成狀態／完成時間／audit → 歷史訂單。
12. 結帳／堂食完成 → `createOrderIdentity` → 每日顯示流水＋永久識別 → 各主頁由同一函數找最新單號。
13. 更多頁選日期 → `buildReportRange` → 範圍內訂單 → 營業／渠道／付款／商品／異常同源統計及下鑽。

## 修改守則

- class或 `data-action` 改名，同步改 CSS 及測試。
- Store shape 改動須兼容舊 localStorage。
- 快取版本改動同步 service worker／資源 query，避免 Safari 顯示舊版。
