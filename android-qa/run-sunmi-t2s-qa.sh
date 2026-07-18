#!/usr/bin/env bash
set -euo pipefail

TARGET_URL="${1:-${SMT_PREVIEW_URL:-}}"
SMT_PACKAGE="${SMT_PACKAGE:-}"
SMT_ACTIVITY="${SMT_ACTIVITY:-}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="${QA_OUT_DIR:-android-qa/evidence/$STAMP}"
mkdir -p "$OUT"

if ! command -v adb >/dev/null 2>&1; then
  echo "錯誤：找不到 adb。請先安裝 Android SDK Platform Tools。" >&2
  exit 2
fi

adb start-server >/dev/null
adb devices -l | tee "$OUT/adb-devices.txt"
DEVICE_COUNT="$(adb devices | awk 'NR>1 && $2=="device" {count++} END {print count+0}')"
if [ "$DEVICE_COUNT" -ne 1 ]; then
  echo "錯誤：需要剛好一部已授權 Android 裝置，目前找到 $DEVICE_COUNT 部。" >&2
  exit 3
fi

adb shell input keyevent KEYCODE_WAKEUP || true
adb shell wm dismiss-keyguard || true
adb shell settings put system accelerometer_rotation 0
adb shell settings put system user_rotation 1

{
  echo "model=$(adb shell getprop ro.product.model | tr -d '\r')"
  echo "android=$(adb shell getprop ro.build.version.release | tr -d '\r')"
  echo "sdk=$(adb shell getprop ro.build.version.sdk | tr -d '\r')"
  echo "webview=$(adb shell dumpsys webviewupdate 2>/dev/null | head -20 | tr -d '\r')"
  adb shell wm size | tr -d '\r'
  adb shell wm density | tr -d '\r'
} > "$OUT/device-profile.txt"

if [ -n "$SMT_PACKAGE" ]; then
  if [ -n "$SMT_ACTIVITY" ]; then
    adb shell am force-stop "$SMT_PACKAGE"
    adb shell am start -W -n "$SMT_PACKAGE/$SMT_ACTIVITY" | tee "$OUT/launch.txt"
  else
    adb shell monkey -p "$SMT_PACKAGE" -c android.intent.category.LAUNCHER 1 | tee "$OUT/launch.txt"
  fi
elif [ -n "$TARGET_URL" ]; then
  adb shell am start -W -a android.intent.action.VIEW -d "$TARGET_URL" | tee "$OUT/launch.txt"
else
  echo "錯誤：請傳入 Preview URL，或設定 SMT_PACKAGE。" >&2
  exit 4
fi

sleep "${QA_WAIT_SECONDS:-4}"
adb shell uiautomator dump /sdcard/smt-window.xml | tee "$OUT/uiautomator-command.txt" || true
adb pull /sdcard/smt-window.xml "$OUT/window.xml" >/dev/null 2>&1 || true
adb exec-out screencap -p > "$OUT/screen.png"
adb shell dumpsys window windows > "$OUT/window-dumpsys.txt"
adb shell dumpsys activity activities > "$OUT/activity-dumpsys.txt"
adb shell dumpsys meminfo ${SMT_PACKAGE:-com.android.chrome} > "$OUT/meminfo.txt" 2>&1 || true
adb logcat -d -v threadtime > "$OUT/logcat.txt"

printf '%s\n' \
  "Android QA 證據已保存：$OUT" \
  "請人工完成：點單 → Required → 結帳 → 付款 → 落單，以及新單稍後處理。" \
  "完成每個狀態後可再次執行本腳本，或使用 adb exec-out screencap -p 保存畫面。"
