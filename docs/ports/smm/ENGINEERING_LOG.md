# MoreFunOS SMM｜Engineering Log

> Status: APPEND-ONLY SMM PORT LOG
> Authority: `CURRENT_PORT_AUTHORITY.md`
> Updated: 2026-07-31 HKT

## Permanent rule
All SMM-specific UI, mobile interaction, viewport, touch, session, device behavior, availability operations, failures, pitfalls, successful methods, evidence and next actions must be appended here only.

Shared business-core findings go to the SMT Engineering Log. Cross-port findings go to the MoreFunOS Integrated Engineering Log. Reusable technical mechanisms go to `Pantonyeung/morefunos/shared-tech/`.

---

## 2026-07-31｜SMM port documentation baseline

### Current model
- SMM is a distinct mobile port using SMT Shared Core.
- It reuses shared supply, permission, cart, pricing, order, sync, audit and recovery logic.
- It keeps port-specific mobile UI, touch, viewport, navigation, session and device acceptance knowledge.

### Current evidence boundary
Source and targeted contracts exist. Real iPhone/Android touch, viewport, re-login, offline queue and cross-port availability acceptance remain pending.

### Known pitfalls
- Do not revive the legacy SMM repository as a second runtime core.
- Do not duplicate pricing, order, supply or print authority in mobile-only code.
- Do not treat desktop/browser success as mobile touch or device acceptance.

### Next action
Verify Mobile Profile layout and touch behavior on real devices, then validate staff session, offline queue/re-login, availability mutation and SMT/Customer propagation.
