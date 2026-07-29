# E 線 APK OTA Release Pipeline 設計

## 目標

建立一條與 A 線 Runtime OTA 完全分離的 Native APK 發佈通道，令 E 線可以安全產出、簽署、發佈及安裝 SMT APK，並在通過替代 Gate 後成為 D 線的唯一後繼版本。

## 架構

E 線保留 D 線全部 Android Host、打印、Kiosk、Boot、Runtime OTA、Offline Queue 與診斷能力；新增 Native APK OTA。Release Pipeline 使用獨立 APK OTA RSA 金鑰簽署 manifest，不重用 Runtime OTA manifest 或欄位。Android APK 本體仍使用固定 More Fun Android keystore 簽署。

發佈鏈：

1. GitHub Actions 從 `e-line-apk-ota-v1` 編譯 Release APK。
2. 使用固定 Android keystore 簽署 APK。
3. 讀取 package、versionCode、versionName、minSdk、APK bytes、SHA-256、Android signing certificate SHA-256。
4. 生成 compact JSON APK manifest。
5. 使用獨立 `MOREFUN_APK_OTA_PRIVATE_KEY_B64` 以 `SHA256withRSA` 簽署 manifest 原始 bytes。
6. 生成 envelope：`manifest` 字串＋Base64 signature。
7. 將 APK、manifest、envelope、checksum、badging、signature report 上載為 immutable artifact。
8. 可選擇建立 GitHub Release，並將 stable envelope 發佈到 `apk-ota-stable` 分支。

## 安全邊界

- Runtime OTA 使用 `RELEASE_PUBLIC_KEY_B64`、`RELEASE_HOSTS`、`RELEASE_MANIFEST_URL`。
- APK OTA 使用獨立 `APK_OTA_PUBLIC_KEY_B64`、`APK_OTA_HOSTS`、`APK_OTA_MANIFEST_URL`。
- APK OTA 必須驗證 RSA signature、HTTPS allowlist、applicationId、versionCode、bytes、SHA-256、minSdk、certificate SHA-256、anti-downgrade、anti-replay。
- APK binary 必須與目前安裝 APK 的 Android signing certificate continuity 一致。
- 無 Device Owner／system privilege 時，只能走 Android 使用者確認安裝；不得宣稱靜默安裝。

## 替代 D 線 Gate

E 線替代 Gate 必須同時通過：

- D 線 Production Contract。
- E 線 APK OTA Contract。
- Debug APK 與 unsigned Release APK 編譯。
- package=`hk.morefun.smt`。
- minSdk=23。
- E 線必須直接繼承凍結 D 線基準 `0771e8d82b39485e30f8d8c21a1771311b70e452`。
- E 線新增檔案只可屬於 APK OTA、Release Pipeline、Recovery、Bridge 或相關測試／文件。
- Signed Production workflow 必須生成 machine-readable manifest 與 signed envelope。

## Recovery

- Package Installer 狀態持久保存。
- `MY_PACKAGE_REPLACED` 記錄更新完成並重新啟動 Bootstrap。
- 下載中斷刪除 `.part` 檔。
- 安裝失敗保留 status、message、sessionId、targetVersion。
- 下一次啟動可由 Bridge 查詢 `apk.ota.getStatus`。

## 驗收標準

軟件驗收完成時，CI 必須能在無硬件環境下證明：

- E 線包含並保留 D 線全部軟件能力。
- APK OTA manifest、binary、installer、recovery、Bridge contract 均存在並可編譯。
- E 線 Replacement Gate 成功。
- 正式簽署 workflow 在 Secrets 齊備時可產出 signed APK 與 signed envelope。

最終仍需真實 Sunmi T2S、內置打印機、LAN 打印機、標籤機及 Android 安裝確認／Device Owner 實機驗收。