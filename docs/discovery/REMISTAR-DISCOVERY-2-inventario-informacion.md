# Discovery 2 — Inventario de Información

## Propósito
Registrar de forma sistemática **qué información existe, dónde está, quién la tiene y qué tan completa/confiable es**, antes de diseñar cualquier modelo de datos o proceso. Este inventario se alimenta directamente de las respuestas obtenidas con [`REMISTAR-DISCOVERY-1-cuestionario-operativo.md`](REMISTAR-DISCOVERY-1-cuestionario-operativo.md) y de los documentos/ejemplos que aporte Gonzalo.

## Cómo usar esta tabla
- **Estado** debe ser siempre uno de: `Confirmado`, `Pendiente`, `No disponible`.
  - `Confirmado`: el dato existe, se vio o se recibió un ejemplo real.
  - `Pendiente`: se sabe que existe pero todavía no se relevó o no se recibió el ejemplo.
  - `No disponible`: no existe hoy en ninguna forma (ni siquiera informal); habrá que crearlo desde cero.
- **Impacto si falta** debe explicar qué parte del proyecto queda bloqueada o debe basarse en supuestos si esa información no aparece.
- Esta tabla es un documento vivo: se actualiza a medida que avanza el Discovery.

---

## Tabla de inventario

| # | Información necesaria | Fuente | Responsable | Formato | Sensibilidad | Estado | Impacto si falta |
|---|---|---|---|---|---|---|---|
| 1 | Listado de servicios ofrecidos y sus reglas | Gonzalo | Gonzalo | A definir (verbal / documento) | Baja | Pendiente | No se puede definir el catálogo de servicios del sitio ni las reglas de cotización |
| 2 | Tarifario / lógica de precios | Gonzalo | Gonzalo | A definir | Media (comercial) | Pendiente | No se puede diseñar el motor de cotización asistida |
| 3 | Listado de clientes actuales (particulares y corporativos) | Gonzalo / registros propios | Gonzalo | A definir (Excel, cuaderno, ninguno) | Alta (datos personales) | Pendiente | No se puede diseñar el modelo de clientes ni migrar histórico |
| 4 | Ejemplos reales de conversaciones de WhatsApp (consulta → confirmación) | WhatsApp de Gonzalo | Gonzalo | Capturas de pantalla | Alta (datos personales de terceros) | Pendiente | No se puede diseñar bien la captura inteligente de solicitudes |
| 5 | Agenda actual de servicios | Gonzalo | Gonzalo | A definir (papel, Excel, memoria) | Media | Pendiente | No se puede validar el mapa de procesos de agenda ni el modelo de datos de servicios |
| 6 | Listado de choferes y sus datos (licencia, disponibilidad, especialidad) | Gonzalo | Gonzalo | A definir | Alta (datos personales) | Pendiente | No se puede diseñar el módulo de choferes ni el motor de recomendación de chofer |
| 7 | Listado de vehículos y sus datos (marca, modelo, patente, capacidad, km) | Gonzalo | Gonzalo | A definir | Media | Pendiente | No se puede diseñar el módulo de flota ni el motor de recomendación de vehículo |
| 8 | Reglas reales de asignación (cómo decide Gonzalo hoy) | Gonzalo (entrevista) | Gonzalo | Verbal, a documentar | Baja | Pendiente | Es el insumo crítico para el motor de despacho/asignación; sin esto se corre riesgo de inventar reglas |
| 9 | Sistema de facturación actualmente usado (si existe) | Gonzalo / contador | Gonzalo | A definir | Alta (fiscal) | Pendiente | Define si se integra con un sistema externo o si el alcance debe reconsiderarse (principio: no crear facturación propia si se puede integrar) |
| 10 | Ejemplo real de factura emitida | Gonzalo / contador | Gonzalo | PDF / papel | Alta (fiscal, datos de cliente) | Pendiente | No se puede modelar correctamente el dominio de facturación |
| 11 | Registro actual de cobranza / cuentas corrientes | Gonzalo | Gonzalo | A definir (Excel, cuaderno, ninguno) | Alta (financiera) | Pendiente | No se puede diseñar el módulo de cuentas corrientes ni el motor de control de cobranza |
| 12 | Historial de mantenimiento por vehículo | Gonzalo / talleres | Gonzalo | A definir | Baja/Media | Pendiente | No se puede diseñar el módulo de mantenimiento preventivo ni el motor asociado |
| 13 | Listado de talleres habituales y condiciones de trabajo con ellos | Gonzalo | Gonzalo | Verbal | Baja | Pendiente | No se puede diseñar el módulo de talleres y reparaciones |
| 14 | Ejemplos de comprobantes de reparación / repuestos / garantía | Gonzalo / talleres | Gonzalo | Papel / foto | Media | Pendiente | No se puede diseñar el módulo de garantías con precisión |
| 15 | Documentación de vencimientos por vehículo (cédula verde, seguro, inspección, habilitación) | Gonzalo | Gonzalo | Papel / foto | Alta (legal) | Pendiente | No se puede diseñar el módulo de vencimientos ni el motor de control de vencimientos |
| 16 | Documentación de vencimientos por chofer (libreta profesional, carné de salud, antecedentes) | Gonzalo | Gonzalo | Papel / foto | Alta (datos personales, legal) | Pendiente | Igual que el ítem anterior, aplicado a choferes |
| 17 | Registro de gastos operativos actuales | Gonzalo | Gonzalo | A definir | Alta (financiera) | Pendiente | No se puede diseñar el módulo de gastos ni el motor de rentabilidad |
| 18 | Encuestas o feedback de clientes existente | Gonzalo | Gonzalo | A definir (si existe) | Media | Pendiente | No se puede diseñar el módulo de calidad con base real |
| 19 | Marca: logo, colores, material institucional existente | Gonzalo | Gonzalo | Archivos digitales / impresos | Baja | Pendiente | Afecta únicamente al sitio institucional, no a la operación |
| 20 | Convenios comerciales vigentes (hoteles, agencias, empresas) | Gonzalo | Gonzalo | Verbal / contratos | Media | Pendiente | No se puede diseñar bien el CRM de oportunidades ni las condiciones de clientes corporativos |
| 21 | Sistemas digitales actualmente en uso (WhatsApp, Excel, calendario, otros) | Gonzalo | Gonzalo | Verbal | Baja | Pendiente | Define requisitos de integración o migración de datos |
| 22 | Perfil de usuarios futuros del sistema (choferes, administrativos) y su nivel digital | Gonzalo | Gonzalo | Verbal | Baja | Pendiente | Condiciona el diseño de UX, especialmente el portal de choferes |
| 23 | Normativa/regulación de remises en Uruguay aplicable (habilitaciones, organismos) | Fuente pública / Gonzalo | Gonzalo | Documentos oficiales | Baja | Pendiente | No debe asumirse; afecta el modelo de vencimientos y habilitaciones |
| 24 | Ejemplo real y completo de una liquidación de chofer ya realizada | Gonzalo | Gonzalo | A definir (Excel, cuaderno, ninguno) | Alta (datos personales y financieros de terceros) | Pendiente | No se puede diseñar el módulo de liquidación ni validar la fórmula conceptual de cálculo |
| 25 | Criterio real de pago a cada chofer (comisión, jornal, tarifa fija, mixto) por tipo de vínculo | Gonzalo | Gonzalo | Verbal, a documentar | Media | Pendiente | Es el insumo crítico para el motor preliminar de liquidación; sin esto se corre riesgo de inventar reglas de pago |
| 26 | Registro histórico de adelantos entregados a choferes | Gonzalo | Gonzalo | A definir (Excel, cuaderno, ninguno) | Alta (financiera) | Pendiente | No se puede diseñar el módulo de adelantos y ajustes |
| 27 | Ejemplos reales de comprobantes de gastos presentados por choferes (peaje, combustible, comida, alojamiento, etc.) | Choferes / Gonzalo | Gonzalo | Foto / papel | Media | Pendiente | No se puede diseñar bien la carga de comprobantes en el portal del chofer ni el módulo de rendición |
| 28 | Política real (aunque informal) de qué gastos están permitidos, con o sin autorización previa, y límites de monto | Gonzalo | Gonzalo | Verbal | Baja | Pendiente | No se puede diseñar el flujo de aprobación/observación/rechazo de gastos sin inventar reglas |
| 29 | Criterio real de qué gastos asume Remistar y cuáles se refacturan al cliente | Gonzalo | Gonzalo | Verbal | Media (comercial) | Pendiente | No se puede diseñar la clasificación de gastos ni el motor de recomendación de refacturación |
| 30 | Forma y medio de pago final al chofer, y si existe algún comprobante o confirmación de recepción | Gonzalo | Gonzalo | Verbal | Alta (financiera) | Pendiente | No se puede diseñar el cierre del ciclo de liquidación ni su trazabilidad |

---

## Notas
- Esta tabla se debe completar y actualizar durante y después de la entrevista de Discovery.
- Ninguna fila debe quedar en `Confirmado` sin haber visto o recibido efectivamente el dato/documento correspondiente.
- Los ítems marcados con sensibilidad `Alta` requieren definir, más adelante, cómo se van a resguardar (esto se abordará en la etapa de seguridad y permisos, posterior al Discovery, según el principio del proyecto de no anticipar decisiones técnicas).
