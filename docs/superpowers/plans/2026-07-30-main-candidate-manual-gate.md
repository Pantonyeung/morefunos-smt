# SMT Main Candidate Manual Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立不依賴舊 D-line／E-line branch 名稱的 SMT Main Candidate 驗證 Gate，證明 Runtime、Offline、APK OTA、Recovery、Bridge 與 Native Print 可以在同一候選主線共存。

**Architecture:** Gate 分為靜態 production contract、APK OTA contract、候選主線聚合 Gate及手動 GitHub Actions workflow。所有日常 push／PR 不自動觸發完整 Gate；只由 `workflow_dispatch` 執行，以控制 Actions 成本。

**Tech Stack:** Bash、Gradle Android、GitHub Actions、Kotlin static contract checks。

## Global Constraints

- Authority branch：`smt-functional-completeness-v1`。
- Candidate branch：`smt-main-candidate-v1`。
- Application ID：`hk.morefun.smt`。
- minSdk：23。
- Runtime OTA 與 APK OTA 必須使用獨立 trust root。
- 不得回退 Offline Queue、Web Bundle vault、LAN TCP、Label、fallback routing。
- 完整 Gate 只能手動觸發。
- 未有 Gate 證據前 PR #34 保持 Draft。

---

### Task 1: Production Integration Static Contract

**Files:**
- Create: `android/verify-production-integration.sh`

**Interfaces:**
- Consumes: 現有 `verify-foundation.sh` 及 production Kotlin authority。
- Produces: exit code 0 與 `Production Integration static contract PASS`。

- [ ] 建立 required-file 檢查。
- [ ] 驗證 Runtime health、Boot recovery、SUNMI binding、Release anti-replay及 Bridge diagnostics。
- [ ] 拒絕 insecure HTTP、exact-alarm dependency及 unavailable SUNMI default。
- [ ] 執行腳本並保存結果。

### Task 2: APK OTA Static Contract

**Files:**
- Create: `android/verify-apk-ota.sh`

**Interfaces:**
- Consumes: Task 1、APK OTA Kotlin classes、Manifest及 Gradle BuildConfig。
- Produces: exit code 0 與 `APK OTA contract PASS`。

- [ ] 驗證 signed manifest及獨立 trust root。
- [ ] 驗證 private staging、SHA-256、package/version/certificate continuity。
- [ ] 驗證 Package Installer、user confirmation、Device Owner path及 recovery。
- [ ] 驗證 Native Bridge OTA methods及 diagnostics。

### Task 3: Main Candidate Aggregate Gate

**Files:**
- Create: `android/verify-main-candidate.sh`

**Interfaces:**
- Consumes: Task 1、Task 2、現有 foundation／printer／offline verifier。
- Produces:單一候選主線 PASS/FAIL。

- [ ] 驗證 versionCode >= 4、versionName = `0.4.0-main-candidate`。
- [ ] 執行 production integration及 APK OTA contract。
- [ ] 在存在時執行 printer、offline、browser matrix verifier。
- [ ] 檢查 Git diff 不包含舊 E-line branch hard lock。

### Task 4: Manual Low-Cost Workflow

**Files:**
- Create: `.github/workflows/main-candidate-manual-gate.yml`

**Interfaces:**
- Consumes: Task 3。
- Produces: Android compile與 contract evidence artifact。

- [ ] 只配置 `workflow_dispatch`。
- [ ] 設置 concurrency，取消同 branch 舊 run。
- [ ] 執行 static Gate。
- [ ] 執行 Gradle compile／unit tests。
- [ ] 上載 Gate log，retention 14日。

### Task 5: PR Evidence

**Files:**
- Modify: PR #34 body/comment only。

- [ ] 記錄新增 Gate commits。
- [ ] 保持 Draft。
- [ ] Gate 未成功前不標示 merge-ready。
