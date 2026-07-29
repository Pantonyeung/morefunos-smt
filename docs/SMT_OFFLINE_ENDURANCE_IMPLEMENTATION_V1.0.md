# SMT 長時間離線營運｜實作記錄 V1.0

更新：2026-07-29 17:43 HKT

## 目標

首次成功連網及完整同步後，SMT 必須可以在長時間斷網情況下重新開機並持續營運。斷網期間仍需保留點單、價格、套餐、售罄、訂單、日結、打印工作及所有待同步修改。

## 本輪已完成

- `shared/offline-journal.js`
  - IndexedDB 關鍵寫入 Journal
  - 最新值復原
  - 3000 項上限壓縮，永遠保留每個 Key 最新版本
  - Durable settings／orders／operations／printers／supply guarded recovery
- `shared/storage-health.js`
  - Storage Persistence request
  - Quota／Usage／Warning／Critical 狀態
  - 週期監控事件
- `shared/offline-endurance-self-test.js`
  - 持續 Journal 寫入
  - 最新值讀回
  - 壓縮安全性
  - 儲存容量及持久化
  - 離線資料包
  - Service Worker
  - 冷啟動 App Shell Cache
- `shared/store.js`
  - 所有關鍵 `writeJSON` 透過同源 Message 傳入 Shell Journal
- `shell-startup.js`
  - 開工後啟動儲存保護
  - 同源 Journal 收集
  - Durable 資料缺失時於登入前復原並安全 reload 一次
  - 網絡恢復時強制更新完整離線資料包及 App Shell
- `pages/more/runtime-ui-hook.js`
  - 顯示 Journal、Storage、Offline Package、Service Worker、Runtime
  - 提供 Runtime 自檢及離線耐久自檢
- `service-worker.js`
  - 升級至 v2 Cache
  - 加入 Journal、Storage Health、Endurance Test 及 Runtime UI Hook
- `tests/offline-survival.spec.js`
  - Runtime／Offline 非阻塞啟動
  - 關鍵寫入進入 Journal
  - Browser 真離線 reload 後 Shell 可開啟

## 安全邊界

- Journal Message 僅接受同源 SMT 頁面。
- 自動復原只處理長期權威資料，不復活購物車、臨時草稿或已清空工作區。
- 新離線資料包未完成校驗前，Last-known-good 版本保持 Active。
- Runtime／Offline 啟動失敗不得阻塞登入、開工或點單。

## 驗證狀態

- Draft PR：#30
- Targeted Browser Gate：`tests/offline-survival.spec.js`
- PR 建立後 Actions 已開始觸發；最新安全修正的 CI 結果仍待產生。
- CI 通過後必須再跑受影響 Shell／More tests 及完整 Browser Matrix。

## 尚需實機驗收

- Android 收銀機首次完整下載
- 飛行模式／拔網線冷啟動
- 連續多日離線營業
- 大量訂單及打印工作壓力
- 斷電重啟
- 儲存接近警戒值
- 恢復網絡後順序補傳及衝突處理

未完成以上實機驗收前，不標記 production release-ready。
