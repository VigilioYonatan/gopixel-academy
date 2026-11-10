# GoPixel — 18 laboratorios Go nativos (Senior Mode)

La versión web de GoPixel es completamente estática. Estos 18 laboratorios ofrecen **código Go real y tests reales**, pero se ejecutan **fuera del navegador** con Go instalado; no son parte de un compilador WASM.

## Ejecutar

```sh
cd labs-native
go test ./...
go test -race ./...
go test -run '^$' -bench . ./s08-performance
```

Cada carpeta incluye `solution.go`, `solution_test.go` y una guía. Para practicar sin ver la respuesta, lee primero el contrato de las pruebas, copia el directorio de laboratorio y reemplaza tu copia de `solution.go` con tu propia solución. El código de referencia está completo para que el paquete pase las pruebas y sirva de material comparativo.

## Ámbito
Los tests validan el comportamiento de los casos construidos. No sustituyen pruebas de integración, pruebas distribuidas ni despliegue real.
