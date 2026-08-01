# MoreFunOS SMT｜Current Domain Authority

> Status: CURRENT / SINGLE DOMAIN AUTHORITY
> Updated: 2026-08-01 HKT
> Global authority: `Pantonyeung/morefunos/main/MOREFUNOS_MASTER_KNOWLEDGE_AUTHORITY.md`
> Approved design: `Pantonyeung/morefunos/main/docs/superpowers/specs/2026-08-01-unified-menu-authority-design.md`
> Approved implementation plan: `Pantonyeung/morefunos/main/docs/superpowers/plans/2026-08-01-unified-menu-authority-implementation.md`

## Scope
SMT Application and Hardware Plane only: Register UI, Mobile Profile, shared cart/pricing/order/menu domains, offline queue/recovery, Android Host, Print Job and device diagnostics.

## Unified Menu Authority
- 全系統只存在一份 Unified Menu 及一個 canonical Product ID。
- SMT／SMM 必須讀取同一份 Product；禁止本機 catalog、availability map 或 SMM menu 成為正式 Authority。
- SMT／SMM Staff 只可修改：
  - `status`: `available | soldout | paused`；
  - `presentation.operations`: `visible/categoryId/categoryOrder/productOrder`。
- SMT／SMM 禁止新增／刪除產品、改價、改產品規則、改 Customer presentation、永久停用或修改產品打印配置核心。
- SMM 完全跟隨 SMT operations presentation，不得建立第三套分類或排序。

## Product Consumption
每款產品由同一 Product 提供：
- core／options／status；
- operations presentation；
- 內部簡稱；
- 製作單、打包單、飯團標籤、外賣標籤打印指令資料；
- reporting tags。

展示分類只影響操作畫面位置，不可改變 productType、選項、套餐、價格或打印規則。

## Offline Boundary
- 本機只保存最近一次完整有效菜單、version、checksum、updatedAt 及 Pending Queue。
- 無效、半套、checksum 錯誤資料不得覆蓋 Last Known Good。
- 離線 status／operations mutation 必須持久保存；重連及重新登入後經 Worker 自動同步。
- version conflict 不得靜默覆蓋 Admin 新資料，必須停止並要求重新套用。

## Official Order Boundary
Customer 網站／WhatsApp 只係落單意向。SMT 必須重新檢查最新 Unified Menu、價格、供應、選項及套餐，再建立正式 Order。

## Native Core Only
- Register 與 Mobile 共用同一 Domain、Store、Menu Runtime、Router、Cart、Pricing、Order、Permission、Audit、Recovery 及 Print Job Contract。
- 禁止 iframe、redirect wrapper、桌面 UI 硬塞手機、bridge、guard、monkey patch、DOM scan、capture interception、UI polling、reload 或第二套 State。
- 點單頁、售罄頁、產品卡、購物車 validator 必須讀同一 Unified Menu Store。
- Mobile 只建立 Print Job；實體打印由 Android Host／Register Print Runtime 執行。

## Current next gate
依照 approved implementation plan 執行 Shared Unified Menu Core、Operations mutation、Last Known Good／Queue、SMM shared profile，再做四端 staging／device acceptance。

## Documentation rule
本文件係唯一 CURRENT SMT Authority。進度、踩坑、成功方法、證據、失敗及未完成邊界只可追加到 `ENGINEERING_LOG.md`；禁止新增平行 milestone／handoff／latest／final authority 文件。
