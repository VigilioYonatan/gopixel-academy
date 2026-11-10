# Gates de entrega DevSecOps

- G1 `npm ci` con lockfile sin errores.
- G2 TypeScript `tsc --noEmit`, build Vite.
- G3 tests de contenido y rutas, smoke de SPA.
- G4 auditoría de dependencias y secretos; documentar findings, no silenciar.
- G5 `dist/` se despliega con `base` correcto en Pages.
- G6 navegación y responsive comprobados en navegador real.
- G7 ZIP íntegro, extraíble y verificable con checksums.

Un gate no ejecutado no está aprobado; mirar `AUDIT_REPORT.md`.
