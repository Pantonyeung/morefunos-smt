package hk.morefun.smt

import android.content.Context
import android.util.Base64
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.net.URI
import java.net.URL
import javax.net.ssl.HttpsURLConnection

class ReleaseUpdateManager(
    private val context: Context,
    private val bundleStore: WebBundleStore = WebBundleStore(context),
    private val verifier: ReleaseManifestVerifier = ReleaseManifestVerifier()
) {
    fun checkAndInstall(): JSONObject {
        val manifestUrl = BuildConfig.RELEASE_MANIFEST_URL.trim()
        if (manifestUrl.isBlank()) {
            return JSONObject().put("status", "release_source_not_configured")
        }

        requireAllowedHost(manifestUrl)
        val envelopeText = downloadText(manifestUrl, 1_048_576)
        val envelope = JSONObject(envelopeText)
        val manifestText = envelope.optString("manifest")
        val signature = envelope.optString("signature")
        val release = verifier.verify(manifestText, signature)

        if (bundleStore.currentVersion() == release.version) {
            return JSONObject()
                .put("status", "already_current")
                .put("version", release.version)
        }

        val zipBytes = downloadBytes(release.bundleUrl, 32 * 1024 * 1024)
        val result = bundleStore.installBase64Zip(
            version = release.version,
            expectedSha256 = release.sha256,
            bridgeMin = release.bridgeMin,
            bridgeMax = release.bridgeMax,
            base64Zip = Base64.encodeToString(zipBytes, Base64.NO_WRAP)
        )

        return JSONObject()
            .put("status", "installed_pending_health")
            .put("version", result.version)
            .put("sha256", result.sha256)
            .put("previousVersion", result.previousVersion ?: JSONObject.NULL)
    }

    private fun downloadText(url: String, maxBytes: Int): String =
        downloadBytes(url, maxBytes).toString(Charsets.UTF_8)

    private fun downloadBytes(url: String, maxBytes: Int): ByteArray {
        requireAllowedHost(url)
        val connection = URL(url).openConnection()
        require(connection is HttpsURLConnection) { "Release 只接受 HTTPS" }
        connection.instanceFollowRedirects = false
        connection.connectTimeout = 2500
        connection.readTimeout = 4000
        connection.requestMethod = "GET"
        connection.setRequestProperty("Accept", "application/json, application/zip, application/octet-stream")
        connection.connect()
        try {
            require(connection.responseCode == HttpsURLConnection.HTTP_OK) {
                "Release HTTP ${connection.responseCode}"
            }
            val declaredLength = connection.contentLengthLong
            require(declaredLength <= maxBytes || declaredLength < 0L) { "Release 檔案過大" }
            val output = ByteArrayOutputStream()
            connection.inputStream.use { input ->
                val buffer = ByteArray(16 * 1024)
                var total = 0
                while (true) {
                    val read = input.read(buffer)
                    if (read < 0) break
                    total += read
                    require(total <= maxBytes) { "Release 檔案超過上限" }
                    output.write(buffer, 0, read)
                }
            }
            return output.toByteArray()
        } finally {
            connection.disconnect()
        }
    }

    private fun requireAllowedHost(url: String) {
        val uri = URI(url)
        require(uri.scheme.equals("https", ignoreCase = true)) { "Release 只接受 HTTPS" }
        val host = uri.host?.lowercase().orEmpty()
        val allowed = BuildConfig.RELEASE_HOSTS
            .split(',')
            .map { it.trim().lowercase() }
            .filter { it.isNotBlank() }
            .toSet()
        require(host.isNotBlank() && host in allowed) { "Release host 未授權：$host" }
    }
}
