package hk.morefun.smt

import android.app.Activity
import android.webkit.JavascriptInterface
import android.webkit.WebView
import org.json.JSONObject

/**
 * Android 6 / old System WebView fallback only.
 * MainActivity keeps navigation restricted to the packaged appassets origin.
 * Business logic stays in BridgeProtocol / Web Domain.
 */
class LegacyBridgeAdapter(
    private val activity: Activity,
    private val webView: WebView,
    private val bridge: BridgeProtocol
) {
    @JavascriptInterface
    fun postMessage(rawMessage: String) {
        bridge.handle(rawMessage) { response ->
            activity.runOnUiThread {
                val quoted = JSONObject.quote(response)
                webView.evaluateJavascript("window.__moreFunLegacyBridgeReceive && window.__moreFunLegacyBridgeReceive($quoted);", null)
            }
        }
    }
}
