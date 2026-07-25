# More Fun／磨飯 SMT｜Health Seal V1

日期：2026-07-25
工作分支：`smt-responsive-adaptive-v1`
回滾備份：`smt-responsive-adaptive-v1-healthseal-backup-20260725`

## 封板目的

在不造成任何功能障礙、不阻礙正常運行、不影響實際操作的前提下，將已驗收的自適應、Global App Shell、交易鎖、每日開工及頁面快捷功能整理進正式內核；停止補丁式堆疊。

## 已驗收範圍

- 點單頁自適應
- 訂單頁自適應
- 堂食頁自適應
- 售罄頁自適應
- 更多頁自適應
- 結帳 Transaction Layer
- Global Status Bar
- Global Bottom Navigation
- 每日登入／開工現金
- 新營業日乾淨購物車／交易工作區
- 各頁原有狀態欄快捷功能回歸至 Global Status Bar
- 多尺寸驗收入口

## 正式內核結構

### Global App Shell

`index.html` + `app-loader.js` + `app-shell.css`

負責：
- 全域狀態欄
- 全域導航欄
- 主頁持久化 View
- 順序背景預載
- Checkout 交易鎖
- Modal／Overlay Shell 協調
- Responsive Profile 傳遞

### Shared Core

- `shared/responsive.js`
- `shared/responsive.css`
- `shared/responsive-pages.css`
- `shared/adaptive-layout.css`
- `shared/adaptive-layout.js`
- `shared/page-base.css`
- `shared/status-actions.js`
- `shared/page-bridge.js`
- 其他 shared domain/runtime/store modules

`shared/status-actions.js` 為正式 Shell 核心模組，負責將目前頁面既有快捷操作映射到 Global Status Bar；不得另建第二套快捷功能業務邏輯。

## 已清理技術債

1. 移除根目錄臨時 `status-actions-proxy.js`。
2. 狀態欄快捷功能收編至 `shared/status-actions.js`。
3. Global Shell 子頁模式由 runtime JS 注入 CSS，改為 `shared/page-base.css` 內核規則。
4. `app-loader.js` 不再建立 runtime compatibility style。
5. 保留既有子頁功能實作，Global Shell 只負責代理操作，避免重寫五套業務邏輯。

## 不可破壞規則

1. 禁止用新 overlay／override 檔案壓住問題。
2. 禁止新增 restore stylesheet、patch stylesheet、hotfix stylesheet 作永久方案。
3. 禁止新增大量 `!important` 解決尺寸問題。
4. 禁止將 1920 畫面整體 scale 成其他尺寸。
5. 禁止重新建立每頁獨立底部導航。
6. 禁止重新建立每頁獨立 Global Status Bar。
7. 頁面專屬快捷操作必須沿用原有 action/event/domain 邏輯，由 Shared Status Actions 代理。
8. Checkout 必須凌駕主導航；交易期間主導航不可退出交易。
9. 新營業日開工時交易工作區必須乾淨；不得清除歷史訂單、設定、打印設定及日結資料。
10. 所有新增功能修改前後均需通過 Responsive QA + 1920 Baseline Stress Test。

## Responsive Lock

支援主要橫屏：
- 1920×1080
- 1600×900
- 1440×900
- 1366×768
- 1280×800

核心原則：按實際可用區域計算，不以整頁縮放模擬響應式。

## 功能修改階段規則

健康封板後，下一階段只處理：
- 功能增加
- 功能刪減
- 商業邏輯修正
- 營運流程完善
- 真實 API／資料接入

除非功能本身需要，禁止再次重構已驗收 UI／Responsive／Global Shell 架構。

## 回滾原則

任何新修改造成：
- 點單中斷
- 導航失效
- Checkout 可誤退出
- 購物車資料異常
- 開工狀態異常
- Overlay 爆框
- 任一支援尺寸失真

必須停止繼續疊修，先定位根因；必要時回到本 Health Seal 基準或備份分支。
