# Vigilio Docs → GoPixel Academy Senior v6

Se consultaron los archivos de `vigilio-docs(6).zip`:
- `stacks/frontend/web-mfe/architecture/3-arquitectura-estructura-estado.md`
- `stacks/frontend/web-mfe/features/17-scaffold-app-feature.md`

**Aplicación concreta de las reglas**

1. Una SPA, no microfrontends: no existe independencia de despliegue o backend que justifique más aplicaciones.
2. `app/` posee el router y composición de features. `src/features/senior/` posee UI y evaluadores. `src/content/senior/` posee contenido educativo. `labs-native/` posee código Go descargable.
3. Motores JS/ESM puros con pruebas Node adyacentes, sin acceso al DOM ni a Preact; la UI nunca inventa evaluaciones.
4. `src/features/senior/NativeLabCatalog.tsx` reutiliza tokens CSS existentes, títulos localizados y rutas hash para GitHub Pages.
5. La introducción de HTTP services, TanStack Query, NestJS o microfrontends sería innecesaria; no se incluye.
6. `App.tsx` heredado es demasiado grande. La migración de rutas y estado a owners por feature sigue pendiente; no afirmar que la separación está terminada.
7. Preact Signals figura en dependencias; gran parte de la UI heredada aún usa `useState`. Migración gradual pendiente.
8. Gate DevSecOps: tests Node + Go con detector de carreras, build TS/Vite, E2E y ZIP limpio extraído. Sin npm, no aprobar el build.
