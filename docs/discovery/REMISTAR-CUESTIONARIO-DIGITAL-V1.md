# Cuestionario Digital V1 — mapeo del relevamiento guiado

> Este documento describe cómo el módulo `/app/relevamiento` (ver `docs/producto/REMISTAR-RELEVAMIENTO-UI-1.md`) reorganiza el contenido de `REMISTAR-DISCOVERY-1-cuestionario-operativo.md` (22 secciones + bloque 7bis) en 20 secciones digitales, ordenadas de lo más importante/operativo a lo más estratégico. No reemplaza el cuestionario en papel ni el inventario de información: los complementa. Fuente de cada sección en `lib/discovery/questions/`.

Total: **20 secciones, 144 preguntas, 78 marcadas como críticas**. Responsable por defecto de responder: **Gonzalo** (según `docs/discovery/REMISTAR-DISCOVERY-2-inventario-informacion.md`, que ya lista a Gonzalo como responsable en prácticamente todas las filas); se destacan por sección los casos que además requieren contador, taller o el proveedor de facturación.

| # | Sección | Objetivo | Preguntas (críticas) | Fuente en docs/ |
|---|---|---|---|---|
| 1 | La empresa hoy | Entender qué es Remistar, cómo funciona y quién decide | 12 (9) | discovery §1, §21, §22 |
| 2 | Tipos de servicio | Identificar qué tipos de viaje debe soportar la app | 7 (2) | discovery §2 |
| 3 | Consultas y reservas | Cómo llegan las solicitudes y se transforman en viajes confirmados | 10 (6) | discovery §4, §5 |
| 4 | Clientes y pasajeros | Diferenciar solicitante, pasajero, pagador y contacto de facturación | 7 (5) | discovery §3 |
| 5 | Agenda y coordinación | Cómo se organiza hoy la agenda | 9 (4) | discovery §6 |
| 6 | Choferes | Cómo trabajan los choferes y qué necesitan ver | 11 (6) | discovery §7, §7bis (vínculo) |
| 7 | Vehículos | Estructura de la flota y disponibilidad real | 7 (5) | discovery §8 |
| 8 | Asignación de chofer y vehículo | El criterio real que utiliza Gonzalo | 7 (4) | discovery §9 |
| 9 | Ejecución del servicio | Desde que el viaje se asigna hasta que finaliza | 7 (4) | discovery §10 |
| 10 | Imprevistos e incidencias | Cómo responde Remistar ante problemas | 6 (3) | discovery §11 |
| 11 | Mantenimiento | Cómo se controla la salud de los vehículos | 7 (3) | discovery §14, §15, §16 |
| 12 | Documentación y obligaciones | Vencimientos que pueden afectar la operación | 7 (4) | discovery §17 |
| 13 | Gastos y rendiciones | Qué gastos puede pagar un chofer y cómo se revisan | 9 (5) | discovery §7bis (gastos), §18 |
| 14 | Liquidación de choferes | Cómo se calcula y paga a cada chofer | 9 (5) | discovery §7bis (pago/períodos/adelantos) |
| 15 | Facturación | Qué debe integrarse y qué información necesita Remistar | 6 (4) | discovery §12 |
| 16 | Cobranza | Cómo se controla lo que los clientes deben | 6 (3) | discovery §13 |
| 17 | CRM y oportunidades | Cómo detectar y trabajar oportunidades comerciales | 5 (1) | discovery §20 |
| 18 | Encuestas y calidad | Cómo medir y mejorar el servicio | 5 (2) | discovery §19 |
| 19 | Reportes e indicadores | Qué necesita ver Gonzalo para decidir | 4 (2) | discovery §19 + producto/MODULOS-V0 |
| 20 | Automatizaciones e inteligencia | Qué puede recomendar el sistema y qué debe aprobar Gonzalo | 3 (1) | producto/MOTORES-INTELIGENTES-V0 |

## Preguntas críticas por sección (bloquean el diseño del proceso si no se responden)

