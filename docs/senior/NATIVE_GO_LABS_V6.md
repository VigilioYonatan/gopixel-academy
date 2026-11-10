# 18 laboratorios Go nativos — Senior Mode v6

A diferencia de los cuestionarios web, estos laboratorios contienen código Go oficial ejecutable **en el equipo local**. Cada uno tiene `solution.go`, `solution_test.go` y un README, más un `go.mod` único. No se ejecutan en el navegador ni ofrecen métricas de producción.

## Catálogo completo

| Módulo | Laboratorio | Riesgo o competencia técnica |
|---|---|---|
| S01 | `s01-idiomatic-errors` | Errores propagados, conversiones y contratos |
| S02 | `s02-injection` | Interfaces pequeñas e inversión de dependencias |
| S03 | `s03-idempotency` | Idempotencia y respuestas reproducibles |
| S04 | `s04-domain-state` | Máquinas de estados e invariantes |
| S05 | `s05-worker-pool` | Cancelación de goroutines y concurrencia acotada |
| S06 | `s06-atomic` | Operaciones atómicas y data races |
| S07 | `s07-slice-retention` | Retención del backing array y copias |
| S08 | `s08-performance` | Asignaciones, Builder y benchmark |
| S09 | `s09-dedup-events` | Entregas duplicadas y deduplicación segura |
| S10 | `s10-inventory` | Reservas concurrentes e inventario |
| S11 | `s11-backoff` | Reintentos con cancelación y backoff |
| S12 | `s12-traversal` | Path traversal: comprobación *léxica* únicamente |
| S13 | `s13-clock-testing` | Reloj inyectable y pruebas deterministas |
| S14 | `s14-percentiles` | Percentiles p95 y análisis de latencia |
| S15 | `s15-shutdown` | Apagado idempotente con contexto |
| S16 | `s16-compatibility` | Migración compatible de JSON |
| S17 | `s17-review-priority` | Priorización de hallazgos y revisión técnica |
| S18 | `s18-capacity` | Dimensionamiento, tasa y utilización |

## Ejecución

```bash
cd labs-native
go test ./...
go test -race ./...
go vet ./...
go test -run '^$' -bench . ./s08-performance
```

## Ruta web
- `/#/senior/native`: catálogo descargable.
- `/#/senior/S05/native`: acceso al laboratorio nativo de un módulo.
- `/#/senior/readiness`: agregación de cinco actividades educativas realizadas dentro de la web.

## Límites de seguridad y validez
- **S12** valida segmentos léxicos de rutas, pero NO protege contra symlinks ni TOCTOU; no utilizar tal cual como sandbox de archivos.
- **S03** demuestra idempotencia en memoria en un solo proceso; para producción hace falta almacenamiento transaccional y persistencia entre reinicios.
- **S09** mantiene deduplicación en memoria; en sistemas distribuidos usar base transaccional y políticas de retención.
- El motor S05 respeta un máximo de workers y cancelación; no demuestra por sí solo ausencia de fugas ante todas las implementaciones de `fn`.
- Los tests no equivalen a validación de carga, autorización o seguridad de un sistema desplegado.
- No hay sincronización de aprobaciones locales con el navegador (por el diseño frontend sin backend).

## Extensión v8

`labs-native/capstone/orders`, `capstone/httpapi` y `capstone/demo` añaden un sistema local integrador. Consultar `docs/senior/CODE_REVIEW_CAPSTONE_V8.md`. El bundle `public/downloads/go-native-senior-labs.zip` incluye estas carpetas.
