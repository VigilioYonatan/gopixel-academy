---
name: github-pages
description: Mantener build frontend y deploy gratuito en GitHub Pages
---

# github-pages

## Objetivo

Mantener build frontend y deploy gratuito en GitHub Pages.

## Política principal

Usar Preact + Vite + TypeScript + hash routes. Ajustar base a repositorio, no APIs backend, no tareas server-side. Validar `npm run build`, links asset con BASE_URL, redirects evitables con hash routing. Documentar qué requiere entorno local externo.

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
