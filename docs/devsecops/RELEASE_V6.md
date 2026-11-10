# Release Gate — GoPixel Academy v6

## Seguridad y privacidad
- Aplicación estática en GitHub Pages; sin cuentas, contraseñas ni APIs privadas.
- Los datos de progreso se almacenan en `localStorage` del dispositivo. Exportarlos comparte contenido potencialmente personal: recomendar no publicarlos.
- Los ZIP descargables contienen solo código Go educativo y README, sin binarios ejecutables, secretos ni paquetes externos.
- Los laboratorios Go son **locales** y no se ejecutan desde la página (no usar eval remoto).
- No confundir `go test -race` con una auditoría de seguridad de producción.

## Controles reproducibles

```sh
npm run check:content
cd labs-native && go test ./... && go test -race ./... && go vet ./...
cd .. && npm ci && npm run build
```

El job `native-go-labs` de `.github/workflows/ci.yml` ejecutará los tests oficiales y `-race` con `actions/setup-go`. El job frontend requiere `package-lock.json`; **está bloqueado** hasta resolver dependencias npm.

## Pendientes P1 para release público
- Instalar npm en entorno con registro accesible, generar lockfile real, comprobar tipos y build.
- E2E/Playwright de rutas Senior, light/dark, navegación móvil y descarga.
- Integración Go WASM si se mantiene como requisito de compilador navegador.
- Localización de todo el texto educativo Senior en seis idiomas.
- Desarrollo completo de cursos y frameworks; no basta con catálogo.

## Conclusión
Se permite revisar la entrega como base avanzada auditada, pero **NO** etiquetarla como release de la plataforma completa ni subir a Pages como producto final aprobado.
