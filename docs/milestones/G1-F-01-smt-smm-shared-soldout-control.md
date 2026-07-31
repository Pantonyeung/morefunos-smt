# G1-F-01｜SMT／SMM Shared Sold-out Control

## Status

IMPLEMENTED ON FEATURE BRANCH — static and runtime tests authored; local test execution, Admin deployment, SMT deployment, Staff login, offline/reconnect and cross-device browser acceptance remain pending.

## Authority

Repository: `Pantonyeung/morefunos-smt`

Branch: `feat/smt-order-page-v1`

Build: `order-v1-32`

SMM is the Mobile Profile of the SMT application. It does not create a second availability domain, API, storage contract or business authority.

## User requirement

Both SMT and SMM can control:

- 今日售罄
- 暫停供應
- 恢復供應
- 紫米產品批量售罄／恢復

Customer reads the same effective state from Public Runtime.

## Local-first operation

Every operation writes the shared local key immediately:

`morefun:smt:v1:supply-overrides`

If the network or Staff Session is unavailable:

- the local device remains operable;
- the latest change is queued in `morefun:staff:supply-pending:v1`;
- the UI exposes offline/pending state;
- reconnect or login flushes the latest state per product.

## Shared Staff runtime

`shared/supply-runtime.js` provides:

- Staff login/session persistence;
- local change capture;
- de-duplicated pending queue;
- PATCH sync to `/v1/staff/availability`;
- GET refresh from `/v1/staff/availability`;
- 15-second polling;
- online reconnect flush;
- remote-change notification;
- shared register/mobile profile detection.

## Register Profile

Existing SMT pages remain the operational UI:

- `pages/soldout/index.html`
- `pages/soldout/page.js`
- `pages/order/index.html`
- `pages/order/page.js`

The runtime boots before the legacy page so both pages receive the latest local/remote supply state.

## Mobile Profile

Official SMM supply management now lives inside the SMT repository:

- `pages/mobile-soldout/index.html`
- `pages/mobile-soldout/page.js`
- `pages/mobile-soldout/page.css`

Open the SMT application with:

```text
?profile=mobile#/soldout
```

The Mobile Profile uses the same Staff Session, local storage keys, pending queue and Worker endpoints as the Register Profile.

## Business rules

- 今日售罄 resets at Hong Kong 05:00.
- 暫停供應 persists until restored.
- Offline changes remain visible locally and are queued.
- A remote change refreshes the local supply key and reloads the affected surface.
- Product content, category, price and options remain Admin/catalog responsibilities; these pages only change supply state.

## Tests authored

- `tests/supply-runtime.test.mjs`
- `tests/mobile-soldout-profile.test.mjs`

The tests have not been executed in the current connector-only environment. No pass claim is recorded.

## Key commits

- supply runtime tests: `fb4c5b219ed9eaea3f3aa70145b4bbbdc9d8e6d0`
- shared supply runtime: `357c7b55e9462e84bb601984da4d33ec6c8c5252`
- keyed local-state normalization fix: `f59a30e3c78e97c8ccf4a2671ec22667a4b95d06`
- Register soldout wiring: `82997962e15580d035c511eb56b3b4aa9b20f095`
- Register order wiring: `5bac6b4292505267662b90ec4c8bb2e043b474a0`
- Mobile Profile routing: `e26d8cfe50194c6018d2c6a04bc0f74323425fdc`
- portrait shell support: `7542b411d9cc3bd18f911b7a69f9071ea47d6279`
- mobile surface: `c403eab81ffe6e4d2b1f0b94012cbbfe16a36fd6`, `c94c06e54c595bc00ee96aac97258c3e6e3d66fe`, `6f730568f265ca9d8ba323fb6e3757cea81f7713`
- Mobile Profile regression test: `16e7cbbb5a62460f3a494520de5dc767e93fbdd6`

## Required acceptance

1. Deploy latest Admin and SMT branches.
2. Open Register Profile `#/soldout`.
3. Log in with a Staff account and set F4 to 今日售罄.
4. Open Mobile Profile `?profile=mobile#/soldout` and confirm F4 state.
5. Restore F4 from Mobile Profile and confirm Register Profile updates.
6. Open Customer `/menu` and confirm F4 cannot be selected.
7. Disconnect Mobile Profile, set a product to sold out and confirm a pending indicator.
8. Reconnect and confirm the queued update reaches Register and Customer.
9. Verify 05:00 reset and paused persistence.
10. Run `node scripts/validate-ai-context.mjs` and `node --test tests/*.test.mjs` before any completion claim.
