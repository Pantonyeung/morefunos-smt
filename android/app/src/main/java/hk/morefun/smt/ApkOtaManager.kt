package hk.morefun.smt

import android.content.Context
import android.os.Build
import org.json.JSONObject

/** E-line only: end-to-end native APK OTA orchestration. */
class ApkOtaManager(private val context: Context) {
    private val verifier = ApkUpdateManifestVerifier()
    private val policy = ApkUpdatePolicy(context)
    private val stager = ApkDownloadStager(context)
    private val binaryVerifier = ApkBinaryVerifier(context)
    private val installer = ApkInstallCoordinator(context)
    private val capability = ApkInstallCapability(context)

    fun install(envelopeText: String): JSONObject {
        val installedVersionCode = installedVersionCode()
        val release = verifier.verify(envelopeText, installedVersionCode)
        val manifest = release.toPolicyManifest()
        val eligibility = policy.evaluate(manifest, installedVersionCode)

        val staged = stager.stage(release)
        val binary = binaryVerifier.verify(staged, release)
        policy.rememberAccepted(manifest)
        val install = installer.requestInstall(binary.file, release)

        return JSONObject()
            .put("status", "install_requested")
            .put("eligibility", eligibility)
            .put("staged", JSONObject()
                .put("path", staged.file.absolutePath)
                .put("sha256", staged.sha256)
                .put("byteLength", staged.byteLength))
            .put("binary", JSONObject()
                .put("packageName", binary.packageName)
                .put("versionCode", binary.versionCode)
                .put("certificateSha256", binary.certificateSha256))
            .put("install", install)
            .put("capability", capability.status())
    }

    fun status(): JSONObject = JSONObject()
        .put("installedVersionCode", installedVersionCode())
        .put("installedVersionName", BuildConfig.VERSION_NAME)
        .put("policy", policy.status())
        .put("install", installer.status())
        .put("capability", capability.status())

    private fun installedVersionCode(): Long {
        val info = context.packageManager.getPackageInfo(context.packageName, 0)
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) info.longVersionCode else {
            @Suppress("DEPRECATION")
            info.versionCode.toLong()
        }
    }

    private fun ApkUpdateManifestVerifier.VerifiedApkRelease.toPolicyManifest(): ApkUpdateManifest =
        ApkUpdateManifest(
            versionCode = versionCode,
            versionName = versionName,
            packageName = applicationId,
            apkUrl = apkUrl,
            sha256 = sha256,
            bytes = 1L,
            issuedAt = issuedAt,
            minSdk = minSdk,
            mandatory = false
        )
}
