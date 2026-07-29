# More Fun SMT｜兩人店 Staff Sync 簡化開發鎖 V1.0

狀態：CURRENT / HARD RULE

## 1. 永久架構決定

SMT APK 永久定位為穩定 Host／容器。日常功能、介面與營運邏輯以 Web Runtime 模組方式更新，原則上不需要重新 Build、簽署或安裝 APK。

```text
APK Host
→ Bootstrap
→ Web Runtime
→ Staff Login／Session／Health／Heartbeat／Pull／Push Queue／Fallback／Order／Checkout／Soldout／Printer UI／其他營運模組
```

通常只更新 Web Runtime、不改 APK：
- UI、CSS、動畫與版面
- 點餐、購物車、結帳與售罄流程
- Staff Login、Session、Bootstrap
- Health、Heartbeat、Pull、Push Queue、Fallback
- API 串接、資料同步及營運邏輯
- 新套餐、新付款方式的 Web 層流程

只有以下情況才可考慮修改 APK：
- 新增 Android Permission
- 新增或修改 Native Bridge
- 新增 Camera、NFC、Bluetooth、USB、Scanner、Cash Drawer、Fingerprint、Serial Port 等硬件能力
- 修改 Native Printer Driver
- Android SDK／系統版本升級
- Manifest、Intent、Deep Link、Foreground Service
- Signing、Keystore、Gradle、正式 APK 發佈流程

## 2. 模組與 Contract 鎖

每個 Runtime 功能必須獨立成模組，透過穩定 Contract 溝通。禁止將 Login、Session、Sync、Order、Checkout、Printer 等重新混成單一巨型檔案；禁止建立重複 Session 或重複 Sync 邏輯。

只要 Contract 不變，個別模組可獨立重寫、替換或升級，而不影響其他模組及 APK Host。

## 3. 本線範圍

只處理 SMT Web Runtime：Install 狀態、Health、Staff Login、Session、Bootstrap、Push、Pull、Heartbeat、Fallback。

員工只有 Panton 與太太。禁止照搬大型企業帳戶、角色、排班、SSO、MFA、多層 RBAC 或自動鎖定制度。

## 4. APK 零影響鎖

本線禁止修改、建立、重建或要求重新製作 APK。

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

如需求需要以上項目，立即 STOP，改用 Web Runtime 方案。本線不得產生 APK 工作項目。

## 5. V42EG 候備抽取規則

`分支 · V42EG 設計與開發.txt` 只係候備模組資料，不係開發基準。

可直接抽取並重新驗證：
- API 1.2.9／Sync 0.2 歷史標記
- `SHA256_FAST` 密碼模式
- 自動鎖定已關閉
- 測試帳號 `morefun`
- Install／Health 舊測試線索

不可直接當成完成證據：Staff Login、Session、Bootstrap、Push、Pull、Heartbeat、Fallback。

## 6. 最簡登入與 Session

- 固定最多兩個員工帳戶。
- 不做角色矩陣；一般點單權限相同。
- 不自動鎖定，不每日強制重登。
- 成功登入後保存持久 Session；Reload／切頁直接恢復。
- 只提供明確手動鎖定。
- 密碼不可明文寫入 HTML、localStorage 或 Log。
- 高風險設定只做一次簡單確認，不要求頻繁輸入密碼。

## 7. 單一責任來源

- Staff Identity：`shared/staff-auth.js`
- Session：`shared/session-store.js`
- Startup Gate／Bootstrap entry：`startup-controller.js`
- Bootstrap Orchestrator：`shared/bootstrap-orchestrator.js`
- Health：後續單一 `shared/health-state.js`
- Sync Queue：後續單一 Offline／Sync Queue

UI 只顯示結果；禁止掃 DOM 反推登入、Session 或 Sync 狀態。

## 8. 開發次序

1. Staff Login Contract
2. Persistent Session Restore
3. Bootstrap Orchestrator
4. Health State／Heartbeat
5. Pull
6. Push Queue／Retry／Idempotency
7. Fallback／Recovery
8. Browser／Reload／Offline Regression

所有提交必須維持 APK 零改動。