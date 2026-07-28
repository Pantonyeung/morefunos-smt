package hk.morefun.smt

import android.content.Context
import org.json.JSONObject

class PrintJobLedger(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun get(idempotencyKey: String): JSONObject? {
        val key = normalize(idempotencyKey)
        val stored = prefs.all[storageKey(key)] ?: return null
        return when (stored) {
            is String -> runCatching { JSONObject(stored) }.getOrNull()
            is Long -> JSONObject().put("idempotencyKey", key).put("status", "printed").put("completedAt", stored)
            else -> null
        }
    }

    fun containsCompleted(idempotencyKey: String): Boolean = get(idempotencyKey)?.optString("status") == "printed"

    fun markPending(idempotencyKey: String, jobId: String): JSONObject = write(
        idempotencyKey,
        JSONObject().put("jobId", jobId).put("status", "pending").put("startedAt", System.currentTimeMillis())
    )

    fun markCompleted(idempotencyKey: String, completedAt: Long = System.currentTimeMillis(), result: JSONObject? = null): JSONObject =
        write(idempotencyKey, JSONObject().put("status", "printed").put("completedAt", completedAt).put("result", result ?: JSONObject.NULL))

    fun markFailed(idempotencyKey: String, error: Throwable): JSONObject = write(
        idempotencyKey,
        JSONObject().put("status", "failed").put("failedAt", System.currentTimeMillis())
            .put("error", error.message ?: error.javaClass.simpleName)
    )

    fun recoverInterrupted(): JSONObject {
        var recovered = 0
        prefs.all.filterKeys { it.startsWith(PREFIX) }.forEach { (storageKey, stored) ->
            val record = if (stored is String) runCatching { JSONObject(stored) }.getOrNull() else null
            if (record?.optString("status") == "pending") {
                record.put("status", "interrupted")
                    .put("interruptedAt", System.currentTimeMillis())
                    .put("requiresManualRetry", true)
                check(prefs.edit().putString(storageKey, record.toString()).commit()) { "打印工作恢復狀態儲存失敗" }
                recovered += 1
            }
        }
        return JSONObject().put("recoveredInterruptedCount", recovered)
    }

    fun clear(idempotencyKey: String): JSONObject {
        val key = normalize(idempotencyKey)
        val existed = prefs.contains(storageKey(key))
        check(prefs.edit().remove(storageKey(key)).commit()) { "打印工作狀態清除失敗" }
        return JSONObject().put("idempotencyKey", key).put("removed", existed)
    }

    fun status(): JSONObject {
        val counts = mutableMapOf("pending" to 0, "printed" to 0, "failed" to 0, "interrupted" to 0)
        prefs.all.filterKeys { it.startsWith(PREFIX) }.values.forEach { stored ->
            val state = when (stored) {
                is String -> runCatching { JSONObject(stored).optString("status") }.getOrDefault("")
                is Long -> "printed"
                else -> ""
            }
            if (state in counts) counts[state] = counts.getValue(state) + 1
        }
        return JSONObject()
            .put("jobCount", counts.values.sum())
            .put("pendingCount", counts.getValue("pending"))
            .put("printedCount", counts.getValue("printed"))
            .put("failedCount", counts.getValue("failed"))
            .put("interruptedCount", counts.getValue("interrupted"))
    }

    private fun write(idempotencyKey: String, patch: JSONObject): JSONObject {
        val key = normalize(idempotencyKey)
        val previous = get(key)
        val record = JSONObject().put("idempotencyKey", key)
            .put("jobId", patch.optString("jobId", previous?.optString("jobId").orEmpty()))
        patch.keys().forEach { field -> record.put(field, patch.get(field)) }
        check(prefs.edit().putString(storageKey(key), record.toString()).commit()) { "打印工作狀態儲存失敗" }
        return record
    }

    private fun normalize(value: String): String {
        val normalized = value.trim()
        require(normalized.isNotBlank()) { "idempotencyKey 不可為空" }
        require(normalized.length <= 160) { "idempotencyKey 過長" }
        return normalized
    }

    private fun storageKey(idempotencyKey: String): String = "$PREFIX$idempotencyKey"

    companion object {
        private const val PREFS_NAME = "morefun_smt_print_job_ledger"
        private const val PREFIX = "completed:"
    }
}
