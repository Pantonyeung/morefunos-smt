package hk.morefun.smt

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Base64
import android.view.View
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import org.json.JSONObject

class MainActivity : Activity(), HostActions {
    private lateinit var webView: WebView
    private lateinit var bridge: BridgeProtocol
    private lateinit var bundleStore: WebBundleStore
    private var startupRecovery = JSONObject().put("status", "not_started")

    private val localOrigin = "https://appassets.androidplatform.net"
    private val startUrl = "$localOrigin/runtime/index.html"
    private var pendingExport: PendingExport? = null
    private var pendingImport: ((Result<JSONObject>) -> Unit)? = null

    private data class PendingExport(
        val bytes: ByteArray,
        val respond: (Result<JSONObject>) -> Unit
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        bundleStore = WebBundleStore(this)
        startupRecovery = bundleStore.prepareRuntimeForLaunch()
        bridge = BridgeProtocol(this, bundleStore, hostActions = this)
        enterImmersiveMode()
        webView = createWebView()
        setContentView(webView)
        webView.loadUrl(startUrl)
    }

    override fun onResume() {
        super.onResume()
        enterImmersiveMode()
        if (::webView.isInitialized) {
            webView.onResume()
            dispatchLifecycle("foreground")
        }
    }

    override fun onPause() {
        if (::webView.isInitialized) {
            dispatchLifecycle("background")
            webView.onPause()
        }
        super.onPause()
    }

    override fun onDestroy() {
        if (::bridge.isInitialized) bridge.close()
        if (::webView.isInitialized) {
            webView.stopLoading()
            webView.removeJavascriptInterface("MoreFunNative")
            webView.removeAllViews()
            webView.destroy()
        }
        pendingExport?.respond?.invoke(Result.failure(IllegalStateException("Activity 已關閉")))
        pendingImport?.invoke(Result.failure(IllegalStateException("Activity 已關閉")))
        pendingExport = null
        pendingImport = null
        super.onDestroy()
    }

    override fun reloadRuntime() {
        runOnUiThread {
            if (::webView.isInitialized) {
                webView.clearCache(false)
                webView.loadUrl(startUrl)
            }
        }
    }

    override fun enterKiosk() {
        runOnUiThread { enterImmersiveMode() }
    }

