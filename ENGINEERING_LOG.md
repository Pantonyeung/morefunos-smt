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
