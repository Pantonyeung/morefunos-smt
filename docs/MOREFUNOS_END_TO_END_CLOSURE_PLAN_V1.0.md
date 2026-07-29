# More FunOS｜端到端閉環計劃 V1.0

狀態：CURRENT／跨端最高接手文件
日期：2026-07-29
適用：SMT／SMT Mobile UI（原 SMM）／Admin／Customer／Backend／Printing

## 1. 最高決定｜SMM 合併 SMT

SMM 不再作獨立系統發展。

SMM 正式合併落 SMT，兩者屬同一個 Application、同一套 Domain、State、Business Rule、Cart、Pricing、Checkout、Order、Payment、Sync、Audit、Permission、Recovery 及 API Contract。

差異只限：

- SMT Register UI：收銀機／大屏 UI、Android Host、實體打印、硬件 Bridge、Kiosk。
- SMT Mobile UI：手機 UI、手機 Lifecycle、遙距操作；不直接連實體打印機。

SMT Mobile UI 發出打印要求時，只建立同一套 Print Job／Command，傳送到 SMT Android Host；Android Host 在後台靜默執行打印，並回傳 `printed / failed / retry` 狀態。

禁止：

- 建立第二套 Mobile 商業邏輯。
- 複製 SMT 後獨立維護。
- Mobile UI 自行重新計價、建立另一套 Cart／Checkout／Order。
- Mobile UI 直接控制實體打印機。

## 2. 目前整體狀態

More FunOS 尚未形成完整營運閉環。

主要缺口：

1. Admin Firebase Auth／Rules／Remote Read／Write 未正式驗證。
2. Customer 仍主要依賴 Apps Script／Google Sheet 舊鏈，未接統一 Runtime Snapshot。
3. SMT 正式 Order API、跨端同步、實機打印、離線恢復未完成。
4. 原 SMM 基準過期，需停止獨立發展並合併回 SMT Shared Core。
5. Google Sheet Schema 相對完整，但多數仍屬 Contract／Mirror，未等於 Runtime 已接通。

## 3. 目標閉環

```text
Admin
  → Publish
  → Firebase Published／Runtime Snapshot
  → Customer／SMT Register UI／SMT Mobile UI
```

```text
Customer／SMT
  → Order API
  → 驗價／Idempotency／派號
  → Order Authority
  → SMT Local Queue／Firebase
  → Print Jobs
  → SMT Android Host
  → 打印結果
  → Audit／Report Mirror
```

Google Sheet 只作 Ledger／Reporting／Audit Mirror，不作即時訂單 Truth Source。

## 4. 正式推進 Gate

### G0｜Authority 收口

- 鎖定 Firebase、Order Authority、Local SQLite、Google Sheet 各自角色。
- 鎖定 SMM 合併 SMT Shared Core。
- 建立跨端 Source of Truth Map。
- 更新 Decision Ledger、MFKG、Implementation Status、Code Map。

### G1｜Admin Publish 閉環

- Firebase Auth。
- Owner Account。
- `morefunRole` Custom Claims。
- Rules 部署。
- Remote Read。
- Draft Write。
- Runtime Write。
- Publish。
- Audit。
- Recovery／Rollback。

### G2｜統一 Consumer Adapter

Customer、SMT Register UI、SMT Mobile UI 共用 Published／Runtime Snapshot Contract：

- Products。
- Pricing。
- Modifier／Option Rules。
- Combo Rules。
- Sold-out。
- Announcements。
- Operating Hours。
- Feature Flags。

### G3｜Order Commit 閉環

- 後端重新計價。
- Idempotency。
- 唯一 Order ID／派號。
- Offline Queue。
- Retry。
- Sync Conflict Recovery。
- Customer 下單後 SMT 即時收到。
- `order_api_enabled` 在此 Gate 完成前保持 `false`。

### G4｜Print Closure

- 統一 Print Job Contract。
- SMT Mobile UI 只發打印訊息。
- SMT Android Host 靜默打印。
- ESC/POS／TSPL 中文、切紙、標籤。
- `printed / failed / retry / fallback` 回傳。
- 打印失敗不得改變訂單 Truth。

### G5｜Store Acceptance

必須完成真實營運驗收：

1. Admin 改價四端同步。
2. 售罄即時同步。
3. 雙擊／重試不重複建單。
4. 斷網可開單，恢復後同步。
5. Crash／Reload 可恢復。
6. 多機同時開單。
7. 50 項購物車。
8. 打印機斷線、重試、Fallback。
9. 跨日未完成訂單。
10. 日結、報表、審計可追溯。

## 5. 推進次序

1. G0 Authority 收口。
2. G1 Admin Firebase 真連線。
3. SMT Shared Core／Mobile Profile 合併。
4. G2 統一 Snapshot Adapter。
5. G3 Order API。
6. G4 Print Closure。
7. G5 實店驗收。

## 6. Evidence 規則

```text
CODE_EXISTS
→ CONTRACT_PASS
→ BROWSER_PASS
→ DEVICE_PASS
→ STORE_PASS
→ PRODUCT_LOCKED
```

任何階段不得跳級聲稱完成。

## 7. 硬規則

- 一項決策只可以有一個 Authority。
- 禁止第二套 Cart／Pricing／Checkout／Order／Print／Sync。
- SMT Register UI 與 SMT Mobile UI 只可有 UI／Device Capability 差異。
- Google Sheet 不得成為即時訂單主庫。
- 未有實機證據，不得標 Production Ready。
- 所有里程碑必須同步 GitHub、Google Drive、Jade Note。
