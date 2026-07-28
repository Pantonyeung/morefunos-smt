package hk.morefun.smt

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import org.json.JSONArray
import org.json.JSONObject

class OfflineQueueStore(context: Context) : SQLiteOpenHelper(context, "morefun_smt_offline.db", null, 1) {
    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE offline_queue(
              id TEXT PRIMARY KEY,
              kind TEXT NOT NULL,
              idempotency_key TEXT NOT NULL,
              payload TEXT NOT NULL,
              state TEXT NOT NULL,
              attempts INTEGER NOT NULL DEFAULT 0,
              last_error TEXT,
              created_at INTEGER NOT NULL,
              updated_at INTEGER NOT NULL
            )
            """.trimIndent()
        )
        db.execSQL("CREATE UNIQUE INDEX offline_queue_idem ON offline_queue(kind,idempotency_key)")
        db.execSQL("CREATE INDEX offline_queue_state ON offline_queue(state,created_at)")
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) = Unit

    fun enqueue(id: String, kind: String, idempotencyKey: String, payload: JSONObject): JSONObject {
        require(id.isNotBlank() && kind.isNotBlank() && idempotencyKey.isNotBlank()) { "Offline queue 欄位不足" }
        val now = System.currentTimeMillis()
        val values = ContentValues().apply {
            put("id", id)
            put("kind", kind)
            put("idempotency_key", idempotencyKey)
            put("payload", payload.toString())
            put("state", "pending")
            put("attempts", 0)
            put("created_at", now)
            put("updated_at", now)
        }
        writableDatabase.insertWithOnConflict("offline_queue", null, values, SQLiteDatabase.CONFLICT_IGNORE)
        return get(id) ?: findByIdempotency(kind, idempotencyKey) ?: error("Offline queue 寫入失敗")
    }

    fun listPending(limit: Int = 100): JSONArray {
        val result = JSONArray()
        readableDatabase.query(
            "offline_queue",
            null,
            "state IN (?,?)",
            arrayOf("pending", "failed"),
            null,
            null,
            "created_at ASC",
            limit.coerceIn(1, 500).toString()
        ).use { cursor ->
            while (cursor.moveToNext()) result.put(row(cursor))
        }
        return result
    }

    fun markComplete(id: String): JSONObject? = updateState(id, "complete", null, false)
    fun markFailed(id: String, error: String): JSONObject? = updateState(id, "failed", error.take(500), true)
    fun retry(id: String): JSONObject? = updateState(id, "pending", null, false)

    fun status(): JSONObject {
        val counts = JSONObject().put("pending", 0).put("failed", 0).put("complete", 0)
        readableDatabase.rawQuery("SELECT state,COUNT(*) FROM offline_queue GROUP BY state", null).use { cursor ->
            while (cursor.moveToNext()) counts.put(cursor.getString(0), cursor.getInt(1))
        }
        return JSONObject().put("counts", counts).put("recoverable", true)
    }

    private fun updateState(id: String, state: String, lastError: String?, incrementAttempt: Boolean): JSONObject? {
        val current = get(id) ?: return null
        val values = ContentValues().apply {
            put("state", state)
            put("updated_at", System.currentTimeMillis())
            if (lastError == null) putNull("last_error") else put("last_error", lastError)
            if (incrementAttempt) put("attempts", current.optInt("attempts", 0) + 1)
        }
        writableDatabase.update("offline_queue", values, "id=?", arrayOf(id))
        return get(id)
    }

    private fun get(id: String): JSONObject? = queryOne("id=?", arrayOf(id))
    private fun findByIdempotency(kind: String, key: String): JSONObject? = queryOne(
        "kind=? AND idempotency_key=?",
        arrayOf(kind, key)
    )

    private fun queryOne(where: String, args: Array<String>): JSONObject? {
        readableDatabase.query("offline_queue", null, where, args, null, null, null, "1").use { cursor ->
            return if (cursor.moveToFirst()) row(cursor) else null
        }
    }

    private fun row(cursor: android.database.Cursor): JSONObject = JSONObject()
        .put("id", cursor.getString(cursor.getColumnIndexOrThrow("id")))
        .put("kind", cursor.getString(cursor.getColumnIndexOrThrow("kind")))
        .put("idempotencyKey", cursor.getString(cursor.getColumnIndexOrThrow("idempotency_key")))
        .put("payload", JSONObject(cursor.getString(cursor.getColumnIndexOrThrow("payload"))))
        .put("state", cursor.getString(cursor.getColumnIndexOrThrow("state")))
        .put("attempts", cursor.getInt(cursor.getColumnIndexOrThrow("attempts")))
        .put("lastError", cursor.getString(cursor.getColumnIndexOrThrow("last_error")) ?: JSONObject.NULL)
        .put("createdAt", cursor.getLong(cursor.getColumnIndexOrThrow("created_at")))
        .put("updatedAt", cursor.getLong(cursor.getColumnIndexOrThrow("updated_at")))
}
