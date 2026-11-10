# Modelo de amenazas — GoPixel Academy

| Activo | Riesgo | Mitigación | Pendiente |
|---|---|---|---|
| Borradores y notas en localStorage | Otros usuarios del mismo navegador pueden leerlos; borrado del navegador | Advertencia visible, borrado y exportación manual; no almacenar secretos | No hay cifrado, ni sincronización entre dispositivos |
| Progreso importado | JSON gigante o malformado, contaminación de tipos | Límite de tamaño, validación estricta y saneamiento de campos | Fuzzing externo no verificado |
| Texto de lecciones | XSS si se usa HTML no fiable | Renderizado Preact con texto escapado; evitar `dangerouslySetInnerHTML` | Análisis SAST completo pendiente |
| Assets | Recurso modificado en cadena de suministro | Dependencias declaradas, revisiones CI y hashes SHA256 del paquete | Build y lockfile pendientes si no hay npm |
| Runtime Go en navegador | Bucle infinito, consumo de CPU, acceso a capacidades del entorno | No ejecutar Go arbitrario mientras no exista sandbox WASM validado; futuro Worker con límites | Integración Go WASM pendiente |
| CI GitHub Actions | Dependencias comprometidas, token de despliegue | Permisos mínimos, separación de job build/deploy, acciones verificadas | Pinning a SHA, revisión Dependabot pendiente |
| GitHub Pages | Rutas internas 404 o permisos incorrectos | Navegación hash, `base` configurable y build | Smoke en GitHub Pages real pendiente |

Sin backend, sin autenticación y sin secretos. La plataforma NO debe pedir contraseñas ni almacenar tokens.
