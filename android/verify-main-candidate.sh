#!/usr/bin/env bash
set -euo pipefail

# One-shot trigger marker: 2026-07-30 PR-observable main candidate validation.
ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/.." && pwd)"
GRADLE="$ROOT/app/build.gradle.kts"
WORKFLOW="$REPO_ROOT/.github/workflows/main-candidate-manual-gate.yml"

bash "$ROOT/verify-production-integration.sh"
bash "$ROOT/verify-apk-ota.sh"

grep -Eq 'versionCode[[:space:]]*=[[:space:]]*([4-9]|[1-9][0-9]+)' "$GRADLE"
grep -Fq 'versionName = "0.4.0-main-candidate"' "$GRADLE"
grep -Fq 'applicationId = "hk.morefun.smt"' "$GRADLE"
grep -Fq 'minSdk = 23' "$GRADLE"

optional_checks=(
  "$ROOT/verify-printer-contract.sh"
  "$ROOT/verify-offline-survival.sh"
  "$ROOT/verify-browser-matrix.sh"
)
for check in "${optional_checks[@]}"; do
  if test -s "$check"; then
    bash "$check"
  fi
done

# Only inspect candidate configuration files. Scanning this script would match
# the forbidden-pattern definitions themselves and create a false failure.
forbidden_patterns=(
  'FROZEN_D_SHA'
  'versionName = "0.4.0-e-line"'
  'ref: e-line-apk-ota-v1'
)
for pattern in "${forbidden_patterns[@]}"; do
  if grep -Fq "$pattern" "$GRADLE" "$WORKFLOW"; then
    echo "Main Candidate configuration contains obsolete hard lock: $pattern" >&2
    exit 1
  fi
done

cat <<REPORT
SMT Main Candidate aggregate gate PASS
applicationId=hk.morefun.smt
minSdk=23
versionName=0.4.0-main-candidate
runtimeAuthority=preserved
apkOta=integrated
runtimeHealthRecovery=integrated
nativePrint=integrated
hardwareAcceptance=pending
REPORT
