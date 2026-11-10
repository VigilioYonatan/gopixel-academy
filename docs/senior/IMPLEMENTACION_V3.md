# Senior Mode v3 — implementación verificable

## Funcionalidades implementadas

- 18 cuestionarios de decisiones técnicas versionados (54 preguntas; idioma español).
- 18 laboratorios de análisis de evidencias, uno por módulo, con fragmentos de código, métricas, incidentes o decisiones de arquitectura.
- Cinco modalidades de evidencia: review, architecture, concurrency, performance, incident y security.
- Corrección objetiva por selección múltiple: se comprueban tanto recomendaciones correctas seleccionadas como recomendaciones peligrosas no seleccionadas.
- Reintentos, explicaciones, resultados por separado y persistencia local por módulo.
- Revalidación de puntuaciones importadas: la puntuación se vuelve a calcular contra la versión y clave del desafío; resultados alterados se descartan.
- S05: simulador de colas y trabajadores determinista, independiente de la nueva evaluación por evidencias.
- Vistas `/#/senior/S05/evidence-lab` y `/#/senior/S05/evidence-lab/result`, equivalentes para S01–S18.

## Limitaciones conocidas (no representar como producción completa)

- No existe compilador oficial de Go ni intérprete WASM integrado; los ejercicios no ejecutan código Go.
- Los laboratorios de evidencia son casos educativos estáticos con validación por reglas; NO ejecutan Docker, SQL, profiling, seguridad ni simulaciones de incidentes reales.
- No hay diseño libre de arquitecturas, revisión automatizada de PR, benchmarking ni evaluación de código real.
- Preguntas de cuestionarios y casos de evidencias están redactados en español; faltan versiones íntegramente localizadas a en, ja, zh, pt y fr.
- La lógica UI Senior sigue dentro de `src/app/App.tsx`; falta descomposición por features.
- Sin paquetes npm instalados ni lockfile, el build de Preact/TypeScript completo está no verificado.
- `localStorage` es controlado por el usuario y NO constituye certificación ni almacén a prueba de manipulaciones.

## Archivos modificados

- `src/app/App.tsx`: navegación, UI de evidencias, estado y resultados.
- `src/content/senior/evidence-labs.json`: 18 casos.
- `src/features/senior/engine/evidence.mjs` y `.d.mts`: evaluación y revalidación.
- `src/features/senior/engine/evaluate.mjs` y `.d.mts`: revalidación de cuestionarios.
- `tests/senior-engine.test.mjs` y `tests/senior-evidence.test.mjs`: controles contra puntuaciones manipuladas, respuestas inválidas y soluciones.

## Uso

```sh
npm install
npm run dev
npm run check:content
npm run build
```

Desde la UI: `/#/senior` → módulo S01–S18 → Laboratorio de evidencias → Validar análisis → Ver reporte.
