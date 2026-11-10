# Aplicación de Vigilio Docs a GoPixel v8

Se consultó `vigilio-docs/.compat/frontend-web-mfe/3-arquitectura-estructura-estado.md` del ZIP de referencia. Sus puntos aplicables son ownership por feature, separación de presentacional/lógica, estado dueño único, interfaces tipadas, tests adyacentes y build verificable. No se copian servidor remoto, TanStack Query, React Hook Form, AWS ni microfrontends porque GoPixel solo se publica como una SPA estática en GitHub Pages.

| Capa | Owner | Dependencia admitida |
|---|---|---|
| `src/app` | Router, header, import de preferencias | Features públicas y servicios locales |
| `src/features/senior` | Pantallas y lógica de los desafíos | Contenido + motores puros + design system |
| `src/content/senior` | Datos didácticos, versiones | JSON válido, sin dependencias React |
| `src/features/senior/engine` | Evaluación determinista y validación | JavaScript sin DOM ni localStorage |
| `labs-native` | Laboratorios Go ejecutables offline | Solo biblioteca estándar Go y tests Go |
| `public/downloads` | Snapshot de laboratorios distribuibles | Debe reproducirse al cambiar `labs-native/` |
| `tests` | Regresión y contratos | No sustituye el build ni pruebas de navegador de la SPA |

Estrategia: una sola aplicación Vite/Preact, sin duplicar layouts ni crear una app por módulo. El código nativo es un paquete educativo descargable, **no** un backend de GoPixel.
