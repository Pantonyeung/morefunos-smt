# More Fun SMT｜Main Candidate Clean Integration Log V1.1

狀態：`CURRENT / LONG-TERM HANDOFF / SOFTWARE GATE PASS / HARDWARE DEFERRED`
更新：2026-07-30 10:10 HKT

## 0. 低成本開發守則｜不可覆蓋

本文件係增量更新，**不得覆蓋或削弱** `MoreFunOS｜低成本 CI 與問題拆分開發強制規則 V1.0`。

固定流程：

```text
單一問題
→ isolate exact failing unit
→ reproduce
→ root cause
→ minimal fix
→ targeted verification
→ minimum affected regression
→ integration branch
→ one low-cost final gate
```

永久限制：
- 禁止用完整 CI 反覆 debug 單一問題。
- 文件／紀錄更新使用 `[skip ci]`，不得觸發完整 CI。
- Browser／E2E／APK／Signing 預設手動或 Release Gate。
- 同一 PR 使用 `concurrency`＋`cancel-in-progress: true`。
- 禁止 patch／override／大量 `!important`／第二套 Authority。
- 未有實機證據，不得將 Software PASS 寫成 Hardware／Production PASS。

## 1. Authority

- Repository：`Pantonyeung/morefunos-smt`
- Base Authority：`smt-functional-completeness-v1`
- Main Candidate：`smt-main-candidate-v1`
- Draft PR：`#34`
- Base SHA：`7e990adc7b8f7db3499b59c43636c1251603019b`
- Software Gate verified head：`9bad3a9c40d21a30b114824820ba3de8214a7b05`
- Documentation cleanup head：`379a9c7ebe7aa9f8b3e8b65a53db554c73c396f6`

## 2. 已完成整合

- Runtime／Offline／IndexedDB／Service Worker Authority 保留。
- APK signed manifest、anti-replay、anti-downgrade。
- APK envelope client、private staging、SHA-256 binary verification。
- packageName／versionCode／signing certificate continuity。
- Android Package Installer coordinator／result receiver／capability。
- APK OTA manager。
- Boot／package-replaced recovery。
- Runtime health timeout rollback。
- Native Bridge OTA／diagnostics/status API。
- ReleaseUpdateManager persistent status、issuedAt、anti-replay、timeout/cache hardening。
- Reflective SUNMI printer binding。
- NativePrintService／SunmiPrintDriver integration。
- Main Candidate static validation scripts。
- Manual low-cost GitHub Actions Gate。

## 3. 軟件 Gate 證據

### Run
- Workflow：`SMT Main Candidate Manual Gate`
- Run ID：`30505574564`
- Run number：`5`
- Conclusion：`SUCCESS`
- Job ID：`90754516056`

### 全部成功步驟
- Checkout candidate。
- Java 17。
- Android SDK setup。
- Android 36／Build Tools 36.0.0。
- Gradle 9.5.0。
- Static integration gate。
- Kotlin compile。
- Debug unit tests。
- Evidence artifact upload。

### Artifact
- Name：`smt-main-candidate-gate-5`
- Artifact ID：`8745190934`
- Artifact digest：`sha256:9e17352b81049b9c67787f17d114e3ab9812d7c56af9820a0cb7dc6e81b35b1a`
- Head SHA：`9bad3a9c40d21a30b114824820ba3de8214a7b05`
- Retention expiry：`2026-08-13`

## 4. 暫緩實機項目

因現時 POS／SUNMI 硬件故障，以下標記為：

`DEFERRED — HARDWARE UNAVAILABLE`

不是 Failed，亦不得刪除：

1. SUNMI 實機打印驗收。
2. Android Package Installer／APK OTA 實機安裝驗收。
3. Production signing／APK OTA release pipeline end-to-end dry run。

恢復條件：硬件修復或替代機到位後，另開 hardware acceptance 工作，不反向修改已 PASS 的軟件 Gate。

## 5. 踩坑與根因

### K-01｜驗證 script 掃描自己
- 現象：forbidden-pattern regex 本身包含禁詞，script 永遠 self-match。
- 根因：驗證範圍包含 verifier 自身。
- 正確修正：只掃 candidate configuration files。
- 禁止重試：不要為了避錯直接刪除 forbidden checks。

### K-02｜假設 repo 有 Gradle Wrapper
- 現象：`chmod gradlew` 直接失敗，Kotlin compile 根本未開始。
- 根因：repo 無 `android/gradlew`。
- 正確修正：沿用既有 Production workflow Authority：`setup-android`＋`setup-gradle@v4`＋`gradle -p android`。
- 禁止重試：不要額外生成另一套 wrapper／build authority。

### K-03｜Push-event Gate 無法由 connector完整觀察
- 現象：workflow 已觸發，但 connector只列 PR-event runs，無法取得 job/log evidence。
- 根因：工具可觀測性限制，不是 Gate code 錯誤。
- 正確修正：短暫加入一次性 PR trigger，取得 run/job/log/artifact 後立即移除。
- 成本控制：只跑一次；最後恢復 `workflow_dispatch` only。

### K-04｜第一次失敗不是編譯錯誤
- 現象：表面顯示 Compile Android candidate failure。
- 真根因：build command entry 不存在。
- 正確方法：讀取第一個 fatal log，再修執行入口；禁止未讀 log 就改 Kotlin。

## 6. 成功方法

- 不硬 merge 長期 diverged E-line。
- 保留 Runtime Authority，逐檔 clean integration。
- 先 static contracts，再 Android compile／unit tests。
- 每次失敗只修第一個 root cause。
- 以現有 production build workflow 作唯一 build pattern。
- 使用一次低成本 final Gate，取得可追溯 artifact digest。
- 完成後移除臨時 trigger，避免日後自動消耗 Actions。

## 7. 目前判定

| 層級 | 狀態 |
|---|---|
| Static contracts | PASS |
| Android Kotlin compile | PASS |
| Debug unit tests | PASS |
| Runtime／Offline Authority | PASS |
| APK OTA software contracts | PASS |
| Runtime recovery contracts | PASS |
| Native Bridge contracts | PASS |
| Native print static contracts | PASS |
| SUNMI physical print | DEFERRED |
| Package Installer physical OTA | DEFERRED |
| Production release E2E | DEFERRED |

## 8. 下一步

硬件修復前，不反覆跑同一 Main Candidate full Gate。

下一個 software-only工作應按 Current Development Registry 選擇尚未完成的單一 Domain；每條線維持 isolated branch／targeted test，最後先進 integration branch。

PR #34 在硬件驗收前維持 Draft／Hardware Deferred，不宣稱 Production Ready。