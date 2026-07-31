# MoreFunOS SMT｜Engineering Log

> Status: APPEND-ONLY CURRENT LOG
> Authority: `CURRENT_DOMAIN_AUTHORITY.md`
> Updated: 2026-07-31 HKT

## Permanent rule
All SMT Register, Mobile Profile and Android Host progress, pitfalls, successful methods, failures, verification evidence, deployment evidence, hardware evidence, remaining gaps and next actions must be appended to this file only.

No new standalone milestone, handoff, progress, pitfall, success, latest, final or verification-summary documents may be created. Existing documents are reference/evidence only. Periodic compaction may remove duplicates and obsolete text, while preserving decisions, root causes, evidence boundaries and rollback points.

---

## 2026-07-31｜Consolidation baseline

- Active branch: `smt-main-candidate-v1`
- Active PR: #34
- Observed head before consolidation: `879443a21de5bb34e798d1d4a3c773f14b3168f2`
- Register and Mobile share one Supply Runtime and one Staff API path.
- local-first availability and pending queue source exist.
- Android Host, installer recovery and printer integration source exist.
- Targeted contract evidence exists.
- Full latest-head regression, deployment, mobile device, Android installer, SUNMI printing and store acceptance remain pending.

### Pitfalls
- Never revive old SMM as a second independent core.
- Preserve local state and queue during network/server failure.
- Do not report browser evidence as device, printer, hardware or store evidence.

### Next action
Run current-head targeted and minimum regression tests, deploy the current preview, verify SMT→Mobile→Customer propagation, then complete device and printing acceptance when hardware is available.

---

## 2026-07-31 23:49 HKT｜Register＋Mobile Native Core Repair Intake

### 實機問題清單
1. Admin 售罄可同步 SMT 售罄頁及 Customer，但 SMT 點單頁售罄列表／產品卡未同步。
2. Admin 取消售罄後 SMT 售罄頁即時恢復，但點單頁仍 locked，不能正常銷售。
3. SMT 售罄頁曾因定時 reload 每隔一段時間閃動。
4. SMT 點單頁亦曾因狀態同步使用 reload 而整頁刷新。
5. `/smm` 入口無法提供真正手機版；曾把桌面 SMT 硬塞入手機／使用跳轉殼。
6. SMM 正確要求：除直接連實體打印機外，功能與 SMT 相同；打印只建立 Print Job，由 SMT／Android Host 靜默打印。
7. 售罄頁、點單頁、產品卡及 cart validator 未完全共用同一 canonical availability State。

### 已證實踩坑
- bridge script、capture click、MutationObserver、localStorage polling、`location.reload()` 都係補丁，已禁止。
- 售罄頁同點單頁各自 hydrate／映射會形成第二套 State；恢復供應時其中一頁會保持舊 lock。
- `/smm` redirect wrapper 或 iframe 唔係 Mobile Profile，只會隱藏真正架構問題。
- Customer Runtime field mapper 掛在頁面外層會造成未知產品、ID 不一致及錯誤阻擋。

### 成功方案／內核落點
- 唯一 Supply Runtime Store 直接持有 canonical availability；Register、Mobile、售罄頁、點單頁、產品卡、cart mutation 共用。
- API refresh／mutation 進入 Runtime Store；Store subscription 只局部 render，禁止 reload。
- `available` 必須原生移除 override，令產品卡及 cart validator 同步解鎖。
- SMT Mobile 係同一 Application Core 的 Mobile Shell／Profile；共享 Cart、Pricing、Order、Supply、Permission、Recovery。
- Mobile Print 只建立同一 Print Job Contract；Register／Android Host 靜默執行並回報結果。

### 回滾及證據邊界
- 工作只限 `smt-preview`。
- 已回退今輪新增補丁；Inherited `supply-page-bridge.js` 仍需移除／收口入核心。
- 目前只完成問題記錄及架構鎖定；尚未宣稱 Source、Contract、Browser、Device 或 Deployment PASS。
- 回滾點：`35a5283aa51d5ced8bd22b201bf4ac21e1227559`。

### 下一步
先追蹤 `shared/supply-runtime.js`、`pages/order/menu-api.js`、`pages/order/page.js`、`pages/soldout/page.js`、Shell Profile／Router 同 Print Domain，移除頁面 bridge，建立原生單一 State 流。

---

## 2026-07-31 23:58 HKT｜Native Supply Core＋Full Mobile Profile Implemented

### Source 修改
- `pages/order/menu-api.js` 改為直接消費 same-origin `/v1/runtime/customer`，不再讀舊 `public/catalogV1`。
- Customer Runtime 欄位在 Menu Domain 內正規化：名稱、價格、分類、圖片、描述、排序、canonical Product ID、availability。
- `shared/store.js` 將 `SUPPLY_STORAGE_KEY` 變成穩定共享 Domain Object；本機 mutation、跨 iframe／跨 context storage 更新都進入同一 State。
- `shared/runtime.js` Render Queue 原生訂閱 Domain State Event，只局部 render。
- 點單頁及售罄頁已移除 `supply-page-bridge.js`；舊 bridge 檔案已刪除。
- `pages/soldout/page.js` 重建為原生 Supply Domain Page，單選／批量／紫米售罄／恢復全部寫同一 canonical Store。
- 點單頁現有 `supplyStatus()`、產品卡 Disabled、售罄列表及 render key 直接讀同一 live object；恢復供應會刪除 override 並重新 render。
- `/smm` 由同一 SMT Shell 原生啟動完整 Mobile Profile，不再強制跳售罄頁。
- Mobile／Register 分開 terminal identity；Mobile 使用 `SMM-01`、`source=smm`、`printMode=remote-job`，Register 使用 `SMT-01`、`source=smt`、`printMode=local-host`。
- 根入口加入 `<base href="/">`，確保 `/smm` 正確載入 Shared Shell assets。

### 解決問題
1. SMT 售罄頁與點單頁共用同一 availability State。
2. 售罄商品卡及售罄列表可同步；恢復供應會立即解除 lock。
3. 售罄頁及點單頁不再因供應同步 reload／閃屏。
4. 未命名產品問題由 Menu Domain canonical mapper 解決。
5. `/smm` 恢復為完整 SMT Mobile Profile，而非售罄頁殼。
6. SMM 打印責任固定為建立 remote Print Job；實體打印仍屬 SMT／Android Host。

### 禁止方案確認
- 無 `fetch` monkey patch。
- 無 capture-phase 商品攔截。
- 無 UI `setInterval` 讀 localStorage。
- 無供應同步 `location.reload()`。
- 無 redirect wrapper／桌面頁硬塞手機。

### Evidence boundary
- Source implemented：PASS。
- GitHub combined status：無 status checks 回傳；不可宣稱 CI PASS。
- Cloudflare deployment／Browser／Mobile Device／Printer：待 Owner 驗收。

### 最新 Source head
- `cb222b2d1092a567341a3654655cfd6f6dcbec6e`（功能收口及刪除舊 bridge；其後只追加工程日誌）。
