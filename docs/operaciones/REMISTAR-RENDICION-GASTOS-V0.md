# Rendición de Gastos V0 (Preliminar)

> ⚠️ **ESTE DOCUMENTO ES UN BORRADOR SIN VALIDAR.** Describe una hipótesis de proceso construida a partir del contexto de negocio provisto por Daniel, sin haber realizado aún la entrevista de Discovery con Gonzalo sobre este tema específico (ver bloque [`7bis` del cuestionario](../discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md)). Ningún tipo de gasto, monto, límite o política aquí descrita es real ni definitiva. Todo debe validarse con Gonzalo antes de diseñar cualquier pantalla o modelo de datos.

## 1. Objetivo

Definir, como hipótesis de trabajo, el proceso por el cual un chofer presenta los gastos que pagó de su bolsillo para prestar un servicio, y por el cual un responsable administrativo (hoy, Gonzalo) los revisa, aprueba, observa o rechaza, determinando además si corresponden a un reintegro al chofer, a un costo que asume Remistar, o a un gasto refacturable al cliente.

Este documento es el complemento operativo de [`REMISTAR-LIQUIDACION-CHOFERES-V0.md`](REMISTAR-LIQUIDACION-CHOFERES-V0.md): los gastos aquí aprobados son uno de los insumos de la liquidación.

## 2. Tipos de gastos (hipótesis a confirmar)

Según el contexto de negocio provisto, los choferes podrían pagar de su bolsillo, entre otros:

- Peajes.
- Combustible.
- Parking o estacionamiento.
- Desayuno.
- Almuerzo o cena.
- Alojamiento, cuando corresponda (viajes de larga distancia).
- Lavados.
- Reparaciones menores.
- Compras urgentes.
- Otros gastos operativos autorizados (categoría abierta, a definir con Gonzalo qué entra aquí).

**A validar con Gonzalo:** si esta lista está completa, si faltan tipos de gasto, y si existen límites de monto o reglas específicas por tipo (ver preguntas 14 a 17 del bloque `7bis` del cuestionario).

## 3. Carga desde el portal del chofer

- **Supuesto:** el chofer carga cada gasto desde el [portal simple para choferes](../producto/REMISTAR-MODULOS-V0.md) (módulo 6), adjuntando una foto del comprobante.
- **Supuesto:** dado que la interfaz del chofer debe ser extremadamente simple (principio del proyecto), la carga de un gasto debería requerir el mínimo de pasos posible: tipo de gasto, monto, foto del comprobante, y el servicio al que corresponde.
- **A validar:** si el chofer carga el gasto en el momento (durante o inmediatamente después del servicio) o si lo hace de forma acumulada al final del período. Esto cambia el diseño de la interfaz y de las alertas de "gasto presentado fuera de período".

## 4. Comprobantes

- **Supuesto:** cada gasto debería idealmente tener un comprobante (foto de ticket o factura).
- **Caso sin comprobante:** se prevé que pueda existir un estado `Sin comprobante` o `Pendiente de comprobante`, en lugar de bloquear la carga del gasto — a validar si Gonzalo prefiere permitir cargar el gasto igual (marcado como pendiente) o exigir el comprobante antes de aceptar la carga.
- **A validar:** con qué frecuencia hoy falta el comprobante, y qué se hace en esos casos en la práctica actual.

## 5. Autorización previa

- **Supuesto:** algunos tipos de gasto (ej. una reparación menor, una compra urgente, o cualquier monto por encima de un límite) podrían requerir autorización previa de Gonzalo antes de que el chofer gaste, mientras que gastos rutinarios (ej. un peaje) no la requerirían.
- **A validar:** qué gastos requieren autorización previa hoy, cómo se solicita (llamada, WhatsApp), y qué pasa si el chofer gasta sin haberla pedido.

## 6. Revisión

- El responsable administrativo revisa cada gasto presentado, viendo: tipo, fecha, importe, comprobante, servicio asociado, y si tenía autorización previa (cuando correspondía).
- Puede pedir aclaración al chofer antes de decidir.
- Puede corregir la categoría del gasto si fue mal clasificado.
- Puede vincular el gasto a otro servicio si el chofer se equivocó al cargarlo.

## 7. Aprobación parcial

- **Supuesto:** un gasto puede aprobarse solo parcialmente (ej. el chofer presenta un almuerzo por un monto que excede lo que Remistar reconoce habitualmente, y se aprueba solo una parte).
- **A validar:** si esto ocurre hoy en la práctica, y con qué criterio se define el monto parcial a aprobar.

