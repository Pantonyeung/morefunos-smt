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
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun checkAndInstall(): JSONObject {
        val startedAt = System.currentTimeMillis()
        prefs.edit()
            .putString(KEY_STATUS, "checking")
            .putLong(KEY_LAST_CHECK_AT, startedAt)
            .remove(KEY_LAST_ERROR)
            .apply()

        return try {
            val result = performCheckAndInstall()
            recordSuccess(result)
            result
        } catch (error: Throwable) {
            recordFailure(error)
            throw error
        }
    }

    fun status(): JSONObject = JSONObject()
        .put("status", prefs.getString(KEY_STATUS, "never_checked") ?: "never_checked")
        .put("lastCheckAt", prefs.getLong(KEY_LAST_CHECK_AT, 0L))
        .put("lastSuccessAt", prefs.getLong(KEY_LAST_SUCCESS_AT, 0L))
        .put("lastAcceptedIssuedAt", prefs.getLong(KEY_LAST_ACCEPTED_ISSUED_AT, 0L))
        .put("lastVersion", prefs.getString(KEY_LAST_VERSION, null) ?: JSONObject.NULL)
        .put("lastError", prefs.getString(KEY_LAST_ERROR, null) ?: JSONObject.NULL)
        .put("manifestUrlConfigured", BuildConfig.RELEASE_MANIFEST_URL.isNotBlank())

    private fun performCheckAndInstall(): JSONObject {
        val manifestUrl = BuildConfig.RELEASE_MANIFEST_URL.trim()
        if (manifestUrl.isBlank()) {
            return JSONObject().put("status", "release_source_not_configured")
        }

        requireAllowedHost(manifestUrl)
        val envelopeText = downloadText(manifestUrl, MAX_MANIFEST_BYTES)
        val envelope = JSONObject(envelopeText)
        val manifestText = envelope.optString("manifest")
        val signature = envelope.optString("signature")
        val release = verifier.verify(manifestText, signature)
        rejectReplay(release)

        if (bundleStore.currentVersion() == release.version) {
            rememberAcceptedRelease(release.version, release.issuedAt)
            return JSONObject()
                .put("status", "already_current")
                .put("version", release.version)
                .put("issuedAt", release.issuedAt)
        }

        val zipBytes = downloadBytes(release.bundleUrl, MAX_BUNDLE_BYTES)
        val result = bundleStore.installBase64Zip(
            version = release.version,
            expectedSha256 = release.sha256,
            bridgeMin = release.bridgeMin,
            bridgeMax = release.bridgeMax,
            base64Zip = Base64.encodeToString(zipBytes, Base64.NO_WRAP)
        )
        rememberAcceptedRelease(release.version, release.issuedAt)

        return JSONObject()
            .put("status", "installed_pending_health")
            .put("version", result.version)
            .put("sha256", result.sha256)
            .put("issuedAt", release.issuedAt)
            .put("previousVersion", result.previousVersion ?: JSONObject.NULL)
    }

    private fun rejectReplay(release: ReleaseManifestVerifier.VerifiedRelease) {
        val lastIssuedAt = prefs.getLong(KEY_LAST_ACCEPTED_ISSUED_AT, 0L)
        val lastVersion = prefs.getString(KEY_LAST_VERSION, null)
        if (lastIssuedAt <= 0L) return

        require(release.issuedAt >= lastIssuedAt) {
            "Release manifest 比已接受版本舊，拒絕回放"
        }
        if (release.issuedAt == lastIssuedAt && lastVersion != null) {
            require(release.version == lastVersion) {
                "Release issuedAt 重複但版本不一致"
            }
        }
    }

    private fun rememberAcceptedRelease(version: String, issuedAt: Long) {
        check(prefs.edit()
            .putLong(KEY_LAST_ACCEPTED_ISSUED_AT, issuedAt)
            .putString(KEY_LAST_VERSION, version)
            .commit()) { "Release 接受狀態儲存失敗" }
    }

    private fun recordSuccess(result: JSONObject) {
        prefs.edit()
            .putString(KEY_STATUS, result.optString("status", "ok"))
            .putLong(KEY_LAST_SUCCESS_AT, System.currentTimeMillis())
            .remove(KEY_LAST_ERROR)
            .apply()
    }

    private fun recordFailure(error: Throwable) {
        prefs.edit()
            .putString(KEY_STATUS, "failed")
            .putString(KEY_LAST_ERROR, (error.message ?: error.javaClass.simpleName).take(500))
            .apply()
    }

    private fun downloadText(url: String, maxBytes: Int): String =
        downloadBytes(url, maxBytes).toString(Charsets.UTF_8)

    private fun downloadBytes(url: String, maxBytes: Int): ByteArray {
        requireAllowedHost(url)
        val connection = URL(url).openConnection()
        require(connection is HttpsURLConnection) { "Release 只接受 HTTPS" }
        connection.instanceFollowRedirects = false
        connection.connectTimeout = CONNECT_TIMEOUT_MS
        connection.readTimeout = READ_TIMEOUT_MS
        connection.requestMethod = "GET"
        connection.useCaches = false
        connection.setRequestProperty("Accept", "application/json, application/zip, application/octet-stream")
        connection.setRequestProperty("Cache-Control", "no-cache")
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
        require(uri.userInfo.isNullOrBlank()) { "Release URL 不接受 user-info" }
        require(uri.fragment.isNullOrBlank()) { "Release URL 不接受 fragment" }
        val host = uri.host?.lowercase().orEmpty()
        val allowed = BuildConfig.RELEASE_HOSTS
            .split(',')
            .map { it.trim().lowercase() }
            .filter { it.isNotBlank() }
            .toSet()
        require(host.isNotBlank() && host in allowed) { "Release host 未授權：$host" }
    }

    companion object {
        private const val PREFS_NAME = "morefun_smt_release_update"
        private const val KEY_STATUS = "status"
        private const val KEY_LAST_CHECK_AT = "last_check_at"
        private const val KEY_LAST_SUCCESS_AT = "last_success_at"
        private const val KEY_LAST_ACCEPTED_ISSUED_AT = "last_accepted_issued_at"
        private const val KEY_LAST_VERSION = "last_version"
        private const val KEY_LAST_ERROR = "last_error"
        private const val MAX_MANIFEST_BYTES = 1_048_576
        private const val MAX_BUNDLE_BYTES = 32 * 1024 * 1024
        private const val CONNECT_TIMEOUT_MS = 3500
        private const val READ_TIMEOUT_MS = 8000
    }
}
