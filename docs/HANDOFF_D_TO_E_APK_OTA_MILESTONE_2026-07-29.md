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

E 線完整繼承 D 線並增加 Native APK OTA。E 線通過 Replacement Gate 後，將成為唯一需要交付及安裝的 SMT APK；屆時不再需要另外提供 D 線 APK。

更新通道：

- A 線 Runtime OTA：HTML／CSS／JavaScript／POS 業務邏輯，不重裝 APK。
- E 線 APK OTA：Native Bridge、Printer Driver、Manifest、Boot／Kiosk、Android Host 及 APK binary。

## 4. E 線目前已完成

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

### E2｜下載及 Binary 驗證

- App-private staging。
- HTTPS only／host allowlist。
- 禁止 redirect。
- Timeout、最大檔案大小及 signed bytes 核對。
- SHA-256 實體檔案驗證。
- package=`hk.morefun.smt`。
- versionCode 核對。
- Android signing certificate SHA-256 及 continuity。
- Anti-downgrade／anti-replay。

### E3–E6｜Installer、Recovery、Capability

- Android Package Installer session。
- 使用者確認安裝流程。
- Install result receiver 及持久診斷。
- `MY_PACKAGE_REPLACED` 後 Bootstrap recovery。
- Device Owner／Profile Owner／普通確認／permission-required 能力偵測。
- 無 Device Owner／system privilege 時不宣稱靜默安裝。

### Bridge

- `apk.ota.getStatus`
- `apk.ota.getCapability`
- `apk.ota.install`
- `diagnostics.get` 包含 `apkOta`

## 5. E5｜正式 Signed APK OTA Release Pipeline

Workflow：`.github/workflows/e-line-production-apk-ota-release.yml`

輸出：

- `morefun-smt-e-line-production.apk`
- `morefun-smt-e-line-production.apk.sha256`
- `morefun-smt-e-line-production.badging.txt`
- `morefun-smt-e-line-production.signature.txt`
- `apk-ota-manifest.json`
- `apk-ota-manifest.sig`
- `apk-ota-manifest.sig.b64`
- `stable-apk-envelope.json`

流程：

1. 執行 D 線與 E 線 contracts。
2. 從 Runtime private key 與 APK OTA private key分別導出 public key。
3. 將兩組獨立 trust root 寫入 BuildConfig。
4. 使用固定 Android keystore 簽署 APK。
5. 生成 package、version、minSdk、bytes、APK SHA、certificate SHA metadata。
6. 使用 APK OTA RSA private key簽署 compact manifest 原始 bytes。
7. 使用 public key再次驗證 signature。
8. 上載 90 日 immutable artifact。
9. 可選擇建立 GitHub Release 並發佈 `apk-ota-stable` raw channel。

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

Replacement Gate 成功後，只代表軟件與 CI 已可取代 D 線；仍需實機驗收。

## 7. 禁止事項

- 禁止修改 D 線分支。
- 禁止將 APK OTA 與 Runtime OTA 使用同一 BuildConfig trust root。
- 禁止跳過 APK signing certificate continuity。
- 禁止 HTTP、任意 URL、任意 package 或任意簽章 APK。
- 禁止在沒有 Device Owner／系統權限時聲稱可靜默安裝。
- 禁止為了 OTA 重寫已完成的 Printer、Bridge、Runtime OTA 或 Recovery 架構。

## 8. 最終驗收剩餘項目

軟件及 CI 完成後，只留下真實硬件驗證：

1. Sunmi T2S Android 11 安裝及升級。
2. Android 使用者確認安裝流程。
3. Device Owner／廠商權限能力實測。
4. 內置 Sunmi 打印。
5. LAN 單據打印機與標籤機。
6. 斷網、斷電、Boot、Package Replaced、Kiosk 及 Recovery。
7. A 線 Runtime OTA 與 E 線 APK OTA 並行、不互相污染。
