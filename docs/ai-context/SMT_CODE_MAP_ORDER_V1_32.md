# SMT Code Map Addendum｜order-v1-32

## Shared availability runtime

| File | Responsibility | Dependencies |
|---|---|---|
| `shared/supply-runtime.js` | Staff login/session, local supply cache, local-change capture, pending queue, PATCH/GET sync, polling, reconnect, register/mobile profile detection and sold-out page session UI | Admin Worker Staff API, localStorage |
| `pages/soldout/index.html` | Boots shared runtime before the Register sold-out UI | `shared/supply-runtime.js`, `pages/soldout/page.js` |
| `pages/order/index.html` | Boots shared runtime before order rendering so cards use the latest local/remote supply state | `shared/supply-runtime.js`, `pages/order/page.js` |
| `pages/mobile-soldout/index.html` | Official SMM Mobile Profile entry | shared runtime, mobile page |
| `pages/mobile-soldout/page.js` | Mobile search/filter, single-product status actions, purple-rice bulk action and shared local storage writes | menu API, shared store/runtime |
| `pages/mobile-soldout/page.css` | Portrait/mobile operational layout | mobile page markup |
| `app-loader.js` | Selects Register or Mobile Profile and routes Mobile sold-out to the official mobile surface | query profile, iframe routes |
| `tests/supply-runtime.test.mjs` | Session, queue, flush, refresh, normalization and offline behavior contract | shared runtime |
| `tests/mobile-soldout-profile.test.mjs` | Static authority/profile/wiring contract | loader, register/mobile entries |

## Runtime data flow

```text
SMT / SMM product status action
  → localStorage morefun:smt:v1:supply-overrides
  → shared runtime detects diff
  → pending queue morefun:staff:supply-pending:v1
  → PATCH /v1/staff/availability
  → Firebase operational availability
  → GET /v1/staff/availability for SMT/SMM
  → GET /v1/runtime/customer for Customer
```

## Availability state mapping

| UI label | Runtime value | Expiry |
|---|---|---|
| 供應中 | `available` | override removed |
| 今日售罄 | `soldout` | next Hong Kong 05:00 |
| 暫停供應 | `paused` | explicit restore only |

## Modification rules

- Do not store supply state inside the versioned catalog as the sole live authority.
- Do not implement a second SMM availability model or endpoint.
- Keep the local storage key compatible with existing order and sold-out pages.
- Any change to status names must update Worker validation, shared runtime, Register UI, Mobile UI, Customer adapter and tests together.
- Network failure must never block the local status change.
- A remote refresh must not discard a local pending change before the pending queue is flushed.
