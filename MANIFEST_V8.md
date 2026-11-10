# MANIFEST — GoPixel Academy Senior Mode v8

Este paquete preserva la base v7 y agrega funcionalidad verificable en Senior Mode, con árbol de fuentes y assets sin node_modules. Los datos reflejan el árbol justo antes de crear `MANIFEST_V8.md` y `CHECKSUMS.sha256`.

- Archivos existentes al generar manifiesto: **364**. Dos archivos de entrega (`MANIFEST_V8.md`, `CHECKSUMS.sha256`) se añaden después.
- Cambios respecto v7: **23 archivos nuevos**, **12 editados** y **0 eliminados**.
- Incluye assets PNG/SVG pixelados anteriores, demo HTML autónoma, archivos Go nativos y ZIP de distribución dentro de `public/downloads/`.

## Puntos de entrada y comandos

| Ruta | Función |
|---|---|
| `index.html` + `src/main.tsx` | Entradas de la SPA Preact, requieren npm |
| `src/app/App.tsx` | Router hash y estado local |
| `src/features/senior/CodeReviewLab.tsx` | Code reviews en la SPA |
| `src/features/senior/engine/code-review.mjs` | Motor independiente y validación |
| `src/content/senior/code-reviews.json` | 18 casos de revisión + 36 decisiones |
| `src/features/senior/SeniorCapstone.tsx` | Presentación del capstone local |
| `labs-native/capstone/orders/` | Operaciones de dominio, pruebas, fuzz y benchmark |
| `labs-native/capstone/httpapi/` | API HTTP local con tests adversariales |
| `labs-native/capstone/demo/` | Ejecutable de servidor local, sin nube |
| `public/downloads/go-native-senior-labs.zip` | ZIP de 64 archivos nativos para estudiantes |
| `senior-v8-demo-offline.html` | Demo standalone de reviews/capstone sin npm |
| `.agents/skills/senior-code-review/SKILL.md` | Convenciones y gates de implementación |
| `docs/senior/CODE_REVIEW_CAPSTONE_V8.md` | Arquitectura y buenas prácticas |
| `docs/devsecops/RELEASE_V8.md` | Riesgos y release gates |
| `tests/senior-code-review.test.mjs` | Validación/score/backup/rutas |
| `tests/senior-capstone.test.mjs` | Contratos y cobertura del capstone |
| `scripts/audit-static-imports.py` | Comprobación de imports relativos |
| `scripts/audit-native-bundle.py` | Comprobación byte a byte del ZIP de Go |
| `AUDIT_REPORT_V8.md` | Matriz honesta de auditoría y bloqueos |
| `CHECKSUMS.sha256` | Hash SHA-256 de cada archivo de paquete salvo de sí mismo |

## Nuevos archivos respecto a v7

- `.agents/skills/senior-code-review/SKILL.md`
- `AUDIT_REPORT_V8.md`
- `docs/architecture/VIGILIO_V8.md`
- `docs/devsecops/RELEASE_V8.md`
- `docs/senior/CODE_REVIEW_CAPSTONE_V8.md`
- `labs-native/capstone/demo/main.go`
- `labs-native/capstone/httpapi/README.md`
- `labs-native/capstone/httpapi/handler.go`
- `labs-native/capstone/httpapi/handler_test.go`
- `labs-native/capstone/orders/README.md`
- `labs-native/capstone/orders/orders.go`
- `labs-native/capstone/orders/orders_test.go`
- `scripts/audit-native-bundle.py`
- `scripts/audit-static-imports.py`
- `senior-v8-demo-offline.html`
- `src/content/senior/capstone.json`
- `src/content/senior/code-reviews.json`
- `src/features/senior/CodeReviewLab.tsx`
- `src/features/senior/SeniorCapstone.tsx`
- `src/features/senior/engine/code-review.d.mts`
- `src/features/senior/engine/code-review.mjs`
- `tests/senior-capstone.test.mjs`
- `tests/senior-code-review.test.mjs`

## Archivos modificados respecto a v7

- `.github/workflows/ci.yml`
- `AGENTS.md`
- `README.md`
- `docs/architecture/ROUTES_21.md`
- `docs/senior/COMPETENCY_MODEL_V6.md`
- `docs/senior/NATIVE_GO_LABS_V6.md`
- `public/downloads/go-native-senior-labs.zip`
- `src/app/App.tsx`
- `src/features/senior/NativeLabCatalog.tsx`
- `src/features/senior/engine/readiness.mjs`
- `src/styles/app.css`
- `tests/senior-readiness.test.mjs`

## Exclusiones

Se omiten `node_modules`, dist, caches, secretos y el lockfile ausente. No se inventa `package-lock.json`. La falta de dependencias instaladas es una limitación de build, no una razón para insertar un archivo falso.
