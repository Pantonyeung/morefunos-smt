#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/app"
SRC="$APP/src/main/java/hk/morefun/smt"

required=(
  "$ROOT/settings.gradle.kts"
  "$ROOT/build.gradle.kts"
  "$APP/build.gradle.kts"
  "$APP/src/main/AndroidManifest.xml"
  "$SRC/BridgeProtocol.kt"
  "$SRC/BridgePrintController.kt"
  "$SRC/NativePrintService.kt"
  "$SRC/PrinterRegistry.kt"
  "$SRC/PrintRouter.kt"
  "$SRC/PrintDriverRegistry.kt"
  "$SRC/LanTcpPrintDriver.kt"
  "$SRC/LabelPrintDriver.kt"
  "$SRC/SunmiPrintDriver.kt"
  "$SRC/PrintJobLedger.kt"
)

for file in "${required[@]}"; do
  test -f "$file" || { echo "Missing required foundation file: $file" >&2; exit 1; }
done

if grep -R --line-number -E 'org\.jetbrains\.kotlin\.android|kotlin-android' \
  "$ROOT/build.gradle.kts" "$APP/build.gradle.kts"; then
  echo "AGP 9 built-in Kotlin conflict: kotlin-android plugin must not be applied" >&2
  exit 1
fi

grep -q 'id("com.android.application") version "9.3.0"' "$ROOT/build.gradle.kts"
grep -q 'minSdk = 23' "$APP/build.gradle.kts"
grep -q 'compileSdk = 36' "$APP/build.gradle.kts"
grep -q 'targetSdk = 36' "$APP/build.gradle.kts"
grep -q 'androidx.webkit:webkit:1.15.0' "$APP/build.gradle.kts"
grep -q 'android.permission.INTERNET' "$APP/src/main/AndroidManifest.xml"
grep -q 'android.permission.ACCESS_NETWORK_STATE' "$APP/src/main/AndroidManifest.xml"

grep -q 'bridge.getPrintJobStatus' "$SRC/BridgeProtocol.kt"
grep -q 'mediaProfile' "$SRC/PrinterRegistry.kt"
grep -q 'fallbackPrinterId' "$SRC/PrinterRegistry.kt"
grep -q 'fun fallback' "$SRC/PrintRouter.kt"
grep -q 'fun recoverInterrupted' "$SRC/PrintJobLedger.kt"
grep -q 'interruptedCount' "$SRC/PrintJobLedger.kt"

echo "APK Foundation static preflight PASS"
