# Liquidación de Choferes V0 (Preliminar)

> ⚠️ **ESTE DOCUMENTO ES UN BORRADOR SIN VALIDAR.** Describe una hipótesis de proceso construida a partir del contexto de negocio provisto por Daniel, sin haber realizado aún la entrevista de Discovery con Gonzalo sobre este tema específico (ver bloque [`7bis` del cuestionario](../discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md)). Ningún monto, porcentaje, período o regla aquí descrito es real. Todo debe validarse con Gonzalo antes de diseñar cualquier pantalla o modelo de datos.

## 1. Objetivo

Definir, como hipótesis de trabajo, el proceso por el cual Remistar determina y paga periódicamente (o por servicio) lo que corresponde a cada chofer, consolidando el importe generado por los servicios realizados, los gastos que el chofer adelantó de su bolsillo y que fueron aprobados, los adelantos de dinero recibidos y los ajustes manuales que correspondan.

Este proceso es hoy, según lo relevado con Daniel, una de las cargas administrativas y financieras más pesadas para Gonzalo, y una de las menos documentadas.

## 2. Alcance

**Incluye:** el cálculo del importe correspondiente al chofer por servicios, la incorporación de gastos reintegrables ya aprobados, la aplicación de adelantos y ajustes, el cálculo del saldo final, su aprobación, su pago y la confirmación de recepción.

**No incluye (documentado aparte):** el detalle de cómo se presentan, revisan, aprueban o rechazan los gastos individuales — eso se documenta en [`REMISTAR-RENDICION-GASTOS-V0.md`](REMISTAR-RENDICION-GASTOS-V0.md). Este documento asume que, al momento de liquidar, ya existe un conjunto de gastos con un estado definido (aprobado, rechazado, etc.).

**No incluye tampoco:** cálculo de sueldos, cargas sociales, aportes u obligaciones laborales formales — eso corresponde a un dominio contable/legal que debe relevarse aparte y no se asume aquí.

## 3. Participantes

- **Chofer:** genera servicios y gastos; recibe adelantos, ajustes y el pago final; en la etapa madura del sistema, confirma la recepción del pago.
- **Gonzalo (o responsable administrativo que se defina):** calcula, revisa, aprueba y ejecuta el pago de cada liquidación. **Es quien tiene la última palabra en todo momento**, según los principios del proyecto.
- **(Rol pendiente de confirmar):** si existe o existirá alguien más con permiso para intervenir en este proceso (ej. un administrativo, un contador) es algo a relevar; hoy se asume que todo pasa por Gonzalo.

## 4. Flujo completo (hipótesis)

```
1. Se ejecutan servicios durante el período (o se completa un único servicio, si la liquidación es por viaje)
        │
2. El chofer presenta gastos asociados a esos servicios (ver REMISTAR-RENDICION-GASTOS-V0.md)
        │
3. Los gastos se revisan y quedan en un estado final: aprobado / aprobado parcialmente / rechazado
        │
4. Se cierra el período de liquidación (o se cierra el servicio, si es liquidación por viaje)
        │
5. Se genera un borrador de liquidación: se consolidan servicios + gastos aprobados + adelantos + ajustes
        │
6. Gonzalo revisa el borrador (puede corregirlo, agregar un ajuste, marcarlo como observado)
        │
7. Gonzalo aprueba la liquidación
        │
8. La liquidación queda lista para pagar
        │
9. Se ejecuta el pago (total o parcial) al chofer
        │
10. Se registra el comprobante de pago
        │
11. El chofer confirma la recepción (si el sistema lo contempla)
        │
12. La liquidación se cierra
        │
13. El costo real reflejado en la liquidación impacta el cálculo de rentabilidad de cada servicio incluido
```

> ⚠️ Este flujo es una hipótesis de secuencia. No está confirmado si el cierre de gastos (paso 3) siempre ocurre antes del cierre del período (paso 4), ni si distintos choferes podrían tener periodicidades distintas conviviendo al mismo tiempo.

## 5. Entradas

- Servicios ejecutados por el chofer en el período (o el servicio individual, si aplica).
- Criterio de pago vigente para ese chofer (comisión, jornal, tarifa fija, u otro — ver [`REMISTAR-DICCIONARIO-INICIAL.md`](../conocimiento/REMISTAR-DICCIONARIO-INICIAL.md), término "Criterio de liquidación").
- Gastos ya aprobados (o aprobados parcialmente) presentados por el chofer en el período.
- Adelantos pendientes de descontar.
- Ajustes manuales pendientes de aplicar.

## 6. Salidas

