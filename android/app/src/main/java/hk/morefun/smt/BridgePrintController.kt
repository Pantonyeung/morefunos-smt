package hk.morefun.smt

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class BridgePrintController(
    context: Context,
    private val printService: NativePrintService = NativePrintService(context),
    private val ledger: PrintJobLedger = PrintJobLedger(context)
) {
    private val startupRecovery: JSONObject = ledger.recoverInterrupted()

    fun capabilities(): List<String> = listOf(
        "print.registry",
        "print.routing",
        "print.media-profile",
        "print.failover",
        "print.native",
        "print.idempotency",
        "print.job-status",
        "print.pending-recovery",
        "print.lan.tcp",
        "print.label.tcp",
        "print.sunmi"
    )

    fun listPrinters(): JSONObject = printService.listPrinters()
    fun upsertPrinter(params: JSONObject): JSONObject = printService.upsertPrinter(params.optJSONObject("printer") ?: params)
    fun removePrinter(params: JSONObject): JSONObject = printService.removePrinter(params.optString("printerId"))
    fun route(params: JSONObject): JSONObject = printService.route(extractJob(params))

    fun routeBatch(params: JSONObject): JSONObject {
        val jobs = params.optJSONArray("jobs") ?: JSONArray()
        return JSONObject().put("routes", printService.routeBatch(jobs))
    }

    fun getJobStatus(params: JSONObject): JSONObject {
        val key = params.optString("idempotencyKey", params.optString("jobId")).trim()
        require(key.isNotBlank()) { "打印工作狀態查詢缺少 jobId 或 idempotencyKey" }
        return ledger.get(key) ?: JSONObject().put("idempotencyKey", key).put("status", "not_found")
    }

    fun print(params: JSONObject): JSONObject {
        val job = extractJob(params)
        validateContract(job)
        val jobId = job.optString("jobId").trim()
        require(jobId.isNotBlank()) { "打印工作缺少 jobId" }
        val idempotencyKey = job.optString("idempotencyKey", jobId).trim()
        require(idempotencyKey.isNotBlank()) { "打印工作缺少 idempotencyKey" }

        val previous = ledger.get(idempotencyKey)
        if (previous?.optString("status") == "printed") {
            return JSONObject(previous.toString()).put("jobId", jobId)
                .put("idempotencyKey", idempotencyKey).put("duplicateSuppressed", true)
        }

        ledger.markPending(idempotencyKey, jobId)
        return try {
            val result = printService.print(job)
            val completedAt = result.optLong("completedAt", System.currentTimeMillis())
            ledger.markCompleted(idempotencyKey, completedAt, result)
            result.put("idempotencyKey", idempotencyKey).put("duplicateSuppressed", false).put("completedAt", completedAt)
        } catch (error: Throwable) {
            ledger.markFailed(idempotencyKey, error)
            throw error
        }
    }

    fun status(): JSONObject = JSONObject()
        .put("service", printService.status())
        .put("ledger", ledger.status())
        .put("startupRecovery", startupRecovery)
        .put("capabilities", JSONArray(capabilities()))

    private fun extractJob(params: JSONObject): JSONObject =
        params.optJSONObject("payload") ?: params.optJSONObject("job") ?: params

    private fun validateContract(job: JSONObject) {
        val contract = job.optString("contract")
        require(contract == CONTRACT) { "打印合約版本不支援：$contract" }
        require(job.optJSONObject("content") != null) { "打印工作缺少 content" }
    }

    companion object {
        const val CONTRACT = "morefun.print.v1"
    }
}
