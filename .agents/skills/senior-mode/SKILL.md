---
name: senior-mode
description: Desarrollar 18 laboratorios Senior de arquitectura y producción
---

# senior-mode

## Objetivo

Desarrollar 18 laboratorios Senior de arquitectura y producción.

## Política principal

Leer `docs/content/SENIOR_MODE_18_LABS.md`. Cada laboratorio: contexto + restricciones + escenario + notas ADR + criterios de evaluación + modo de validación. Tipos: debugging, review, incident, performance, architecture. Si no se ejecuta código real, indicar simulación o autoevaluación. Nunca simular métricas como medidas reales.

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
