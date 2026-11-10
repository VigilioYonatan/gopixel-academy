---
name: go-native-senior-labs
description: Mantiene los 18 laboratorios Go nativos de Senior Mode, tests y descargas estáticas.
---
# Senior Go native labs

## Reglas Vigilio
- Owner: `labs-native/`; UI consumer: `src/features/senior/NativeLabCatalog.tsx`.
- Una feature de interfaz no conoce el código fuente interno de los otros labs.
- Cada ejercicio tiene implementación comprobable, test adyacente y README propio.
- Al editar un lab: ejecutar `cd labs-native && go test ./... && go test -race ./...`.
- Volver a generar `public/downloads/go-native-senior-labs.zip` al cambiar fuentes; comprobar que `manifest.json` coincide con el catálogo importado.
- Nunca anunciar ejecución Go en navegador. Los laboratorios requieren Go local.
- Los resultados locales web no afirman que un laboratorio nativo se completó: no hay verificación del ordenador del alumno.
- Mantener evaluaciones deterministas y no guardar datos de terceros o secretos.

## Security
La entrada de código proporcionado por estudiantes se ejecuta **solo en su máquina**. No pedir ejecutar código descargado en un servidor público. Evitar paquetes o comandos que requieran credenciales o acceso a red.
