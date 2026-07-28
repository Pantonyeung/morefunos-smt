package hk.morefun.smt

import android.content.Context
import android.webkit.WebResourceResponse
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileInputStream
import java.security.MessageDigest
import java.util.zip.ZipInputStream

class WebBundleStore(private val context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    private val root = File(context.filesDir, "verified_web_bundles").apply { mkdirs() }

    data class InstallResult(
        val version: String,
        val sha256: String,
        val previousVersion: String?
    )

    fun currentVersion(): String? = prefs.getString(KEY_CURRENT, null)

    fun previousVersion(): String? = history().firstOrNull()

    fun prepareRuntimeForLaunch(): JSONObject {
        val current = currentVersion()
        if (current != null && !isInstalled(current)) {
            return rollbackInternal("CURRENT_MISSING")
        }

        val pending = prefs.getString(KEY_PENDING_HEALTH, null)
        if (!pending.isNullOrBlank() && pending == current) {
            val attempted = prefs.getBoolean(KEY_PENDING_ATTEMPTED, false)
            if (attempted) return rollbackInternal("UNHEALTHY_RESTART")

            prefs.edit().putBoolean(KEY_PENDING_ATTEMPTED, true).apply()
            return JSONObject()
                .put("status", "candidate_first_launch")
                .put("version", pending)
        }

        return JSONObject()
            .put("status", "ready")
            .put("version", current ?: JSONObject.NULL)
    }

    fun markHealthy(version: String): JSONObject {
        require(version.isNotBlank() && version == currentVersion()) {
            "健康確認版本唔係目前 Runtime"
        }
        require(isInstalled(version)) { "健康確認版本未安裝" }

        updateManifest(version) { manifest ->
            manifest
                .put("status", "healthy")
                .put("verifiedAt", System.currentTimeMillis())
        }
        prefs.edit()
            .remove(KEY_PENDING_HEALTH)
            .remove(KEY_PENDING_ATTEMPTED)
            .apply()
        pruneVault()
        return status().put("healthConfirmed", true)
    }

    fun status(): JSONObject = JSONObject()
        .put("currentVersion", currentVersion() ?: JSONObject.NULL)
        .put("previousGoodVersion", previousVersion() ?: JSONObject.NULL)
        .put("bundledFallbackVersion", BuildConfig.WEB_BUNDLE_VERSION)
        .put("currentVerified", currentVersion()?.let(::isHealthy) == true)
        .put("pendingHealthVersion", prefs.getString(KEY_PENDING_HEALTH, null) ?: JSONObject.NULL)
        .put("rollbackAvailable", previousVersion()?.let(::isInstalled) == true)
        .put("vault", vault())

    fun vault(): JSONArray {
        val out = JSONArray()
        currentVersion()?.takeIf(String::isNotBlank)?.let {
            out.put(versionEntry(it, "current"))
        }
        history().forEachIndexed { index, version ->
            out.put(versionEntry(version, if (index == 0) "n-1" else "n-2"))
        }
        out.put(
            JSONObject()
                .put("version", BuildConfig.WEB_BUNDLE_VERSION)
                .put("slot", "factory")
                .put("installed", true)
                .put("healthy", true)
        )
        return out
    }

    fun installBase64Zip(
        version: String,
        expectedSha256: String,
        bridgeMin: String,
        bridgeMax: String,
        base64Zip: String
    ): InstallResult {
        require(version.matches(Regex("[A-Za-z0-9._-]{1,80}"))) {
            "Web bundle version 無效"
        }
        require(expectedSha256.matches(Regex("[a-fA-F0-9]{64}"))) {
            "SHA-256 無效"
        }
        require(isBridgeCompatible(BuildConfig.BRIDGE_VERSION, bridgeMin, bridgeMax)) {
            "Web bundle 與 Bridge ${BuildConfig.BRIDGE_VERSION} 不兼容"
        }

        val bytes = android.util.Base64.decode(base64Zip, android.util.Base64.DEFAULT)
        val actualSha256 = sha256(bytes)
        require(actualSha256.equals(expectedSha256, ignoreCase = true)) {
            "Web bundle 完整性驗證失敗"
        }

        val oldCurrent = currentVersion()
        val oldHistory = history()
        val oldCurrentWasHealthy = !oldCurrent.isNullOrBlank() && isHealthy(oldCurrent)
        val staging = File(root, ".staging-$version-${System.nanoTime()}")
        staging.mkdirs()

        try {
            unzipSafely(bytes, staging)
            require(File(staging, "index.html").isFile) {
                "Web bundle 缺少 index.html"
            }

            File(staging, MANIFEST_FILE).writeText(
                JSONObject()
                    .put("version", version)
                    .put("sha256", actualSha256)
                    .put("bridgeMin", bridgeMin)
                    .put("bridgeMax", bridgeMax)
                    .put("installedAt", System.currentTimeMillis())
                    .put("verifiedAt", JSONObject.NULL)
                    .put("status", "pending_health")
                    .toString()
            )

            val target = File(root, version)
            if (target.exists()) target.deleteRecursively()
            require(staging.renameTo(target)) { "Web bundle 安裝搬移失敗" }

            prefs.edit()
                .putString(KEY_CURRENT, version)
                .putString(KEY_PENDING_HEALTH, version)
                .putBoolean(KEY_PENDING_ATTEMPTED, false)
                .apply()

            val nextHistory = if (oldCurrentWasHealthy && oldCurrent != version) {
                listOf(oldCurrent!!) + oldHistory
            } else {
                oldHistory
            }
            saveHistory(nextHistory)
            pruneVault()
            return InstallResult(version, actualSha256, oldCurrent)
        } finally {
            if (staging.exists()) staging.deleteRecursively()
        }
    }

    fun rollback(): String {
        val result = rollbackInternal("MANUAL")
        val version = result.optString("version")
        require(version.isNotBlank()) { "沒有可用上一個版本" }
        return version
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
        return File(dir, "index.html").isFile && File(dir, MANIFEST_FILE).isFile
    }

    private fun isHealthy(version: String): Boolean =
        manifest(version)?.optString("status") == "healthy"

    private fun rollbackInternal(reason: String): JSONObject {
        val current = currentVersion()
        val target = history().firstOrNull { isInstalled(it) && isHealthy(it) }

        if (target.isNullOrBlank()) {
            prefs.edit()
                .remove(KEY_CURRENT)
                .remove(KEY_PENDING_HEALTH)
                .remove(KEY_PENDING_ATTEMPTED)
                .apply()
            return JSONObject()
                .put("status", "factory_fallback")
                .put("reason", reason)
                .put("failedVersion", current ?: JSONObject.NULL)
                .put("version", BuildConfig.WEB_BUNDLE_VERSION)
        }

        if (!current.isNullOrBlank() && isInstalled(current)) {
            updateManifest(current) {
                it.put("status", "failed_health")
                    .put("failedAt", System.currentTimeMillis())
            }
        }

        prefs.edit()
            .putString(KEY_CURRENT, target)
            .remove(KEY_PENDING_HEALTH)
            .remove(KEY_PENDING_ATTEMPTED)
            .apply()
        saveHistory(history().filterNot { it == target })
        pruneVault()

        return JSONObject()
            .put("status", "rolled_back")
            .put("reason", reason)
            .put("failedVersion", current ?: JSONObject.NULL)
            .put("version", target)
    }

    private fun history(): List<String> {
        val raw = prefs.getString(KEY_HISTORY, "[]") ?: "[]"
        return try {
            val array = JSONArray(raw)
            (0 until array.length())
                .mapNotNull { array.optString(it).takeIf(String::isNotBlank) }
                .distinct()
                .take(MAX_HISTORY)
        } catch (_: Throwable) {
            emptyList()
        }
    }

    private fun saveHistory(versions: List<String>) {
        val current = currentVersion()
        val clean = versions
            .filter { it.isNotBlank() && it != current && isInstalled(it) && isHealthy(it) }
            .distinct()
            .take(MAX_HISTORY)
        prefs.edit().putString(KEY_HISTORY, JSONArray(clean).toString()).apply()
    }

    private fun pruneVault() {
        val keep = buildSet {
            currentVersion()?.let(::add)
            addAll(history())
        }
        root.listFiles()?.forEach { file ->
            if (file.isDirectory && !file.name.startsWith(".staging-") && file.name !in keep) {
                file.deleteRecursively()
            }
        }
    }

    private fun versionEntry(version: String, slot: String): JSONObject {
        val manifest = manifest(version)
        return JSONObject()
            .put("version", version)
            .put("slot", slot)
            .put("installed", isInstalled(version))
            .put("healthy", isHealthy(version))
            .put("sha256", manifest?.optString("sha256") ?: JSONObject.NULL)
            .put("bridgeMin", manifest?.optString("bridgeMin") ?: JSONObject.NULL)
            .put("bridgeMax", manifest?.optString("bridgeMax") ?: JSONObject.NULL)
            .put("installedAt", manifest?.opt("installedAt") ?: JSONObject.NULL)
            .put("verifiedAt", manifest?.opt("verifiedAt") ?: JSONObject.NULL)
            .put("status", manifest?.optString("status") ?: "unknown")
    }

    private fun manifest(version: String): JSONObject? = try {
        val file = File(root, "$version/$MANIFEST_FILE")
        if (!file.isFile) null else JSONObject(file.readText())
    } catch (_: Throwable) {
        null
    }

    private fun updateManifest(version: String, transform: (JSONObject) -> JSONObject) {
        val file = File(root, "$version/$MANIFEST_FILE")
        require(file.isFile) { "Web bundle manifest 不存在：$version" }
        file.writeText(transform(JSONObject(file.readText())).toString())
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

    private fun sha256(bytes: ByteArray): String = MessageDigest
        .getInstance("SHA-256")
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

    companion object {
        private const val PREFS_NAME = "morefun_smt_foundation"
        private const val MANIFEST_FILE = "bundle-manifest.json"
        private const val MAX_HISTORY = 2
        private const val KEY_CURRENT = "web_bundle_current"
        private const val KEY_HISTORY = "web_bundle_history"
        private const val KEY_PENDING_HEALTH = "web_bundle_pending_health"
        private const val KEY_PENDING_ATTEMPTED = "web_bundle_pending_attempted"
    }
}
