# Inventario de componentes GoPixel — UI/UX

| Componente | Lugar | Comportamiento | Estado |
|---|---|---|---|
| `AppHeader` | Todas | Logo, navegación, selector idioma, tema, Senior toggle, ajustes | Demo funcional |
| `StartHero` | Landing | Gopher, CTA START, explorar rutas, indicadores 54/18/8/6 | Demo funcional |
| `CourseSidebar` | Catálogo | Básico, intermedio, avanzado, Senior y filtros | Demo funcional |
| `ModuleCard` | Catálogo | ID, título traducido, estado, enlace | Demo funcional |
| `LessonIntro` | Aula | Objetivos, Gopher contextual | Demo parcial |
| `GoCodeEditor` | Aula | Textarea con borrador local y comprobador de reglas | **No es compilador** |
| `OutputConsole` | Aula | Reservado para futuro runtime real Go WASM | Planeado |
| `SimpleQuiz` | Juegos | Pregunta, 4 alternativas, respuesta | Demo funcional |
| `FillCode` | Juegos | Campo de token | Demo funcional |
| `CodeOrder` | Juegos | Botones ↑↓, sin drag & drop complejo | Demo funcional |
| `PredictOutput` | Juegos | Expresión simple y alternativas | Demo funcional |
| `BugHunter` | Juegos | Detección de error sintáctico | Demo funcional |
| `SeniorDashboard` | Senior | 18 tarjetas con briefs traducidos | Demo funcional |
| `ProductionBrief` | Senior Lab | Caso de producción y restricciones | Demo funcional |
| `TradeoffEditor` | Senior Lab | Notas ADR auto-guardadas | Demo funcional |
| `SeniorRubric` | Senior Lab | 6 criterios autoevaluados | Demo funcional |
| `SeniorSimulator` | Senior | Diagramas y escenarios específicos | Planeado |
| `FrameworkCatalog` | Frameworks | 8 rutas, tags, fichas | Demo funcional |
| `FrameworkSandbox` | Frameworks | HTTP/API simulado rotulado explícitamente | Planeado |
| `ProgressProfile` | Progreso | XP, completados, juegos y logros | Demo funcional |
| `SettingsPanel` | Ajustes | Tema, idioma en header, reduced-motion, export/import, borrar | Demo funcional |
| `AppFooter` | Todas | Créditos Gopher, independencia, ajustes | Demo funcional |

## Estados de control

- Botones: default, hover, pressed, focus-visible, disabled.
- Quiz: sin seleccionar, seleccionado, correcto, incorrecto.
- Senior: no empezado, brief abierto, notas, checklist, autoevaluado.
- Locales: 6 opciones; sin interrumpir navegación al cambiarlas.
- Tema: `data-theme=light|dark`; Senior independientemente `data-senior=true|false`.

No hay botón ni chip de “guardado en localStorage”.
