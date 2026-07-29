# More Fun SMT｜D 線里程碑與 E 線 APK OTA 接手文件

日期：2026-07-29（Asia/Hong_Kong）

## 1. 分支與邊界

- D 線：`d-line-production-integration-v1`
- D 線鎖定基準提交：`0771e8d82b39485e30f8d8c21a1771311b70e452`
- D 線 PR：#26
- E 線：`e-line-apk-ota-v1`
- E 線 PR：#27
- E 線建立方式：直接由 D 線鎖定提交抽出。
- 硬規則：APK OTA 的任何新增、修改、測試、workflow、installer、manifest 或診斷，全部只可在 E 線進行；不得回寫、污染或重構 D 線。

## 2. D 線凍結狀態

D 線已完成 Android Native Host、Printer、A 線 Runtime OTA、Recovery 及 Production Integration。D 線保留作不可變基準，不再重複提供臨時下載包，也不再新增功能。

已鎖定能力：

1. APK Foundation 與 Native Bridge。
2. LAN TCP、Label TCP、Sunmi runtime service binding。
3. Printer registry、routing、fallback、job status、diagnostics。
4. Offline queue 與 recovery。
5. A 線 Signed Web Runtime OTA：HTTPS allowlist、SHA-256、RSA signature、bridge compatibility、replay protection、version vault、pending health、timeout rollback、factory fallback。
6. Boot Receiver、package replaced recovery、bootstrap safe fallback。
7. D-line Production Contract 與 D-line Release Candidate Gate。

D 線鎖定 CI 證據：

- Validate APK Foundation：SUCCESS
- D-line Production Contract：SUCCESS
- D-line Release Candidate Gate：SUCCESS
- 鎖定提交：`0771e8d82b39485e30f8d8c21a1771311b70e452`

## 3. E 線定位

E 線完整繼承 D 線並增加 Native APK OTA。E 線已通過軟件 Replacement Gate，成為 D 線唯一後繼版本；正式交付只需提供 E 線 APK，不再另外提供 D 線 APK。

更新通道：

- A 線 Runtime OTA：HTML／CSS／JavaScript／POS 業務邏輯，不重裝 APK。
- E 線 APK OTA：Native Bridge、Printer Driver、Manifest、Boot／Kiosk、Android Host 及 APK binary。

## 4. E 線已完成

### E0｜隔離與基準

- E 線直接繼承凍結 D 線。
- Contract 驗證 D 線 head 及 merge-base。
- D 線不接受 APK OTA 回寫。

### E1｜Signed APK Manifest

- 獨立 `APK_OTA_PUBLIC_KEY_B64`。
- 獨立 `APK_OTA_HOSTS`。
- 獨立 `APK_OTA_MANIFEST_URL`。
- `SHA256withRSA` manifest 驗簽。
- Runtime OTA trust root 與 APK OTA trust root 不可混用。

### E2｜Stable Channel、下載及 Binary 驗證

- Stable envelope client。
- `apk.ota.check` 可回傳 `update_available` 或 `up_to_date`。
- `apk.ota.installLatest` 可從固定 stable channel 下載及安裝。
- App-private staging。
- HTTPS only／host allowlist。
- 禁止 redirect。
- Timeout、最大檔案大小及 signed bytes 核對。
- Android 6／API 23 相容 Content-Length 處理。
- SHA-256 實體檔案驗證。
- package=`hk.morefun.smt`。
- versionCode 核對。
- Android signing certificate SHA-256 及 continuity。
- Anti-downgrade／anti-replay。

### E3–E6｜Installer、Recovery、Capability

- Android Package Installer session。
- 使用者確認安裝流程。
- Device Owner 在 Android 12+ 實際要求 `USER_ACTION_NOT_REQUIRED`。
- Installer session 寫入／commit 失敗會 abandon session。
- Install result receiver 及持久診斷。
- Android 安裝確認頁啟動失敗會記錄錯誤。
- `MY_PACKAGE_REPLACED` 後 Bootstrap recovery。
- Device Owner／Profile Owner／普通確認／permission-required 能力偵測。
- 無 Device Owner／system privilege 時不宣稱靜默安裝。

### Bridge

- `apk.ota.getStatus`
- `apk.ota.getCapability`
- `apk.ota.check`
- `apk.ota.installLatest`
- `apk.ota.install`
- `diagnostics.get` 包含 `apkOta`

## 5. E5｜正式 Signed APK OTA Release Pipeline

Workflow：`.github/workflows/e-line-production-apk-ota-release.yml`

共用生成器：`android/generate-apk-ota-release.sh`

輸出：

- `morefun-smt-e-line-production.apk`
- `morefun-smt-e-line-production.apk.sha256`
- `morefun-smt-e-line-production.badging.txt`
- `morefun-smt-e-line-production.signature.txt`
- `apk-ota-manifest.json`
- `apk-ota-manifest.sig`
- `apk-ota-manifest.sig.b64`
- `stable-apk-envelope.json`
- `apk-ota-release-metadata.env`

流程：

