# GoPixel Academy · Senior Mode v8 (base v7 preservada)

**Frontend estático Preact + TypeScript + Vite para GitHub Pages**, con estética pixel art moderna, Gopher pixelado, Light/Dark Mode, interfaz en seis idiomas, juegos ligeros y aprendizaje de Go.

## Qué hay realmente

- **Academia web**: 54 módulos de Go y 8 rutas de frameworks catalogados; 5 ejercicios básicos autocorregidos por patrones, no por compilación Go. No son 54 cursos plenamente desarrollados.
- **Senior Mode**: 18 módulos con cuestionarios, laboratorios estáticos de evidencias, investigaciones y casos operativos con validación objetiva. Seis modelos matemáticos didácticos (S05, S07, S09, S10, S11, S18).
- **Nuevo v6:** 18 laboratorios nativos con código Go ejecutable y pruebas unitarias adyacentes, más `go test -race`; descarga completa disponible en la interfaz. El lenguaje de programación se ejecuta **fuera del navegador** con Go 1.23+, no en GitHub Pages.
- **Nuevo v6:** mapa de competencias `/#/senior/readiness`, calculado a partir de los cinco tipos de evaluación educativa local; no acredita experiencia profesional ni verifica la finalización de laboratorios externos.
- **Navegación:** `/#/senior/native`, `/#/senior/S05/native` y `/#/senior/readiness`; selector claro/oscuro y seis idiomas para etiquetas y títulos de módulos.
- **Juegos:** quiz, completar, ordenar, predecir salida y detectar bug; todos ligeros sin motor de videojuegos.
- **Progreso:** guardado automático en localStorage, exportación/importación con validación de registros. No existe cuenta ni backend.
- **Assets:** PNG, SVG y sprites del Gopher; atribución de la mascota original a Renee French (CC BY 4.0).

## Cómo empezar

### Demo sin npm

Abre `senior-v6-demo-offline.html` para explorar los 18 laboratorios descargables y cambiar tema/idioma sin conectarte. `demo-offline.html` y `senior-v5-demo-offline.html` son demos anteriores que se conservan como referencia histórica. Las demos no son la SPA Preact compilada.

### Pruebas y Go nativo

```bash
npm run check:content
cd labs-native
go test ./...
go test -race ./...
go vet ./...
```

Para practicar un laboratorio, lee `labs-native/s05-worker-pool/README.md`, estudia los tests y edita una copia de la solución. También puedes descargar los 18 laboratorios con `public/downloads/go-native-senior-labs.zip` desde la web.

### Aplicación Preact

```bash
npm install
npm run dev
npm run build
```

**Importante para release:** no se ha podido instalar npm en este entorno (DNS del registro npm). No hay lockfile; `npm ci` de CI todavía requiere generarlo tras una instalación válida. El build Vite y Playwright **NO están verificados**. GitHub Pages no debe marcarse como listo para producción hasta resolver ese bloqueo. `vite.config.ts` admite `VITE_BASE` para repositorios con otro nombre.

## Limitaciones explícitas

1. No hay intérprete o compilador Go funcional dentro del navegador; la SPA no ejecuta código Go arbitrario.
2. Los laboratorios nativos funcionan en el equipo del estudiante; la web no puede comprobar de manera fiable si los ejecutó.
3. No están completos los 54 cursos extensos ni las 8 rutas de frameworks.
4. La traducción **total** de todo el contenido de los retos Senior a los seis idiomas sigue pendiente. La interfaz de los nuevos laboratorios tiene etiquetas en seis idiomas y utiliza títulos de módulo localizados, pero sus guías y fuente Go están principalmente en español.
5. El motor de evaluaciones web no es una certificación profesional.

## Documentación importante

- `docs/senior/NATIVE_GO_LABS_V6.md` — los 18 nuevos ejercicios Go y sus criterios.
- `docs/senior/COMPETENCY_MODEL_V6.md` — agregación de resultados y límites.
- `docs/architecture/VIGILIO_ALIGNMENT_V6.md` — responsabilidad de features y compatibilidad con Vigilio.
- `docs/devsecops/RELEASE_V6.md` — CI, seguridad y release gate.
- `AUDIT_REPORT_SENIOR_V6.md` y `MANIFEST_SENIOR_V6.md` — inspección, pruebas, pendientes y trazabilidad.

## Licencias

GoPixel Academy no es un sitio oficial del proyecto Go. El Go Gopher original fue creado por Renee French y está publicado bajo CC BY 4.0; las modificaciones pixeladas requieren conservar atribución.


## Actualización v7 — guías técnicas Senior

- `/#/senior/S01/guide` ... `/#/senior/S18/guide`: 18 guías con contexto, invariantes, pruebas, fallo típico y ADR.
- `src/content/senior/guides.json`: material educativo y código + tests de los laboratorios nativos.
- `senior-v7-demo-offline.html`: demo standalone sin npm para recorrer todas las guías.
- `docs/senior/LEARNING_GUIDES_V7.md`: contrato de contenido, límites de ejecución y traducción.
- **No hay ejecución Go en el navegador.** Los laboratorios nativos se ejecutan con Go instalado.
- **Idioma:** navegación en seis idiomas; guías técnicas todavía en español, marcado de forma visible.
- **Verificación real:** Node tests, Go tests y `-race` OK; comprobación sintáctica TSX y HTML script OK; Vite build/Pages no verificados por bloqueo npm.


## Actualización v8 — más código y mejores prácticas Senior

- **18 Code Reviews nuevos** (36 decisiones) con Go realista, explicaciones y correcciones; rutas `/#/senior/S01/review-lab` … `S18` y `/result`. Corregir código de un fragmento sigue siendo una evaluación estática, no compilación.
- **Capstone Go real** en `labs-native/capstone/`: servicio de pedidos in-process, idempotencia de respuesta original, stock concurrente, outbox educativo, API HTTP local con strict JSON, pruebas `-race`, fuzzing y benchmark. No se aloja en GitHub Pages.
- **Mapa de competencias** actualizado a cinco evaluaciones web por módulo; no marca pruebas Go externas como aprobadas.
- **Demo nueva** `senior-v8-demo-offline.html` con 18 reviews, feedback, selección entre seis idiomas, claro/oscuro y capstone. Los casos técnicos siguen en español.
- **Descarga Go actualizada** `public/downloads/go-native-senior-labs.zip`: 18 laboratorios previos + capstone nativo.
- **Guía y DevSecOps:** `docs/senior/CODE_REVIEW_CAPSTONE_V8.md`, `docs/architecture/VIGILIO_V8.md`, `docs/devsecops/RELEASE_V8.md` y `.agents/skills/senior-code-review/SKILL.md`.
- **Límites de release:** Vite sin build probado por bloqueo DNS npm y falta de `package-lock.json`; Go WASM no integrado, contenidos de 54 módulos/8 frameworks y traducciones completas pendientes.

### Comandos v8

```sh
node --test tests/*.test.mjs
node scripts/audit-assets.mjs
python3 scripts/audit-native-bundle.py
cd labs-native && go test ./... -count=1 && go test -race ./... -count=1 && go vet ./...
```
