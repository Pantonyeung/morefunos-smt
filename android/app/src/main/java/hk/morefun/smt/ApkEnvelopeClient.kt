package hk.morefun.smt

import java.net.HttpURLConnection
import java.net.URI
import java.net.URL

/** E-line only: downloads the signed APK OTA envelope from the pinned stable channel. */
class ApkEnvelopeClient {
    fun fetch(
        manifestUrl: String = BuildConfig.APK_OTA_MANIFEST_URL,
        connectTimeoutMs: Int = 10_000,
        readTimeoutMs: Int = 20_000,
        maxBytes: Int = 1024 * 1024
    ): String {
        require(maxBytes in 1..MAX_ENVELOPE_BYTES) { "APK OTA envelope 大小限制無效" }
        requireAllowedUrl(manifestUrl)

        val connection = (URL(manifestUrl).openConnection() as HttpURLConnection).apply {
            instanceFollowRedirects = false
            connectTimeout = connectTimeoutMs
            readTimeout = readTimeoutMs
            requestMethod = "GET"
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Cache-Control", "no-cache")
        }
        try {
            val code = connection.responseCode
            require(code == HttpURLConnection.HTTP_OK) { "APK OTA envelope HTTP $code" }
            val declared = connection.contentLengthLong
            require(declared <= 0L || declared <= maxBytes.toLong()) { "APK OTA envelope 超過大小限制" }

            val output = java.io.ByteArrayOutputStream()
            connection.inputStream.use { input ->
                val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                var total = 0
                while (true) {
                    val read = input.read(buffer)
                    if (read < 0) break
                    total += read
                    require(total <= maxBytes) { "APK OTA envelope 超過大小限制" }
                    output.write(buffer, 0, read)
                }
            }
            val text = output.toString(Charsets.UTF_8.name())
            require(text.isNotBlank()) { "APK OTA envelope 為空" }
            return text
        } finally {
            connection.disconnect()
        }
    }

    private fun requireAllowedUrl(url: String) {
        val uri = URI(url)
        require(uri.scheme.equals("https", ignoreCase = true)) { "APK OTA envelope 只接受 HTTPS" }
        require(uri.userInfo.isNullOrBlank()) { "APK OTA envelope URL 不接受 user-info" }
        require(uri.fragment.isNullOrBlank()) { "APK OTA envelope URL 不接受 fragment" }
        val host = uri.host?.lowercase().orEmpty()
        val allowed = BuildConfig.APK_OTA_HOSTS
            .split(',')
            .map { it.trim().lowercase() }
            .filter { it.isNotBlank() }
            .toSet()
        require(host.isNotBlank() && host in allowed) { "APK OTA envelope host 未授權：$host" }
    }

    companion object {
        private const val MAX_ENVELOPE_BYTES = 2 * 1024 * 1024
    }
}
