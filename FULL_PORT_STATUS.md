# SMT V16 Five-Root Full Port Status

## Target branch
`feat/smt-v16-5root-full-port`

## Locked source baselines
- UI / interaction baseline: `feat/smt-master-v1` @ `23df1f67fdd768e8e6775ff42d470581dffdcb10`
- Complete V16 function baseline: `feat/smt-v16-complete` @ `a3a9ab00e8e51d0c29fb34d7ea32083c43539f0a`
- Five-root structural base: `feat/smt-v16-5root-rebuild`

## Runtime structure
Only these five executable root files are used:
- `index.html`
- `smt-app.js`
- `smt-app.css`
- `smt-data.js`
- `smt-api-client.js`

The branch does not reintroduce `/pages/`, `/shared/`, `app-loader.js`, `app-shell.css`, `service-worker.js`, or `manifest.webmanifest` as runtime dependencies.

## Ported UI and operations
- Master V1 top bar, receiving state, order serial, pending, quick mode, system health and display settings.
- Master V1 cart rows, sequence numbers, product images, price summaries and pending receipt.
- Large / small / text product card modes.
- Locked quick-drink card dimensions and unified drink-card rendering.
- Product detail layout using 68% option area and 32% quantity / price / confirmation area.
- Single overlay root and single delegated click handler.
- Pending-order source groups, row expansion, order detail and claim action.
- Checkout source, payment method, received amount, quick cash and change calculation.

## Ported rules and state
- Required, optional and Link Up groups are separated.
- Single riceballs do not incorrectly require snacks or drinks.
- Riceball meals require snack and drink.
- Bento requires rice and drink; salad requires sauce and drink; potato meal requires drink.
- Missing-required summary and checkout blocking.
- Quick drink assignment to the first missing drink slot.
- Link Up summary and combination across riceball, snack and standalone drink lines.
- Partial-quantity edit with line splitting and untouched remainder preservation.
- Cart merge modes, local persistence, draft saving, operation status and health boundary.
- Robust landscape detection using Screen Orientation first and viewport ratio as fallback.

## Verification evidence
- `node --check smt-app.js`: PASS
- `node --check smt-data.js`: PASS
- `node --check smt-api-client.js`: PASS
- Five-root structure test: PASS
- No legacy runtime reference test: PASS
- Single delegated click listener test: PASS
- Required / optional rule unit tests: PASS
- Single-riceball optional behavior test: PASS
- Partial-quantity split-edit test: PASS
- Landscape detection unit test: PASS
- Local Git blob SHA values exactly match the five GitHub content SHAs.

## Environment limitation
The execution environment blocks Chromium navigation to both localhost and `file://`, so automated visual browser screenshots could not be produced here. Real iPad / T2S visual and touch acceptance remains the final device-level gate.

## Current status
Implementation and repository verification are complete on `feat/smt-v16-5root-full-port`. `main` and `feat/smt-v16-5root-rebuild` remain unchanged and available for rollback.
