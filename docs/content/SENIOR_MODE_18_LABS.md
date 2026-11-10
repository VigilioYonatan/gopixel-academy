# Senior Mode — 18 módulos detallados

> **Nivel avanzado de ingeniería y criterio profesional.** Los 18 briefs están implementados en el dashboard y en formularios locales de decisiones; los simuladores específicos y validación real de Go siguen pendientes.

## Flujo Senior

1. **Contexto de producción:** requisitos, fallos, restricciones y objetivos.
2. **Decisión:** propuesta técnica escrita en editor ADR local.
3. **Checklist:** corrección, fiabilidad, seguridad, rendimiento, mantenibilidad y razonamiento.
4. **Autoevaluación:** reflexión, no certificación ni revisión automática de arquitectura.
5. **Laboratorio real opcional:** instrucciones descargables y herramientas Go externas para medir lo que WebAssembly no permite.

## Módulos

### S01 · Go idiomático y refactoring

**Subtemas:** Interfaces de consumidor, cero valores, API pequeña, eliminación de abstracciones.
**Situación:** Refactorizar un servicio legado; mantener la API pública.
**Criterios de aceptación:** Identificar smells; agregar pruebas de regresión; justificar refactoring.
**Tipo de reto:** Code review + cambio de API.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S02 · Arquitectura modular y hexagonal

**Subtemas:** Capas, puertos/adaptadores, bounded contexts, dependencia unidireccional.
**Situación:** Dividir una aplicación de pagos en módulos cohesivos.
**Criterios de aceptación:** Mapa de dependencias; separación de dominio; pruebas aisladas.
**Tipo de reto:** Architecture builder.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S03 · Diseño profesional de APIs

**Subtemas:** Contratos HTTP, versiones, paginación, idempotencia, compatibilidad.
**Situación:** API de pagos con reintentos concurrentes.
**Criterios de aceptación:** No duplicar operaciones; errores consistentes; evolución segura.
**Tipo de reto:** API design review.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S04 · Modelado del dominio

**Subtemas:** Entidades, value objects, invariantes, transiciones de estado.
**Situación:** Reserva de inventario y pagos.
**Criterios de aceptación:** Garantizar invariantes; evitar venta duplicada; compensaciones.
**Tipo de reto:** Domain modeling.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S05 · Concurrencia de producción

**Subtemas:** Worker pools, colas acotadas, cancellation, shutdown, leaks.
**Situación:** Procesar 1000 tareas sin crecimiento indefinido.
**Criterios de aceptación:** Revisar saturación; cierre correcto; no bloqueo permanente.
**Tipo de reto:** Concurrency lab.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S06 · Memory Model y atomics

**Subtemas:** Happens-before, atomic, race condition lógica, contención.
**Situación:** Corregir contador y caché no deterministas.
**Criterios de aceptación:** Diferenciar carrera de datos y lógica; reglas de visibilidad.
**Tipo de reto:** Debug challenge.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S07 · Runtime, memoria y GC

**Subtemas:** Scheduler G-M-P, escape analysis, heap, GC, memoria retenida.
**Situación:** Investigar consumo creciente después de cada petición.
**Criterios de aceptación:** Analizar heap hipotético; justificar profiling real.
**Tipo de reto:** Memory lab.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S08 · Ingeniería de rendimiento

**Subtemas:** latencia p50/p95/p99, throughput, benchmarking, pprof.
**Situación:** Comparar 3 estrategias sin caer en benchmark falso.
**Criterios de aceptación:** Control de variables; decidir por mediciones.
**Tipo de reto:** Performance review.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S09 · Sistemas distribuidos

**Subtemas:** at-least-once, retries, orden, deduplicación, idempotencia.
**Situación:** Procesador distribuido de mensajes duplicados.
**Criterios de aceptación:** Manejo correcto de reordenamiento; plan de recuperación.
**Tipo de reto:** Distributed architecture.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S10 · Datos y consistencia

**Subtemas:** MVCC, locking, niveles de aislamiento, índices, transacciones.
**Situación:** Evitar sobreventa y lecturas inconsistentes.
**Criterios de aceptación:** Diseño de transacción; índice relevante; rollback.
**Tipo de reto:** Data consistency.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S11 · Resiliencia y fallos parciales

**Subtemas:** Jitter, backoff, timeouts, circuit breakers, load shedding.
**Situación:** Evitar cascadas ante un servicio dependiente caído.
**Criterios de aceptación:** Controlar reintentos; degradación con límites; política de fallos.
**Tipo de reto:** Resilience incident.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S12 · Seguridad backend

**Subtemas:** AuthN/AuthZ, inyección, SSRF, secretos, TLS, dependencias.
**Situación:** Auditoría de una API de usuarios.
**Criterios de aceptación:** Listar amenazas, severidad y controles; no exponer secretos.
**Tipo de reto:** Security audit.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S13 · Testing de sistemas complejos

**Subtemas:** Testing piramidal, property-based, fuzzing, flaky tests, fault injection.
**Situación:** Estabilizar test suite y detectar fallas intermitentes.
**Criterios de aceptación:** Definir inyección de fallos; tests reproducibles.
**Tipo de reto:** Testing challenge.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S14 · Observabilidad e incidentes

**Subtemas:** Métricas RED/USE, tracing, logs slog, SLO, alertas.
**Situación:** Investigar aumento de p99 sin empeorar media.
**Criterios de aceptación:** Correlacionar señales; evitar falsas conclusiones.
**Tipo de reto:** Production incident.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S15 · Despliegue y operaciones

**Subtemas:** CI/CD, blue-green/canary, health probes, rollback, Docker.
**Situación:** Desplegar nueva versión sin perder peticiones.
**Criterios de aceptación:** Plan de rollback; shutdown; observabilidad.
**Tipo de reto:** Deployment plan.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S16 · Migraciones y mantenimiento

**Subtemas:** Versionado, migración, deuda técnica, ADR, contratos.
**Situación:** Migrar un servicio Go legado gradualmente.
**Criterios de aceptación:** Plan incremental; métricas de riesgo; reversibilidad.
**Tipo de reto:** Migration plan.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S17 · Liderazgo técnico

**Subtemas:** Code review, RFC, ADR, mentorship, decisión costo/beneficio.
**Situación:** Decidir monolito modular vs microservicios.
**Criterios de aceptación:** Trade-offs; feedback claro; plan por etapas.
**Tipo de reto:** Senior review.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.

### S18 · Examen final de System Design

**Subtemas:** Capacidad, API, datos, despliegue, resiliencia, costos.
**Situación:** Diseñar plataforma distribuida de trabajos con restricciones.
**Criterios de aceptación:** Documento integral; diagramas; trade-offs y riesgos.
**Tipo de reto:** Capstone system design.
**Traducciones:** `es`, `en`, `ja`, `zh`, `pt`, `fr` en el manifiesto JSON.

**Evaluación automatizable vs manual:** checks de estructura y tests simples, cuando existan, se muestran como resultados automáticos; trade-offs y arquitectura requieren revisión humana o autoevaluación explícita.
