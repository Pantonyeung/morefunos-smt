# SMT Context Min｜新對話最小上下文

> 狀態：CURRENT / REPO HANDOFF ONLY
> 本文件不得高於 MoreFunOS Master Authority、Development Must Read、Current Development Registry 或 Document Authority Classification。

## 0. 開工前先讀中央 Authority

1. `Pantonyeung/morefunos/main/MOREFUNOS_MASTER_CONTROL_AUTHORITY.md`
2. `MOREFUNOS_DEVELOPMENT_MUST_READ.md`
3. `MOREFUNOS_CURRENT_DEVELOPMENT_REGISTRY.md`
4. `MOREFUNOS_DOCUMENT_AUTHORITY_CLASSIFICATION.md`
5. `MOREFUNOS_LEGACY_REFERENCE_INVENTORY.md`

之後先讀本 repo：

1. `AGENTS.md`
2. 三份 PRIMARY STANDARD
3. Component Ownership Registry
4. Engineering Success & Pitfalls
5. `SMT_CHANGE_IMPACT.md`
6. 最新 Code Map／Decision Ledger／Implementation Status／QA
7. active branch／PR／head evidence

## 1. Repo 定位

- Repo：`Pantonyeung/morefunos-smt`
- SMT register／mobile 共用同一 Shared Core。
- 舊獨立 SMM core：`SUPERSEDED AS INDEPENDENT CORE`。
- 本 repo 文件只管理 SMT domain；不得重新定義全系統 Auth、Order、Pricing、Sync、Firebase、Worker 或 Google Sheet Authority。

## 2. Legacy Reference Boundary｜強制

以下全部預設只屬 `REFERENCE ONLY / NON-AUTHORITY / DO NOT IMPLEMENT DIRECTLY`：

- WORK01／WORK02／WORK03；
- `TEST_WORK03_UNIFIED_LOGIN`、Session／Bootstrap／Push／Pull／Heartbeat／Fallback；
- Apps Script V1.x／RegisterHub／Staff Sync runtime；
- 舊 Google Sheet 主資料庫、即時 Order Truth、派號或同步 Authority；
- V42／SA2／EG，包括 `分支 · V42EG 設計與開發.txt`；
- Rebuild39／舊 A-B-C-D-E 線接手狀態；
- 舊 branch／PR／head／CI／QA snapshot；
- 舊 SMM independent architecture。

即使文件標題包含 `MASTER`、`FINAL`、`LOCK`、`CURRENT`、`READY` 或 `AUTHORITY`，亦不可自行升級。需要重新採用內容，必須建立 Re-adoption Proposal，逐條對標現行 Authority、Code、Contract、Security、QA 及 Device evidence。

## 3. Current SMT Evidence Boundary

- Baseline：`smt-functional-completeness-v1`。
- Main Candidate：`smt-main-candidate-v1`／PR #34。
- Current branch／PR／head 必須每次 fresh-read；本文件內任何 SHA 只係 checkpoint，唔係永久 latest。
- Software／Contract／Browser PASS 不等於 Device／Store／Production PASS。
- SUNMI 實體打印、APK OTA 實機、Production signing／release E2E 未有真實證據前，維持 `DEFERRED / NOT PRODUCTION READY`。

## 4. 現役跨端方向

- Firebase Auth
- Firebase Realtime Database
- Cloudflare Worker
- Google Sheet V2：ledger／reporting／non-blocking mirror only

Google Sheet 不得成為即時 Order Truth、Pricing Authority、正式派號、Payment Authority 或 Print Job Authority。Apps Script 只可作 legacy adapter／migration／reference，除非新 A 級決策重新啟用。

## 5. Targeted Failure

`單一問題 → isolate → reproduce → root cause → minimal fix → targeted verification → minimum regression → integration branch → one final gate`

禁止用完整 CI 反覆 debug；禁止 patch／override／第二套 Runtime Authority。

## 6. 下一步判斷

所有下一步必須由中央 Current Development Registry＋本 repo active branch／PR／head evidence共同決定。禁止由 WORK03、V42EG、Rebuild39、舊 Handoff 或 Drive／Jade 摘要直接推斷現役施工順序。
