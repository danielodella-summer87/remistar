# Diccionario Inicial de Términos y Entidades

> ⚠️ Este documento es un glosario conceptual preliminar, **no un esquema de base de datos**. Su objetivo es unificar el vocabulario del negocio antes del Discovery y evitar ambigüedades al conversar con Gonzalo. Deliberadamente no define tipos de datos, tablas, claves ni relaciones técnicas. Todo campo marcado como "a confirmar" no debe darse por cierto hasta validarlo.

## Cómo leer este documento
- **Término:** nombre del concepto tal como probablemente lo usa el negocio (a confirmar con Gonzalo, que puede usar otro vocabulario).
- **Definición preliminar:** significado supuesto, a validar.
- **Relacionado con:** otras entidades con las que se vincula conceptualmente.
- **Campos aún no confirmados:** atributos que probablemente tenga, pero sin confirmar cuáles son reales, obligatorios o cómo se llaman en la práctica.

---

## Entidades centrales del negocio

### Cliente
- **Definición preliminar:** persona o empresa que solicita y/o paga un servicio de traslado.
- **Relacionado con:** Pasajero, Cuenta corporativa, Solicitud, Factura, Cuenta corriente.
- **Campos aún no confirmados:** tipo de cliente (particular/corporativo), datos de contacto, datos fiscales, condiciones comerciales.

### Pasajero
- **Definición preliminar:** persona que efectivamente viaja en el servicio, que puede o no coincidir con el Cliente (ej. empleado de una empresa que paga el viaje).
- **Relacionado con:** Cliente, Servicio.
- **Campos aún no confirmados:** si se registra formalmente hoy, o es un dato informal dentro de cada solicitud.

### Cuenta corporativa
- **Definición preliminar:** cliente tipo empresa, con posibles condiciones especiales (tarifas, facturación agrupada, cuenta corriente).
- **Relacionado con:** Cliente, Cuenta corriente, Factura.
- **Campos aún no confirmados:** condiciones contractuales, listado de pasajeros habilitados, límite de crédito.

### Consulta
- **Definición preliminar:** primer contacto de un cliente potencial pidiendo información o un servicio, antes de convertirse en Solicitud formal.
- **Relacionado con:** Cliente, Solicitud, Canal de contacto.
- **Campos aún no confirmados:** canal de origen, estado (respondida/pendiente/perdida).

### Solicitud
- **Definición preliminar:** pedido concreto de un servicio de traslado, con datos de origen, destino, fecha/hora y tipo de servicio.
- **Relacionado con:** Cliente, Cotización, Servicio.
- **Campos aún no confirmados:** nivel mínimo de datos requerido, cómo se distingue una solicitud "completa" de una "incompleta".

### Cotización
- **Definición preliminar:** precio propuesto por Remistar para una Solicitud, antes de su confirmación.
- **Relacionado con:** Solicitud, Tarifa.
- **Campos aún no confirmados:** lógica de cálculo, vigencia de la cotización, forma de aceptación.

### Servicio
- **Definición preliminar:** traslado concreto y confirmado, agendado para ejecutarse, con chofer y vehículo eventualmente asignados.
- **Relacionado con:** Solicitud, Agenda, Chofer, Vehículo, Factura.
- **Campos aún no confirmados:** estados posibles del ciclo de vida (ej. confirmado / asignado / en curso / finalizado / cancelado — a validar cuáles existen realmente hoy).

### Agenda
- **Definición preliminar:** vista consolidada de todos los Servicios programados en el tiempo.
- **Relacionado con:** Servicio, Chofer, Vehículo.
- **Campos aún no confirmados:** granularidad (¿por día, por hora?), soporte actual (papel, Excel, mental).

### Chofer
- **Definición preliminar:** persona habilitada para conducir y prestar el servicio de traslado.
- **Relacionado con:** Vehículo, Servicio, Habilitación/documentación.
- **Campos aún no confirmados:** modalidad de vinculación (empleado/tercerizado), disponibilidad horaria, especialidades, forma de pago.

