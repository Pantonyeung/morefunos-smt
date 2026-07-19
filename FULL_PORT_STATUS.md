# SMT V16 Five-Root Full Port Status

## Target branch
`feat/smt-v16-5root-full-port`

## Locked source baselines
- UI / interaction baseline: `feat/smt-master-v1` @ `23df1f67fdd768e8e6775ff42d470581dffdcb10`
- Complete V16 function baseline: `feat/smt-v16-complete` @ `a3a9ab00e8e51d0c29fb34d7ea32083c43539f0a`
- Five-root structural base: `feat/smt-v16-5root-rebuild`

## Root runtime target
Only these five executable root files are allowed:
- `index.html`
- `smt-app.js`
- `smt-app.css`
- `smt-data.js`
- `smt-api-client.js`

No `/pages/`, `/shared/`, `app-loader.js`, `app-shell.css`, `service-worker.js`, or `manifest.webmanifest` runtime may be reintroduced.

## Port inventory

### Runtime / state to merge into `smt-app.js`
- `shared/runtime.js`
- `shared/store.js`
- `shared/components.js`
- `pages/order/page.js`
- `pages/order/page-v14.js`
- V15 stability / hotfix behavior
- V16 complete order interactions
- checkout runtime

### Data / rules to merge into `smt-data.js`
- `pages/order/page-data.js`
- `pages/order/page-data-v11.js`
- `pages/order/page-config.js`
- product required groups
- optional groups
- link-up / combo eligibility
- drink slots and assignment rules
- pending order fixtures
- checkout channels / payment fixtures

### UI to merge into `smt-app.css`
- `shared/page-base.css`
- Master V1 order page CSS
- V14 CSS
- V15 hotfix CSS
- locked product-card ratios
- anchored cards / arrows
- pending receipt and completion UI
- product detail / edit card
- quick drink strip
- checkout layout
- iPhone / T2S fixed canvas and orientation handling

## First verified gaps in current simplified five-root runtime
- complete pending-area receipt flow missing
- link-up summary / apply-link-up behavior reduced
- operation status and health status missing
- exact Master V1 topbar and product-card structure not preserved
- partial-quantity edit / split behavior missing
- complete checkout flow missing
- V16 pending-order group expansion missing
- full draft / restore behavior missing
- page-level error boundary and render queue reduced

## Execution order
1. Port state/runtime primitives without changing visible UI.
2. Port Master V1 order-page DOM and CSS exactly.
3. Port V16 required / optional / link-up / pending behavior.
4. Port partial-quantity edit and drink-assignment behavior.
5. Port checkout into the same five-root runtime.
6. Apply fixed-canvas and orientation handling.
7. Run syntax, reference, duplicate-listener, modal, persistence, and regression checks.
8. Produce full package, manifest, SHA-256, changelog, and rollback note.

## Current status
- Branch created.
- Baseline comparison completed.
- Master V1 order runtime extraction started.
- V16 complete order runtime extraction started.
- No changes made to `main`.
