# Manifiesto de entrega — Senior v6

- Archivos de proyecto antes del propio manifiesto: 327.
- Raíz única prevista del ZIP: `gopixel-academy/`.
- No se incluyen `node_modules`, `dist` ni secretos.

## Archivos esenciales

- `README.md`, `START_AQUI.md`, `AGENTS.md`: uso y límites.
- `src/app/App.tsx`: SPA y rutas hash.
- `src/features/senior/NativeLabCatalog.tsx`: descargas y mapa de competencias.
- `src/features/senior/engine/readiness.mjs`: agregador puro probado.
- `src/content/senior/native-labs.json`: catálogo de 18 laboratorios.
- `labs-native/go.mod` y 18 directorios de laboratorios: código y tests nativos.
- `public/downloads/go-native-senior-labs.zip`: descarga para GitHub Pages.
- `.github/workflows/ci.yml`: job nativo con race detector y job frontend bloqueado por lockfile.
- `senior-v6-demo-offline.html`: demo autónoma; no reemplaza Preact.
- `AUDIT_REPORT_SENIOR_V6.md`: matriz de trazabilidad.

## Tipos de archivo

| Extensión | Cantidad antes de checksums/manifiesto |
|---|---:|
| `.css` | 1 |
| `.go` | 36 |
| `.html` | 4 |
| `.json` | 16 |
| `.md` | 106 |
| `.mjs` | 23 |
| `.mod` | 1 |
| `.mts` | 7 |
| `.png` | 70 |
| `.sha256` | 4 |
| `.svg` | 38 |
| `.ts` | 3 |
| `.tsx` | 6 |
| `.yaml` | 6 |
| `.yml` | 3 |
| `.zip` | 1 |
| `<sin extensión>` | 2 |

## Control de ZIP

- `ZipFile.testzip()`: confirma integridad CRC.
- Se compararán nombres y hashes de cada archivo extraído contra el árbol fuente.
- Se repetirán `npm run check:content`, `go test` y `go test -race` desde la extracción limpia.
- Los problemas de npm/Chromium no se considerarán aprobados por analogía.
