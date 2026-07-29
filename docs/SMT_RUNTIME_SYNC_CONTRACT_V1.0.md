# More Fun SMT Runtime Sync Contract V1.0

## 1. Purpose

This contract defines the minimum backend interface required by the SMT Staff Sync runtime. It prevents the frontend and Worker from drifting into incompatible payload shapes.

## 2. Configuration

Runtime settings are read from `localStorage['morefun:smt:v16c:settings']`.

```json
{
  "sync": {
    "enabled": true,
    "baseUrl": "https://worker.example.com",
    "healthPath": "/health",
    "pullPath": "/smt/sync/pull",
    "pushPath": "/smt/sync/push",
    "token": "TOKEN",
    "deviceId": "smt-primary",
    "timeoutMs": 8000
  }
}
```

## 3. Common request headers

```text
Authorization: Bearer <token>                 optional when backend allows device auth
X-MoreFun-Device-Id: <deviceId>
X-MoreFun-Staff: <staff username>
Content-Type: application/json                push only
```

The backend must never trust staff or device headers as the sole authorization mechanism.

## 4. Health endpoint

### Request

```http
GET /health
```

### Success

Any HTTP 2xx response is considered healthy. A compact JSON response is recommended:

```json
{
  "ok": true,
  "service": "morefun-runtime",
  "time": "2026-07-29T04:00:00.000Z"
}
```

### Failure

- HTTP 4xx or 5xx: heartbeat failure
- request timeout: heartbeat failure
- three consecutive failures: runtime offline

## 5. Pull endpoint

### Request

```http
GET /smt/sync/pull?revision=<last-known-revision>
```

`revision` may be omitted on first pull.

### Required success payload

```json
{
  "revision": "2026-07-29T04:00:00.000Z",
  "snapshot": {
    "menu": {},
    "settings": {},
    "soldOut": {},
    "staff": {},
    "runtime": {}
  }
}
```

Rules:

1. `revision` must change only when the effective snapshot changes.
2. `snapshot` must be complete enough to replace the previous cached snapshot atomically.
3. Do not return partially updated sections as a complete snapshot.
4. The same revision must always represent the same effective data.
5. HTTP 304 may be added later, but V1 frontend currently expects JSON on HTTP 2xx.

## 6. Push endpoint

### Request

```http
POST /smt/sync/push
Idempotency-Key: <stable key>
```

Body:

```json
{
  "id": "local queue item id",
  "type": "order.created",
  "payload": {},
  "idempotencyKey": "stable idempotency key",
  "attempts": 0,
  "createdAt": "2026-07-29T04:00:00.000Z"
}
```

### Required success payload

```json
{
  "ok": true,
  "accepted": true,
  "idempotencyKey": "stable idempotency key"
}
```

Rules:

1. Backend must enforce idempotency by `Idempotency-Key`.
2. Repeating an accepted request must return success without creating a duplicate order/action.
3. HTTP 2xx means the queue item may be deleted locally.
4. Any non-2xx response keeps the queue item for retry.
5. Backend validation must recalculate prices and reject invalid order payloads.

## 7. Recommended push event types

```text
order.created
order.updated
order.completed
order.cancelled
soldout.updated
runtime.setting.updated
print.retry.requested
```

These names are recommendations until the final Worker contract is locked.

## 8. Recovery guarantees

- Last valid runtime snapshot remains usable during outage.
- New push events remain in persistent local queue during outage.
- Network recovery triggers pull then queue flush.
- Failed queue items remain stored with incremented attempt count and last error.
- No APK, native bridge, printer driver or Android lifecycle dependency is required.

## 9. Backend acceptance checklist

- [ ] Health endpoint returns HTTP 2xx
- [ ] Pull returns complete `revision + snapshot`
- [ ] Push enforces idempotency
- [ ] Invalid token returns 401/403
- [ ] Invalid payload returns 400/422
- [ ] Duplicate push does not duplicate the action
- [ ] Timeout and 5xx can be retried safely
- [ ] Price and business-rule validation occurs server-side
