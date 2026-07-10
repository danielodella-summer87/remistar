# Catálogo de Motores Inteligentes V0 (Preliminar)

> ⚠️ Este catálogo describe **intenciones y comportamiento esperado**, no una implementación. No implica una tecnología, modelo de IA ni proveedor específico — esas son decisiones técnicas que se tomarán después del Discovery. Ningún motor debe decidir de forma opaca ni ejecutar acciones irreversibles sin aprobación humana, según los principios del proyecto.

## Cómo leer cada ficha
- **Qué analiza:** qué datos de entrada usa.
- **Qué recomienda:** qué salida/sugerencia produce.
- **Qué datos necesita:** de qué módulos depende (ver [`REMISTAR-MODULOS-V0.md`](REMISTAR-MODULOS-V0.md)).
- **Qué no puede decidir:** límites explícitos del motor.
- **Nivel de riesgo:** Bajo / Medio / Alto, en términos de impacto si se equivoca.
- **Aprobación humana requerida:** Sí / Siempre / Configurable — nunca "No" en esta primera etapa, por principio del proyecto.

---

## 1. Captura y completitud de solicitudes
- **Qué analiza:** el texto/datos de una consulta entrante.
- **Qué recomienda:** qué datos faltan y cómo pedirlos; estructura la solicitud.
- **Qué datos necesita:** historial de solicitudes previas, formato esperado de una solicitud completa.
- **Qué no puede decidir:** no puede confirmar un servicio ni asumir datos no provistos por el cliente.
- **Nivel de riesgo:** Bajo.
- **Aprobación humana requerida:** Configurable (puede operar con supervisión liviana una vez validado).

## 2. Cotización asistida
- **Qué analiza:** datos del servicio solicitado (origen, destino, tipo, horario) y reglas de tarifa vigentes.
- **Qué recomienda:** un precio o rango sugerido.
- **Qué datos necesita:** tarifario/reglas de precio (a relevar), historial de cotizaciones.
- **Qué no puede decidir:** no puede aplicar descuentos o condiciones especiales sin que estén explícitamente definidas.
- **Nivel de riesgo:** Medio (impacto comercial directo).
- **Aprobación humana requerida:** Sí, especialmente en casos fuera de la regla estándar.

## 3. Recomendación de chofer
- **Qué analiza:** disponibilidad, cercanía, idoneidad histórica para el cliente/servicio, estado de documentación del chofer.
- **Qué recomienda:** el/los chofer(es) más adecuados para un servicio, con motivo explícito.
- **Qué datos necesita:** Choferes, Agenda, historial de asignaciones.
- **Qué no puede decidir:** no asigna de forma definitiva ni notifica al chofer sin confirmación humana en esta etapa.
- **Nivel de riesgo:** Alto (impacta la calidad del servicio y la relación con el cliente).
- **Aprobación humana requerida:** Siempre.

## 4. Recomendación de vehículo
- **Qué analiza:** disponibilidad, cercanía geográfica, categoría requerida por el servicio, estado de mantenimiento y documentación.
- **Qué recomienda:** el/los vehículo(s) más adecuados, explicando por qué.
- **Qué datos necesita:** Gestión de flota, Mantenimiento, Patentes/seguros/habilitaciones, Agenda.
- **Qué no puede decidir:** no puede recomendar un vehículo con alerta crítica activa (mantenimiento vencido, documentación vencida) sin advertencia explícita y visible.
- **Nivel de riesgo:** Alto (riesgo legal y de seguridad si se ignora una alerta).
- **Aprobación humana requerida:** Siempre.

## 5. Detección de conflictos de agenda
- **Qué analiza:** superposiciones de horarios, choferes o vehículos doblemente asignados.
- **Qué recomienda:** alerta de conflicto y posibles alternativas.
- **Qué datos necesita:** Agenda, Despacho y asignación.
- **Qué no puede decidir:** no puede resolver el conflicto por sí mismo (ej. reasignar automáticamente).
- **Nivel de riesgo:** Medio-Alto.
- **Aprobación humana requerida:** Siempre.

