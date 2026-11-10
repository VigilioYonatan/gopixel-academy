# GoPixel Academy — Arquitectura Frontend Senior v1

**Estado:** propuesta arquitectónica; no implica que la aplicación esté implementada.

**Fuentes leídas:** `vigilio-docs(6).zip` (principalmente `stacks/frontend/web-mfe/architecture/3-arquitectura-estructura-estado.md`, `features/17-scaffold-app-feature.md`, `features/6-golden-path-feature-componentes-hooks.md`, `ui/16-design-system-ui-tokens.md`, `testing/7-testing-vitest-msw-playwright.md`, `playbooks/auto-senior-feature-workflow.md`) y `gopixel-academy-super-skill.zip` (`SKILL.md`, `references/SENIOR_MODE.md`, `references/CONTENT_MODEL.md`, `references/FRONTEND_GO_RUNTIME.md`).

## Decisiones no negociables

1. Una sola **SPA modular con Preact, TypeScript estricto y Vite**, desplegable con **GitHub Pages**, sin backend, cuenta ni API propia.
2. **Feature ownership:** página/componente/estado/modelo/test específicos dentro de su feature. Promover a `shared/ui` únicamente con ≥2 consumidores reales; evitar carpetas vacías o `utils` genérico.
3. **Contenido separado del motor:** lecciones y desafíos escritos como datos versionados en `content/`; la UI no contiene el texto de las clases embebido en JSX.
4. **Senior Mode = 2 superficies:** una ruta de 18 módulos senior y un toggle que agrega retos senior a lecciones compatibles. `seniorEnabled` no equivale a `theme`.
5. **LocalStorage versionado y silencioso:** no mostrar chip/botón «Guardado en localStorage». Guardar progreso y preferencias; permitir exportar/importar JSON desde ajustes de manera opcional.
6. **Ejecución Go local y honesta:** editor CodeMirror; adaptador a intérprete Go/WebAssembly en Web Worker si se valida compatibilidad. `go test -race`, pprof nativo, Docker, PostgreSQL y Kubernetes son laboratorios explicativos/externos; nunca fingir compilación, benchmarks o tests.
7. Tokens CSS para claro/oscuro independientes de `data-senior`; pixel art en mascot/sprites/bordes, tipografía legible para código y párrafos.
8. Tests adyacentes a lógica con Vitest; Playwright para flujos; no declarar PASS sin ejecución.
9. Tamaño proporcional: no introducir monorepo, microfrontends, API-client, BFF, TanStack Query, AWS, Kubernetes ni DDD de servidor solo por aparecer en documentación Vigilio.

## Árbol propuesto