- Un registro de Liquidación con su desglose completo, su estado y su saldo final.
- Un Pago (o varios, si es parcial) asociado a esa liquidación.
- Un Comprobante de pago.
- Datos que alimentan el cálculo de Rentabilidad de cada servicio incluido (ver [`REMISTAR-MODULOS-V0.md`](../producto/REMISTAR-MODULOS-V0.md), módulo 19).

## 7. Fórmula conceptual (hipótesis — NO validada)

```
  importe o comisión por servicios realizados
+ gastos reintegrables aprobados
+ ajustes a favor del chofer
− adelantos recibidos
− descuentos o ajustes autorizados
= saldo final a pagar al chofer
```

Esta fórmula fue provista como punto de partida y **debe tratarse exclusivamente como hipótesis de trabajo**. No se debe implementar, ni siquiera a nivel de diseño funcional detallado, sin confirmarla con Gonzalo.

## 8. Variantes pendientes de validar

La fórmula anterior puede no aplicar igual para todos los casos. Variables identificadas que podrían modificarla, todas pendientes de confirmar:

- **Tipo de chofer** (empleado, tercerizado, freelance ocasional).
- **Vínculo contractual** (relación de dependencia, monotributo, otro).
- **Vehículo propio del chofer o de Remistar** (podría cambiar qué gastos son reintegrables — ej. si el chofer usa su propio auto, el combustible podría tratarse distinto que si usa un vehículo de la empresa).
- **Esquema de pago:** comisión/porcentaje sobre el importe cobrado, jornal fijo, tarifa fija por viaje, sueldo mensual, o combinación.
- **Tipo de viaje** (¿un viaje corporativo se liquida distinto que uno urbano ocasional?).
- **Período de liquidación** (¿todos los choferes se liquidan igual, o cada uno tiene su propia periodicidad?).
- **Gastos incluidos o separados** (¿el reintegro de gastos se paga junto con el importe por servicios, o en un movimiento aparte?).

## 9. Estados de la liquidación

1. `Borrador` — generada automáticamente o a mano, aún no revisada.
2. `Pendiente de rendiciones` — hay gastos del período todavía sin resolver (ver documento de rendición).
3. `Pendiente de revisión` — todos los gastos están resueltos; falta que Gonzalo revise el conjunto.
4. `Observada` — Gonzalo encontró algo que corregir antes de aprobar.
5. `Aprobada` — Gonzalo confirmó el cálculo y el saldo.
6. `Lista para pagar` — aprobada y a la espera de ejecutar el pago.
7. `Pagada parcialmente` — se pagó una parte del saldo (a validar en qué casos ocurre esto).
8. `Pagada` — el saldo fue pagado en su totalidad.
9. `Cerrada` — pagada, con comprobante y (si aplica) confirmación del chofer; no admite más cambios.
10. `Reabierta por ajuste` — una liquidación cerrada requirió una corrección posterior (ej. se detectó un error o llegó un gasto tardío).

> ⚠️ Este listado de estados fue provisto como hipótesis y debe validarse con Gonzalo: puede que en la práctica algunos estados no se usen, o que falte alguno.

## 10. Aprobaciones

- **Ningún borrador de liquidación se convierte en pago sin aprobación explícita de Gonzalo (o del responsable administrativo que se defina).**
- La aprobación de la liquidación es un paso distinto de la aprobación de cada gasto individual (que ocurre antes, en el proceso de rendición).
- Reabrir una liquidación cerrada (estado "Reabierta por ajuste") también requiere aprobación explícita, dado que afecta un registro que ya se consideraba definitivo.

## 11. Excepciones (hipótesis a validar)

- Un chofer deja la empresa con una liquidación a mitad de período: ¿se liquida el período incompleto?
- Un gasto llega después de que el período ya se cerró: ¿se incluye en la siguiente liquidación, o se reabre la anterior?
- El saldo da negativo (el chofer debe dinero a Remistar, ej. por un adelanto mayor a lo generado): ¿se arrastra al siguiente período, se reclama de otra forma?
- Dos servicios del mismo período tienen criterios de pago distintos (ej. cambió la comisión a mitad de mes): ¿cómo se resuelve?

Todas estas excepciones están **sin resolver** y deben plantearse directamente a Gonzalo.

## 12. Relación con Servicios

Cada Servicio ejecutado debe poder trazarse hasta la Liquidación en la que fue incluido, y desde ahí hasta el pago concreto que le correspondió al chofer por ese servicio en particular. Sin esta trazabilidad no es posible calcular la rentabilidad real de un servicio individual (ver [`REMISTAR-MAPA-PROCESOS-V0.md`](REMISTAR-MAPA-PROCESOS-V0.md), sección "D. Liquidación, pago y rendición de gastos de choferes").

