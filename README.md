# More Fun SMT Web Core V1.0

基於《MoreFun SMT Web UI Slide Master Lock V1.0》建立的可操作 Web Core 第一版。

> AI／Work 模式必須先讀 [`AGENTS.md`](./AGENTS.md)。只用手機或新 Chat 接力時，上載 [`SMT_AI_CONTEXT_PACK.md`](./SMT_AI_CONTEXT_PACK.md) 及最新 repository zip；毋須重新貼整段歷史對話。

## 現行狀態入口

- 一頁式現在真相：[`SMT_AI_START_HERE.md`](./SMT_AI_START_HERE.md)
- Chat 最小上下文：[`SMT_CONTEXT_MIN.md`](./SMT_CONTEXT_MIN.md)
- 程式、決策、狀態及影響圖：[`docs/ai-context/`](./docs/ai-context/)
- 完整點單功能鎖：[`docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`](./docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md)

## 2026-07-20 點單頁設計鎖

最新確認的點單頁第一層規格、Decision Log、驗收清單及效果圖位於：

`docs/design-lock-v1/`

請注意：「已實作」「自動測試通過」「實機通過」「產品最終 Lock」是不同狀態。最新壓縮狀態以 `docs/ai-context/SMT_IMPLEMENTATION_STATUS.md` 為準；不得因效果圖或程式存在而視為實機完成。

## 已實作
- 橫屏 SMT Shell、頂部全局狀態、底部五項導航
- 六套主題輪換、快速模式
- 點單、分類、搜尋、商品卡、購物車、結帳及正式成單模擬
- 新 App／Web 訂單彈窗、稍後處理、角標
- 訂單30分鐘倒數視圖
- 堂食枱位與35分鐘提示
- 今日售罄／暫停供應／恢復
- 更多頁六個營運入口、完整細節及高風險二次確認
- 本機日結、營運報表／CSV、校驗備份／恢復及系統診斷
- 五部打印機設定、四款示範格式、預覽、工作佇列、重試／改送及安卓橋接合約
- localStorage 本機狀態保存
- PWA manifest及service worker

## 未接入
- Firebase 寫入端／Admin Catalog 管理介面（公開餐牌讀取已接入）
- Room／SQLite原生層
- 安卓打印原生服務及五部實體打印機出紙驗收
- 真實付款核實、退款及雲端同步服務

以上未接入項目已保留清楚介面邊界，應以垂直切片逐步接入，不能改動已封板UI及業務規則。

## 本機預覽
```bash
python3 -m http.server 8080
```
打開 `http://localhost:8080`。
