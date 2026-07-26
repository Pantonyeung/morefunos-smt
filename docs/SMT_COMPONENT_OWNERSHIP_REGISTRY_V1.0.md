# SMT Component Ownership Registry V1.0

> 狀態：CURRENT / HARD RULE
> 目的：每一個 UI Component、Global Surface、Domain、Adaptive Token 只可以有一個真正責任來源（Single Owner）。

## 1. 最高規則

1. 一個 Component 只可以有一個 Owner。
2. Owner 以外檔案不得重新定義同一 Component 的 DOM、內部 Layout、Style、State 或 Business Logic。
3. Adaptive Core 只可提供 Token／Available Area／Density／Grid／Typography 計算；不得直接重新設計 Component。
4. Page 可以消費 Shared Component／Token，但不得複製 Shared Component。
5. Global Shell 只由 Shell 管理；Page 不得建立第二套 Global Status Bar／Global Bottom Navigation。
6. Domain 只管理資料／規則；UI 不得自行再計算第二套 Pricing、Packaging、Checkout、Print、Required、Link Up。
7. 如發現兩個 Owner：STOP。先收口成單一 Owner，才可以繼續功能修改。
8. 第一次修正無效時，第一檢查項必須係「是否有第二 Owner／Override／Observer／舊 Runtime 重新覆蓋」。

## 2. Owner 類型

- **DOM Owner**：唯一可以建立／改 Component DOM 結構。
- **Visual Owner**：唯一可以管理 Component 內部 Layout／Style。
- **State Owner**：唯一可以管理 Component 狀態來源。
- **Domain Owner**：唯一可以管理商業規則／計價／資料轉換。
- **Token Provider**：只提供 CSS Variable／數值，不視為 Component Owner；不得直接 selector 進 Component 內部。

每一個 Component 仍然只有一個「決策 Owner」。Token Provider 只供數值。

## 3. Global Ownership

| Component / Surface | 唯一 Owner | 允許依賴 | 禁止 |
|---|---|---|---|
| Global App Shell DOM | `index.html` | Shell JS/CSS | Child Page 重建 Shell |
| Global Status Bar Visual | `app-shell.css` | responsive tokens | Page CSS 改 `.global-shell-status` |
| Global Bottom Navigation Visual | `app-shell.css` | responsive tokens | Page CSS 建第二套 Global Nav |
| Global Route / Persistent Page Lifecycle | `app-loader.js` | page-ready bridge | Child Page 自行切主頁 iframe |
| Checkout Transaction Lock | `app-loader.js` | Checkout messages | Page Nav 繞過 Transaction Lock |
| Startup Login / Opening Cash | `shell-startup.js` | runtime/store | Page 自己建立每日登入／開工現金 |
| Global Page Actions Surface | `shared/status-actions.js`（目標：explicit message registry） | Page action descriptors | DOM 掃描／複製隱藏按鈕作永久方案 |
| Global Overlay Shell State | `app-loader.js`（只接 explicit overlay-state） | Page bridge message | DOM MutationObserver 作第二真相 |
| Global responsive profile | `shared/responsive.js` / `shared/responsive.css` | viewport | Page 自己建立 resolution-specific layout |
| Adaptive numeric tokens | `shared/adaptive-layout.js` | Component dimensions | Adaptive JS 改 Business Logic／DOM |

## 4. Order Page Ownership

| Component / Feature | 唯一 Owner | Token / Domain Provider | 禁止第二 Owner |
|---|---|---|---|
| Order Page Composition / Surface Render | `pages/order/page.js` | Store / Domain | Loader 注入 UI |
| Category / Search Surface | `pages/order/page.js` + `pages/order/page.css` | `category-layout.js` | Adaptive 重畫分類 DOM |
| Product Card DOM / Visual | `pages/order/page.js` + `pages/order/page.css` | Adaptive row tokens | `adaptive-layout.css` 直接改產品卡內部 Style |
| Cart DOM | `pages/order/page.js` | `order-domain.js` | Shared Runtime 建第二 Cart |
| Cart Visual / Geometry | `pages/order/cart.css` | `--adaptive-cart-*` tokens | `adaptive-layout.css` 再 selector `.cart-row/.seq-service/...` |
| 外／堂＋序號 Marker | `pages/order/cart.css` | `--adaptive-cart-marker` | 任何 Shared CSS 再定義 Marker |
| Cart View 原單／整理 | `pages/order/order-domain.js` | page.js render | UI 自己排序第二套資料 |
| Order Service Mode | `pages/order/order-domain.js` | page.js action | Cart CSS／Checkout 自己推斷第二套 |
| Packaging Pricing | `pages/order/order-domain.js` | Checkout consumes result | UI／Print 自行重算 |
| Drink Choice Card DOM | `pages/order/page.js::drinkChoiceCard` | drink data | 其他函數複製另一套飲品卡 DOM |
| Drink Choice Card Visual | `pages/order/page.css`（目標唯一 Owner） | context tokens/classes | `cart.css`／Adaptive 直接改 card 內部結構 |
| Quick Drink Drawer Layout | `pages/order/cart.css` | Drink Card component | 重新定義 Drink Card 本身 |
| Required Workflow DOM / State | `pages/order/page.js` | `pendingSummary` / Domain | 第二套 Required Runtime |
| Required Workflow Visual | `pages/order/cart.css` | Modal bounds tokens | `adaptive-layout.css` 直接改 `.required-workflow` |
| Specified Pairing | `pages/order/page.js` + `order-domain.js` | Pool / Link Up | Quick Drink 建第二 pairing domain |
| Modal State / Exit Dirty Rule | `pages/order/page.js` | global modal primitives | 每張 Modal 自己發明退出規則 |
| Modal Anchor Position | `pages/order/page.js::positionActiveCard` | viewport / shell bounds | CSS hardcode fixed source position |
| Cart Recent Highlight / Scroll | `pages/order/page.js` | Store mutation state | CSS／Observer 自己猜最新項 |

