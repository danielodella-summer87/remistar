# Remistar Intelligence

## Estado del documento
- Versión: V0.1 (auditoría de Discovery — incorpora liquidación, pagos y rendición de gastos de choferes)
- Fecha de creación: 2026-07-10
- Fecha de última actualización: 2026-07-10
- Estado del proyecto: **Fase 0 — Discovery**. No hay desarrollo iniciado. No hay decisiones técnicas tomadas.

## Registro de cambios
- **V0.1 (2026-07-10):** auditoría transversal para incorporar de forma explícita el proceso de **liquidación de choferes, pago a choferes, rendición y reintegro de gastos, adelantos, ajustes y comprobantes**. Se actualizaron los documentos existentes y se crearon dos documentos nuevos: [`operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md`](operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md) y [`operaciones/REMISTAR-RENDICION-GASTOS-V0.md`](operaciones/REMISTAR-RENDICION-GASTOS-V0.md). Ningún monto, porcentaje, período o regla real de Remistar fue asumido; todo quedó marcado como hipótesis pendiente de validación con Gonzalo.
- **V0 (2026-07-10):** versión inicial del set documental de Discovery.

---

## 1. Visión general

Remistar es una empresa de remises de Uruguay dirigida por **Gonzalo Larroque**. El proyecto "Remistar Intelligence" tiene como objetivo transformar la operación actual —fuertemente dependiente de la gestión manual y personal de Gonzalo— en un sistema compuesto por dos grandes capas:

1. **Sitio web institucional y comercial**: presenta la empresa, sus servicios, flota, confianza, traslados corporativos, aeropuerto, viajes y eventos, y capta solicitudes de nuevos clientes.
2. **Aplicación inteligente de gestión operativa**: administra de punta a punta la operación de la remisería (agenda, despacho, choferes, flota, mantenimiento, facturación, cobranza, CRM, calidad y rentabilidad), incluyendo de forma explícita **la liquidación y el pago a choferes, y la rendición, aprobación y reintegro de los gastos que los choferes adelantan de su bolsillo** para prestar el servicio.

Este repositorio, en su etapa actual, contiene **exclusivamente documentación de Discovery**. No se ha creado ningún proyecto de software, no hay dependencias instaladas y no se ha tomado ninguna decisión técnica definitiva.

## 2. El problema

Gonzalo concentra hoy, de forma personal, prácticamente toda la operación del negocio:

- Atención de consultas por llamada y WhatsApp.
- Recolección manual de datos de viajes, muchas veces incompletos.
- Cotización de servicios.
- Coordinación de fechas, horarios, orígenes y destinos.
- Verificación de disponibilidad de choferes y vehículos.
- Decisión de qué chofer y qué vehículo asignar a cada servicio.
- Reorganización de la agenda ante atrasos, cambios o imprevistos.
- Confirmación de servicios con clientes y choferes.
- Control de ejecución de los viajes.
- Facturación y cobranza a clientes, incluyendo cuentas corrientes.
- Coordinación de pagos y obligaciones.
- Liquidación y pago a los choferes, incluyendo el cálculo de lo que corresponde a cada uno por los servicios realizados.
- Revisión y aprobación de los gastos que los choferes pagan de su bolsillo (peajes, combustible, estacionamiento, comidas, alojamiento, reparaciones menores, etc.) y su reintegro dentro de la liquidación.
- Control de adelantos entregados a choferes y su descuento posterior.
- Decisión de qué gastos debe absorber Remistar y cuáles pueden refacturarse al cliente.
- Gestión de mantenimiento mecánico: services por fecha y kilometraje, talleres, reparaciones, repuestos y garantías.
- Control de patentes, seguros, habilitaciones, inspecciones y demás vencimientos.
- Determinación de qué vehículos están operativos, reservados, en reparación o fuera de servicio.
- Detección de oportunidades comerciales y gestión de clientes recurrentes/corporativos.
- Encuestas de satisfacción.
- Análisis de rentabilidad, costos y calidad del servicio.

