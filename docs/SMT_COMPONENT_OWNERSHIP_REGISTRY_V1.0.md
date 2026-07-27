# SMT Component Ownership Registry V1.3

> 狀態：CURRENT / HARD RULE
> 目的：一個元件可以由多層架構共同組成，但同一項決策只可以有一個唯一 Authority。

## 1. 最高規則

1. 一個 Component 可以跨 Page／Component／Domain／Adaptive 層存在；但同一種決策只可以有一個最終 Authority。
2. Page／Composition 只決定元件外部位置、可用空間、與其他元件關係；不得重新定義 Component 內部 Visual。
3. Component Visual Authority 只管理自己內部 DOM 幾何、Style、Interaction Visual；不得自行重算 Business Rule。
4. State／Domain Truth Source 只可以有一個；UI、Checkout、Print、Report 不得建立第二套計價／狀態推斷。
5. Adaptive Core 只可提供 Token／Available Area／Density／Grid／Typography 計算；不得直接成為 Component Visual Authority。
6. Global Shell 只由 Shell 管理；Page 不得建立第二套 Global Status Bar／Global Bottom Navigation 作正式 Runtime Authority。
7. 如發現兩個 Layer 同時對同一 Property、State、Action、Business Rule 擁有最終決定權：STOP。先收口 Authority，才可以繼續功能修改。
8. 第一次修正無效時，第一檢查項必須係「是否存在第二 Authority／Override／Observer／舊 Runtime 重新覆蓋」。

## 2. Authority 類型

- **Composition Authority**：決定 Component 放邊、外部寬高約束、與其他 Surface 的排列關係。
- **DOM Authority**：唯一可以建立／改 Component 內部 DOM 結構。
- **Visual Authority**：唯一可以管理 Component 內部 Layout／Style／Interaction Visual。
- **State Authority**：唯一可以管理 UI 狀態真相來源。
- **Domain Authority**：唯一可以管理商業規則／計價／資料轉換。
- **Token Provider**：只提供 CSS Variable／數值；不得直接 selector 進 Component 內部。

**重要：Ownership ≠ File Ownership。**

同一 Component 可以由多個檔案共同構成，但每個檔案必須屬於不同責任層；禁止兩個檔案同時對同一屬性／狀態／行為擁有最終決定權。

## 3. Global Authority Matrix

| Component / Surface | Composition / DOM Authority | Visual Authority | State / Domain Authority | Token / Dependency | 禁止 |
|---|---|---|---|---|---|
| Global App Shell | `index.html` / `app-loader.js` | `app-shell.css` | `app-loader.js` | responsive tokens | Child Page 重建 Shell |
| Global Status Bar | Shell | `app-shell.css` | `shared/status-actions.js` descriptor registry | Page action descriptors | DOM 掃描／Child Page Visual override |
| Global Bottom Navigation | Shell | `app-shell.css` | `app-loader.js` | responsive tokens | Page 建第二套正式 Nav |
| Route / Persistent Page Lifecycle | `app-loader.js` | Shell | `app-loader.js` | page-ready bridge | Child Page 自行管理主 iframe |
| Checkout Transaction Lock | Shell | `app-shell.css` | `app-loader.js` | Checkout messages | Hash／Page Nav 繞過 transaction lock |
| Startup Login / Opening Cash | Shell | `app-shell.css` | `shell-startup.js` | runtime/store | Page 建第二套登入／開工現金 |
| Global Overlay Shell State | Shell | `app-shell.css` | explicit `morefun:overlay-state` | Page bridge | MutationObserver 第二真相 |
| Responsive Profile | Shell / Shared | N/A | `shared/responsive.js` | viewport | Page 建 resolution-specific second UI |
| Adaptive Numeric Tokens | N/A | N/A | `shared/adaptive-layout.js` | component measurements | Adaptive JS/CSS 改 Component 內部 Visual／Business Logic |

## 4. Order Page Authority Matrix