## 6. Prevención de atrasos
- **Qué analiza:** tiempos estimados de traslado, servicios consecutivos de un mismo chofer/vehículo, patrones históricos de demora.
- **Qué recomienda:** alerta temprana de riesgo de atraso y margen sugerido entre servicios.
- **Qué datos necesita:** Agenda, historial de ejecución de servicios.
- **Qué no puede decidir:** no puede reprogramar servicios automáticamente.
- **Nivel de riesgo:** Medio.
- **Aprobación humana requerida:** Sí.

## 7. Mantenimiento preventivo
- **Qué analiza:** kilometraje, fecha del último service, tipo de vehículo, historial de mantenimiento.
- **Qué recomienda:** cuándo llevar un vehículo al taller y qué tipo de service corresponde.
- **Qué datos necesita:** Gestión de flota, Mantenimiento, Services por tiempo y kilometraje.
- **Qué no puede decidir:** no puede sacar un vehículo de operación automáticamente ni agendar el taller sin confirmación.
- **Nivel de riesgo:** Medio (riesgo mecánico/seguridad si se ignora).
- **Aprobación humana requerida:** Sí.

## 8. Control de vencimientos
- **Qué analiza:** fechas de vencimiento de patentes, seguros, habilitaciones, inspecciones (vehículos) y documentación de choferes.
- **Qué recomienda:** alertas con anticipación configurable antes de cada vencimiento.
- **Qué datos necesita:** Patentes, seguros, habilitaciones y vencimientos.
- **Qué no puede decidir:** no puede renovar trámites ni bloquear un vehículo por sí mismo; solo alerta y advierte.
- **Nivel de riesgo:** Alto (riesgo legal directo).
- **Aprobación humana requerida:** Siempre visible como advertencia; la decisión de igual forma usar o no el vehículo queda en manos humanas, pero con la alerta explícita.

## 9. Detección de garantías vigentes
- **Qué analiza:** reparaciones y repuestos con garantía activa, fechas/kilometraje de vencimiento.
- **Qué recomienda:** si una falla nueva podría estar cubierta por una garantía vigente.
- **Qué datos necesita:** Talleres, reparaciones y repuestos; Garantías.
- **Qué no puede decidir:** no puede gestionar el reclamo de garantía ante el taller/proveedor por sí mismo.
- **Nivel de riesgo:** Bajo-Medio.
- **Aprobación humana requerida:** Sí.

## 10. Control de cobranza
- **Qué analiza:** estado de cuentas corrientes, facturas pendientes, plazos vencidos.
- **Qué recomienda:** a quién reclamar, con qué prioridad, y sugiere el mensaje/acción.
- **Qué datos necesita:** Cuentas corrientes, Facturación y cobranza, Clientes.
- **Qué no puede decidir:** no puede suspender servicios a un cliente ni aplicar penalidades automáticamente.
- **Nivel de riesgo:** Medio-Alto (impacto en relación comercial).
- **Aprobación humana requerida:** Siempre.

## 11. Recomendación de próxima acción comercial
- **Qué analiza:** historial de interacción con un cliente/prospecto, oportunidades abiertas en el CRM.
- **Qué recomienda:** próximo paso sugerido (ej. "hacer seguimiento a este prospecto").
- **Qué datos necesita:** CRM de oportunidades, Clientes.
- **Qué no puede decidir:** no puede contactar al cliente de forma autónoma.
- **Nivel de riesgo:** Bajo.
- **Aprobación humana requerida:** Sí.

