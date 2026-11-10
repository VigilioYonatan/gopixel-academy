# Senior Mode v4 — Investigación por etapas

18 casos técnicos diferenciados, 54 decisiones y explicaciones.

## Límites declarados

Estas actividades son razonamiento estático en español; **no ejecutan Go** ni simulan un backend de producción. El componente traduce las etiquetas a seis idiomas e informa del idioma de los casos. No se presenta como traducción integral.

## Diseño arquitectónico basado en Vigilio Docs

- Feature ownership: `features/senior/InvestigationLab.tsx` es dueño de su vista, no del estado global.
- Dominio determinista: `features/senior/engine/investigation.mjs` no conoce Preact, DOM ni localStorage.
- Contenido separado: `content/senior/investigations.json`, versionado por módulo.
- Persistencia al borde del shell: `App.tsx` valida datos importados antes de actualizar estado.
- Tests adyacentes: `tests/senior-investigation.test.mjs` valida integridad, resultados y manipulación.

## Rutas

- `/#/senior/S05/investigation-lab` investigación de concurrencia
- `/#/senior/S05/investigation-lab/result` abre el laboratorio e informa el último resultado; para una vista de reporte separada se requiere trabajo adicional.

## Próximos gates no cumplidos

- Integración de runtime Go nativo/WebAssembly probado.
- Traducción íntegra de los 54 casos a otros cinco idiomas.
- Build Vite con dependencias npm instaladas y prueba E2E en navegador.
- Simuladores especializados de incidentes, arquitectura y profiling con datasets y validadores no triviales.

## Modelos adicionales

- **S05:** cola de trabajo y workers, modelo preexistente en v3.
- **S10:** compradores y stock bajo estrategia con y sin actualización atómica.
- **S11:** amplificación de reintentos con y sin presupuesto acotado.

Los modelos S10 y S11 están en `features/senior/engine/simulations.mjs` con componentes Preact en `SeniorSimulationLab.tsx`. No son pruebas de rendimiento ni sistemas desplegados.

## URL de reporte

`/#/senior/S05/investigation-lab/result` muestra el último resultado guardado con respuestas y explicaciones.
