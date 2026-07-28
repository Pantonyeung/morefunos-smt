#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/app/src/main/java/hk/morefun/smt"

bash "$ROOT/verify-production-integration.sh"

test -s "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'class ApkUpdateManifestVerifier' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'SHA256withRSA' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'versionCode > installedVersionCode' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'applicationId == BuildConfig.APPLICATION_ID' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'certificateSha256' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'APK OTA 只接受 HTTPS' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'uri.userInfo.isNullOrBlank()' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'uri.fragment.isNullOrBlank()' "$SRC/ApkUpdateManifestVerifier.kt"

if git rev-parse --verify d-line-production-integration-v1 >/dev/null 2>&1; then
  BASE_SHA="$(git rev-parse d-line-production-integration-v1)"
  MERGE_BASE="$(git merge-base HEAD d-line-production-integration-v1)"
  test "$BASE_SHA" = "$MERGE_BASE" || {
    echo 'E-line must remain directly descended from frozen D-line baseline' >&2
    exit 1
  }
fi

echo 'E-line APK OTA isolation contract PASS'
