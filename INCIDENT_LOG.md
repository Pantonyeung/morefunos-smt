# INCIDENT LOG

## 已消除

- `pages/order/index.html` 內嵌 Script 攔截「快捷 ON」造成操作未完成。
- Runtime 注入 Anchored Card 與 Page CSS 雙重定位衝突。
- 通用 Side Card 固定 `right:0`，導致補選卡離開購物籃。
- 三個飲品位置各自覆蓋尺寸。
- 箭嘴被 `overflow:auto`／錯誤定位規則隱藏。

## 仍需實機驗證

- iPhone Safari 橫屏各尺寸。
- 卡片靠近畫面邊界時箭嘴位置。
- T2S WebView。
- 實際產品圖片載入速度。

## I-011｜浮卡後方產品仍可操作
根因：部分 Side Card／Edit Card 無統一 Scrim。修正：加入全畫面磨砂阻擋層、空白退出及 dirty-state 確認。
