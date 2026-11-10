# AUDITORÍA TOTAL / ZERO OMISSIONS — GoPixel Senior Mode v4

**Decisión: ENTREGA PARCIAL — NO APROBADA PARA PRODUCCIÓN.**

Esta es una actualización de v3 sobre el proyecto original sin borrar assets ni contenidos existentes. Los módulos y simuladores nuevos son funcionalidad educativa offline; no equivalen a un compilador Go o a ejercicios de Go ejecutables.

## Requisitos trazados

| ID | Requisito | Estado | Archivos / evidencia | Límite |
|---|---|---|---|---|
|R-01|SPA Preact, rutas Senior y recursos existentes|VERIFICADO PARCIALMENTE|`src/app/App.tsx; tests de contenido`|Navegación no probada en navegador|
|R-02|18 investigaciones únicas (54 decisiones)|VERIFICADO|`src/content/senior/investigations.json; tests/senior-investigation.test.mjs`|Tests Node de catálogo y enunciados|
|R-03|Evaluador puro y resistente a manipulación|VERIFICADO|`src/features/senior/engine/investigation.mjs`|Tests de entradas y puntuación importada|
|R-04|UI de investigación y resultados guardados|NO VERIFICABLE|`src/features/senior/InvestigationLab.tsx; src/app/App.tsx`|Sintaxis transpila; E2E no disponible|
|R-05|Simulaciones S10 y S11 deterministas|VERIFICADO|`src/features/senior/engine/simulations.mjs; tests/senior-simulations.test.mjs`|4 tests de invariantes y rangos|
|R-06|Modelos claros de simulación frente a Go real|VERIFICADO|`src/features/senior/SeniorSimulationLab.tsx; docs/senior/INVESTIGATIONS_V4.md`|Inspección de etiquetas y documentación|
|R-07|Temas dark/light, CSS responsive, sprites|VERIFICADO PARCIALMENTE|`src/styles/app.css; public/assets`|Assets verificados; navegador no probado|
|R-08|Seis idiomas para interfaz|VERIFICADO PARCIALMENTE|`src/i18n/*.json`|Diccionarios inspeccionados; nuevas investigaciones están solo en español|
|R-09|Traducción completa de lecciones y Senior|INCOMPLETO|`src/content/senior/`|54 investigaciones en español y contenidos educativos pendientes|
|R-10|Runtime Go WASM validado|INCOMPLETO|`src/features/editor/go-runner.ts`|UnavailableGoRunner, sin ejecución Go|
|R-11|Laboratorios Go funcionales y desafíos reales de producción|INCOMPLETO|`src/features/senior/`|Simulaciones didácticas y evaluaciones estáticas, no code execution|
|R-12|CI y build reproducible|FALLA|`package.json; .github/workflows/ci.yml`|Sin package-lock ni dependencias instaladas; build TS2688|
|R-13|Contenido completo 54 Go + 8 frameworks|INCOMPLETO|`src/data/curriculum.json`|Catálogo no equivale a lecciones completas|
|R-14|Pruebas Node y auditoría ZIP extraído|VERIFICADO|`tests/*.test.mjs; ZIP final`|26 tests exitosos y extracción limpia|
|R-15|Alineación con Vigilio Docs y skills|VERIFICADO PARCIALMENTE|`.agents/skills/vigilio/; docs/senior/INVESTIGATIONS_V4.md`|Feature ownership, motor puro, tests, límites documentados|

## Datos de control antes de empacar

- Requisitos identificados: **15**; desglose: {'VERIFICADO PARCIALMENTE': 4, 'VERIFICADO': 5, 'NO VERIFICABLE': 1, 'INCOMPLETO': 4, 'FALLA': 1}.
- Pruebas: `npm run check:content` → **26 tests Node passed**, verificador de 15 icon refs, 62 entradas de catálogo y 6 diccionarios.
- Sintaxis TSX: `typescript.transpileModule` pasó para `App.tsx`, `InvestigationLab.tsx` y `SeniorSimulationLab.tsx` (no equivale a typecheck).
- Build: `npm run build` → **falló TS2688 vite/client**, faltan dependencias npm; `npm install --package-lock-only --offline` → ENOTCACHED. Por ello no existe lockfile y CI con npm ci no está listo.
- E2E en navegador: **NO VERIFICADO**, por ausencia de dependencias disponibles en entorno.
- Número de archivos antes de los informes: 239; imágenes PNG: 68, SVG: 38.
- No se ejecutan comandos remotos ni se entregan credenciales.

## P1 pendientes

1. Instalar dependencias desde un entorno con acceso a npm y generar un lockfile validado. Reparar cualquier error de TypeScript real tras instalar.
2. Integrar y probar runtime Go WASM compatible: actualmente no hay código Go ejecutable.
3. Terminar lecciones/ejercicios y retos senior con evaluaciones de código.
4. Traducir contenido de retos a los seis idiomas y revisarlo lingüísticamente.
5. Ejecutar tests de navegación, responsive, accesibilidad y build desde el ZIP extraído.

## Cambios en v4

- 18 nuevas investigaciones, tres decisiones por módulo: 54 prompts distintos, no regeneración de un único texto.
- Opciones correctas rotadas de forma determinista para evitar patrones triviales.
- Se añade verificación de integridad de resultados importados y pantalla de reporte.
- Dos modelos adicionales acotados (S10, S11), probados con invariantes.
- UI de la nueva feature separada de `App.tsx`, reusando clases CSS y persistencia existente.

## Conformidad con Vigilio Docs

Se aplican límites de feature, lógica pura sin dependencia de UI, datos/versiones declarativos, persistencia al borde de app, pruebas unitarias para lógica y diseño responsive existente. No se añadió microfrontend, servidor, autenticación o infraestructura innecesaria.
