# More Fun／磨飯 SMT｜Module Completion Backlog V1.0

> 狀態：CURRENT / HANDOFF REQUIRED
> 日期：2026-07-27
> 目的：將「程式存在」同「產品真正完成」分開，作之後模組化開發、整合、QA、實機驗收唯一工作清單。

## 0. 狀態分級

每個模組只可標以下其中一級：

- `NOT_STARTED`：未有正式模組／入口。
- `CODE_EXISTS`：程式鏈路存在，但未證明完整。
- `CONTRACT_PASS`：Domain／Contract Test 通過。
- `BROWSER_PASS`：正式 Browser QA 通過。
- `DEVICE_ACCEPTANCE_PENDING`：自動化完成，仍欠 T2／T2S／新 POS 實機。
- `DEVICE_PASS`：指定實機通過。
- `PRODUCT_LOCKED`：產品負責人確認完成。

禁止將 `CODE_EXISTS`／`CONTRACT_PASS` 寫成「已完成」。

---

# P0｜目前最優先

## M-01｜五尺寸 Browser Regression／Adaptive QA

狀態：`CODE_EXISTS / LATEST EVIDENCE PENDING`

- 正式 Authority：`.github/workflows/qa-runtime-phase3.yml`。
- 尺寸：1920×1080、1600×900、1440×900、1366×768、1280×800。
- 最新正式 `SMT_RUNTIME_PHASE3_QA.md` 仍未追上 branch HEAD；未有新 `RESULT=PASS` 前禁止封板。
- 下一步：取得逐 spec PASS／FAIL／TIMEOUT；只修真實 fail spec 根因。

## M-02｜Required Flow／Checkout 前必選補齊

狀態：`CODE_EXISTS / PRODUCT INCOMPLETE`

已有：
- `pendingSummary`／`missingGroups`；
- Required 缺項會阻止 Checkout；
- 飲品 slot／assignment 基礎；
- 快捷模式未完成必選會留在 cart pending。

仍需完成／驗收：
- 統一「尚欠幾多／正在處理邊份／已完成邊份／尚欠乜」任務工作台；
- 固定順序處理 Required group，例如飯底 → 醬汁 → 小食 → 飲品；
- 多份產品快速連續補齊；
- 指定某一份產品再補選；
- Checkout 被阻止時直接帶入正確 Required Task，而唔只顯示摘要；
- Dirty／返回／保存退出跟全局 Modal 規則；
- 實機右手操作、密度、手感驗收。

正式 Authority：Order Domain／Order Page modal state；禁止另外建立第二套 pending state。

## M-03｜Link Up／指定配對／套餐組合工作台

狀態：`CODE_EXISTS / PRODUCT INCOMPLETE`

已有：
- `combineRiceballSet()`／`dissolveRiceballSet()`；
- automatic link-up；
- A–Z／Pairing 基礎；
- 已配對與餘量資料概念；
- Pairing Modal 已有獨立 Visual Authority。

仍需完成／驗收：
- 「必選補齊」與「可組合套餐」首層入口清晰分流；
- 自動組合 preview／確認；
- 指定配對完整 multi-target UX；
- 部分數量配對與剩餘數量清楚顯示；
- 套餐拆開／重配／改飲品／改小食後重新計價；
- 可重設實機測試情境；
- 業務規則及實機完整驗收。

## M-04｜Product Modifier／後台 Option Schema

狀態：`PARTIAL / BACKEND CONTRACT MISSING`

目前 option set 仍有前端資料／映射責任。

需完成：
- Required／Optional／Multi-select／排序／權重由正式 Admin/Menu Contract 提供；
- Product 詳情／修改／Required Flow 共用同一 option definition；
- UI 不自行寫死 option set；
- menu cache／offline fallback 保持同一 schema；
- schema version／migration contract。

## M-05｜正式 Checkout Commit／Order API

狀態：`LOCAL FLOW EXISTS / REMOTE COMMIT NOT CONNECTED`

需完成：
- 正式 Worker／Firebase order commit boundary；
- server-side reprice／validation；
- idempotent order commit；
- 成功／失敗／timeout／retry contract；
- local transaction 不可因遠端失敗無聲丟失；
- 正式永久 ID／跨終端每日流水原子派號。

## M-06｜Session／Staff Login／Bootstrap／Terminal Identity

狀態：`PARTIAL`

需完成：
- Staff Login 正式 API；
- Session restore／expire／logout；
- terminal registration／capability profile；
- startup bootstrap；
- SMM／SMT 共用 identity contract；
- offline fallback policy。

## M-07｜Offline Queue／Recovery

狀態：`PARTIAL`

