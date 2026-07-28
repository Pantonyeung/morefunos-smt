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

class BridgeProtocol(
    private val context: Context,
    private val bundleStore: WebBundleStore = WebBundleStore(context),
    private val offlineQueue: OfflineQueueStore = OfflineQueueStore(context),
    private val hostActions: HostActions? = null
) {
    private val prefs = context.getSharedPreferences("morefun_smt_foundation", Context.MODE_PRIVATE)
    private val printerSettings = PrinterDeviceSettings(context)
    private val ioExecutor = Executors.newSingleThreadExecutor()

    fun handle(rawMessage: String, respond: (String) -> Unit) {
        try {
            val request = JSONObject(rawMessage)
            val id = request.optString("id", UUID.randomUUID().toString())
            val params = request.optJSONObject("params") ?: JSONObject()
            when (val method = request.optString("method")) {
                "bridge.getVersion" -> respond(success(id, JSONObject()
                    .put("bridgeVersion", BuildConfig.BRIDGE_VERSION)
                    .put("webBundleVersion", bundleStore.currentVersion() ?: BuildConfig.WEB_BUNDLE_VERSION)
                    .put("appVersion", BuildConfig.VERSION_NAME)))
                "bridge.getCapabilities" -> respond(success(id, JSONObject()
                    .put("bridgeVersion", BuildConfig.BRIDGE_VERSION)
                    .put("capabilities", JSONArray(capabilities()))))
                "device.getInfo" -> respond(success(id, deviceInfo()))
                "network.getStatus" -> respond(success(id, networkStatus()))
                "print.settings.get" -> getPrinterSettings(id, params, respond)
                "print.settings.set" -> setPrinterSettings(id, params, respond)
                "print.lan.tcp" -> printLanTcp(id, params, respond)
                "bundle.getStatus" -> respond(success(id, bundleStore.status()))
                "bundle.getVault" -> respond(success(id, JSONObject().put("versions", bundleStore.vault())))
                "bundle.install" -> installBundle(id, params, respond)
                "bundle.markHealthy" -> markBundleHealthy(id, params, respond)
                "bundle.rollback" -> rollbackBundle(id, respond)
                "offline.enqueue" -> respond(success(id, offlineQueue.enqueue(
                    params.optString("id"), params.optString("kind"),
                    params.optString("idempotencyKey"),
                    params.optJSONObject("payload") ?: JSONObject()
                )))
                "offline.listPending" -> respond(success(id, JSONObject().put(
                    "items", offlineQueue.listPending(params.optInt("limit", 100))
                )))
                "offline.markComplete" -> respond(success(id, queueResult(
                    offlineQueue.markComplete(params.optString("id")), params.optString("id")
                )))
                "offline.markFailed" -> respond(success(id, queueResult(
                    offlineQueue.markFailed(params.optString("id"), params.optString("error")),
                    params.optString("id")
                )))
                "offline.retry" -> respond(success(id, queueResult(
                    offlineQueue.retry(params.optString("id")), params.optString("id")
                )))
                "offline.getStatus" -> respond(success(id, offlineQueue.status()))
                "file.export" -> exportFile(id, params, respond)
                "file.import" -> importFile(id, params, respond)
                "runtime.reload" -> hostCall(id, respond) { it.reloadRuntime() }
                "kiosk.enter" -> hostCall(id, respond) { it.enterKiosk() }
                "kiosk.exit" -> hostCall(id, respond) { it.exitKiosk() }
                "diagnostics.get" -> respond(success(id, diagnostics()))
                else -> respond(error(id, "UNSUPPORTED_METHOD", "未支援 Bridge 方法：$method"))
            }
        } catch (error: Throwable) {
            respond(error("", "INVALID_REQUEST", error.message ?: "Bridge request 無效"))
        }
    }

    fun close() {
        ioExecutor.shutdownNow()
        offlineQueue.close()
    }

    private fun capabilities(): List<String> = buildList {
        add("device.info")
        add("network.status")
        add("print.lan.tcp")
        add("print.device-settings")
        add("print.paper-direction")
        add("bundle.verified.install")
        add("bundle.version-vault")
        add("bundle.health-confirm")
        add("bundle.rollback")
        add("offline.queue")
        add("offline.recovery")
        add("diagnostics")
        if (hostActions != null) {
            add("file.import")
            add("file.export")
            add("runtime.reload")
            add("kiosk.control")
        }
    }

    private fun getPrinterSettings(id: String, params: JSONObject, respond: (String) -> Unit) {
        try {
            respond(success(id, printerSettings.get(
                params.optString("printerId", PrinterDeviceSettings.DEFAULT_PRINTER_ID)
            )))
        } catch (error: Throwable) {
            respond(error(id, "PRINT_SETTINGS_INVALID", error.message ?: "打印機設定無效"))
        }
    }

    private fun setPrinterSettings(id: String, params: JSONObject, respond: (String) -> Unit) {
        try {
            val direction = params.optString("paperDirection")
            if (direction !in setOf("forward", "reverse")) {
                respond(error(id, "PRINT_DIRECTION_INVALID", "paperDirection 只接受 forward 或 reverse"))
                return
            }
            respond(success(id, printerSettings.set(
                params.optString("printerId", PrinterDeviceSettings.DEFAULT_PRINTER_ID), direction
            )))
        } catch (error: Throwable) {
            respond(error(id, "PRINT_SETTINGS_SAVE_FAILED", error.message ?: "打印機設定儲存失敗"))
        }
    }

    private fun installBundle(id: String, params: JSONObject, respond: (String) -> Unit) {
        ioExecutor.execute {
            try {
                val result = bundleStore.installBase64Zip(
                    version = params.optString("version"),
                    expectedSha256 = params.optString("sha256"),
                    bridgeMin = params.optString("bridgeMin"),
                    bridgeMax = params.optString("bridgeMax"),
                    base64Zip = params.optString("base64Zip")
                )
                respond(success(id, JSONObject()
                    .put("status", "installed_pending_health")
                    .put("version", result.version)
                    .put("sha256", result.sha256)
                    .put("previousVersion", result.previousVersion ?: JSONObject.NULL)
                    .put("requiresReload", true)))
            } catch (error: Throwable) {
                respond(error(id, "BUNDLE_INSTALL_FAILED", error.message ?: "Web bundle 安裝失敗"))
            }
        }
    }

    private fun markBundleHealthy(id: String, params: JSONObject, respond: (String) -> Unit) {
        try {
            val version = params.optString("version", bundleStore.currentVersion() ?: "")
            respond(success(id, bundleStore.markHealthy(version)))
        } catch (error: Throwable) {
            respond(error(id, "BUNDLE_HEALTH_CONFIRM_FAILED", error.message ?: "Web bundle 健康確認失敗"))
        }
    }

    private fun rollbackBundle(id: String, respond: (String) -> Unit) {
        ioExecutor.execute {
            try {
                val version = bundleStore.rollback()
                respond(success(id, JSONObject()
                    .put("status", "rolled_back")
                    .put("version", version)
                    .put("requiresReload", true)))
            } catch (error: Throwable) {
                respond(error(id, "BUNDLE_ROLLBACK_FAILED", error.message ?: "Web bundle 回滾失敗"))
            }
        }
    }

    private fun exportFile(id: String, params: JSONObject, respond: (String) -> Unit) {
        val host = hostActions ?: run {
            respond(error(id, "HOST_ACTION_UNAVAILABLE", "此裝置未提供文件匯出能力")); return
        }
        val base64Data = params.optString("base64")
        if (base64Data.isBlank()) {
            respond(error(id, "FILE_CONTENT_MISSING", "匯出內容為空")); return
        }
        host.exportFile(
            params.optString("fileName", "morefun-export.bin"),
            params.optString("mimeType", "application/octet-stream"),
            base64Data
        ) { result -> result.fold(
            onSuccess = { respond(success(id, it)) },
            onFailure = { respond(error(id, "FILE_EXPORT_FAILED", it.message ?: "文件匯出失敗")) }
        ) }
    }

    private fun importFile(id: String, params: JSONObject, respond: (String) -> Unit) {
        val host = hostActions ?: run {
            respond(error(id, "HOST_ACTION_UNAVAILABLE", "此裝置未提供文件匯入能力")); return
        }
        val mimeArray = params.optJSONArray("mimeTypes")
        val mimeTypes = if (mimeArray == null || mimeArray.length() == 0) {
            arrayOf("application/json", "application/zip", "text/csv")
        } else Array(mimeArray.length()) { index -> mimeArray.optString(index, "*/*") }
        host.importFile(mimeTypes) { result -> result.fold(
            onSuccess = { respond(success(id, it)) },
            onFailure = { respond(error(id, "FILE_IMPORT_FAILED", it.message ?: "文件匯入失敗")) }
        ) }
    }

    private fun hostCall(id: String, respond: (String) -> Unit, action: (HostActions) -> Unit) {
        val host = hostActions ?: run {
            respond(error(id, "HOST_ACTION_UNAVAILABLE", "此裝置未提供 Host 控制能力")); return
        }
        try {
            action(host)
            respond(success(id, JSONObject().put("status", "ok")))
        } catch (error: Throwable) {
            respond(error(id, "HOST_ACTION_FAILED", error.message ?: "Host 操作失敗"))
        }
    }

    private fun queueResult(value: JSONObject?, id: String): JSONObject {
        require(value != null) { "Offline queue item 不存在：$id" }
        return value
    }

    private fun diagnostics(): JSONObject = JSONObject()
        .put("appVersion", BuildConfig.VERSION_NAME)
        .put("bridgeVersion", BuildConfig.BRIDGE_VERSION)
        .put("bundledWebVersion", BuildConfig.WEB_BUNDLE_VERSION)
        .put("runtimeBundle", bundleStore.status())
        .put("offlineQueue", offlineQueue.status())
        .put("device", deviceInfo())
        .put("network", networkStatus())
        .put("defaultPrinterSettings", printerSettings.get(PrinterDeviceSettings.DEFAULT_PRINTER_ID))
        .put("capabilities", JSONArray(capabilities()))

    private fun printLanTcp(id: String, params: JSONObject, respond: (String) -> Unit) {
        ioExecutor.execute {
            val payload = params.optJSONObject("payload") ?: params
            val contract = payload.optString("contract")
            val jobId = payload.optString("jobId")
            val idempotencyKey = payload.optString("idempotencyKey", jobId)
            val target = payload.optJSONObject("target")
            val content = payload.optJSONObject("content")

            if (contract != "morefun.print.v1") {
                respond(error(id, "PRINT_CONTRACT_MISMATCH", "打印合約版本不支援：$contract")); return@execute
            }
            if (idempotencyKey.isBlank()) {
                respond(error(id, "PRINT_IDEMPOTENCY_REQUIRED", "打印工作缺少 idempotencyKey")); return@execute
            }
            if (wasPrinted(idempotencyKey)) {
                respond(success(id, JSONObject()
                    .put("status", "printed").put("jobId", jobId)
                    .put("idempotencyKey", idempotencyKey)
                    .put("duplicateSuppressed", true)
                    .put("completedAt", printedAt(idempotencyKey))))
                return@execute
            }
            if (target == null || target.optString("transport") != "tcp") {
                respond(error(id, "PRINT_TARGET_INVALID", "LAN 打印只接受 TCP target")); return@execute
            }
            if (content == null) {
                respond(error(id, "PRINT_CONTENT_MISSING", "打印工作缺少 content")); return@execute
            }

            val host = target.optString("host").trim()
            val port = target.optInt("port", 0)
            val timeoutMs = target.optInt("timeoutMs", 5000).coerceIn(1000, 15000)
            val copies = payload.optInt("copies", 1).coerceIn(1, 9)
            val printerId = target.optString("printerId", "$host:$port")
            val directionOverride = payload.optString("paperDirection").takeIf { it.isNotBlank() }
            val direction = try {
                printerSettings.resolve(printerId, directionOverride)
            } catch (error: Throwable) {
                respond(error(id, "PRINT_DIRECTION_INVALID", error.message ?: "打印方向無效")); return@execute
            }
            val base64Content = content.optString("base64").trim()
            val text = content.optString("text")
            val encoding = content.optString("encoding", "utf-8")

            if (host.isBlank() || port !in 1..65535) {
                respond(error(id, "PRINT_TARGET_INVALID", "打印機 IP／Port 無效")); return@execute
            }
            if (base64Content.isBlank() && text.isBlank()) {
                respond(error(id, "PRINT_CONTENT_MISSING", "打印內容為空")); return@execute
            }

            try {
                val contentMode: String
                val rawDocument: ByteArray
                if (base64Content.isNotBlank()) {
                    contentMode = "binary"
                    rawDocument = Base64.decode(base64Content, Base64.DEFAULT)
                } else {
                    contentMode = "text"
                    val charset = Charset.forName(encoding)
                    rawDocument = text.toByteArray(charset) + "\n\n\n".toByteArray(charset)
                }
                if (rawDocument.isEmpty()) {
                    respond(error(id, "PRINT_CONTENT_MISSING", "打印內容解碼後為空")); return@execute
                }
                val documentBytes = printerSettings.wrapEscPos(rawDocument, direction)
                var totalBytes = 0
                Socket().use { socket ->
                    socket.connect(InetSocketAddress(host, port), timeoutMs)
                    socket.soTimeout = timeoutMs
                    socket.getOutputStream().use { output ->
                        repeat(copies) {
                            output.write(documentBytes)
                            totalBytes += documentBytes.size
                        }
                        output.flush()
                    }
                }
                val completedAt = System.currentTimeMillis()
                markPrinted(idempotencyKey, completedAt)
                respond(success(id, JSONObject()
                    .put("status", "printed").put("jobId", jobId)
                    .put("idempotencyKey", idempotencyKey)
                    .put("duplicateSuppressed", false)
                    .put("printerId", printerId)
                    .put("paperDirection", direction.wireValue)
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
            .put("webBundleVersion", bundleStore.currentVersion() ?: BuildConfig.WEB_BUNDLE_VERSION)
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
        .put("id", id).put("ok", true).put("result", result).toString()

    private fun error(id: String, code: String, message: String): String = JSONObject()
        .put("id", id).put("ok", false)
        .put("error", JSONObject().put("code", code).put("message", message)).toString()
}