## 8. Rechazo

- Un gasto puede rechazarse (ej. está fuera de política, no tiene relación con el servicio, o está duplicado).
- **Supuesto:** un gasto rechazado no se reintegra al chofer bajo ningún concepto; el chofer debería poder ver el motivo del rechazo.
- **A validar:** si hoy existe algún mecanismo de reclamo del chofer ante un rechazo, y cómo se resuelve.

## 9. Reintegro

- Un gasto aprobado (total o parcialmente) se convierte en un monto a reintegrar al chofer.
- **Supuesto:** el reintegro se incluye dentro de la Liquidación del período correspondiente (ver [`REMISTAR-LIQUIDACION-CHOFERES-V0.md`](REMISTAR-LIQUIDACION-CHOFERES-V0.md)), y no se paga de forma aislada — **a validar**, ya que podría haber casos de reintegro inmediato (ej. gastos grandes de un viaje largo).

## 10. Refacturación

- Un gasto aprobado puede además marcarse como refacturable al cliente, es decir, un costo que Remistar traslada a la Factura del servicio en lugar de (o además de) absorberlo.
- **Supuesto:** esta decisión (refacturar o no) la toma el mismo responsable administrativo que aprueba el gasto, no un proceso automático.
- **A validar:** si existe hoy algún criterio para decidir esto, y si se ha perdido dinero en el pasado por no refacturar a tiempo.

## 11. Clasificaciones del gasto (hipótesis a confirmar)

Un gasto podría clasificarse, de forma no necesariamente excluyente, como:

1. Gasto operativo de Remistar (costo propio de la empresa, no vinculado a un chofer específico).
2. Gasto reintegrable al chofer.
3. Gasto personal no reintegrable (el chofer lo pagó pero no corresponde a la operación).
4. Gasto incluido en el precio (ya contemplado en la tarifa cotizada al cliente, no se reintegra ni refactura aparte).
5. Gasto a refacturar (se traslada al cliente).
6. Gasto asumido por la empresa (aprobado, pero Remistar lo absorbe sin refacturar).
7. Gasto sin comprobante.
8. Gasto pendiente de aclaración.
9. Posible duplicado.
10. Gasto fuera de política.

> Estas clasificaciones pueden solaparse (ej. un gasto puede ser "reintegrable al chofer" y "a refacturar" al mismo tiempo). El diseño funcional detallado de esto queda para después del Discovery.

## 12. Campos de un gasto (hipótesis a confirmar)

Cada gasto presentado por un chofer debería poder registrar, como mínimo:

- Tipo.
- Fecha.
- Importe.
- Moneda.
- Servicio asociado.
- Vehículo.
- Cliente (si aplica, para evaluar refacturación).
- Proveedor (ej. estación de servicio, restorán, taller).
- Fotografía o archivo del comprobante.
- Motivo (breve descripción).
- Observaciones.
- Forma de pago (efectivo, tarjeta del chofer, etc.).
- Autorización previa (si correspondía y si se obtuvo).
- Responsable del pago (quién pagó efectivamente: el chofer, u otro).
- Indicador de si es candidato a refacturarse al cliente.

## 13. Estados del gasto

1. `Borrador` — cargado por el chofer pero no enviado a revisión.
2. `Presentado` — enviado, a la espera de revisión.
3. `Pendiente de comprobante` — falta adjuntar el respaldo.
4. `Pendiente de revisión` — con comprobante, a la espera de que alguien lo revise.
5. `Observado` — el revisor pidió una aclaración o corrección.
6. `Aprobado` — reconocido en su totalidad.
7. `Aprobado parcialmente` — reconocido solo por una parte del monto.
8. `Rechazado` — no se reconoce.
9. `Incluido en liquidación` — ya forma parte de una Liquidación en curso.
10. `Reintegrado` — el monto ya fue efectivamente pagado al chofer.
11. `Refacturado` — el monto ya fue trasladado a una Factura del cliente.
12. `Cerrado` — ciclo de vida del gasto completo, sin más acciones pendientes.

## 14. Acciones del responsable administrativo

El responsable administrativo (hoy, Gonzalo) debe poder, sobre cada gasto:

- Aprobar.
- Rechazar.
- Observar.
- Pedir aclaración.
- Solicitar comprobante.
- Corregir la categoría.
- Vincular el gasto a otro servicio.
- Aprobar parcialmente.
- Incluirlo en una liquidación.
- Decidir si debe refacturarse.