```text
gopixel-academy/
├── .agents/
│   └── skills/
│       ├── gopixel-academy-ui/         # Skill visual ya definido
│       ├── vigilio-auto-senior/        # Workflow de desarrollo (no curso senior)
│       ├── ui-design-system/
│       ├── ux-web-experience/
│       ├── web-mfe-technologies/
│       └── web-mfe-testing/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml           # Build + publicación a Pages
├── docs/
│   ├── architecture/
│   │   ├── decisions.md               # ADRs pequeños sobre límites y tradeoffs
│   │   └── browser-runtime.md         # Soporte real de Go en el navegador
│   └── curriculum/
│       └── senior-learning-outcomes.md
├── public/
│   ├── sprites/
│   │   ├── gopher-idle.webp
│   │   ├── gopher-coding.webp
│   │   ├── gopher-thinking.webp
│   │   ├── gopher-senior.webp
│   │   ├── gopher-success.webp
│   │   └── ATTRIBUTION.md
│   ├── backgrounds/
│   │   ├── landing-day.webp
│   │   └── landing-night.webp
│   └── wasm/
│       ├── go-runtime.wasm             # Solo tras confirmar motor compatible
│       └── wasm_exec.js               # Solo si lo requiere el motor elegido
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── app.tsx
│   │   ├── app.test.tsx
│   │   ├── router.tsx                  # Rutas por hash para GitHub Pages
│   │   ├── app-shell.tsx               # Header + sidebar + footer + outlet
│   │   └── error-boundary.tsx
│   ├── design-system/
│   │   ├── tokens/
│   │   │   ├── primitives.css          # Escalas de color Go, espacios y radios
│   │   │   ├── semantic.css            # surface, content, border, focus, etc.
│   │   │   ├── themes.css              # [data-theme='light'|'dark']
│   │   │   └── senior.css              # [data-senior='true'] (solo acentos)
│   │   └── styles/
│   │       ├── global.css
│   │       └── pixel-effects.css
│   ├── shared/
│   │   └── ui/                         # Solo controles compartidos reales
│   │       ├── pixel-button.tsx
│   │       ├── pixel-button.test.tsx
│   │       ├── theme-toggle.tsx
│   │       ├── progress-bar.tsx
│   │       └── gopher-sprite.tsx
│   ├── features/
│   │   ├── welcome/
│   │   │   ├── pages/welcome-page.tsx  # CTA START
│   │   │   └── components/hero-gopher.tsx
│   │   ├── learning/
│   │   │   ├── pages/learning-page.tsx
│   │   │   ├── pages/lesson-page.tsx
│   │   │   ├── components/course-sidebar.tsx
│   │   │   ├── components/lesson-content.tsx
│   │   │   ├── components/lesson-outline.tsx
│   │   │   └── model/lesson-navigation.ts
│   │   ├── code-editor/
│   │   │   ├── components/go-editor.tsx
│   │   │   ├── components/output-console.tsx
│   │   │   ├── components/editor-toolbar.tsx
│   │   │   └── model/editor-state.ts
│   │   ├── exercises/
│   │   │   ├── components/exercise-panel.tsx
│   │   │   ├── components/exercise-hints.tsx
│   │   │   ├── components/test-results.tsx
│   │   │   ├── model/exercise.types.ts
│   │   │   ├── engine/check-exercise.ts
│   │   │   └── engine/check-exercise.test.ts
│   │   ├── go-runtime/
│   │   │   ├── model/runner.types.ts
│   │   │   ├── adapters/go-runner.ts   # Un solo contrato; motor intercambiable
│   │   │   ├── adapters/wasm-runner.ts # Solo cuando exista runtime validado
│   │   │   ├── worker/go.worker.ts
│   │   │   ├── worker/worker-protocol.ts
│   │   │   ├── model/capabilities.ts   # Soporte por feature/ejercicio
│   │   │   └── adapters/go-runner.test.ts
│   │   ├── senior-mode/
│   │   │   ├── pages/senior-dashboard-page.tsx
│   │   │   ├── pages/senior-lab-page.tsx
│   │   │   ├── components/senior-mode-toggle.tsx
│   │   │   ├── components/production-brief.tsx
│   │   │   ├── components/constraints-list.tsx
│   │   │   ├── components/architecture-notes.tsx
│   │   │   ├── components/tradeoff-editor.tsx
│   │   │   ├── components/senior-test-matrix.tsx
│   │   │   ├── components/review-rubric.tsx
│   │   │   ├── components/incident-simulator.tsx
│   │   │   ├── model/senior-mode.signal.ts
│   │   │   ├── model/senior-challenge.types.ts
│   │   │   ├── engine/resolve-senior-challenge.ts
│   │   │   ├── engine/grade-automatable-criteria.ts
│   │   │   ├── engine/grade-automatable-criteria.test.ts
│   │   │   └── engine/simulate-incident.ts
│   │   ├── progress/
│   │   │   ├── model/progress.signal.ts
│   │   │   ├── model/progress.types.ts
│   │   │   ├── persistence/local-progress.repository.ts
│   │   │   ├── persistence/local-progress.repository.test.ts
│   │   │   ├── persistence/progress-migrations.ts
│   │   │   ├── persistence/progress-export.ts
│   │   │   └── components/progress-overview.tsx
│   │   └── settings/
│   │       ├── pages/settings-page.tsx
│   │       └── components/data-management.tsx
│   ├── content/
│   │   ├── schema/
│   │   │   ├── curriculum.types.ts
│   │   │   └── validate-curriculum.test.ts
│   │   ├── curriculum-manifest.ts    # IDs, niveles y rutas
│   │   ├── tracks/
│   │   │   ├── basico/                 # 12 módulos (carga diferida)
│   │   │   ├── intermedio/             # 12 módulos
│   │   │   ├── avanzado/               # 12 módulos
│   │   │   └── senior/                 # 18 módulos; ver detalle abajo
│   │   └── scenarios/                 # Datos de incidentes, logs, trazas simulados
│   └── test/
│       └── setup.ts
├── e2e/
│   ├── start-and-learn.spec.ts
│   ├── senior-mode.spec.ts
│   ├── theme-and-progress.spec.ts
│   └── offline-route.spec.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── biome.json
└── README.md
```