### Vehículo
- **Definición preliminar:** unidad de la flota utilizada para prestar servicios.
- **Relacionado con:** Chofer, Servicio, Mantenimiento, Documentación/vencimientos.
- **Campos aún no confirmados:** categoría/tipo, capacidad, kilometraje, estado operativo (operativo/reservado/en reparación/fuera de servicio).

### Asignación
- **Definición preliminar:** vínculo entre un Servicio, un Chofer y un Vehículo específicos.
- **Relacionado con:** Servicio, Chofer, Vehículo.
- **Campos aún no confirmados:** criterio de decisión real (cercanía, idoneidad, disponibilidad — pesos relativos a confirmar), momento en que se confirma.

### Mantenimiento
- **Definición preliminar:** intervención preventiva o correctiva realizada sobre un Vehículo.
- **Relacionado con:** Vehículo, Taller, Reparación, Garantía.
- **Campos aún no confirmados:** tipos de mantenimiento habituales, periodicidad real (por fecha, por km, ambos).

### Taller
- **Definición preliminar:** proveedor externo (o interno) donde se realizan reparaciones/mantenimientos.
- **Relacionado con:** Mantenimiento, Reparación, Repuesto.
- **Campos aún no confirmados:** si son talleres fijos o variables, condiciones comerciales con cada uno.

### Reparación
- **Definición preliminar:** intervención puntual correctiva sobre un Vehículo, con posibles Repuestos asociados.
- **Relacionado con:** Vehículo, Taller, Repuesto, Garantía.
- **Campos aún no confirmados:** nivel de detalle registrado hoy (si es que se registra).

### Repuesto
- **Definición preliminar:** pieza utilizada en una Reparación.
- **Relacionado con:** Reparación, Garantía.
- **Campos aún no confirmados:** si se registran hoy de forma individual o quedan implícitos en la Reparación/factura del taller.

### Garantía
- **Definición preliminar:** cobertura temporal o por kilometraje sobre una Reparación o Repuesto.
- **Relacionado con:** Reparación, Repuesto, Vehículo.
- **Campos aún no confirmados:** duración típica, condiciones, si se documenta formalmente hoy.

### Documentación / Vencimiento
- **Definición preliminar:** todo trámite, habilitación o documento con fecha de vencimiento asociado a un Vehículo o Chofer (patente, seguro, inspección, habilitación como remise, libreta profesional, carné de salud, etc.).
- **Relacionado con:** Vehículo, Chofer.
- **Campos aún no confirmados:** listado exhaustivo real de documentos aplicables en Uruguay (no debe asumirse sin confirmar), plazos de anticipación necesarios para renovar cada uno.

### Factura
- **Definición preliminar:** comprobante fiscal emitido por uno o más Servicios prestados a un Cliente.
- **Relacionado con:** Cliente, Servicio, sistema de facturación (propio o externo, a definir).
- **Campos aún no confirmados:** sistema real utilizado, periodicidad (por servicio vs. agrupada), datos fiscales requeridos.

### Cuenta corriente
- **Definición preliminar:** registro de saldo y movimientos de un Cliente/Cuenta corporativa con condiciones de crédito.
- **Relacionado con:** Cliente, Factura, Pago (del cliente).
- **Campos aún no confirmados:** condiciones de plazo/límite, forma de registro actual.

### Pago (del cliente)
- **Definición preliminar:** movimiento de cobro asociado a una Factura o Cuenta corriente, es decir, dinero que entra a Remistar desde un Cliente.
- **Relacionado con:** Factura, Cuenta corriente, Cliente.
- **Campos aún no confirmados:** medios de pago aceptados, si se registran formalmente hoy.
- **Nota de deslinde:** no debe confundirse con "Pago al chofer" (ver más abajo), que es un movimiento de dinero en sentido contrario, de Remistar hacia el chofer.

