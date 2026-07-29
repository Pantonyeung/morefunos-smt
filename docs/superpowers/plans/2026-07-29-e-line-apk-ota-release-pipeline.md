# E 線 APK OTA Release Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立獨立 Native APK OTA 金鑰、正式 signed APK release workflow、stable envelope 發佈及 E 線替代 D 線 Gate。

**Architecture:** 保留 D 線 Host 與 A 線 Runtime OTA，為 E 線加入完全獨立的 APK OTA BuildConfig、RSA manifest signing pipeline 與 replacement contract。正式 Android APK 使用固定 Android keystore；APK manifest 使用獨立 APK OTA RSA key。

**Tech Stack:** Android/Kotlin、Gradle Kotlin DSL、GitHub Actions、OpenSSL、apksigner、aapt、Python 3 JSON、Bash contracts。

## Global Constraints

- 工作分支只允許 `e-line-apk-ota-v1`。
- D 線凍結基準為 `0771e8d82b39485e30f8d8c21a1771311b70e452`。
- applicationId 必須是 `hk.morefun.smt`。
- minSdk 必須是 23。
- Runtime OTA 與 APK OTA 金鑰、host allowlist、manifest URL 必須完全分離。
- 無 Device Owner／system privilege 時不得聲稱靜默安裝。
- 正式 APK 必須使用固定 More Fun Android keystore。

---

### Task 1: 分離 APK OTA BuildConfig

**Files:**
- Modify: `android/app/build.gradle.kts`
- Modify: `android/app/src/main/java/hk/morefun/smt/ApkUpdateManifestVerifier.kt`
- Modify: `android/verify-apk-ota.sh`

**Interfaces:**
- Produces: `BuildConfig.APK_OTA_PUBLIC_KEY_B64`, `BuildConfig.APK_OTA_HOSTS`, `BuildConfig.APK_OTA_MANIFEST_URL`。

- [ ] 加入 Gradle properties：`morefunApkOtaPublicKeyB64`、`morefunApkOtaHosts`、`morefunApkOtaManifestUrl`。
- [ ] 在 debug/release buildType 生成三個 APK OTA BuildConfig fields。
- [ ] 將 `ApkUpdateManifestVerifier` 改為只使用 APK OTA fields。
- [ ] 擴展 `verify-apk-ota.sh`，拒絕 APK verifier 使用 Runtime OTA key。
- [ ] 提交 `feat(e-line): isolate APK OTA trust configuration`。

### Task 2: 正式 Signed APK OTA Release Workflow

**Files:**
- Create: `.github/workflows/e-line-production-apk-ota-release.yml`

**Interfaces:**
- Consumes GitHub Secrets：`MOREFUN_RELEASE_PRIVATE_KEY_B64`、`MOREFUN_APK_OTA_PRIVATE_KEY_B64`、`MOREFUN_ANDROID_KEYSTORE_B64`、`MOREFUN_ANDROID_KEY_ALIAS`、`MOREFUN_ANDROID_STORE_PASSWORD`、`MOREFUN_ANDROID_KEY_PASSWORD`。
- Produces: signed APK、APK checksum、badging、signature report、compact manifest、RSA signature、signed envelope。

- [ ] workflow_dispatch 只允許 source ref 預設 `e-line-apk-ota-v1`。
- [ ] 執行 D 線 production contract 與 E 線 APK OTA contract。
- [ ] 分別從 Runtime RSA key 與 APK OTA RSA key 導出 public key。
- [ ] 以兩組獨立 BuildConfig properties 編譯 Release APK。
- [ ] 解碼並驗證固定 Android keystore。
- [ ] 以 apksigner 簽署 APK並輸出 certificate report。
- [ ] 以 aapt 取得 package、versionCode、versionName、minSdk。
- [ ] 計算 bytes、APK SHA-256、certificate SHA-256。
- [ ] 生成 compact manifest，使用 APK OTA private key 簽署原始 manifest bytes。
- [ ] 生成 envelope 並使用 public key再次驗證 signature。
- [ ] 上載完整 immutable artifact，retention 90 天。
- [ ] 提交 `ci(e-line): add signed APK OTA release pipeline`。

### Task 3: Stable Release Publishing

**Files:**
- Modify: `.github/workflows/e-line-production-apk-ota-release.yml`

**Interfaces:**
- Produces: GitHub Release asset URL 與 `apk-ota-stable/releases/stable-apk-envelope.json`。

- [ ] 增加 `publish_release` boolean input。
- [ ] 使用 deterministic tag `smt-e-${versionCode}`。
- [ ] 建立或更新 GitHub Release 並上載 signed APK、manifest、envelope。
- [ ] manifest 的 `apkUrl` 指向 immutable GitHub Release asset。
- [ ] publish 時把 envelope 寫入 `apk-ota-stable` orphan／existing branch。
- [ ] workflow 權限只在 publish job 使用 `contents: write`。
- [ ] 提交 `ci(e-line): publish stable APK OTA channel`。

### Task 4: E 線替代 D 線 Gate

**Files:**
- Create: `android/verify-e-line-replacement.sh`
- Create: `.github/workflows/e-line-replacement-gate.yml`

**Interfaces:**
- Produces: `e-line-replacement-<run>` artifact 與 replacement PASS contract。

- [ ] contract 執行 `verify-production-integration.sh` 與 `verify-apk-ota.sh`。
- [ ] 檢查 merge-base 等於凍結 D 線 branch head。
- [ ] 檢查 APK OTA trust fields 完全獨立。
- [ ] 檢查 signed release workflow 包含 APK、manifest、envelope、certificate、SHA。
- [ ] CI 編譯 Debug 與 unsigned Release APK。
- [ ] aapt 驗證 package 與 minSdk。
- [ ] 上載 APK、checksum、badging 與 replacement report。
- [ ] 提交 `ci(e-line): add D-line replacement gate`。

### Task 5: Bridge 與診斷契約收口

**Files:**
- Modify: `android/verify-apk-ota.sh`
- Modify: `docs/HANDOFF_D_TO_E_APK_OTA_MILESTONE_2026-07-29.md`

**Interfaces:**
- Verifies: `apk.ota.getStatus`、`apk.ota.getCapability`、`apk.ota.install`、`diagnostics.apkOta`。

- [ ] static contract 驗證三個 Bridge methods 與五個 capabilities。
- [ ] handoff 文件更新 E5–E7 狀態、Secrets、release channel、硬件剩餘驗收。
- [ ] 提交 `docs(e-line): update release and replacement handoff`。

### Task 6: 驗證

**Files:**
- No source changes unless verification reveals a defect.

- [ ] 核對 PR #27 head SHA。
- [ ] 等待 `E-line APK OTA Contract` success。
- [ ] 等待 `E-line Replacement Gate` success。
- [ ] 檢查 artifacts 未過期且含 Debug／Release APK、checksums、badging、report。
- [ ] 檢查 D 線 branch head 未變。
- [ ] 僅在 Secrets 齊備並手動觸發後，才宣稱 signed production APK pipeline 實際成功。