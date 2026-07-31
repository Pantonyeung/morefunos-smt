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

## Current next gate
Run latest-head targeted and minimum repository/browser regression, deploy current Pages Functions/Main Candidate preview, verify SMT→Mobile→Customer availability propagation and offline queue/re-login/token revoke, then complete real-device mobile, Android installer and SUNMI/printing acceptance when hardware is available.

## Documentation rule
This file is the only CURRENT SMT authority. All progress, pitfalls, successful methods, evidence, failures and remaining gaps must be appended only to `ENGINEERING_LOG.md`. Do not create new milestone, handoff, progress, pitfall, success, latest, final or checklist authority files. Existing documents and open domain PRs are reference/evidence only unless explicitly re-adopted here.
