# Mapa de Procesos V0 (Preliminar)

> ⚠️ **ESTE DOCUMENTO ES UN BORRADOR SIN VALIDAR.** Fue construido a partir del contexto de negocio provisto por Daniel, sin haber realizado aún la entrevista de Discovery con Gonzalo. Ningún paso, orden, regla o criterio aquí descrito debe considerarse definitivo. **Debe validarse, corregirse y completarse con Gonzalo** usando [`REMISTAR-DISCOVERY-1-cuestionario-operativo.md`](../discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md).

## Propósito
Proponer una primera hipótesis de flujo de punta a punta —desde que llega una consulta hasta que el servicio se cobra y se cierra— para tener una base concreta sobre la cual conversar con Gonzalo, en lugar de partir de una hoja en blanco. Cada paso debe leerse como "supuesto a confirmar", no como un hecho.

## Convenciones
- 🟢 Paso que parece de bajo riesgo de estar mal interpretado.
- 🟡 Paso que probablemente requiera ajustes importantes tras la entrevista.
- 🔴 Paso construido casi enteramente por suposición; alta probabilidad de estar incompleto o incorrecto.

---

## Macro-flujo de punta a punta

```
1. Consulta entrante
        │
2. Captura de datos del pedido
        │
3. Cotización
        │
4. Confirmación del cliente
        │
5. Agenda del servicio
        │
6. Verificación de disponibilidad (chofer + vehículo)
        │
7. Asignación de chofer y vehículo
        │
8. Confirmación con chofer y con cliente
        │
9. Ejecución del servicio
        │
10. Manejo de imprevistos (si ocurren, en paralelo a 9)
        │
11. Cierre operativo del servicio
        │
        ├──> 11bis. Gastos presentados por el chofer (si los hubo) ──> Revisión y aprobación ──┐
        │                                                                                       │
12. Facturación (al cliente) <───────────────────── posible gasto refacturable ─────────────────┤
        │                                                                                       │
13. Cobranza                                                                                     │
        │                                                                                       ▼
14. Postventa (encuesta / seguimiento / oportunidad comercial)                    15. Liquidación del chofer
                                                                                    (agrupa servicios + gastos
                                                                                     aprobados + adelantos + ajustes)
                                                                                                   │
                                                                                    16. Aprobación de la liquidación
                                                                                                   │
                                                                                    17. Pago al chofer
                                                                                                   │
                                                                                    18. Confirmación de recepción
                                                                                                   │
                                                                                    19. Contabilización e impacto
                                                                                        en rentabilidad del servicio
```

> ⚠️ El tramo 11bis → 19 es una hipótesis de secuencia basada en el flujo conceptual "servicio finalizado → gastos presentados → revisión → cierre del servicio → liquidación → aprobación → pago → confirmación → contabilización y rentabilidad". **No está validado con Gonzalo.** En particular, no está confirmado si el "cierre del servicio" ocurre antes o después de revisar los gastos del chofer, ni si la liquidación se dispara por servicio, por período, o ambas cosas según el chofer (ver [`REMISTAR-LIQUIDACION-CHOFERES-V0.md`](REMISTAR-LIQUIDACION-CHOFERES-V0.md) y [`REMISTAR-RENDICION-GASTOS-V0.md`](REMISTAR-RENDICION-GASTOS-V0.md) para el detalle completo de este subproceso).

En paralelo y de forma transversal a todo el flujo anterior:

```
A. Gestión de flota (mantenimiento, vencimientos, disponibilidad real)
B. Gestión de obligaciones y gastos (gastos operativos generales de Remistar)
C. Gestión de cuentas corrientes
D. Liquidación, pago y rendición de gastos de choferes (ver documentos dedicados)
```

---

## Detalle por etapa

### 1. Consulta entrante 🟡
- Entra por WhatsApp, llamada, u otro canal (a confirmar cuáles y en qué proporción).
- **Supuesto:** hoy no hay un canal único ni centralizado; Gonzalo atiende personalmente la mayoría.
- **A validar:** canales reales, horarios de atención, qué pasa fuera de horario.

### 2. Captura de datos del pedido 🔴
- **Supuesto:** los datos mínimos serían origen, destino, fecha, hora, cantidad de pasajeros, tipo de servicio.
- **Problema identificado por el negocio:** los datos suelen llegar incompletos.
- **A validar:** cuáles son realmente los datos mínimos indispensables, y qué se hace hoy cuando faltan.

### 3. Cotización 🔴
- **Supuesto:** la cotización depende de distancia/zona, tipo de vehículo y posiblemente horario.
- **A validar:** lógica real de tarifas, si existe tarifario o es 100% caso a caso.

### 4. Confirmación del cliente 🟡
- **Supuesto:** la confirmación ocurre por el mismo canal de la consulta (ej. WhatsApp), de forma informal.
- **A validar:** qué se considera "confirmado" formalmente (¿un mensaje alcanza? ¿hace falta seña o pago?).

