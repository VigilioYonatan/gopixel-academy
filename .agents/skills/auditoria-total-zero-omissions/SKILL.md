---
name: auditoria-total-zero-omissions
version: 1.0.0
description: Auditoría de entrega con evidencia, matriz de requisitos, pruebas, corrección, revalidación y ZIP extraído.
---
# Auditoría total — Zero Omissions

## Activar
Antes de presentar una entrega o tras `AUDITORÍA TOTAL: ZERO OMISSIONS`.

## Gates obligatorios
1. Inventariar fuentes, docs, assets, pruebas y licencias. Identificar lo que no se puede inspeccionar.
2. Registrar cada requisito en `AUDIT_REPORT.md` con implementación, prueba y estado.
3. Inspeccionar contenido de archivos, relaciones, referencias, funciones y botones; distinguir pruebas reales de simulación.
4. Ejecutar `npm run check:content`, `npm run build`, `npm run test` y `npm audit` cuando dependencias y red permitan. No declarar verde aquello que no pudo ejecutarse.
5. Corregir defectos verificables y repetir sus pruebas. No suprimir fallos.
6. Validar ZIP con `zipfile.testzip`, extraer en temporal y ejecutar pruebas desde la copia extraída.
7. Declarar APROBADO solo sin P0/P1 y sin requisitos esenciales pendientes; de otro modo PARCIAL/NO VERIFICABLE o NO APROBADO.

## Reglas de honestidad
- Un intérprete WASM no equivale al compilador Go oficial.
- No denominar ejecutados a tests de código corregido por expresiones regulares.
- Ejercicios planificados son planificados, aunque aparezcan en el catálogo.
- Incluir logs reales, limitaciones y matriz de trazabilidad.
