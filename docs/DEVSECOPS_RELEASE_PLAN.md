# Plan DevSecOps de GoPixel Academy

## Pipeline
PR -> `npm ci` -> contenido/recursos -> typecheck/build -> `npm audit` -> aprobación -> deploy Pages desde main.

## Controles de seguridad
- No se necesitan APIs ni secretos, y la app no envía progreso a servidores.
- Backup local: saneamiento de tipos/IDs, topes de tamaño y límites de notas.
- Evitar `eval` y HTML inyectado; CSP limitada en Github Pages; revisar políticas de imagen, worker y WASM cuando se introduzcan.
- `Dependabot` para npm y GitHub Actions.
- Antes de liberar: lockfile reproducible, auditoría de dependencias, pin de acciones por SHA y SAST con resultados reales.

## Calidad
- Uso de teclado, contraste, responsive <= 360px, preferencias reduced motion.
- Scripts de CI por alcance; no confundir tests de datos con pruebas de navegador.
- Gate G6: ZIP extraído con comprobación de integridad y smoke sin dependencias.

## Alcance técnico actual
Esta base no implementa Go WASM real, ni toda la biblioteca de cursos. Los pipelines para Pages están definidos pero el build no se certifica si npm no está disponible en el entorno de auditoría.
