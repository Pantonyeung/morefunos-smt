#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/app/src/main/java/hk/morefun/smt"
MANIFEST="$ROOT/app/src/main/AndroidManifest.xml"

bash "$ROOT/verify-foundation.sh"

required=(
  "$SRC/ReflectiveSunmiPrinterPort.kt"
  "$SRC/ReleaseUpdateManager.kt"
  "$SRC/ReleaseManifestVerifier.kt"
  "$SRC/WebBundleStore.kt"
  "$SRC/BridgeProtocol.kt"
  "$SRC/NativePrintService.kt"
  "$SRC/BootReceiver.kt"
)
for file in "${required[@]}"; do
  test -s "$file" || { echo "Missing D-line production file: $file" >&2; exit 1; }
done

grep -Fq 'ReflectiveSunmiPrinterPort(context)' "$SRC/NativePrintService.kt"
grep -Fq 'woyou.aidlservice.jiuiv5.IWoyouService\$Stub' "$SRC/ReflectiveSunmiPrinterPort.kt"
grep -Fq 'onBindingDied' "$SRC/ReflectiveSunmiPrinterPort.kt"
grep -Fq 'onNullBinding' "$SRC/ReflectiveSunmiPrinterPort.kt"
grep -Fq 'rejectReplay' "$SRC/ReleaseUpdateManager.kt"
grep -Fq 'KEY_LAST_ACCEPTED_ISSUED_AT' "$SRC/ReleaseUpdateManager.kt"
grep -Fq 'SHA256withRSA' "$SRC/ReleaseManifestVerifier.kt"
grep -Fq 'pending_health' "$SRC/WebBundleStore.kt"
grep -Fq 'UNHEALTHY_RESTART' "$SRC/WebBundleStore.kt"
grep -Fq 'bundle.markHealthy' "$SRC/BridgeProtocol.kt"
grep -Fq 'bundle.rollback' "$SRC/BridgeProtocol.kt"
grep -Fq 'sunmiServiceAvailable' "$SRC/NativePrintService.kt"
grep -Fq 'Intent.ACTION_BOOT_COMPLETED' "$SRC/BootReceiver.kt"
grep -Fq 'Intent.ACTION_MY_PACKAGE_REPLACED' "$SRC/BootReceiver.kt"
grep -Fq 'android.permission.INTERNET' "$MANIFEST"
grep -Fq 'android.permission.RECEIVE_BOOT_COMPLETED' "$MANIFEST"
grep -Fq 'android:name=".BootReceiver"' "$MANIFEST"

if grep -R --line-number -E 'UnavailableSunmiPrinterPort\)' "$SRC/NativePrintService.kt"; then
  echo 'Production NativePrintService still defaults to unavailable SUNMI port' >&2
  exit 1
fi

if grep -R --line-number -E 'http://' "$SRC/ReleaseUpdateManager.kt" "$SRC/ReleaseManifestVerifier.kt"; then
  echo 'Insecure HTTP release source found' >&2
  exit 1
fi

echo "D-line Production Integration static contract PASS"
