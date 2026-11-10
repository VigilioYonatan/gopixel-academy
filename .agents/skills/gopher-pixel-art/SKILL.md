---
name: gopher-pixel-art
description: Crear y mantener sprites del Go Gopher, fondos e iconos pixelados
---

# gopher-pixel-art

## Objetivo

Crear y mantener sprites del Go Gopher, fondos e iconos pixelados.

## Política principal

Reutilizar `public/assets/gophers` y `public/assets/icons`; sprites transparentes, nearest-neighbor, 12 poses. Para nuevo arte usar hoja de referencia de Go y mantener crédito Renee French CC BY 4.0. Evitar insinuar que el producto es oficial. SVG son pixel art editable, conservar `shape-rendering: crispEdges`.

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
