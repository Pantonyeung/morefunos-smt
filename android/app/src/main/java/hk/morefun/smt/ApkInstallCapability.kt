package hk.morefun.smt

import android.app.admin.DevicePolicyManager
import android.content.Context
import android.os.Build
import android.provider.Settings
import org.json.JSONObject

/** E-line only: reports whether APK installation can be automatic or needs Android confirmation. */
class ApkInstallCapability(private val context: Context) {
    fun status(): JSONObject {
        val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val deviceOwner = runCatching { dpm.isDeviceOwnerApp(context.packageName) }.getOrDefault(false)
        val profileOwner = runCatching { dpm.isProfileOwnerApp(context.packageName) }.getOrDefault(false)
        val canRequestInstalls = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.packageManager.canRequestPackageInstalls()
        } else {
            @Suppress("DEPRECATION")
            Settings.Secure.getInt(context.contentResolver, Settings.Secure.INSTALL_NON_MARKET_APPS, 0) == 1
        }

        val mode = when {
            deviceOwner -> "device_owner"
            profileOwner -> "profile_owner"
            canRequestInstalls -> "user_confirmation"
            else -> "permission_required"
        }
        return JSONObject()
            .put("mode", mode)
            .put("deviceOwner", deviceOwner)
            .put("profileOwner", profileOwner)
            .put("canRequestPackageInstalls", canRequestInstalls)
            .put("silentInstallEligible", deviceOwner)
            .put("requiresUserConfirmation", !deviceOwner)
            .put("sdkInt", Build.VERSION.SDK_INT)
    }
}
