# Catálogo de Módulos V0 (Preliminar)

> ⚠️ Este catálogo es preliminar y **no implica que todos estos módulos formen parte del MVP**. Su función es mapear el universo completo de dominios funcionales identificados a partir del contexto de negocio, para luego priorizarlos en el roadmap ([`REMISTAR-ROADMAP-V0.md`](REMISTAR-ROADMAP-V0.md)) una vez validado el Discovery.

## Cómo leer cada ficha
- **Objetivo:** qué problema resuelve el módulo.
- **Usuario:** quién lo usa principalmente.
- **Datos principales:** qué entidades/datos maneja (sin definir aún modelo de base de datos).
- **Dependencias:** de qué otros módulos depende para funcionar.
- **Prioridad preliminar:** Alta / Media / Baja — **sujeta a revisión** tras el Discovery.
- **Riesgos:** qué puede salir mal o qué falta saber para diseñarlo bien.

---

## 1. Sitio institucional
- **Objetivo:** presentar la empresa, servicios, flota y generar confianza; captar solicitudes de contacto.
- **Usuario:** público general, clientes potenciales.
- **Datos principales:** contenido institucional, servicios, flota, testimonios, formularios de contacto.
- **Dependencias:** ninguna funcional; depende de definiciones de marca (logo, textos, fotos reales).
- **Prioridad preliminar:** Alta (primer punto de contacto comercial).
- **Riesgos:** construirlo sin contenido/fotos reales de la flota y servicios genera un sitio genérico.

## 2. Captura inteligente de consultas
- **Objetivo:** estructurar y completar automáticamente los datos de una consulta entrante (origen, destino, fecha, pasajeros, tipo de servicio), reduciendo el ida y vuelta manual.
- **Usuario:** Gonzalo / futuro personal administrativo; indirectamente, el cliente.
- **Datos principales:** consulta, datos del solicitante, datos del viaje solicitado.
- **Dependencias:** Solicitudes y cotizaciones; Clientes.
- **Prioridad preliminar:** Alta.
- **Riesgos:** sin ejemplos reales de conversaciones, se corre el riesgo de diseñar un formulario que no refleje cómo realmente consultan los clientes.

## 3. Solicitudes y cotizaciones
- **Objetivo:** registrar solicitudes de servicio y generar cotizaciones de forma asistida.
- **Usuario:** Gonzalo, futuro personal comercial.
- **Datos principales:** solicitud, tarifa aplicada, condiciones, estado (cotizado/aceptado/rechazado).
- **Dependencias:** Captura inteligente de consultas; Clientes; reglas de tarifas (a relevar).
- **Prioridad preliminar:** Alta.
- **Riesgos:** no se conoce aún la lógica real de tarifas; alto riesgo de inventar reglas si no se releva bien.

## 4. Agenda de servicios
- **Objetivo:** centralizar y visualizar todos los servicios programados, evitando superposiciones.
- **Usuario:** Gonzalo, despacho.
- **Datos principales:** servicio, fecha/hora, origen/destino, estado, chofer y vehículo asignado (si ya se definió).
- **Dependencias:** Solicitudes y cotizaciones; Despacho y asignación.
- **Prioridad preliminar:** Alta (es el núcleo operativo del día a día).
- **Riesgos:** si no está conectada en tiempo real con disponibilidad real de flota/choferes, pierde su valor principal.

## 5. Despacho y asignación de choferes y vehículos
- **Objetivo:** asistir (no automatizar ciegamente) la decisión de qué chofer y qué vehículo asignar a cada servicio.
- **Usuario:** Gonzalo, despacho.
- **Datos principales:** disponibilidad de choferes y vehículos, ubicación aproximada, idoneidad, estado de mantenimiento/documentación.
- **Dependencias:** Agenda; Choferes; Gestión de flota; Mantenimiento; Patentes/seguros/habilitaciones.
- **Prioridad preliminar:** Alta.
- **Riesgos:** es el proceso menos documentado hoy (vive en la experiencia de Gonzalo); requiere relevamiento profundo antes de diseñar reglas o recomendaciones.

## 6. Portal simple para choferes
- **Objetivo:** que cada chofer vea sus servicios asignados y pueda confirmarlos/reportar su estado, con una interfaz extremadamente simple.
- **Usuario:** choferes.
- **Datos principales:** servicios asignados al chofer, estado del servicio.
- **Dependencias:** Despacho y asignación; Agenda; Rendición y aprobación de gastos (canal por el que el chofer carga sus gastos y comprobantes).
- **Prioridad preliminar:** Media-Alta (depende del nivel de habilidad digital real de los choferes, a confirmar).
- **Riesgos:** diseñar algo demasiado complejo para el perfil real de uso.

