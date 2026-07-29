# D-053｜SMM 合併 SMT Shared Core

狀態：LOCKED
日期：2026-07-29

## 決定

SMM 不再作獨立系統發展。SMM 正式合併落 SMT，改為 SMT Mobile UI／Mobile Device Profile。

SMT Register UI 與 SMT Mobile UI 必須共用同一套：

- Domain
- State
- Business Rule
- Cart
- Pricing
- Checkout
- Order
- Payment
- Sync
- Audit
- Permission
- Recovery
- API Contract
- Print Job Contract

差異只限 UI、Viewport、Lifecycle、Device Capability 及硬件責任。

## 打印責任

SMT Mobile UI 不直接連實體打印機。Mobile UI 只建立／提交同一套 Print Job／Command；SMT Android Host 在後台靜默執行實體打印，並回傳 `printed / failed / retry / fallback` 狀態。

## 禁止

- 建立第二套 SMM Runtime 或商業規則。
- 複製 SMT 後獨立維護。
- Mobile UI 自行重新計價。
- Mobile UI 建立另一套 Cart／Checkout／Order／Print Logic。
- Mobile UI 直接控制實體打印機。

## 遷移要求

1. 停止以舊 `order-v1-31` 作 SMM 正式基準。
2. 盤點 morefunos-smm 仍可保留的手機 UI／Lifecycle／PWA 能力。
3. 將可保留能力移植入 morefunos-smt Shared Core 架構。
4. 原 morefunos-smm Repo 轉為歷史／遷移參考，不再作平行產品 Authority。
5. 更新 MFKG、Code Map、Implementation Status、Ownership Registry 及相關 QA Gate。

## 關聯

- `docs/MOREFUNOS_END_TO_END_CLOSURE_PLAN_V1.0.md`
- D-051 Shared Core 原則由本決定進一步收口：SMM 不只共享核心，而係正式成為 SMT 同一 Application 的 Mobile UI。
