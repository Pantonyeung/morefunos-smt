# SMT Responsive Lock

## 永久基準
- `smt-responsive-from-1920-baseline` 為乾淨 1920 基準，禁止任何功能、測試或樣式提交。

## 唯一開發原則
- 所有 SMT 共用一套 UI、商業邏輯、元件及自適應系統。
- 支援並持續驗收：1920×1080、1600×900、1440×900、1366×768、1280×800。
- 所有新 UI 修改必須一次通過全部主要尺寸。

## 禁止事項
- 禁止新增 `t2s-1280.css`、`t2s-restore.css` 或任何單一尺寸 override stylesheet。
- 禁止 Loader 動態注入尺寸修正 CSS。
- 禁止恢復固定 `width=1920` viewport。
- 禁止用大量 `!important`、z-index 疊層或固定高度補丁壓住版面問題。

## 修改方式
- 尺寸及密度規則集中於 `shared/responsive.js` 與 `shared/responsive.css`。
- 點單、結帳、訂單、堂食、售罄、更多頁只讀取中央 profile/tokens。
- 若新增新頁面，必須接入同一套中央 responsive profile。

## 驗收門檻
每次共用 UI 修改至少必須通過：
1. Responsive profile tests。
2. 六個主要頁面多尺寸 tests。
3. Architecture guard tests。
4. Responsive stress matrix。
5. 1920 基準強力壓力回歸。

任何一項失敗，禁止視為可驗收版本。
