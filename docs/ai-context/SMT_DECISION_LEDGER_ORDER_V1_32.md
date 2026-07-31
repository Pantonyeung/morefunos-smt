# SMT Decision Ledger Addendum｜order-v1-32

This addendum is the current authority for SMT/SMM supply-state decisions.

| ID | Status | Decision | Evidence |
|---|---|---|---|
| D-054 | LOCKED | SMM is the Mobile Profile of the SMT application. It must share the same availability domain, Staff Session, API, storage contract, audit and recovery path; the archived SMM repository must not receive a second sold-out core. | SMM migration authority; `app-loader.js`; `pages/mobile-soldout/*` |
| D-055 | LOCKED | Both SMT Register and SMM Mobile may set `soldout`, `paused` and `available`. Customer is read-only and receives the effective state through Public Runtime. | `shared/supply-runtime.js`; Admin Staff Availability API |
| D-056 | LOCKED | Availability is operational runtime data stored separately from the versioned Admin catalog. Admin publish and rollback must not overwrite live shop-floor availability. | Admin Worker operational path + Customer overlay |
| D-057 | LOCKED | Supply control is local-first. A device writes its local state immediately; unavailable network/session produces a persisted de-duplicated queue; login/reconnect flushes the latest state per product. | `shared/supply-runtime.js` |
| D-058 | LOCKED | `soldout` expires at the next Hong Kong 05:00 business-day boundary. `paused` remains until an explicit restore. | Worker expiry and local cleanup |
| D-059 | CURRENT | Register and Mobile devices poll the shared Staff Availability API. Polling and local reload are an interim delivery method; a future realtime subscription may replace polling without changing the domain contract. | `shared/supply-runtime.js` |
| D-060 | CURRENT | Program implementation and authored tests are not deployment or device acceptance. Completion requires Admin deployment, SMT deployment, Staff login, Firebase evidence, two-device propagation, Customer propagation and offline/reconnect acceptance. | G1-F-01 milestone |
