package hk.morefun.smt

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build
import java.io.File
import java.security.MessageDigest

/** E-line only: verifies staged APK identity before handing it to Package Installer. */
class ApkBinaryVerifier(private val context: Context) {
    data class VerifiedBinary(
        val packageName: String,
        val versionCode: Long,
        val certificateSha256: String,
        val file: File
    )

    fun verify(
        staged: ApkDownloadStager.StagedApk,
        release: ApkUpdateManifestVerifier.VerifiedApkRelease
    ): VerifiedBinary {
        require(staged.file.isFile && staged.file.length() > 0L) { "APK OTA staging 檔不存在" }
        require(staged.sha256.equals(release.sha256, ignoreCase = true)) { "APK OTA staging SHA-256 不一致" }

        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            PackageManager.GET_SIGNING_CERTIFICATES
        } else {
            @Suppress("DEPRECATION")
            PackageManager.GET_SIGNATURES
        }
        @Suppress("DEPRECATION")
        val info = context.packageManager.getPackageArchiveInfo(staged.file.absolutePath, flags)
            ?: throw IllegalArgumentException("APK OTA 無法解析套件")

        val packageName = info.packageName.orEmpty()
        val versionCode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) info.longVersionCode else {
            @Suppress("DEPRECATION")
            info.versionCode.toLong()
        }
        val cert = certificateSha256(info)

        require(packageName == BuildConfig.APPLICATION_ID) { "APK OTA packageName 不一致" }
        require(packageName == release.applicationId) { "APK OTA manifest packageName 不一致" }
        require(versionCode == release.versionCode) { "APK OTA versionCode 不一致" }
        require(cert.equals(release.certificateSha256, ignoreCase = true)) { "APK OTA signing certificate 不一致" }

        val installedCert = installedCertificateSha256()
        require(installedCert.equals(cert, ignoreCase = true)) { "APK OTA signing certificate continuity 失敗" }
        return VerifiedBinary(packageName, versionCode, cert, staged.file)
    }

    private fun certificateSha256(info: PackageInfo): String {
        val bytes = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            val signingInfo = info.signingInfo ?: throw IllegalArgumentException("APK OTA signingInfo 缺失")
            val signatures = if (signingInfo.hasMultipleSigners()) {
                signingInfo.apkContentsSigners
            } else {
                signingInfo.signingCertificateHistory
            }
            require(signatures.size == 1) { "APK OTA 暫不接受多簽章 APK" }
            signatures[0].toByteArray()
        } else {
            @Suppress("DEPRECATION")
            val signatures = info.signatures ?: emptyArray()
            require(signatures.size == 1) { "APK OTA 暫不接受多簽章 APK" }
            signatures[0].toByteArray()
        }
        return MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) }
    }

    private fun installedCertificateSha256(): String {
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            PackageManager.GET_SIGNING_CERTIFICATES
        } else {
            @Suppress("DEPRECATION")
            PackageManager.GET_SIGNATURES
        }
        val info = context.packageManager.getPackageInfo(BuildConfig.APPLICATION_ID, flags)
        return certificateSha256(info)
    }
}
