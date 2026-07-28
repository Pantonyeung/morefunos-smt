package hk.morefun.smt

import org.json.JSONObject

/**
 * Label driver contract for network label printers.
 *
 * Phase 1 uses the stable TCP transport while keeping label validation and defaults isolated.
 * Device-specific TSPL/ZPL rendering can be added later without changing BridgeProtocol.
 */
class LabelPrintDriver(
    private val tcpDriver: LanTcpPrintDriver
) : PrintDriver {
    override val transport: String = "label-tcp"

    override fun print(job: JSONObject, target: JSONObject): JSONObject {
        val role = target.optString("role", "label").lowercase()
        require(role == "label") { "Label Driver 只接受 label 角色" }

        val delegatedTarget = JSONObject(target.toString()).put("transport", "tcp")
        val result = tcpDriver.print(job, delegatedTarget)
        return JSONObject(result.toString())
            .put("transport", transport)
            .put("labelMode", true)
    }
}
