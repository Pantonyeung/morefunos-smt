package hk.morefun.smt

import android.content.Context
import org.json.JSONObject

/**
 * Stable device-layer printer settings.
 *
 * These settings belong to the physical terminal, not to the replaceable SMT Web Runtime.
 * Business pages may read/write them through the versioned Native Bridge, but runtime bundle
 * replacement, rollback, cache clearing, or reinstalling a Web bundle must not erase them.
 */
class PrinterDeviceSettings(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    enum class PaperDirection(val wireValue: String) {
        FORWARD("forward"),
        REVERSE("reverse");

        companion object {
            fun fromWire(value: String): PaperDirection =
                entries.firstOrNull { it.wireValue == value.lowercase() } ?: FORWARD
        }
    }

    fun get(printerId: String): JSONObject {
        val safeId = normalizePrinterId(printerId)
        val direction = PaperDirection.fromWire(
            prefs.getString(directionKey(safeId), PaperDirection.FORWARD.wireValue)
                ?: PaperDirection.FORWARD.wireValue
        )
        return JSONObject()
            .put("printerId", safeId)
            .put("paperDirection", direction.wireValue)
            .put("scope", "physical_device")
    }

    fun set(printerId: String, paperDirection: String): JSONObject {
        val safeId = normalizePrinterId(printerId)
        val direction = PaperDirection.fromWire(paperDirection)
        prefs.edit().putString(directionKey(safeId), direction.wireValue).commit()
        return get(safeId)
    }

    fun resolve(printerId: String?, jobOverride: String?): PaperDirection {
        if (!jobOverride.isNullOrBlank()) return PaperDirection.fromWire(jobOverride)
        return PaperDirection.fromWire(
            prefs.getString(
                directionKey(normalizePrinterId(printerId ?: DEFAULT_PRINTER_ID)),
                PaperDirection.FORWARD.wireValue
            ) ?: PaperDirection.FORWARD.wireValue
        )
    }

    fun transform(bytes: ByteArray, direction: PaperDirection): ByteArray = when (direction) {
        PaperDirection.FORWARD -> bytes
        PaperDirection.REVERSE -> bytes.reversedArray()
    }

    private fun normalizePrinterId(value: String): String {
        val normalized = value.trim().ifBlank { DEFAULT_PRINTER_ID }
        require(normalized.length <= 80) { "printerId 過長" }
        require(normalized.all { it.isLetterOrDigit() || it in "-_.:" }) { "printerId 格式無效" }
        return normalized
    }

    private fun directionKey(printerId: String): String = "printer:$printerId:paper_direction"

    companion object {
        private const val PREFS_NAME = "morefun_smt_device_printer_settings"
        const val DEFAULT_PRINTER_ID = "default"
    }
}
