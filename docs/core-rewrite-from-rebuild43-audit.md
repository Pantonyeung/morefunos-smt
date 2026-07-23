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

### 2. Order page CSS

`pages/order/t2s-1280.css` 仍含有大量壓縮規則及部分 `!important`。這些是 rebuild.42/43 近似正確畫面的來源，但目前仍屬補丁式內核外掛。

後續處理方式：

- 逐段拆成清楚結構：cart / category / product-card / quick-drinks / modal / combo / completion
- 保留像素與視覺結果
- 逐步移除不必要 `!important`
- 所有規則留在該頁正式 CSS，不再由 loader 注入

### 3. Order page JS modal logic

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

### 4. Checkout page

`pages/checkout/page.css` 已是 1280×800 固定頁，但結帳頁仍需按參考圖正式重排：

- 左：訂單詳情
- 右：來源、付款方式、金額結算、鍵盤、備註、固定確認結帳
- 移除手動「磨飯優惠券」入口，優惠券由系統自動計算

## First migration done

- 新增：`shared/t2s-viewport-core.js`
- 修改：`app-loader.js`
- 修改：`index.html`

效果目標：不改畫面，只把 viewport fitting 從 loader 補丁層搬入 shell core。
