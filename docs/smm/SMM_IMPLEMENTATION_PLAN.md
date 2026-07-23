# More Fun SMM｜Implementation Plan V1

## Phase 0 — Repository foundation

- Lock SMT source branch and package version.
- Keep SMM in an independent repository.
- Define mobile-only presentation boundary.

## Phase 1 — Extraction audit

Read and map the SMT `order-v1-31` implementation for:

- menu and pricing rules
- order identity
- checkout and payment
- order operations
- dine-in state
- sold-out state
- reports and day close
- print-job contract
- runtime and persistence

Deliverables:

- extraction map
- feature matrix
- shared data contract
- print handoff contract

## Phase 2 — Mobile shell

Create:

- login
- dashboard
- ordering
- orders
- dine-in
- more
- PWA manifest and service worker

## Phase 3 — First operational vertical slice

Complete and verify:

`Login → Create order → Submit centrally → SMT receives → SMT prints silently → SMM receives real print result`

## Phase 4 — Full operational parity

Add:

- order edit/cancel/refund
- held orders
- dine-in
- sold-out management
- reports
- day close
- diagnostics
- print retry and reroute

## Phase 5 — Device verification

Verify on:

- Android phone
- iPhone Safari/PWA
- iPad
- Sunmi T2S SMT host
- offline/reconnect
- simultaneous SMT and SMM ordering
- print failure and duplicate prevention
