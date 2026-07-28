package hk.morefun.smt

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID
import java.util.concurrent.Executors

class BridgeProtocol(
    private val context: Context,
    private val bundleStore: WebBundleStore = WebBundleStore(context),
    private val offlineQueue: OfflineQueueStore = OfflineQueueStore(context),
    private val hostActions: HostActions? = null,
    private val printController: BridgePrintController = BridgePrintController(context)
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
                "device.getInfo", "bridge.getDeviceInfo" -> respond(success(id, deviceInfo()))
                "network.getStatus", "bridge.getNetworkStatus" -> respond(success(id, networkStatus()))
                "print.settings.get" -> executeSync(id, respond, "PRINT_SETTINGS_INVALID") {
                    printerSettings.get(params.optString("printerId", PrinterDeviceSettings.DEFAULT_PRINTER_ID))
                }
                "print.settings.set" -> executeSync(id, respond, "PRINT_SETTINGS_SAVE_FAILED") {
                    val direction = params.optString("paperDirection")
                    require(direction in setOf("forward", "reverse")) {
                        "paperDirection 只接受 forward 或 reverse"
                    }
                    printerSettings.set(
                        params.optString("printerId", PrinterDeviceSettings.DEFAULT_PRINTER_ID),
                        direction
                    )
                }
                "print.registry.list" -> executeSync(id, respond, "PRINT_REGISTRY_LIST_FAILED") {
                    printController.listPrinters()
                }
                "print.registry.upsert" -> executeSync(id, respond, "PRINT_REGISTRY_SAVE_FAILED") {
                    printController.upsertPrinter(params)
                }
                "print.registry.remove" -> executeSync(id, respond, "PRINT_REGISTRY_REMOVE_FAILED") {
                    printController.removePrinter(params)
                }
                "print.route" -> executeSync(id, respond, "PRINT_ROUTE_FAILED") {
                    printController.route(params)
                }
                "print.routeBatch" -> executeSync(id, respond, "PRINT_ROUTE_BATCH_FAILED") {
                    printController.routeBatch(params)
                }
                "print.execute", "print.lan.tcp", "bridge.print" -> executeAsync(id, respond, "PRINT_EXECUTE_FAILED") {
                    printController.print(params)
                }
                "print.job.getStatus", "bridge.getPrintJobStatus" -> executeSync(id, respond, "PRINT_JOB_STATUS_FAILED") {
                    printController.getJobStatus(params)
                }
                "print.status" -> executeSync(id, respond, "PRINT_STATUS_FAILED") {
                    printController.status()
                }
                "bundle.getStatus" -> respond(success(id, bundleStore.status()))
                "bundle.getVault" -> respond(success(id, JSONObject().put("versions", bundleStore.vault())))
                "bundle.install" -> installBundle(id, params, respond)
                "bundle.markHealthy" -> executeSync(id, respond, "BUNDLE_HEALTH_CONFIRM_FAILED") {
                    val version = params.optString("version", bundleStore.currentVersion() ?: "")
                    bundleStore.markHealthy(version)
                }
                "bundle.rollback" -> executeAsync(id, respond, "BUNDLE_ROLLBACK_FAILED") {
                    JSONObject()
                        .put("status", "rolled_back")
                        .put("version", bundleStore.rollback())
                        .put("requiresReload", true)
                }
                "offline.enqueue" -> executeSync(id, respond, "OFFLINE_ENQUEUE_FAILED") {
                    offlineQueue.enqueue(
                        params.optString("id"),
                        params.optString("kind"),
                        params.optString("idempotencyKey"),
                        params.optJSONObject("payload") ?: JSONObject()
                    )
                }
                "offline.listPending" -> respond(success(id, JSONObject().put(
                    "items", offlineQueue.listPending(params.optInt("limit", 100))
                )))
                "offline.markComplete" -> executeSync(id, respond, "OFFLINE_COMPLETE_FAILED") {
                    queueResult(offlineQueue.markComplete(params.optString("id")), params.optString("id"))
                }
                "offline.markFailed" -> executeSync(id, respond, "OFFLINE_FAIL_FAILED") {
                    queueResult(
                        offlineQueue.markFailed(params.optString("id"), params.optString("error")),
                        params.optString("id")
                    )
                }
                "offline.retry" -> executeSync(id, respond, "OFFLINE_RETRY_FAILED") {
                    queueResult(offlineQueue.retry(params.optString("id")), params.optString("id"))
                }
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
        addAll(printController.capabilities())
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
    }.distinct()

    private fun installBundle(id: String, params: JSONObject, respond: (String) -> Unit) {
        executeAsync(id, respond, "BUNDLE_INSTALL_FAILED") {
            val result = bundleStore.installBase64Zip(
                version = params.optString("version"),
                expectedSha256 = params.optString("sha256"),
                bridgeMin = params.optString("bridgeMin"),
                bridgeMax = params.optString("bridgeMax"),
                base64Zip = params.optString("base64Zip")
            )
            JSONObject()
                .put("status", "installed_pending_health")
                .put("version", result.version)
                .put("sha256", result.sha256)
                .put("previousVersion", result.previousVersion ?: JSONObject.NULL)
                .put("requiresReload", true)
        }
    }

    private fun exportFile(id: String, params: JSONObject, respond: (String) -> Unit) {
        val host = hostActions ?: run {
            respond(error(id, "HOST_ACTION_UNAVAILABLE", "此裝置未提供文件匯出能力"))
            return
        }
        val base64Data = params.optString("base64")
        if (base64Data.isBlank()) {
            respond(error(id, "FILE_CONTENT_MISSING", "匯出內容為空"))
            return
        }
        host.exportFile(
            params.optString("fileName", "morefun-export.bin"),
            params.optString("mimeType", "application/octet-stream"),
            base64Data
        ) { result ->
            result.fold(
                onSuccess = { respond(success(id, it)) },
                onFailure = { respond(error(id, "FILE_EXPORT_FAILED", it.message ?: "文件匯出失敗")) }
            )
        }
    }

    private fun importFile(id: String, params: JSONObject, respond: (String) -> Unit) {
        val host = hostActions ?: run {
            respond(error(id, "HOST_ACTION_UNAVAILABLE", "此裝置未提供文件匯入能力"))
            return
        }
        val mimeArray = params.optJSONArray("mimeTypes")
        val mimeTypes = if (mimeArray == null || mimeArray.length() == 0) {
            arrayOf("application/json", "application/zip", "text/csv")
        } else {
            Array(mimeArray.length()) { index -> mimeArray.optString(index, "*/*") }
        }
        host.importFile(mimeTypes) { result ->
            result.fold(
                onSuccess = { respond(success(id, it)) },
                onFailure = { respond(error(id, "FILE_IMPORT_FAILED", it.message ?: "文件匯入失敗")) }
            )
        }
    }

    private fun hostCall(id: String, respond: (String) -> Unit, action: (HostActions) -> Unit) {
        val host = hostActions ?: run {
            respond(error(id, "HOST_ACTION_UNAVAILABLE", "此裝置未提供 Host 控制能力"))
            return
        }
        try {
            action(host)
            respond(success(id, JSONObject().put("status", "ok")))
        } catch (error: Throwable) {
            respond(error(id, "HOST_ACTION_FAILED", error.message ?: "Host 操作失敗"))
        }
    }

    private fun executeSync(
        id: String,
        respond: (String) -> Unit,
        errorCode: String,
        action: () -> JSONObject
    ) {
        try {
            respond(success(id, action()))
        } catch (error: Throwable) {
            respond(error(id, errorCode, error.message ?: "操作失敗"))
        }
    }

    private fun executeAsync(
        id: String,
        respond: (String) -> Unit,
        errorCode: String,
        action: () -> JSONObject
    ) {
        ioExecutor.execute {
            executeSync(id, respond, errorCode, action)
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
        .put("printing", printController.status())
        .put("defaultPrinterSettings", printerSettings.get(PrinterDeviceSettings.DEFAULT_PRINTER_ID))
        .put("capabilities", JSONArray(capabilities()))

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
