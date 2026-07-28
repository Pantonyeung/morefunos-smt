package hk.morefun.smt

import org.json.JSONObject

interface PrintDriver {
    val transport: String
    fun print(job: JSONObject, target: JSONObject): JSONObject
}
