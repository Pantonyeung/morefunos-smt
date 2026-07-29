# More Fun SMT｜SMT 自適應系統 × Runtime 整合接手文件 V1.0

## 1. 唯一 UI／Adaptive Authority

- 正式名稱：SMT 自適應系統
- Repo：Pantonyeung/morefunos-smt
- 正式整合分支：smt-functional-completeness-v1
- 不可變完成基準：bbecd4ce66802a9a78262abe9573615fa57bb360
- 權威文件：docs/SMT_ADAPTIVE_SYSTEM_RECORD_V1.0.md
- 舊稱「A 線」只作歷史識別，不再作正式名稱。

## 2. 本輪整合分支

- 分支：smt-adaptive-runtime-integration-v1
- 建立基準：bbecd4ce66802a9a78262abe9573615fa57bb360
- 原則：Clean Rebuild；只搬已驗證 Runtime 能力，不硬 merge 長期分叉分支。

## 3. 已驗證 Runtime 來源

來源分支：staff-sync-simple-v2

已在手機內建診斷完成：

- Runtime 自測：8／8 PASS
- queue_enqueue
- queue_idempotency
- queue_success_removal
- queue_failure_retained
- queue_attempt_incremented
- queue_error_recorded
- snapshot_write_read
- snapshot_atomic_shape

## 4. 2026-07-29 已完成移植

已以零 UI 侵入方式加入：

- shared/health-state.js
- shared/runtime-snapshot-store.js
- shared/push-queue.js
- shared/runtime-self-test.js

目前未修改：

- index.html
- app-loader.js
- app-shell.css
- shell-startup.js
- 五尺寸 Adaptive metrics
- 產品卡／售罄卡／iframe Authority

即係現階段只加入 Runtime 核心檔案，尚未接管正式啟動流程，避免 UI／登入／開工現金倒退。

## 5. 已踩過嘅坑

1. staff-sync-simple-v2 與 smt-functional-completeness-v1 已長期分叉，唔可以因為畫面相似就當成 SMT 自適應系統。
2. Runtime 分支曾修改 app-loader、app-shell、order／checkout／more 等 UI 檔案，直接硬 merge 會導致已完成 Adaptive UI 倒退。
3. 本機 Runtime 8／8 PASS 只證明 Queue／Snapshot 基礎正常，不代表 Admin、Firebase、Worker、Google Sheet 或正式 API 已接通。
4. 未確認真實資料源之前，禁止自行假設「雲端」係 Firebase、Cloudflare Worker、Apps Script 或其他服務。

## 6. 下一階段 Gate

在接入 Pull／Push／Heartbeat／API Adapter 之前，必須由項目 Authority 明確確認：

- Admin Repo／branch
- Admin 儲存資料後實際寫入邊個服務
- Firebase project／database path（如有）
- Cloudflare Worker／API endpoint（如有）
- Google Sheet／Apps Script 是否參與正式同步
- 現行資料模型／revision／idempotency contract

未確認以上資料，不得建立假同步接口。

## 7. 永久規則

- SMT 自適應系統係 UI／Adaptive 唯一 Authority。
- Runtime 只可以模組化接入，不得覆蓋 UI Authority。
- 每次整合後必須重新跑受影響 Contract／Browser Gate。
- 有 fail／flaky 不得合併。
- 每日工作、成功證據、踩坑及下一步必須更新接手文件。
