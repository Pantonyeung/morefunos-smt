# More Fun／磨飯 SMT V16.1.2｜完整整合版

## 基礎
本版以 V16.1 五 Root 優化重建為完整基礎，再合併 V16.1.1 iPad Safari 橫屏判斷修正。

## V16.1 已保留的全部優化
- 單一 delegated event 入口，避免重複 Listener。
- 單一 Overlay／Modal Root，避免透明 Scrim 殘留。
- 完整產品詳情卡：68% 選項區＋32% 數量／價格／確認區。
- 新增、修改、刪除產品流程。
- Required、Optional、Link Up 分離。
- 單點飯團未選小食不當作欠項。
- 飯團套餐的小食及飲品為必選。
- 便當、沙律、薯角餐不錯誤要求小食。
- 快捷飲品、快捷補選及圖片顯示設定互相獨立。
- 飲品卡統一由同一元件產生。
- 待處理面板支援展開至半屏及獨立滾動。
- 顯示設定即時生效，不產生未保存提示。
- 產品詳情有未套用修改時，離開前顯示確認。
- structuredClone 提供 JSON fallback。
- 1920×1080 等比 Fit，支援 iPhone 橫屏與 T2S。

## V16.1.1 橫屏修正
- 不再只依賴 CSS `orientation` media query。
- 使用 `visualViewport`、`innerWidth`、`innerHeight` 判斷實際可視區比例。
- 只有實際高度大於寬度時才顯示橫屏提示。
- 監聽 resize、orientationchange、visualViewport resize／scroll。
- Safari 返回前台時重新檢查方向和重新 Fit。

## V16.1.2 整合修正
- 恢復完整 CHANGELOG、MANIFEST 和 SHA256SUMS。
- 所有 Root 引用統一更新 Cache Busting：
  `v16-5root-optimized-1.1.2`
- 確認沒有重新加入舊 Runtime。

## 執行結構
只保留：
- index.html
- smt-app.js
- smt-app.css
- smt-data.js
- smt-api-client.js

明確不包含：
- /pages/
- /shared/
- app-loader.js
- app-shell.css
- service-worker.js
- manifest.webmanifest
