# MoreFun SMT｜A 線 UI 權威與同步接手文件

日期：2026-07-29

## 1. 最高規則

- A 線係 SMT UI、自適應、1280×800 架構、版面與操作行為嘅唯一權威來源。
- 未確認 A 線實際分支、commit、接手文件或鎖定包之前，禁止宣稱任何其他分支等同 A 線。
- 禁止由 B 線、舊分支、相似畫面或隨機可用版本抽取 UI，再當成 A 線。
- Runtime、登入、Session、Heartbeat、Pull、Push Queue、Snapshot、Health、自測等，只可視為可移植模組。
- 最終整合方向必須係：保留 A 線 UI／自適應架構，將 B 線 Runtime／同步模組有控制地移植入去；禁止用 B 線 UI 覆蓋 A 線。

## 2. 今日已完成

- `staff-sync-simple-v2` 可正常登入。
- 測試帳號：`morefun`；測試密碼：`morefun`。
- Cloudflare preview deployment 可正常打開。
- 已於「更多 → 系統與更新」加入手機可用 Runtime 自測入口。
- Runtime 自測結果：8/8 全部通過。

通過項目：

1. queue_enqueue
2. queue_idempotency
3. queue_success_removal
4. queue_failure_retained
5. queue_attempt_incremented
6. queue_error_recorded
7. snapshot_write_read
8. snapshot_atomic_shape

## 3. 今日踩過嘅坑

- 曾經錯誤假設目前 `staff-sync-simple-v2` 畫面等同 A 線最新自適應成果。
- 實際 compare 後確認：`staff-sync-simple-v2` 與 `smt-functional-completeness-v1` 已分叉。
- 比對狀態：ahead 196、behind 668。
- 多個 UI／CSS／loader 檔案存在差異，包括 `app-loader.js`、`app-shell.css`、`index.html`、`pages/order/page.css`、`pages/order/page.js`、`pages/more/index.html`、`pages/checkout/page.css`。
- 因此目前 B 線只可視為 Runtime／同步驗證環境，唔可視為 A 線 UI 基準。
- 獨立自測網址對手機使用者不直觀，已改為「更多」頁內建入口。

## 4. 同步接手規則

- Admin 已完成設定，但尚未正式同步到 SMT。
- 未確認真實資料源前，禁止自行假設「雲端」係 Firebase、Google Sheet、Cloudflare Worker、Apps Script 或其他服務。
- 下一步必須向使用者確認：
  - Admin repo／分支
  - Admin 實際資料寫入位置
  - Firebase project／Realtime Database 路徑
  - Cloudflare Worker／API endpoint
  - Google Sheet／Apps Script 是否參與
  - 現有資料模型／API contract
- 如果使用者都未完全清楚，先逐項辨識，再落實同步。

## 5. 正確同步次序

1. 鎖定 A 線實際分支與 commit。
2. 鎖定 Admin 真實資料源與接口。
3. 完成 Admin → API／Firebase → SMT Snapshot 單向同步。
4. 驗證 revision、idempotency、queue、health、fallback。
5. 再做 SMT → Admin／Firebase 回傳。
6. 將 B 線 Runtime 模組移植回 A 線，不覆蓋 A 線 UI。
7. 每次完成後更新接手文件，記錄分支、commit、部署網址、驗收結果、失敗原因與修正方法。

## 6. 下一步需要使用者提供／確認

- A 線實際分支名稱或最新 commit。
- Admin 使用嘅 repo／branch。
- Admin 儲存資料時，實際寫去 Firebase、Google Sheet、Apps Script、Cloudflare Worker，定係其他位置。
- 如果有現成 Firebase project URL、Realtime Database 路徑、Worker URL、Apps Script Web App URL 或 API contract，需逐項提供或授權讀取。