**Nota sobre el árbol:** representa ownership y archivos relevantes, no es un mandato para crear todos los directorios desde el primer commit. Se crean solo cuando tengan archivos reales, según Vigilio.

## Contenido Senior: 18 módulos separados del motor

```text
src/content/tracks/senior/
├── s01-go-idiomatico/
│   ├── module.ts                     # objetivo, orden, metadatos
│   ├── lesson.ts                     # explicación con ejemplos
│   ├── challenge.ts                  # problema y restricciones
│   ├── fixtures.ts                   # datos de test/simulación
│   └── rubric.ts                     # evaluación del desafío
├── s02-arquitectura-modular/
├── s03-diseno-apis/
├── s04-modelado-dominio/
├── s05-concurrencia-produccion/
│   ├── module.ts
│   ├── lesson.ts
│   ├── challenge.ts                  # Worker pool con backpressure
│   ├── fixtures.ts
│   └── rubric.ts
├── s06-memory-model/
├── s07-runtime-memoria-gc/
├── s08-performance-engineering/
├── s09-sistemas-distribuidos/
├── s10-transacciones-consistencia/
├── s11-resiliencia/
├── s12-seguridad/
├── s13-testing-avanzado/
├── s14-observabilidad-incidentes/
├── s15-deploy-operacion/
├── s16-mantenimiento-migraciones/
├── s17-liderazgo-tecnico/
└── s18-system-design-final/
```

Los temas de módulos vacíos de contenido siguen en el plan curricular, pero no deben materializarse como carpetas vacías.

## Dos conceptos diferentes de Senior Mode

**A. Nivel Senior:** `/senior` (dashboard de 18 módulos) y `/senior/:moduleId` (laboratorios independientes).

**B. Senior Mode Toggle:** habilita un desafío avanzado en la lección normal si existe la referencia `seniorChallengeId`; no cambia automáticamente de curso. Si no existe desafío, ofrece enlace al laboratorio adecuado.

`theme` (`light` | `dark`) y `seniorEnabled` (`boolean`) son preferencias ortogonales. Una pantalla Senior puede ser clara u oscura. Los borradores se separan por modo + ID para no sobrescribir código.

## Flujo principal

```text
Usuario -> /#/           -> welcome-page.tsx -> START
Usuario -> /#/learn/...   -> lesson-page.tsx -> curriculum-manifest.ts
                                             -> exercise-panel.tsx
                                             -> go-editor.tsx
Editor -> Run/Tests -> go-runner.ts -> go.worker.ts -> WASM (si disponible)
                        <- RunResult { status, stdout, diagnostics, tests }
Pasó los tests -> progress.signal.ts -> local-progress.repository.ts
Activar Senior -> senior-mode.signal.ts -> seniorChallengeId
Usuario -> /#/senior/s05-concurrencia-produccion
       -> senior-lab-page.tsx -> challenge.ts + fixtures.ts + rubric.ts
       -> exercise engine (si ejecutable) y/o incident simulator (simulado)
```

## Contratos de contenido (propuesta)

