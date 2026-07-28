#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/app/src/main/java/hk/morefun/smt"

# D-line remains the immutable functional baseline. E-line adds only APK OTA.
bash "$ROOT/verify-production-integration.sh"

required=(
  "$SRC/ApkUpdateManifest.kt"
  "$SRC/ApkUpdatePolicy.kt"
)
for file in "${required[@]}"; do
  test -s "$file" || { echo "Missing E-line APK OTA file: $file" >&2; exit 1; }
done

grep -Fq 'packageName == BuildConfig.APPLICATION_ID' "$SRC/ApkUpdateManifest.kt"
grep -Fq 'startsWith("https://")' "$SRC/ApkUpdateManifest.kt"
grep -Fq '^[a-f0-9]{64}$' "$SRC/ApkUpdateManifest.kt"
grep -Fq 'versionCode > installedVersionCode' "$SRC/ApkUpdatePolicy.kt"
grep -Fq 'manifest.issuedAt >= lastIssuedAt' "$SRC/ApkUpdatePolicy.kt"
grep -Fq 'KEY_LAST_ACCEPTED_VERSION_CODE' "$SRC/ApkUpdatePolicy.kt"

if grep -R --line-number -E 'runtime-stable/releases/stable-envelope.json' "$SRC/ApkUpdateManifest.kt" "$SRC/ApkUpdatePolicy.kt"; then
  echo 'E-line APK OTA must not reuse the Runtime OTA manifest' >&2
  exit 1
fi

echo "E-line APK OTA baseline contract PASS"
