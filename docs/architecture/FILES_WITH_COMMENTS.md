# Árbol de arquitectura objetivo — responsabilidades

```text
gopixel-academy/
├── .agents/skills/                       # Guías y contratos de agentes, incluidas skills Vigilio
├── .github/workflows/                    # CI, auditoría y despliegue Pages
├── docs/architecture/                    # Contratos, rutas y dependencias
├── docs/devsecops/                       # Riesgos, controles y gates
├── docs/content/                         # Currículo y límites educativos
├── docs/design/                          # Tokens, assets y UX responsive
├── public/assets/gophers/                # 12 poses del Go Gopher en PNG optimizado
├── public/assets/icons/                  # Iconos vectoriales y raster
├── public/assets/badges/                 # Recompensas pixel art
├── public/assets/backgrounds/            # Paisajes dark/light/senior
├── src/app/App.tsx                       # Shell + navegación y páginas del scaffold actual
├── src/data/curriculum.json              # 62 módulos/rutas con 6 idiomas; catálogo, no cursos acabados
├── src/i18n/{es,en,ja,zh,pt,fr}.json     # Diccionarios UI; contenido largo en desarrollo
├── src/features/editor/go-runner.ts      # Contrato de validación didáctica, NO Go WASM
├── src/features/progress/storage.ts      # Persistencia local
├── src/styles/app.css                    # Diseño responsive, light/dark, acentos pixel
├── tests/*.test.mjs                      # Tests de contenido y demo offline
├── scripts/audit-assets.mjs              # Validación referencial de datos y recursos
├── demo-offline.html                     # Vista previa funcional sin npm, no equivalente a Preact
├── index.html                            # Entry HTML Vite
├── package.json                          # Scripts y dependencias declaradas
├── vite.config.ts                        # Base GitHub Pages configurable
└── README.md                             # Instrucciones y limitaciones
```

**Arquitectura objetivo de expansión:** módulos desacoplados para `learning`, `exercises`, `games`, `senior`, `frameworks`, `editor`, `go-runtime` y `progress`, con páginas TSX propias, tests por feature y contenido por módulo/idioma. Evitar carpetas vacías que se anuncien como implementaciones. El scaffold usa un App monolítico; dividirlo es trabajo pendiente.
