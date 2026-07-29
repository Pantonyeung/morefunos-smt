package hk.morefun.smt

import android.util.Base64
import org.json.JSONObject
import java.net.URI
import java.security.KeyFactory
import java.security.Signature
import java.security.spec.X509EncodedKeySpec

/** E-line only: verifies metadata for a native APK update before download/install. */
class ApkUpdateManifestVerifier {
    data class VerifiedApkRelease(
        val versionCode: Long,
        val versionName: String,
        val applicationId: String,
        val sha256: String,
        val apkUrl: String,
        val certificateSha256: String,
        val bytes: Long,
        val minSdk: Int,
        val issuedAt: Long,
        val mandatory: Boolean
    )

    fun verify(envelopeText: String, installedVersionCode: Long): VerifiedApkRelease {
        val envelope = JSONObject(envelopeText)
        val manifestText = envelope.optString("manifest")
        val signatureBase64 = envelope.optString("signature")
        require(BuildConfig.RELEASE_PUBLIC_KEY_B64.isNotBlank()) { "APK OTA public key 未配置" }
        require(manifestText.isNotBlank()) { "APK OTA manifest 為空" }
        require(signatureBase64.isNotBlank()) { "APK OTA signature 為空" }

        val keyBytes = Base64.decode(BuildConfig.RELEASE_PUBLIC_KEY_B64, Base64.DEFAULT)
        val publicKey = KeyFactory.getInstance("RSA").generatePublic(X509EncodedKeySpec(keyBytes))
        val verifier = Signature.getInstance("SHA256withRSA")
        verifier.initVerify(publicKey)
        verifier.update(manifestText.toByteArray(Charsets.UTF_8))
        require(verifier.verify(Base64.decode(signatureBase64, Base64.DEFAULT))) {
            "APK OTA manifest 簽名驗證失敗"
        }

        val json = JSONObject(manifestText)
        val release = VerifiedApkRelease(
            versionCode = json.optLong("versionCode", 0L),
            versionName = json.optString("versionName").trim(),
            applicationId = json.optString("applicationId").trim(),
            sha256 = json.optString("sha256").trim().lowercase(),
            apkUrl = json.optString("apkUrl").trim(),
            certificateSha256 = json.optString("certificateSha256").trim().lowercase(),
            bytes = json.optLong("bytes", 0L),
            minSdk = json.optInt("minSdk", 0),
            issuedAt = json.optLong("issuedAt", 0L),
            mandatory = json.optBoolean("mandatory", false)
        )

        require(release.versionCode > installedVersionCode) { "APK OTA 版本必須高於已安裝版本" }
        require(release.versionName.matches(Regex("[A-Za-z0-9._-]{1,80}"))) { "APK OTA versionName 無效" }
        require(release.applicationId == BuildConfig.APPLICATION_ID) { "APK OTA applicationId 不一致" }
        require(release.sha256.matches(Regex("[a-f0-9]{64}"))) { "APK OTA SHA-256 無效" }
        require(release.certificateSha256.matches(Regex("[a-f0-9]{64}"))) { "APK OTA certificate SHA-256 無效" }
        require(release.bytes in 1..MAX_APK_BYTES) { "APK OTA bytes 無效" }
        require(release.minSdk in 23..android.os.Build.VERSION.SDK_INT) { "APK OTA minSdk 不相容" }
        require(release.issuedAt > 0L) { "APK OTA issuedAt 無效" }
        requireAllowedSource(release.apkUrl)
        return release
    }

    private fun requireAllowedSource(url: String) {
        val uri = URI(url)
        require(uri.scheme.equals("https", ignoreCase = true)) { "APK OTA 只接受 HTTPS" }
        require(uri.userInfo.isNullOrBlank()) { "APK OTA URL 不接受 user-info" }
        require(uri.fragment.isNullOrBlank()) { "APK OTA URL 不接受 fragment" }
        val host = uri.host?.lowercase().orEmpty()
        val allowed = BuildConfig.RELEASE_HOSTS.split(',').map { it.trim().lowercase() }.filter { it.isNotBlank() }.toSet()
        require(host.isNotBlank() && host in allowed) { "APK OTA host 未授權：$host" }
    }

    companion object {
        private const val MAX_APK_BYTES = 256L * 1024L * 1024L
    }
}
