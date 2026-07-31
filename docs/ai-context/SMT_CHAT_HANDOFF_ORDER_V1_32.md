# SMT Chat Handoff｜order-v1-32 Shared Availability

## Current task

Connect SMT Register Profile and SMM Mobile Profile to one operational sold-out runtime, while Customer reads the same effective state.

## Repositories and branches

- Admin Worker: `Pantonyeung/morefunos-admin` / `feat/admin-p0-full-connect-v1`
- SMT authority: `Pantonyeung/morefunos-smt` / `feat/smt-order-page-v1`
- Customer: `Pantonyeung/morefun-ordering-web` / `feat/g1-customer-runtime-consumer-v1`
- SMM archive: `Pantonyeung/morefunos-smm` — migration source only; do not add a second core.

## Implemented program structure

### Admin Worker

- authenticated Staff Availability GET/PATCH API;
- SMT/SMM Staff Session validation;
- separate operational Firebase availability path;
- actor/source/device audit;
- Customer Runtime availability overlay;
- production/preview CORS for SMT/SMM.

### SMT application

- `shared/supply-runtime.js` local-first bridge;
- existing Register sold-out and order pages wired before UI boot;
- official Mobile Profile sold-out page;
- profile routing through `?profile=mobile#/soldout`;
- persistent offline queue and online flush;
- 15-second refresh polling.

### Customer

- Public Runtime client already consumes `runtime.availability` and `runtime.soldout`;
- latest valid full menu snapshot is stored locally for offline display;
- Customer remains read-only for supply state.

## Evidence boundary

- GitHub commits exist.
- Tests were authored but not executed in this connector-only session.
- No Cloudflare deployment evidence has been collected for this task.
- No real Firebase Staff Availability write/read has been observed.
- No two-device propagation or offline/reconnect acceptance has been completed.

## Next exact execution

1. Run Admin tests:

```bash
npm run test:staff-availability
```

2. Run SMT validation:

```bash
node scripts/validate-ai-context.mjs
node --test tests/*.test.mjs
```

3. Deploy latest Admin branch.
4. Deploy latest SMT branch.
5. Confirm an enabled Staff account can log in from both sources.
6. Register: set F4 sold out.
7. Mobile: confirm F4, then restore it.
8. Customer: verify F4 effective state.
9. Airplane mode: set another product sold out; confirm local UI and pending count.
10. Reconnect: confirm queue flush and all surfaces converge.
11. Verify 05:00 reset and paused persistence.

## Do not claim

- tests pass until commands are run;
- deployment completed until Cloudflare commit is verified;
- Firebase connected until Staff API writes and reads are observed;
- cross-device completion until SMT, SMM and Customer show the same state;
- final Lock until device and business acceptance are recorded.
