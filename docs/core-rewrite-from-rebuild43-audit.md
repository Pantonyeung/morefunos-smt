# SMT T2S 1280×800｜rebuild.43 Core Rewrite Audit

## Branch

`core-rewrite-from-rebuild43-t2s`

## Source baseline

視覺及功能基準：`SMT-T2s-1280x800` / `rebuild.42–43`。

本分支目標不是重新設計，而是把 rebuild.42/43 內已驗收的視覺與互動效果，從補丁／外掛／loader 注入形式，重寫回各頁原生內核。

## Hard rules

1. 不改已驗收畫面細節。
2. 不使用 `app-loader.js` 注入頁面 CSS 或 JS。
3. 不使用外掛式臨時 CSS 壓住錯誤。
4. 不新增大量 `!important`。
5. 不使用 1920×1080 版面再縮放成 1280×800。
6. 每次只提交有改動的文件。
7. 每頁完成後先驗收，再推下一頁。
8. 所有 page entry 必須使用 `width=1280` viewport。
9. 所有 page root 必須在 `shared/page-base.css` 以 `--t2s-width:1280px` / `--t2s-height:800px` 鎖定。

## Patch sources found in rebuild.43

### 1. Shell / app-loader

`app-loader.js` 同時負責：

- 1280×800 stage fitting
- iframe route loading
- child page ready detection
- retry loading
- runtime error display

處理方式：

- T2S viewport fitting 已拆入 `shared/t2s-viewport-core.js`
- `app-loader.js` 只保留 shell orchestration
- 不再把視覺修正塞入 loader

### 2. Shared page base

`shared/page-base.css` 原本仍有 1920px root。已改為唯一 T2S root：

- `--t2s-width: 1280px`
- `--t2s-height: 800px`
- `html/body/#app/.app` 全部鎖 1280×800

### 3. Page entries

所有入口已改為 `width=1280`：

- `pages/order/index.html`
- `pages/checkout/index.html`
- `pages/orders/index.html`
- `pages/dine/index.html`
- `pages/soldout/index.html`
- `pages/more/index.html`

### 4. Removed external patch stylesheets

已合併或移除以下外掛式 CSS：

- `pages/dine/page-v21.css`
- `pages/soldout/soldout-enhancements.css`
- `pages/checkout/channel-payment.css`

### 5. Order page CSS

`pages/order/t2s-1280.css` 仍含有大量壓縮規則及部分 `!important`。這些是 rebuild.42/43 近似正確畫面的來源，但目前仍屬需要整理的頁內 T2S layer。

處理方式：

- `html/body/#app` 已改為直接使用 `--t2s-width` / `--t2s-height`。
- 彈窗最大寬高已由 `100vw/100vh` 改為 `--t2s-width` / `--order-popover-max-height`。
- 不再依賴 1920 或瀏覽器 viewport 作為頁內排版基準。
- 後續仍要逐段拆成清楚結構：cart / category / product-card / quick-drinks / modal / combo / completion。
- 後續逐步移除不必要 `!important`，但不得改變 rebuild.42/43 視覺結果。

### 6. Order page JS modal logic

`pages/order/page.js` 內有已驗收互動：

- 指定配對
- 自動組合
- 拆開套餐
- 飲品補選
- 右手操作彈窗
- anchor popover positioning

後續處理方式：

- 不重做流程
- 只把臨時狀態、互相遮蓋、指向三角、嵌套 confirm 彈窗，整理成正式 modal manager

### 7. Checkout page

`pages/checkout/page.css` 已是 1280×800 固定頁，但結帳頁仍需按參考圖正式重排：

- 左：訂單詳情
- 右：來源、付款方式、金額結算、鍵盤、備註、固定確認結帳
- 移除手動「磨飯優惠券」入口，優惠券由系統自動計算

## Migration log

### core-rewrite.1

- 新增：`shared/t2s-viewport-core.js`
- 修改：`app-loader.js`
- 修改：`index.html`

### core-rewrite.2

- 鎖定 `shared/page-base.css` 為 1280×800 root。
- 改所有 page entry viewport 為 1280。
- 重建 `pages/orders/page.css` 為 1280×800 原生布局。

### core-rewrite.3

- 合併堂食補丁 CSS 入 `pages/dine/page.css`。
- 合併售罄補丁 CSS 入 `pages/soldout/page.css`。
- 移除結帳外掛付款 CSS，改由 `pages/checkout/page.css` 承接。

### core-rewrite.4

- 全部 entry cache 統一到 `smt-t2s-1280x800-core-rewrite.4`。
- 確保所有頁面入口仍然維持 `width=1280`。
- `pages/order/t2s-1280.css` 已錨定至原生 T2S canvas，不再用 `100vw/100vh` 作彈窗尺寸基準。
- 下一步：整理 `pages/more/page.css` 與點單頁剩餘 `!important`。