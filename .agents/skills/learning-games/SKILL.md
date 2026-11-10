---
name: learning-games
description: Construir minijuegos educativos simples para aprender Go
---

# learning-games

## Objetivo

Construir minijuegos educativos simples para aprender Go.

## Política principal

Leer `docs/content/MINIJUEGOS_LIGEROS.md`. Quiz, fill, reorder, predict y bug hunt; actividades de 3–6 minutos, feedback útil, teclado, sin WebGL ni plataformas ni gamificación adictiva. Evaluar reglas objetivas; no afirmar compilación si no ocurre.

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
