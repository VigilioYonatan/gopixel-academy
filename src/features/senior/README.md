# Feature: Senior Mode

Módulo desacoplado de ingeniería avanzada Go de GoPixel Academy, respetando la arquitectura SPA 100% estática y los estándares de Vigilio.

## Componentes

- **`SeniorDashboard.tsx`**: Catálogo de los 18 módulos (S01–S18), métricas de actividades (90 evaluaciones web), accesos directos al bundle nativo Go, al mapa de competencias y al Capstone. Localizado en 6 idiomas (`es`, `en`, `ja`, `zh`, `pt`, `fr`).
- **`SeniorModuleHub.tsx`**: Vista de aterrizaje del módulo Senior, panel con los 7 botones de actividades pedagógicas, integración directa del simulador determinista (`SeniorSimulationLab`) para módulos correspondientes, lista de aprendizajes, notas ADR con autoguardado en navegador y barra lateral de progreso.
- **`DecisionLab.tsx`**: Cuestionario técnico de 3 preguntas de diseño y arquitectura, verificado contra banco estático versionado (`challenges.json`) mediante `./engine/evaluate.mjs`. Accesible con teclado (`fieldset`, `legend`, radio buttons).
- **`EvidenceLab.tsx`**: Laboratorio de evidencias (trazas, logs, perfiles pprof), selección múltiple justificada y corrección determinista mediante `./engine/evidence.mjs`.
- **`InvestigationLab.tsx`**: Análisis por etapas con consecuencias técnicas justificadas mediante `./engine/investigation.mjs`.
- **`OperationsLab.tsx`**: Diagnóstico de incidentes de producción y selección de mitigaciones mediante `./engine/operations.mjs`.
- **`CodeReviewLab.tsx`**: Revisión por pares de pull requests con código Go real, detección de bugs concurrentes, leaks de recursos y anti-patrones mediante `./engine/code-review.mjs`.
- **`SeniorSimulationLab.tsx`**: 6 simuladores interactivos deterministas:
  - **S05**: Worker pool con cola acotada, capacidad, concurrencia y rechazos por saturación.
  - **S07**: Retención de arrays de respaldo por subslices en el Garbage Collector.
  - **S09**: Idempotencia y deduplicación en entrega at-least-once distribuida.
  - **S10**: Consistencia de inventario con operaciones atómicas vs lecturas/escrituras inseguras.
  - **S11**: Tormenta de reintentos y mitigación con backoff exponencial y jitter.
  - **S18**: Capacidad adaptativa de sistema, token bucket y backpressure bajo alta carga.
- **`SeniorGuide.tsx`**: 18 guías técnicas de ingeniería con código Go auténtico y tests que coinciden byte a byte con `labs-native/`.
- **`NativeLabCatalog.tsx`**: Catálogo de los 18 laboratorios Go nativos ejecutables localmente con `go test` y el mapa de competencias agregadas (`SeniorReadiness`).
- **`SeniorCapstone.tsx`**: Proyecto Capstone integral que unifica 6 competencias Go de producción.
- **`SeniorResult.tsx`**: Vistas de informe y resultados verificados para Decision Lab y Evidence Lab.

## Principios y reglas

- **100% estático**: Sin backend, sin API externa, sin telemetría, sin cookies de sesión.
- **Honestidad pedagógica**: El código Go auténtico se ejecuta en la máquina del estudiante vía `go test ./...` y `go test -race ./...`. La web no simula compiladores Go arbitrarios ni certifica títulos oficiales.
- **Persistencia**: LocalStorage seguro bajo la clave `gopixel:v1` con validación estricta en `sanitizePrefs()`.
