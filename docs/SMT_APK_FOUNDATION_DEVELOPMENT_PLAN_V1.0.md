# SMT APK Foundation Development Plan V1.0

> 狀態：CURRENT / PRODUCT-LOCKED / MUST READ BEFORE APK OR NATIVE-BRIDGE WORK
> 日期：2026-07-27
> 產品決策：先完成可長期承載 SMT 的 APK Foundation，上機實測；其後 Web／UI／業務模組按模組完成、測試、合併及受控更新。

## 1. 核心目標

SMT 第一階段唔以「所有 UI 完美」作為封裝 APK 前置條件。

固定次序：

`補齊 APK 必需能力 → 建立穩定 Android Shell／Bridge → 封裝 APK → 實機安裝／硬件測試 → 修 Native／Bridge blocker → 鎖定 APK Foundation → Web／UI／業務模組逐批合併及更新`

目標唔係最快產生一個臨時 APK，而係最快完成一個之後毋須因一般 UI／業務改動不停重做的穩定 APK Shell。

## 2. APK Foundation｜第一優先，封裝前必須完成

### 2.1 App Shell／Web Runtime
- Android App Shell／WebView 容器。
- 正式 SMT Web App 載入入口。
- App lifecycle：啟動、恢復、返回前台、背景、重啟後狀態恢復。
- Kiosk／全螢幕／維護退出能力。
- Device／Terminal identity。
- Network online／offline 狀態回報。

### 2.2 Web ↔ Android Native Bridge Contract
Bridge 必須版本化並提供 capability discovery，Web 不得假設 Native 一定支援全部能力。

最低能力：
- `bridge.getCapabilities()`
- `bridge.getVersion()`
- `bridge.getDeviceInfo()`
- `bridge.getNetworkStatus()`
- `bridge.print(payload)`
- `bridge.getPrintJobStatus(jobId)`／打印結果回報
- 檔案匯入／匯出所需能力
- 診斷／錯誤回報接口

Bridge Contract 改變或新增 Android 原生權限／硬件能力時，仍需要發佈新版 APK；一般 UI／Web 業務模組更新不得要求改 Native Bridge。

### 2.3 Printing／Hardware Foundation
同一 Print Domain 支援：
- Sunmi 內置打印橋接（兼容能力）。
- LAN TCP/IP 打印機。
- 每部設備獨立 IP／Port／Media Profile／模板／份數／用途設定。
- 卷紙與標籤尺寸不可硬編 80mm／50mm；尺寸由 Media Profile 設定。
- Primary Printer／Fallback Printer。
- 手動改送／自動 Failover。
- Print Job Idempotency，禁止因重試造成重複出單。
- Android Bridge 必須回傳真實打印結果；Queued／Payload Created 不等於 Printed。

### 2.4 Offline／Recovery Foundation
- 本機可營運狀態保存。
- Offline Queue／待同步工作。
- App crash／重啟後恢復未完成工作。
- Print Job 可恢復／重試，但保持 Idempotency。
- 設定與必要 Runtime 資產具本機 fallback。

### 2.5 Update Foundation
後續 Web／UI／業務模組允許受控更新，但必須具備：
- 明確 Update Channel／Release Version。
- Web Asset／Bundle Version。
- Native Bridge minimum／maximum compatible version。
- 完整性／來源驗證；禁止任意未驗證遠端程式直接取代正式 SMT。
- 更新失敗 rollback。
- 離線時仍可載入上一個已驗證可用版本。
- 更新前後保留診斷版本資訊，方便實機回溯。

## 3. 可以在 APK Foundation 後逐步更新的模組

只要不新增 Native 權限／Native Bridge 能力，下列模組可保持 Web／Feature Module 形式獨立開發、測試、合併：
- Order UI／Product Card／Drink Card／Pairing UI。
- Printer Settings UI。
- Reports／Day Close UI。
- Session／登入 UI（身份及安全 Contract 仍需 Backend／Native 邊界配合）。
- Admin-driven settings。
- Theme／animation／visual polish。
- SMM 衍生 UI。
- 其他純 Web 業務流程。

規則：`Domain／Contract → Module Tests → Integration Gate → Release Channel`，禁止把新業務邏輯散落入 Android Native 層。

## 4. 必須重新發佈 APK 的情況

以下任何一項出現，唔可以只靠後台／Web 更新：
- 新 Android permission。
- 新硬件類型需要新 Native driver／SDK。
- WebView／Android runtime 本身需要修改。
- Native Bridge 新增破壞性 Contract。
- Kiosk／檔案／網絡／安全能力需要 Native 改動。
- Android 系統版本兼容問題需要 App 層修正。

## 5. 模組化開發工作法

正式採用 Module Factory：

`獨立 Module Branch → Domain／Contract → Unit／Contract Test → Integration Boundary → QA Gate → Ready Module → 按優先順序合併`

Browser Regression 未完成期間，可以繼續開發不依賴視覺封板的獨立模組；禁止同時大改已封板 UI Authority。

目前並行工作線：
- A 線：五尺寸 Browser Regression，追到 PASS。
- B 線：Printer Module，完成 Domain／Transport／Media／Routing／Fallback／Settings／UI Adapter。
- C 線：APK Foundation，最高工程優先，建立 Android Shell／Bridge／Print／Offline／Update 基礎。

## 6. 第一版 APK 上機驗收最低標準

第一版上機唔要求所有 UI 最終封板，但最少要證明：
- App 可正常安裝、啟動、全螢幕／維護退出。
- SMT Web Runtime 可載入並可在斷網情況保持已驗證 fallback。
- Device／Terminal identity 穩定。
- Web ↔ Native Bridge capability／version 可讀。
- LAN TCP/IP 打印可由真實 Print Job 出紙並回傳成功／失敗。
- Sunmi 內置打印如設備支援則可經同一 Print Contract 驗證。
- Primary／Fallback Printer 真實改送不重複打印。
- App 重啟後 Print／Offline pending state 不會無聲消失。
- 診斷資訊可識別 APK Version、Web Version、Bridge Version、Device、Printer Target。

## 7. 真相及驗收分級

必須分開標示：
- Module Code Exists
- Contract／Node Tests PASS
- Browser QA PASS
- APK Build PASS
- Device Install PASS
- Hardware Integration PASS
- Real Print PASS
- Production Lock

任何上一級成功都不可自動當作下一級完成。

## 8. 長期架構原則

1. Android Native Shell 保持細、穩、少改。
2. Business Logic 保持在共用 Domain／Web Core，SMT／SMM 共用。
3. Hardware Bridge 只提供裝置能力，不重算 Order／Pricing／Business Rule。
4. 後續更新以受控 Release Channel 為主，唔建立任意動態插件系統。
5. 能力探測優先於版本猜測；Web 必須按 Bridge capabilities graceful degrade。
6. 更新可回滾、可診斷、可離線 fallback，先於「無感更新」。
7. 第一版 APK Foundation 穩定後，UI／Feature 可持續迭代，但不得破壞已鎖 Native Contract。