需完成：
- order／print／sync pending queue；
- crash／重啟恢復；
- retry policy + idempotency；
- dead-letter／人工處理；
- local SQLite 正式 Authority 對齊；
- 網絡恢復後安全同步。

## M-08｜APK Controlled Update／Rollback

狀態：`FOUNDATION PLANNED / NOT COMPLETE`

需完成：
- Release Channel；
- Web Bundle Version；
- Bridge compatible min/max；
- integrity verification；
- staged update；
- previous-good rollback；
- offline verified bundle fallback；
- diagnostics 顯示 APK／Bridge／Web Bundle version。

---

# P1｜營運核心模組

## M-09｜Printer Module V1

狀態：`MODULE CODE EXISTS / CI + DEVICE PENDING`

- Transport／Media／Driver／Primary+Fallback／Renderer／Payload／Settings 已拆模組。
- ESC/POS raster + TSPL bitmap 為第一批 Renderer。
- LAN Native Binary Bridge Build PASS。
- 尚欠 Printer Contract 最新 CI、integration branch、五部實機出紙、中文／切紙／標籤／failover 驗收。

## M-10｜Pending Order Intake／Channel Adapter

狀態：`DEMO FLOW EXISTS / LIVE API MISSING`

需完成：
- More Fun Web/App incoming order；
- 電話／WhatsApp queue 正式建立；
- Foodpanda／Keeta adapter boundary；
- payment proof／reference data；
- accept／reject／核對／wait-time；
- new-order toast；
- 30 分鐘歸檔實機長時間驗收。

## M-11｜Soldout／Supply Live Sync

狀態：`LOCAL UI EXISTS / LIVE SYNC PARTIAL`

需完成：
- Admin → Firebase → SMT/SMM live propagation；
- soldout／paused version conflict；
- 開店自動恢復策略；
- purple-rice dedicated soldout；
- cross-terminal consistency；
- point-of-order preview／read-only soldout card 實機驗收。

## M-12｜Dine／Table Live Backend

狀態：`LOCAL CLOSED LOOP / REMOTE SYNC MISSING`

需完成：
- table session remote authority；
- QR incoming order；
- multi-device concurrency；
- split payment sync；
- table close／reopen audit；
- long-running cross-day recovery。

## M-13｜Reports／Day Close Remote Projection

狀態：`LOCAL FLOW EXISTS`

需完成：
- formal transaction source；
- remote mirror；
- shift/day-close audit；
- mismatch recovery；
- export／backup schema version；
- Google Sheet V2 projection 非阻塞同步。

---

# P2｜UI／Interaction Completion

## M-14｜Quick Drink Drawer 完整產品化

需驗：
- 收合／展開；
- 圖片開關無留白；
- 排序；
- 同款多配置；
- 左右內容提示；
- 快捷補 Required；
- anchor arrow；
- Drink Choice Card 單一 Component Authority。

## M-15｜Modifier／Popover Geometry

需驗：
- 25% bounded popover；
- 四方向定位；
- arrow 真正指向 trigger center；
- top／bottom safe boundary；
- content internal scroll；
- dirty exit；
- T2S 1280×800 密度。

## M-16｜Cart／Checkout Surface Completion

需驗：
- cart category grouping；
- input／organized view；
- `－ 數量 ＋ 修改` 同組；
- pending／draft／checkout 固定；
- long-cart 50-item stress；
- 25/75、30/70、32/68 實機；
- legacy Cart CSS physical removal。

## M-17｜Pending／Device／Online Status Cards

需驗／完成：
- pending two-section dynamic height；
- card height <= actual cart workspace；
- right-side single back action；
- device status；
- online order status；
- 2–3 秒 new-order notification。

## M-18｜Legacy Authority Physical Cleanup

狀態：`MIGRATION DEBT`

只准刪除／縮減：
- V1 Cart legacy page.css；
- V2 Drink Card legacy page.css；
- V9 Product Card legacy page.css；
- Pairing Modal legacy page.css。

每批清除後必須重新跑 1920 + five-size Browser Regression，禁止用 override 代替清理。

---

# 整合規則

1. 每個模組獨立完成 Domain／Contract／UI Adapter，不直接一次大改正式 Runtime。
2. Module Ready 後，由最新 `smt-functional-completeness-v1` 建 integration branch。
3. Integration 固定 Gate：Authority Audit → Full Node → Syntax → Five-size Browser → Device Acceptance（需要硬件者）。
4. 未經 Integration Gate 不合併 module branch。
5. 涉及 Native／permission／new hardware capability 才需要重新發 APK；純 Web module 走受控 Release Channel。
6. 每個 checkpoint 必須同步 `SMT_CONTEXT_MIN.md`、Implementation Status、Change Impact、Jade handoff。
