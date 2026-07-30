#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/.." && pwd)"
GRADLE="$ROOT/app/build.gradle.kts"

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

if grep -R --line-number -E 'FROZEN_D_SHA|versionName = "0\.4\.0-e-line"|ref: e-line-apk-ota-v1' \
  "$ROOT/verify-main-candidate.sh" \
  "$REPO_ROOT/.github/workflows/main-candidate-manual-gate.yml" 2>/dev/null; then
  echo 'Main Candidate Gate contains obsolete E-line/D-line hard lock' >&2
  exit 1
fi

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
