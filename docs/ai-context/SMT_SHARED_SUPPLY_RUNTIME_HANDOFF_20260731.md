# SMT Shared Supply Runtime｜接手與進度｜2026-07-31

> 狀態：CURRENT CHECKPOINT / SOURCE IMPLEMENTED / CONTRACTS COMMITTED / DEPLOYMENT AND DEVICE ACCEPTANCE PENDING  
> Current Authority：`smt-main-candidate-v1`／PR #34  
> 適用：SMT Register Profile、SMM Mobile Profile、Admin Worker、Customer Public Runtime

## 1. 需求

- SMT、SMM 都可以設定「今日售罄／暫停供應／恢復供應」。
- SMM 不建立第二套 Core；只係 SMT Shared Application 嘅 Mobile Profile。
- 斷線期間售罄操作先保存本機並排隊，重連及重新登入後同步。
- Customer 讀取同一份 operational availability；無法連線時繼續使用最近一份完整有效本機菜單。

## 2. Authority／責任

| 決策 | 唯一 Authority |
|---|---|
| 售罄操作 UI | `pages/soldout/page.js` |
| 本機供應狀態 | `SUPPLY_STORAGE_KEY` |
| 跨端同步／Queue／Staff Session | `shared/supply-runtime.js` |
| Shell 登入與離線降級 | `shell-startup.js` |
| 重連登入入口 | `shared/supply-session-control.js` |
| Page storage refresh | `shared/supply-page-bridge.js` |
| Server operational truth | Firebase `morefun/runtime/operations/v1/availability` |
| Staff API | Admin Worker `/v1/staff/availability` |
| Customer projection | Admin Worker Public Runtime overlay |

禁止：MutationObserver、DOM 掃描、`Storage.prototype` patch、獨立 SMM Domain、Admin publish 覆蓋 operational availability。

## 3. 正式資料流

```text
SMT Register / SMM Mobile
→ pages/soldout local update
→ writeJSON(SUPPLY_STORAGE_KEY)
→ morefun:critical-storage-written
→ Shell Supply Runtime pending queue
→ SMT same-origin Pages Function
→ Admin Worker Staff API
→ Firebase operational availability
→ Customer Public Runtime overlay
```

## 4. Current Source Implementation

### Shared Core
- `shared/supply-runtime.js`
  - Staff Session；
  - local-first state；
  - pending queue；
  - flush／refresh／15 秒 polling；
  - `available|soldout|paused`；
  - pending local state overlay，防止 remote refresh 清除未同步改動。

### Same-origin proxy
- `functions/_shared/operations-proxy.js`
- `functions/v1/staff/login.js`
- `functions/v1/staff/availability.js`

### Shell integration
- `shell-startup.js`：本機帳密通過但網絡失敗時仍可開工；401／403 不可被 offline fallback 掩蓋。
- `shared/supply-session-control.js`：網絡恢復後明確重新登入；不保存密碼。
- Shell 顯示：供應同步／同步中／離線待同步／本機模式。

### Register＋Mobile Profile
- Register：原有 `pages/soldout`。
- Mobile：`?profile=mobile#/soldout`，同一 Page／Domain，只改 Shell／Page composition。
- `mobile-profile-bootstrap.js`、`mobile-profile.css`、`pages/soldout/responsive.css`。

### Page update
- `shared/supply-page-bridge.js`。
- Order／Soldout iframe 收到 `SUPPLY_STORAGE_KEY` 變更後更新。

## 5. Targeted Contracts

- `tests/shared-supply-runtime.test.mjs`
  - array／keyed object normalization；
  - soldout／paused／available diff；
  - Staff Session flush；
  - remote refresh；
  - offline queue retention。
- `tests/shared-supply-runtime-integration.test.mjs`
  - Shell explicit storage capture；
  - no MutationObserver／Storage patch；
  - Register／Mobile 同一 Soldout route；
  - same-origin Pages Functions；
  - Order／Soldout shared state refresh。

> 測試已提交，但本 checkpoint 未取得同最新 head 對齊嘅實際執行輸出。不得寫 Automated PASS。

## 6. 踩坑與成功方案

### K1｜舊分支有功能，不代表 Current Authority 完成
第一版落喺已被取代嘅 `feat/smt-order-page-v1`。

**成功方案：**先讀中央 Registry、AGENTS、PR head；乾淨遷入 `smt-main-candidate-v1`。

### K2｜Keyed localStorage 丟失產品 ID
`{F4:{status:'soldout'}}` 用 `Object.values()` 後會失去 `F4`。

**成功方案：**正規化 object 時使用 entries，將 key 注入 `productId`。

### K3｜首次離線登入無 Staff token
安全上不可保存密碼，所以恢復網絡後不能自動換 token。

**成功方案：**保留本機 Queue，Shell status 提供重新登入入口；登入成功後 flush。

### K4｜CORS／Preview origin
Browser 直接跨網域呼叫 Admin Worker 會令 Preview origin 成為故障點。

**成功方案：**SMT Pages Function 同源 proxy；身份驗證仍由 Worker 執行。

### K5｜第二套 SMM Core
另建 Mobile Soldout Domain 會造成狀態與 Business Rule 雙真相。

**成功方案：**Mobile Profile 使用同一 `pages/soldout`、同一 Supply Runtime，只做 profile composition。

### K6｜Source ≠ Acceptance
程式存在、測試檔存在、Cloudflare build success 都唔等於跨裝置閉環成功。

**成功方案：**固定分開 Source／Executed Tests／Deployment／Browser／Device／Production Gate。

## 7. 未完成 Gate

1. 執行 targeted tests，保存 commit-aligned output。
2. Admin Worker latest deployment。
3. SMT Pages Functions latest deployment。
4. SMT 設售罄 → SMM 收到 → Customer 不可下單。
5. SMM 恢復 → SMT／Customer 同步。
6. 斷網操作保留本機，重連＋重新登入後 flush。
7. iPhone／Android Mobile Profile 觸控與排版驗收。
8. 香港時間 05:00 跨日實測。

## 8. 回滾

- 回到本次 Supply Runtime 變更前 PR #34 head。
- 不刪 `SUPPLY_STORAGE_KEY`，避免丟失營運狀態。
- 停用 Pages Function proxy時，保留 Firebase operational availability。

## 9. 下一步唯一優先

取得最新 Admin／SMT／Customer targeted execution evidence，然後部署 staging 做 SMT → SMM → Customer 雙向供應狀態閉環。
