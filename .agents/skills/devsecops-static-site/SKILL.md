---
name: devsecops-static-site
description: Endurece CI/CD, dependencias, auditoría de secretos, integridad de paquetes, CSP y release de una SPA estática GitHub Pages.
---
# DevSecOps estático
1. Sin credenciales ni env privadas en el cliente. Cualquier variable `VITE_*` es pública.
2. GitHub Actions con permisos mínimos, acciones de versiones estables, `npm ci`, tests y build antes de desplegar.
3. Dependencias fijadas mediante lockfile en cuanto pueda generarse en entorno con conectividad. Hasta entonces declarar release NO VERIFICADA.
4. Revisar CSP en `index.html`; evitar HTML no confiable y `eval`. Documentar límites de meta CSP en GitHub Pages.
5. Probar importación de progreso: tamaño máximo, esquema, tipos, entradas extrañas y ausencia de prototipos inseguros.
6. Ejecutar secret scanning, dep audit y rastreo de rutas de assets. No subir `node_modules`, secretos ni bundles de desarrollo.
7. Preferir reproducibilidad y archivos auditables a infraestructura innecesaria.
