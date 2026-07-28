# More Fun SMT｜A／B／C 分線接手文件 V1.0

狀態：CURRENT / HANDOFF AUTHORITY
更新日期：2026-07-28
Repo：`Pantonyeung/morefunos-smt`
正式 baseline：`smt-functional-completeness-v1`

## 共同硬規則

1. 每個對話只行一條主線，禁止同一對話同時推 A／B／C。
2. 所有 FAIL／TIMEOUT 必須依 `docs/SMT_TARGETED_FAILURE_PROTOCOL_V1.0.md`：
   `FAIL → isolate exact part → reproduce only that part → root cause → minimal fix → isolated PASS → minimum regression → final integration once`。
3. 每個可驗證修改節點必須同步：GitHub＋Google Drive＋Jade Note；三邊缺一不算完成。
4. A 線未完成 Final Integration PASS 前，B／C 可獨立開發及 Contract／Build Gate，但禁止合併正式 baseline。
5. 禁止為 QA 綠燈倒退 Runtime、1920×1080 visual lock、Adaptive Core 或 CURRENT Authority。

---

## A 線｜Browser QA／Adaptive Regression

### 對話任務
只處理 A 線，直到所有 isolated failed specs PASS，再跑一次 Final Integration Gate。

### Branch／PR
- Branch：`qa-root-cause-fix-v1`
- Draft PR：#22 `QA Root Cause Fix V1｜正式五尺寸根因修正`
- Targeted workflow：`.github/workflows/qa-targeted-spec.yml`
- Current target marker：`.qa-target`
- Result marker：`.github/qa-targeted-last-result.txt`
- Diagnosis log：`docs/qa/SMT_TARGETED_FAILURE_LOG.md`

### 已完成
- `tests/dev-preview.spec.js` isolated PASS。
- Evidence：run `30329681659`，2/2 PASS，2.6 秒。
- Root cause：測試揀完第一個尺寸後冇返回 chooser，直接 click 已隱藏第二個尺寸；Runtime 正確。
- Fix commit：`bf7cb23795178f8a4a73247e4921657b1b10d7d6`。

### 目前唯一 target
- `tests/proportional-layout.spec.js`
- Latest run：`30329898771` = FAILURE。
- 第一個共通根因：test 仍等待 Parent Shell 舊 selector `[data-action="open-settings"]`；CURRENT Shell proxy 使用 `[data-shell-action-id="open-settings"]`。
- 12 個 test 中，11 個主要被 stale settings selector 擋住；最後一個 footer width ratio assertion（received 3.2109375，old threshold >3.4）係獨立第二問題，禁止同第一刀混改。
- 下一步：只修 stale shell selector → 只 rerun `proportional-layout.spec.js` → 再根據新結果處理下一個首次失敗 assertion。

### A 線完成條件
1. `dev-preview.spec.js` PASS。
2. `proportional-layout.spec.js` PASS。
3. `responsive-visual-contract.spec.js` PASS。
4. `stress-responsive-matrix.spec.js` PASS。
5. 其他已知功能／Authority specs 維持 PASS。
6. 最後才更新 `.browser-qa-final-trigger`，跑一次完整 `.github/workflows/qa-runtime-phase3.yml`。

---

## B 線｜Business Modules／Printer／Incoming Queue

### 新對話開場指令
「你只接 B 線。先讀 `AGENTS.md`、`SMT_CONTEXT_MIN.md`、`docs/SMT_PARALLEL_LINE_HANDOFF_V1.0.md`、`docs/SMT_TARGETED_FAILURE_PROTOCOL_V1.0.md`。禁止處理 A／C，禁止合併 baseline。每個修改同步 GitHub＋Google Drive＋Jade Note。」

### 現況
- Required Flow PR #20：Contract PASS，run `30271439582`。
- Order Recovery PR #23：Contract PASS，run `30315885054`。
- Printer PR #17：branch `printer-transport-settings-v1`，head `60da241bd1d77c8095f40cdca4cb51d7c265db32`；需要取得最新 self-verifying Printer Contract evidence。
- Incoming Queue PR #24：branch `incoming-queue-domain-v1`，head `17f0b9a2d2a1df461b8c5ad1fb465bf293e32013`；需要取得最新 Incoming Queue Contract evidence。

### B 線規則
- 每次只處理一個 module gate。
- Printer／Incoming Queue 冇最新 PASS evidence 前不得寫完成。
- A Final Integration PASS 前不得合併 baseline。

---

## C 線｜APK Foundation／Production Signing／Public Runtime Update

### 新對話開場指令
「你只接 C 線。先讀 `AGENTS.md`、`SMT_CONTEXT_MIN.md`、`docs/SMT_PARALLEL_LINE_HANDOFF_V1.0.md`、`docs/SMT_TARGETED_FAILURE_PROTOCOL_V1.0.md`。禁止處理 A／B。每個修改同步 GitHub＋Google Drive＋Jade Note。」

### Branch／PR
- Branch：`apk-foundation-v1`
- Draft PR：#19
- Production workflow：`.github/workflows/build-production-apk.yml`（trigger file 位於 baseline）
- Result marker：`.github/production-apk-last-result.txt`

### 已確認
- 5 個 signing secrets 均存在。
- Web release private key 可成功推導 public key。
- Release APK build PASS。
- 第一個真正失敗 Gate：`Decode Android keystore`。
- run `30324446035`：decode FAIL。
- run `30327307684`：清 whitespace 後仍 decode FAIL。
- run `30327777075`：兼容 prefix／quotes 後仍 failure marker。
- Alias／APK path／apksigner 尚未執行，不可處理後面步驟。

### C 線下一步
只針對 `MOREFUN_ANDROID_KEYSTORE_B64` 做不洩漏 secret 的 metadata diagnosis：長度、字符集、base64 padding、decode exit code；確認係 secret copy content 錯誤後，才要求重新貼正確 keystore base64。禁止重建整個 APK pipeline。

### C 線未完成
- Production APK signed artifact。
- Signed Web Runtime Publish end-to-end。
- Stable envelope 真實發布。
- T2 Android 6／T2S Android 9／Android 11 三機實機 Gate。

---

## 真相層級

1. GitHub CURRENT code／workflow／CI evidence。
2. Google Drive：長期工程 checkpoint／後端參考。
3. Jade Note：AI 接手導航與摘要。
4. 舊聊天摘要不可覆蓋 fresh-read GitHub evidence。
