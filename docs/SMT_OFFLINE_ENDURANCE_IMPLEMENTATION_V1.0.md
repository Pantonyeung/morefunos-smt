# SMT 長時間離線營運｜實作記錄 V1.0

更新：2026-07-29 19:34 HKT

## 目標

首次成功連網及完整同步後，SMT 必須可以在長時間斷網情況下重新開機並持續營運。斷網期間仍需保留點單、價格、套餐、售罄、訂單、日結、打印工作及所有待同步修改。

## 已完成

- `shared/offline-journal.js`
  - IndexedDB 關鍵寫入 Journal
  - 最新值復原
  - Durable settings／orders／operations／printers／supply guarded recovery
  - 未補傳項目讀取、批次 acknowledgement、同步狀態統計
  - 3000 項上限壓縮；只刪除已補傳舊版本，永遠保留每個 Key 最新版本
- `shared/offline-survival.js`
  - Adapter-neutral Journal replay contract
  - Adapter 支援 `uploadJournalBatch()` 後自動分批補傳
  - Adapter 未完成時維持 `waiting_adapter`，不假裝同步成功
  - 恢復網絡後補傳並更新本機同步狀態
- `shared/storage-health.js`
  - Storage Persistence request
  - Quota／Usage／Warning／Critical 狀態
  - 週期監控事件
- `shared/offline-endurance-self-test.js`
  - 120 次持續 Journal 寫入
  - 未補傳統計、批次讀取、acknowledgement
  - 最新值讀回及 guarded recovery
  - 壓縮安全性
  - Adapter 缺失時等待狀態
  - 儲存容量、持久化、離線資料包、Service Worker、冷啟動 Cache
- `shared/store.js`
  - 所有關鍵 `writeJSON` 透過同源 Message 傳入 Shell Journal
- `shell-startup.js`
  - 開工後啟動儲存保護
  - 同源 Journal 收集
  - Durable 資料缺失時於登入前復原並安全 reload 一次
  - 網絡恢復時強制更新完整離線資料包及 App Shell
  - 啟動及重連時嘗試 Journal 補傳
- `pages/more/runtime-ui-hook.js`
  - 顯示 Journal 總數、未補傳數、補傳 Adapter 狀態及最近成功時間
  - 提供重試補傳、Journal JSON 匯出、人工長期資料復原
  - 提供 Runtime 自檢及離線耐久自檢
- `service-worker.js`
  - v2 App Shell Cache
  - 加入 Journal、Storage Health、Endurance Test 及 Runtime UI Hook
- `tests/offline-survival.spec.js`
  - Runtime／Offline 非阻塞啟動
  - 關鍵寫入進入 Journal
  - Browser 真離線 reload 後 Shell 可開啟
- `.github/workflows/runtime-offline-browser-gate.yml`
  - Targeted Offline Gate
  - Targeted PASS 後自動執行 Full Browser Matrix
  - CI 內 flaky 必須視為 failure

## 安全邊界

- Journal Message 僅接受同源 SMT 頁面。
- 自動復原只處理長期權威資料，不復活購物車、臨時草稿或已清空工作區。
- 人工強制復原必須由「更多 → 系統與更新」明確操作。
- 未收到遠端 Adapter acknowledgement 前，Journal 不標記已補傳。
- 已補傳舊紀錄才可以被壓縮；未補傳資料不可為控制容量而刪除。
- 新離線資料包未完成校驗前，Last-known-good 版本保持 Active。
- Runtime／Offline 啟動失敗不得阻塞登入、開工或點單。

## 驗證狀態

- Draft PR：#30
- Targeted Browser Gate：`tests/offline-survival.spec.js`
- Run #16 Targeted Offline Gate：SUCCESS，3／3 PASS
- Run #16 Full Browser Matrix：SUCCESS，81／81 PASS
- Failure：0
- Flaky：0
- 五個正式 viewport stress tests 全部 PASS：1920×1080、1600×900、1440×900、1366×768、1280×800
- PR 可合併狀態為 mergeable。
- **除 Firebase Adapter 及 Android／打印實機驗收外，本輪軟件實作與 Browser Gate 已完成。**

## 外部 Adapter Contract

Admin／Firebase Adapter 接入時需要額外提供：

```js
uploadJournalBatch({ schemaVersion, entries })
```

成功回傳：

```js
{ ok: true, acceptedIds: [...] }
```

未提供此能力時，SMT 顯示 `waiting_adapter`，所有未補傳 Journal 繼續保存在收銀機。

## 尚需實機驗收

- Android 收銀機首次完整下載
- 飛行模式／拔網線冷啟動
- 連續多日離線營業
- 大量訂單及打印工作壓力
- 斷電重啟
- 儲存接近警戒值
- 恢復網絡後順序補傳及衝突處理

未完成以上實機驗收前，不標記 production release-ready。

## 2026-07-29 Browser Gate 推進紀錄

### 改動

1. 新增真正會執行的 `Runtime Offline Browser Gate`，避免既有 workflows 因 path condition 全部 skipped。
2. 將 `tests/offline-survival.spec.js` 正式加入 `playwright.config.cjs`。
3. 離線 reload 前新增 Service Worker controller 接管確認。
4. `tests/stress-responsive-matrix.spec.js` 改為每輪重新取得當前可見產品卡，避免 stale／hidden locator。
5. Playwright config 新增 `failOnFlakyTests: Boolean(process.env.CI)`，禁止 retry 後假綠燈。

### 踩過的坑／問題／根因

- 首輪離線 reload 報 `ERR_INTERNET_DISCONNECTED`：Service Worker 已 ready，但當前頁未必已被 controller 接管。
- 一輪 Full Matrix 顯示 job success，但實際為 `79 passed / 2 flaky`；按永久規則不可接受。
- Offline flaky 一次為 Chromium context 啟動瞬間被關閉；測試加入 `finally` 保證離線狀態復原。
- Stress Matrix 1600×900 首次失敗為固定 `nth()` 指向 modal churn 後不可見產品卡。
- 曾加入 CLI `--fail-on-flaky`，但 repo 鎖定的 Playwright 1.61.1 不支援，出現 `unknown option`；改由 config 處理。
- 本地容器無法拉取 GitHub 時，不得以本地未執行結果冒充 Browser PASS；GitHub Actions 是唯一正式 Browser 證據。

### 成功方法

`exact fail → isolate exact spec → 讀取 job log → 修單一根因 → targeted rerun → affected regression → final full matrix`

最終證據：Run #16 Targeted 3／3 PASS；Full Browser Matrix 81／81 PASS；0 failure；0 flaky。

### 三方記錄規則

每次可驗證執行後必須同步：

1. GitHub：本文件（正式工程 Authority）
2. Google Drive：`More Fun SMT｜Runtime＋長時間離線生存｜PR #30 三方接手記錄 V1.0`
3. Jade Note：同名 pinned 接手記錄

另於 PR #30 留工作流水 comment。任何一方過期時，先補記錄再繼續修改。

### 下一步唯一優先

完成 PR #30 狀態收口及合併前審核；Firebase Adapter 與 Android／打印實機驗收保持獨立後續 Gate，不可混寫為已完成。