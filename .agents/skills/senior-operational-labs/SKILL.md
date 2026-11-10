---
name: senior-operational-labs
description: Amplía y audita laboratorios operativos de GoPixel Academy con escenarios versionados, evaluaciones reproducibles, seis idiomas de interfaz y persistencia local validada.
---

# Senior Operational Labs

1. Leer `AGENTS.md`, `docs/senior/OPERATIONS_V5.md` y las reglas Vigilio `web-mfe-build-feature`. No crear otra SPA, backend ni microfrontend.
2. Mantener los escenarios de enseñanza en `src/content/senior/operations-labs.json`; no mezclar contenido con JSX. Para cambiar una clave de evaluación, incrementar `version` y actualizar validadores y registros guardados.
3. El motor `src/features/senior/engine/operations.mjs` es puro y sin dependencia del DOM. Su API no permite respuestas incompletas ni acepta puntuaciones incoherentes de backups.
4. `OperationsLab.tsx` implementa composición y estados accesibles usando fieldsets, labels, focus, resultados y reintento. Solo usa `localStorage` mediante el owner de app.
5. Cada módulo S01–S18 debe tener evidencia única, diagnóstico, mitigación y explicación contextual. Los modelos deben identificarse como educativos, nunca como Go real.
6. Ejecutar `npm run check:content`; al agregar motor o escenario actualizar tests. Probar modo oscuro/claro, 390px y navegación en navegador cuando sea viable.
7. Revisar `AUDIT_REPORT_SENIOR_V5.md` antes de release. La ausencia de runtime Go/WASM y traducciones de los textos largos bloquea declarar completo el producto.
