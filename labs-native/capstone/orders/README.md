# Capstone Senior: pedidos, consistencia e idempotencia

Laboratorio de integración Go que une S03 (idempotencia), S04 (invariantes), S05 (sincronización), S09 (outbox), S10 (inventario), S12 (validación), S13 (fuzz) y S14 (benchmark).

## API y garantías del ejemplo

- `Submit(ctx, Request)`: operación in-process atómica sobre stock y outbox, con mutex.
- Clave repetida + mismos parámetros => misma respuesta original; distintos parámetros => `ErrConflict`.
- Sin sobreventa bajo goroutines concurrentes dentro del proceso.
- Cálculo de importes en centavos y comprobación de overflow.
- `PendingEvents()` entrega una copia ordenada y `AckEvent` es idempotente.
- Error wrapping compatible con `errors.Is` y validación previa a modificar estado.
- Inyección de reloj para reproducibilidad, fuzzing y benchmarks.

## Pruebas

```sh
cd labs-native
go test ./capstone/orders -count=1
go test -race ./capstone/orders -count=1
go vet ./capstone/orders
go test -run '^$' -bench BenchmarkSubmit ./capstone/orders
```

## Limitaciones de producción (lectura obligatoria)

1. Todo el estado vive en la memoria de **un solo proceso**: al reiniciar se pierde. Reemplazar con transacción SQL/almacenamiento durable y outbox transaccional para producción.
2. `AckEvent` no demuestra entrega exactly-once. Un consumidor debe ser idempotente y la entrega puede ser al menos una vez.
3. No es un servicio HTTP ni implementa autenticación, autorización, multi-tenancy, logs o TLS.
4. No es una solución de pagos real; `priceCents` es un ejemplo, no tratamiento de impuestos, moneda o conciliación.
5. En un sistema distribuido, las claves de idempotencia deben delimitarse por actor/tenant y tener retención definida.

## Retos del estudiante

- Añadir `Cancel(orderID)` con una máquina de estados explícita, pruebas de concurrencia y compensación de inventario.
- Implementar `Dispatch(ctx,Publisher)` con retries acotados, backoff con jitter, métricas y control de cancelación.
- Diseñar una persistencia SQL que preserve invariantes entre procesos y documentar el isolation level elegido.
- Añadir límites por tenant y observabilidad de fallos sin exponer información privada.