### Gasto
- **Definición preliminar:** erogación relacionada con la operación. Incluye tanto **gastos operativos generales de la empresa** (combustible de flota propia, mantenimiento, sueldos, seguros, etc.) como **gastos que un chofer paga de su bolsillo** durante un servicio (peaje, combustible, comida, alojamiento, estacionamiento, lavados, reparaciones menores, compras urgentes, etc.) y que luego rinde para su revisión y eventual reintegro.
- **Relacionado con:** Vehículo (cuando aplica), Chofer (cuando aplica), Servicio, Rendición, Rentabilidad.
- **Campos aún no confirmados:** categorías reales de gasto usadas hoy, nivel de registro actual, si existe una política formal de gastos permitidos y límites.

### Rendición
- **Definición preliminar:** acto de presentar uno o más Gastos pagados por un chofer, junto con su Comprobante, para su revisión.
- **Relacionado con:** Gasto, Chofer, Comprobante, Servicio, Liquidación.
- **Campos aún no confirmados:** si se rinde gasto por gasto o de forma acumulada; momento real en que ocurre (¿al cierre del servicio? ¿al cierre del período?).

### Comprobante
- **Definición preliminar:** documento (ticket, factura, foto) que respalda un Gasto presentado por un chofer, o el pago final de una Liquidación.
- **Relacionado con:** Gasto, Rendición, Liquidación, Pago al chofer.
- **Campos aún no confirmados:** formato aceptado hoy (foto por WhatsApp, papel físico), qué se hace cuando no existe comprobante.

### Reintegro
- **Definición preliminar:** devolución de dinero al chofer por un Gasto que pagó de su bolsillo y que fue aprobado.
- **Relacionado con:** Gasto, Liquidación, Pago al chofer.
- **Campos aún no confirmados:** si el reintegro siempre ocurre dentro de una Liquidación periódica, o puede pagarse de forma aislada.

### Gasto refacturable
- **Definición preliminar:** Gasto (típicamente pagado primero por el chofer) que, en lugar de ser absorbido como costo de Remistar, se traslada/cobra al Cliente del servicio correspondiente.
- **Relacionado con:** Gasto, Servicio, Cliente, Factura.
- **Campos aún no confirmados:** criterio real para decidir si un gasto es refacturable, y si se define antes o después del viaje.

### Adelanto
- **Definición preliminar:** entrega de dinero a un chofer, anticipada respecto de su Liquidación, que luego debe descontarse de ella.
- **Relacionado con:** Chofer, Liquidación.
- **Campos aún no confirmados:** motivos habituales por los que se entrega, y cómo se controla hoy que efectivamente se descuente después.

### Ajuste
- **Definición preliminar:** corrección manual, a favor o en contra del chofer, aplicada dentro de una Liquidación (ej. un descuento por un daño, un premio, una corrección de un período anterior).
- **Relacionado con:** Liquidación, Chofer.
- **Campos aún no confirmados:** tipos de ajuste reales que se aplican hoy, si existen, y cómo se documentan.

### Criterio de liquidación
- **Definición preliminar:** regla que define cómo se calcula lo que corresponde pagar a un chofer por un servicio o período (comisión/porcentaje, jornal, tarifa fija, sueldo, combinación).
- **Relacionado con:** Chofer, Servicio, Liquidación.
- **Campos aún no confirmados:** si es un criterio único para todos los choferes o varía por chofer, tipo de vínculo o tipo de vehículo (propio o de Remistar).

### Período de liquidación
- **Definición preliminar:** intervalo de tiempo (o alternativamente, un solo servicio) sobre el cual se calcula una Liquidación de chofer.
- **Relacionado con:** Liquidación, Chofer.
- **Campos aún no confirmados:** periodicidad real usada hoy (diaria, semanal, quincenal, mensual, por viaje, u otra, y si varía por chofer).

### Liquidación
- **Definición preliminar:** documento/registro que consolida, para un chofer y un período (o un servicio), el importe por servicios realizados, los gastos reintegrables aprobados, los adelantos y los ajustes, para llegar a un Saldo final a pagar.
- **Relacionado con:** Chofer, Servicio, Gasto, Adelanto, Ajuste, Pago al chofer, Rentabilidad.
- **Campos aún no confirmados:** fórmula de cálculo real (ver [`../operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md`](../operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md)), estados por los que atraviesa, quién la aprueba.

