# SMT 長時間離線營運｜實作記錄 V1.0

更新：2026-07-29 17:58 HKT

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
- PR 可合併狀態目前為 mergeable，但仍保持 Draft。
- 現有 Actions 大部分工作流因路徑條件跳過；未取得 targeted Browser Gate PASS 證據。
- Targeted Gate 通過後必須再跑受影響 Shell／More tests及完整 Browser Matrix。

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
