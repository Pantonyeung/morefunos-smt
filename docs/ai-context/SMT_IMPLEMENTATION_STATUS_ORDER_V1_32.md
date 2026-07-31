# SMT Implementation Status Addendum｜order-v1-32

Date: 2026-07-31

This addendum supersedes the availability rows in `SMT_IMPLEMENTATION_STATUS.md`. All unrelated capabilities remain governed by the existing status file.

| Capability | Program status | Automated verification | Device / integration status | Product Lock |
|---|---|---|---|---|
| Shared SMT/SMM availability domain | Implemented on branch | Tests authored, not executed in current environment | Pending deployment and cross-device acceptance | Logic defined; not accepted |
| Staff availability API | Implemented in Admin Worker branch | Tests authored, not executed | Pending Cloudflare/Firebase acceptance | Not Lock |
| SMT Register sold-out writes | Existing UI connected to local-first runtime | Static/runtime tests authored | Pending T2S/iPad browser acceptance | Existing UI rules remain Lock |
| SMM Mobile sold-out writes | New official Mobile Profile surface implemented in SMT repo | Static profile test authored | Pending iPhone/PWA acceptance | Not Lock |
| Offline supply changes | Local write + de-duplicated pending queue implemented | Runtime test authored | Pending airplane-mode/reconnect acceptance | Rule defined; not accepted |
| Remote refresh | Staff GET, 15-second polling and online refresh implemented | Runtime test authored | Pending two-device acceptance | Not Lock |
| Customer propagation | Admin Public Runtime overlays live availability | Admin overlay test authored | Pending Admin + Customer deployment acceptance | Not Lock |
| 05:00 sold-out reset | Worker expiry + existing local business-day cleanup | Tests authored | Pending Hong Kong boundary acceptance | Business rule Lock |
| Paused supply persistence | Worker and local states retain until explicit restore | Tests authored | Pending device acceptance | Business rule Lock |

## Evidence boundary

- Code and test files exist on feature branches.
- Tests were not executed in this connector-only session.
- Cloudflare deployments were not verified.
- Firebase writes/reads were not observed from real devices.
- Therefore this addendum does not mark the capability complete or accepted.
