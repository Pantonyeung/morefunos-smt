package hk.morefun.smt

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import java.lang.reflect.InvocationTargetException
import java.lang.reflect.Method
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

/**
 * Runtime-only SUNMI binding without a compile-time vendor SDK dependency.
 * Supports devices exposing woyou.aidlservice.jiuiv5.IWoyouService.
 */
class ReflectiveSunmiPrinterPort(context: Context) : SunmiPrinterPort {
    private val appContext = context.applicationContext
    private val bindLock = Any()

    @Volatile private var service: Any? = null
    @Volatile private var binding = false
    @Volatile private var bound = false
    @Volatile private var connected = CountDownLatch(1)

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, binder: IBinder?) {
            service = binder?.let(::resolveService)
            binding = false
            bound = service != null
            connected.countDown()
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            service = null
            binding = false
            bound = false
            connected = CountDownLatch(1)
        }

        override fun onBindingDied(name: ComponentName?) {
            service = null
            binding = false
            bound = false
            connected = CountDownLatch(1)
            bind()
        }

        override fun onNullBinding(name: ComponentName?) {
            service = null
            binding = false
            bound = false
            connected.countDown()
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
        val target = awaitService(1500)
            ?: throw IllegalStateException("SUNMI 內置打印服務未連接")
        val method = findRawPrintMethod(target)
            ?: throw IllegalStateException("SUNMI 打印服務不支援 RAW bytes")
        val args = Array(method.parameterTypes.size) { index -> if (index == 0) bytes else null }

        try {
            method.invoke(target, *args)
        } catch (error: InvocationTargetException) {
            service = null
            binding = false
            bound = false
            connected = CountDownLatch(1)
            throw IllegalStateException(
                "SUNMI 打印服務執行失敗",
                error.targetException ?: error
            )
        }
    }

    private fun awaitService(timeoutMs: Long): Any? {
        service?.let { return it }
        bind()
        runCatching { connected.await(timeoutMs, TimeUnit.MILLISECONDS) }
        return service
    }

    private fun resolveService(binder: IBinder): Any? = runCatching {
        val stub = Class.forName("woyou.aidlservice.jiuiv5.IWoyouService\$Stub")
        val asInterface = stub.getMethod("asInterface", IBinder::class.java)
        asInterface.invoke(null, binder)
    }.getOrNull()

    private fun findRawPrintMethod(target: Any): Method? =
        target.javaClass.methods.firstOrNull {
            it.name == "sendRAWData" &&
                it.parameterTypes.isNotEmpty() &&
                it.parameterTypes[0] == ByteArray::class.java
        } ?: target.javaClass.methods.firstOrNull {
            it.name == "printRawData" &&
                it.parameterTypes.isNotEmpty() &&
                it.parameterTypes[0] == ByteArray::class.java
        }

    private fun bind() {
        if (service != null || binding) return
        synchronized(bindLock) {
            if (service != null || binding) return
            binding = true
            connected = CountDownLatch(1)

            val intents = listOf(
                Intent("woyou.aidlservice.jiuiv5.IWoyouService")
                    .setPackage("woyou.aidlservice.jiuiv5"),
                Intent().setClassName(
                    "woyou.aidlservice.jiuiv5",
                    "woyou.aidlservice.jiuiv5.WoyouService"
                )
            )

            for (intent in intents) {
                val started = runCatching {
                    appContext.bindService(intent, connection, Context.BIND_AUTO_CREATE)
                }.getOrDefault(false)
                if (started) {
                    bound = true
                    return
                }
            }

            binding = false
            bound = false
            connected.countDown()
        }
    }
}
