#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/app/src/main/java/hk/morefun/smt"
MANIFEST="$ROOT/app/src/main/AndroidManifest.xml"
GRADLE="$ROOT/app/build.gradle.kts"
BRIDGE="$SRC/BridgeProtocol.kt"
VERIFIER="$SRC/ApkUpdateManifestVerifier.kt"

bash "$ROOT/verify-production-integration.sh"

# E0/E1 manifest authenticity and isolated APK OTA trust configuration.
test -s "$VERIFIER"
grep -Fq 'class ApkUpdateManifestVerifier' "$VERIFIER"
grep -Fq 'SHA256withRSA' "$VERIFIER"
grep -Fq 'versionCode > installedVersionCode' "$VERIFIER"
grep -Fq 'applicationId == BuildConfig.APPLICATION_ID' "$VERIFIER"
grep -Fq 'certificateSha256' "$VERIFIER"
grep -Fq 'bytes in 1..MAX_APK_BYTES' "$VERIFIER"
grep -Fq 'APK OTA 只接受 HTTPS' "$VERIFIER"
grep -Fq 'uri.userInfo.isNullOrBlank()' "$VERIFIER"
grep -Fq 'uri.fragment.isNullOrBlank()' "$VERIFIER"
grep -Fq 'BuildConfig.APK_OTA_PUBLIC_KEY_B64' "$VERIFIER"
grep -Fq 'BuildConfig.APK_OTA_HOSTS' "$VERIFIER"
! grep -Fq 'BuildConfig.RELEASE_PUBLIC_KEY_B64' "$VERIFIER"
! grep -Fq 'BuildConfig.RELEASE_HOSTS' "$VERIFIER"
grep -Fq 'morefunApkOtaPublicKeyB64' "$GRADLE"
grep -Fq 'morefunApkOtaHosts' "$GRADLE"
grep -Fq 'morefunApkOtaManifestUrl' "$GRADLE"
grep -Fq '"APK_OTA_PUBLIC_KEY_B64"' "$GRADLE"
grep -Fq '"APK_OTA_HOSTS"' "$GRADLE"
grep -Fq '"APK_OTA_MANIFEST_URL"' "$GRADLE"

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

# E3 Android Package Installer and user-confirmation result path.
test -s "$SRC/ApkInstallCoordinator.kt"
test -s "$SRC/ApkInstallResultReceiver.kt"
grep -Fq 'PackageInstaller.SessionParams' "$SRC/ApkInstallCoordinator.kt"
grep -Fq 'session.openWrite' "$SRC/ApkInstallCoordinator.kt"
grep -Fq 'session.commit' "$SRC/ApkInstallCoordinator.kt"
grep -Fq 'FLAG_MUTABLE' "$SRC/ApkInstallCoordinator.kt"
grep -Fq 'STATUS_PENDING_USER_ACTION' "$SRC/ApkInstallResultReceiver.kt"
grep -Fq 'Intent.EXTRA_INTENT' "$SRC/ApkInstallResultReceiver.kt"
grep -Fq 'REQUEST_INSTALL_PACKAGES' "$MANIFEST"
grep -Fq '.ApkInstallResultReceiver' "$MANIFEST"

# E4/E6 persistent diagnostics, update orchestration and install capability.
test -s "$SRC/ApkInstallCapability.kt"
test -s "$SRC/ApkOtaManager.kt"
grep -Fq 'isDeviceOwnerApp' "$SRC/ApkInstallCapability.kt"
grep -Fq 'canRequestPackageInstalls' "$SRC/ApkInstallCapability.kt"
grep -Fq 'silentInstallEligible' "$SRC/ApkInstallCapability.kt"
grep -Fq 'verifier.verify' "$SRC/ApkOtaManager.kt"
grep -Fq 'policy.evaluate' "$SRC/ApkOtaManager.kt"
grep -Fq 'stager.stage(release, maxBytes = release.bytes)' "$SRC/ApkOtaManager.kt"
grep -Fq 'staged.byteLength == release.bytes' "$SRC/ApkOtaManager.kt"
grep -Fq 'binaryVerifier.verify' "$SRC/ApkOtaManager.kt"
grep -Fq 'installer.requestInstall' "$SRC/ApkOtaManager.kt"

# E5 package-replaced recovery and persistent diagnostics.
grep -Fq 'ACTION_MY_PACKAGE_REPLACED' "$SRC/BootReceiver.kt"
grep -Fq 'package_replaced' "$SRC/BootReceiver.kt"
grep -Fq 'morefun_apk_install' "$SRC/ApkInstallCoordinator.kt"

# E7 Runtime Bridge exposure for POS settings and diagnostics.
test -s "$BRIDGE"
grep -Fq 'private val apkOtaManager = ApkOtaManager(context)' "$BRIDGE"
grep -Fq '"apk.ota.getStatus"' "$BRIDGE"
grep -Fq '"apk.ota.getCapability"' "$BRIDGE"
grep -Fq '"apk.ota.install"' "$BRIDGE"
grep -Fq 'APK_OTA_INSTALL_FAILED' "$BRIDGE"
grep -Fq 'apk.ota.status' "$BRIDGE"
grep -Fq 'apk.ota.capability' "$BRIDGE"
grep -Fq 'apk.ota.signed-install' "$BRIDGE"
grep -Fq 'apk.ota.package-installer' "$BRIDGE"
grep -Fq 'apk.ota.recovery' "$BRIDGE"
grep -Fq '.put("apkOta", apkOtaManager.status())' "$BRIDGE"

# E-line must remain descended from the frozen D-line branch and must not rewrite it.
if git rev-parse --verify d-line-production-integration-v1 >/dev/null 2>&1; then
  BASE_SHA="$(git rev-parse d-line-production-integration-v1)"
  MERGE_BASE="$(git merge-base HEAD d-line-production-integration-v1)"
  test "$BASE_SHA" = "$MERGE_BASE" || {
    echo 'E-line must remain directly descended from frozen D-line baseline' >&2
    exit 1
  }
fi

echo 'E-line APK OTA isolated trust, bridge, installer and recovery contract PASS'
