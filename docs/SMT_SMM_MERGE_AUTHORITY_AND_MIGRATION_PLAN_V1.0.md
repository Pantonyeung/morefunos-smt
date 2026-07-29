# More Fun／磨飯｜SMT × SMM 合併 Authority 與遷移計劃 V1.0

狀態：CURRENT / G0 AUTHORITY CLOSURE
生效日期：2026-07-29
最高決策：D-053

## 1. 最終產品定義

MoreFunOS 只保留一個正式營運 Application：`SMT`。

SMT 提供兩個 UI Profile：

- `register`：收銀機／大屏／具 Android Host 與實體硬件能力。
- `mobile`：手機／PWA／無實體打印硬件能力。

兩者不是兩個產品，不是兩個 Runtime，不是兩套 Business Logic。

## 2. 唯一 Shared Core

以下責任只可以存在一個正式 Authority：

- Catalog
- Cart
- Pricing
- Combo／Pairing
- Service Mode
- Checkout
- Order
- Payment
- Dine
- Sold-out／Supply
- Permission
- Sync
- Offline Queue
- Recovery
- Audit
- Order Identity
- Reporting Data Contract
- Print Job Contract

`register` 與 `mobile` 只可消費 Shared Core，不得複製、改寫或重新計算。

## 3. UI Profile 邊界

### register profile

可以擁有：

- 大屏 Composition
- 收銀機鍵盤／快捷操作
- Kiosk／全螢幕生命週期
- Android WebView Bridge
- 網絡打印機連接
- 錢箱／USB／LAN／裝置診斷
- 本機離線持久層
- 實體打印結果回寫

### mobile profile

可以擁有：

- 手機導覽與單手操作 Composition
- PWA install／resume／background lifecycle
- 手機尺寸 modal／drawer／bottom sheet
- 相機／QR／分享等手機能力
- 遠端建立與管理 Print Job

不得擁有：

- 第二套 Cart／Pricing／Checkout／Order Domain
- 第二套 API Contract
- 第二套 Sync／Recovery
- 直接連接實體打印機
- 把「已排隊」當成「已打印成功」

## 4. 打印閉環

正式流程：

`mobile/register UI → Shared Print Domain → Print Job API → SMT Android Host → Printer → Result Callback → Shared State`

打印狀態至少包括：

- `queued`
- `claimed`
- `printing`
- `success`
- `failed`
- `retrying`
- `cancelled`

只有 Android Host 收到設備級成功證據後，才可寫入 `success`。

## 5. `morefunos-smm` Repository 定位

即日起：

- 狀態：`MIGRATION SOURCE / HISTORICAL ARCHIVE`
- 禁止新增獨立核心功能
- 禁止再建立獨立 Domain／API／資料模型
- 可保留並遷移：手機 UI、PWA lifecycle、mobile navigation、mobile-specific interaction、可重用測試
- 所有遷移後正式 Authority 必須落在 `morefunos-smt`

## 6. G0 工作包

### G0.1 Authority Lock

- [x] D-053 寫入 Decision Ledger
- [x] 建立本文件
- [ ] 更新 Component Ownership Registry
- [ ] 更新 Code Map
- [ ] 更新 MFKG Knowledge Graph
- [ ] 更新 AGENTS／AI Start Here 接手入口

### G0.2 SMM Inventory

逐項分類舊 SMM：

- `KEEP`：純 mobile UI／PWA 能力
- `MERGE`：需要搬入 SMT Shared Component／Profile
- `REWRITE`：依賴舊 SMT baseline 或第二套核心
- `DROP`：重複、補丁、過時、假資料
- `ARCHIVE`：只供歷史參考

### G0.3 Target Structure

目標結構：

```text
morefunos-smt/
├── app/
│   ├── shared-core/
│   ├── shared-components/
│   ├── profiles/
│   │   ├── register/
│   │   └── mobile/
│   └── platform/
│       ├── web/
│       └── android-host/
├── contracts/
├── tests/
└── docs/
```

現有程式不要求立即大搬檔案；先確立 Authority，再以可驗證的小步驟遷移，禁止一次性破壞式改目錄。

## 7. Gate

完成 G0 前，禁止：

- 在 SMM repo 新增業務功能
- 為 mobile 重寫第二套訂單／付款／打印邏輯
- 進入 G1 Admin Firebase 接線
- 宣稱 SMT/SMM 已合併完成

G0 完成證據：

1. Decision／Registry／Code Map／MFKG 一致。
2. SMM Inventory 有逐檔結果。
3. Shared Core 邊界清楚。
4. register/mobile Profile Contract 清楚。
5. 至少有一條 Shared Core 測試可由兩個 Profile 共用。
