#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/app/src/main/java/hk/morefun/smt"
MANIFEST="$ROOT/app/src/main/AndroidManifest.xml"
GRADLE="$ROOT/app/build.gradle.kts"
BRIDGE="$SRC/BridgeProtocol.kt"
VERIFIER="$SRC/ApkUpdateManifestVerifier.kt"

bash "$ROOT/verify-production-integration.sh"

required=(
  "$SRC/ApkUpdateManifest.kt"
  "$SRC/ApkUpdatePolicy.kt"
  "$VERIFIER"
  "$SRC/ApkEnvelopeClient.kt"
  "$SRC/ApkDownloadStager.kt"
  "$SRC/ApkBinaryVerifier.kt"
  "$SRC/ApkInstallCapability.kt"
  "$SRC/ApkInstallCoordinator.kt"
  "$SRC/ApkInstallResultReceiver.kt"
  "$SRC/ApkOtaManager.kt"
)
for file in "${required[@]}"; do
  test -s "$file" || { echo "Missing APK OTA file: $file" >&2; exit 1; }
done

grep -Fq 'SHA256withRSA' "$VERIFIER"
grep -Fq 'versionCode > installedVersionCode' "$VERIFIER"
grep -Fq 'applicationId == BuildConfig.APPLICATION_ID' "$VERIFIER"
grep -Fq 'certificateSha256' "$VERIFIER"
grep -Fq 'BuildConfig.APK_OTA_PUBLIC_KEY_B64' "$VERIFIER"
grep -Fq 'BuildConfig.APK_OTA_HOSTS' "$VERIFIER"
! grep -Fq 'BuildConfig.RELEASE_PUBLIC_KEY_B64' "$VERIFIER"
! grep -Fq 'BuildConfig.RELEASE_HOSTS' "$VERIFIER"
grep -Fq 'morefunApkOtaPublicKeyB64' "$GRADLE"
grep -Fq 'morefunApkOtaHosts' "$GRADLE"
grep -Fq 'morefunApkOtaManifestUrl' "$GRADLE"
grep -Fq 'APK_OTA_PUBLIC_KEY_B64' "$GRADLE"
grep -Fq 'APK_OTA_HOSTS' "$GRADLE"
grep -Fq 'APK_OTA_MANIFEST_URL' "$GRADLE"

grep -Fq 'context.noBackupFilesDir' "$SRC/ApkDownloadStager.kt"
grep -Fq 'instanceFollowRedirects = false' "$SRC/ApkDownloadStager.kt"
grep -Fq 'MessageDigest.getInstance("SHA-256")' "$SRC/ApkDownloadStager.kt"
grep -Fq 'output.fd.sync()' "$SRC/ApkDownloadStager.kt"
grep -Fq 'getPackageArchiveInfo' "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'packageName == BuildConfig.APPLICATION_ID' "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'versionCode == release.versionCode' "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'installedCertificateSha256' "$SRC/ApkBinaryVerifier.kt"
grep -Fq 'signing certificate continuity' "$SRC/ApkBinaryVerifier.kt"

grep -Fq 'PackageInstaller.SessionParams' "$SRC/ApkInstallCoordinator.kt"
grep -Fq 'session.openWrite' "$SRC/ApkInstallCoordinator.kt"
grep -Fq 'session.commit' "$SRC/ApkInstallCoordinator.kt"
grep -Fq 'USER_ACTION_NOT_REQUIRED' "$SRC/ApkInstallCoordinator.kt"
grep -Fq 'STATUS_PENDING_USER_ACTION' "$SRC/ApkInstallResultReceiver.kt"
grep -Fq 'Intent.EXTRA_INTENT' "$SRC/ApkInstallResultReceiver.kt"
grep -Fq 'REQUEST_INSTALL_PACKAGES' "$MANIFEST"
grep -Fq '.ApkInstallResultReceiver' "$MANIFEST"

grep -Fq 'isDeviceOwnerApp' "$SRC/ApkInstallCapability.kt"
grep -Fq 'canRequestPackageInstalls' "$SRC/ApkInstallCapability.kt"
grep -Fq 'silentInstallEligible' "$SRC/ApkInstallCapability.kt"
grep -Fq 'fun check()' "$SRC/ApkOtaManager.kt"
grep -Fq 'fun installLatest()' "$SRC/ApkOtaManager.kt"
grep -Fq 'stager.stage(release, maxBytes = release.bytes)' "$SRC/ApkOtaManager.kt"
grep -Fq 'staged.byteLength == release.bytes' "$SRC/ApkOtaManager.kt"
grep -Fq 'binaryVerifier.verify' "$SRC/ApkOtaManager.kt"
grep -Fq 'installer.requestInstall' "$SRC/ApkOtaManager.kt"

grep -Fq 'ACTION_MY_PACKAGE_REPLACED' "$SRC/BootReceiver.kt"
grep -Fq 'package_replaced' "$SRC/BootReceiver.kt"
grep -Fq 'morefun_apk_install' "$SRC/ApkInstallCoordinator.kt"

grep -Fq 'private val apkOtaManager = ApkOtaManager(context)' "$BRIDGE"
grep -Fq '"apk.ota.getStatus"' "$BRIDGE"
grep -Fq '"apk.ota.getCapability"' "$BRIDGE"
grep -Fq '"apk.ota.check"' "$BRIDGE"
grep -Fq '"apk.ota.installLatest"' "$BRIDGE"
grep -Fq '"apk.ota.install"' "$BRIDGE"
grep -Fq 'APK_OTA_CHECK_FAILED' "$BRIDGE"
grep -Fq 'APK_OTA_INSTALL_FAILED' "$BRIDGE"
grep -Fq '.put("apkOta", apkOtaManager.status())' "$BRIDGE"

echo 'APK OTA contract PASS'
