---
name: gopixel-ui
description: Diseñar e implementar componentes con arte pixel moderno, temas light/dark, accesibilidad y respuesta móvil
---

# gopixel-ui

## Objetivo

Diseñar e implementar componentes con arte pixel moderno, temas light/dark, accesibilidad y respuesta móvil.

## Política principal

Usar `docs/design/COMPONENTES_UI.md` y `docs/design/ASSETS_Y_PALETA.md`. El 80% del diseño es UI moderna, 20% pixel art. No botones permanentes de almacenamiento. Componentes deben ser reutilizables y aptos para teclado. Conservar palette Go. Revisar 360px, 768px, 1280px, 1600px.

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
