# More Fun SMT｜兩人店 Staff Sync 簡化開發鎖 V1.0

狀態：CURRENT / HARD RULE

## 1. 本線目標
只開發 SMT Web Runtime 內的：
- Install 狀態接入
- Health 檢查
- Staff Login
- Session
- Bootstrap
- Push
- Pull
- Heartbeat
- Fallback

員工只有兩人：Panton 與太太。所有流程以夫妻店、高峰期、低操作成本為準，禁止照搬大型企業帳戶及權限系統。

## 2. APK 零影響鎖
本線禁止修改、建立或要求重新製作 APK。

禁止觸碰：
- `android/**`
- Android Manifest／permission
- Native Bridge contract／version
- Printer native driver／Sunmi SDK
- APK OTA／Runtime OTA trust root
- Android signing／keystore／certificate
- Boot／Kiosk／Package Installer
- Gradle／versionCode／versionName
- Production APK workflow

如任何需求必須觸碰以上項目，立即 STOP，將需求改成 Web Runtime 方案；不可在本線開 APK 工作。

## 3. V42EG 定位
`分支 · V42EG 設計與開發.txt` 不再是開發基準，不再按其舊流程續做。

V42EG 改列為候備模組庫，可以直接抽取合適內容，以縮短開發時間，但必須同時符合：
- 屬 Web Runtime／Domain／API Contract／測試資料；
- 不觸碰 APK／Native／Bridge／Android 權限；
- 不建立第二套 Staff、Session、Sync、Health 或 Fallback 真相；
- 可獨立抽取，不需要連帶搬入舊補丁、舊 UI Authority 或舊流程；
- 經最新 Contract／Browser／Offline 測試重新驗證；
- 新程式及新證據優先，V42EG 記錄不可直接當完成證據。

優先可抽取：
- 已有 Install／Health API Contract；
- Staff Login 請求／回應格式；
- Session／Bootstrap 資料結構；
- Push／Pull／Heartbeat／Fallback 已有純 Web 邏輯；
- 已有測試帳號、測試案例及錯誤處理模式。

禁止抽取：
- 舊 APK／Native 實作；
- 舊 UI 補丁、Override、第二 Authority；
- 依賴已淘汰流程的狀態管理；
- 未重新驗證便直接標記完成的結果。

抽取方式固定：
`先核對責任與依賴 → 只搬最小有效模組 → 接入最新 Domain → 跑 Contract → 跑 Browser／Offline Regression → 才保留`

## 4. 簡化登入原則
- 只支援兩個固定員工帳戶。
- 不做部門、職級、排班、企業 SSO、多層 RBAC。
- 不做自動鎖定；只提供手動鎖定／快速重新進入。
- 同一裝置成功登入後保存有效 Session，App 重載優先恢復，不要求每日重複輸入。
- Session 過期或後端不可用時，先保留本機可操作狀態，清楚顯示離線／待同步。
- 登入錯誤只顯示簡單、可恢復訊息，不建立複雜安全挑戰流程。
- 高風險操作才要求再次確認，不因一般點單頻繁要求密碼。

## 5. 單一真相
- Staff Identity：Staff/Auth Domain
- Session：Session Store
- Bootstrap：Bootstrap Orchestrator
- Sync Queue：單一 Offline／Sync Queue
- Connection Health：Health State
- UI 只呈現狀態，不掃 DOM 估登入或同步狀態。

禁止建立第二套帳戶資料、第二套 Session、第二套 Push/Pull Queue 或 UI 自行判斷同步成功。

## 6. 最小正式流程
1. App 啟動
2. 讀本機 Session
3. 有有效 Session：直接 Bootstrap
4. 無 Session：顯示兩人店簡單登入
5. Health 可用：Bootstrap 後 Pull 最新設定／訂單狀態
6. Health 不可用：進入 Fallback，使用本機資料並排隊 Push
7. Heartbeat 只更新連線與 Session 狀態，不阻塞點單
8. 恢復連線後按 Idempotency 順序 Push，再 Pull 對帳

## 7. 第一階段驗收
- 正確帳密登入
- 錯誤帳密可立即重試
- Reload／切頁後 Session 恢復
- 後端正常 Bootstrap
- 後端斷線仍可進入 Fallback
- Push 重試不重複寫入
- Pull 不覆蓋較新的本機未同步資料
- Heartbeat 失敗不鎖死 UI
- 重啟後保留待同步 Queue

## 8. 禁止過度設計
不做：
- 多層角色權限矩陣
- 密碼輪替政策
- 強制複雜密碼
- 多因素認證
- 裝置審批工作流
- 企業級審計介面
- 自動登出倒數
- 每次高峰操作重新驗證

需要保留的最低安全：
- 密碼不可明文儲存
- Session token 不寫入畫面或 Log
- 高風險操作保留簡單確認及最小 Audit 記錄
- Push 使用 Idempotency Key

## 9. 開發次序
1. 盤點並抽取 V42EG 可重用模組
2. Staff Auth Domain／Login Contract
3. Session Store／Restore
4. Bootstrap Orchestrator
5. Health State
6. Heartbeat
7. Pull
8. Push Queue／Retry／Idempotency
9. Fallback／Recovery
10. Browser Contract／Reload／Offline Regression

本線所有提交必須維持 APK 零改動。