## 7. Clientes, pasajeros y cuentas corporativas
- **Objetivo:** mantener un registro centralizado de clientes, pasajeros (cuando difieren de quien paga) y cuentas corporativas con condiciones propias.
- **Usuario:** Gonzalo, futuro personal comercial/administrativo.
- **Datos principales:** datos de contacto, tipo de cliente, condiciones comerciales, historial de servicios.
- **Dependencias:** ninguna crítica; es base para Solicitudes, CRM, Facturación y Cuentas corrientes.
- **Prioridad preliminar:** Alta.
- **Riesgos:** datos personales sensibles; requiere criterio de privacidad aunque la definición formal de seguridad sea posterior al Discovery.

## 8. CRM de oportunidades
- **Objetivo:** detectar y hacer seguimiento de oportunidades comerciales (clientes recurrentes potenciales, corporativos, convenios).
- **Usuario:** Gonzalo.
- **Datos principales:** oportunidad, cliente asociado, estado, próxima acción.
- **Dependencias:** Clientes; historial de servicios.
- **Prioridad preliminar:** Media (probablemente no forme parte del MVP).
- **Riesgos:** sin datos históricos de clientes, este módulo no tiene con qué alimentarse al inicio.

## 9. Facturación y cobranza
- **Objetivo:** emitir y/o registrar facturas de servicios prestados.
- **Usuario:** Gonzalo, contador.
- **Datos principales:** factura, servicio(s) asociados, cliente, condición fiscal.
- **Dependencias:** Clientes; Agenda/servicios ejecutados; posible integración con sistema de facturación electrónica externo.
- **Prioridad preliminar:** Alta.
- **Riesgos:** **no debe construirse un motor de facturación propio si Remistar ya usa un sistema habilitado**; definir esto es prioritario antes de diseñar el módulo.

## 10. Cuentas corrientes
- **Objetivo:** llevar el saldo y movimientos de clientes con crédito/cuenta corriente.
- **Usuario:** Gonzalo.
- **Datos principales:** cliente, movimientos (cargos/pagos), saldo, condiciones (plazo, límite).
- **Dependencias:** Clientes; Facturación y cobranza.
- **Prioridad preliminar:** Alta (mencionado explícitamente como carga actual de Gonzalo).
- **Riesgos:** sin ver un ejemplo real de cómo se lleva hoy, se puede subestimar su complejidad.

## 11. Gestión de flota
- **Objetivo:** registro central de vehículos y su estado operativo real (operativo/reservado/en reparación/fuera de servicio).
- **Usuario:** Gonzalo.
- **Datos principales:** vehículo, estado, ubicación aproximada, historial.
- **Dependencias:** es dependencia de Despacho, Mantenimiento, Vencimientos.
- **Prioridad preliminar:** Alta.
- **Riesgos:** ninguno mayor identificado; es un módulo relativamente autocontenido.

## 12. Mantenimiento preventivo y correctivo
- **Objetivo:** planificar y registrar mantenimientos de la flota.
- **Usuario:** Gonzalo.
- **Datos principales:** vehículo, tipo de mantenimiento, fecha/kilometraje, resultado.
- **Dependencias:** Gestión de flota.
- **Prioridad preliminar:** Media-Alta.
- **Riesgos:** ninguno mayor, salvo la calidad de los datos históricos disponibles.

## 13. Services por tiempo y kilometraje
- **Objetivo:** alertar cuándo un vehículo necesita un service en base a fecha y/o kilometraje.
- **Usuario:** Gonzalo.
- **Datos principales:** vehículo, kilometraje actual, reglas de periodicidad.
- **Dependencias:** Gestión de flota; Mantenimiento.
- **Prioridad preliminar:** Media-Alta.
- **Riesgos:** depende de tener kilometraje actualizado; a definir cómo se registraría (manual vs. otra fuente).

## 14. Talleres, reparaciones y repuestos
- **Objetivo:** registrar reparaciones realizadas, talleres utilizados y repuestos empleados.
- **Usuario:** Gonzalo.
- **Datos principales:** reparación, taller, repuesto, costo, fecha.
- **Dependencias:** Gestión de flota; Mantenimiento.
- **Prioridad preliminar:** Media.
- **Riesgos:** ninguno mayor; volumen de datos probablemente manejable.

