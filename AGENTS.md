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

## 商品資料權威鎖

- 新 SMT 暫時不得引用、搬用、預填或推算任何舊商品資料。
- 禁止使用舊分類、舊產品名稱、舊價格、舊套餐內容、舊加價、舊商品代碼作正式資料。
- 商品資料唯一正式權威來源，為產品負責人之後提供的 Admin 後台資料。
- Admin 後台資料需覆蓋至少：分類、產品、價格、商品狀態、選項、套餐／組合、加價／減價、顯示順序及相關商業規則。
- 在 Admin 權威資料未提供及完成對齊前，只可使用中性假資料或結構性 placeholder 作 UI／資料結構測試；不得將 placeholder 當真實餐牌。
- 舊 SMT 商品資料只可用作程式結構或資料欄位形狀參考，不得作內容權威。
- 價格、分類及商品內容不得由 AI 依記憶、舊版本或一般常識自行補值。

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

在 Admin 權威商品資料提供前，所有商品相關畫面只建立結構、互動與資料綁定能力，不建立正式餐牌內容。

## 驗證

舊測試可作功能回歸參考，但不得因舊測試通過而判定 1280×800 新架構已驗收。

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```
