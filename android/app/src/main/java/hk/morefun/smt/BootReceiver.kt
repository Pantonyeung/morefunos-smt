package hk.morefun.smt

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * POS terminal recovery entrypoint.
 * Business/runtime updates never replace this receiver; it only restores the stable Android host.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        val action = intent?.action ?: return
        if (action !in SUPPORTED_ACTIONS) return

        if (action == Intent.ACTION_MY_PACKAGE_REPLACED) {
            ApkInstallCoordinator(context).record("package_replaced", "Android 已完成 APK 更新")
        }

        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_AUTO_START, true)) return

        val launch = Intent(context, BootstrapActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra(EXTRA_RECOVERY_ACTION, action)
        }
        runCatching { context.startActivity(launch) }
            .onFailure {
                prefs.edit()
                    .putString(KEY_LAST_START_ERROR, it.message ?: it.javaClass.simpleName)
                    .putLong(KEY_LAST_START_ERROR_AT, System.currentTimeMillis())
                    .apply()
            }
    }

    companion object {
        const val PREFS_NAME = "morefun_smt_host_settings"
        const val KEY_AUTO_START = "auto_start_enabled"
        const val KEY_LAST_START_ERROR = "last_auto_start_error"
        const val KEY_LAST_START_ERROR_AT = "last_auto_start_error_at"
        const val EXTRA_RECOVERY_ACTION = "morefun_recovery_action"

        private val SUPPORTED_ACTIONS = setOf(
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_LOCKED_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED
        )
    }
}