## 15. Garantías
- **Objetivo:** controlar vigencia de garantías de reparaciones/repuestos.
- **Usuario:** Gonzalo.
- **Datos principales:** garantía, reparación/repuesto asociado, fecha/kilometraje de vencimiento, documentación.
- **Dependencias:** Talleres, reparaciones y repuestos.
- **Prioridad preliminar:** Media-Baja (valioso pero no bloqueante para operar).
- **Riesgos:** requiere disciplina de carga de datos; bajo valor si no se completa consistentemente.

## 16. Patentes, seguros, habilitaciones y vencimientos
- **Objetivo:** controlar toda la documentación con vencimiento, tanto de vehículos como de choferes.
- **Usuario:** Gonzalo.
- **Datos principales:** documento, entidad asociada (vehículo/chofer), fecha de vencimiento.
- **Dependencias:** Gestión de flota; Choferes.
- **Prioridad preliminar:** Alta (impacta directamente en la regla de "no asignar sin advertencia").
- **Riesgos:** requiere conocer la normativa uruguaya real aplicable a remises (no debe asumirse).

## 17. Gastos y obligaciones
- **Objetivo:** registrar gastos operativos generales de la empresa (combustible de flota propia, seguros, sueldos, impuestos, etc.) y obligaciones periódicas.
- **Usuario:** Gonzalo.
- **Datos principales:** gasto, tipo, vehículo/chofer asociado (si aplica), monto, fecha.
- **Dependencias:** Gestión de flota (para asociar gastos por vehículo).
- **Prioridad preliminar:** Media.
- **Riesgos:** bajo, pero de bajo valor sin disciplina de carga.
- **Nota de deslinde:** este módulo cubre gastos operativos generales de la empresa. Los gastos que un **chofer paga de su bolsillo durante un servicio** (peajes, combustible, comidas, alojamiento, etc.) y que luego se rinden y eventualmente se reintegran, son un dominio distinto — ver módulo 24 "Rendición y aprobación de gastos".

## 18. Encuestas y calidad
- **Objetivo:** medir satisfacción del cliente y gestionar reclamos.
- **Usuario:** Gonzalo; indirectamente, clientes.
- **Datos principales:** encuesta, respuesta, reclamo, servicio asociado.
- **Dependencias:** Agenda/servicios ejecutados; Clientes.
- **Prioridad preliminar:** Baja-Media (probablemente no forme parte del MVP).
- **Riesgos:** sin proceso previo de calidad, es difícil saber qué preguntar.

## 19. Rentabilidad
- **Objetivo:** analizar rentabilidad por servicio, cliente, vehículo y conductor.
- **Usuario:** Gonzalo.
- **Datos principales:** ingresos (Facturación), costos (Gastos, Mantenimiento), servicio asociado.
- **Dependencias:** Facturación; Gastos y obligaciones; Mantenimiento; Agenda; Liquidación de choferes (el costo real de un servicio incluye lo pagado al chofer y los gastos reintegrados, no solo el ingreso facturado).
- **Prioridad preliminar:** Media (de alto valor, pero depende de que los módulos base ya tengan datos).
- **Riesgos:** solo es tan bueno como la calidad de los datos de costos e ingresos cargados.

## 20. Alertas operativas
- **Objetivo:** notificar proactivamente vencimientos, mantenimientos pendientes, conflictos de agenda, cobros atrasados, etc.
- **Usuario:** Gonzalo (y potencialmente otros roles).
- **Datos principales:** transversal a casi todos los módulos.
- **Dependencias:** Gestión de flota, Mantenimiento, Vencimientos, Cuentas corrientes, Agenda.
- **Prioridad preliminar:** Alta (es central a la visión de reducir la carga mental de Gonzalo).
- **Riesgos:** mal calibrado, puede generar exceso de alertas ("fatiga de alertas") y perder efectividad.

## 21. Motores inteligentes
- **Objetivo:** ver catálogo dedicado en [`REMISTAR-MOTORES-INTELIGENTES-V0.md`](REMISTAR-MOTORES-INTELIGENTES-V0.md).
- **Usuario:** Gonzalo, y transversalmente otros módulos.
- **Dependencias:** de casi todos los módulos operativos, ya que consumen sus datos.
- **Prioridad preliminar:** Media-Alta, pero **posterior** a tener los módulos base con datos reales.

## 22. Reportes y tablero de control
- **Objetivo:** dar visibilidad consolidada del estado del negocio (operativo, comercial, financiero).
- **Usuario:** Gonzalo.
- **Datos principales:** transversal; agrega datos de todos los módulos.
- **Dependencias:** de todos los módulos con datos ya cargados.
- **Prioridad preliminar:** Media (tiene más valor cuanto más módulos base ya estén en uso).
- **Riesgos:** construirlo temprano, sin datos reales acumulados, da un tablero vacío o engañoso.

