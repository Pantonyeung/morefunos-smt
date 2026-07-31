package hk.morefun.smt

import android.util.Base64
import org.json.JSONObject
import java.nio.charset.Charset

/**
 * Driver boundary for SUNMI built-in printers.
 *
 * The binding is supplied through SunmiPrinterPort. The production implementation uses runtime
 * reflection so the APK remains installable on non-SUNMI Android devices without a vendor SDK.
 */
class SunmiPrintDriver(
    private val port: SunmiPrinterPort
) : PrintDriver {
    override val transport: String = "sunmi"

    fun isAvailable(): Boolean = runCatching { port.isAvailable() }.getOrDefault(false)

    override fun print(job: JSONObject, target: JSONObject): JSONObject {
        require(port.isAvailable()) { "SUNMI 內置打印服務未連接" }
        val content = job.optJSONObject("content")
            ?: throw IllegalArgumentException("打印工作缺少 content")
        val copies = job.optInt("copies", 1).coerceIn(1, 9)
        val bytes = decodeContent(content)
        require(bytes.isNotEmpty()) { "打印內容解碼後為空" }

        repeat(copies) { port.printRaw(bytes) }
        return JSONObject()
            .put("status", "printed")
            .put("transport", transport)
            .put("printerId", target.optString("printerId", "sunmi-built-in"))
            .put("copies", copies)
            .put("bytesWritten", bytes.size * copies)
            .put("completedAt", System.currentTimeMillis())
    }

    private fun decodeContent(content: JSONObject): ByteArray {
        val base64 = content.optString("base64").trim()
        if (base64.isNotBlank()) return Base64.decode(base64, Base64.DEFAULT)
        val text = content.optString("text")
        require(text.isNotBlank()) { "打印內容為空" }
        return text.toByteArray(Charset.forName(content.optString("encoding", "utf-8")))
    }
}

interface SunmiPrinterPort {
    fun isAvailable(): Boolean
    fun printRaw(bytes: ByteArray)
}

object UnavailableSunmiPrinterPort : SunmiPrinterPort {
    override fun isAvailable(): Boolean = false
    override fun printRaw(bytes: ByteArray) {
        throw IllegalStateException("SUNMI 內置打印服務未連接")
    }
}
