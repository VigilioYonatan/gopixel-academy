# Mapa de competencias Senior v6

## Contrato

La pantalla `/#/senior/readiness` utiliza `evaluateReadiness()` de `src/features/senior/engine/readiness.mjs` y los resultados previamente saneados por `sanitizePrefs()` en `App.tsx`.

Por cada módulo S01–S18 se revisan cinco fuentes de evaluación **dentro de la web**: `seniorResults`, `evidenceResults`, `investigationResults`, `operationsResults`, `reviewResults`. Solo cuenta una actividad como aprobada cuando su registro verificado indica `passed === true` y `score === 100`.

El máximo es **90 actividades (18 × 5)**. Los laboratorios Go nativos **NO** se suman, porque la web sin backend no puede verificar pruebas ejecutadas por el alumno. Un 100 % indica únicamente éxito en las 90 actividades web, no competencia profesional acreditada.

## Integridad

- Los registros del backup son comprobados con el banco de respuestas versionado antes de entrar en `prefs`.
- El agregador es puro; no modifica notas, XP ni el contenido del estudiante.
- Rechaza IDs duplicados o inválidos y datos principales con formato incorrecto.
- La UI muestra contenidos no realizados sin inventar puntuaciones.
- El localStorage es modificable por el usuario y nunca sirve como certificado de identidad.

## Prueba reproducible

`node --test tests/senior-readiness.test.mjs`

### v8
`reviewResults` es una quinta actividad educativa. Se valida al importar resultados pero no demuestra revisión por pares ni ejecución Go real.
