# SMT Runtime Completeness Audit V1.0

更新：2026-07-29 16:35 HKT

## 完成定義

SMT 在未接 Admin／Firebase 前，必須可以：獨立啟動、讀寫本機 Runtime、離線排隊、重連清隊、拒絕非法資料、偵測版本衝突、提供統一狀態、提供完整診斷、Runtime 失敗不阻塞收銀 UI。

## 已完成

- Runtime schema／normalization／validation
- Local Adapter：health／pull／push／subscribe／reset
- Controller：pull／push／heartbeat／snapshot／conflict
- Offline Queue／idempotency／retry metadata
- Bootstrap／shutdown／automatic queue flush
- Core self-test 與 integration self-test
- Runtime status facade
- Runtime diagnostics facade
- Non-blocking lifecycle wrapper

## 本輪審計發現並補全

1. 缺少 UI 可共用的單一 Runtime status model：已新增 `shared/runtime-status.js`。
2. 缺少「核心自測 + 整合自測」單一入口：已新增 `shared/runtime-diagnostics.js`。
3. 缺少啟動失敗不阻塞 SMT 的 lifecycle：已新增 `shared/runtime-lifecycle.js`。
4. 缺少最後 Firebase Adapter 的替換邊界：現有 Controller 僅依賴 adapter contract，保持 adapter-neutral。

## 尚未宣稱完成的外部項目

以下依賴 Admin／Firebase，現階段不可假裝完成：

- Firebase Auth
- Realtime Database Security Rules
- `/runtime` production schema acceptance
- `/admin/published` menu adapter
- 跨裝置正式同步
- Production write permission

## 接入 UI 前最後 Gate

- 確認 shell 啟動事件或登入／開工完成 hook。
- 將 `startRuntimeNonBlocking()` 掛入該 hook；失敗只顯示離線狀態。
- 將 `runAllRuntimeDiagnostics()` 掛入「更多 → 系統與更新」。
- 跑 Runtime contract tests、受影響 shell／more Browser tests、完整 78-test matrix。

未有測試證據前，不標記 release-ready。