Esta concentración de tareas en una sola persona genera **riesgo operativo, límite de crecimiento y pérdida de oportunidades comerciales**, además de exponer a la empresa a errores por sobrecarga (asignar un vehículo con documentación vencida, olvidar un vencimiento, perder seguimiento de una cuenta corriente, etc.).

## 3. Objetivo del proyecto

Construir un sistema que **reduzca la dependencia operativa de Gonzalo sin quitarle control**, convirtiendo su experiencia y conocimiento tácito en:

- procesos explícitos y documentados;
- datos estructurados;
- reglas de negocio;
- alertas;
- recomendaciones;
- asistentes inteligentes;
- historial y trazabilidad;
- indicadores de gestión;
- automatizaciones **supervisadas**, nunca ciegas.

El sistema debe acompañar y potenciar la decisión humana, no reemplazarla en los puntos críticos.

## 4. Alcance inicial (de esta etapa)

El alcance de esta etapa del proyecto es **exclusivamente documental**:

- Relevar y estructurar el conocimiento operativo real de Remistar antes de diseñar o construir nada.
- Producir un cuestionario de Discovery para entrevistar a Gonzalo.
- Producir un inventario de información necesaria y su estado (confirmada / pendiente / no disponible).
- Producir un mapa preliminar de procesos de punta a punta (a validar).
- Producir un catálogo preliminar de módulos funcionales.
- Producir un catálogo preliminar de motores inteligentes.
- Producir un roadmap por fases.
- Producir un diccionario inicial de términos y entidades del negocio (sin convertirlo aún en modelo de base de datos).
- Documentar en profundidad el proceso de **liquidación de choferes, pago a choferes y rendición de gastos** (comprobantes, aprobación, reintegro, adelantos, ajustes y refacturación al cliente), por ser un proceso financiero crítico hoy sostenido manualmente por Gonzalo.

**Explícitamente fuera de alcance en esta etapa:** cualquier desarrollo de software, elección de stack tecnológico, creación de proyecto Next.js, instalación de dependencias, diseño de base de datos, definición de esquema SQL, configuración de Supabase, autenticación, variables de entorno o despliegue.

## 5. Principios del proyecto

- Discovery obligatorio antes de desarrollar.
- No inventar procesos, campos, tarifas ni reglas de Remistar: todo lo no confirmado se marca explícitamente como supuesto o pendiente.
- Diferenciar con claridad datos **confirmados**, **supuestos** y **pendientes**.
- Diseñar primero el modelo operativo real, antes que cualquier pantalla o modelo de datos.
- Mantener aprobación humana para decisiones críticas (asignaciones, cobros, mantenimiento, **aprobación/rechazo de gastos de choferes, liquidaciones y pagos a choferes**).
- No realizar asignaciones automáticas irreversibles en la primera etapa.
- Ningún gasto presentado por un chofer, ninguna liquidación y ningún pago a chofer se aprueba, rechaza o ejecuta de forma automática: siempre requieren confirmación de un responsable administrativo (ver [`operaciones/REMISTAR-RENDICION-GASTOS-V0.md`](operaciones/REMISTAR-RENDICION-GASTOS-V0.md) y [`operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md`](operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md)).
- No crear un módulo de facturación propio si puede integrarse con el sistema real de facturación de Remistar.
- La aplicación debe ser web responsive antes de considerar apps móviles nativas.
- La interfaz del chofer debe ser extremadamente simple.
- Debe existir trazabilidad de cambios, asignaciones, cobros, mantenimientos y decisiones.
- La agenda debe estar conectada con la disponibilidad real de choferes y vehículos.
- Un vehículo en mantenimiento, con documentación vencida o con una alerta crítica no debe aparecer como disponible sin advertencia explícita.
- La cobranza debe estar conectada con clientes, servicios, facturas y condiciones comerciales.
- Las garantías deben relacionarse con reparaciones, talleres, repuestos, fechas, kilometraje y documentación.
- Los motores inteligentes deben **recomendar y explicar su criterio**, nunca ocultarlo ni decidir de forma opaca.
- Seguridad, roles y permisos se definirán luego del Discovery, según quiénes usarán realmente el sistema.
- No tocar ni reutilizar código de otros proyectos sin una decisión explícita.

