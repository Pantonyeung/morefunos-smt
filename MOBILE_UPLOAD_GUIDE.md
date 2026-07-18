# 磨飯 SMT｜iPhone 手機更新及驗收

## 固定原則

- SUNMI T2s 主畫布固定為 `1920×1080`。
- iPhone 橫屏只會等比例縮小整個畫布。
- 不會改左右欄比例、分類格數、按鈕次序或排版。
- iPhone 左右出現黑邊屬正常驗收結果。

## Page Folder

- 點單：`pages/order/`
- 結帳：`pages/checkout/`
- 啟動：`pages/boot/`
- 共用橋接：`shared/`
- 根目錄 Loader：只在架構或比例改動時更新。

## iPhone 上載

1. 在 GitHub App／Safari 打開 Preview branch。
2. 進入要更新的 Page Folder，例如 `pages/order/`。
3. 只覆蓋該資料夾內的 `index.html`、`page.css`、`page-data.js`、`page.js`、`page-contract.json`。
4. Commit 到 Preview branch。
5. 等 Cloudflare Pages Preview 完成部署。
6. Safari 開啟 Preview 網址，在網址後加：
   - `#/order`
   - `#/checkout`
   - `#/boot`
7. 將 iPhone 轉為橫屏；左右黑邊可以接受，但整個 T2 畫面必須完整可見。

## 手機驗收

- 點單頁：左購物車／右商品區比例不變；分類保持 7×2；底部五項導航完整。
- 結帳頁：34／66 雙欄；五個渠道填滿一行；六個付款方式填滿一行；不顯示底部導航。
- 快捷金額：剛好、$20、$50、$100、$500；不可出現 $10。
- iPhone 黑邊只可出現在畫布外，不可裁走畫布內容。