## 5. Other Page / Domain Ownership

| Area | 唯一 Owner |
|---|---|
| Orders UI | `pages/orders/page.js` + page CSS |
| Orders business rules | `pages/orders/orders-domain.js` |
| Checkout UI | `pages/checkout/page.js` + page CSS |
| Checkout policy / record | `pages/checkout/checkout-domain.js` |
| Dine UI | `pages/dine/page.js` + page CSS |
| Dine business rules | `pages/dine/dine-domain.js` |
| Soldout UI | `pages/soldout/page.js` + page CSS |
| More UI | `pages/more/page.js` + `pages/more/page.css` |
| More / reporting domain | `pages/more/more-domain.js` |
| Printing domain | `pages/more/print-domain.js` |
| Order identity | `shared/order-identity.js` |
| Cross-terminal operations | `shared/operations.js` |
| Runtime persistence defaults | `shared/runtime.js` |

## 6. 現存 Ownership Violations（必須清理）

### V1 — Order Cart Visual Dual Owner
- `pages/order/cart.css`
- `shared/adaptive-layout.css`

狀態：**MIGRATION REQUIRED**

目標：`cart.css` 成為唯一 Visual Owner；Adaptive 只提供 `--adaptive-cart-*` Token。

### V2 — Drink Card Visual Dual Owner
- `pages/order/page.css`
- `pages/order/cart.css`

狀態：**MIGRATION REQUIRED**

目標：`page.css` 成為 Drink Card 唯一 Visual Owner；`cart.css` 只管理 Quick Drawer／Required Grid 容器。

### V3 — Global Page Actions 有兩個真相
- Child Page 隱藏 Status Action DOM
- `shared/status-actions.js` MutationObserver 掃描及複製

狀態：**MIGRATION REQUIRED / HIGH PRIORITY**

目標：Page 只發 explicit Action Descriptor；Global Shell 只渲染 descriptor；Click 以 action id 回傳 Page。

### V4 — Global Overlay State 有兩個真相
- Page explicit `morefun:overlay-state`
- `app-loader.js` MutationObserver 再掃 Child DOM

狀態：**MIGRATION REQUIRED / HIGH PRIORITY**

目標：只保留 explicit overlay-state message。

### V5 — Legacy Child Global Chrome
- `shared/shell.js` 仍可 render child `global-statusbar` / `bottom-nav`
- Global Shell 已有真正 `global-shell-status` / `global-bottom-nav`

狀態：**MIGRATION REQUIRED**

目標：Global Shell 模式下 Child Page 不再建立第二套 Global Chrome；Standalone QA 如有需要，必須明確標示 QA-only，不可成為 Runtime Owner。

## 7. 修改前 Ownership Gate

每次修改前必須回答：

1. Component 名稱？
2. Registry Owner 係邊個檔案？
3. 今次只改 Owner 嗎？
4. 有冇其他 CSS／JS selector、Observer、Runtime 同時控制？
5. Adaptive 係咪只傳 Token，而唔係直接改 Component？
6. Domain 係咪唯一商業規則來源？

任何一題答「有第二 Owner」：STOP，先完成 Ownership Consolidation。

## 8. Definition of Done

一個 Component 只有同時符合以下先可以叫完成：

- 一個 DOM Owner；
- 一個 Visual Owner；
- 一個 State／Domain truth source；
- Adaptive 只提供 Token；
- 無永久 Override／Patch／MutationObserver 補同一 State；
- Code Map / MFKG / Ownership Registry 一致；
- Contract Test 可以阻止第二 Owner 再出現。
