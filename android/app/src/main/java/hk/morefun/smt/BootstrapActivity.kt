package hk.morefun.smt

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.Gravity
import android.widget.TextView
import java.util.concurrent.Executors

class BootstrapActivity : Activity() {
    private val executor = Executors.newSingleThreadExecutor()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(TextView(this).apply {
            text = "磨飯 SMT\n正在檢查安全更新…"
            gravity = Gravity.CENTER
            textSize = 22f
        })

        executor.execute {
            runCatching { ReleaseUpdateManager(this).checkAndInstall() }
            runOnUiThread {
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            }
        }
    }

    override fun onDestroy() {
        executor.shutdownNow()
        super.onDestroy()
    }
}
