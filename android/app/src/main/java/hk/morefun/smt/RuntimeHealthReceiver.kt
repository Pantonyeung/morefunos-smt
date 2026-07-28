package hk.morefun.smt

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.SystemClock

/**
 * Production safety net for a newly installed Web Runtime candidate.
 *
 * BootstrapActivity arms this timeout only when OTA installation returns
 * installed_pending_health. The Web Runtime must call bundle.markHealthy before
 * the deadline. If it does not, the receiver rolls back to the last healthy
 * runtime (or factory fallback) and relaunches the host.
 */
class RuntimeHealthReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action != ACTION_HEALTH_TIMEOUT) return

        val store = WebBundleStore(context)
        val status = store.status()
        val pending = status.optString("pendingHealthVersion").trim()
        if (pending.isBlank() || pending == "null") return

        runCatching { store.rollback() }
            .onSuccess {
                context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                    .edit()
                    .putString(KEY_LAST_RESULT, "rolled_back_health_timeout")
                    .putString(KEY_FAILED_VERSION, pending)
                    .putLong(KEY_LAST_TIMEOUT_AT, System.currentTimeMillis())
                    .apply()
                relaunch(context)
            }
            .onFailure { error ->
                context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                    .edit()
                    .putString(KEY_LAST_RESULT, "health_timeout_rollback_failed")
                    .putString(KEY_FAILED_VERSION, pending)
                    .putString(KEY_LAST_ERROR, (error.message ?: error.javaClass.simpleName).take(500))
                    .putLong(KEY_LAST_TIMEOUT_AT, System.currentTimeMillis())
                    .apply()
            }
    }

    companion object {
        const val ACTION_HEALTH_TIMEOUT = "hk.morefun.smt.action.RUNTIME_HEALTH_TIMEOUT"
        private const val REQUEST_CODE = 6102
        private const val PREFS_NAME = "morefun_smt_runtime_health"
        private const val KEY_LAST_RESULT = "last_result"
        private const val KEY_FAILED_VERSION = "failed_version"
        private const val KEY_LAST_TIMEOUT_AT = "last_timeout_at"
        private const val KEY_LAST_ERROR = "last_error"
        private const val DEFAULT_TIMEOUT_MS = 45_000L

        fun arm(context: Context, timeoutMs: Long = DEFAULT_TIMEOUT_MS) {
            val alarm = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val pending = pendingIntent(context)
            val triggerAt = SystemClock.elapsedRealtime() + timeoutMs.coerceIn(15_000L, 180_000L)
            alarm.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAt, pending)
            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putString(KEY_LAST_RESULT, "armed")
                .putLong("armed_at", System.currentTimeMillis())
                .putLong("deadline_at", System.currentTimeMillis() + timeoutMs)
                .remove(KEY_LAST_ERROR)
                .apply()
        }

        fun cancel(context: Context) {
            val alarm = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            alarm.cancel(pendingIntent(context))
            context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putString(KEY_LAST_RESULT, "cancelled")
                .putLong("cancelled_at", System.currentTimeMillis())
                .apply()
        }

        fun status(context: Context): org.json.JSONObject {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            return org.json.JSONObject()
                .put("lastResult", prefs.getString(KEY_LAST_RESULT, "never_armed"))
                .put("failedVersion", prefs.getString(KEY_FAILED_VERSION, null) ?: org.json.JSONObject.NULL)
                .put("lastTimeoutAt", prefs.getLong(KEY_LAST_TIMEOUT_AT, 0L))
                .put("lastError", prefs.getString(KEY_LAST_ERROR, null) ?: org.json.JSONObject.NULL)
                .put("armedAt", prefs.getLong("armed_at", 0L))
                .put("deadlineAt", prefs.getLong("deadline_at", 0L))
                .put("cancelledAt", prefs.getLong("cancelled_at", 0L))
        }

        private fun pendingIntent(context: Context): PendingIntent = PendingIntent.getBroadcast(
            context,
            REQUEST_CODE,
            Intent(context, RuntimeHealthReceiver::class.java).setAction(ACTION_HEALTH_TIMEOUT),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        private fun relaunch(context: Context) {
            val launch = Intent(context, BootstrapActivity::class.java)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
            context.startActivity(launch)
        }
    }
}
