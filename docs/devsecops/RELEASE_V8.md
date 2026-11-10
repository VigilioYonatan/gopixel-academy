# Release gate DevSecOps v8

Los checks de GitHub Actions deben bloquear el despliegue cuando no existan lockfile y dependencias verificables. No cambiar a `npm install` en CI como solución ficticia: generar `package-lock.json` en un entorno con conectividad y usar `npm ci`.

## Gates obligatorios

- `npm ci`, `npm run check:content`, `npm run build` y auditoría de dependencias (pendientes hasta resolver DNS de npm).
- `cd labs-native && go test ./... -count=1 && go test -race ./... -count=1 && go vet ./...` (verificable localmente).
- `python3 scripts/audit-native-bundle.py` para comprobar que la descarga reproduce los archivos nativos.
- `node --test tests/senior-code-review.test.mjs` para pruebas de contenido, integridad y rutas de los 18 Code Reviews.
- Navegación desktop/mobile y cambio de idioma en una demo offline (no sustituye E2E de Preact).
- Integrity gate del ZIP: manifest, hashes, lectura, extracción y smoke tests desde directorio recién extraído.

## Modelo de amenazas incremental

| Amenaza | Mitigación en este producto | Pendiente |
|---|---|---|
| Código Go arbitrario | La web NO ejecuta Go, evita exponer un host de ejecución | WASM con aislamiento y límites, si se implementa |
| Backup adulterado | Recalcular puntuaciones de los review cases al importar | No hay anti-fraude sin servidor |
| XSS de contenido | React/Preact text nodes sin `dangerouslySetInnerHTML` en reviews | E2E CSP y revisión DOM de la SPA |
| DoS por JSON | Límite 1 MB en import y esquemas acotados | Auditoría de render/CPU |
| Payload HTTP local | `MaxBytesReader`, JSON estricto, Content-Type | Auth real, TLS, cuotas, persistencia |
| Data race en capstone | Mutex, tests concurrentes, `go test -race` | Multi-proceso y SQL transaccional |
| Dependencias npm | `npm ci`, `npm audit` en workflows | Lockfile y ejecución real de los gates |

**No declarar APROBADO para producción** mientras falte un control bloqueante o no verificable.
