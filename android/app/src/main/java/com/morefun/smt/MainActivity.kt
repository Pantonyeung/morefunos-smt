package com.morefun.smt

import android.annotation.SuppressLint
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.webkit.WebViewAssetLoader
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enterKioskUi()

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this)
        setContentView(webView)

        @SuppressLint("SetJavaScriptEnabled")
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = false
        webView.settings.allowContentAccess = false
        webView.settings.setSupportMultipleWindows(false)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView?, request: android.webkit.WebResourceRequest?) =
                request?.url?.let(assetLoader::shouldInterceptRequest)
        }

        webView.addJavascriptInterface(MoreFunBridge(), "MoreFunNative")
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }

    override fun onResume() {
        super.onResume()
        enterKioskUi()
    }

    private fun enterKioskUi() {
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
            View.SYSTEM_UI_FLAG_FULLSCREEN or
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        )
    }

    inner class MoreFunBridge {
        private val bridgeVersion = "1.0"
        private val capabilities = listOf(
            "device.info",
            "network.status",
            "print.lan.tcp",
            "print.sunmi.native",
            "print.result.callback",
            "print.idempotency",
            "print.failover",
            "offline.queue",
            "file.export",
            "file.import",
            "diagnostics",
            "update.channel"
        )

        @JavascriptInterface
        fun getBridgeInfo(): String = JSONObject().apply {
            put("bridgeVersion", bridgeVersion)
            put("appVersion", BuildConfig.VERSION_NAME)
            put("capabilities", JSONArray(capabilities))
        }.toString()

        @JavascriptInterface
        fun getDeviceInfo(): String = JSONObject().apply {
            put("deviceId", Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID) ?: "unknown")
            put("manufacturer", android.os.Build.MANUFACTURER ?: "")
            put("model", android.os.Build.MODEL ?: "")
            put("sdkInt", android.os.Build.VERSION.SDK_INT)
        }.toString()

        @JavascriptInterface
        fun getNetworkStatus(): String {
            val manager = getSystemService(ConnectivityManager::class.java)
            val network = manager.activeNetwork
            val caps = network?.let(manager::getNetworkCapabilities)
            val online = caps?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true &&
                caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
            return JSONObject().apply {
                put("online", online)
                put("transportWifi", caps?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true)
                put("transportEthernet", caps?.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) == true)
            }.toString()
        }
    }
}
