# Manifiesto Senior Mode v5

El archivo ZIP incluye toda la SPA v4 y nuevas funcionalidades v5 sin `node_modules` ni credenciales.

## Archivos críticos nuevos
- `src/features/senior/OperationsLab.tsx` — UI de 18 casos operativos.
- `src/features/senior/engine/operations.mjs` y `operations.d.mts` — evaluador puro y contrato.
- `src/content/senior/operations-labs.json` — 18 desafíos versionados con evidencia.
- `src/features/senior/engine/simulations.mjs` — escenarios matemáticos de memoria, mensajería y capacidad.
- `tests/senior-operations.test.mjs` y `tests/senior-models-v5.test.mjs` — nuevas pruebas.
- `senior-v5-demo-offline.html` — demo independiente, abrir en navegador.
- `docs/previews/` — capturas verificadas desktop/mobile de la demo.
- `.agents/skills/senior-operational-labs/SKILL.md` — reglas para agentes.
- `AUDIT_REPORT_SENIOR_V5.md` — requerimientos, evidencia, pendientes.

## Reproducción
`npm run check:content` prueba la lógica Node sin instalar paquetes; `npm ci && npm run build` necesita resolver dependencias y un lockfile que **aún no existe**.

Esta entrega no contiene `dist/` construido ni runtime Go WebAssembly.

