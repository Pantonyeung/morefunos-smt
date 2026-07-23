# MoreFun OS｜Unified SMT + SMM Routing Notes

## Purpose

One deployment URL now exposes both operational surfaces:

- `/pages/order/index.html` — SMT true machine page for Sunmi T2S 1280×800.
- `/smt-preview/index.html` — iPhone/iPad yellow-frame preview adapter for SMT boundary checks.
- `/smm/index.html` — SMM mobile-first management shell.
- `/` — unified entry selector.

## Device separation

SMT remains the print execution authority. SMM must not open TCP/USB/Bluetooth printer connections directly. SMM may inspect, create, retry, cancel, or reroute print jobs. The SMT Android host receives jobs, prints silently, and reports the actual result.

## Sequence number direction

Putting SMT and SMM under the same origin is the first step toward one order-number authority. The preview build includes `shared/unified-runtime.js`, which demonstrates a shared same-origin localStorage/BroadcastChannel counter.

For production, the order number must be issued by exactly one authority:

1. SMT local Room/SQLite host if offline-first host is the authority; or
2. Staff/Sync backend if cloud issuance is selected; never both.

Until SMT order creation calls the same authority, SMM-generated preview numbers are not production receipts.

## Packaging rule

The iPhone yellow-frame adapter is preview-only. Before APK packaging, root routing may remain, but the production SMT entry must point directly to the true SMT page and must not include iframe/scale layers inside the Android package.
