# 磨飯 SMT 1280×800 原生重建 AI 工作入口

本分支為 SMT 1280×800 原生重建專用分支。

所有 AI、Work 模式及程式代理在分析或修改前，必須依次閱讀：

1. `docs/rebuild-1280x800/MoreFun_SMT_1280x800_Rebuild_Master_Package_V1.0.txt`
2. `SMT_AI_START_HERE.md`（只作舊系統背景與功能證據）
3. `SMT_CONTEXT_MIN.md`（只作舊系統背景與功能證據）
4. 與任務相關的 `docs/ai-context/SMT_CODE_MAP.md` 章節
5. `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`（只在不與 Master Package 衝突時作補充）

## 真相優先次序

1. 產品負責人在目前對話的最新明確確認。
2. `docs/rebuild-1280x800/MoreFun_SMT_1280x800_Rebuild_Master_Package_V1.0.txt`。
3. Master Package 明確指定的 Source B rebuild39 1280×800 已確認視覺／操作證據。
4. Source A 已鎖定 SMT V1.0 功能／商業邏輯。
5. 舊 Decision、舊 Design Lock、舊程式、舊效果圖及舊 log，只作補充證據，不得推翻以上資料。

## 本分支硬性工程規則

- 唯一主尺寸：Sunmi T2S 橫屏 1280×800。
- 禁止以 1920×1080 固定畫布縮放成 1280×800。
- 禁止直接沿用 rebuild39 的補丁式底層；只保留已確認畫面及操作規格。
- 禁止 Loader 注入 page CSS。
- 禁止跨頁 CSS 控制 page-specific layout。
- 禁止用大量 `!important`、hardcoded positioning、z-index 疊壓、absolute positioning 掩蓋結構問題。
- 一區一 owner；Shared 只提供 token／utility／共用基礎元件，不控制子頁 layout。
- 未鎖定 px、比例、modal 尺寸不得自行猜；必須量度 rebuild39 或由產品負責人確認。
- 功能不得因 1280×800 重建而刪減。
- 必須依 Master Package Gate 次序重建，一頁一封板。
- 公網 Web 及 Sunmi T2S 實機驗收完成前，不得封裝 APK／Kiosk 正式版。

## 目前工作方向

第一階段只建立乾淨原生 1280×800 Shell 及 rebuild39 screenshot atlas／量度基準；不要先用 CSS 修補舊頁。

## 驗證

舊測試可作功能回歸參考，但不得因舊測試通過而判定 1280×800 新架構已驗收。

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```