    override fun exitKiosk() {
        runOnUiThread {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                window.insetsController?.show(
                    android.view.WindowInsets.Type.statusBars() or android.view.WindowInsets.Type.navigationBars()
                )
            } else {
                @Suppress("DEPRECATION")
                window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE
            }
        }
    }

    override fun exportFile(
        fileName: String,
        mimeType: String,
        base64Data: String,
        respond: (Result<JSONObject>) -> Unit
    ) {
        if (pendingExport != null || pendingImport != null) {
            respond(Result.failure(IllegalStateException("已有文件操作進行中")))
            return
        }
        try {
            val bytes = Base64.decode(base64Data, Base64.DEFAULT)
            pendingExport = PendingExport(bytes, respond)
            val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = mimeType.ifBlank { "application/octet-stream" }
                putExtra(Intent.EXTRA_TITLE, fileName.ifBlank { "morefun-export.bin" })
            }
            startActivityForResult(intent, REQUEST_EXPORT)
        } catch (error: Throwable) {
            pendingExport = null
            respond(Result.failure(error))
        }
    }

    override fun importFile(mimeTypes: Array<String>, respond: (Result<JSONObject>) -> Unit) {
        if (pendingExport != null || pendingImport != null) {
            respond(Result.failure(IllegalStateException("已有文件操作進行中")))
            return
        }
        pendingImport = respond
        try {
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = if (mimeTypes.size == 1) mimeTypes[0] else "*/*"
                if (mimeTypes.size > 1) putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes)
            }
            startActivityForResult(intent, REQUEST_IMPORT)
        } catch (error: Throwable) {
            pendingImport = null
            respond(Result.failure(error))
        }
    }

    @Deprecated("Deprecated in Android SDK but required for API 23 compatibility")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        when (requestCode) {
            REQUEST_EXPORT -> finishExport(resultCode, data)
            REQUEST_IMPORT -> finishImport(resultCode, data)
        }
    }

    private fun finishExport(resultCode: Int, data: Intent?) {
        val pending = pendingExport ?: return
        pendingExport = null
        if (resultCode != RESULT_OK || data?.data == null) {
            pending.respond(Result.failure(IllegalStateException("文件匯出已取消")))
            return
        }
        try {
            contentResolver.openOutputStream(data.data!!, "w")!!.use { it.write(pending.bytes) }
            pending.respond(Result.success(JSONObject()
                .put("status", "exported")
                .put("byteLength", pending.bytes.size)))
        } catch (error: Throwable) {
            pending.respond(Result.failure(error))
        }
    }

    private fun finishImport(resultCode: Int, data: Intent?) {
        val respond = pendingImport ?: return
        pendingImport = null
        if (resultCode != RESULT_OK || data?.data == null) {
            respond(Result.failure(IllegalStateException("文件匯入已取消")))
            return
        }
        try {
            val uri = data.data!!
            val bytes = contentResolver.openInputStream(uri)!!.use { it.readBytes() }
            val mime = contentResolver.getType(uri) ?: "application/octet-stream"
            respond(Result.success(JSONObject()
                .put("status", "imported")
                .put("mimeType", mime)
                .put("byteLength", bytes.size)
                .put("base64", Base64.encodeToString(bytes, Base64.NO_WRAP))))
        } catch (error: Throwable) {
            respond(Result.failure(error))
        }
    }

    private fun createWebView(): WebView {
        val packagedFallback = WebViewAssetLoader.AssetsPathHandler(this)
        val runtimeHandler = WebViewAssetLoader.PathHandler { path ->
            bundleStore.open(path) ?: packagedFallback.handle("smt/$path")
        }
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/runtime/", runtimeHandler)
            .addPathHandler("/assets/", packagedFallback)
            .build()

        val view = WebView(this)
        view.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            cacheMode = WebSettings.LOAD_DEFAULT
        }
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)

        view.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                return request?.url?.let(assetLoader::shouldInterceptRequest)
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url ?: return true
                val allowed = url.scheme == "https" && url.host == "appassets.androidplatform.net"
                return !allowed
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                if (url == startUrl && ::webView.isInitialized) {
                    val payload = JSONObject.quote(startupRecovery.toString())
                    webView.evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('morefun:native-runtime-start',{detail:JSON.parse($payload)}));",
                        null
                    )
                }
            }
        }

        installBridge(view)
        return view
    }

    private fun installBridge(view: WebView) {
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(
                view,
                "MoreFunNative",
                setOf(localOrigin)
            ) { _, message, sourceOrigin, isMainFrame, replyProxy ->
                if (!isMainFrame || sourceOrigin.toString() != localOrigin) {
                    replyProxy.postMessage("{\"ok\":false,\"error\":{\"code\":\"INVALID_ORIGIN\",\"message\":\"Bridge origin rejected\"}}")
                    return@addWebMessageListener
                }
                bridge.handle(message.data ?: "") { response ->
                    runOnUiThread { replyProxy.postMessage(response) }
                }
            }
            return
        }

        // Disaster-backup path for Android 6 / old System WebView only.
        // Navigation is still restricted to packaged/verified appassets content.
        view.addJavascriptInterface(LegacyBridgeAdapter(this, view, bridge), "MoreFunNative")
    }

    private fun dispatchLifecycle(state: String) {
        runOnUiThread {
            if (!::webView.isInitialized) return@runOnUiThread
            val safe = JSONObject.quote(state)
            webView.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('morefun:native-lifecycle',{detail:{state:$safe}}));",
                null
            )
        }
    }

    @Suppress("DEPRECATION")
    private fun enterImmersiveMode() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.hide(
                android.view.WindowInsets.Type.statusBars() or android.view.WindowInsets.Type.navigationBars()
            )
        } else {
            window.decorView.systemUiVisibility =
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        }
    }

    companion object {
        private const val REQUEST_EXPORT = 5101
        private const val REQUEST_IMPORT = 5102
    }
}
