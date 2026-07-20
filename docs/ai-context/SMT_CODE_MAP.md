# SMT Code Map

## 執行入口

| 檔案 | 責任 | 主要依賴 |
|---|---|---|
| `index.html` | PWA shell入口 | loader、shell CSS |
| `app-loader.js` | route、viewport、安全縮放、iframe bridge | pages、postMessage |
| `pages/order/index.html` | 點單DOM入口 | page.js、page.css |
| `pages/order/page.js` | 渲染、事件、modal、購物車、飲品、配對、待處理 | data、domain、runtime |
| `pages/order/page.css` | 工作區、定位及視覺 | page.js class names |
| `pages/order/order-domain.js` | 純資料操作 | 無DOM |
| `pages/order/page-data.js` | catalog、drink、pending示範資料 | page.js |
| `shared/runtime.js` | 狀態及初始值 | local storage |
| `tests/order-edit-flow.test.mjs` | UI、CSS及domain回歸 | order頁檔案 |

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

## 資料流

1. 點產品 → 普通 `openProduct`／快捷 `quickAddProduct` → store cart → `render`。
2. 購物車修改 → `openProduct(lineId)` → draft → `applyProduct`。
3. 快捷飲品 → `openDrink` → adjustment groups → `applyDrink`。
4. 待處理 → detail → review → `acceptPendingOrder` → running → `completeExpiredOrders`。
5. 所有主卡 → 單一 `modal` → `activeModal` → `positionActiveCard`。

## 修改守則

- class或 `data-action` 改名，同步改 CSS 及測試。
- Store shape 改動須兼容舊 localStorage。
- 快取版本改動同步 service worker／資源 query，避免 Safari 顯示舊版。
