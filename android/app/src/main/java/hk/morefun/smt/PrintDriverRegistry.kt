package hk.morefun.smt

import org.json.JSONObject

/**
 * Resolves the correct native print driver without leaking transport logic into BridgeProtocol.
 */
class PrintDriverRegistry(drivers: List<PrintDriver>) {
    private val byTransport: Map<String, PrintDriver> = drivers.associateBy { it.transport.lowercase() }

    fun supportedTransports(): List<String> = byTransport.keys.sorted()

    fun resolve(target: JSONObject): PrintDriver {
        val transport = target.optString("transport").trim().lowercase()
        require(transport.isNotBlank()) { "打印目標缺少 transport" }
        return byTransport[transport]
            ?: throw IllegalArgumentException("未支援打印 transport：$transport")
    }

    fun print(job: JSONObject, target: JSONObject): JSONObject = resolve(target).print(job, target)
}
