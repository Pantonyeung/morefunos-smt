#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/app/src/main/java/hk/morefun/smt"

bash "$ROOT/verify-production-integration.sh"

# E0/E1 manifest authenticity and source policy.
test -s "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'class ApkUpdateManifestVerifier' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'SHA256withRSA' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'versionCode > installedVersionCode' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'applicationId == BuildConfig.APPLICATION_ID' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'certificateSha256' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'APK OTA 只接受 HTTPS' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'uri.userInfo.isNullOrBlank()' "$SRC/ApkUpdateManifestVerifier.kt"
grep -Fq 'uri.fragment.isNullOrBlank()' "$SRC/ApkUpdateManifestVerifier.kt"

# E2 app-private download staging and real binary integrity.
test -s "$SRC/ApkDownloadStager.kt"
grep -Fq 'context.noBackupFilesDir' "$SRC/ApkDownloadStager.kt"
grep -Fq 'instanceFollowRedirects = false' "$SRC/ApkDownloadStager.kt"
grep -Fq 'require(total <= maxBytes)' "$SRC/ApkDownloadStager.kt"
grep -Fq 'MessageDigest.getInstance("SHA-256")' "$SRC/ApkDownloadStager.kt"
grep -Fq 'actualSha.equals(release.sha256' "$SRC/ApkDownloadStager.kt"
grep -Fq 'output.fd.sync()' "$SRC/ApkDownloadStager.kt"

# E2 package, version and signing-certificate continuity.
test -s "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'getPackageArchiveInfo' "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'packageName == BuildConfig.APPLICATION_ID' "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'versionCode == release.versionCode' "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'installedCertificateSha256' "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'signing certificate continuity' "$SRC/ApkBinaryVerifier.kt"

# E-line must remain descended from the frozen D-line branch and must not rewrite it.
if git rev-parse --verify d-line-production-integration-v1 >/dev/null 2>&1; then
  BASE_SHA="$(git rev-parse d-line-production-integration-v1)"
  MERGE_BASE="$(git merge-base HEAD d-line-production-integration-v1)"
  test "$BASE_SHA" = "$MERGE_BASE" || {
    echo 'E-line must remain directly descended from frozen D-line baseline' >&2
    exit 1
  }
fi

echo 'E-line APK OTA isolation and binary verification contract PASS'