### 5. Agenda del servicio 🟡
- **Supuesto:** el servicio queda registrado en algún soporte (agenda, Excel, memoria de Gonzalo).
- **A validar:** soporte real utilizado, estructura de esa agenda, cómo se visualiza el día/semana.

### 6. Verificación de disponibilidad (chofer + vehículo) 🔴
- **Supuesto:** Gonzalo cruza mentalmente la agenda, la ubicación aproximada de choferes/vehículos y el estado de mantenimiento/documentación de cada vehículo.
- **Este es uno de los pasos más críticos y menos documentados del proceso actual.**
- **A validar:** cómo sabe hoy Gonzalo, en el momento, qué chofer y qué vehículo están realmente libres y aptos.

### 7. Asignación de chofer y vehículo 🔴
- **Supuesto:** la asignación combina cercanía geográfica, idoneidad del chofer para el cliente/servicio, y disponibilidad del vehículo adecuado.
- **Principio del proyecto:** ningún sistema futuro debe hacer esta asignación de forma automática e irreversible en la primera etapa; debe recomendar y Gonzalo (u otro rol autorizado) confirma.
- **A validar:** criterios reales de idoneidad, peso relativo de cada criterio.

### 8. Confirmación con chofer y con cliente 🟡
- **Supuesto:** se avisa al chofer el servicio asignado y se confirma al cliente el chofer/vehículo asignado, probablemente por WhatsApp o llamada.
- **A validar:** contenido exacto de esas confirmaciones, con cuánta anticipación se hacen.

### 9. Ejecución del servicio 🔴
- **Supuesto:** hoy no hay seguimiento en tiempo real; Gonzalo se entera de atrasos o problemas de forma reactiva (el chofer o el cliente avisan).
- **A validar:** existencia de algún mecanismo de seguimiento, aunque sea informal.

### 10. Manejo de imprevistos 🔴
- **Supuesto:** ante un atraso, cambio o cancelación, Gonzalo reorganiza manualmente la agenda y puede tener que reasignar chofer/vehículo sobre la marcha.
- **A validar:** tipos de imprevistos más comunes y cómo se resuelven hoy en la práctica.

### 11. Cierre operativo del servicio 🟡
- **Supuesto:** el servicio se marca como completado de alguna forma (aunque sea mentalmente), quedando disponible el chofer/vehículo nuevamente.
- **A validar:** si existe algún registro formal de cierre o kilometraje recorrido, y si este cierre operativo es el mismo momento en que se habilita al chofer a presentar gastos, o son eventos separados.

### 11bis. Gastos presentados por el chofer 🔴
- **Supuesto:** si el chofer pagó algún gasto de su bolsillo durante el servicio (peaje, combustible, comida, estacionamiento, alojamiento, etc.), lo presenta con su comprobante para su revisión.
- **Supuesto:** esta presentación puede ocurrir servicio a servicio, o acumulada y presentada recién al cierre del período de liquidación.
- **A validar:** momento real en que el chofer rinde estos gastos, y si necesita autorización previa para algunos de ellos. Ver detalle completo en [`REMISTAR-RENDICION-GASTOS-V0.md`](REMISTAR-RENDICION-GASTOS-V0.md).

### 11ter. Revisión y aprobación de gastos 🔴
- **Supuesto:** Gonzalo (u otro responsable administrativo) revisa cada gasto presentado y decide aprobarlo, aprobarlo parcialmente, observarlo o rechazarlo.
- **Regla de negocio explícita del proyecto (no negociable sin decisión consciente):** ningún gasto se aprueba, rechaza o reintegra de forma automática.
- **A validar:** criterio real de aprobación, y si existen gastos que se refacturan al cliente en lugar de (o además de) reintegrarse al chofer.

### 12. Facturación 🔴
- **Supuesto:** puede existir o no un sistema de facturación electrónica ya vigente (obligatorio en Uruguay para ciertos contribuyentes).
- **Principio del proyecto:** si existe un sistema real de facturación, este proyecto debe integrarse con él y no crear uno propio.
- **A validar:** sistema actual (si lo hay), periodicidad de facturación (por servicio vs. agrupada mensual para corporativos).

### 13. Cobranza 🔴
- **Supuesto:** convive el cobro inmediato (efectivo/transferencia) con cuentas corrientes para clientes corporativos o recurrentes.
- **A validar:** cómo se controla hoy quién debe y cuánto, y cómo se gestionan los atrasos.

### 14. Postventa 🔴
- **Supuesto:** hoy no existe un proceso formal de encuesta de satisfacción ni seguimiento comercial sistemático.
- **A validar:** si existe algo, aunque sea informal (ej. preguntar "¿todo bien?" por WhatsApp).

### 15. Liquidación del chofer 🔴
- **Supuesto:** se genera un borrador que agrupa, por chofer y período, los servicios realizados, los gastos aprobados, los adelantos y los ajustes.
- **Detalle completo:** ver [`REMISTAR-LIQUIDACION-CHOFERES-V0.md`](REMISTAR-LIQUIDACION-CHOFERES-V0.md), secciones 4 y 7.