**Ninguna de estas acciones ocurre de forma automática.** Es siempre una decisión humana explícita, según el principio del proyecto de mantener control humano sobre decisiones críticas.

## 15. Controles y alertas inteligentes (hipótesis a confirmar)

Ver también el catálogo completo de motores en [`REMISTAR-MOTORES-INTELIGENTES-V0.md`](../producto/REMISTAR-MOTORES-INTELIGENTES-V0.md) (motores 16 a 20). Controles previstos, todos como **alertas que requieren revisión humana, nunca decisiones automáticas**:

- Gasto sin comprobante.
- Comprobante potencialmente duplicado.
- Gasto superior al promedio histórico para ese tipo.
- Gasto fuera del horario o recorrido del servicio asociado.
- Combustible inconsistente con la distancia del servicio.
- Gasto presentado fuera del período de liquidación correspondiente.
- Gasto ya incluido en otra liquidación (posible doble conteo).
- Gasto refacturable que no fue incluido en la factura correspondiente.
- Liquidación con servicios que aún tienen gastos sin cerrar.
- Adelanto pendiente de descontar.
- Diferencia entre el importe estimado (si existía) y el real presentado.
- Rendición lista para revisión (todos sus gastos ya tienen estado final).
- Pago realizado sin comprobante o sin confirmación de recepción.

## 16. Excepciones (hipótesis a validar)

- Un chofer pierde o no tiene forma de conseguir un comprobante (ej. un pago informal): ¿existe alguna vía de excepción documentada?
- Un gasto corresponde a un servicio que fue cancelado después: ¿se reintegra igual?
- Un gasto se presenta mucho después del servicio (ej. semanas): ¿tiene un plazo límite de presentación?
- Un mismo gasto podría dividirse entre dos servicios (ej. combustible de un día con varios viajes): ¿se permite prorratear?

Todas estas excepciones están **sin resolver** y deben plantearse directamente a Gonzalo.

## 17. Auditoría

- Todo cambio de estado de un gasto (quién lo aprobó, observó o rechazó, y cuándo) debe quedar registrado, en línea con el principio general de trazabilidad del proyecto.
- Esto permite, más adelante, resolver un reclamo de un chofer ("¿por qué me rechazaron este gasto?") con el historial completo a la vista, y también alimenta el motor de detección de inconsistencias y duplicados.

## 18. Preguntas críticas para Gonzalo

> Desarrolladas en detalle en el bloque [`7bis` del cuestionario de Discovery](../discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md). Resumen de las más críticas para este proceso específico:

1. ¿Qué gastos puede pagar hoy un chofer de su bolsillo, y hay límites de monto?
2. ¿Todos los gastos requieren autorización previa, o el chofer puede decidir y rendir después?
3. ¿Los choferes presentan comprobante siempre? ¿Qué pasa cuando no lo tienen?
4. ¿Quién revisa y aprueba hoy estos gastos, y con qué criterio?
5. ¿Cómo se decide si un gasto se refactura al cliente en vez de asumirlo Remistar?
6. ¿Ha habido reclamos de choferes por gastos rechazados u observados? ¿Cómo se resolvieron?

## 19. Ejemplo ilustrativo

> ⚠️ **ESTE EJEMPLO ES COMPLETAMENTE FICTICIO Y NO REPRESENTA DATOS REALES DE REMISTAR.** Su único propósito es ilustrar cómo se leería un gasto rendido una vez que el proceso esté validado y diseñado. Ningún monto, nombre o cifra aquí debe tomarse como referencia real.

```
Gasto (EJEMPLO NO REAL)
Tipo: Combustible
Fecha: 03/06/2026 (ficticia)
Importe: $000 (ficticio)
Moneda: UYU (supuesto, a confirmar)
Servicio asociado: Servicio #2 (ficticio)
Vehículo: "Vehículo de Ejemplo B" (ficticio)
Cliente: "Empresa Ejemplo X" (ficticio)
Proveedor: "Estación de Servicio Ejemplo" (ficticio)
Comprobante: foto adjunta (ficticia)
Motivo: "Carga de combustible para traslado de larga distancia" (ficticio)
Autorización previa: no requerida (supuesto, a confirmar)
Responsable del pago: el chofer
¿Candidato a refacturar al cliente?: No (supuesto en este ejemplo — gasto incluido en el precio)

Estado: Aprobado
Revisado por: Gonzalo (ficticio en este ejemplo)
Incluido en liquidación: Liquidación semanal 01/06–07/06 (ficticia, ver REMISTAR-LIQUIDACION-CHOFERES-V0.md)
```