| Component / Feature | Composition Authority | DOM Authority | Visual Authority | State / Domain Authority | Token Provider | 禁止 |
|---|---|---|---|---|---|---|
| Order Page Workspace | `pages/order/page.css` | `pages/order/page.js` | `pages/order/page.css` | Page Store | responsive/adaptive tokens | Loader 注入 UI |
| Category / Search | `page.css` | `page.js` | `page.css` | `category-layout.js` / transient state | adaptive category tokens | Adaptive 重畫 DOM |
| Product Card | `page.css`／產品列表 | `page.js::productCard` | `pages/order/product-card.css` | Catalog | `--adaptive-product-row-*`／readability tokens | `page.css`／`adaptive.css`／Shared Adaptive 新增第二套 card internal visual |
| Cart Surface 外部位置 | `page.css` | `page.js` | N/A | Order Store | `--cart-width` | `cart.css` 重排整個 page composition |
| Cart Component 內部 | N/A | `page.js::cartLineRow/cartSurface` | `pages/order/cart.css` | `order-domain.js` | `--adaptive-cart-*` | `page.css`／Adaptive 重複定義 Cart internal property |
| 外／堂＋序號 Marker | N/A | `cartLineRow` | `cart.css` | `order-domain.js` service mode | `--adaptive-cart-marker = --adaptive-cart-image × 0.9` | Shared CSS 再定義 marker geometry |
| Cart View 原單／整理 | N/A | `page.js` | `cart.css` | `order-domain.js` | N/A | UI 自己排序第二套資料 |
| Packaging Pricing | N/A | N/A | N/A | `order-domain.js` | N/A | UI／Checkout／Print 自行重算 |
| Drink Choice Card | Container 由使用場景決定 | `page.js::drinkChoiceCard` | `pages/order/drink-card.css` | Order state | context class/token | `page.css`／`cart.css`／Adaptive 新增第二套 card internal visual |
| Quick Drink Drawer | `cart.css` | `page.js` | `cart.css` | Order transient state | adaptive available area | 重寫 Drink Card 本體 |
| Required Workflow | Modal shell | `page.js` | `cart.css` | `pendingSummary` / Domain | modal bounds tokens | Adaptive 直接改 required internal selector |
| Specified Pairing / Combo Edit Task Modal | Modal shell | `page.js` | `pages/order/pairing-modal.css` | `order-domain.js` | viewport bounds / pool-link data | `page.css`／Adaptive 建第二套 bounded modal layout |
| Modal State / Dirty Exit | Shell bounds | `page.js` | modal primitives + page component CSS | `page.js` single modal state | viewport bounds | 每張 Modal 自己發明退出規則 |
| Recent Highlight / Auto Scroll | Cart composition | `page.js` | `cart.css` | Store mutation state | N/A | Observer／CSS 自己猜最新項 |

## 5. Other Page / Domain Authority

| Area | Composition / Visual Authority | Domain / State Authority |
|---|---|---|
| Orders UI | `pages/orders/page.js` + `pages/orders/page.css` + `pages/orders/responsive.css` | `pages/orders/orders-domain.js` |
| Checkout UI | `pages/checkout/page.js` + page CSS | `pages/checkout/checkout-domain.js` |
| Dine UI | `pages/dine/page.js` + page CSS + `pages/dine/responsive.css` | `pages/dine/dine-domain.js` |
| Soldout UI | `pages/soldout/page.js` + page CSS + `pages/soldout/responsive.css` | Supply state / catalog |
| More UI | `pages/more/page.js` + `pages/more/page.css` + `pages/more/responsive.css` | `pages/more/more-domain.js` |
| Printing | Print UI surface | `pages/more/print-domain.js` |
| Order Identity | N/A | `shared/order-identity.js` |
| Cross-terminal Operations | N/A | `shared/operations.js` |
| Runtime Persistence | N/A | `shared/runtime.js` / store |

## 6. 現存 Authority Violations / Migrations

### V1 — Order Cart 內部 Visual legacy migration
- `pages/order/page.css` 仍保留 `.cart-row/.cart-img/.cart-actions/.pending-area/.cart footer` 等舊 internal 規則。
- `pages/order/cart.css` 已補齊成自足正式 Cart Component Visual Authority，包括 Marker、Image、Row Geometry、Copy/Price/Actions、Pending、Footer。
- Marker 尺寸由 Shared Token `calc(var(--adaptive-cart-image) * .9)` 派生，不再用獨立 hardcode。

狀態：**AUTHORITY CUTOVER COMPLETE / LEGACY PHYSICAL REMOVAL PENDING / HIGH PRIORITY**

處理方式：`page.css` Cart legacy 已凍結，不得再新增／修改；下一步只做物理刪除。禁止用新 override、runtime hack、MutationObserver 或更高 specificity 假裝完成。

物理清理順序：
`Marker → Image → Row Geometry → Copy/Price/Actions → Pending → Footer`

### V2 — Drink Card Visual legacy migration
- `pages/order/drink-card.css` 已建立為正式 Drink Choice Card Visual Authority。
- 正式視覺已鎖：名稱區約 10%；圖片區約 90%；圖片本體 70%；`object-fit: contain`；完整居中顯示。
- `pages/order/page.css` 仍保留舊 `.drink-choice-card/.drink-choice-img/.drink-choice-count` 規則，屬 frozen legacy。

狀態：**AUTHORITY CUTOVER COMPLETE / LEGACY PHYSICAL REMOVAL PENDING / WAITING 1920 REGRESSION**

處理方式：舊 `page.css` Drink Card 規則只可刪除，不可再擴張；`cart.css`、Shared Adaptive、Shared Responsive 禁止重新成為 Drink Card internal Visual Authority。

### V3 — Global Page Actions DOM Observer

狀態：**CLEARED / EXPLICIT REGISTRATION**

Shell 只接 render-time action descriptors；禁止 MutationObserver／child DOM scan。

### V4 — Global Overlay 雙真相

狀態：**CLEARED**

只保留 explicit `morefun:overlay-state`。

