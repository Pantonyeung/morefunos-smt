# More Fun SMT｜D 線里程碑與 E 線 APK OTA 接手文件

日期：2026-07-29（Asia/Hong_Kong）

## 1. 分支與邊界

- D 線：`d-line-production-integration-v1`
- D 線鎖定基準提交：`0771e8d82b39485e30f8d8c21a1771311b70e452`
- D 線 PR：#26
- E 線：`e-line-apk-ota-v1`
- E 線建立方式：直接由 D 線鎖定提交抽出。
- 硬規則：APK OTA 的任何新增、修改、測試、workflow、installer、manifest 或診斷，全部只可在 E 線進行；不得回寫、污染或重構 D 線。

## 2. D 線目前已完成里程碑

D 線定位：Android Native Host／Printer／Runtime OTA／Recovery／Production Integration。

已完成：

1. APK Foundation 與 Native Bridge。
2. LAN TCP、Label TCP、Sunmi runtime service binding。
3. Printer registry、routing、fallback、job status、diagnostics。
4. Offline queue 與 recovery。
5. A 線 Signed Web Runtime OTA：
   - HTTPS allowlist
   - SHA-256
   - RSA signature verify
   - bridge min/max compatibility
   - replay protection
   - version vault
   - pending health
   - timeout rollback
   - factory fallback
6. Boot Receiver、package replaced recovery、bootstrap safe fallback。
7. D-line Production Contract。
8. D-line Release Candidate Gate。

## 3. 已驗證 CI 證據

鎖定提交：`0771e8d82b39485e30f8d8c21a1771311b70e452`

- Validate APK Foundation：SUCCESS
- D-line Production Contract：SUCCESS
- D-line Release Candidate Gate：SUCCESS
- RC workflow run：`30406220777`
- RC artifact：`d-line-rc-2`
- Artifact ID：`8706660814`
- Artifact digest：`sha256:d58b8b6db0af992f0a88b8759528fcba0f20e12a5827a12367b5864a492a1b91`

RC artifact 包含：

- `app-debug.apk`
- `app-debug.apk.sha256`
- `app-release-unsigned.apk`
- `app-release-unsigned.apk.sha256`
- `app-release-unsigned.badging.txt`

注意：RC artifact 的 Release APK 是 unsigned。正式店舖安裝版需由 `Build Production APK` workflow 使用 More Fun 固定 Android keystore 簽署。

## 4. 問題一：D 線現在能否產出 APK 封裝文件

答案：可以。

現時已可產出：

- Debug APK
- Unsigned Release APK
- SHA-256 checksum
- APK badging
- RC ZIP artifact

正式 signed production APK 的 workflow 亦已存在，輸出設計包括：

- `morefun-smt-production.apk`
- `morefun-smt-production.apk.sha256`
- `morefun-smt-production.badging.txt`
- `morefun-smt-production.signature.txt`
- `morefun-smt-production.release.json`

正式 signed production APK 是否能即時生成，取決於 GitHub Secrets 是否已設定：

- `MOREFUN_RELEASE_PRIVATE_KEY_B64`
- `MOREFUN_ANDROID_KEYSTORE_B64`
- `MOREFUN_ANDROID_KEY_ALIAS`
- `MOREFUN_ANDROID_STORE_PASSWORD`
- `MOREFUN_ANDROID_KEY_PASSWORD`

D 線本身不再新增 APK OTA 功能。

## 5. E 線任務定義

E 線唯一目標：在不污染 D 線的前提下，建立 Native APK OTA 更新通道。

### Runtime OTA 與 APK OTA 必須分離

- A 線 Runtime OTA：更新 HTML／CSS／JavaScript／POS 業務流程，不重裝 APK；沿用 D 線既有能力。
- E 線 APK OTA：更新 Native Bridge、Printer Driver、Android Manifest、Boot／Kiosk、APK binary。

### E 線必做範圍

1. APK release manifest schema。
2. APK versionCode／versionName 比較。
3. HTTPS allowlist APK download。
4. 最大檔案大小與 timeout。
5. SHA-256 驗證。
6. APK package name 驗證：`hk.morefun.smt`。
7. APK signing certificate continuity 驗證。
8. 防 downgrade／防 replay。
9. Package Installer 接線。
10. Device Owner／普通裝置雙策略。
11. 無 Device Owner 時：下載後要求一次 Android 安裝確認。
12. 有 Device Owner／廠商授權時：研究並實作可行的 managed update。
13. 安裝結果、失敗原因、最後版本、下載進度、重試與診斷。
14. `MY_PACKAGE_REPLACED` 後健康檢查與 recovery。
15. E-line static contract、compile gate、RC gate。

## 6. E 線禁止事項

- 禁止修改 D 線分支。
- 禁止將 APK OTA 與 Web Runtime OTA 混成同一 manifest。
- 禁止跳過 APK signing certificate continuity。
- 禁止使用 HTTP。
- 禁止允許任意 URL、任意 package 或任意簽章 APK。
- 禁止在沒有 Device Owner／系統權限時聲稱可靜默安裝。
- 禁止為了 OTA 重寫已完成的 Printer、Bridge、Runtime OTA 或 Recovery 架構。

## 7. E 線首批 Gate

- E0：D-line baseline identity contract。
- E1：APK update manifest verifier。
- E2：download／hash／package／certificate verifier。
- E3：Package Installer human-confirm flow。
- E4：install result diagnostics。
- E5：package replaced recovery。
- E6：Device Owner capability detection。
- E7：E-line RC build and artifact。

## 8. 驗收原則

軟件部分先全部完成；最後只留下真實 Sunmi T2S／Android 11／硬件環境驗證。
