package hk.morefun.smt

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

class BridgeProtocol(private val context: Context) {
    private val prefs = context.getSharedPreferences("morefun_smt_foundation", Context.MODE_PRIVATE)

    fun handle(rawMessage: String): String {
        return try {
            val request = JSONObject(rawMessage)
            val id = request.optString("id", UUID.randomUUID().toString())
            val method = request.optString("method")
            val result = when (method) {
                "bridge.getVersion" -> JSONObject()
                    .put("bridgeVersion", BuildConfig.BRIDGE_VERSION)
                    .put("webBundleVersion", BuildConfig.WEB_BUNDLE_VERSION)
                    .put("appVersion", BuildConfig.VERSION_NAME)
                "bridge.getCapabilities" -> JSONObject()
                    .put("bridgeVersion", BuildConfig.BRIDGE_VERSION)
                    .put("capabilities", JSONArray(listOf(
                        "device.info",
                        "network.status"
                    )))
                "device.getInfo" -> deviceInfo()
                "network.getStatus" -> networkStatus()
                else -> return error(id, "UNSUPPORTED_METHOD", "未支援 Bridge 方法：$method")
            }
            success(id, result)
        } catch (error: Throwable) {
            error("", "INVALID_REQUEST", error.message ?: "Bridge request 無效")
        }
    }

    private fun deviceInfo(): JSONObject {
        val terminalId = prefs.getString("terminal_id", null) ?: createTerminalId()
        return JSONObject()
            .put("terminalId", terminalId)
            .put("manufacturer", Build.MANUFACTURER)
            .put("model", Build.MODEL)
            .put("sdkInt", Build.VERSION.SDK_INT)
            .put("appVersion", BuildConfig.VERSION_NAME)
            .put("bridgeVersion", BuildConfig.BRIDGE_VERSION)
            .put("webBundleVersion", BuildConfig.WEB_BUNDLE_VERSION)
    }

    private fun networkStatus(): JSONObject {
        val manager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = manager.activeNetwork
        val capabilities = network?.let(manager::getNetworkCapabilities)
        val connected = capabilities?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true
        val transport = when {
            capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) == true -> "ethernet"
            capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true -> "wifi"
            capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true -> "cellular"
            else -> "unknown"
        }
        return JSONObject().put("connected", connected).put("transport", transport)
    }

    private fun createTerminalId(): String {
        val value = "SMT-${UUID.randomUUID().toString().replace("-", "").take(8).uppercase()}"
        prefs.edit().putString("terminal_id", value).apply()
        return value
    }

    private fun success(id: String, result: JSONObject): String = JSONObject()
        .put("id", id)
        .put("ok", true)
        .put("result", result)
        .toString()

    private fun error(id: String, code: String, message: String): String = JSONObject()
        .put("id", id)
        .put("ok", false)
        .put("error", JSONObject().put("code", code).put("message", message))
        .toString()
}
