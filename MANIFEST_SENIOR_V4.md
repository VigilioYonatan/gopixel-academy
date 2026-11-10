# Manifiesto de entrega v4

## Punto de entrada y comandos

- `index.html`, `src/main.tsx`, `src/app/App.tsx`.
- `npm install` (requiere red), `npm run dev`, `npm run check:content`, `npm run build`.
- `demo-offline.html`: preview anterior y **no incluye necesariamente las interacciones nuevas v4**.

## Archivos nuevos relevantes

- `src/content/senior/investigations.json`: 18 casos y 54 decisiones.
- `src/features/senior/engine/investigation.mjs` + `.d.mts`: evaluación y verificación de backup.
- `src/features/senior/InvestigationLab.tsx`: vista y reportes del nuevo laboratorio.
- `src/features/senior/engine/simulations.mjs` + `.d.mts`: modelos S10/S11.
- `src/features/senior/SeniorSimulationLab.tsx`: sliders y métricas calculadas.
- `tests/senior-investigation.test.mjs`; `tests/senior-simulations.test.mjs`.
- `docs/senior/INVESTIGATIONS_V4.md`: alcance técnico.
- `AUDIT_REPORT_SENIOR_V4.md`: matriz y riesgos.

## Exclusiones

No se incluye `node_modules` ni una carpeta `dist`, pues no fue posible instalar ni compilar las dependencias. Estos faltantes son bloqueantes para certificar la SPA. No se declara funcional el nuevo código Preact en navegador.
