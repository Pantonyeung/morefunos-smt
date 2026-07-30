# SMT Runtime Authority Handoff V1.0

狀態：LOCKED / CURRENT
更新：2026-07-30 12:58 HKT
分支：`smt-functional-completeness-v1`

## 本次新鎖定決策

SMT 不再只係 Admin Published 的被動讀取端。SMT 是鋪頭日常營運主操作端，必須直接讀寫 Firebase Operations Runtime。

## 資料責任

### Published
- 唯一 Authority：Admin。
- SMT 只讀。
- 包括商品、價格、分類、套餐、選項、圖片、文案及正式菜單結構。

### Runtime
- 唯一 Authority：Firebase `morefun/operations/runtime/v1`。
- SMT、SMM、Admin 可按身份讀寫。
- Customer 只讀公開投影。
- SMT 日常修改售罄、營業狀態、等候時間、高峰模式等，必須即時同步到其他端口，不依賴 Admin 開啟。

## 唯一角色模型

只允許兩個角色：

### staff
正常鋪頭操作身份：
- 訂單處理；
- 打印及設備操作；
- 商品售罄／恢復；
- 紫米售罄；
- 營業／休息；
- 暫停／恢復接單；
- 等候時間；
- 高峰模式；
- 今日臨時公告。

### owner
需要修改正式資料或敏感設定時使用：
- 商品、價格、分類、套餐、選項；
- 發佈、永久停售、回滾；
- 帳戶、裝置及系統設定；
- 完整 Audit。

禁止新增 manager、viewer 或其他角色。

## SMT 寫入契約

每次 Runtime 更新至少包含：

```json
{
  "updatedAt": 0,
  "updatedBy": "firebase-uid",
  "role": "staff",
  "source": "smt",
  "revision": 1
}
```

必須使用 transaction／revision 保護，禁止舊狀態覆蓋新狀態。

## 目標路徑

```text
morefun/operations/runtime/v1/
  store
  availability
  waitTime
  notices
  mode
  devices
```

SMT 不得直接寫入：

```text
morefun/admin/staging/v1/draft
morefun/admin/staging/v1/published
morefun/admin/staging/v1/meta
morefun/admin/staging/v1/audit
```

## 公開同步

可信同步程序將 Operations Runtime 投影到：

```text
morefun/public/customer/v1/runtime
```

Customer 只讀；SMT 不得將 owner credential 或任何 privileged secret 放入前端。

## 每日恢復

每日 05:00 由可信後端自動清除 temporary soldOut，保留 permanentStop。SMT 不需要保持開啟。

## 實作下一步

1. 建立 SMT Firebase Auth staff session。
2. 建立 Runtime Repository／Adapter。
3. 將售罄、營業、等候時間、高峰模式由本機狀態遷移到 Operations Runtime。
4. 加入離線 queue、idempotency、revision conflict handling。
5. 驗證 SMT -> Firebase -> Customer／SMM／Admin 的即時同步。
6. 更新 MFKG、Decision Ledger、Change Impact、QA 與接手文件。

## 不變安全鎖

- SMT 軟件完成狀態不等於 Runtime 跨端整合完成。
- SUNMI printer validation、OTA install、production signing dry run 仍屬剩餘實機工作。
- 不得用第二套 Runtime state、Observer 或 compatibility patch 繞過正式 Authority。
