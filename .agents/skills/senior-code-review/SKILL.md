---
name: senior-code-review
version: 1.0.0
description: Implementar y auditar los 18 desafíos Senior de revisión de código Go, su evaluación objetiva, UI accesible, persistencia y pruebas; respetar Vigilio.
---

# Senior Code Review — reglas obligatorias

1. **Owner:** `src/features/senior/` presenta y evalúa. `src/content/senior/code-reviews.json` es el banco versionado; `labs-native/` contiene código Go independiente ejecutable en equipo local. No mover lógica de corrección a `App.tsx`.
2. **Contratos:** cada S01–S18 tiene un fragmento específico y dos decisiones: identificar el defecto y proponer solución. Validar campos, opción correcta, versión y límites, rechazando entrada inválida.
3. **Integridad:** `verifyReviewRecord` recalcula puntuación de respuestas contra el contenido incluido. Validación de datos importados en `sanitizePrefs` antes de usar el estado. No prometer antifraude: el cliente es controlado por el usuario.
4. **Persistencia:** guardar resultados automáticamente en `gopixel:v1`; jamás añadir botón de guardado o sesiones.
5. **UX/a11y:** fieldset con legend, radios nativos, foco visible, feedback por respuesta, navegación hash, diseño pixel moderno con temas claro/oscuro y layout responsive. Respetar reduced motion.
6. **Idiomas:** los controles tienen seis traducciones; los enunciados técnicos están en español y deben identificarse como tales cuando se selecciona otro idioma. No fingir traducción completa.
7. **Contenido:** al editar casos, actualizar versión y tests. No copiar fragmentos sin propósito, ni presentar snippets rotos intencionados como programas listos para ejecutar.
8. **Go real:** capstone descargable probado con `go test`, `go test -race`, `go vet` y fuzz opcional. Sin backend en GitHub Pages.
9. **Gates:** `node --test tests/*.test.mjs`, `cd labs-native && go test ./... && go test -race ./... && go vet ./...`, auditoría del ZIP extraído y, cuando npm esté disponible, `npm ci && npm run build` + E2E.
10. **Release:** sin lockfile npm y build verificado la SPA no tiene estado APROBADO. Reportar pendientes, como manda `auditoria-total-zero-omissions`.
