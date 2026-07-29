# SMM Source Inventory｜G0 Initial Audit V1.0

狀態：IN PROGRESS
日期：2026-07-29
來源：`Pantonyeung/morefunos-smm` / `feat/smm-mobile-v1`
目標 Authority：`Pantonyeung/morefunos-smt` / `smt-functional-completeness-v1`

## 分類標準

- `KEEP`：可直接保留為 mobile-specific asset／設定。
- `MERGE`：可遷移到 SMT mobile profile，但必須接 Shared Core。
- `REWRITE`：概念可保留，但現有實作違反 Authority／Business Rule／Data Contract。
- `DROP`：假資料、重複核心、錯誤流程、補丁或不應進入正式 Runtime。
- `ARCHIVE`：只保留作歷史比對。

## 第一批逐檔盤點

| 檔案 | 判定 | 原因 | 目標處理 |
|---|---|---|---|
| `README.md` | ARCHIVE | 已改為 Migration Source 說明；不再是產品規格 Authority | 保留作 repository gate |
| `index.html` | MERGE | 有正確 mobile viewport、manifest、standalone PWA 入口；但品牌與 runtime 名稱仍是獨立 SMM，並直接載入獨立 app | 抽出 mobile profile shell 入口；正式 route 由 SMT Shell／Profile Resolver 管理 |
| `manifest.webmanifest` | MERGE | portrait／standalone／zh-HK 可沿用；名稱與 scope 仍把 SMM 當獨立 App | 改為 SMT Mobile Profile manifest／安裝入口，不建立第二個產品身份 |
| `sw-v2.js` | REWRITE | 只有 cache-first 靜態快取；沒有版本協議、更新 gate、API freshness、offline mutation queue、回滾與資料安全 | 併入 SMT Web Platform Service Worker；實作受控 cache／release／offline queue contract |
| `app-v2.js` | DROP + REWRITE | 單檔內同時建立 UI、假 Catalog、Cart、Pricing、Order、Dine、Payment、Report、Print Job 與登入；形成完整第二套核心 | UI Composition 可作視覺參考；所有 state／domain／data 必須刪除並改接 SMT Shared Core |
| `styles.css` | 待檢查 | 可能含 mobile primitive／舊版 visual | 下一批檢查 selector、重複 visual authority、可重用 token |
| `styles-v2.css` | 待檢查 | 可能含現行 mobile composition | 下一批檢查並只保留 profile-owned composition |

## 已確認的重大衝突

### C1｜第二套核心

`app-v2.js` 直接定義：

- `state.cart`
- `products`
- `orders`
- `tables`
- Cart total／quantity
- Checkout source／payment
- Sold-out state
- Report range
- Print job state

以上全部與 D-053 衝突，禁止遷移成正式邏輯。

### C2｜假資料與假成功

現有 app 內置餐牌、訂單、枱位及打印工作；登入亦預填固定帳號密碼。這些只屬 prototype，不可進入 Runtime。

### C3｜違反已鎖定 Business Rule

現有 prototype 包含：

- `待取餐` 狀態；但 SMT 已鎖定不設「製作中／待取餐」。
- 堂食枱位有 `預約`、`清潔中`；但 SMT 已鎖定只分未使用／使用中。
- 商品加配價格、飯量及外賣盒費由 UI 自行 hardcode。
- Print Job 顯示 `成功／重試中`，但沒有 Android Host 真實結果證據。
- 登入使用固定 `morefun/morefun` prototype value。

以上一律列為 `DROP`，不得帶入 Shared Core。

## 第一批可保留資產

目前只確認以下概念可保留：

1. Mobile portrait viewport。
2. PWA standalone 安裝入口。
3. 手機底部導覽的 Composition 概念。
4. 手機工作台／點單／訂單／堂食／更多的資訊架構參考。
5. Mobile 端顯示 SMT 主機與打印服務狀態的需求。

保留只代表需求／UI 參考，不代表保留現有 Domain 實作。

## 下一批工作

1. 檢查 `styles.css`、`styles-v2.css`。
2. 列出 `app-v2.js` 全部 View／Action，映射到現有 SMT Page／Domain。
3. 建立 `SMM_TO_SMT_FEATURE_MAPPING_V1.0.md`。
4. 把可保留 mobile Composition 寫入 Component Ownership Registry。
5. 定義第一條可落地 vertical slice：`mobile login/bootstrap → Shared Catalog → Shared Cart → remote Print Job`。