### V5 — Legacy Child Global Chrome Runtime

狀態：**CLEARED / STANDALONE QA ONLY**

`shared/shell.js` 已成為唯一 compatibility gate：
- 正式嵌入 Global Shell 時，`renderGlobalStatusBar()` 只註冊 Action Descriptor 並返回空 DOM；
- 正式嵌入 Global Shell 時，`renderBottomNav()` 返回空 DOM；
- 只有 `window.parent === window` 的 standalone QA 開頁先輸出 legacy child chrome。

因此正式 Runtime 不再同時存在第二套 Global Status Bar／Bottom Navigation。

### V6 — Adaptive direct component selectors

狀態：**ARCHITECTURE CONSOLIDATED / WAITING 1920 REGRESSION**

- `shared/adaptive-layout.css` 已收口成純 Token Provider。
- `pages/order/adaptive.css` 只管理 Product List 可用區／row token 消費，不再管理 Product Card internal geometry。
- Product Card 內部自適應視覺由 `pages/order/product-card.css` 消費 `--adaptive-product-row-*`／readability tokens。
- Orders／Soldout component adaptive decisions 已回歸各自 Page Authority。
- Shared Adaptive 禁止再直接 selector 進 Page Component。

### V7 — Responsive Page direct selectors

狀態：**ARCHITECTURE CONSOLIDATED / WAITING 1920 REGRESSION**

- `shared/responsive-pages.css` 只保留 cross-page profile boundary。
- Orders／Dine／Soldout／More responsive component decisions 已移到各自 page-owned `responsive.css`。
- Shared Responsive 禁止再直接 selector 進 Page Component。

### V8 — Shared Page Base Global Chrome Visual

狀態：**VISUAL CLEARED / STANDALONE QA SUPPORT ONLY**

`page-base.css` 已退出正式 Global Chrome Visual Authority；standalone QA 如需 legacy chrome，只可由 QA 模式消費，不得成為正式 Runtime Authority。

### V9 — Product Card Visual legacy migration

- `pages/order/product-card.css` 已建立為正式 Product Card Internal Visual Authority。
- 卡片總高度仍由 `--adaptive-product-row-*` 控制；圖片 stage 使用剩餘空間，文字／價格區保留最少 48px 可讀／可操作高度。
- 大圖圖片元素只佔 stage 約 70% × 70%，使用 `object-fit: contain`，增加留白並完整顯示產品；不再由 Generic `image-shell` 的 `cover` 決定最終呈現。
- `pages/order/adaptive.css` 已退回 Product List row/token consumer。
- `pages/order/page.css` 仍保留舊 `.product-card/.product-hero/.product-info/.product-thumb` internal 規則，屬 frozen legacy。

狀態：**AUTHORITY CUTOVER COMPLETE / LEGACY PHYSICAL REMOVAL PENDING / WAITING MULTI-SIZE + REAL-DEVICE REGRESSION**

處理方式：舊 `page.css` Product Card internal 規則只可刪除，不可再擴張；Adaptive 只提供／消費 row token，不得重新接管 card internal geometry。

## 7. Authority Cleanup 順序

1. V1 Cart legacy physical removal；不得重畫 1920。
2. V2 Drink Card legacy physical removal。
3. V9 Product Card legacy physical removal；保持卡 footprint，驗證 1920／1280 圖片完整顯示及文字可讀。
4. 做 1920 Cart／Drink Card／Product Card／Pairing Modal 實機回歸。
5. 做 1280×800 及其餘主要尺寸回歸。
6. V6／V7 只做回歸，不再重新設計。

V3／V4／V5／V6／V7／V8 已完成架構責任收口；V1／V2／V9 已完成新 Authority cutover，但 legacy CSS 尚未物理移除，因此不得標記為完全 CLEARED。V6／V7／V9 尚未取得實機回歸通過，不得寫成最終驗收完成。

## 8. 修改前 Authority Gate

每次修改前必須回答：

1. 今次改嘅係 Composition、DOM、Visual、State、Domain 定 Token？
2. 呢種決策嘅唯一 Authority 係邊個？
3. 有冇另一個檔案同時修改同一 Property／State／Action？
4. Adaptive 係咪只提供 Token？
5. Domain 係咪唯一 Business Truth？
6. 會唔會碰已封板 1920？如果會，係咪問題根因？

只要發現第二 Authority：先完成 Consolidation，禁止疊新 Fix。

## 9. Definition of Done

一個 Component 只有同時符合以下先可以叫完成：

- Composition responsibility 清楚；
- DOM Authority 清楚；
- Visual Authority 清楚；
- State／Domain truth source 唯一；
- Adaptive 只提供 Token；
- 無永久 Override／Patch／MutationObserver 補同一 State；
- 同一 Property 不在兩個 Authority Layer 重複定義；
- Code Map / MFKG / Ownership Registry 一致；
- Contract Test 可以阻止第二 Authority 再出現；
- 1920 已封板畫面行為保持不變，除非本次問題根因直接要求修改。
