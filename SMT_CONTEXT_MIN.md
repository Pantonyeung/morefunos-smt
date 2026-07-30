# SMT Context Min｜新對話最小上下文

你正在協助開發香港餐飲 POS「磨飯 SMT」。正式功能基準分支：`smt-functional-completeness-v1`。

## 開工必讀
任何 AI／Codex／Work 開始前先讀：
1. `AGENTS.md`
2. `docs/SMT_DEVELOPMENT_CHARTER_V1.0.md`
3. `docs/MFKG_STANDARD_V1.0.md`
4. `docs/SMT_ADAPTIVE_APPLICATION_STANDARD_V1.0.md`
5. `docs/SMT_COMPONENT_OWNERSHIP_REGISTRY_V1.0.md`
6. `docs/SMT_EXTERNAL_ENGINEERING_REFERENCE_STANDARD_V1.0.md`
7. `docs/qa/SMT_ENGINEERING_SUCCESS_AND_PITFALLS_V1.0.md`
8. `SMT_CHANGE_IMPACT.md`
9. 最新 `docs/qa/SMT_RUNTIME_PHASE3_QA.md`
10. `docs/SMT_MAIN_CANDIDATE_INTEGRATION_LOG_V1.1.md`
11. `MoreFunOS｜低成本 CI 與問題拆分開發強制規則 V1.0`

GitHub = 程式／工程 Authority；Google Drive = 後端／設定／歷史參考；Jade = AI 接手導航。禁止建立第二套真相。

## 低成本開發硬規則｜不可覆蓋

```text
單一問題 → isolate → root cause → minimal fix → targeted PASS → minimum regression → integration branch → one final gate
```

- 禁止完整 CI 反覆 debug 單一問題。
- 文件更新使用 `[skip ci]`。
- Browser／APK／Signing／Release Gate 預設手動。
- 禁止 patch／override／大量 `!important`／第二套 Authority。
- Software PASS 不等於 Hardware／Production PASS。

## 核心硬規則
- 1920×1080 = 唯一視覺封板模板；1600×900、1440×900、1366×768、1280×800 只做同一 App Adaptive Regression。
- 一項決策只可有一個 Authority；發現兩套 State／Domain／Visual／Payload 真相先收口再改功能。
- 程式存在 ≠ 自動測試 PASS ≠ Browser QA PASS ≠ 實機 PASS ≠ 最終 Lock。
- D-053：SMM 已合併入 SMT，同一 Application 內以 `register`／`mobile` Profile 共用 Shared Core。
- D-052：APK-first。先穩定 Android Shell／Bridge／Recovery／Update／Print 底層，再逐步接 Web／UI／業務模組。

# CURRENT｜2026-07-30 10:10 HKT

## SMT Adaptive／Browser
- SMT 自適應系統 V1.0 已完成：immutable baseline `bbecd4ce66802a9a78262abe9573615fa57bb360`。
- Browser Matrix：`78/78 PASS`。
- Stress Matrix：`5/5 PASS`。
- 此證據只覆蓋 Adaptive／Browser，不代表 Firebase、API、APK production、打印或實機完成。

## Main Candidate｜Runtime＋APK OTA＋Native Print
- Repository：`Pantonyeung/morefunos-smt`
- Candidate：`smt-main-candidate-v1`
- Base：`smt-functional-completeness-v1`
- Draft PR：`#34`
- Software Gate verified head：`9bad3a9c40d21a30b114824820ba3de8214a7b05`
- Documentation head：`13060888cbc634a257d9249aab03ba2e5a726fe7`

### 已完成
- Runtime／Offline Authority clean integration。
- APK OTA manifest／anti-replay／anti-downgrade。
- Download staging／SHA-256／package-version-certificate continuity。
- Package Installer coordinator／result receiver。
- Boot／package-replaced／runtime-health recovery。
- Native Bridge OTA／diagnostics。
- Reflective SUNMI printer binding。
- Manual low-cost Main Candidate Gate。

### Gate Evidence
- Workflow run：`30505574564`／Run #5／SUCCESS。
- Job：`90754516056`／SUCCESS。
- Kotlin compile：PASS。
- Debug unit tests：PASS。
- Artifact：`8745190934`。
- Digest：`sha256:9e17352b81049b9c67787f17d114e3ab9812d7c56af9820a0cb7dc6e81b35b1a`。
- 完整記錄：`docs/SMT_MAIN_CANDIDATE_INTEGRATION_LOG_V1.1.md`。

### Hardware Deferred
因 POS／SUNMI 硬件故障，以下不是 Failed，而是 `DEFERRED — HARDWARE UNAVAILABLE`：
1. SUNMI 實機打印。
2. Android Package Installer／APK OTA 實機安裝。
3. Production signing／release pipeline end-to-end dry run。

PR #34 在硬件驗收前維持 Draft，不宣稱 Production Ready。

## 今次重要踩坑
1. verifier 掃描自己造成 false failure；只可掃 candidate config。
2. repo 無 `android/gradlew`；Build 必須沿用 production Authority：`setup-android`＋Gradle 9.5＋`gradle -p android`。
3. Push-event run connector不可觀察；一次性 PR trigger取得 evidence後立即移除。
4. Compile step failure未必係 Kotlin；必須先讀第一個 fatal log。

## WORK03 Staff Sync 狀態
- Install：完成。
- Health：完成。
- API：`1.2.9`。
- Sync：`0.2`。
- Schema：`READY`。
- Password mode：`SHA256_FAST`。
- Auto Lock：關閉。
- Staff Login：`TEST_WORK03_UNIFIED_LOGIN` 進行中。
- 測試帳號：`morefun`／裝置 `dev-smt-main`／模式 `smt`。
- 下一步：Session／Bootstrap。
- 尚未開始：Push／Pull／Heartbeat／Fallback。

## 備份／Rollback
- `backup/apk-foundation-pre-android6-20260727`
- `backup/qa-runtime-before-browser-summary-20260727`
- 舊 APK artifacts 保留作 rollback，不可當 latest。
- Main Candidate Gate evidence保留至 `2026-08-13`。

## 下一步唯一原則
硬件未恢復前，不反覆跑已 PASS 的 Main Candidate full Gate。選擇下一個 software-only單一 Domain，隔離開發、targeted verification，完成後先進 integration branch。

任何 checkpoint 都假設下一句可能由另一個 AI 接手。最少保留：目標、Repo／Branch／PR、latest head、完成／未完成、CI／QA 層級、已知根因、禁止倒退事項、backup／rollback、下一步唯一優先、待實機 Gate。