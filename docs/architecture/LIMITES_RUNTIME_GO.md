# Ejecución de Go — límites técnicos reales

**Este ZIP NO incluye un compilador ni un intérprete WASM Go real.**

El editor de muestra comprueba patrones de texto en cinco ejercicios básicos. No hay garantía de compilación, semántica o seguridad derivada de esas comprobaciones. No presentar esos resultados como `go test`, `go run` ni como benchmarks.

## Plan de integración

1. Evaluar en el navegador un intérprete/compilador compatible con las features necesarias (p. ej., Yaegi en WASM, sujeto a investigación y tests).
2. Ejecutar cualquier intérprete en Web Worker para evitar bloquear la UI, con timeout, cancelación y límites de memoria; validar aislamiento apropiado para el motor elegido.
3. Definir capacidades por ejercicio: `runnable`, `simulated`, `external`. Mostrar el modo de ejecución explícitamente.
4. Probar semántica real de `fmt`, slices, maps, interfaces, goroutines, channels, `context`, testing y dependencias antes de abrir módulos.
5. Para Gin, Chi, Echo, Fiber, SQL, Docker, Kubernetes, gRPC, `pprof`, race detector y test de carga usar simulaciones claramente rotuladas o repos de laboratorio descargables.
6. Publicar matriz de compatibilidad del runtime por versión y documentar su licencia.

**Nunca** permitir que un iframe externo o una API gratuita de ejecución remota se haga pasar por ejecución local sin informar al estudiante. GitHub Pages hospeda archivos estáticos; no ofrece un servidor Go.
