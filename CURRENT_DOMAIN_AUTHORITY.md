# MoreFunOS SMT｜Current Domain Authority

> Status: CURRENT / SINGLE DOMAIN AUTHORITY
> Updated: 2026-07-31 HKT
> Global authority: `Pantonyeung/morefunos/main/MOREFUNOS_MASTER_KNOWLEDGE_AUTHORITY.md`

## Scope
SMT Application and Hardware Plane only: Register UI, Mobile Profile, shared cart/pricing/order/supply domains, offline queue/recovery, Pages Functions proxy, Android Host, APK OTA, SUNMI/ESC-POS/TSPL printing and device diagnostics.

## Current development line
- Active branch: `smt-main-candidate-v1`
- Active PR: #34
- Current observed head: `879443a21de5bb34e798d1d4a3c773f14b3168f2`
- Baseline: `smt-functional-completeness-v1`
- Evidence boundary: shared supply Runtime and targeted contracts exist; latest-head full regression, deployment, mobile/device, Android and hardware acceptance remain pending.

## Locked authority
- Register and Mobile are two UI profiles of one SMT shared core.
- Old `morefunos-smm` is migration/history only and must not become a second core.
- SMT and Mobile share one Supply Runtime, Staff API, availability authority, cart, pricing, order, sync, permission, audit and recovery model.
- Mobile may create Print Job/Command but must not directly control a physical printer.
- Android Host owns native hardware execution and reports `printed | failed | retry`.
- Adaptive layout is not whole-page scaling; no second UI truth.
- Browser/software evidence must not be promoted to device/store evidence.

## Native Core Only｜SMT／Mobile 強制規則
- Register 同 Mobile 必須共用同一 Domain、Store、Runtime、Router、Cart、Pricing、Order、Supply、Permission、Audit、Recovery 同 Print Job Contract；Mobile 只在 Profile／Layout／硬件能力邊界不同。
- SMM／Mobile 必須係真正 Mobile Profile／Mobile Shell；禁止 iframe、redirect wrapper、跳轉殼或將桌面 SMT 版面硬塞入手機。
- Catalog、Availability、Cart、Order 同 Print 必須直接接入原生 `menu-api`、Domain、Store、Page State、Router、Supply Runtime 同 Print Domain。
- 禁止額外 bridge／guard／compatibility script、monkey patch、覆寫 fetch／全域函數、capture-phase 點擊攔截或模擬第二次 click。
- 禁止 MutationObserver／DOM 掃描／文字反推去補自己已有 State；禁止 `setInterval` 輪詢 DOM／localStorage 作 UI 同步。
- 禁止 `location.reload()`、iframe reload、整頁重建或重新初始化所有 Page 作 Runtime 同步；Availability 更新必須由 Store subscription 局部 Render。
- 點單頁、售罄頁、售罄列表同產品卡必須使用同一 canonical product ID 同 availability State；恢復供應後由同一 Store 原生解除鎖定。
- SMT Mobile 打印必須建立 Print Job／Command，由 SMT Android Host／Register-side Print Runtime 靜默執行並回報狀態；Mobile 不得直接連接打印機。
- 發現兩個 Layer 同時擁有同一狀態或行為決定權時立即 STOP，先收口 Authority；第一個 Fix 無效時禁止疊第二層 Patch。
- 發現既有補丁時先回退／移除，再做內核修正。

## Current next gate
Run latest-head targeted and minimum repository/browser regression, deploy current Pages Functions/Main Candidate preview, verify SMT→Mobile→Customer availability propagation and offline queue/re-login/token revoke, then complete real-device mobile, Android installer and SUNMI/printing acceptance when hardware is available.

## Documentation rule
This file is the only CURRENT SMT authority. All progress, pitfalls, successful methods, evidence, failures and remaining gaps must be appended only to `ENGINEERING_LOG.md`. Do not create new milestone, handoff, progress, pitfall, success, latest, final or checklist authority files. Existing documents and open domain PRs are reference/evidence only unless explicitly re-adopted here.
