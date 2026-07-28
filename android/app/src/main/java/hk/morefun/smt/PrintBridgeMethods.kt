package hk.morefun.smt

/** Stable method names exposed by BridgeProtocol to the Web Runtime. */
object PrintBridgeMethods {
    const val REGISTRY_LIST = "print.registry.list"
    const val REGISTRY_UPSERT = "print.registry.upsert"
    const val REGISTRY_REMOVE = "print.registry.remove"
    const val ROUTE = "print.route"
    const val ROUTE_BATCH = "print.routeBatch"
    const val EXECUTE = "print.execute"
    const val STATUS = "print.status"

    val all: Set<String> = setOf(
        REGISTRY_LIST,
        REGISTRY_UPSERT,
        REGISTRY_REMOVE,
        ROUTE,
        ROUTE_BATCH,
        EXECUTE,
        STATUS
    )
}