## 13. Relación con Facturación y Cobranza

La Liquidación al chofer es conceptualmente independiente de la Factura al cliente: una remite a lo que Remistar paga, la otra a lo que Remistar cobra. Sin embargo, ambas comparten el mismo Servicio como punto de origen, y un Gasto puede ser simultáneamente reintegrable al chofer y refacturable al cliente. Este cruce debe diseñarse con cuidado para no perder ni duplicar información entre ambos procesos.

## 14. Relación con Rentabilidad

El margen "real" de un servicio (a diferencia del margen preliminar estimado al cotizar) **no puede calcularse correctamente sin los datos de la Liquidación**: el costo real de un servicio incluye lo pagado al chofer y los gastos reintegrados que no fueron refacturados al cliente. Por este motivo, el roadmap del proyecto ([`REMISTAR-ROADMAP-V0.md`](../producto/REMISTAR-ROADMAP-V0.md)) ubica la rentabilidad avanzada en una fase posterior a la de liquidación, no antes.

## 15. Riesgos

- **Inventar la fórmula de cálculo** sin validarla es el riesgo principal de este documento; por eso se marca explícitamente como hipótesis en cada sección.
- **Asumir un único criterio de pago para todos los choferes** cuando en la práctica podría variar por chofer, vínculo o tipo de vehículo.
- **Tratar la liquidación como un proceso aislado** de la rendición de gastos, cuando en realidad están fuertemente acoplados.
- **Automatizar la aprobación o el pago** violaría el principio del proyecto de mantener aprobación humana en decisiones críticas.
- **Falta de trazabilidad** entre servicio, gasto, liquidación y pago, que impediría calcular rentabilidad real o resolver un reclamo de un chofer.

## 16. Preguntas críticas para Gonzalo

> Estas preguntas están desarrolladas en detalle en el bloque [`7bis` del cuestionario de Discovery](../discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md). Se resumen aquí las más críticas para este proceso específico:

1. ¿Cómo se calcula hoy, en la práctica, lo que le corresponde a cada chofer por un servicio?
2. ¿Ese criterio es el mismo para todos los choferes, o varía?
3. ¿Con qué periodicidad se liquida hoy?
4. ¿Cómo se controla que un adelanto efectivamente se descuente después?
5. ¿Existe hoy algún registro (aunque sea informal) de liquidaciones ya hechas? ¿Puede compartirse un ejemplo real?
6. ¿Cómo se le paga hoy al chofer el saldo final, y queda algún comprobante o confirmación de que lo recibió?

## 17. Ejemplo ilustrativo

> ⚠️ **ESTE EJEMPLO ES COMPLETAMENTE FICTICIO Y NO REPRESENTA DATOS REALES DE REMISTAR.** Su único propósito es ilustrar cómo se leería una liquidación una vez que el proceso esté validado y diseñado. Ningún monto, nombre o cifra aquí debe tomarse como referencia real.

```
Liquidación (EJEMPLO NO REAL)
Chofer: "Chofer de Ejemplo A"
Período: 01/06/2026 al 07/06/2026 (semanal, hipotético)
Estado: Pagada

Servicios incluidos: 5
  - Servicio #1 (02/06) — Cliente "Empresa Ejemplo X" — origen/destino de ejemplo — importe generado: $0000 (ficticio)
  - Servicio #2 (03/06) — ...
  - (resto omitido por brevedad, todos ficticios)

Criterio de cálculo aplicado: "comisión hipotética del XX% sobre importe generado" (NO REAL, solo ilustrativo)
Importe correspondiente al chofer por servicios: $0000 (ficticio)

Gastos presentados: 3
  - Peaje (02/06) — $000 (ficticio) — comprobante: sí — estado: aprobado
  - Combustible (03/06) — $000 (ficticio) — comprobante: sí — estado: aprobado
  - Almuerzo (05/06) — $000 (ficticio) — comprobante: no — estado: observado (pendiente de comprobante)

Adelantos: $000 (ficticio, entregado el 01/06)
Ajustes: ninguno en este ejemplo

Saldo final (ficticio) = importe por servicios + gastos aprobados − adelanto = $0000 (ficticio)

Forma y fecha de pago: transferencia, 08/06 (ficticia)
Comprobante: adjunto (ficticio)
Responsable: Gonzalo (ficticio en este ejemplo)
Confirmación de recepción: pendiente (ficticia)
```