### Saldo
- **Definición preliminar:** monto final resultante de una Liquidación, a favor del chofer (a pagar) o, en casos excepcionales, a favor de Remistar (a descontar de un período futuro).
- **Relacionado con:** Liquidación.
- **Campos aún no confirmados:** qué ocurre cuando el saldo es negativo (¿se arrastra al período siguiente? ¿se reclama de otra forma?).

### Cierre de período
- **Definición preliminar:** momento en que un Período de liquidación deja de aceptar nuevos servicios o gastos y su Liquidación queda lista para revisión y pago.
- **Relacionado con:** Período de liquidación, Liquidación.
- **Campos aún no confirmados:** si el cierre es una acción manual de Gonzalo o un corte automático de fecha; qué pasa con un gasto que llega tarde, después del cierre.

### Pago al chofer
- **Definición preliminar:** movimiento de dinero desde Remistar hacia un chofer, correspondiente al Saldo final de una Liquidación.
- **Relacionado con:** Liquidación, Chofer, Comprobante.
- **Campos aún no confirmados:** forma de pago (efectivo, transferencia, otro), y si existe confirmación de recepción por parte del chofer.

### Oportunidad
- **Definición preliminar:** posible negocio futuro identificado con un Cliente o prospecto (ej. potencial cliente corporativo).
- **Relacionado con:** Cliente, CRM.
- **Campos aún no confirmados:** si existe hoy algún seguimiento, aunque sea informal.

### Encuesta / Reclamo
- **Definición preliminar:** feedback del Cliente sobre un Servicio prestado, positivo o negativo.
- **Relacionado con:** Servicio, Cliente, Calidad.
- **Campos aún no confirmados:** si existe hoy algún mecanismo, aunque sea informal (ej. preguntar por WhatsApp).

---

## Relaciones conceptuales de alto nivel (preliminar, no técnico)

```
Cliente ──(solicita)──> Solicitud ──(se cotiza)──> Cotización ──(se confirma)──> Servicio
Servicio ──(se agenda en)──> Agenda
Servicio ──(requiere)──> Asignación ──(vincula)──> Chofer + Vehículo
Vehículo ──(recibe)──> Mantenimiento ──(puede implicar)──> Reparación ──(en)──> Taller
Reparación ──(puede usar)──> Repuesto ──(puede tener)──> Garantía
Vehículo / Chofer ──(tienen)──> Documentación / Vencimiento
Servicio ──(genera)──> Factura ──(afecta)──> Cuenta corriente ──(se salda con)──> Pago (del cliente)
Cliente ──(puede generar)──> Oportunidad
Servicio ──(puede generar)──> Encuesta / Reclamo

Chofer ──(paga de su bolsillo)──> Gasto ──(respaldado por)──> Comprobante
Gasto ──(se presenta como)──> Rendición ──(se revisa y puede quedar)──> Aprobado / Observado / Rechazado
Gasto (aprobado) ──(puede ser)──> Gasto refacturable ──(se traslada a)──> Factura (del cliente)
Servicio + Gasto (aprobado) + Adelanto + Ajuste ──(se consolidan en)──> Liquidación (por Chofer y Período de liquidación)
Liquidación ──(se cierra en)──> Cierre de período ──(resulta en)──> Saldo ──(se abona mediante)──> Pago al chofer
Liquidación ──(impacta)──> Rentabilidad (del Servicio, Cliente, Vehículo y Chofer)
```

## Notas importantes
- Este diccionario **no define aún** claves primarias, claves foráneas, tipos de dato ni estructura de base de datos. Esa es una decisión técnica posterior, fuera del alcance de esta etapa.
- Los nombres de los términos son hipótesis de vocabulario; deben contrastarse con el lenguaje real que usa Gonzalo (puede llamarlas de otra forma, y ese vocabulario real debe prevalecer).
- A medida que avance el Discovery, este documento debe actualizarse antes de evolucionar hacia cualquier modelo de datos formal.
