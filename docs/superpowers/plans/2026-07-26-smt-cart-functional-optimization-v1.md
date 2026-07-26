# SMT Cart Functional Optimization V1 Implementation Plan

> For agentic workers: execute this plan task-by-task with regression checks after each independently testable unit.

**Goal:** Improve SMT order-cart speed, continuity and error resistance while preserving the validated Global Shell, Checkout transaction lock and responsive architecture.

**Architecture:** Reuse the current order/cart store and existing domain actions. Add only focused cart responsibilities; do not copy T2S runtime patches, inline !important rules, fixed-size modal overrides, reload-based flows or duplicate order domains.

**Global Constraints**

- Baseline: `smt-responsive-adaptive-v1`.
- Development branch: `smt-functional-completeness-v1`.
- No patch/hotfix/override stylesheet.
- No runtime style injection.
- No duplicate order/combo domain.
- Preserve Checkout transaction lock and cart state on Checkout return.
- Preserve 1920×1080, 1600×900, 1440×900, 1366×768 and 1280×800 support.

## Delivery order

1. Cart interaction continuity: scroll/view-state preservation, changed-row feedback, collapsible category groups.
2. Service-mode flow: order-level default plus per-line override, implemented through the existing order state/domain rather than a second business rule.
3. Quick-drink continuity: visible target context and state-driven closing.
4. Completion/preflight: validate required selections and current availability before Checkout without adding a confirmation step.
5. Combo pricing: move automatic/specified combo pricing away from hard-coded UI values into one pricing responsibility.
6. Transfer flow: keep Hang/Recall discoverable and avoid destructive duplicate restore paths.
7. Regression gates: cart→Checkout→blocked navigation→Checkout back→cart intact; responsive matrix; modal containment.

## Explicitly rejected T2S implementations

- `createElement('style')` runtime CSS injection.
- large `!important` blocks.
- extreme z-index layering.
- fixed modal dimensions tied only to 1280×800.
- `location.reload()` as a cart/combo update mechanism.
- cloned underlay/compatibility overlays.
