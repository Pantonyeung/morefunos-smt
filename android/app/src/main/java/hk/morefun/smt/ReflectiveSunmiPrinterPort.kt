package hk.morefun.smt

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import java.lang.reflect.Method
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

/**
 * Runtime-only SUNMI binding without a compile-time vendor SDK dependency.
 * Supports devices exposing woyou.aidlservice.jiuiv5.IWoyouService.
 */
class ReflectiveSunmiPrinterPort(context: Context) : SunmiPrinterPort {
    private val appContext = context.applicationContext
    @Volatile private var service: Any? = null
    @Volatile private var bindAttempted = false
    private val connected = CountDownLatch(1)

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, binder: IBinder?) {
            service = runCatching {
                val stub = Class.forName("woyou.aidlservice.jiuiv5.IWoyouService\$Stub")
                val asInterface = stub.getMethod("asInterface", IBinder::class.java)
                asInterface.invoke(null, binder)
            }.getOrNull()
            connected.countDown()
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            service = null
        }
    }

    init { bind() }

    override fun isAvailable(): Boolean {
        if (service == null) bind()
        if (service == null) runCatching { connected.await(1200, TimeUnit.MILLISECONDS) }
        return service != null
    }

    override fun printRaw(bytes: ByteArray) {
        require(bytes.isNotEmpty()) { "SUNMI 打印內容為空" }
        val target = service ?: run {
            bind()
            connected.await(1500, TimeUnit.MILLISECONDS)
            service
        } ?: throw IllegalStateException("SUNMI 內置打印服務未連接")

        val method: Method = target.javaClass.methods.firstOrNull {
            it.name == "sendRAWData" && it.parameterTypes.isNotEmpty() && it.parameterTypes[0] == ByteArray::class.java
        } ?: target.javaClass.methods.firstOrNull {
            it.name == "printRawData" && it.parameterTypes.isNotEmpty() && it.parameterTypes[0] == ByteArray::class.java
        } ?: throw IllegalStateException("SUNMI 打印服務不支援 RAW bytes")

        val args = Array(method.parameterTypes.size) { index -> if (index == 0) bytes else null }
        method.invoke(target, *args)
    }

    private fun bind() {
        if (bindAttempted && service != null) return
        bindAttempted = true
        val intents = listOf(
            Intent("woyou.aidlservice.jiuiv5.IWoyouService").setPackage("woyou.aidlservice.jiuiv5"),
            Intent().setClassName("woyou.aidlservice.jiuiv5", "woyou.aidlservice.jiuiv5.WoyouService")
        )
        for (intent in intents) {
            val bound = runCatching { appContext.bindService(intent, connection, Context.BIND_AUTO_CREATE) }.getOrDefault(false)
            if (bound) return
        }
    }
}
