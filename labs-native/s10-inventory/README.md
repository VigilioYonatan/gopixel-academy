# S10-INVENTORY — Reservas de stock sin sobreventa

## Objetivo
Investiga el diseño y el comportamiento real de este ejemplo de Go. Empieza leyendo las pruebas y la implementación; después modifica una copia para implementar una alternativa, explica sus invariantes y ejecuta `go test ./...` y `go test -race ./...`.

## Evidencia y validación
- `solution.go`: solución de referencia completa, no un compilador de navegador.
- `solution_test.go`: casos reproducibles y aserciones funcionales.
- Este laboratorio se ejecuta con el compilador oficial **en tu equipo**, no dentro de GitHub Pages.

## Preguntas Senior
1. ¿Qué invariantes garantizan las pruebas?
2. ¿Qué fallo ocurre si se omite la validación de entradas?
3. ¿Qué métrica o prueba de carga añadirías antes de operar esto en producción?
4. ¿Cómo justificarías una implementación alternativa mediante un ADR?
