# GoPixel Academy — Especificación UI/UX completa (Modern Pixel)

> **Documento de diseño y contrato de implementación — v1.0**  
> Plataforma para aprender **Go (Golang)**: básico → intermedio → avanzado → laboratorio senior.  
> Destino: **Preact + TypeScript + Vite**, aplicación estática en **GitHub Pages**, sin backend ni login.  
> Inspiración aprobada: diseño de GoPixel Academy con el Go Gopher pixelado, tarjetas modernas, azul Go, tema claro y oscuro.  
> **Regla no negociable:** nunca colocar un chip, botón o indicador permanente «Guardado en localStorage» en header, footer o editor. La persistencia es silenciosa.

## Índice

1. [Visión del producto](#1-visión-del-producto)
2. [Mapa de pantallas y navegación](#2-mapa-de-pantallas-y-navegación)
3. [Wireframes generales](#3-wireframes-generales)
4. [Sistema visual](#4-sistema-visual)
5. [Header completo](#5-header-completo)
6. [Footer completo](#6-footer-completo)
7. [Landing y botón START](#7-landing-y-botón-start)
8. [Sidebar, navegación y progreso](#8-sidebar-navegación-y-progreso)
9. [Aula, lecciones y editor](#9-aula-lecciones-y-editor)
10. [Senior Mode: comportamiento y pantallas](#10-senior-mode-comportamiento-y-pantallas)
11. [Catálogo exhaustivo de componentes Senior](#11-catálogo-exhaustivo-de-componentes-senior)
12. [Diseño de los 18 módulos Senior](#12-diseño-de-los-18-módulos-senior)
13. [Contratos de estado y datos](#13-contratos-de-estado-y-datos)
14. [Variables y CSS de referencia](#14-variables-y-css-de-referencia)
15. [Diseño responsive](#15-diseño-responsive)
16. [Accesibilidad, estados y microinteracciones](#16-accesibilidad-estados-y-microinteracciones)
17. [Assets pixelados del Go Gopher](#17-assets-pixelados-del-go-gopher)
18. [Arquitectura de componentes y archivos](#18-arquitectura-de-componentes-y-archivos)
19. [Reglas reales del entorno Go](#19-reglas-reales-del-entorno-go)
20. [Checklist de aceptación](#20-checklist-de-aceptación)

---

## 1. Visión del producto

**Una academia de Go que se siente como un producto moderno, con la personalidad de un videojuego pixelado.** El protagonista es el contenido, no los adornos.

- **80 % producto moderno / 20 % pixel art**: tipografía legible, editor profesional y paneles limpios; gopher, escenas, insignias y pequeños acentos pixelados.
- **Dos temas**: `light` y `dark`, con la misma jerarquía y contraste. El estudiante conserva su elección.
- **Cuatro rutas de aprendizaje**: Básico (12 módulos), Intermedio (12), Avanzado (12) y 18 laboratorios de nivel Senior.
- **Senior Mode** es además un *toggle transversal* que convierte lecciones compatibles en retos con restricciones, pruebas y explicación de decisiones.
- **Progreso local** en `localStorage`; borradores normales y senior almacenados por separado.
- **Sin cuenta, sin nube, sin backend**: GitHub Pages hospeda los archivos estáticos.
- **Editor Go en navegador**: motor WASM/interprete **solo cuando esté validado**, con capacidad por ejercicio; no se presenta como compilador oficial de Go.

### Voz y microcopy

Español cercano y técnico. Botones concretos: **START**, **Continuar**, **Ejecutar**, **Probar solución**, **Pista**, **Reiniciar**, **Ver solución**, **Revisar arquitectura**, **Siguiente lección**. No usar mensajes vacíos como «Todo increíble» sin evidencia.

---

## 2. Mapa de pantallas y navegación

Usar **hash routing** para refrescar rutas sin 404 en GitHub Pages.

| Ruta pública en la SPA | Pantalla | Descripción |
|---|---|---|
| `/#/` | Welcome | Portada, Gopher grande, botón START. |
| `/#/mapa` | Curriculum Map | Mapa de niveles y progreso. |
| `/#/aprender/:id` | Lesson | Lección, ejemplos, editor, consola, ejercicios. |
| `/#/aprender/:id?senior=1` | Senior overlay | La misma lección con un desafío senior relacionado si existe. |
| `/#/senior` | Senior Dashboard | Catálogo de 18 módulos y retos de producción. |
| `/#/senior/:modulo` | Senior Module | Objetivos, teoría especializada, laboratorios. |
| `/#/senior/:modulo/:reto` | Senior Lab | Contexto → editor/simulador → pruebas → revisión. |
| `/#/ajustes` | Settings | Tema, exportar/importar progreso y restablecer datos. |
| `/#/acerca` | About | Créditos de mascota, licencias, limitaciones de Go web. |

**Sin progreso:** START lleva a la primera lección básica. **Con progreso:** START puede convertirse en «Continuar» y abrir la última lección. La selección Senior ON nunca borra el progreso normal.

---

## 3. Wireframes generales

> Los siguientes dibujos describen la jerarquía visual. No son capturas finales ni tamaños exactos.

### A. Landing / bienvenida (modo claro)

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  [Gopher mini] GoPixel Academy       Explorar curso      [☼ / ☾]       [⚙]                 │  ← HEADER 64px
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                                        │  │
│  │  Aprende Go construyendo                           [ Gopher oficial pixelado ]          │  │
│  │  desde cero hasta Senior.                          [ laptop + nube + píxeles ]         │  │
│  │                                                                                        │  │
│  │  Lecciones · ejercicios · retos reales                                               │  │
│  │                                                                                        │  │
│  │  [ ▶ START / CONTINUAR ]     [ Ver temario ]                                         │  │
│  │                                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                              │
│  [ BÁSICO ]           [ INTERMEDIO ]           [ AVANZADO ]            [ SENIOR ]            │
│  [12 módulos]         [12 módulos]            [12 módulos]           [18 módulos]           │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│  GoPixel Academy · Créditos del Gopher · Acerca de · Privacidad local                        │  ← FOOTER
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### B. Lección / modo oscuro

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Gopher] GoPixel       Básico / Lección: Goroutines       [☾ Tema] [♛ Senior OFF] [⚙]             │
├─────────────────────┬────────────────────────────────────────────────┬─────────────────────────────┤
│  PROGRAMA           │ BÁSICO / CONCURRENCIA                            │ EN ESTA LECCIÓN             │
│  🔎 Buscar         │                                                │ • Conceptos                 │
│                     │ Goroutines en Go                                │ • Ejemplo                   │
│  ▸ Básico           │ Aprende cómo crear tareas concurrentes.         │ • Ejercicios 2/4            │
│  ▸ Intermedio       │                                                │                             │
│  ▸ Avanzado         │ [visual pixelado: workers / mensajes]            │ PISTA                       │
│  ♛ Senior Labs      │                                                │ "Prueba con WaitGroup"    │
│                     │ ┌────────────────────────────────────────────┐ │                             │
│  Progreso 36%       │ │ main.go                          [copiar]   │ │                             │
│  █████░░░░░░        │ │ package main ...                          │ │                             │
│                     │ └────────────────────────────────────────────┘ │                             │
│                     │ [▶ Ejecutar] [↻ Reiniciar] [✓ Probar] [💡 Pista]│                             │
│                     │ [> Salida de ejecución y diagnósticos]         │                             │
│                     │ [← Anterior]                      [Siguiente →]│                             │
├─────────────────────┴────────────────────────────────────────────────┴─────────────────────────────┤
│ GoPixel Academy · Créditos · Ayuda                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### C. Senior Dashboard / modo claro

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Gopher] GoPixel        Laboratorio Senior                      [☼ Tema] [♛ Senior ON] [⚙]        │
├────────────────────┬─────────────────────────────────────────────────────────────────────────────┤
│  CURSO DE GO       │ ♛ SENIOR MODE                                                      0/18     │
│  Básico            │ Ingeniería Go en producción                                               │
│  Intermedio        │ [Gopher senior pixel + diagrama minimal de arquitectura]                  │
│  Avanzado          │                                                                             │
│  ♛ Senior Labs ●   │ [Arquitectura] [Concurrencia] [Distribuidos] [Operación] [Liderazgo]       │
│                    │                                                                             │
│  Tu progreso       │ [ S01 Idiomatic Go ]   [ S02 Arquitectura ]  [ S03 APIs ]                 │
│  ███░░░░░░░        │ [ S04 Dominio ]        [ S05 Worker Pools ]  [ S06 Memory Model ]        │
│                    │ [ ... hasta S18: System Design Final ]                                     │
│                    │                                                                             │
│                    │ [ Reto recomendado: Procesar 1.000 trabajos sin perder ninguno ]            │
├────────────────────┴─────────────────────────────────────────────────────────────────────────────┤
│ Footer compacto                                                                                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### D. Senior Lab / modo oscuro

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Gopher] GoPixel        S05 / Worker Pool                  [☾ Tema] [♛ Senior ON] [⚙]            │
├─────────────────────┬──────────────────────────────────────────────────────┬────────────────────────┤
│  S05                │ ♛ RETO DE PRODUCCIÓN     Dificultad: ALTA           │ EVALUACIÓN             │
│  ○ Introducción     │ Worker Pool bajo presión                           │ ✓ Correctitud          │
│  ○ Restricciones    │ API de eventos: cola saturada, workers bloqueados    │ ○ Robustez              │
│  ● Laboratorio      │                                                      │ ○ Diseño               │
│  ○ Revisión         │ [ Brief ] [ Restricciones ] [ Diagrama de flujo ]    │ ○ Recursos             │
│                     │                                                      │ ○ Mantenibilidad       │
│                     │ ┌──────────────────────────────────────────────────┐ │                        │
│                     │ │ main.go                           worker_pool.go │ │ TESTS                  │
│                     │ │ ... código editable ...                          │ │ [✓] caso 1             │
│                     │ └──────────────────────────────────────────────────┘ │ [×] caso 2             │
│                     │ [▶ Ejecutar] [✓ Probar] [💡 Pista] [↻ Reiniciar]     │                        │
│                     │ [ CONSOLA: salida real / diagnósticos ]             │ RAZONAMIENTO           │
│                     │ [ ¿Qué trade-offs elegiste? ___________________ ]    │ [Review pendiente]     │
│                     │ [ Revisar arquitectura ]   [ Siguiente etapa → ]    │                        │
├─────────────────────┴──────────────────────────────────────────────────────┴────────────────────────┤
│ Footer mínimo                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Sistema visual

### 4.1 Colores de identidad

| Token | Color | Uso |
|---|---|---|
| `--go-blue` | `#00ADD8` | Identidad Go; acentos, ilustraciones y CTA. |
| `--go-light` | `#5DC9E2` | Detalles y superficies suaves. |
| `--go-aqua` | `#00A29C` | Apoyo visual secundario. |
| `--go-deep` | `#00758D` | Bordes/hover sobre cian. |
| `--pixel-gold` | `#F4C95D` | Coronas y logros Senior; **no sustituye** al azul Go. |
| `--success` | `#25B68A` | Tests aprobados, confirmaciones. |
| `--danger` | `#E55E72` | Errores y acciones destructivas. |
| `--warning` | `#D39828` | Advertencias y limitaciones. |

### 4.2 Light Mode

| Elemento | Color |
|---|---|
| Canvas | `#F4FAFE` |
| Tarjeta | `#FFFFFF` |
| Tarjeta elevada | `#EAF7FD` |
| Texto principal | `#10263B` |
| Texto secundario | `#527082` |
| Bordes | `#C8E2EC` |
| Editor | `#F7FBFE` |
| Consola | `#112333` |
| CTA primario | `#007E9E` con texto blanco |
| Acento senior | `#AD7917` |

### 4.3 Dark Mode

| Elemento | Color |
|---|---|
| Canvas | `#091522` |
| Tarjeta | `#102235` |
| Tarjeta elevada | `#172D43` |
| Texto principal | `#ECF8FD` |
| Texto secundario | `#9DB8C8` |
| Bordes | `#2B4D61` |
| Editor | `#0B1B2B` |
| Consola | `#06111D` |
| CTA primario | `#35CAE8` con texto navy |
| Acento senior | `#F4C95D` |

### 4.4 Tipos y tamaños

- **Titulares hero**: Space Grotesk/Outfit o sistema; 44–68 px desktop, 32–40 px móvil.
- **Encabezados de lecciones**: 30–40 px; encabezados de tarjetas 18–24 px.
- **Párrafos/UI**: Inter o system-ui, 15–17 px, interlineado 1.55–1.7.
- **Editor y consola**: JetBrains Mono o Fira Code; 13–15 px.
- **Pixel font** (Press Start 2P): únicamente START, minibadges, puntuaciones cortas y banners. **No** en párrafos ni código.
- **Botones**: mínimo 44 px alto; START 64 px; border radius 10 px y sombra escalonada moderada.

### 4.5 Look & feel

- Tarjetas con `border: 1px solid var(--border)` y radio ~16 px.
- Sombras de producto modernas con **detalle retro** de 2–4 px.
- Máximo una gran ilustración pixel por zona; el editor mantiene prioridad.
- No usar fondos con castillos y césped detrás de cada panel. Paisajes solo en landing/empty states.
- Ilustraciones Go Gopher PNG/WEBP RGBA con `image-rendering: pixelated`; el texto sigue nítido.

---

## 5. Header completo

### 5.1 Desktop: contenido exacto

```text
[ Go Gopher 36px ] GoPixel Academy | [Ruta actual/breadcrumb] |  [☼/☾] [♛ Senior Mode] [⚙ Ajustes]
```

| Elemento | Aspecto | Comportamiento | Estado Senior |
|---|---|---|---|
| `BrandMark` | Sprite Gopher mini 36×36 + nombre en tipografía limpia. | Click → inicio; accesible por teclado. | Sin cambios. |
| `HeaderBreadcrumb` | Texto tenue, separador `/`. | Navegación atrás cuando aplique. | Muestra `Senior / S05 / Laboratorio`. |
| `ThemeToggle` | Sol/luna dentro de control 44×44. | Alterna claro/oscuro o abre elección sistema si se implementa. | Independiente del modo Senior. |
| `SeniorModeToggle` | Corona pixel dorada + `Senior Mode` + interruptor. | Cambia contenido/desafíos y guarda preferencia. | Estado activo y `aria-pressed=true`. |
| `SettingsButton` | Engranaje lineal. | Abre ajustes (progreso/exportación/créditos). | Sin cambios. |
| `MobileMenuButton` | Menú hamburguesa. | Abre navegación como drawer. | Muestra acceso a Senior Labs. |

**Especificaciones:** sticky top, altura 64 px (56 en móvil), fondo de superficie, borde inferior sutil, z-index suficiente para el scroll. Máximo 1 línea de acciones. En móvil, `Senior Mode` puede ir en menú/drawer o como icono corona con etiqueta accesible.

**Nunca mostrar en header**: `Guardado en localStorage`, `Frontend only`, `No login`, contadores inflados o barras de progreso enormes.

### 5.2 Estados del Senior toggle

- **OFF:** contorno neutro, corona pequeña gris/oro tenue, texto `Senior Mode`, tooltip «Activar desafíos avanzados».
- **ON:** acento cian en el control + corona dorada; `aria-pressed=true`; tooltip «Desactivar desafíos avanzados».
- **Lección sin variante senior:** el toggle puede seguir activo globalmente; se muestra un mensaje no intrusivo «Esta lección no tiene reto senior. Explorar laboratorios →».
- **No confundir:** `Senior Mode ON` no implica haber completado los 18 módulos ni cambia la paleta a amarillo.

### 5.3 En la landing

Header simplificado: `Logo | Explorar curso | Tema | Ajustes`. El acceso a Senior Labs puede mostrarse como enlace en la sección de niveles, sin competir visualmente con START.

---

## 6. Footer completo

### 6.1 Landing

```text
GoPixel Academy   ·   Explorar cursos   ·   Acerca de   ·   Créditos del Gopher   ·   Privacidad local
```

Borde superior tenue y un **microdetalle de terreno pixel** de 4–8 px opcional. No incluir grandes ilustraciones en el footer. Versión de la app opcional en texto pequeño.

### 6.2 Dentro del aula y Senior Labs

Footer más discreto que el de la landing. Idealmente se ubica después del contenido, no ocupa altura fija del viewport y no interrumpe el editor.

```text
© GoPixel Academy  ·  Acerca de  ·  Créditos  ·  Ayuda
```

### 6.3 Créditos y privacidad

- Texto en Acerca de: «Go Gopher original por **Renee French**; adaptación a pixel art. Revisar las condiciones de licencia y atribución de los recursos utilizados.» Enlazar a `https://go.dev/brand` y `https://creativecommons.org/licenses/by/4.0/` y conservar la atribución exigida.
- Aclarar que GoPixel Academy es un proyecto educativo independiente, no oficial de Go/Google.
- «Privacidad local» explica que progreso y borradores permanecen **en este navegador**, se pierden al borrar datos y se pueden exportar/importar opcionalmente.
- La palabra `localStorage` aparece en Ajustes/Privacidad, no como badge decorativo.

---

## 7. Landing y botón START

### `WelcomeHero`

| Área | Diseño |
|---|---|
| Copy | H1 fuerte «Aprende Go construyendo desde cero hasta Senior». Subtítulo de dos líneas máximo. |
| Acción primaria | **▶ START** grande, cian, sombra escalonada pixel. Si ya hay progreso: **▶ CONTINUAR**. |
| Acción secundaria | `Ver temario` estilo outline, sin competir con START. |
| Arte | Go Gopher pixelado con portátil sobre isleta/paisaje simple. Responsive. |
| Beneficios | Tres tarjetas compactas: «Aprende haciendo», «Ejercicios», «Retos de producción». |
| Niveles | Cuatro cards: Básico, Intermedio, Avanzado y Senior Labs; color Go, distintivo oro para senior. |

### Estados de START

- `hover`: levitación 1 px, sombra pixel reforzada, sin salto de layout.
- `focus-visible`: anillo accesible.
- `pressed`: sombra se reduce y el botón baja 1 px.
- `loading` no necesario para navegación local; evitar spinner fingido.
- `onClick`: marcar `hasStarted` y abrir primera lección o última activa.

---

## 8. Sidebar, navegación y progreso

### `CourseSidebar`

- Ancho desktop: `248px` (rango práctico 232–260).
- Buscador con placeholder «Buscar lección»; filtra títulos y temas precargados.
- Secciones colapsables: **Básico**, **Intermedio**, **Avanzado**.
- Acceso separado destacado: **♛ Laboratorio Senior (18)**.
- Cada lección indica **sin empezar**, **en curso** o **completada** con icono y etiqueta accesibles.
- Barra de progreso global en la parte inferior de la navegación; sin porcentaje de «seniority».
- En Senior Lab: mostrar índice contextual `Contexto → Restricciones → Laboratorio → Pruebas → Revisión`.

### `ProgressMeter`

- Normal: porcentaje de lecciones completadas del trayecto seleccionado.
- Senior: número de retos completados sobre 18 módulos y módulos en curso; **sin certificación profesional automática**.
- Guardado automático al completar acciones verificadas, no con un botón de «Guardar».

### `LessonOutline` / panel derecho

- Ancho desktop: `304px` (280–320 px).
- Curso normal: «En esta lección», «Ejercicios 2/4», «Pista».
- Senior: «Objetivos», «Restricciones», «Casos de prueba», «Criterios de evaluación».
- En tablet/móvil se convierte en tabs o panel desplegable debajo del contenido.

---

## 9. Aula, lecciones y editor

### Orden visual de una lección

1. `LessonBreadcrumb` — «Básico / Concurrencia / Goroutines».
2. `LessonHeader` — título, duración aproximada si existe dato real, meta de aprendizaje.
3. `ConceptExplanation` — explicación corta, uno o dos ejemplos.
4. `PixelConceptCard` — animación o diagrama pedagógico (channels, scheduler, slices).
5. `GoCodeEditor` — pestañas `main.go`, editor CodeMirror con números de línea.
6. `EditorToolbar` — `Ejecutar`, `Probar`, `Reiniciar`, `Pista`, `Ver solución` (según ejercicio).
7. `OutputConsole` — stdout, stderr, diagnósticos y estado real.
8. `TestResultsPanel` — pruebas disponibles con aprobado/fallo/no disponible.
9. `ExercisePanel` — objetivos y checklist.
10. `LessonNavigation` — Anterior / Siguiente.

### Editor

- `min-height`: 300–360 px; foco visible, tabulación usable, tamaño fuente ajustable desde ajustes si es viable.
- Barra superior con pestañas de archivo y acción `Copiar código`.
- Syntax highlighting separado del tema general (ambos con contraste).
- `Ejecución no disponible` es un estado válido y explícito; no inventar terminal verde si no hubo ejecución.
- Se guarda el borrador del código por `lessonId` + `exerciseId` + modo.

### Estados reales de ejecución

| Estado | Visual | Acción |
|---|---|---|
| `idle` | Consola con «Ejecuta el código para ver el resultado». | Ejecutar habilitado si hay motor. |
| `running` | Indicador discreto, botón temporalmente deshabilitado. | Cancelar trabajo si hay worker cancelable. |
| `passed` | Check verde con pruebas que realmente pasaron. | Desbloquear siguiente ejercicio. |
| `failed` | Error con línea y explicación cuando esté disponible. | Permitir editar/reintentar. |
| `unavailable` | Info/advertencia: compatibilidad no soportada. | Ofrecer laboratorio guiado o salida a Go local. |

### Políticas para controles

- **Ejecutar**: corre el código actual con el runtime disponible, sin mocks que aparenten ser ejecución.
- **Probar**: ejecuta únicamente tests soportados; señala qué pruebas no se pueden ejecutar.
- **Pista**: niveles progresivos (orientación → API relevante → fragmento de apoyo).
- **Ver solución**: confirma si el usuario quiere verla y no marca la prueba como aprobada.
- **Reiniciar**: restaura el código inicial solo del reto actual tras confirmación si hay cambios.
- **Formatear**: mostrar solo si está disponible un formateador real compatible.

---

## 10. Senior Mode: comportamiento y pantallas

### Dos superficies distintas y compatibles

**A. Modo Senior transversal**: `seniorModeEnabled = true`. En lecciones compatibles cambia la profundidad: aparecen un **brief realista**, restricciones, objetivos verificables y una sección de trade-offs. Mantiene ruta, tema y progreso normal; borrador senior independiente.

**B. Laboratorio Senior**: ruta `/#/senior`, con **18 módulos especializados** y proyectos autónomos de producción. Accesible incluso si el toggle está OFF, y al entrar puede activar visualmente el contexto Senior de esa sección.

### `SeniorDashboardPage`

**Parte superior:** icono corona + título «Laboratorio Senior», subtítulo «Diseña, analiza y depura sistemas Go en producción». Gopher pixelado con corona discreta y diagrama de arquitectura como arte lateral.

**Debajo:** filtros por dominio (`Todos`, `Arquitectura`, `Concurrencia`, `Distribuidos`, `Seguridad`, `Operación`, `Liderazgo`). Grid de tarjetas de módulos; cada tarjeta incluye código `S05`, título, 2 conceptos, progreso, tipo de práctica y CTA `Entrar al laboratorio`.

**Sección inferior:** «Reto recomendado» basado en progreso, sin algoritmos de recomendación remotos; «Tus últimas prácticas» si hay borradores, y proyecto final S18.

### `SeniorModulePage`

1. Encabezado `S05 — Concurrencia de producción`.
2. Objetivos concretos y prerrequisitos.
3. Explicación avanzada dividida en unidades cortas.
4. Visualizaciones de arquitectura (diagramas interactivos si procede).
5. Tarjetas de 2–5 ejercicios del módulo.
6. Botón `Abrir desafío` y estado «en curso»/«completado».

### `SeniorLabPage`: secuencia obligatoria

1. **Contexto de producción** — qué sistema existe y qué falla.
2. **Objetivos verificables** — criterios observables y restricciones.
3. **Diagrama de arquitectura** — componentes, colas, flujos y puntos de fallo.
4. **Código/simulador** — parte ejecutable o simulación pedagógica claramente marcada.
5. **Pruebas** — casos estándar y extremos disponibles.
6. **Razonamiento arquitectónico** — campo de texto editable para trade-offs.
7. **Evaluación** — separar resultados automáticos de rúbrica autoevaluada/manual.
8. **Retroalimentación** — sugerencias específicas y siguiente desafío.

### Reglas de evaluación

- Mostrar «Pruebas automáticas: 7/8» **solo si verdaderamente se ejecutaron**.
- Mostrar «Revisión arquitectónica: pendiente de autoevaluación» si no existe revisor real.
- No convertir la autovaloración de un diseño en una puntuación automática supuestamente objetiva.
- Acreditar el nivel educativo completado, **no afirmar que se es ingeniero senior** por completar el curso.

---

## 11. Catálogo exhaustivo de componentes Senior

> **Inventario implementable.** Primero construir los componentes principales y añadir los específicos cuando el módulo los necesite.

### 11.1 Navegación e identidad

| Componente | Apariencia | Interacción / datos |
|---|---|---|
| `SeniorModeToggle` | Corona dorada pequeña + interruptor Go cyan. | ON/OFF; conserva borradores por modo. |
| `SeniorBadge` | Chip `♛ Reto Senior` con borde dorado fino. | Informativo, sin efecto en tema. |
| `SeniorHero` | Heading + Gopher con corona + cuadrícula pixel sutil. | CTA «Explorar 18 laboratorios». |
| `SeniorModuleCard` | Tarjeta con ID S01…S18, categoría, resumen y progreso. | Abre módulo. |
| `SeniorModuleFilters` | Chips/filtros por dominio. | Filtrado local sin recargar. |
| `SeniorLabBreadcrumb` | `Senior / S05 / Worker Pool`. | Volver a módulo y dashboard. |
| `SeniorStepNavigator` | Cinco etapas: contexto, solución, pruebas, decisiones, revisión. | Cambia pestaña/sección; mantiene scroll/accesibilidad. |

### 11.2 Contexto y requisitos

| Componente | Apariencia | Interacción / datos |
|---|---|---|
| `ProductionBrief` | Tarjeta principal con icono servidor + escenario. | Describe síntomas, audiencia y entorno ficticio. |
| `RequirementsPanel` | Lista de metas con prioridad. | Lectura; checks solo si hay validación. |
| `ConstraintsList` | Lista con símbolos `!` y cifras del escenario. | Presenta límites de memoria, latencia, disponibilidad **como requisitos**, no mediciones. |
| `ArchitectureDiagram` | SVG/canvas de cajas, conexiones y colas. | Hover/foco revela explicación; estado de fallo visible. |
| `FailureScenarioCard` | Tarjeta de incidente: servicio caído, cola llena, timeout. | Elige escenario de simulación. |
| `HintDrawerSenior` | Drawer de pistas avanzadas con Gopher pensando. | Revelación escalonada con confirmación. |

### 11.3 Código, tests y simulación

| Componente | Apariencia | Interacción / datos |
|---|---|---|
| `SeniorCodeWorkspace` | Editor amplio, pestañas por archivo si el runtime lo soporta. | Editar, restaurar, copiar; guardar borrador automáticamente. |
| `SeniorEditorToolbar` | `Ejecutar` `Probar` `Reiniciar` `Pista`. | Acciones verificables, estados de carga y errores. |
| `SeniorOutputConsole` | Terminal navy con logs reales o modo claramente rotulado «Simulación». | Expansible; copiar salida. |
| `SeniorTestMatrix` | Tabla con caso, resultado, comentario. | Solo marca PASS cuando hubo test real. |
| `SimulationControlPanel` | Sliders/toggles para workers, cola, timeout, fallos. | Ejecuta simulación **educativa**, no benchmark Go. |
| `ScenarioTimeline` | Línea temporal pixel minimal de eventos. | Selección de eventos y descripción. |
| `BenchmarkPanel` | Gráficos/comparación de métricas. | Real solo con motor adecuado; en modo demo poner `Datos de ejemplo`. |
| `RuntimeCapabilityNotice` | Aviso compacto de compatibilidad. | Indica `Ejecutable`, `Simulado` o `Laboratorio externo`. |

### 11.4 Arquitectura, revisión y feedback

| Componente | Apariencia | Interacción / datos |
|---|---|---|
| `TradeoffEditor` | Campo multilínea: «¿Por qué elegiste esta solución?». | Guardado local por reto. |
| `DecisionChecklist` | Checklist sobre costo, complejidad, fiabilidad y mantenimiento. | Autoevaluación con explicación, sin «aprobado» automático. |
| `ArchitectureNotes` | Caja de nota discreta con ícono de diagramas. | Recomendaciones técnicas contextualizadas. |
| `ReviewRubric` | Matriz con dimensiones y evidencias. | Separa verificado/autoevaluado/no evaluado. |
| `ReviewFeedback` | Resumen de pruebas, observaciones y próximos pasos. | No inventa resultado de pruebas. |
| `SeniorCompletionCard` | Trofeo pixel + logros del laboratorio. | Aparece tras cumplir requisitos comprobables. |
| `SeniorMilestoneMap` | Ruta visual con 18 puntos/módulos. | Navegación y progreso real local. |

### 11.5 Popovers, diálogo y estados

| Componente | Apariencia | Cuándo aparece |
|---|---|---|
| `ConfirmResetDialog` | Modal con «Cancelar»/«Restablecer». | Si el usuario reinicia un borrador modificado. |
| `RevealSolutionDialog` | Advertencia «Ver solución no cuenta como aprobado». | Antes de mostrar la solución. |
| `OfflineRuntimeNotice` | Aviso informativo visible sin bloquear. | Motor WASM sin cargar o ejercicio no compatible. |
| `NoProgressEmptyState` | Gopher con mapa y CTA «Empezar laboratorio». | Primera visita. |
| `ExercisePassedState` | Gopher celebrando y check breve. | Tests verificables completados. |
| `ExerciseFailedState` | Mensaje preciso, línea de error si disponible. | Compilación/test fallido. |
| `ReducedMotionVariant` | Poses estáticas, sin animación continua. | `prefers-reduced-motion`. |

---

## 12. Diseño de los 18 módulos Senior

Cada módulo aparece como una `SeniorModuleCard`; al abrirlo emplea `SeniorModulePage` y uno o varios `SeniorLabPage`.

| ID | Módulo | Icono / visual pixel | Reto representativo | Modalidad preferida |
|---|---|---|---|---|
| S01 | Ingeniería idiomática Go | Llaves `{}` + gopher revisor | Refactorizar código sin romper tests. | Código + revisión. |
| S02 | Arquitectura modular | Bloques unidos | Separar capas y dependencias. | Diagrama + decisión. |
| S03 | Diseño de APIs | Flechas HTTP | Idempotencia y contratos. | Simulación + casos. |
| S04 | Modelado de dominio | Cubos/entidades | Invariantes de pedidos. | Diseño + tests. |
| S05 | Concurrencia de producción | Gophers como workers | Worker pool con cancelación/backpressure. | Código compatible + simulación. |
| S06 | Memory model | Candado + memoria | Corregir carreras y publicación de datos. | Análisis + laboratorio externo si requiere race detector. |
| S07 | Runtime, GC y memoria | Chips de memoria | Diagnóstico de allocaciones y fugas. | Análisis de perfiles + externo. |
| S08 | Performance engineering | Gráfico + cronómetro | Interpretar benchmarks y trade-offs. | Datos etiquetados + externo. |
| S09 | Sistemas distribuidos | Servidores enlazados | Reintentos, duplicados y mensajes. | Simulación interactiva. |
| S10 | Datos y consistencia | Base de datos pixel | Evitar overselling de inventario. | Simulación + diseño. |
| S11 | Resiliencia | Escudo | Circuit breaker / caída parcial. | Incident simulator. |
| S12 | Seguridad | Candado | Auditoría de una API vulnerable. | Code review + escenarios. |
| S13 | Testing avanzado | Tubos de ensayo | Identificar flaky tests y casos extremos. | Código + laboratorio externo. |
| S14 | Observabilidad | Lupa sobre logs | Investigar latencia p99. | Trazas/metrics ficticias etiquetadas. |
| S15 | Despliegue y operación | Cohete/control | Rollout, rollback y shutdown. | Simulación + externo. |
| S16 | Mantenimiento | Llave inglesa | Migrar una librería manteniendo compatibilidad. | Decisiones + tests. |
| S17 | Liderazgo técnico | Diálogo + PR | Revisar RFC y justificar trade-offs. | Documentación/revisión. |
| S18 | System Design Final | Castillo de bloques/arquitectura | Diseñar plataforma distribuida completa. | Proyecto de varias etapas. |

**Color de estado por tarjeta:** sin empezar (neutro), en curso (cian), completado (verde); dificultad Senior se marca con corona oro, no con rojo. Progreso sin promesas profesionales engañosas.

---

## 13. Contratos de estado y datos

### 13.1 Preferencias y navegación

```ts
export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export type LearningTrack = 'basico' | 'intermedio' | 'avanzado';
export type ExerciseMode = 'executable' | 'simulation' | 'external-lab';
export type RunStatus = 'idle' | 'running' | 'passed' | 'failed' | 'unavailable';

export interface UIState {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  seniorModeEnabled: boolean;
  activeTrack: LearningTrack;
  activeLessonId: string | null;
  activeExerciseId: string | null;
  sidebarOpen: boolean;
  runStatus: RunStatus;
}
```

### 13.2 Datos de un reto Senior

```ts
export interface SeniorChallenge {
  id: string;
  moduleId: string; // p. ej. 's05-concurrencia-produccion'
  title: string;
  category: 'arquitectura' | 'concurrencia' | 'distribuidos' |
    'seguridad' | 'operacion' | 'liderazgo';
  executionMode: ExerciseMode;
  situation: string;
  objectives: string[];
  constraints: string[];
  initialFiles?: Record<string, string>;
  testCaseIds?: string[];
  rubric: Array<{
    id: string;
    label: string;
    evaluation: 'automated' | 'self-review' | 'external';
    weight?: number;
  }>;
}
```

### 13.3 Persistencia

```ts
export interface LocalAcademyData {
  schemaVersion: 1;
  preferences: {
    theme: ThemePreference;
    seniorModeEnabled: boolean;
  };
  lastLessonId?: string;
  completedLessonIds: string[];
  completedSeniorChallengeIds: string[];
  drafts: Record<string, string>;       // key = `normal:<exerciseId>`
  seniorDrafts: Record<string, string>; // key = `senior:<challengeId>`
  seniorNotes: Record<string, string>;
}
```

**Política**: `localStorage` solo almacena datos de usuario no secretos, con validación de esquema y migraciones; exportar/importar JSON desde Ajustes. La app reconoce que la eliminación del almacenamiento del navegador elimina el progreso. No guardar código o texto sin sanitizar en `innerHTML`.

---

## 14. Variables y CSS de referencia

```css
:root {
  --go-blue: #00add8;
  --go-light: #5dc9e2;
  --go-aqua: #00a29c;
  --go-deep: #00758d;
  --pixel-gold: #f4c95d;
  --success: #25b68a;
  --danger: #e55e72;
  --pixel-unit: 4px;
  --header-h: 64px;
  --sidebar-w: 248px;
  --aside-w: 304px;
  --radius-panel: 16px;
  --radius-control: 10px;
}

:root,
[data-theme='light'] {
  color-scheme: light;
  --bg-canvas: #f4fafe;
  --bg-surface: #ffffff;
  --bg-raised: #eaf7fd;
  --text-primary: #10263b;
  --text-muted: #527082;
  --border: #c8e2ec;
  --editor-bg: #f7fbfe;
  --console-bg: #112333;
  --accent: #007e9e;
  --accent-contrast: #ffffff;
  --senior-accent: #ad7917;
  --senior-surface: #fff7e4;
}

[data-theme='dark'] {
  color-scheme: dark;
  --bg-canvas: #091522;
  --bg-surface: #102235;
  --bg-raised: #172d43;
  --text-primary: #ecf8fd;
  --text-muted: #9db8c8;
  --border: #2b4d61;
  --editor-bg: #0b1b2b;
  --console-bg: #06111d;
  --accent: #35cae8;
  --accent-contrast: #06202c;
  --senior-accent: #f4c95d;
  --senior-surface: #322d24;
}

/* Senior Mode no reemplaza ni sobreescribe el tema. */
[data-senior='true'] .senior-badge {
  border: 1px solid var(--senior-accent);
  background: var(--senior-surface);
  color: var(--senior-accent);
}

body {
  margin: 0;
  background: var(--bg-canvas);
  color: var(--text-primary);
  font-family: Inter, system-ui, sans-serif;
}

.ui-panel {
  border: 1px solid var(--border);
  border-radius: var(--radius-panel);
  background: var(--bg-surface);
}

.pixel-sprite { image-rendering: pixelated; }

:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

### Regla de estados independientes

```html
<!-- Ejemplo conceptual: tema oscuro + Senior activo -->
<html data-theme="dark" data-senior="true">
```

Cuatro combinaciones a probar: **Light/Normal**, **Dark/Normal**, **Light/Senior**, **Dark/Senior**.

---

## 15. Diseño responsive

| Ancho | Header | Navegación | Contenido | Ejercicios/Senior |
|---|---|---|---|---|
| ≥1280 px | 64px, acciones completas | Sidebar 248px | Principal flexible | Panel contextual 304px. |
| 900–1279 px | 64px | Sidebar reducida | Editor principal | Panel inferior del editor. |
| 640–899 px | 56–64px | Drawer con menú | Una columna | Tabs «Contenido / Ejercicios / Evaluación». |
| <640 px | 56px, logo compacto | Drawer | Lección y editor apilados | Paneles colapsables, controles ≥44×44. |

### Senior Lab en móvil

```text
┌─────────────────────────────────┐
│ [☰] GoPixel     [☾] [♛]         │
├─────────────────────────────────┤
│ ♛ S05 · Worker Pool             │
│ Reto de producción              │
│ [Contexto] [Código] [Pruebas]   │
│                                 │
│ [Brief / restricciones]         │
│                                 │
│ [Código editable con scroll     │
│  horizontal INTERNO]            │
│                                 │
│ [▶ Ejecutar] [✓ Probar]         │
│ [Salida]                        │
│ [Razonamiento arquitectónico]   │
│ [Revisar solución]              │
├─────────────────────────────────┤
│ Footer mínimo                   │
└─────────────────────────────────┘
```

**No** permitir scroll horizontal del documento completo. El editor puede tener scroll interno horizontal. El menú y los tab-panes deben funcionar con teclado y lectores de pantalla.

---

## 16. Accesibilidad, estados y microinteracciones

### Botones globales

| Variante | Apariencia | Uso |
|---|---|---|
| `primary` | Relleno Go cyan, texto con contraste, leve sombra 3px. | START, Ejecutar, Continuar. |
| `secondary` | Superficie elevada, borde 1px. | Reiniciar, Copiar. |
| `ghost` | Fondo transparente y hover claro. | Pista, cerrar panel, volver. |
| `senior` | Control sobrio con corona dorada y acento cian. | Activar modo, revisar reto. |
| `danger` | Contorno/aviso rojo moderado. | Borrar progreso (en Ajustes). |

Estados obligatorios: `default`, `hover`, `pressed`, `focus-visible`, `disabled`, `running/loading`, `success`, `error`. **No utilizar color como único indicador de estado.**

### Animaciones

- Gopher parpadea suavemente en la bienvenida (pocas veces, no bucle agresivo).
- START: movimiento de 1px y sombra escalonada.
- Senior ON: corona hace *bounce* una vez y aparece una tarjeta contextual.
- Test aprobado: check breve + gopher celebrando si no interrumpe trabajo.
- Cambio de tema: 160–220ms; no parpadeo de tema contrario antes de hidratar.
- `prefers-reduced-motion`: todos los movimientos no esenciales se apagan.

### Accesibilidad

- Cumplir WCAG AA donde sea viable (contraste, foco, semántica).
- Iconos sin texto → `aria-label` y tooltip claro.
- `SeniorModeToggle` → `aria-pressed`/`role="switch"` con estado anunciado.
- Editor → nombre accesible; consola → `aria-live="polite"` con límites para no anunciar spam.
- Diagrama interactivo → alternativa en texto que describe el mismo razonamiento.
- No colocar pixel font en párrafos, ejercicios o código.

---

## 17. Assets pixelados del Go Gopher

**La mascota**: Go Gopher reconocible, pixel art moderno, rostro azul cian, ojos blancos grandes, dientes, outline navy, sombras de pocos colores y luz consistente desde arriba-izquierda. Es una **adaptación pixelada** del personaje original; mantener licencia y atribución correctas.

| Asset | Uso | Base recomendada |
|---|---|---|
| `gopher-idle.png` | Logo mini / vacío | 64×64 px |
| `gopher-coding.png` | Hero y editor | 64×64 px, export escalado x4 |
| `gopher-thinking.png` | Pistas | 64×64 px |
| `gopher-senior.png` | Senior Dashboard, corona | 64×64 px |
| `gopher-success.png` | Test superado | 64×64 px |
| `gopher-loading-sheet.png` | Espera de ejecución | 4 a 8 frames uniformes |
| `lesson-goroutines.png` | Explicación de concurrency | 320×180 px |
| `lesson-channels.png` | Channels y buffers | 320×180 px |
| `lesson-memory.png` | Runtime y GC | 320×180 px |
| `hero-day.png` / `hero-night.png` | Fondo opcional landing | 480×270 px |
| `pixel-crown.png` | Badge senior | 32×32 px |

**Pipeline:** dibujar/obtener autorización → exportar sprites RGBA transparentes → optimizar PNG/WEBP sin suavizar píxeles → usar nearest-neighbor → verificar con fondo claro/oscuro → atribuir al Gopher original y describir los cambios.

**No** pegar logos de Go/Google como marca del producto. GoPixel Academy tiene wordmark propio y mascota usada con atribución.

---

## 18. Arquitectura de componentes y archivos

```text
gopixel-academy/
├── .agents/skills/
│   ├── gopixel-academy-ui/
│   ├── gopher-pixel-assets/
│   ├── senior-mode-engine/
│   ├── ui-design-system/
│   ├── ux-web-experience/
│   ├── ui-interaction-motion/
│   ├── web-mfe-technologies/
│   └── vigilio-auto-senior/
├── .github/workflows/deploy-pages.yml
├── public/
│   ├── sprites/
│   ├── backgrounds/
│   └── wasm/                    # Solo tras validar runtime
├── src/
│   ├── app/
│   │   ├── app.tsx
│   │   ├── router.tsx
│   │   ├── app-shell.tsx
│   │   └── components/
│   │       ├── top-header.tsx
│   │       ├── app-footer.tsx
│   │       └── mobile-nav.tsx
│   ├── design-system/
│   │   ├── tokens/
│   │   │   ├── primitives.css
│   │   │   ├── themes.css
│   │   │   └── senior.css
│   │   └── pixel-effects.css
│   ├── shared/ui/
│   │   ├── pixel-button.tsx
│   │   ├── gopher-sprite.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── progress-meter.tsx
│   │   └── dialog.tsx
│   ├── features/
│   │   ├── welcome/
│   │   ├── learning/
│   │   ├── code-editor/
│   │   ├── exercises/
│   │   ├── senior-mode/
│   │   │   ├── pages/
│   │   │   │   ├── senior-dashboard-page.tsx
│   │   │   │   ├── senior-module-page.tsx
│   │   │   │   └── senior-lab-page.tsx
│   │   │   ├── components/
│   │   │   │   ├── senior-mode-toggle.tsx
│   │   │   │   ├── senior-hero.tsx
│   │   │   │   ├── senior-module-card.tsx
│   │   │   │   ├── production-brief.tsx
│   │   │   │   ├── constraints-list.tsx
│   │   │   │   ├── architecture-diagram.tsx
│   │   │   │   ├── senior-test-matrix.tsx
│   │   │   │   ├── tradeoff-editor.tsx
│   │   │   │   ├── review-rubric.tsx
│   │   │   │   └── incident-simulator.tsx
│   │   │   ├── model/senior-mode.signal.ts
│   │   │   ├── model/senior-challenge.types.ts
│   │   │   └── engine/
│   │   │       ├── grade-automatable-criteria.ts
│   │   │       └── simulate-incident.ts
│   │   ├── go-runtime/
│   │   ├── progress/
│   │   └── settings/
│   ├── content/
│   │   ├── curriculum-manifest.ts
│   │   ├── tracks/
│   │   │   ├── basico/
│   │   │   ├── intermedio/
│   │   │   ├── avanzado/
│   │   │   └── senior/
│   │   │       ├── s01-go-idiomatico/
│   │   │       ├── s02-arquitectura-modular/
│   │   │       ├── .../
│   │   │       └── s18-system-design-final/
│   │   └── scenarios/
│   └── main.tsx
├── e2e/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Organización del código

- `src/app`: layout, header, footer, router y shell global.
- `src/design-system`: variables de temas y componentes visuales comunes.
- `src/shared/ui`: solo componentes realmente reutilizados por al menos dos features.
- `src/features/senior-mode`: lógica y presentación del modo senior; no contiene textos completos de todas las clases.
- `src/content/tracks/senior`: datos de los 18 módulos (contenido y rúbricas).
- `src/features/go-runtime`: adaptador intercambiable a la ejecución de Go y Web Worker.
- `src/features/progress`: Signals + repositorio localStorage con esquema versionado.
- Tests adyacentes `*.test.ts(x)`; E2E de navegación y temas en `e2e/`.

---

## 19. Reglas reales del entorno Go

Es fundamental distinguir **el aspecto de un compilador** de **la capacidad de ejecutar Go completamente**:

- El editor CodeMirror funciona totalmente en frontend; su existencia **no** implica compilación.
- Un runtime Yaegi/WASM podría admitir ciertos ejercicios, pero **no es la toolchain oficial** y debe probarse con una matriz de características antes de prometer su soporte.
- En `src/features/go-runtime/model/capabilities.ts` definir por ejercicio si se admite `executable`, `simulation` o `external-lab`.
- Ejecutar el intérprete en un Web Worker si es compatible. Evaluar límites de tiempo y recuperación de worker ante bucles infinitos.
- `go test -race`, `pprof` nativo, Docker, Kubernetes, PostgreSQL real y benchmarks nativos **no** se ejecutan automáticamente en GitHub Pages: ofrecer análisis y laboratorios guiados externos.
- En gráficas, usar el sello **«Datos simulados»** o **«Ejemplo educativo»** cuando no sean métricas reales del código del estudiante.
- No llamar «compilador oficial completo» al runtime hasta que exista realmente esa capacidad.

---

## 20. Checklist de aceptación

### Identidad y diseño

- [ ] Landing con botón START protagonista y Gopher oficial adaptado a pixel art.
- [ ] Modern Pixel: UI limpia, editor legible, decoración no intrusiva.
- [ ] Combinaciones Light/Normal, Dark/Normal, Light/Senior y Dark/Senior revisadas.
- [ ] No existe chip/botón/etiqueta permanente de `localStorage` en header, aula o footer.
- [ ] Header, sidebar, footer y navegación móvil consistentes.
- [ ] Gopher y créditos con atribución correspondiente.

### Funcionalidad

- [ ] START abre la primera lección; CONTINUAR vuelve al progreso real.
- [ ] Senior toggle modifica ejercicios/criterios cuando el contenido existe.
- [ ] Senior dashboard incluye 18 módulos claramente identificados.
- [ ] Borrador senior y normal no se sobrescriben mutuamente.
- [ ] Código y notas se guardan automáticamente y se restauran tras refrescar.
- [ ] Botones Ejecutar/Probar dan resultados reales o estado `unavailable` honesto.
- [ ] Tests no ejecutados no aparecen como aprobados.
- [ ] Simulaciones están identificadas y no se presentan como benchmarks reales.
- [ ] Ajustes ofrece exportación/importación/restablecimiento opcional del progreso.

### Calidad frontend

- [ ] Funciona como SPA estática en GitHub Pages, incluyendo refrescos de rutas hash.
- [ ] Layout responsive desde móvil hasta desktop 3 columnas.
- [ ] `focus-visible`, etiquetas accesibles, navegación por teclado y WCAG AA objetivo.
- [ ] `prefers-reduced-motion` sin animaciones innecesarias.
- [ ] Vitest valida estado/persistencia/evaluación, Playwright valida START, temas, Senior y refresh.
- [ ] Render sin consola de errores y sin dependencias de backend ocultas.

---

## Resultado esperado

**GoPixel Academy** se verá como una **academia profesional de Go con alma de videojuego pixel art**: Gopher protagonista en la bienvenida, header minimal, sidebar de niveles, editor tipo IDE, ejercicios y tests claros, dark/light impecables y un **Senior Mode** con 18 módulos, briefs realistas, diagramas, simuladores, trade-offs y rúbricas transparentes. Todo servido desde GitHub Pages con estado local y sin servidor propio.

**Material visual base:** `gopixel-academy-skill/assets/reference/gopixel-modern-concept.png` y documentos `DESIGN_SYSTEM.md`, `SCREENS_AND_COMPONENTS.md`, `SENIOR_MODE.md`, `PIXEL_ART_ASSETS.md` del Super Skill previo.