## 23. Liquidación de choferes
- **Objetivo:** calcular periódicamente (o por servicio) cuánto corresponde pagar a cada chofer, consolidando el importe por servicios realizados, los gastos reintegrables aprobados, los adelantos y los ajustes.
- **Usuario:** Gonzalo.
- **Datos principales:** chofer, período de liquidación, servicios incluidos, criterio de cálculo aplicado, gastos aprobados, adelantos, ajustes, saldo final, estado de la liquidación.
- **Dependencias:** Agenda/servicios ejecutados; Choferes; módulo 24 (Rendición y aprobación de gastos); módulo 25 (Adelantos y ajustes); módulo 26 (Pagos y comprobantes).
- **Prioridad preliminar:** Alta (es una de las cargas administrativas más pesadas identificadas para Gonzalo).
- **Riesgos:** la fórmula de cálculo es solo una hipótesis (ver [`../operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md`](../operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md)); puede variar según tipo de chofer, vínculo contractual y esquema de pago, todo pendiente de validar con Gonzalo.
- **Documento de referencia:** [`../operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md`](../operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md).

## 24. Rendición y aprobación de gastos
- **Objetivo:** que los choferes puedan presentar (con comprobante) los gastos que pagaron de su bolsillo para prestar un servicio, y que un responsable administrativo los revise, apruebe (total o parcialmente), observe o rechace.
- **Usuario:** choferes (presentan), Gonzalo/responsable administrativo (revisa y decide).
- **Datos principales:** gasto, tipo, importe, moneda, servicio asociado, vehículo, cliente, comprobante (foto/archivo), autorización previa (si correspondía), estado del gasto, si es refacturable al cliente.
- **Dependencias:** Portal simple para choferes (canal de carga); Agenda/servicios ejecutados; Liquidación de choferes (consume los gastos aprobados); Facturación y cobranza (para gastos refacturables).
- **Prioridad preliminar:** Alta.
- **Riesgos:** sin política clara de gastos permitidos y límites (a relevar con Gonzalo), el módulo corre riesgo de heredar ambigüedad del proceso manual actual.
- **Documento de referencia:** [`../operaciones/REMISTAR-RENDICION-GASTOS-V0.md`](../operaciones/REMISTAR-RENDICION-GASTOS-V0.md).

## 25. Adelantos y ajustes
- **Objetivo:** registrar adelantos de dinero entregados a choferes y ajustes manuales (a favor o en contra) que deben reflejarse en su liquidación.
- **Usuario:** Gonzalo.
- **Datos principales:** adelanto/ajuste, chofer, monto, fecha, motivo, si ya fue aplicado/descontado en una liquidación.
- **Dependencias:** Choferes; Liquidación de choferes (consume adelantos y ajustes pendientes).
- **Prioridad preliminar:** Alta (mencionado explícitamente como fuente de descuentos pendientes hoy no siempre controlados).
- **Riesgos:** sin este registro, un adelanto puede "perderse" y no descontarse nunca, generando pérdida real para la empresa.

## 26. Pagos y comprobantes (choferes)
- **Objetivo:** registrar el pago efectivo del saldo final de una liquidación a un chofer, con su forma, fecha, comprobante y confirmación de recepción.
- **Usuario:** Gonzalo.
- **Datos principales:** pago, liquidación asociada, chofer, monto, forma de pago, fecha, comprobante, confirmación de recepción por parte del chofer.
- **Dependencias:** Liquidación de choferes.
- **Prioridad preliminar:** Alta (cierra el ciclo de trazabilidad del pago).
- **Riesgos:** sin confirmación de recepción, no hay trazabilidad completa de que el chofer efectivamente cobró lo liquidado.

---

## Notas de priorización
- Esta prioridad preliminar es una **hipótesis de trabajo**, no una decisión de producto. La priorización real se definirá en el roadmap ([`REMISTAR-ROADMAP-V0.md`](REMISTAR-ROADMAP-V0.md)) en conjunto con Gonzalo, después del Discovery.
- Ningún módulo debe asumirse como parte del MVP por estar en esta lista.
- Los módulos 23 a 26 (Liquidación de choferes, Rendición y aprobación de gastos, Adelantos y ajustes, Pagos y comprobantes) están deliberadamente separados entre sí pero deben diseñarse e implementarse como un conjunto coherente: la Liquidación es el módulo consolidador que consume datos de los otros tres. No deben tratarse como funcionalidades aisladas.
