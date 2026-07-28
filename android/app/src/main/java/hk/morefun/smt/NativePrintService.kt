package hk.morefun.smt

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class NativePrintService(
    context: Context,
    sunmiPort: SunmiPrinterPort = UnavailableSunmiPrinterPort
) {
    private val printerSettings = PrinterDeviceSettings(context)
    private val printerRegistry = PrinterRegistry(context)
    private val router = PrintRouter(printerRegistry)
    private val tcpDriver = LanTcpPrintDriver(printerSettings)
    private val drivers = PrintDriverRegistry(
        listOf(tcpDriver, LabelPrintDriver(tcpDriver), SunmiPrintDriver(sunmiPort))
    )

    fun listPrinters(): JSONObject = printerRegistry.status()
    fun upsertPrinter(input: JSONObject): JSONObject = printerRegistry.upsert(input)
    fun removePrinter(printerId: String): JSONObject = printerRegistry.remove(printerId)
    fun route(job: JSONObject): JSONObject = router.route(job)
    fun routeBatch(jobs: JSONArray): JSONArray = router.routeBatch(jobs)

    fun print(job: JSONObject): JSONObject {
        val primary = router.route(job)
        val effectiveJob = JSONObject(job.toString())
        if (!effectiveJob.has("copies")) effectiveJob.put("copies", primary.optInt("defaultCopies", 1))

        return try {
            drivers.print(effectiveJob, primary)
                .put("jobId", job.optString("jobId"))
                .put("target", primary)
                .put("fallbackUsed", false)
        } catch (primaryError: Throwable) {
            val fallback = router.fallback(job, primary.getString("printerId")) ?: throw primaryError
            try {
                drivers.print(effectiveJob, fallback)
                    .put("jobId", job.optString("jobId"))
                    .put("target", fallback)
                    .put("fallbackUsed", true)
                    .put("primaryTarget", primary)
                    .put("primaryError", primaryError.message ?: primaryError.javaClass.simpleName)
            } catch (fallbackError: Throwable) {
                throw IllegalStateException(
                    "Primary 打印失敗：${primaryError.message}; Fallback 打印失敗：${fallbackError.message}",
                    fallbackError
                )
            }
        }
    }

    fun status(): JSONObject = JSONObject()
        .put("registry", printerRegistry.status())
        .put("router", router.status())
        .put("supportedTransports", JSONArray(drivers.supportedTransports()))
}
