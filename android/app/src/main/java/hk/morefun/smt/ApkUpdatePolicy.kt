package hk.morefun.smt

import android.content.Context
import org.json.JSONObject

/** E-line anti-downgrade and anti-replay policy for Native APK OTA. */
class ApkUpdatePolicy(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun evaluate(manifest: ApkUpdateManifest, installedVersionCode: Long): JSONObject {
        val lastIssuedAt = prefs.getLong(KEY_LAST_ACCEPTED_ISSUED_AT, 0L)
        val lastVersionCode = prefs.getLong(KEY_LAST_ACCEPTED_VERSION_CODE, 0L)

        require(manifest.versionCode > installedVersionCode) { "APK 版本不是升級" }
        require(manifest.versionCode >= lastVersionCode) { "APK 版本低於已接受版本" }
        require(manifest.issuedAt >= lastIssuedAt) { "APK manifest 比已接受版本舊" }
        if (manifest.issuedAt == lastIssuedAt && lastVersionCode > 0L) {
            require(manifest.versionCode == lastVersionCode) { "issuedAt 重複但 versionCode 不一致" }
        }

        return JSONObject()
            .put("status", "eligible")
            .put("installedVersionCode", installedVersionCode)
            .put("targetVersionCode", manifest.versionCode)
            .put("mandatory", manifest.mandatory)
    }

    fun rememberAccepted(manifest: ApkUpdateManifest) {
        check(prefs.edit()
            .putLong(KEY_LAST_ACCEPTED_ISSUED_AT, manifest.issuedAt)
            .putLong(KEY_LAST_ACCEPTED_VERSION_CODE, manifest.versionCode)
            .putString(KEY_LAST_ACCEPTED_VERSION_NAME, manifest.versionName)
            .commit()) { "APK OTA 接受狀態儲存失敗" }
    }

    fun status(): JSONObject = JSONObject()
        .put("lastAcceptedIssuedAt", prefs.getLong(KEY_LAST_ACCEPTED_ISSUED_AT, 0L))
        .put("lastAcceptedVersionCode", prefs.getLong(KEY_LAST_ACCEPTED_VERSION_CODE, 0L))
        .put("lastAcceptedVersionName", prefs.getString(KEY_LAST_ACCEPTED_VERSION_NAME, null) ?: JSONObject.NULL)

    companion object {
        private const val PREFS_NAME = "morefun_smt_apk_ota"
        private const val KEY_LAST_ACCEPTED_ISSUED_AT = "last_accepted_issued_at"
        private const val KEY_LAST_ACCEPTED_VERSION_CODE = "last_accepted_version_code"
        private const val KEY_LAST_ACCEPTED_VERSION_NAME = "last_accepted_version_name"
    }
}
