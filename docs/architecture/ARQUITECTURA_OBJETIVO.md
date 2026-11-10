# Arquitectura de destino — GoPixel Academy

**Fuente de criterios:** arquitectura Vigilio aportada por el usuario. Adaptación a sitio estático: un solo build de Preact, sin API, microfrontends ni AWS.

```text
gopixel-academy/
├── .agents/skills/          # Skills especializados
├── .github/workflows/      # GitHub Pages
├── docs/{architecture,content,design,i18n}/
├── public/assets/
│   ├── gophers/             # 12 sprites PNG
│   ├── icons/               # 29 SVG + PNG
│   ├── badges/              # 6 SVG + PNG
│   └── backgrounds/         # paisajes + mockups
├── src/
│   ├── app/                 # App shell + router por hash
│   ├── components/          # header, footer, botones reutilizables (refactor futuro)
│   ├── data/curriculum.json # 62 fichas traducidas
│   ├── i18n/{es,en,ja,zh,pt,fr}.json
│   ├── features/
│   │   ├── learning/        # aulas/lecciones
│   │   ├── games/           # cinco minijuegos ligeros
│   │   ├── editor/          # editor y adapter runner
│   │   ├── senior/          # briefs y autoevaluación
│   │   ├── frameworks/      # fichas backend
│   │   ├── progress/        # localStorage
│   │   └── settings/        # export/import y preferencias
│   └── styles/app.css       # tokens + responsive
├── demo-offline.html        # vista previa autocontenida
├── vite.config.ts           # base GitHub Pages
└── package.json
```

## Fase actual y refactor

La demo Preact se concentra en `src/app/App.tsx` para facilitar portabilidad y revisión del prototipo. **Antes de escalar el contenido** extraer componentes a sus features propietarias. Las carpetas de features ya muestran la arquitectura objetivo; no debe interpretarse que contienen todo el sistema implementado.

### Separación de responsabilidades recomendada

1. UI/render no conoce decisiones de persistencia; usa hooks/proveedores.
2. `curriculum.json` es la fuente de verdad de cursos y status; contenido futuro por módulo en `content/tracks/...`.
3. `GoRunner` será una **interfaz**: `run({source,files,timeout}):Promise<Result>`; el adaptador WASM solo se implementará con un runtime validado.
4. El SDK de Go nativo no se empaqueta automáticamente en GitHub Pages. No ejecutar código no confiable sobre UI thread.
5. Senior Mode utiliza el editor estándar, nunca duplica editor y validadores.
6. Los retos de arquitectura se evalúan por rúbrica humana/autoevaluación, nunca fingir evaluación inteligente sin backend/IA.
7. Persistencia versionada (`gopixel:v1`) y export/import JSON; advertencia: borrar datos del navegador elimina progreso si no se exportó.

### Deployment

Vite `base=/gopixel-academy/` por defecto. GitHub Actions hace build estático. Rutas `/#/...` para que Pages no devuelva 404 en refresh.
