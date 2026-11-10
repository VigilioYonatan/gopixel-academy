# Senior Mode v5 — Laboratorios operativos

18 casos técnicos nuevos, uno por módulo S01–S18. Cada actividad incluye evidencia concreta, diagnóstico de causa raíz, mitigación y explicación. Se puntúan dos selecciones (0/50/100) con motor determinista puro.

## Arquitectura Vigilio aplicada
- Contenido versionado: `src/content/senior/operations-labs.json`.
- Motor puro, validación y verificaciones de backup: `src/features/senior/engine/operations.mjs`.
- Contrato TypeScript: `operations.d.mts`.
- UI accesible con `fieldset`, radio inputs, resultados y reintento: `src/features/senior/OperationsLab.tsx`.
- Orquestación de rutas y estado por módulo en `src/app/App.tsx` (pendiente refactor del app shell heredado).
- Regresión: `tests/senior-operations.test.mjs`.

## Rutas
- `/#/senior/S05/operations-lab`
- `/#/senior/S05/operations-lab/result`
- Reemplazar S05 por cualquier módulo S01–S18.

## Límites conocidos
Estos laboratorios NO ejecutan Go, no miden producción y no certifican capacidad de ingeniería senior. Los escenarios están redactados en español; las etiquetas y avisos se han traducido a seis idiomas. La traducción completa del contenido de todas las actividades sigue pendiente.

## Simulaciones didácticas disponibles
- S05: worker pool, cola y rechazo (`worker-pool.mjs`).
- S07: retención de memoria de subslice (`simulations.mjs`).
- S09: entrega al menos una vez y efectos duplicados (`simulations.mjs`).
- S10: sobreventa e inventario (`simulations.mjs`).
- S11: amplificación por reintentos (`simulations.mjs`).
- S18: capacidad y backpressure (`simulations.mjs`).

Todas son matemáticas deterministas locales, no Go en ejecución.

## Simulaciones didácticas disponibles
- S05: worker pool, cola y rechazo (`worker-pool.mjs`).
- S07: retención de memoria de subslice (`simulations.mjs`).
- S09: entrega al menos una vez y efectos duplicados (`simulations.mjs`).
- S10: sobreventa e inventario (`simulations.mjs`).
- S11: amplificación por reintentos (`simulations.mjs`).
- S18: capacidad y backpressure (`simulations.mjs`).

Todas son matemáticas deterministas locales, no Go en ejecución.
