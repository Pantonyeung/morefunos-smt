# G1-F-01｜SMT／SMM Mainline Shared Sold-out Control

## Status

IMPLEMENTED ON SAFE MAINLINE FEATURE BRANCH — source wiring verified; automated tests, Cloudflare deployment, Firebase write/read, device propagation and offline/reconnect acceptance remain pending.

## Safe branch

`feat/g1-shared-availability-mainline-v1`

This branch was created from the latest SMT `main` at commit `4bef510524db49e4c0d503669dd97245542860de`.

At the first compare it was:

- ahead of main: 10 commits
- behind main: 0 commits

The older `feat/smt-order-page-v1` branch was 169 commits behind main and must not be deployed for this work.

## Authority

SMM is the Mobile Profile of the SMT application. Both profiles use one availability domain, Staff Session, Firebase operational path, audit trail and Customer propagation contract.

```text
SMT Register / SMM Mobile
  → local morefun:smt:v1:supply-overrides
  → pending morefun:staff:supply-pending:v1
  → PATCH /v1/staff/availability
  → Firebase operational availability
  → SMT/SMM GET refresh
  → Customer Public Runtime overlay
```

## Register Profile

The current mainline SMT shell remains unchanged apart from adding the supply shell bridge.

- root shell boots `shared/supply-shell-bridge.js`;
- shared runtime remains alive across the current double-iframe route system;
- existing `pages/soldout/` boots the same runtime before its current page implementation;
- remote changes reload only the active frame so the order/sold-out UI reads the latest local state.

## SMM Mobile Profile

Official entries:

- `/smm/`
- `/pages/mobile-soldout/`

The Mobile Profile provides:

- search and category filters;
- 今日售罄;
- 暫停供應;
- 恢復供應;
- purple-rice bulk sold-out / restore;
- live Admin Public Runtime catalog;
- latest local catalog fallback;
- same Staff login and same pending queue as SMT.

## Product ID compatibility

The Admin Worker resolves existing SMT/SMM IDs, product codes, SKU/barcode and legacy product IDs to the current Admin canonical product ID.

Staff API responses include canonical and alias rows so current Register IDs and new Mobile canonical IDs display the same state. Firebase operational storage and Customer Runtime remain canonical-only.

## Business rules

- `soldout` expires at the next Hong Kong 05:00.
- `paused` persists until explicit restore.
- `available` removes the override.
- offline changes remain visible locally and queue for later sync.
- Admin catalog publish/rollback must not overwrite operational availability.
- Customer is read-only and disables sold-out and paused products.

## Files

- `shared/supply-runtime.js`
- `shared/supply-shell-bridge.js`
- `index.html`
- `pages/soldout/index.html`
- `pages/mobile-soldout/index.html`
- `pages/mobile-soldout/page.js`
- `pages/mobile-soldout/page.css`
- `smm/index.html`
- `tests/supply-runtime-mainline.test.mjs`
- `tests/shared-availability-mainline-wiring.test.mjs`

## Verification boundary

Confirmed from GitHub source and branch compare:

- safe branch is based on latest main;
- no current SMT page JS/CSS was replaced;
- current sold-out UI is retained;
- shared runtime and Mobile Profile files exist;
- root shell and sold-out entry import the shared runtime.

Not yet confirmed:

- Node tests execution;
- Admin/SMT/Customer Cloudflare deployment;
- valid Staff login from real SMT/SMM;
- Firebase operational write/read;
- two-device convergence;
- Customer propagation;
- airplane-mode queue and reconnect;
- Hong Kong 05:00 boundary on real devices.

## Required acceptance

1. Run `node --test tests/supply-runtime-mainline.test.mjs tests/shared-availability-mainline-wiring.test.mjs`.
2. Deploy latest Admin branch.
3. Deploy this SMT branch.
4. Deploy latest Customer branch.
5. SMT `/pages/soldout/`: login and set one product sold out.
6. SMM `/smm/`: confirm and restore the same product.
7. Customer `/runtime-check` and `/menu`: confirm effective state and disabled selection.
8. Test offline local change, pending indicator and reconnect flush.
9. Verify paused persistence and sold-out reset at Hong Kong 05:00.
10. Record real commit IDs, Runtime version/checksum and screenshots before marking accepted.
