package hk.morefun.smt

import android.util.Base64
import org.json.JSONObject
import java.net.URI
import java.security.KeyFactory
import java.security.Signature
import java.security.spec.X509EncodedKeySpec

class ReleaseManifestVerifier {
    data class VerifiedRelease(
        val version: String,
        val sha256: String,
        val bridgeMin: String,
        val bridgeMax: String,
        val bundleUrl: String,
        val issuedAt: Long
    )

    fun verify(manifestText: String, signatureBase64: String): VerifiedRelease {
        require(BuildConfig.RELEASE_PUBLIC_KEY_B64.isNotBlank()) { "Release public key 未配置" }
        require(manifestText.isNotBlank()) { "Release manifest 為空" }
        require(signatureBase64.isNotBlank()) { "Release signature 為空" }

        val keyBytes = Base64.decode(BuildConfig.RELEASE_PUBLIC_KEY_B64, Base64.DEFAULT)
        val publicKey = KeyFactory.getInstance("RSA").generatePublic(X509EncodedKeySpec(keyBytes))
        val verifier = Signature.getInstance("SHA256withRSA")
        verifier.initVerify(publicKey)
        verifier.update(manifestText.toByteArray(Charsets.UTF_8))
        val valid = verifier.verify(Base64.decode(signatureBase64, Base64.DEFAULT))
        require(valid) { "Release manifest 簽名驗證失敗" }

        val json = JSONObject(manifestText)
        val version = json.optString("version").trim()
        val sha256 = json.optString("sha256").trim()
        val bridgeMin = json.optString("bridgeMin").trim()
        val bridgeMax = json.optString("bridgeMax").trim()
        val bundleUrl = json.optString("bundleUrl").trim()
        val issuedAt = json.optLong("issuedAt", 0L)

        require(version.matches(Regex("[A-Za-z0-9._-]{1,80}"))) { "Release version 無效" }
        require(sha256.matches(Regex("[a-fA-F0-9]{64}"))) { "Release SHA-256 無效" }
        require(bridgeMin.isNotBlank() && bridgeMax.isNotBlank()) { "Release Bridge range 缺失" }
        require(issuedAt > 0L) { "Release issuedAt 無效" }
        requireAllowedSource(bundleUrl)

        return VerifiedRelease(version, sha256, bridgeMin, bridgeMax, bundleUrl, issuedAt)
    }

    private fun requireAllowedSource(bundleUrl: String) {
        val uri = URI(bundleUrl)
        require(uri.scheme.equals("https", ignoreCase = true)) { "Release bundle 只接受 HTTPS" }
        val host = uri.host?.lowercase().orEmpty()
        require(host.isNotBlank()) { "Release bundle host 無效" }
        val allowed = BuildConfig.RELEASE_HOSTS
            .split(',')
            .map { it.trim().lowercase() }
            .filter { it.isNotBlank() }
            .toSet()
        require(allowed.isNotEmpty()) { "Release host allowlist 未配置" }
        require(host in allowed) { "Release bundle host 未授權：$host" }
    }
}
