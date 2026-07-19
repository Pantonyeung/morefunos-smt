# More Fun SMT V16 前後整合重寫設計

日期：2026-07-19
狀態：已由使用者以「開始」批准執行
目標分支：`feat/smt-master-v1`

## 目標

以 V16 前已確認的點單閉環為產品基準，吸收 V16 後已確認的架構與穩定性修正，重新輸出完整文件；停止 Hotfix／Patch 疊加。

## 權威次序

1. 使用者最新明確指示。
2. Master UI／Logic Lock 與 Slide Master Lock。
3. Point Order UI／Logic Lock。
4. Master Handoff Package 技術治理。
5. V16 前穩定實作作行為參考。
6. V16 後 Patch 只提取已確認改動。

## 架構

Root 維持 5 個文件，負責 Shell、Router、固定畫布、PWA 與錯誤 UI。Shared 維持最多 5 個文件，統一 Runtime、Store、Components、Base CSS、Bridge。Order Page 維持最多 5 個文件，完整擁有 Cart、Required、Pool／Link Up、Draft、點單行為與頁面 CSS。

## 核心行為

- 固定五項導航：點單、訂單、堂食、售罄、更多。
- Workspace 支援 25/75、30/70、35/65，預設 25/75。
- 商品卡全卡直接加入，`⋯` 進入設定；售罄留位灰化。
- 分類預設 2×7，Search 最後可見，More 處理溢出。
- CartItem 使用穩定 `id`、`sequence`、`signature`；重新繪製與顯示設定不可清空。
- Required 主畫面顯示收據式摘要，未完成阻塞結帳。
- Pool／Link Up 自動完成可確定配對，只保留人工決定。
- 快捷飲品、修改卡、補選卡共用 Drink Card。
- 暫存與取單互斥，LocalStorage schema 版本化。
- Anchored Card 必須由明確 anchorElement 計算位置與箭嘴。
- iPhone 直屏顯示 Gate；畫布只在 bootstrap、pageshow、真正 orientation change 重算。
- Android 9 WebView 不依賴 structuredClone。

## 資料與錯誤處理

Store 提供 schema migration、safe read、atomic-style write 與損壞資料 fallback。Runtime 提供 queueRender、safeClone、toast 與 error boundary。任何 UI 錯誤不得刪除 Cart 或 Draft。

## 測試與 Gate

靜態測試：HTML 路徑、`node --check`、UTF-8、禁用 MutationObserver、禁用一般 resize fit、禁用文字 Action、禁用 productOverrides、禁用 page-vXX/hotfix/patch 正式引用。

行為測試：Cart reload 保留、顯示設定不清 Cart、Required 阻塞結帳、暫存／取單互斥、Drink Card 共用、Anchored Card 有來源箭嘴、清空只確認一次。

實機 Gate：iPhone 直／橫屏、Safari 地址欄、T2S 1920×1080、Android 9 WebView。

## 交付

- GitHub 母版完整文件。
- Root／Shared／Order 三個手機平面上載 ZIP。
- Full Backup ZIP。
- Manifest、SHA-256、Changelog、Rollback 說明。
