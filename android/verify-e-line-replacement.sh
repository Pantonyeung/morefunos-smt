#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/.." && pwd)"
GRADLE="$ROOT/app/build.gradle.kts"
RELEASE_WORKFLOW="$REPO_ROOT/.github/workflows/e-line-production-apk-ota-release.yml"
DRY_RUN_WORKFLOW="$REPO_ROOT/.github/workflows/e-line-release-pipeline-dry-run.yml"
RELEASE_GENERATOR="$ROOT/generate-apk-ota-release.sh"
INSTALLER="$ROOT/app/src/main/java/hk/morefun/smt/ApkInstallCoordinator.kt"
FROZEN_D_SHA="0771e8d82b39485e30f8d8c21a1771311b70e452"

bash "$ROOT/verify-production-integration.sh"
bash "$ROOT/verify-apk-ota.sh"

# D-line is immutable and E-line remains a direct descendant.
git rev-parse --verify d-line-production-integration-v1 >/dev/null
D_HEAD="$(git rev-parse d-line-production-integration-v1)"
MERGE_BASE="$(git merge-base HEAD d-line-production-integration-v1)"
test "$D_HEAD" = "$FROZEN_D_SHA" || {
  echo "Frozen D-line moved: expected $FROZEN_D_SHA, got $D_HEAD" >&2
  exit 1
}
test "$MERGE_BASE" = "$FROZEN_D_SHA" || {
  echo "E-line is not directly descended from frozen D-line" >&2
  exit 1
}

# E-line must be installable as an upgrade over D-line versionCode 3.
grep -Eq 'versionCode[[:space:]]*=[[:space:]]*([4-9]|[1-9][0-9]+)' "$GRADLE"
grep -Fq 'versionName = "0.4.0-e-line"' "$GRADLE"
grep -Fq 'applicationId = "hk.morefun.smt"' "$GRADLE"
grep -Fq 'minSdk = 23' "$GRADLE"

# Runtime OTA and APK OTA trust roots must remain separate.
grep -Fq 'morefunReleasePublicKeyB64' "$GRADLE"
grep -Fq 'morefunApkOtaPublicKeyB64' "$GRADLE"
grep -Fq 'RELEASE_PUBLIC_KEY_B64' "$GRADLE"
grep -Fq 'APK_OTA_PUBLIC_KEY_B64' "$GRADLE"

# Device-owner capability must have a real Package Installer managed path.
grep -Fq 'isDeviceOwnerApp' "$INSTALLER"
grep -Fq 'USER_ACTION_NOT_REQUIRED' "$INSTALLER"
grep -Fq 'device_owner_managed' "$INSTALLER"
grep -Fq 'abandonSession' "$INSTALLER"

# Shared release generator owns manifest, certificate, checksum and signed envelope output.
test -s "$RELEASE_GENERATOR"
grep -Fq 'apk-ota-manifest.json' "$RELEASE_GENERATOR"
grep -Fq 'certificateSha256' "$RELEASE_GENERATOR"
grep -Fq 'morefun-smt-e-line-production.apk.sha256' "$RELEASE_GENERATOR"
grep -Fq 'openssl dgst -sha256' "$RELEASE_GENERATOR"
grep -Fq 'stable-apk-envelope.json' "$RELEASE_GENERATOR"
grep -Fq 'apk-ota-release-metadata.env' "$RELEASE_GENERATOR"
grep -Fq 'APK_URL must use HTTPS' "$RELEASE_GENERATOR"

# Signed production workflow must call the verified shared generator and protect signing secrets.
test -s "$RELEASE_WORKFLOW"
grep -Fq 'MOREFUN_APK_OTA_PRIVATE_KEY_B64' "$RELEASE_WORKFLOW"
grep -Fq 'MOREFUN_ANDROID_KEYSTORE_B64' "$RELEASE_WORKFLOW"
grep -Fq 'apksigner' "$RELEASE_WORKFLOW"
grep -Fq 'generate-apk-ota-release.sh' "$RELEASE_WORKFLOW"
grep -Fq 'apk-ota-stable' "$RELEASE_WORKFLOW"
grep -Fq 'retention-days: 90' "$RELEASE_WORKFLOW"
grep -Fq 'ref: e-line-apk-ota-v1' "$RELEASE_WORKFLOW"

# Ephemeral dry run must exercise compile, APK signing, manifest signing and envelope validation.
test -s "$DRY_RUN_WORKFLOW"
grep -Fq 'Generate ephemeral CI signing material' "$DRY_RUN_WORKFLOW"
grep -Fq 'morefun-ci.jks' "$DRY_RUN_WORKFLOW"
grep -Fq 'generate-apk-ota-release.sh' "$DRY_RUN_WORKFLOW"
grep -Fq 'Validate dry-run release contract' "$DRY_RUN_WORKFLOW"
grep -Fq 'e-line-release-pipeline-dry-run' "$DRY_RUN_WORKFLOW"

cat <<REPORT
E-line D-line replacement contract PASS
frozenDLine=$FROZEN_D_SHA
applicationId=hk.morefun.smt
minSdk=23
versionCode=4
versionName=0.4.0-e-line
runtimeOta=preserved
apkOta=isolated
deviceOwnerManagedInstall=present
signedReleasePipeline=present
releasePipelineDryRun=present
hardwareAcceptance=pending
REPORT
