package hk.morefun.smt

import org.json.JSONObject

interface HostActions {
    fun reloadRuntime()
    fun enterKiosk()
    fun exitKiosk()
    fun exportFile(fileName: String, mimeType: String, base64Data: String, respond: (Result<JSONObject>) -> Unit)
    fun importFile(mimeTypes: Array<String>, respond: (Result<JSONObject>) -> Unit)
}
