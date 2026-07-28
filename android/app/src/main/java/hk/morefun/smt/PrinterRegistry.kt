package hk.morefun.smt

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class PrinterRegistry(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun list(): JSONArray {
        val result = JSONArray()
        prefs.all.keys.filter { it.startsWith(PRINTER_PREFIX) }.sorted().forEach { key ->
            val raw = prefs.getString(key, null) ?: return@forEach
            runCatching { JSONObject(raw) }.getOrNull()?.let(result::put)
        }
        return result
    }

    fun get(printerId: String): JSONObject? {
        val safeId = normalizePrinterId(printerId)
        return prefs.getString(key(safeId), null)?.let { runCatching { JSONObject(it) }.getOrNull() }
    }

    fun upsert(input: JSONObject): JSONObject {
        val printerId = normalizePrinterId(input.optString("printerId"))
        val name = input.optString("name", printerId).trim().ifBlank { printerId }
        val role = normalizeRole(input.optString("role", "receipt"))
        val transport = input.optString("transport", "tcp").trim().lowercase()
        require(transport in TRANSPORTS) { "打印機 transport 無效：$transport" }
        require(name.length <= 80) { "打印機名稱過長" }

        val media = input.optJSONObject("mediaProfile") ?: JSONObject()
        val mediaType = media.optString("type", if (role == "label") "label" else "roll").lowercase()
        require(mediaType in setOf("roll", "label")) { "Media Profile type 無效：$mediaType" }
        val widthMm = media.optDouble("widthMm", if (mediaType == "label") 50.0 else 80.0)
        val heightMm = media.optDouble("heightMm", if (mediaType == "label") 30.0 else 0.0)
        require(widthMm in 20.0..120.0) { "Media Profile widthMm 無效" }
        require(heightMm == 0.0 || heightMm in 10.0..300.0) { "Media Profile heightMm 無效" }

        val record = JSONObject()
            .put("printerId", printerId)
            .put("name", name)
            .put("role", role)
            .put("transport", transport)
            .put("enabled", input.optBoolean("enabled", true))
            .put("priority", input.optInt("priority", 100).coerceIn(0, 9999))
            .put("defaultCopies", input.optInt("defaultCopies", 1).coerceIn(1, 9))
            .put("purpose", input.optString("purpose", role).trim().ifBlank { role })
            .put("templateId", input.optString("templateId", "default").trim().ifBlank { "default" })
            .put("fallbackPrinterId", input.optString("fallbackPrinterId").trim())
            .put("mediaProfile", JSONObject()
                .put("id", media.optString("id", "${mediaType}-${widthMm.toInt()}"))
                .put("type", mediaType)
                .put("widthMm", widthMm)
                .put("heightMm", heightMm)
                .put("density", media.optInt("density", 8).coerceIn(1, 15))
                .put("cutMode", media.optString("cutMode", if (mediaType == "roll") "partial" else "none"))
                .put("feedAfterPrint", media.optInt("feedAfterPrint", 3).coerceIn(0, 12)))
            .put("updatedAt", System.currentTimeMillis())

        if (transport == "tcp" || transport == "label-tcp") {
            val host = input.optString("host").trim()
            val port = input.optInt("port", 9100)
            require(host.isNotBlank()) { "打印機 IP／Host 不可為空" }
            require(port in 1..65535) { "打印機 Port 無效" }
            record.put("host", host).put("port", port)
                .put("timeoutMs", input.optInt("timeoutMs", 5000).coerceIn(1000, 15000))
        } else {
            record.put("device", input.optString("device", "built-in"))
        }

        check(prefs.edit().putString(key(printerId), record.toString()).commit()) { "Printer Registry 儲存失敗" }
        return record
    }

    fun remove(printerId: String): JSONObject {
        val safeId = normalizePrinterId(printerId)
        val existed = prefs.contains(key(safeId))
        check(prefs.edit().remove(key(safeId)).commit()) { "Printer Registry 刪除失敗" }
        return JSONObject().put("printerId", safeId).put("removed", existed)
    }

    fun resolve(printerId: String?, role: String?): JSONObject {
        if (!printerId.isNullOrBlank()) {
            val direct = get(printerId)
            require(direct != null) { "找不到打印機：$printerId" }
            require(direct.optBoolean("enabled", true)) { "打印機已停用：$printerId" }
            return direct
        }
        val safeRole = normalizeRole(role ?: "receipt")
        return candidates(safeRole).firstOrNull()
            ?: throw IllegalArgumentException("找不到可用打印機角色：$safeRole")
    }

    fun candidates(role: String): List<JSONObject> {
        val safeRole = normalizeRole(role)
        val result = mutableListOf<JSONObject>()
        val printers = list()
        for (index in 0 until printers.length()) {
            val candidate = printers.getJSONObject(index)
            if (candidate.optString("role") == safeRole && candidate.optBoolean("enabled", true)) result += candidate
        }
        return result.sortedWith(compareBy<JSONObject> { it.optInt("priority", 100) }.thenBy { it.optString("printerId") })
    }

    fun status(): JSONObject {
        val printers = list()
        var enabledCount = 0
        for (index in 0 until printers.length()) if (printers.getJSONObject(index).optBoolean("enabled", true)) enabledCount += 1
        return JSONObject().put("count", printers.length()).put("enabledCount", enabledCount)
            .put("supportedTransports", JSONArray(TRANSPORTS.toList().sorted())).put("printers", printers)
    }

    private fun normalizePrinterId(value: String): String {
        val normalized = value.trim()
        require(normalized.isNotBlank()) { "printerId 不可為空" }
        require(normalized.length <= 80) { "printerId 過長" }
        require(normalized.all { it.isLetterOrDigit() || it in "-_.:" }) { "printerId 格式無效" }
        return normalized
    }

    private fun normalizeRole(value: String): String {
        val role = value.trim().lowercase()
        require(role in ROLES) { "打印機角色無效：$role" }
        return role
    }

    private fun key(printerId: String): String = "$PRINTER_PREFIX$printerId"

    companion object {
        private const val PREFS_NAME = "morefun_smt_printer_registry"
        private const val PRINTER_PREFIX = "printer:"
        private val ROLES = setOf("receipt", "kitchen", "label", "backup")
        private val TRANSPORTS = setOf("tcp", "label-tcp", "sunmi")
    }
}
