# Senior Mode v8 — Code Review y capstone Go real

## Qué se implementa

- 18 revisiones técnicas S01–S18 con fragmento Go distinto, diagnóstico y corrección explicados.
- Dos elecciones por revisión (36 decisiones), validadas por `engine/code-review.mjs` sin depender del DOM.
- Rutas `/#/senior/S05/review-lab` y `/#/senior/S05/review-lab/result` para cada ID válido de S01 a S18.
- Persistencia silenciosa `reviewResults` dentro de `gopixel:v1`, validador `verifyReviewRecord` que recalcula los resultados recibidos de backups.
- Quinto criterio en el mapa de competencias locales, separado de las 18 pruebas nativas de Go (éstas NO se validan automáticamente en la web).
- Capstone real en `labs-native/capstone/` con API HTTP local, transacción en memoria, idempotencia, inventario, eventos outbox, validación, tests, test -race, fuzz y benchmark.
- `/#/senior/capstone` muestra competencias y comandos. `senior-v8-demo-offline.html` ofrece demo autónoma de 18 revisiones y del capstone.

## Arquitectura de dependencias siguiendo Vigilio

```text
App Shell / hash route
  ├── CodeReviewLab.tsx            # Solo UX
  │    ├── content/code-reviews.json # Datos versionados
  │    └── engine/code-review.mjs    # Validación pura
  ├── SeniorCapstone.tsx            # Guía y descarga, sin ejecutar Go
  │    └── content/capstone.json     # Pasos y riesgos
  └── sanitizePrefs()               # Límite de confianza localStorage/import

labs-native/capstone/
  ├── orders/     # Dominio seguro in-process, outbox, invariantes
  ├── httpapi/    # HTTP local con límites y errores tipados
  └── demo/       # Proceso local, señales y shutdown
```

No hay HTTP remoto dentro de la SPA. Las dependencias apuntan hacia abajo y se reutilizan primitivas UI.

## Buenas prácticas aplicadas

1. **Operaciones atómicas en el proceso:** inventario, registro de clave idempotente y evento se modifican bajo el mismo mutex.
2. **Idempotencia de resultados:** clave repetida devuelve el recibo *original*; distinta solicitud con la misma clave produce `ErrConflict`.
3. **Validación en bordes:** JSON estricto, tamaño máximo, MIME, token inyectado, cantidades/stock y overflow de precios.
4. **Cancelación y shutdown:** comprobar `ctx.Err()` antes de mutar estado; el demo HTTP espera Shutdown con deadline.
5. **Observabilidad y auditoría:** tests con nombres explícitos, pruebas race y benchmark reproducible. No se inventan métricas de producción.
6. **Determinismo:** reloj inyectable en el dominio, respuestas versionadas y pruebas de escenarios de error.
7. **Almacenamiento offline:** resultados guardados localmente y validados al importarse, sin prometer control antifraude.
8. **Seguridad básica:** respuestas de error genéricas, `nosniff`, `no-store`, límites de payload y token no hardcodeado en código.

## Requisitos de seguridad NO cumplidos (deliberadamente fuera de un capstone local)

El sistema Go de ejemplo **NO** tiene una base de datos, durabilidad, OAuth/OIDC, tenancies, protección TLS pública, limitador de solicitudes, rotación de credenciales, alertas ni despliegue. No reutilizar el token de ejemplo en producción. El outbox de memoria tampoco demuestra transacciones distribuidas.

El editor de la SPA **NO** compila arbitrariamente Go. Los 18 laboratorios y el capstone se descargan y ejecutan con la herramienta oficial de Go en el equipo del estudiante.

## Comandos reproducibles

```sh
node --test tests/*.test.mjs
node scripts/audit-assets.mjs
cd labs-native
go test ./... -count=1
go test -race ./... -count=1
go vet ./...
go test -run '^$' -bench BenchmarkSubmit ./capstone/orders
# opcional en máquina local con recursos suficientes:
go test -run '^$' -fuzz FuzzIdempotentReceipt -fuzztime=5s ./capstone/orders
```

## Estado

La aplicación estática completa sigue con pendientes de versiones anteriores: contenido íntegro de los 54 módulos de Go y los 8 itinerarios de frameworks, traducción técnica a seis idiomas, ejecución Go WASM y `npm ci`/build no verificados hasta disponer de npm y lockfile.
