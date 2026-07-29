package hk.morefun.smt

import android.app.PendingIntent
import android.app.admin.DevicePolicyManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.os.Build
import org.json.JSONObject
import java.io.File

/** E-line only: stages a verified APK into Android Package Installer. */
class ApkInstallCoordinator(private val context: Context) {
    private val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun requestInstall(apk: File, release: ApkUpdateManifestVerifier.VerifiedApkRelease): JSONObject {
        require(apk.isFile && apk.length() > 0L) { "APK 安裝檔不存在" }

        val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val deviceOwner = runCatching { dpm.isDeviceOwnerApp(context.packageName) }.getOrDefault(false)
        val requestedMode = if (deviceOwner) "device_owner_managed" else "user_confirmation"

        val installer = context.packageManager.packageInstaller
        val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL).apply {
            setAppPackageName(BuildConfig.APPLICATION_ID)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                setInstallReason(android.content.pm.PackageManager.INSTALL_REASON_USER)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && deviceOwner) {
                setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED)
            }
        }
        val sessionId = installer.createSession(params)
        prefs.edit()
            .putInt(KEY_SESSION_ID, sessionId)
            .putLong(KEY_TARGET_VERSION, release.versionCode)
            .putString(KEY_TARGET_NAME, release.versionName)
            .putString(KEY_REQUESTED_MODE, requestedMode)
            .putString(KEY_STATUS, "writing")
            .putString(KEY_MESSAGE, "")
            .putLong(KEY_UPDATED_AT, System.currentTimeMillis())
            .apply()

        try {
            installer.openSession(sessionId).use { session ->
                apk.inputStream().use { input ->
                    session.openWrite("morefun-smt-update.apk", 0L, apk.length()).use { output ->
                        input.copyTo(output)
                        session.fsync(output)
                    }
                }
                record("committing")
                val resultIntent = Intent(context, ApkInstallResultReceiver::class.java)
                    .setAction(ACTION_INSTALL_RESULT)
                    .putExtra(PackageInstaller.EXTRA_SESSION_ID, sessionId)
                val flags = PendingIntent.FLAG_UPDATE_CURRENT or
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_MUTABLE else 0
                val pending = PendingIntent.getBroadcast(context, sessionId, resultIntent, flags)
                session.commit(pending.intentSender)
            }
        } catch (error: Throwable) {
            runCatching { installer.abandonSession(sessionId) }
            record("failed", error.message ?: error.javaClass.simpleName)
            throw error
        }

        return status().put("requested", true)
    }

    fun status(): JSONObject = JSONObject()
        .put("sessionId", prefs.getInt(KEY_SESSION_ID, -1))
        .put("targetVersionCode", prefs.getLong(KEY_TARGET_VERSION, 0L))
        .put("targetVersionName", prefs.getString(KEY_TARGET_NAME, ""))
        .put("requestedMode", prefs.getString(KEY_REQUESTED_MODE, "unknown"))
        .put("status", prefs.getString(KEY_STATUS, "idle"))
        .put("message", prefs.getString(KEY_MESSAGE, ""))
        .put("updatedAt", prefs.getLong(KEY_UPDATED_AT, 0L))

    fun record(status: String, message: String = "") {
        prefs.edit()
            .putString(KEY_STATUS, status)
            .putString(KEY_MESSAGE, message.take(500))
            .putLong(KEY_UPDATED_AT, System.currentTimeMillis())
            .apply()
    }

    companion object {
        const val ACTION_INSTALL_RESULT = "hk.morefun.smt.action.APK_INSTALL_RESULT"
        private const val PREFS = "morefun_apk_install"
        private const val KEY_SESSION_ID = "session_id"
        private const val KEY_TARGET_VERSION = "target_version"
        private const val KEY_TARGET_NAME = "target_name"
        private const val KEY_REQUESTED_MODE = "requested_mode"
        private const val KEY_STATUS = "status"
        private const val KEY_MESSAGE = "message"
        private const val KEY_UPDATED_AT = "updated_at"
    }
}
