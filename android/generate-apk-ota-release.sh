#!/usr/bin/env bash
set -euo pipefail

: "${APK_PATH:?APK_PATH is required}"
: "${BADGING_PATH:?BADGING_PATH is required}"
: "${SIGNATURE_REPORT_PATH:?SIGNATURE_REPORT_PATH is required}"
: "${APK_OTA_PRIVATE_KEY_PEM:?APK_OTA_PRIVATE_KEY_PEM is required}"
: "${APK_OTA_PUBLIC_KEY_PEM:?APK_OTA_PUBLIC_KEY_PEM is required}"
: "${OUTPUT_DIR:?OUTPUT_DIR is required}"
: "${APK_URL:?APK_URL is required}"
: "${SOURCE_SHA:?SOURCE_SHA is required}"

MANDATORY="${MANDATORY:-false}"
mkdir -p "$OUTPUT_DIR"

test -s "$APK_PATH"
test -s "$BADGING_PATH"
test -s "$SIGNATURE_REPORT_PATH"
test -s "$APK_OTA_PRIVATE_KEY_PEM"
test -s "$APK_OTA_PUBLIC_KEY_PEM"

PACKAGE_ID="$(sed -n "s/^package: name='\([^']*\)'.*/\1/p" "$BADGING_PATH")"
VERSION_CODE="$(sed -n "s/^package:.*versionCode='\([^']*\)'.*/\1/p" "$BADGING_PATH")"
VERSION_NAME="$(sed -n "s/^package:.*versionName='\([^']*\)'.*/\1/p" "$BADGING_PATH")"
MIN_SDK="$(sed -n "s/^sdkVersion:'\([^']*\)'.*/\1/p" "$BADGING_PATH")"
CERT_SHA="$(awk -F': ' '/Signer #1 certificate SHA-256 digest/{print tolower($2); exit}' "$SIGNATURE_REPORT_PATH" | tr -d ':[:space:]')"
APK_SHA="$(sha256sum "$APK_PATH" | awk '{print $1}')"
APK_BYTES="$(wc -c < "$APK_PATH" | tr -d '[:space:]')"
ISSUED_AT="${ISSUED_AT:-$(date +%s)}"

test "$PACKAGE_ID" = "hk.morefun.smt"
test "$VERSION_CODE" -gt 0
test -n "$VERSION_NAME"
test "$MIN_SDK" = "23"
test "${#CERT_SHA}" -eq 64
test "${#APK_SHA}" -eq 64
test "$APK_BYTES" -gt 0
case "$MANDATORY" in
  true|false) ;;
  *) echo "MANDATORY must be true or false" >&2; exit 1 ;;
esac
case "$APK_URL" in
  https://*) ;;
  *) echo "APK_URL must use HTTPS" >&2; exit 1 ;;
esac

export PACKAGE_ID VERSION_CODE VERSION_NAME MIN_SDK CERT_SHA APK_SHA APK_BYTES ISSUED_AT APK_URL SOURCE_SHA MANDATORY OUTPUT_DIR
python3 - <<'PY'
import json, os
manifest = {
    "applicationId": os.environ["PACKAGE_ID"],
    "versionCode": int(os.environ["VERSION_CODE"]),
    "versionName": os.environ["VERSION_NAME"],
    "apkUrl": os.environ["APK_URL"],
    "sha256": os.environ["APK_SHA"],
    "certificateSha256": os.environ["CERT_SHA"],
    "bytes": int(os.environ["APK_BYTES"]),
    "minSdk": int(os.environ["MIN_SDK"]),
    "issuedAt": int(os.environ["ISSUED_AT"]),
    "mandatory": os.environ["MANDATORY"] == "true",
    "sourceSha": os.environ["SOURCE_SHA"]
}
path = os.path.join(os.environ["OUTPUT_DIR"], "apk-ota-manifest.json")
with open(path, "w", encoding="utf-8") as f:
    f.write(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")))
PY

openssl dgst -sha256 \
  -sign "$APK_OTA_PRIVATE_KEY_PEM" \
  -out "$OUTPUT_DIR/apk-ota-manifest.sig" \
  "$OUTPUT_DIR/apk-ota-manifest.json"
openssl dgst -sha256 \
  -verify "$APK_OTA_PUBLIC_KEY_PEM" \
  -signature "$OUTPUT_DIR/apk-ota-manifest.sig" \
  "$OUTPUT_DIR/apk-ota-manifest.json"
base64 -w0 "$OUTPUT_DIR/apk-ota-manifest.sig" > "$OUTPUT_DIR/apk-ota-manifest.sig.b64"

export MANIFEST_PATH="$OUTPUT_DIR/apk-ota-manifest.json"
export SIGNATURE_PATH="$OUTPUT_DIR/apk-ota-manifest.sig.b64"
python3 - <<'PY'
import json, os
manifest_text = open(os.environ["MANIFEST_PATH"], encoding="utf-8").read()
signature = open(os.environ["SIGNATURE_PATH"], encoding="utf-8").read().strip()
envelope = {"manifest": manifest_text, "signature": signature}
with open(os.path.join(os.environ["OUTPUT_DIR"], "stable-apk-envelope.json"), "w", encoding="utf-8") as f:
    f.write(json.dumps(envelope, ensure_ascii=False, separators=(",", ":")))
PY

sha256sum "$APK_PATH" > "$OUTPUT_DIR/morefun-smt-e-line-production.apk.sha256"
cat > "$OUTPUT_DIR/apk-ota-release-metadata.env" <<EOF
APPLICATION_ID=$PACKAGE_ID
VERSION_CODE=$VERSION_CODE
VERSION_NAME=$VERSION_NAME
MIN_SDK=$MIN_SDK
CERTIFICATE_SHA256=$CERT_SHA
APK_SHA256=$APK_SHA
APK_BYTES=$APK_BYTES
ISSUED_AT=$ISSUED_AT
APK_URL=$APK_URL
SOURCE_SHA=$SOURCE_SHA
MANDATORY=$MANDATORY
EOF

python3 -m json.tool "$OUTPUT_DIR/apk-ota-manifest.json" >/dev/null
python3 -m json.tool "$OUTPUT_DIR/stable-apk-envelope.json" >/dev/null

echo "APK OTA release envelope generated: versionCode=$VERSION_CODE versionName=$VERSION_NAME"
