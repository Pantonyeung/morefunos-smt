package hk.morefun.smt

import org.json.JSONArray
import org.json.JSONObject

class PrintRouter(private val registry: PrinterRegistry) {
    fun route(job: JSONObject): JSONObject {
        val target = job.optJSONObject("target") ?: JSONObject()
        val explicitPrinterId = target.optString("printerId").takeIf { it.isNotBlank() }
        val role = normalizeRole(target.optString("role", inferRole(job)))
        val selected = registry.resolve(explicitPrinterId, role)
        return toTarget(selected, role, false)
    }

    fun fallback(job: JSONObject, failedPrinterId: String): JSONObject? {
        val target = job.optJSONObject("target") ?: JSONObject()
        if (!target.optBoolean("allowBackup", true)) return null

        val primary = registry.get(failedPrinterId)
        val explicitFallback = primary?.optString("fallbackPrinterId")?.takeIf { it.isNotBlank() }
        if (explicitFallback != null) {
            val selected = runCatching { registry.resolve(explicitFallback, null) }.getOrNull()
            if (selected != null && selected.optString("printerId") != failedPrinterId) {
                return toTarget(selected, selected.optString("role", "backup"), true)
            }
        }

        val backups = registry.candidates("backup")
        val selected = backups.firstOrNull { it.optString("printerId") != failedPrinterId } ?: return null
        return toTarget(selected, normalizeRole(target.optString("role", inferRole(job))), true)
    }

    fun routeBatch(jobs: JSONArray): JSONArray {
        val result = JSONArray()
        for (index in 0 until jobs.length()) {
            val job = jobs.optJSONObject(index) ?: throw IllegalArgumentException("打印工作格式無效：index=$index")
            result.put(route(job))
        }
        return result
    }

    fun status(): JSONObject = JSONObject()
        .put("registry", registry.status())
        .put("supportedRoles", JSONArray(SUPPORTED_ROLES.toList().sorted()))
        .put("routingOrder", JSONArray(listOf("explicit_printer", "role_priority", "explicit_fallback", "backup_priority")))

    private fun toTarget(selected: JSONObject, requestedRole: String, fallbackUsed: Boolean): JSONObject {
        val transport = selected.getString("transport")
        val result = JSONObject()
            .put("printerId", selected.getString("printerId"))
            .put("name", selected.optString("name", selected.getString("printerId")))
            .put("role", selected.getString("role"))
            .put("transport", transport)
            .put("fallbackUsed", fallbackUsed)
            .put("requestedRole", requestedRole)
            .put("defaultCopies", selected.optInt("defaultCopies", 1))
            .put("purpose", selected.optString("purpose", selected.getString("role")))
            .put("templateId", selected.optString("templateId", "default"))
            .put("mediaProfile", selected.optJSONObject("mediaProfile") ?: JSONObject())

        if (transport == "tcp" || transport == "label-tcp") {
            result.put("host", selected.getString("host"))
                .put("port", selected.getInt("port"))
                .put("timeoutMs", selected.optInt("timeoutMs", 5000))
        } else {
            result.put("device", selected.optString("device", "built-in"))
        }
        return result
    }

    private fun inferRole(job: JSONObject): String = when (job.optString("kind").trim().lowercase()) {
        "receipt", "customer_receipt" -> "receipt"
        "kitchen", "kitchen_ticket", "production" -> "kitchen"
        "label", "product_label", "packing_label" -> "label"
        else -> "receipt"
    }

    private fun normalizeRole(value: String): String {
        val role = value.trim().lowercase()
        require(role in SUPPORTED_ROLES) { "打印路由角色無效：$role" }
        return role
    }

    companion object {
        private val SUPPORTED_ROLES = setOf("receipt", "kitchen", "label", "backup")
    }
}