## 12. Detección de oportunidades
- **Qué analiza:** patrones de uso de clientes (frecuencia, tipo de servicio, volumen) que sugieran potencial de convertirse en cliente recurrente o corporativo.
- **Qué recomienda:** marcar una oportunidad comercial para seguimiento.
- **Qué datos necesita:** historial de servicios, Clientes, CRM.
- **Qué no puede decidir:** no puede ofrecer condiciones comerciales por sí mismo.
- **Nivel de riesgo:** Bajo.
- **Aprobación humana requerida:** Sí.

## 13. Análisis de calidad
- **Qué analiza:** resultados de encuestas, reclamos, incidencias por servicio/chofer/vehículo.
- **Qué recomienda:** patrones de calidad a atender (ej. un chofer con reclamos recurrentes).
- **Qué datos necesita:** Encuestas y calidad, historial de servicios.
- **Qué no puede decidir:** no puede tomar medidas disciplinarias ni contractuales automáticamente.
- **Nivel de riesgo:** Medio (sensibilidad hacia personas — choferes).
- **Aprobación humana requerida:** Siempre.

## 14. Rentabilidad por servicio, cliente, vehículo y conductor
- **Qué analiza:** ingresos vs. costos asociados a cada dimensión.
- **Qué recomienda:** qué segmentos son más/menos rentables.
- **Qué datos necesita:** Facturación, Gastos y obligaciones, Mantenimiento, Agenda.
- **Qué no puede decidir:** no puede modificar tarifas ni descontinuar clientes/servicios automáticamente.
- **Nivel de riesgo:** Medio.
- **Aprobación humana requerida:** Sí.

## 15. Motor preliminar de liquidación
- **Qué analiza:** servicios realizados por un chofer en un período, criterio de pago aplicable, gastos ya aprobados, adelantos y ajustes pendientes.
- **Qué recomienda:** un borrador de liquidación con el cálculo propuesto y su desglose línea por línea, explicando cómo se llegó al saldo.
- **Qué datos necesita:** Liquidación de choferes, Agenda/servicios ejecutados, Rendición y aprobación de gastos, Adelantos y ajustes.
- **Qué no puede decidir:** no puede aprobar ni cerrar una liquidación, ni ejecutar el pago; solo propone el cálculo para revisión humana.
- **Nivel de riesgo:** Alto (impacto económico directo sobre el chofer y la empresa).
- **Aprobación humana requerida:** Siempre.

## 16. Motor de control de rendiciones
- **Qué analiza:** gastos presentados por los choferes, su estado (presentado/observado/aprobado/rechazado) y su antigüedad.
- **Qué recomienda:** qué rendiciones están pendientes de revisión, cuáles llevan mucho tiempo sin resolverse, y prioriza cuáles atender primero.
- **Qué datos necesita:** Rendición y aprobación de gastos.
- **Qué no puede decidir:** no puede aprobar ni rechazar gastos por sí mismo.
- **Nivel de riesgo:** Medio.
- **Aprobación humana requerida:** Sí (es informativo/organizativo, pero las decisiones de fondo siguen siendo humanas).

## 17. Detector de duplicados
- **Qué analiza:** gastos presentados, buscando coincidencias sospechosas (mismo importe, misma fecha, mismo proveedor, mismo servicio) que sugieran que un gasto fue cargado dos veces.
- **Qué recomienda:** marcar un gasto como "posible duplicado" para revisión antes de aprobarlo.
- **Qué datos necesita:** Rendición y aprobación de gastos.
- **Qué no puede decidir:** no puede rechazar ni eliminar un gasto automáticamente; solo advierte.
- **Nivel de riesgo:** Medio (riesgo de falso positivo si dos gastos legítimos son similares).
- **Aprobación humana requerida:** Siempre.

