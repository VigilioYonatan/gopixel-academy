# Auditoría Zero Omissions — GoPixel Academy Senior Mode v5

**Estado: ENTREGA PARCIAL / NO VERIFICABLE COMO RELEASE PRODUCTIVO.**

Alcance: nuevos casos operativos S01–S18, motores puros, simulaciones S07/S09/S18, integración de rutas/persistencia en la SPA existente, assets existentes, demo offline independiente, documentación y ZIP. No se certifica Go ejecutable ni dominio completo de ingeniería senior.

## Matriz de requisitos y evidencias

| ID | Requisito | Prioridad | Archivos | Método | Estado | Evidencia / límite |
|---|---|---|---|---|---|---|
| R01 | Conservar SPA Preact y Vigilio boundaries | Alta | `src/app/App.tsx`, `.agents/skills/vigilio`, `AGENTS.md` | Imports y lectura de reglas | VERIFICADO parcialmente | Nueva UI y lógica separadas; app heredada aún monolítica |
| R02 | 18 laboratorios operativos específicos | Alta | `src/content/senior/operations-labs.json` | Test de IDs, título y evidencia únicos | VERIFICADO | `senior-operations.test.mjs` |
| R03 | Evaluador de dos decisiones con límites | Alta | `engine/operations.mjs`, `.d.mts` | Tests de entradas válidas e inválidas | VERIFICADO | Tests Node |
| R04 | Proteger integridad de backup local | Alta | `App.tsx`, `operations.mjs` | Recomputar nota y rechazar datos alterados | VERIFICADO en motor | Test de puntuación, respuestas y versión |
| R05 | Rutas y panel Senior | Alta | `App.tsx`, `OperationsLab.tsx` | Inspección, transpile TSX, enlace estático | NO VERIFICABLE íntegramente | Build SPA / E2E de Preact no disponible |
| R06 | Simulaciones S07 memoria, S09 duplicados, S18 capacidad | Alta | `engine/simulations.mjs`, `SeniorSimulationLab.tsx` | 7 nuevos tests matemáticos | VERIFICADO en motor | Modelos educativos, no medidas reales |
| R07 | Conservar S05 worker, S10 stock, S11 retries | Alta | `worker-pool.mjs`, `simulations.mjs` | Tests existentes | VERIFICADO en motor | No hay Go ejecutándose |
| R08 | Demo offline usable | Alta | `senior-v5-demo-offline.html` | Browser automation con HTML cargado en memoria | VERIFICADO parcialmente | 18 módulos, decisión correcta, layout 390px, theme e idioma |
| R09 | Guardado después de recargar la demo | Media | `senior-v5-demo-offline.html` | Requiere origen persistente | NO VERIFICABLE | Sandbox bloquea navegación HTTP/file; JS de localStorage inspeccionado |
| R10 | Light/Dark y seis idiomas | Alta | `OperationsLab.tsx`, `src/i18n`, demo | Inspección y prueba browser en demo | VERIFICADO parcialmente | Etiquetas localizadas; casos técnicos en español |
| R11 | 18 módulos Senior completos con ejecución de Go | Bloqueante | `src/features/editor/go-runner.ts` | Inspección | INCOMPLETO | Runtime WASM no existe |
| R12 | Todo el contenido de 54 Go y 8 frameworks | Alta | `src/data/curriculum.json` | Catálogo vs. lecciones | INCOMPLETO | Los registros `planned` no son cursos terminados |
| R13 | Traducción integral de cursos y Senior | Alta | `src/content`, `src/i18n` | Conteo de diccionarios y revisión | INCOMPLETO | Lecciones y casos largos sin traducir |
| R14 | Build Vite reproducible con npm ci | Bloqueante | `package.json`, workflows | `npm run build` | FALLA / NO VERIFICABLE | TS2688 vite/client: dependencias ausentes; no lockfile |
| R15 | ZIP no corrupto, extracción limpia y tests repetibles | Alta | ZIP final, `CHECKSUMS_SENIOR_V5.sha256` | ZIP `testzip`, extracción, hashes, `npm run check:content` | VERIFICADO | 256 archivos, 255 hashes y 38 tests superados desde extracción limpia |

## Hallazgos abiertos

- **P1:** falta Go ejecutable seguro y compatibilidad validada WASM. No se presenta la verificación de respuestas estáticas como compilación.
- **P1:** aún faltan laboratorios con ejecución de Go real, profiling/race detector y proyectos profesionales.
- **P1:** no hay lockfile npm ni build Vite aprobado: el entorno no tiene las dependencias instaladas.
- **P1:** traducción integral de explicaciones, alternativas y lecciones a seis idiomas pendiente.
- **P2:** `App.tsx` aún contiene parte importante de rutas/estado; requiere refactor y pruebas browser de la SPA.
- **P2:** la demo offline es una aplicación de revisión independiente; sus datos se guardan en `gopixel:v5-demo` y no comparten progreso con la SPA.
- **P2:** la persistencia browser en origen real y el despliegue GitHub Pages no se comprobaron.

## Evidencias de validación observadas antes del empaquetado

- `npm run check:content`: **38/38 tests Node**; auditoría de 15 referencias estáticas de iconos, 62 elementos de catálogo y 6 diccionarios.
- `typescript.transpileModule`: sin errores de diagnóstico en `App.tsx`, `OperationsLab.tsx`, `SeniorSimulationLab.tsx`; esto es sintaxis, no typecheck.
- `npm run build`: **falló TS2688** por falta de tipos `vite/client`. No hay dependencias npm instaladas, por tanto no se confirma funcionamiento de Vite ni TS completo.
- Navegador Chromium mediante HTML en memoria: **18 entradas visibles**, selección de dos respuestas, resultado correcto 100%; modo claro, selector francés y layout 390px sin overflow horizontal. El origen real/persistencia y la SPA Preact no pudieron probarse.

No se han incluido credenciales ni node_modules. El escaneo de patrones de secretos, hashes y pruebas de extracción se registra en el manifiesto de entrega.