1. **La empresa hoy**: razón social, cantidad de personas, cantidad de vehículos, roles del equipo, horarios de operación, mapa de tareas de Gonzalo, mayores problemas, nivel de delegación deseado, herramientas digitales actuales.
2. **Tipos de servicio**: tipos ofrecidos, existencia de servicios recurrentes.
3. **Consultas y reservas**: canales de entrada, horario de atención, información mínima para cotizar, cómo se calcula el precio, tarifa publicada o caso a caso, cómo queda confirmado un servicio.
4. **Clientes y pasajeros**: tipos de cliente, roles distintos (solicitante/pasajero/pagador), cuenta corriente, datos indispensables, cómo se registra un cliente hoy.
5. **Agenda y coordinación**: dónde se registra, información mínima de un servicio, quién puede modificar, estados que usa.
6. **Choferes**: modalidad de vínculo, propiedad del vehículo con el que trabaja, cómo se define la disponibilidad, aceptación/rechazo de viajes, visibilidad del importe del viaje, qué información ve.
7. **Vehículos**: propiedad de la flota, categorías, estados posibles, cómo se sabe la disponibilidad, cuándo no debe asignarse.
8. **Asignación**: criterios de asignación (ranking), cómo se confirma, escenario vehículo cercano con service próximo, escenario chofer con muchas horas.
9. **Ejecución del servicio**: estados reales usados, quién cambia el estado, cómo se entera Gonzalo del avance, qué pasa si el pasajero no aparece.
10. **Imprevistos**: tipos frecuentes, quién decide, cuándo se reasigna.
11. **Mantenimiento**: criterio de control, quién decide llevar al taller, qué pasa con el vehículo en mantenimiento.
12. **Documentación**: tipos a controlar, si bloquea al vehículo, si bloquea al chofer, responsable del control.
13. **Gastos y rendiciones**: matriz de tipos de gasto, autorización previa, comprobante obligatorio, quién aprueba, cómo se reintegra.
14. **Liquidación de choferes**: periodicidad, criterio de pago, existencia de adelantos, confirmación del chofer, forma de pago final.
15. **Facturación**: sistema actual, facturación electrónica vigente, agrupación de la facturación, necesidad de integración.
16. **Cobranza**: medios de pago, cómo se controla la deuda, escenario cliente con deuda que pide otro viaje.
17. **CRM y oportunidades**: cómo detecta Gonzalo una oportunidad hoy.
18. **Encuestas y calidad**: si se hacen encuestas, cómo se gestionan los reclamos.
19. **Reportes e indicadores**: indicadores de interés, top 5 para el dashboard.
20. **Automatizaciones**: nivel de autonomía por función (matriz completa).

## Dependencias declaradas (qué módulos afecta cada respuesta clave)

Algunas preguntas marcan explícitamente qué módulos futuros afecta su respuesta (`affectsModules` en `lib/discovery/questions/`):

- Tipos de cliente → Clientes, Facturación, Cobranza.
- Propiedad del vehículo del chofer → Liquidación de choferes, Gastos y rendiciones.
- Visibilidad del importe por el chofer → Choferes, Liquidación de choferes.
- Servicios recurrentes → Agenda, Servicios.
- Medios de pago / cuenta corriente → Cobranza, Facturación.
- Criterio de control de mantenimiento → Mantenimiento, Vehículos.
- Autorización previa de gastos → Gastos y rendiciones, Liquidación de choferes.
- Nivel de delegación deseado → Automatizaciones e inteligencia.
- Estados del vehículo → Vehículos, Mantenimiento, Documentación y obligaciones.
- Documentación bloquea vehículo → Vehículos, Documentación y obligaciones.
- Criterios de asignación (ranking) → Asignación, Agenda.
- Periodicidad de liquidación → Liquidación de choferes.
- Mapa de tareas de Gonzalo → Automatizaciones, Configuración.

## Responsables adicionales (más allá de Gonzalo)

- **Contador**: preguntas de facturación electrónica vigente y datos fiscales (sección Facturación).
- **Proveedor de facturación**: sistema actual de facturación y sistemas no reemplazables (sección Empresa hoy / Facturación).
- **Taller**: preguntas sobre talleres habituales (sección Mantenimiento).
- **Choferes**: documentación personal a controlar (sección Choferes).

La pantalla `/app/relevamiento/pendientes` agrupa dinámicamente las preguntas sin responder según esta misma heurística (`lib/discovery/export.ts`, función `inferResponsible`), y siempre puede reclasificarse a mano en el resumen a medida que avanza el Discovery.

## Decisiones que impactan el MVP

Mientras las preguntas críticas de una sección no estén respondidas, el diseño de ese proceso debe tratarse como **hipótesis**, no como definición final (ver `/app/relevamiento/resumen`, bloque "Impacto sobre el MVP"). En particular:

- Sin el criterio real de asignación de chofer/vehículo (sección 8), no se puede construir ningún motor de sugerencia sin arriesgarse a inventar reglas de negocio.
- Sin el criterio de pago y periodicidad de liquidación (sección 14), no se puede validar la fórmula conceptual ya redactada en `docs/operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md`.
- Sin saber si existen clientes corporativos con cuenta corriente (secciones 4 y 16), no se puede diseñar cobranza ni facturación agrupada.
- Sin saber si el proyecto debe integrarse con un sistema de facturación existente (sección 15), no se debe empezar a diseñar un módulo de facturación propio.
- El nivel de autonomía por función (sección 20) condiciona todo el alcance de "motores inteligentes" de `docs/producto/REMISTAR-MOTORES-INTELIGENTES-V0.md`: ninguno se activa por encima de lo que Gonzalo autorice ahí.
