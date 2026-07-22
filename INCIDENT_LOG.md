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

## I-012｜V1.3 功能互相綁定及產品區不能操作
### 根因
舊補丁將快捷飲品、快捷補選及浮層 dirty state 混合處理；Modal 狀態亦可能殘留，令產品區被透明層阻擋。
### 修正
重建單一 Modal state、獨立快捷設定、只對未套用業務修改作離開確認，並由每次 Render 根據當前 Modal 唯一生成／移除 Scrim。

## I-013｜Link Up 標記整行導致餘量消失
### 根因
部分配對時將整個購物車行標記為已組合。
### 修正
按配對數量拆分已組合行與剩餘單點行。

## I-014｜order-v1-29 點單頁白屏
### 根因
底部導航首次渲染引用 `pendingCount`，但該變數只在頂部狀態欄函數內建立；瀏覽器在第一個畫面完成前拋出 `ReferenceError`。
### 修正
待處理數量由 `pendingOrderCount` 共用函數統一提供；首次渲染回歸及執行式啟動驗證加入交付檢查。外層載入器收到子頁執行錯誤時會顯示後備畫面，避免再次無提示白屏。
