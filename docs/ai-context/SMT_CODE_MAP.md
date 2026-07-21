# SMT Code Map

## 執行入口

| 檔案 | 責任 | 主要依賴 |
|---|---|---|
| `index.html` | PWA shell入口 | loader、shell CSS |
| `app-loader.js` | route、viewport、安全縮放、iframe bridge | pages、postMessage |
| `pages/order/index.html` | 點單DOM入口 | page.js、page.css |
| `pages/order/page.js` | 渲染、事件、modal、購物車、飲品、配對、待處理、餐牌啟動 | data、menu-api、domain、runtime |
| `pages/order/page.css` | 工作區、定位及視覺 | page.js class names |
| `pages/order/order-domain.js` | 純資料操作 | 無DOM |
| `pages/order/page-data.js` | catalog、drink、pending示範資料 | page.js |
| `pages/order/menu-api.js` | Firebase RTDB餐牌讀取、正規化、SMT規則合併、快取及離線回退 | `public/catalogV1`、page-data後備 |
| `pages/orders/page.js` | 三渠道總覽、核數／通知、行內部分取消、歷史及反結帳 | 訂單記錄、orders-domain、終端ID |
| `pages/orders/orders-domain.js` | 渠道／付款狀態、核數、問題通知、取消、重印及篩選 | checkout channel policy |
| `pages/checkout/page.js` | 渠道分流、WebP 渠道／付款圖標、摘要已收框直接輸入、現場收款、完成核對、更正及建立訂單 | checkout-domain、operations |
| `pages/checkout/checkout-domain.js` | 渠道政策、優惠、付款狀態、平台佣金及訂單記錄 | 純資料操作 |
| `pages/dine/page.js` | 九宮格、輪候、枱詳情、掃碼確認、付款及枱碼介面 | dine-domain、QR vendor |
| `pages/dine/dine-domain.js` | 枱位計時、掃碼確認、全數及逐餐品付款純資料規則 | 無DOM |
| `shared/operations.js` | 暫存流水、跨機接手、再暫存 lineage、結帳稽核 | 純資料操作 |
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
| 堂食 | `tableView`, `tableCard`, `commitTableOrder`, `acceptQrSubmission`, `applyItemPayment` | dine page tests |

## 資料流

1. 啟動 → Firebase RTDB `public/catalogV1` → Firebase餐牌／上次快取／內置後備 → SMT規則合併 → `render`。
2. 點產品 → 普通 `openProduct`／快捷 `quickAddProduct` → store cart → `render`。
3. 購物車修改 → `openProduct(lineId)` → draft → `applyProduct`。
4. 快捷飲品 → `openDrink` → adjustment groups → `applyDrink`。
5. 待處理 → detail → review → `acceptPendingOrder` → running → `completeExpiredOrders`。
6. 所有主卡 → 單一 `modal` → `activeModal` → `positionActiveCard`。

## 修改守則

- class或 `data-action` 改名，同步改 CSS 及測試。
- Store shape 改動須兼容舊 localStorage。
- 快取版本改動同步 service worker／資源 query，避免 Safari 顯示舊版。
