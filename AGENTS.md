# GoPixel Academy — instrucciones para agentes

Lee `.agents/skills/gopixel-ui/SKILL.md`, `.agents/skills/auditoria-total-zero-omissions/SKILL.md`, `.agents/skills/devsecops-static-site/SKILL.md` y, según tarea, las skills Vigilio en `.agents/skills/vigilio/`. Mantén el frontend 100% estático y las simulaciones identificadas.

## Arquitectura
Una SPA Preact + Vite + TS, con navegación hash y datos de contenido separados. Consulte `docs/architecture/FILES_WITH_COMMENTS.md`, `docs/architecture/ROUTES_21.md`, `docs/devsecops/THREAT_MODEL.md` y `AUDIT_REPORT.md`.

## Reglas
No añadir backend, sesiones, API, secretos o telemetría. No inventar ejecución de Go. No añadir botón de guardar progreso. No suponer que 54 módulos están redactados. Light/dark, móviles y seis idiomas son obligatorios en nuevas pantallas.

## Release gate
`npm ci && npm run check:content && npm run build && npm audit --audit-level=high`. Si el entorno impide npm, marcar no verificable. Revisar `AUDIT_REPORT.md` antes del release.


## Senior Mode v5
Leer `.agents/skills/senior-operational-labs/SKILL.md`, `docs/senior/OPERATIONS_V5.md` y `AUDIT_REPORT_SENIOR_V5.md`. El código fuente, no los ejemplos HTML, es la referencia para la SPA.


## Senior v6 (integración Vigilio)
- Revisar `vigilio-docs` como guía de arquitectura, pero no incorporar backend/API/Query en una SPA estática.
- `src/features/senior/` es el owner de los laboratorios educativos y `labs-native/` es el owner del código Go local.
- Nunca equiparar `passed` web con una ejecución `go test` en el equipo del estudiante.
- Gates mínimos: `npm run check:content`, `cd labs-native && go test ./... && go test -race ./... && go vet ./...`, build y pruebas E2E de Preact al disponer de npm.
- Reempaquetar `public/downloads/go-native-senior-labs.zip` cada vez que cambie `labs-native/`.
- Skill específico: `.agents/skills/go-native-senior-labs/SKILL.md`.


## Senior Mode v8 — revisión de código + capstone
- Leer `.agents/skills/senior-code-review/SKILL.md` y `docs/architecture/VIGILIO_V8.md` antes de ampliar Senior.
- Mantener evaluador fuera de JSX; toda puntuación importada de review debe recalcularse contra banco versionado.
- No confundir una revisión estática con un programa Go compilado.
- Toda modificación en `labs-native/` exige reempaquetar y auditar `public/downloads/go-native-senior-labs.zip`.
- `docs/devsecops/RELEASE_V8.md` define los release gates.
