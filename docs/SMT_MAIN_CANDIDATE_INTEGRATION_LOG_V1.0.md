# More Fun SMT｜Main Candidate Clean Integration Log V1.0

更新：2026-07-30

## 唯一候選分支

- Repository：`Pantonyeung/morefunos-smt`
- Candidate：`smt-main-candidate-v1`
- Base：最新 `smt-functional-completeness-v1`
- Base commit：`7e990adc7b8f7db3499b59c43636c1251603019b`

## 整合策略

E-line 與最新 Runtime 主線已 diverged，各自 ahead/behind 76 commits，merge-base 為 `07bd89150c2e458b384e1025d280297fab8c708b`。禁止直接硬 merge。

採用 Clean Integration：

1. 保留最新 Web Runtime／Offline／IndexedDB／Service Worker Authority。
2. 移植 E-line 28 個純新增 Native APK OTA 檔案。
3. 8 個既有 Android Authority 逐項融合，不整檔覆蓋。
4. D-line／E-line 重型 workflow 不恢復自動 push／PR 觸發。
5. 完整驗收通過前不得合併 `main` 或宣稱 Production Release Ready。

## 已完成

- PR #30 Runtime＋長時間離線整合已合併至主整合線。
- 建立 `smt-main-candidate-v1`。
- 關閉直接比較 PR #33，保留審計。
- 已移植：
  - `ApkUpdateManifest.kt`
  - `ApkUpdatePolicy.kt`
  - `ApkUpdateManifestVerifier.kt`

## 待移植

- APK envelope client／download stager／binary verifier。
- Installer coordinator／result receiver／capability。
- APK OTA manager、Boot／Runtime health recovery。
- Release generator及驗證 scripts。
- E-line milestone／handoff文件。

## 待融合 Authority

- `android/app/build.gradle.kts`
- `android/app/src/main/AndroidManifest.xml`
- `BootstrapActivity.kt`
- `BridgeProtocol.kt`
- `NativePrintService.kt`
- `ReleaseUpdateManager.kt`
- `SunmiPrintDriver.kt`
- `.github/workflows/build-production-apk.yml`

## 最終驗收

- Node／Contract regression
- Runtime Offline targeted gate
- Full Browser Matrix
- Android Debug＋Release build
- E-line APK OTA contract
- E-line replacement contract
- Printer／Native Bridge contract
- Workflow trigger audit
- Secret／release boundary audit

任何 failure／flaky 均不得合併。
