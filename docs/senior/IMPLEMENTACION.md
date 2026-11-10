# Senior Mode — estado de implementación real

## Implementado en esta revisión

- 18 escenarios conservados del catálogo en seis idiomas (`src/data/curriculum.json`).
- 18 actividades `decision-lab` nuevas con 3 preguntas, 54 preguntas en total. Preguntas y explicaciones **solo en español** (`src/content/senior/challenges.json`). Los demás idiomas muestran el escenario localizado y un aviso de que el cuestionario está en español.
- Motor puro de evaluación (`src/features/senior/engine/evaluate.mjs`): verifica respuestas completas y dentro de rango, genera aciertos, fallos, puntuación y explicaciones objetivas.
- Rutas funcionales `/#/senior`, `/#/senior/S05`, `/#/senior/S05/decision-lab`, `/#/senior/S05/decision-lab/result` para cada `S01..S18`.
- Resultados guardados en `localStorage` mediante `seniorResults`, separados de `completed` para NO certificar capacidades solo con marcar casillas.
- La reflexión ADR se guarda sin calificarse. La nota de razonamiento no se contabiliza como éxito.
- Para S05, simulador determinista de cola acotada y workers virtuales con controles y cálculos reproducibles (`worker-pool.mjs`). **No es Go ni un benchmark**.
- 8 pruebas nuevas en `tests/senior-engine.test.mjs` y `tests/worker-pool.test.mjs` (14 en total con las existentes).

## No implementado: requisitos obligatorios pendientes

- Compilador/interprete Go WASM real: ausente. Editor sigue con reglas didácticas y no ejecuta Go.
- 18 laboratorios de producción con código verificable: solo hay 18 cuestionarios de criterio y 1 simulador S05; los demás son escenarios educativos, no sistemas ejecutables.
- Preguntas/explicaciones de los 18 laboratorios traducidas a en, ja, zh-Hans, pt-BR, fr.
- Revisión automática auténtica de código, profiling real, fuzzing, validación de arquitectura avanzada, simuladores de incidentes multidimensionales y laboratorios de seguridad.
- Build Vite, typecheck completo, navegación E2E y accesibilidad verificada en navegador: no ejecutables aquí sin dependencias npm.
- Lecciones completas de los 54 módulos Go y 8 rutas de frameworks.

## Validación explícita

`npm run check:content` ejecuta los tests de Node y la auditoría de recursos estáticos.

El resultado de esta revisión **no certifica nivel Senior**. El porcentaje del `decision-lab` representa solo aciertos en preguntas de conocimiento.

## Diseño de seguridad y persistencia

- Sin backend ni credenciales; datos guardados localmente.
- Importaciones de backup limitadas a 1 MB y saneadas en el punto de entrada.
- Evaluador limita tamaño del cuestionario y rechaza índices fuera de rango.
- El simulador impone límites a los números para evitar ejecución ilimitada.
- El código fuente no contiene módulos externos cargados dinámicamente para compilar Go.
