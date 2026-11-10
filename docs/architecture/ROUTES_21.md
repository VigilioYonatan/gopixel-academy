# 21 plantillas de navegación — diseño objetivo

En el scaffold actual hay vistas para inicio, catálogo, lección, 5 juegos, Senior dashboard/lab, frameworks, progreso y ajustes. No todas las 21 rutas están conectadas: la matriz de abajo distingue estado.

| # | URL | Feature | Estado en el scaffold |
|--:|---|---|---|
| 1 | `#/` | Inicio / START | Funcional |
| 2 | `#/learn` | Catálogo | Funcional |
| 3 | `#/learn/:level` | Niveles | Funcional |
| 4 | `#/learn/:level/:moduleId` | Página de módulo | Alias funcional a la lección del módulo; contenido pendiente |
| 5 | `#/learn/:level/:moduleId/:lessonId` | Lección | Alias de lección actual, sin lecciones individuales redactadas |
| 6 | `#/exercise/:exerciseId` | Ejercicio | Ruta conectada a 5 ejercicios base; sin ejecución Go real |
| 7 | `#/games` | Juegos | Funcional |
| 8 | `#/games/:gameId` | Juego particular | Ruta dinámica conectada al selector del minijuego |
| 9 | `#/playground` | Editor libre | Página honesta de disponibilidad; runtime Go pendiente |
| 10 | `#/senior` | Senior dashboard | Funcional |
| 11 | `#/senior/:moduleId` | Senior módulo/lab | Autoevaluación funcional |
| 12 | `#/senior/:moduleId/:challengeId` | Laboratorio específico | Ruta conectada al módulo genérico, sin motor de laboratorios |
| 13 | `#/senior/:moduleId/:challengeId/result` | Resultado | Resumen de autoevaluación conectado |
| 14 | `#/frameworks` | Frameworks Academy | Funcional |
| 15 | `#/frameworks/:frameworkId` | Ruta framework | Funcional (plan formativo) |
| 16 | `#/frameworks/:frameworkId/:lessonId` | Lección framework | Alias a vista de framework; lección detallada pendiente |
| 17 | `#/progress` | Perfil local | Funcional |
| 18 | `#/settings` | Ajustes y backup | Funcional |
| 19 | `#/about` | Acerca de | Funcional |
| 20 | `#/credits` | Créditos | Funcional |
| 21 | `#/404` | No encontrada | Funcional |

No presentar las plantillas futuras como si estuvieran ya publicadas.

## Rutas adicionales v8 (misma SPA, sin otra aplicación)

| URL | Pantalla | Función |
|---|---|---|
| `#/senior/:moduleId/review-lab` | `CodeReviewLab.tsx` | 18 revisiones de código con dos decisiones cada una |
| `#/senior/:moduleId/review-lab/result` | `CodeReviewLab.tsx` | Resultados persistentes verificados contra la clave de corrección |
| `#/senior/capstone` | `SeniorCapstone.tsx` | Guía, límites y descarga del capstone Go local |

Hay **dos componentes de página nuevos**; las dos rutas de review reutilizan uno. Los 21 tipos anteriores se mantienen como estructura histórica; esto no significa que las lecciones pendientes estén completas.
