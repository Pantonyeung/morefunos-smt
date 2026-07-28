package hk.morefun.smt

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.Gravity
import android.widget.TextView
import org.json.JSONObject
import java.util.concurrent.Executors

class BootstrapActivity : Activity() {
    private val executor = Executors.newSingleThreadExecutor()
    private lateinit var statusView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        statusView = TextView(this).apply {
            text = "磨飯 SMT\n正在檢查安全更新…"
            gravity = Gravity.CENTER
            textSize = 22f
        }
        setContentView(statusView)

        executor.execute {
            val updateResult = runCatching {
                ReleaseUpdateManager(this).checkAndInstall()
            }.fold(
                onSuccess = { it },
                onFailure = { error ->
                    JSONObject()
                        .put("status", "update_failed_using_local_runtime")
                        .put("error", (error.message ?: error.javaClass.simpleName).take(500))
                }
            )

            val updateStatus = updateResult.optString("status")
            if (updateStatus == "installed_pending_health") {
                RuntimeHealthReceiver.arm(this)
            } else {
                val pending = WebBundleStore(this).status()
                    .optString("pendingHealthVersion")
                    .trim()
                if (pending.isBlank() || pending == "null") {
                    RuntimeHealthReceiver.cancel(this)
                }
            }

            getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
                .edit()
                .putString(KEY_LAST_BOOT_UPDATE_RESULT, updateResult.toString())
                .putLong(KEY_LAST_BOOT_AT, System.currentTimeMillis())
                .apply()

            runOnUiThread {
                if (isFinishing || isDestroyed) return@runOnUiThread
                val intent = Intent(this, MainActivity::class.java)
                    .putExtra(EXTRA_BOOT_UPDATE_RESULT, updateResult.toString())
                startActivity(intent)
                finish()
            }
        }
    }

    override fun onDestroy() {
        executor.shutdownNow()
        super.onDestroy()
    }

    companion object {
        const val EXTRA_BOOT_UPDATE_RESULT = "morefun.boot.update_result"
        private const val PREFS_NAME = "morefun_smt_bootstrap"
        private const val KEY_LAST_BOOT_UPDATE_RESULT = "last_boot_update_result"
        private const val KEY_LAST_BOOT_AT = "last_boot_at"
    }
}
