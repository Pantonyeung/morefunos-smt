# SMT Order Page Current Lock Implementation Plan

> Date: 2026-07-20
> Branch: `feat/smt-order-page-v1`
> Authority: `docs/design-lock-v1/ORDER_PAGE_CURRENT_LOCK.md`

## Goal

Complete the order-page vertical slice so every current-lock requirement is implemented, testable, and explicitly classified as code-verified or awaiting real-device acceptance.

## Phase 1 — Fixed shell and overlay contract

- Add failing tests for fixed top/bottom bars, bounded workspace, internal cart scroll, adaptive T2S canvas, and manual UI scale.
- Replace the fixed 1920×1080 contain fit with a width-based logical canvas whose height follows the safe viewport.
- Make the app/root height chain explicit so content cannot push the bottom navigation.
- Keep one global overlay owner; calculate four-direction anchored placement inside the fixed bars.

## Phase 2 — Cart and catalogue

- Add cart category grouping and configurable merged/separate display.
- Keep image visibility configurable without leaving blank image slots.
- Keep quantity and Modify controls together under each cart line.
- Preserve three catalogue card modes and all prices.

## Phase 3 — Quick drinks and completion/link-up

- Convert the persistent quick-drink row to a collapsed bottom drawer.
- Support image/text display, exact pointer target, multi-configuration quantities, and reorder controls.
- Restore the completion/link-up entrance with demo data and both automatic and specified pairing.
- Keep required options distinct from optional product modification.

## Phase 4 — Operational cards

- Rebuild pending orders by App/Web and Phone/WhatsApp, with dynamic vertical split, order amount/count/contact, and actionable detail.
- Implement sold-out preview as view-only.
- Implement device status and online order receiving cards.
- Implement a right-bottom new-order notification with later/now actions and bounded lifetime.

## Phase 5 — Verification and delivery

- Extend unit/source-contract tests for every current-lock item.
- Run the complete test suite and static syntax checks.
- Update implementation status item-by-item using `implemented / code-verified / awaiting real-device acceptance`.
- Update cache build identifiers, commit, and publish the changed files to the existing GitHub branch.
- Do not mark iPad/T2S/product-owner acceptance as passed until confirmed on the real device.
