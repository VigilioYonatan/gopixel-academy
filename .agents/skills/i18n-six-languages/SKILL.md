---
name: i18n-six-languages
description: Traducir y revisar contenido ES/EN/JA/ZH/PT/FR
---

# i18n-six-languages

## Objetivo

Traducir y revisar contenido ES/EN/JA/ZH/PT/FR.

## Política principal

Leer `docs/i18n/SEIS_IDIOMAS.md` y `src/i18n/*.json`. Todo texto visible debe tener clave; títulos de 62 módulos en `curriculum.json`. Cambiar idioma no debe alterar borradores ni código Go. Revisar copy técnico, wrapping de JA/ZH, accesibilidad y consistencia terminológica.

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
