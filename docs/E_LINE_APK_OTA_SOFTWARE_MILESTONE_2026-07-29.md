# More Fun SMT｜E 線 APK OTA 軟件里程碑

日期：2026-07-29（Asia/Hong_Kong）

## 狀態

E 線已完整繼承凍結 D 線，並完成 Native APK OTA 軟件鏈。D 線仍維持在 `0771e8d82b39485e30f8d8c21a1771311b70e452`，未被修改。

- 分支：`e-line-apk-ota-v1`
- PR：#27
- applicationId：`hk.morefun.smt`
- minSdk：23
- versionCode：4
- versionName：`0.4.0-e-line`

## 已完成能力

1. Runtime OTA 與 APK OTA 獨立 trust root、host allowlist、manifest URL。
2. Signed APK manifest：RSA SHA-256、package、version、bytes、APK SHA-256、Android certificate SHA-256、minSdk、issuedAt、mandatory。
3. Anti-downgrade、anti-replay、HTTPS only、redirect 禁止。
4. App-private staging、timeout、容量限制、Content-Length 與實際 bytes 核對。
5. APK package、version、certificate continuity 驗證。
6. Android Package Installer、普通使用者確認及 Device Owner managed install request。
7. Session 失敗時 abandon、持久化安裝狀態及錯誤診斷。
8. `MY_PACKAGE_REPLACED` 後 Bootstrap recovery。
9. Stable envelope 自動檢查、`up_to_date`、`update_available`、`installLatest`。
10. Native Bridge：`apk.ota.getStatus`、`apk.ota.getCapability`、`apk.ota.check`、`apk.ota.installLatest`、`apk.ota.install`。
11. Signed Production APK OTA Release workflow 與 `apk-ota-stable` 發佈通道。
12. 正式 workflow 與 Dry Run 共用 `generate-apk-ota-release.sh`，避免測試與正式發佈邏輯偏差。

## 最新已通過 CI

- Validate APK Foundation：SUCCESS
- E-line APK OTA Contract：SUCCESS
- E-line D-line Replacement Gate：SUCCESS
- E-line APK OTA Release Pipeline Dry Run：SUCCESS

Dry Run 已實際完成：

1. 生成臨時 Runtime RSA key。
2. 生成獨立臨時 APK OTA RSA key。
3. 生成臨時 Android keystore。
4. 編譯 E 線 Release APK。
5. 使用 Android keystore 簽署 APK。
6. 驗證 package、versionCode、versionName、minSdk、APK certificate。
7. 生成 APK OTA manifest。
8. 使用 APK OTA private key 簽署 manifest。
9. 使用 public key 驗證 signature。
10. 生成及驗證 `stable-apk-envelope.json`。
11. 上載完整 Dry Run artifact。

CI 證據：

- Replacement Gate run：`30412812277`
- Release Pipeline Dry Run：`30412812264`
- APK OTA Contract run：`30412812289`

## 正式 Production APK 的唯一剩餘軟件外依賴

正式 workflow 需要下列 GitHub Secrets：

- `MOREFUN_RELEASE_PRIVATE_KEY_B64`
- `MOREFUN_APK_OTA_PRIVATE_KEY_B64`
- `MOREFUN_ANDROID_KEYSTORE_B64`
- `MOREFUN_ANDROID_KEY_ALIAS`
- `MOREFUN_ANDROID_STORE_PASSWORD`
- `MOREFUN_ANDROID_KEY_PASSWORD`

在正式 Secrets 未設定並手動執行 Production workflow 成功前，不得聲稱正式店舖簽章 APK 已產出。

## 剩餘驗收

軟件及 CI 已完成。剩餘工作只屬真實環境驗收：

1. Sunmi T2S Android 11 由 D 線／舊版升級至 E 線。
2. 普通裝置 Android 安裝確認。
3. Device Owner／Sunmi 廠商權限 managed install 實測。
4. 內置打印、LAN 單據打印及標籤打印。
5. 斷網、斷電、Boot、Package Replaced、Kiosk、Recovery。
6. A 線 Runtime OTA 與 E 線 APK OTA 並行驗證。

## 判定

E 線已通過軟件替代 D 線 Gate，可作為下一個唯一 SMT APK 基準。正式生產交付仍需固定正式金鑰產包及真機驗收。