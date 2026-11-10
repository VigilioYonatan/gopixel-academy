---
name: go-runtime-adapter
description: Integrar un motor Go de navegador real sólo tras validar compatibilidad
---

# go-runtime-adapter

## Objetivo

Integrar un motor Go de navegador real sólo tras validar compatibilidad.

## Política principal

Leer `docs/architecture/LIMITES_RUNTIME_GO.md`. No fingir ejecución. Adapters explícitos runnable/simulated/external; Web Worker, cancelación, aislamiento adecuado; test compatibilidad de Go por feature; frameworks backend y profiling se ejecutan fuera de Pages.

## Proceso de trabajo

1. Leer los documentos asociados y los componentes existentes.
2. Identificar qué está implementado y qué es sólo planeado.
3. Cambiar el menor conjunto de archivos posible; no duplicar UI ni estado.
4. Añadir tests apropiados cuando la implementación avance.
5. Revisar tema claro y oscuro, 6 locales y movilidad.
6. No presentar resultados simulados como ejecución Go real.

## Definition of Done

- Es coherente con el diseño GoPixel aprobado.
- Funciona sin backend en GitHub Pages o está marcado explícitamente como laboratorio externo.
- Nunca depende de localStorage remoto o de registro.
- Tiene estados accesibles, mensajes legibles y modo reducido movimiento.
- Está documentado su alcance real.
