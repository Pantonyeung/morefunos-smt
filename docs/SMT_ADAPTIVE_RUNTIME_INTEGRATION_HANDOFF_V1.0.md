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
- shared/runtime-contract.js
- shared/runtime-local-adapter.js
- shared/runtime-controller.js
- shared/runtime-bootstrap.js
- shared/runtime-integration-self-test.js

已完成能力：

- Adapter-neutral Runtime Contract
- Local Runtime Adapter
- Pull／Push／Subscribe
- Runtime Snapshot
- Heartbeat／Health State
- Version Conflict Guard
- Offline Push Queue
- Bootstrap 後自動 flush queue
- 非法 Runtime payload 拒絕寫入
- Bootstrap／Conflict／Queue／Subscription 整合自測

目前仍未修改：

- index.html
- app-loader.js
- app-shell.css
- shell-startup.js
- 五尺寸 Adaptive metrics
- 產品卡／售罄卡／iframe Authority

即係現階段已建立完整獨立 Runtime 基礎，但尚未掛入正式 SMT 啟動流程，避免 UI／登入／開工現金倒退。

## 5. 已踩過嘅坑

1. staff-sync-simple-v2 與 smt-functional-completeness-v1 已長期分叉，唔可以因為畫面相似就當成 SMT 自適應系統。
2. Runtime 分支曾修改 app-loader、app-shell、order／checkout／more 等 UI 檔案，直接硬 merge 會導致已完成 Adaptive UI 倒退。
3. 本機 Runtime 8／8 PASS 只證明 Queue／Snapshot 基礎正常，不代表 Admin、Firebase、Worker、Google Sheet 或正式 API 已接通。
4. 未確認真實資料源之前，禁止自行假設「雲端」係 Firebase、Cloudflare Worker、Apps Script 或其他服務。
5. Local Adapter 初版曾接受非法 storeStatus；已改成所有寫入必須先通過 validateRuntimePayload。

## 6. Admin／Firebase 真實狀態（2026-07-29）

已確認：

- Admin Repo：Pantonyeung/morefunos-admin
- 主要開發分支：feat/admin-p0-full-connect-v1
- Firebase Realtime Database：https://morefunposos-default-rtdb.asia-southeast1.firebasedatabase.app/
- 設計規格中的目標路徑：
  - /admin/draft
  - /admin/published
  - /runtime
  - /admin/releases
  - /admin/audit

但以 Admin 分支目前實際程式碼與 Current Handoff 為準，真實狀態係：

- Firebase Staging 正式接線仍未開始。
- Customer／SMT／SMM 正式 adapter 尚未完成。
- Production Auth／Permission 尚未完成。
- src/integrations/connectors.js 目前只係一般 HTTP endpoint abstraction，並非 Firebase Realtime Database SDK adapter。
- 未見 src/integrations/firebase-staging.js、src/data/remote-store.js、src/config/firebase-config.js 的正式實作。

## 7. 正式決策：SMT 獨立完成，最後接通 Admin

Owner 已確認：

- SMT 不等待 Admin Firebase 接線。
- SMT 先以 Local Adapter 完成全部 Runtime、離線、衝突、Queue、Bootstrap、測試與 UI 接入。
- Admin 端另外完成 Firebase Staging／Auth／Rules／Published／Runtime。
- 最後只新增正式 Firebase Runtime Adapter，替換 Local Adapter；不得重寫 SMT Runtime Controller 或 UI。

因此現階段：

- 可以繼續完成 SMT 全部本機功能。
- 不可以宣稱已與 Admin／Firebase 同步。
- Firebase Adapter 必須遵守現有 Runtime Contract。

## 8. 最後接通 Admin 前 Gate

必須確認：

- Firebase Auth 方法及可用帳號／匿名策略
- Realtime Database Security Rules
- /runtime 實際資料形狀
- runtimeVersion／updatedAt／source contract
- /admin/published 的 schemaVersion／dataRevision
- Admin 是否已完成首次 seed／publish
- SMT 只讀範圍及是否允許 Runtime write-back

未確認以上資料，不得建立假同步接口。

## 9. 下一步

1. 將整合自測掛入「更多 → 系統與更新」現有 Runtime 診斷入口。
2. 以非阻塞方式掛入 shell startup：登入／開工完成後才啟動 Runtime。
3. Runtime 啟動失敗只降級為 Local Cache／離線狀態，不得阻塞 SMT 開單。
4. 跑受影響 Browser Matrix，確認五尺寸與 shell 無倒退。
5. 完成 Runtime UI 狀態映射後，再準備 Firebase Adapter contract test。

## 10. 永久規則

- SMT 自適應系統係 UI／Adaptive 唯一 Authority。
- Runtime 只可以模組化接入，不得覆蓋 UI Authority。
- 每次整合後必須重新跑受影響 Contract／Browser Gate。
- 有 fail／flaky 不得合併。
- 每日工作、成功證據、踩坑及下一步必須更新接手文件。
