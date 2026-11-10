# API local de órdenes (ejemplo Go senior)

Implementa `net/http` estándar, límite de payload, decodificación JSON estricta, errores HTTP definidos, token de desarrollo inyectado, context, idempotencia e inventario dentro de un proceso. Se ejecuta **solo de forma local**, no es un backend de GoPixel ni un sistema autorizado para pagos reales.

```sh
cd labs-native
go test ./capstone/... -count=1
go test -race ./capstone/... -count=1
GOPIXEL_DEMO_TOKEN='una-clave-de-desarrollo-larga' go run ./capstone/demo
curl -i http://127.0.0.1:8080/health
curl -i -H 'Authorization: Bearer una-clave-de-desarrollo-larga' -H 'Content-Type: application/json' -d '{"Key":"ejemplo-1","Product":"book","Quantity":1}' http://127.0.0.1:8080/orders
```

**No usar en producción:** auth es una clave compartida de ejemplo, no existe multi-tenant ni persistencia durable, la tasa de solicitudes no está limitada, no hay TLS y la respuesta de retries no preserva un status 201 original porque siempre usa 200. Para producción integrar identidad, scopes, rate limits, métricas, outbox SQL transaccional y pruebas de amenazas.
