# More Fun SMM｜Project Baseline

## Locked source

- SMT repository: `Pantonyeung/morefunos-smt`
- SMT branch: `feat/smt-order-page-v1`
- SMT package/version: `order-v1-31`
- Source commit: `5d7f9726305a0c9aad7b6238e776d4a7ac670009`

## SMM goal

Build a mobile-first PWA for Android and iOS that supports nearly all SMT operational functions.

The only major device boundary is physical printing:

- SMM may create, retry, cancel, reroute, and inspect print jobs.
- SMM does not open direct TCP/USB/Bluetooth printer connections.
- The SMT Android host receives print jobs, prints silently, and reports the actual outcome.

## Access model

- One simple named account and password, or a small number of owner-created accounts.
- No role tiers in V1.
- Every authenticated account has full operational access.
- Passwords, API secrets, Firebase service credentials, and printer addresses must not be committed.

## Development rule

1. Do not edit the SMT source repository from the SMM project.
2. Extract and document shared contracts before copying implementation.
3. Redesign all presentation layers for mobile portrait use.
4. Preserve More Fun business rules and Traditional Chinese terminology.
5. Treat SMT/central backend as the print execution authority.
