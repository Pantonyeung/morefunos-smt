package hk.morefun.smt

import android.content.Context
import android.webkit.WebResourceResponse
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileInputStream
import java.security.MessageDigest
import java.util.zip.ZipInputStream

class WebBundleStore(private val context: Context) {
    private val prefs = context.getSharedPreferences("morefun_smt_foundation", Context.MODE_PRIVATE)
    private val root = File(context.filesDir, "verified_web_bundles").apply { mkdirs() }

    data class InstallResult(
        val version: String,
        val sha256: String,
        val previousVersion: String?
    )

    fun currentVersion(): String? = prefs.getString("web_bundle_current", null)
    fun previousVersion(): String? = prefs.getString("web_bundle_previous", null)

    fun status(): JSONObject = JSONObject()
        .put("currentVersion", currentVersion() ?: JSONObject.NULL)
        .put("previousGoodVersion", previousVersion() ?: JSONObject.NULL)
        .put("bundledFallbackVersion", BuildConfig.WEB_BUNDLE_VERSION)
        .put("currentVerified", currentVersion()?.let(::isInstalled) == true)
        .put("rollbackAvailable", previousVersion()?.let(::isInstalled) == true)

    fun installBase64Zip(
        version: String,
        expectedSha256: String,
        bridgeMin: String,
        bridgeMax: String,
        base64Zip: String
    ): InstallResult {
        require(version.matches(Regex("[A-Za-z0-9._-]{1,80}"))) { "Web bundle version 無效" }
        require(expectedSha256.matches(Regex("[a-fA-F0-9]{64}"))) { "SHA-256 無效" }
        require(isBridgeCompatible(BuildConfig.BRIDGE_VERSION, bridgeMin, bridgeMax)) {
            "Web bundle 與 Bridge ${BuildConfig.BRIDGE_VERSION} 不兼容"
        }

        val bytes = android.util.Base64.decode(base64Zip, android.util.Base64.DEFAULT)
        val actualSha256 = sha256(bytes)
        require(actualSha256.equals(expectedSha256, ignoreCase = true)) {
            "Web bundle 完整性驗證失敗"
        }

        val staging = File(root, ".staging-$version-${System.nanoTime()}")
        staging.mkdirs()
        try {
            unzipSafely(bytes, staging)
            require(File(staging, "index.html").isFile) { "Web bundle 缺少 index.html" }

            File(staging, "bundle-manifest.json").writeText(
                JSONObject()
                    .put("version", version)
                    .put("sha256", actualSha256)
                    .put("bridgeMin", bridgeMin)
                    .put("bridgeMax", bridgeMax)
                    .put("installedAt", System.currentTimeMillis())
                    .toString()
            )

            val target = File(root, version)
            if (target.exists()) target.deleteRecursively()
            require(staging.renameTo(target)) { "Web bundle 安裝搬移失敗" }

            val oldCurrent = currentVersion()
            prefs.edit()
                .putString("web_bundle_previous", oldCurrent)
                .putString("web_bundle_current", version)
                .apply()

            return InstallResult(version, actualSha256, oldCurrent)
        } finally {
            if (staging.exists()) staging.deleteRecursively()
        }
    }

    fun rollback(): String {
        val previous = previousVersion()
        require(!previous.isNullOrBlank() && isInstalled(previous)) { "沒有可用上一個版本" }
        val current = currentVersion()
        prefs.edit()
            .putString("web_bundle_current", previous)
            .putString("web_bundle_previous", current)
            .apply()
        return previous
    }

    fun open(path: String): WebResourceResponse? {
        val version = currentVersion() ?: return null
        val base = File(root, version).canonicalFile
        val clean = path.removePrefix("/").ifBlank { "index.html" }
        val file = File(base, clean).canonicalFile
        if (!file.path.startsWith(base.path + File.separator) && file != base) return null
        if (!file.isFile) return null
        return WebResourceResponse(mimeType(file.name), "UTF-8", FileInputStream(file))
    }

    fun isInstalled(version: String): Boolean {
        val dir = File(root, version)
        return File(dir, "index.html").isFile && File(dir, "bundle-manifest.json").isFile
    }

    private fun unzipSafely(bytes: ByteArray, destination: File) {
        ZipInputStream(ByteArrayInputStream(bytes)).use { input ->
            var entry = input.nextEntry
            while (entry != null) {
                val out = File(destination, entry.name).canonicalFile
                val rootPath = destination.canonicalFile.path + File.separator
                require(out.path.startsWith(rootPath)) { "ZIP 路徑不安全" }
                if (entry.isDirectory) {
                    out.mkdirs()
                } else {
                    out.parentFile?.mkdirs()
                    out.outputStream().use { output -> input.copyTo(output) }
                }
                input.closeEntry()
                entry = input.nextEntry
            }
        }
    }

    private fun sha256(bytes: ByteArray): String = MessageDigest.getInstance("SHA-256")
        .digest(bytes)
        .joinToString("") { "%02x".format(it) }

    private fun isBridgeCompatible(current: String, min: String, max: String): Boolean {
        if (min.isBlank() || max.isBlank()) return false
        return compareVersion(current, min) >= 0 && compareVersion(current, max) <= 0
    }

    private fun compareVersion(left: String, right: String): Int {
        val a = left.split('.').map { it.toIntOrNull() ?: 0 }
        val b = right.split('.').map { it.toIntOrNull() ?: 0 }
        val size = maxOf(a.size, b.size)
        for (index in 0 until size) {
            val av = a.getOrElse(index) { 0 }
            val bv = b.getOrElse(index) { 0 }
            if (av != bv) return av.compareTo(bv)
        }
        return 0
    }

    private fun mimeType(name: String): String = when (name.substringAfterLast('.', "").lowercase()) {
        "html" -> "text/html"
        "js", "mjs" -> "application/javascript"
        "css" -> "text/css"
        "json" -> "application/json"
        "svg" -> "image/svg+xml"
        "png" -> "image/png"
        "jpg", "jpeg" -> "image/jpeg"
        "webp" -> "image/webp"
        "woff" -> "font/woff"
        "woff2" -> "font/woff2"
        else -> "application/octet-stream"
    }
}
