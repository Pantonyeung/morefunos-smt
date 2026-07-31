# MoreFunOS SMM｜Current Port Authority

> Status: CURRENT / SINGLE SMM PORT AUTHORITY
> Updated: 2026-07-31 HKT
> Parent system: SMT Shared Core
> Global authority: `Pantonyeung/morefunos/main/MOREFUNOS_MASTER_KNOWLEDGE_AUTHORITY.md`

## Scope
SMM is the mobile operational port for remote/mobile staff use. It has its own UI, touch, viewport, navigation, session, availability and device-behavior knowledge, while reusing SMT Shared Core business logic.

## Locked boundary
- SMM is a distinct port, not a second business core.
- Business rules, cart, pricing, order, supply, permission, sync, audit and recovery remain shared with SMT.
- SMM may have port-specific UI, interaction, mobile layout, session and device acceptance rules.
- SMM must not fork pricing, order, availability or print authority.
- SMM may create Print Job/Command only; physical printing remains Android Host responsibility.
- Old `Pantonyeung/morefunos-smm` is migration/history only and must not be revived as an independent runtime core.

## Current development line
- Code authority: `Pantonyeung/morefunos-smt`
- Active branch: `smt-main-candidate-v1`
- Mobile entry/profile: shared SMT Mobile Profile
- Evidence boundary: source and targeted contracts exist; real iPhone/Android touch, viewport, session and cross-port staging acceptance remain pending.

## Knowledge lookup order
1. Read this SMM Port Authority.
2. Read `docs/ports/smm/ENGINEERING_LOG.md`.
3. If unresolved, read MoreFunOS integrated `ENGINEERING_LOG.md`.
4. If the issue is reusable technology, read the relevant document under `Pantonyeung/morefunos/shared-tech/`.

## Documentation rule
All SMM-specific progress, pitfalls, successful methods, evidence, failures and next actions are appended only to `docs/ports/smm/ENGINEERING_LOG.md`. Shared-core findings belong in SMT Log; cross-port findings belong in MoreFunOS Integrated Log; reusable mechanisms belong in Shared Tech.
