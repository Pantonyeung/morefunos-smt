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
- Baseline: `smt-functional-completeness-v1`
- Register and Mobile share one Supply Runtime and one Staff API path.
- local-first availability and pending queue source exist.
- Android Host, installer recovery and printer integration source exist.
- Targeted contract evidence exists.
- Full latest-head regression, deployment, mobile device, Android installer, SUNMI printing and store acceptance remain pending.

### Pitfalls
- Never revive old SMM as a second independent core.
- Preserve local state and queue during network/server failure.
- Do not report browser evidence as device, printer, hardware or store evidence.

---

## 2026-07-31｜PR #30 Runtime＋Offline Endurance extraction

### Implemented source
- Adapter-neutral Runtime contract/controller/bootstrap.
- Local snapshot, heartbeat and version-conflict handling.
- Offline push queue and reconnect flush.
- IndexedDB full offline package and last-known-good generation.
- Service Worker app-shell cold-start support.
- Critical-write journal, replay boundary and pending acknowledgement tracking.
- Storage persistence/quota health and manual export/recovery paths.

### Evidence
- Targeted Offline Gate: 3/3 PASS.
- Full Browser Matrix: 81/81 PASS.
- Five viewport stress sizes passed in the recorded workflow.

### Boundary
Browser evidence does not prove abrupt power loss, prolonged device offline operation, storage pressure, Android restart or physical printing.

### Reusable mechanism
Extracted to `knowledge-base/03_SHARED_TECH/OFFLINE_JOURNAL_QUEUE_RECOVERY.md`.

---

## 2026-07-31｜PR #34 Main Candidate extraction

### Integration decision
Direct merge of diverged E-line and Runtime branches was rejected. The accepted method was clean integration: retain the latest Runtime authority, transplant purely additive OTA files and reconcile existing Android authority files individually.

### Shared Supply Runtime
- Register uses `source=smt`; Mobile uses `source=smm` as a profile identifier only.
- Both profiles share availability pages, Supply Runtime, Staff API and Firebase operational availability.
- Local-first state, pending queue and 15-second refresh source exist.
- Session is bound to source/profile and device identity.
- 401/403 clears invalid token while preserving local supply state and queue.
- Network/5xx retains offline-local operation.
- Login followed by queue flush must fail clearly when authenticated PATCH receives 401/403.

### APK/Android source
- Signed manifest, anti-replay and anti-downgrade source exist.
- SHA-256, package/version/certificate continuity and private staging source exist.
- Package Installer result recovery, boot/package-replaced recovery and Runtime health rollback source exist.
- Native Bridge diagnostics and reflective SUNMI printer binding source exist.

### Evidence boundary
Targeted isolated tests passed, but full repository regression, deployment, mobile/device acceptance, Android installer and physical printing remain pending.

### Rollback
Recorded pre-unification rollback branch: `backup/supply-runtime-pre-unified-20260731-v2`.

### Reusable mechanism
Extracted to:
- `knowledge-base/03_SHARED_TECH/SESSION_TOKEN_DURABLE_LOGIN_LIFECYCLE.md`
- `knowledge-base/03_SHARED_TECH/ANDROID_HOST_PRINT_AND_OTA_BOUNDARY.md`

---

## 2026-07-31｜PR #35 Remembered Staff Login extraction

### Active source decision
- Staff login uses six-digit staff number and six-digit numeric password.
- Legacy default `morefun / morefun` credentials are removed.
- Remember-login may preserve shell identity and signed session state across app closure or Android restart.
- Plaintext password must not be stored locally.
- Daily opening cash remains business-date state and is not recreated merely because shell login is restored.
- Disable/delete/password-reset/session-revoke must invalidate the local session on the next successful authority check.

### Evidence boundary
Source contract exists. Full Node suite, browser matrix, Android build, restart/power-cycle and staging revoke acceptance remain pending.

### Status
Active work under PR #35; not promoted to product/device acceptance.

---

## 2026-07-31｜CI control extraction

PR #31 and PR #32 changed expensive Android and Browser workflows from automatic push/PR triggers to manual final gates.

### Accepted method
- Develop with targeted local or Cloud Shell verification.
- Use `[skip ci]` for development documentation/control commits where appropriate.
- Retain deterministic workflow definitions and artifacts.
- Trigger the expensive final gate once after integration rather than using CI as an iterative debugger.

### Boundary
Manual CI control reduces cost but does not remove the requirement for final regression and acceptance.

---

## Current next action

1. Run latest-head targeted and minimum full regression on the current Main Candidate.
2. Deploy the current preview/Pages Functions line.
3. Verify SMT→Mobile→Customer availability propagation.
4. Test offline queue, re-login, token revoke and Hong Kong 05:00 business-date behavior.
5. Complete mobile device, Android installer, SUNMI and physical printer acceptance when hardware is available.