```ts
type Track = 'basico' | 'intermedio' | 'avanzado' | 'senior';
type ExerciseMode = 'executable' | 'simulation' | 'external-lab';

interface Challenge {
  id: string;
  lessonId: string;
  mode: ExerciseMode;
  situation: string;
  objectives: string[];
  constraints: string[];
  starterCode?: string;
  runnerCapabilities?: string[];
  fixtures?: string;
  rubric: Array<{
    id: string;
    title: string;
    weight: number;
    assessment: 'automated' | 'self-review' | 'external';
  }>;
}

interface Lesson {
  id: string;
  track: Track;
  moduleId: string;
  title: string;
  content: string;
  exercises: string[];
  seniorChallengeId?: string;
}
```

- Validación real con motor compatible: `passed/failed/error/timeout/unsupported`.
- Simulación declarada: nunca mezclar sus resultados con perfiles/benchmarks reales.
- Revisión humana y autoevaluación: no convertir automáticamente en una nota objetiva.
- En app estática, los llamados «tests ocultos» no son secretos; código y fixtures se pueden inspeccionar.

## Persistencia local versionada

```ts
interface PersistedAppState {
  version: 1;
  theme: 'light' | 'dark';
  seniorEnabled: boolean;
  lastLessonId?: string;
  completedExerciseIds: string[];
  drafts: Record<string, string>;       // por challenge/exercise y modo
  seniorNotes: Record<string, string>;  // decisiones de arquitectura
}
```

Una sola capa de repositorio lee/escribe, valida, maneja `QuotaExceededError` y migra versiones; Signals administra estado vivo. El porcentaje se deriva, no se duplica en storage. No almacenar secretos. Los datos son de ese navegador y pueden perderse si se borra el almacenamiento; export/import opcional desde Settings.

## GitHub Pages

- `vite.config.ts`: `base: '/gopixel-academy/'` si el repositorio se llama `gopixel-academy`.
- Navegación por hash: `/#/learn/basico/...`, `/#/senior/...` para que refrescar rutas no dé 404.
- Assets y WASM con `import.meta.env.BASE_URL`; evitar `fetch('/wasm/...')` absoluto en project Pages.
- Web Worker mediante `new Worker(new URL('./worker/go.worker.ts', import.meta.url), { type: 'module' })` desde el módulo que lo importe.
- No enviar tareas Go a servicios remotos; si se decide usar uno, deja de cumplirse frontend-only estricto.
- GitHub Actions debe ejecutar lint, typecheck, unit tests, E2E y build antes de publicar.

## Skill routing / Vigilio Auto-Senior

- `vigilio-auto-senior`: descubrir contexto, evaluar impacto, planificar, verificar, revisar y reportar.
- `web-mfe-technologies` y `web-mfe-build-feature`: arquitectura feature-based y Preact.
- `ui-design-system`, `ui-art-direction`, `ux-web-experience`, `ux-accessibility`: dirección visual, tokens y UX.
- `web-mfe-testing`, `web-mfe-quality`: tests y performance.
- `gopixel-academy-ui`: especificación visual del producto (prioridad en asuntos de marca/pixel art).
- Personalizados: `go-learning-engine`, `go-browser-runtime`, `senior-mode-engine`, `local-progress`.

**El skill anterior mencionaba React como preferencia; la elección vinculante de este proyecto es Preact.**

## Roadmap para no sobrediseñar

1. Fase A: App shell, welcome START, tokens claro/oscuro, navegación y primer módulo básico.
2. Fase B: Editor, ejercicios, hints, tests sencillos, persistencia versionada y export/import.
3. Fase C: Prototipo del intérprete Go en Web Worker; matriz de compatibilidad por ejercicio.
4. Fase D: Senior Mode toggle + primer laboratorio S05 con rúbrica, simulación y tests compatibles.
5. Fase E: Expandir currículo y verificar visual + accesibilidad + GitHub Pages.

**Definition of Done:** ninguna ejecución fingida; render usable en móvil/escritorio; cambio tema+Senior independientes; progreso restaurado; rutas directas en Pages; errores y estados `unsupported` visibles; tests reales ejecutados; atribución de mascota y licencia incluidas.