## 6. Estado actual del proyecto

| Aspecto | Estado |
|---|---|
| Discovery operativo (entrevista a Gonzalo) | Pendiente — ver [`discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md`](discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md) |
| Inventario de información | Pendiente de completar — ver [`discovery/REMISTAR-DISCOVERY-2-inventario-informacion.md`](discovery/REMISTAR-DISCOVERY-2-inventario-informacion.md) |
| Mapa de procesos | Borrador V0 sin validar — ver [`operaciones/REMISTAR-MAPA-PROCESOS-V0.md`](operaciones/REMISTAR-MAPA-PROCESOS-V0.md) |
| Liquidación de choferes | Borrador V0 sin validar — ver [`operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md`](operaciones/REMISTAR-LIQUIDACION-CHOFERES-V0.md) |
| Rendición de gastos | Borrador V0 sin validar — ver [`operaciones/REMISTAR-RENDICION-GASTOS-V0.md`](operaciones/REMISTAR-RENDICION-GASTOS-V0.md) |
| Catálogo de módulos | Borrador V0 preliminar — ver [`producto/REMISTAR-MODULOS-V0.md`](producto/REMISTAR-MODULOS-V0.md) |
| Catálogo de motores inteligentes | Borrador V0 preliminar — ver [`producto/REMISTAR-MOTORES-INTELIGENTES-V0.md`](producto/REMISTAR-MOTORES-INTELIGENTES-V0.md) |
| Roadmap | Borrador V0 preliminar — ver [`producto/REMISTAR-ROADMAP-V0.md`](producto/REMISTAR-ROADMAP-V0.md) |
| Diccionario de términos | Borrador inicial — ver [`conocimiento/REMISTAR-DICCIONARIO-INICIAL.md`](conocimiento/REMISTAR-DICCIONARIO-INICIAL.md) |
| Arquitectura técnica | No iniciada. Se definirá después del Discovery. |
| Código / proyecto de software | **No existe.** No se ha creado ningún proyecto, no hay dependencias instaladas. |

## 7. Estructura del repositorio

```
docs/
  README.md                                          <- este documento
  discovery/
    REMISTAR-DISCOVERY-1-cuestionario-operativo.md    <- cuestionario para entrevistar a Gonzalo
    REMISTAR-DISCOVERY-2-inventario-informacion.md    <- inventario de información necesaria
  producto/
    REMISTAR-MODULOS-V0.md                            <- catálogo preliminar de módulos
    REMISTAR-MOTORES-INTELIGENTES-V0.md               <- catálogo preliminar de motores inteligentes
    REMISTAR-ROADMAP-V0.md                            <- roadmap por fases
  arquitectura/
    README.md                                         <- placeholder, pendiente de Discovery
  operaciones/
    REMISTAR-MAPA-PROCESOS-V0.md                       <- mapa preliminar de procesos punta a punta
    REMISTAR-LIQUIDACION-CHOFERES-V0.md                <- flujo preliminar de liquidación y pago a choferes
    REMISTAR-RENDICION-GASTOS-V0.md                    <- flujo preliminar de rendición y aprobación de gastos
  conocimiento/
    REMISTAR-DICCIONARIO-INICIAL.md                    <- términos y entidades preliminares del negocio
```

## 8. Próximos pasos sugeridos

1. Revisar y ajustar este set documental junto con Daniel.
2. Realizar la entrevista de Discovery con Gonzalo usando el cuestionario.
3. Completar el inventario de información con datos reales, ejemplos, planillas y capturas.
4. Validar y corregir el mapa de procesos con Gonzalo.
5. Recién después de validado el Discovery, iniciar la etapa de arquitectura y diseño técnico.
