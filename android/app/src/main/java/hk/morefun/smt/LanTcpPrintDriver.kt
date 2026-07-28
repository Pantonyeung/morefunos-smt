package hk.morefun.smt

import android.util.Base64
import org.json.JSONObject
import java.net.InetSocketAddress
import java.net.Socket
import java.nio.charset.Charset

class LanTcpPrintDriver(
    private val printerSettings: PrinterDeviceSettings
) : PrintDriver {
    override val transport: String = "tcp"

    override fun print(job: JSONObject, target: JSONObject): JSONObject {
        require(target.optString("transport", "tcp") == transport) { "LAN Driver 只接受 tcp transport" }

        val host = target.optString("host").trim()
        val port = target.optInt("port", 0)
        val timeoutMs = target.optInt("timeoutMs", 5000).coerceIn(1000, 15000)
        val printerId = target.optString("printerId", "$host:$port")
        val copies = job.optInt("copies", 1).coerceIn(1, 9)
        val content = job.optJSONObject("content") ?: throw IllegalArgumentException("打印工作缺少 content")
        val direction = printerSettings.resolve(
            printerId,
            job.optString("paperDirection").takeIf { it.isNotBlank() }
        )

        require(host.isNotBlank()) { "打印機 IP／Host 不可為空" }
        require(port in 1..65535) { "打印機 Port 無效" }

        val rawDocument = decodeContent(content)
        require(rawDocument.isNotEmpty()) { "打印內容解碼後為空" }
        val documentBytes = printerSettings.wrapEscPos(rawDocument, direction)

        var totalBytes = 0
        Socket().use { socket ->
            socket.connect(InetSocketAddress(host, port), timeoutMs)
            socket.soTimeout = timeoutMs
            socket.getOutputStream().use { output ->
                repeat(copies) {
                    output.write(documentBytes)
                    totalBytes += documentBytes.size
                }
                output.flush()
            }
        }

        return JSONObject()
            .put("status", "printed")
            .put("transport", transport)
            .put("printerId", printerId)
            .put("paperDirection", direction.wireValue)
            .put("copies", copies)
            .put("bytesWritten", totalBytes)
            .put("completedAt", System.currentTimeMillis())
    }

    private fun decodeContent(content: JSONObject): ByteArray {
        val base64 = content.optString("base64").trim()
        if (base64.isNotBlank()) return Base64.decode(base64, Base64.DEFAULT)

        val text = content.optString("text")
        require(text.isNotBlank()) { "打印內容為空" }
        val charset = Charset.forName(content.optString("encoding", "utf-8"))
        return text.toByteArray(charset) + "\n\n\n".toByteArray(charset)
    }
}
