package hk.morefun.smt

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller

/** Receives Package Installer progress and opens Android's confirmation UI when required. */
class ApkInstallResultReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != ApkInstallCoordinator.ACTION_INSTALL_RESULT) return
        val coordinator = ApkInstallCoordinator(context)
        val status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE)
        val message = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE).orEmpty()

        when (status) {
            PackageInstaller.STATUS_PENDING_USER_ACTION -> {
                coordinator.record("awaiting_user_confirmation", message)
                val confirmation = intent.getParcelableExtra<Intent>(Intent.EXTRA_INTENT)
                confirmation?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                if (confirmation != null) context.startActivity(confirmation)
                else coordinator.record("failed", "缺少 Android 安裝確認 Intent")
            }
            PackageInstaller.STATUS_SUCCESS -> coordinator.record("installed", message)
            PackageInstaller.STATUS_FAILURE_ABORTED -> coordinator.record("cancelled", message)
            PackageInstaller.STATUS_FAILURE_BLOCKED -> coordinator.record("blocked", message)
            PackageInstaller.STATUS_FAILURE_CONFLICT -> coordinator.record("conflict", message)
            PackageInstaller.STATUS_FAILURE_INCOMPATIBLE -> coordinator.record("incompatible", message)
            PackageInstaller.STATUS_FAILURE_INVALID -> coordinator.record("invalid", message)
            PackageInstaller.STATUS_FAILURE_STORAGE -> coordinator.record("storage_error", message)
            else -> coordinator.record("failed", "status=$status $message")
        }
    }
}
