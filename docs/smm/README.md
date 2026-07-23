# More Fun SMM

磨飯 SMM（Staff Mobile Management）手機營運端。

## Current baseline

- Source SMT repo: `Pantonyeung/morefunos-smt`
- Source SMT branch: `feat/smt-order-page-v1`
- Source SMT package/version: `order-v1-31`
- SMM development branch: `feat/smm-mobile-v1`
- Initial SMM version: `smm-v1-01`

## Product boundary

SMM is a mobile-first PWA for Android and iOS. It should support nearly all SMT operational functions, including ordering, order handling, dine-in, payments, sold-out control, reports, day close, and print-job control.

SMM does not connect directly to physical printers. It creates print jobs that are received and silently executed by the SMT Android host, which must return the actual print result.

## Access model

- Simple named login and password.
- Intended mainly for the owner's wife or another person authorized on site.
- No role or permission tiers in V1.
- All authenticated users receive full operational access.
- Passwords and secrets must never be committed to this repository.

## Repository rule

Do not modify the SMT source repository from this project. Reuse its data contracts and business logic only after documenting the extraction boundary.