1. 鎖死 checkout `e-line-apk-ota-v1`，禁止任意 source ref 使用 Secrets。
2. 驗證 D 線鎖定 head 及 E 線 merge-base。
3. 執行 E 線 Replacement Contract。
4. 從 Runtime private key 與 APK OTA private key分別導出 public key。
5. 將兩組獨立 trust root 寫入 BuildConfig。
6. 使用固定 Android keystore 簽署 APK。
7. 生成 package、version、minSdk、bytes、APK SHA、certificate SHA metadata。
8. 使用 APK OTA RSA private key簽署 compact manifest 原始 bytes。
9. 使用 public key再次驗證 signature。
10. 上載 90 日 immutable artifact。
11. 可選擇建立 GitHub Release 並發佈 `apk-ota-stable` raw channel。

需要 GitHub Secrets：

- `MOREFUN_RELEASE_PRIVATE_KEY_B64`
- `MOREFUN_APK_OTA_PRIVATE_KEY_B64`
- `MOREFUN_ANDROID_KEYSTORE_B64`
- `MOREFUN_ANDROID_KEY_ALIAS`
- `MOREFUN_ANDROID_STORE_PASSWORD`
- `MOREFUN_ANDROID_KEY_PASSWORD`

正式 signed workflow 未被手動觸發並成功前，不得聲稱正式 Production APK 已產出。

## 6. E7｜替代 D 線 Gate

Contract：`android/verify-e-line-replacement.sh`

Workflow：`.github/workflows/e-line-replacement-gate.yml`

強制條件：

- D 線 head 必須仍是 `0771e8d82b39485e30f8d8c21a1771311b70e452`。
- E 線 merge-base 必須是同一提交。
- D 線 Production Contract 必須通過。
- E 線 APK OTA Contract 必須通過。
- applicationId=`hk.morefun.smt`。
- minSdk=23。
- E 線 versionCode=4，versionName=`0.4.0-e-line`，可作為 D 線 versionCode 3 的升級。
- Debug 與 unsigned Release APK 必須可編譯。
- Signed Release workflow 必須包含 APK、SHA、certificate、manifest、signature、envelope 及 stable channel。
- Device Owner managed install path 必須存在。
- Release Pipeline Dry Run 必須存在並成功。

## 7. Release Pipeline Dry Run 證據

Workflow：`E-line APK OTA Release Pipeline Dry Run`

Run：`30412812264`

結論：SUCCESS

已實際完成：

- 臨時 Runtime RSA key。
- 臨時 APK OTA RSA key。
- 臨時 Android keystore。
- E 線 Release APK 編譯。
- APK 簽署及 certificate 讀取。
- APK manifest 生成。
- RSA manifest signature。
- Signature re-verification。
- Signed envelope 生成。
- applicationId、versionCode、versionName、minSdk、SHA、certificate SHA、bytes、issuedAt、mandatory 驗證。
- Artifact 上載。

Artifact：

- 名稱：`e-line-release-pipeline-dry-run-8`
- ID：`8709073361`
- Digest：`sha256:8625f639b2799774104999abef9643cc4d250009a6846ecc276a56b510de587f`
- 到期：2026-08-12

## 8. 最新 Replacement Gate 證據

Workflow：`E-line D-line Replacement Gate`

Run：`30412812277`

結論：SUCCESS

Artifact：

- 名稱：`e-line-replacement-37`
- ID：`8709072805`
- Digest：`sha256:bbf38ac0bc03b17c40fe6ba2a89da9c51bb6e8c6bf6d0c7fb9e5059dc071b7ae`
- 到期：2026-08-28

同批驗證：

- E-line APK OTA Contract：SUCCESS，Run `30412812289`
- Validate APK Foundation：SUCCESS，Run `30412812297`

## 9. 當前正式狀態

E 線已達到：

`Software Replacement Complete｜Release Pipeline Dry Run Passed｜Production Signing Pending｜Hardware Acceptance Pending`

解讀：

- E 線軟件及 CI 已可取代 D 線。
- D 線不再需要另外交付。
- 正式 signed production APK 尚未產出，因為需要正式 Secrets 並手動觸發 Production Workflow。
- 正式簽署完成後，只剩真實硬件驗收。

## 10. 禁止事項

- 禁止修改 D 線分支。
- 禁止將 APK OTA 與 Runtime OTA 使用同一 BuildConfig trust root。
- 禁止跳過 APK signing certificate continuity。
- 禁止 HTTP、任意 URL、任意 package 或任意簽章 APK。
- 禁止在沒有 Device Owner／系統權限時聲稱可靜默安裝。
- 禁止為了 OTA 重寫已完成的 Printer、Bridge、Runtime OTA 或 Recovery 架構。

## 11. 最終驗收剩餘項目

1. 設定正式 GitHub Secrets。
2. 手動執行 `E-line Production APK OTA Release`。
3. 確認正式 signed APK、manifest、signature、envelope 及 stable channel。
4. Sunmi T2S Android 11 安裝及升級。
5. Android 使用者確認安裝流程。
6. Device Owner／廠商權限能力實測。
7. 內置 Sunmi 打印。
8. LAN 單據打印機與標籤機。
9. 斷網、斷電、Boot、Package Replaced、Kiosk 及 Recovery。
10. A 線 Runtime OTA 與 E 線 APK OTA 並行、不互相污染。