### 16. Aprobación de la liquidación 🔴
- **Regla de negocio explícita del proyecto:** ninguna liquidación pasa a pago sin aprobación explícita de Gonzalo (o del responsable administrativo que se defina).
- **Detalle completo:** ver [`REMISTAR-LIQUIDACION-CHOFERES-V0.md`](REMISTAR-LIQUIDACION-CHOFERES-V0.md), sección 10.

### 17. Pago al chofer 🔴
- **Supuesto:** el saldo aprobado se paga en efectivo, transferencia u otro medio, total o parcialmente.
- **A validar:** medio de pago real utilizado hoy y si conviven distintos medios según el chofer.

### 18. Confirmación de recepción 🔴
- **Supuesto:** hoy no existe necesariamente un registro formal de que el chofer confirmó haber recibido el pago.
- **A validar:** si esto se hace hoy de alguna forma (verbal, WhatsApp) o es inexistente.

### 19. Contabilización e impacto en rentabilidad 🔴
- **Supuesto:** el costo reflejado en la liquidación (pago al chofer + gastos reintegrados no refacturados) debería incorporarse al cálculo de rentabilidad de cada servicio incluido.
- **Detalle completo:** ver [`REMISTAR-LIQUIDACION-CHOFERES-V0.md`](REMISTAR-LIQUIDACION-CHOFERES-V0.md), sección 14.

---

## Procesos transversales

### A. Gestión de flota (mantenimiento, vencimientos, disponibilidad real) 🔴
- **Supuesto:** el estado real de cada vehículo (operativo / reservado / en reparación / fuera de servicio) vive en el conocimiento de Gonzalo, no en un registro estructurado.
- **Regla de negocio explícita del proyecto (no negociable sin decisión consciente):** un vehículo con mantenimiento pendiente, documentación vencida o alerta crítica no debe poder asignarse sin una advertencia explícita.
- **A validar:** proceso real de control de services, vencimientos, talleres, reparaciones y garantías (ver preguntas 14 a 17 del cuestionario).

### B. Gestión de obligaciones y gastos 🔴
- **Supuesto:** los gastos (combustible, mantenimiento, sueldos, seguros) se registran de forma informal o no se registran de forma centralizada.
- **A validar:** qué se registra hoy y cómo.

### C. Gestión de cuentas corrientes 🟡
- **Supuesto:** existe al menos un control informal de qué clientes corporativos deben dinero y cuánto.
- **A validar:** mecanismo real de control y cobro.

### D. Liquidación, pago y rendición de gastos de choferes 🔴
- **Supuesto:** periódicamente (¿diaria, semanal, quincenal, mensual, por viaje?) Gonzalo consolida por chofer: los servicios realizados, los gastos aprobados y reintegrables, los adelantos entregados y eventuales ajustes, para llegar a un saldo final a pagar.
- **Fórmula conceptual preliminar (hipótesis, NO validada):**
  ```
  importe o comisión por servicios realizados
  + gastos reintegrables aprobados
  + ajustes a favor del chofer
  − adelantos recibidos
  − descuentos o ajustes autorizados
  = saldo final a pagar al chofer
  ```
  Esta fórmula puede variar según tipo de chofer, vínculo contractual, vehículo propio o de Remistar, esquema de pago (comisión, jornal, porcentaje, tarifa fija), tipo de viaje, período de liquidación, y si los gastos van incluidos o separados del pago principal. **Todo esto está pendiente de confirmar con Gonzalo.**
- **Este es uno de los procesos financieros más críticos y menos documentados hoy: vive en el criterio y la memoria de Gonzalo.**
- **A validar:** todo el proceso, en detalle, en [`REMISTAR-LIQUIDACION-CHOFERES-V0.md`](REMISTAR-LIQUIDACION-CHOFERES-V0.md) y [`REMISTAR-RENDICION-GASTOS-V0.md`](REMISTAR-RENDICION-GASTOS-V0.md).

---

## Preguntas abiertas que este mapa no resuelve
1. ¿Cuál es el verdadero "cuello de botella" del día a día de Gonzalo: la captación, la asignación, la cobranza, o el control de flota?
2. ¿Existen hoy procesos que funcionen bien y que **no deban tocarse**, solo digitalizarse?
3. ¿Qué porcentaje de servicios son recurrentes/predecibles vs. espontáneos? Esto cambia mucho el diseño de la agenda y del motor de asignación.
4. ¿Qué tan crítico es el tiempo real (minuto a minuto) vs. una planificación diaria/semanal?
5. ¿La liquidación de choferes se dispara por servicio individual, por período fijo, o depende de cada chofer? ¿Conviven distintas modalidades hoy?
6. ¿Los gastos que paga el chofer de su bolsillo se rinden inmediatamente después de cada servicio, o se acumulan y se presentan todos juntos al cierre del período de liquidación?

## Próximos pasos
1. Validar este mapa punto por punto con Gonzalo.
2. Marcar cada supuesto (🔴/🟡) como confirmado, corregido o descartado.
3. Solo después de esa validación, este documento puede evolucionar a una versión V1 que sirva de base para el diseño funcional.
