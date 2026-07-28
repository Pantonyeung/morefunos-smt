package hk.morefun.smt

import org.json.JSONObject

/**
 * E-line APK OTA manifest. This contract is intentionally separate from the
 * Web Runtime release manifest so Native APK and Runtime OTA cannot be mixed.
 */
data class ApkUpdateManifest(
    val versionCode: Long,
    val versionName: String,
    val packageName: String,
    val apkUrl: String,
    val sha256: String,
    val bytes: Long,
    val issuedAt: Long,
    val minSdk: Int,
    val mandatory: Boolean
) {
    companion object {
        fun parse(raw: String): ApkUpdateManifest {
            val json = JSONObject(raw)
            val manifest = ApkUpdateManifest(
                versionCode = json.getLong("versionCode"),
                versionName = json.getString("versionName").trim(),
                packageName = json.getString("packageName").trim(),
                apkUrl = json.getString("apkUrl").trim(),
                sha256 = json.getString("sha256").trim().lowercase(),
                bytes = json.getLong("bytes"),
                issuedAt = json.getLong("issuedAt"),
                minSdk = json.getInt("minSdk"),
                mandatory = json.optBoolean("mandatory", false)
            )
            require(manifest.versionCode > 0) { "versionCode 必須大於 0" }
            require(manifest.versionName.isNotBlank()) { "versionName 不可為空" }
            require(manifest.packageName == BuildConfig.APPLICATION_ID) { "APK package 不匹配" }
            require(manifest.apkUrl.startsWith("https://")) { "APK URL 只接受 HTTPS" }
            require(manifest.sha256.matches(Regex("^[a-f0-9]{64}$"))) { "APK SHA-256 格式無效" }
            require(manifest.bytes in 1..MAX_APK_BYTES) { "APK 檔案大小無效" }
            require(manifest.issuedAt > 0) { "issuedAt 無效" }
            require(manifest.minSdk <= android.os.Build.VERSION.SDK_INT) { "裝置 Android 版本不足" }
            return manifest
        }

        private const val MAX_APK_BYTES = 256L * 1024L * 1024L
    }
}
