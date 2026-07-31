package hk.morefun.smt

import android.content.Context
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

/** E-line only: downloads a verified APK release into app-private staging storage. */
class ApkDownloadStager(private val context: Context) {
    data class StagedApk(
        val file: File,
        val sha256: String,
        val byteLength: Long
    )

    fun stage(
        release: ApkUpdateManifestVerifier.VerifiedApkRelease,
        connectTimeoutMs: Int = 15_000,
        readTimeoutMs: Int = 60_000,
        maxBytes: Long = 250L * 1024L * 1024L
    ): StagedApk {
        require(maxBytes > 0L) { "APK OTA maxBytes 必須大於 0" }
        val stagingDir = File(context.noBackupFilesDir, "apk-ota-staging")
        if (!stagingDir.exists()) require(stagingDir.mkdirs()) { "無法建立 APK OTA staging 目錄" }

        val part = File(stagingDir, "update-${release.versionCode}.apk.part")
        val ready = File(stagingDir, "update-${release.versionCode}.apk")
        if (part.exists()) part.delete()
        if (ready.exists()) ready.delete()

        val connection = (URL(release.apkUrl).openConnection() as HttpURLConnection).apply {
            instanceFollowRedirects = false
            connectTimeout = connectTimeoutMs
            readTimeout = readTimeoutMs
            requestMethod = "GET"
            setRequestProperty("Accept", "application/vnd.android.package-archive,application/octet-stream")
            setRequestProperty("Cache-Control", "no-cache")
        }

        try {
            val code = connection.responseCode
            require(code == HttpURLConnection.HTTP_OK) { "APK OTA 下載 HTTP $code" }
            val declared = connection.getHeaderField("Content-Length")?.trim()?.toLongOrNull() ?: -1L
            require(declared <= 0L || declared <= maxBytes) { "APK OTA 檔案超過大小限制" }

            val digest = MessageDigest.getInstance("SHA-256")
            var total = 0L
            connection.inputStream.use { input ->
                FileOutputStream(part, false).use { output ->
                    val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                    while (true) {
                        val read = input.read(buffer)
                        if (read < 0) break
                        total += read
                        require(total <= maxBytes) { "APK OTA 檔案超過大小限制" }
                        digest.update(buffer, 0, read)
                        output.write(buffer, 0, read)
                    }
                    output.fd.sync()
                }
            }
            require(total > 0L) { "APK OTA 下載內容為空" }
            if (declared > 0L) require(total == declared) { "APK OTA 下載長度不完整" }

            val actualSha = digest.digest().joinToString("") { "%02x".format(it) }
            require(actualSha.equals(release.sha256, ignoreCase = true)) { "APK OTA SHA-256 不一致" }
            require(part.renameTo(ready)) { "APK OTA staging 完成檔改名失敗" }
            return StagedApk(ready, actualSha, total)
        } catch (error: Throwable) {
            part.delete()
            ready.delete()
            throw error
        } finally {
            connection.disconnect()
        }
    }
}