## 18. Detector de inconsistencias
- **Qué analiza:** coherencia entre un gasto y el servicio al que se asocia (ej. combustible cargado muy por encima de lo esperable para la distancia del viaje, gasto presentado fuera del horario o recorrido del servicio, gasto presentado fuera del período de liquidación correspondiente).
- **Qué recomienda:** marcar el gasto como "pendiente de aclaración" y explicar qué inconsistencia se detectó.
- **Qué datos necesita:** Rendición y aprobación de gastos, Agenda/servicios ejecutados, Gestión de flota (kilometraje).
- **Qué no puede decidir:** no puede rechazar el gasto ni asumir que hay mala fe; solo señala la inconsistencia para que una persona la evalúe.
- **Nivel de riesgo:** Medio-Alto (sensible por afectar la confianza con el chofer si se usa mal).
- **Aprobación humana requerida:** Siempre.

## 19. Recomendación de gastos refacturables
- **Qué analiza:** gastos aprobados y su relación con el servicio, el cliente y las condiciones comerciales pactadas.
- **Qué recomienda:** qué gastos podrían trasladarse/cobrarse al cliente en lugar de (o adicionalmente a) ser absorbidos por Remistar, y si ya fueron incluidos en la factura correspondiente.
- **Qué datos necesita:** Rendición y aprobación de gastos, Facturación y cobranza, Clientes.
- **Qué no puede decidir:** no puede refacturar automáticamente ni modificar una factura sin aprobación.
- **Nivel de riesgo:** Medio-Alto (impacto comercial y en la relación con el cliente).
- **Aprobación humana requerida:** Siempre.

## 20. Control de diferencias de rentabilidad
- **Qué analiza:** margen preliminar de un servicio (estimado al cotizar) versus margen real (una vez descontados el pago al chofer, los gastos reintegrados y no refacturados, y otros costos asociados).
- **Qué recomienda:** alertar cuándo un servicio, cliente, chofer o vehículo muestra una diferencia relevante entre lo estimado y lo real, para que se investigue la causa.
- **Qué datos necesita:** Rentabilidad, Liquidación de choferes, Rendición y aprobación de gastos, Facturación y cobranza.
- **Qué no puede decidir:** no puede ajustar tarifas, penalizar a un chofer ni tomar ninguna acción correctiva por sí mismo.
- **Nivel de riesgo:** Medio.
- **Aprobación humana requerida:** Sí.

## 21. Resumen diario de prioridades
- **Qué analiza:** el conjunto de alertas, vencimientos, cobros pendientes, servicios del día y liquidaciones/rendiciones pendientes generados por los demás motores.
- **Qué recomienda:** una lista priorizada de "qué atender hoy" para Gonzalo.
- **Qué datos necesita:** de todos los módulos y motores anteriores (es el motor de más alto nivel, consolidador).
- **Qué no puede decidir:** no ejecuta ninguna acción; es puramente informativo/organizativo.
- **Nivel de riesgo:** Bajo (es un resumen, no una decisión).
- **Aprobación humana requerida:** No aplica (no toma acciones), pero su precisión depende de la calidad de los motores que consolida.

---

## Principio transversal
Todos los motores deben **explicar su criterio** (qué datos usaron y por qué llegaron a esa recomendación). Ningún motor de esta lista está habilitado, en esta primera etapa, para ejecutar una acción irreversible sin aprobación humana explícita. En particular, **ningún motor puede aprobar o rechazar un gasto, cerrar una liquidación, ejecutar un pago a un chofer, aplicar un descuento, bloquear a un chofer o refacturar un gasto al cliente por sí mismo** — estas siete acciones quedan explícitamente fuera del alcance de cualquier automatización en esta etapa del proyecto. Esta tabla se revisará junto con Gonzalo y Daniel antes de definir cuáles se construyen primero (ver [`REMISTAR-ROADMAP-V0.md`](REMISTAR-ROADMAP-V0.md), Fases 4 y 5). Los motores 15 a 20 (liquidación, rendiciones, duplicados, inconsistencias, refacturación y diferencias de rentabilidad) dependen de que los módulos 23 a 26 ([`REMISTAR-MODULOS-V0.md`](REMISTAR-MODULOS-V0.md)) tengan datos reales y consistentes; no tiene sentido construirlos antes.
