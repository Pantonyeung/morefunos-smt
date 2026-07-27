package hk.morefun.smt

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.util.Base64
import org.json.JSONArray
import org.json.JSONObject
import java.net.InetSocketAddress
import java.net.Socket
import java.nio.charset.Charset
import java.util.UUID
import java.util.concurrent.Executors

class BridgeProtocol(private val context: Context) {
    private val prefs = context.getSharedPreferences("morefun_smt_foundation", Context.MODE_PRIVATE)
    private val ioExecutor = Executors.newSingleThreadExecutor()

    fun handle(rawMessage: String, respond: (String) -> Unit) {
        try {
            val request = JSONObject(rawMessage)
            val id = request.optString("id", UUID.randomUUID().toString())
            when (val method = request.optString("method")) {
                "bridge.getVersion" -> respond(success(id, JSONObject()
                    .put("bridgeVersion", BuildConfig.BRIDGE_VERSION)
                    .put("webBundleVersion", BuildConfig.WEB_BUNDLE_VERSION)
                    .put("appVersion", BuildConfig.VERSION_NAME)))
                "bridge.getCapabilities" -> respond(success(id, JSONObject()
                    .put("bridgeVersion", BuildConfig.BRIDGE_VERSION)
                    .put("capabilities", JSONArray(listOf(
                        "device.info",
                        "network.status",
                        "print.lan.tcp"
                    )))))
                "device.getInfo" -> respond(success(id, deviceInfo()))
                "network.getStatus" -> respond(success(id, networkStatus()))
                "print.lan.tcp" -> printLanTcp(id, request.optJSONObject("params") ?: JSONObject(), respond)
                else -> respond(error(id, "UNSUPPORTED_METHOD", "未支援 Bridge 方法：$method"))
            }
        } catch (error: Throwable) {
            respond(error("", "INVALID_REQUEST", error.message ?: "Bridge request 無效"))
        }
    }

    fun close() {
        ioExecutor.shutdownNow()
    }

    private fun printLanTcp(id: String, params: JSONObject, respond: (String) -> Unit) {
        ioExecutor.execute {
            val payload = params.optJSONObject("payload") ?: params
            val contract = payload.optString("contract")
            val jobId = payload.optString("jobId")
            val idempotencyKey = payload.optString("idempotencyKey", jobId)
            val target = payload.optJSONObject("target")
            val content = payload.optJSONObject("content")

            if (contract != "morefun.print.v1") {
                respond(error(id, "PRINT_CONTRACT_MISMATCH", "打印合約版本不支援：$contract"))
                return@execute
            }
            if (idempotencyKey.isBlank()) {
                respond(error(id, "PRINT_IDEMPOTENCY_REQUIRED", "打印工作缺少 idempotencyKey"))
                return@execute
            }
            if (wasPrinted(idempotencyKey)) {
                respond(success(id, JSONObject()
                    .put("status", "printed")
                    .put("jobId", jobId)
                    .put("idempotencyKey", idempotencyKey)
                    .put("duplicateSuppressed", true)
                    .put("completedAt", printedAt(idempotencyKey))))
                return@execute
            }
            if (target == null || target.optString("transport") != "tcp") {
                respond(error(id, "PRINT_TARGET_INVALID", "LAN 打印只接受 TCP target"))
                return@execute
            }
            if (content == null) {
                respond(error(id, "PRINT_CONTENT_MISSING", "打印工作缺少 content"))
                return@execute
            }

            val host = target.optString("host").trim()
            val port = target.optInt("port", 0)
            val timeoutMs = target.optInt("timeoutMs", 5000).coerceIn(1000, 15000)
            val copies = payload.optInt("copies", 1).coerceIn(1, 9)
            val base64Content = content.optString("base64").trim()
            val text = content.optString("text")
            val encoding = content.optString("encoding", "utf-8")

            if (host.isBlank() || port !in 1..65535) {
                respond(error(id, "PRINT_TARGET_INVALID", "打印機 IP／Port 無效"))
                return@execute
            }
            if (base64Content.isBlank() && text.isBlank()) {
                respond(error(id, "PRINT_CONTENT_MISSING", "打印內容為空"))
                return@execute
            }

            try {
                val contentMode: String
                val documentBytes: ByteArray
                val feedBytes: ByteArray
                if (base64Content.isNotBlank()) {
                    contentMode = "binary"
                    documentBytes = Base64.decode(base64Content, Base64.DEFAULT)
                    feedBytes = byteArrayOf()
                } else {
                    contentMode = "text"
                    val charset = Charset.forName(encoding)
                    documentBytes = text.toByteArray(charset)
                    feedBytes = "\n\n\n".toByteArray(charset)
                }
                if (documentBytes.isEmpty()) {
                    respond(error(id, "PRINT_CONTENT_MISSING", "打印內容解碼後為空"))
                    return@execute
                }

                var totalBytes = 0
                Socket().use { socket ->
                    socket.connect(InetSocketAddress(host, port), timeoutMs)
                    socket.soTimeout = timeoutMs
                    socket.getOutputStream().use { output ->
                        repeat(copies) {
                            output.write(documentBytes)
                            if (feedBytes.isNotEmpty()) output.write(feedBytes)
                            totalBytes += documentBytes.size + feedBytes.size
                        }
                        output.flush()
                    }
                }
                val completedAt = System.currentTimeMillis()
                markPrinted(idempotencyKey, completedAt)
                respond(success(id, JSONObject()
                    .put("status", "printed")
                    .put("jobId", jobId)
                    .put("idempotencyKey", idempotencyKey)
                    .put("duplicateSuppressed", false)
                    .put("contentMode", contentMode)
                    .put("bytesWritten", totalBytes)
                    .put("completedAt", completedAt)))
            } catch (error: Throwable) {
                respond(error(id, "PRINT_TCP_FAILED", error.message ?: "LAN 打印失敗"))
            }
        }
    }

    private fun wasPrinted(idempotencyKey: String): Boolean = prefs.contains("printed:$idempotencyKey")

    private fun printedAt(idempotencyKey: String): Long = prefs.getLong("printed:$idempotencyKey", 0L)

    private fun markPrinted(idempotencyKey: String, completedAt: Long) {
        prefs.edit().putLong("printed:$idempotencyKey", completedAt).apply()
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