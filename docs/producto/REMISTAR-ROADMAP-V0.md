# Roadmap V0 (Preliminar)

> ⚠️ Roadmap preliminar por fases. El contenido, alcance y orden de cada fase **puede cambiar** una vez completado el Discovery. No implica compromiso de fechas ni de alcance definitivo. Ninguna fase posterior a la Fase 0 debe iniciarse sin que la fase anterior haya cumplido sus criterios de salida.

## Cómo leer este roadmap
- **Objetivo de la fase:** qué se busca lograr.
- **Incluye (preliminar):** módulos/motores candidatos a esa fase, referenciando [`REMISTAR-MODULOS-V0.md`](REMISTAR-MODULOS-V0.md) y [`REMISTAR-MOTORES-INTELIGENTES-V0.md`](REMISTAR-MOTORES-INTELIGENTES-V0.md).
- **Depende de:** qué fase(s) previa(s) deben estar completas.
- **Criterio de salida:** condición mínima para considerar la fase terminada y avanzar a la siguiente.

---

## Fase 0 — Discovery
- **Objetivo:** entender en profundidad y sin supuestos la operación real de Remistar antes de diseñar o construir nada.
- **Incluye (preliminar):**
  - Entrevista con Gonzalo usando el cuestionario operativo.
  - Completar el inventario de información.
  - Validar y corregir el mapa de procesos.
  - Recolectar ejemplos reales (WhatsApp, planillas, facturas, documentación de flota).
- **Depende de:** nada (es la fase inicial).
- **Criterio de salida:** el mapa de procesos está validado por Gonzalo; el inventario de información tiene la mayoría de sus ítems críticos en estado `Confirmado`; existe claridad sobre qué sistema de facturación usar (propio vs. integración).

## Fase 1 — Sitio institucional y captación
- **Objetivo:** dar presencia digital profesional a Remistar y empezar a captar solicitudes de forma más estructurada.
- **Incluye (preliminar):** Sitio institucional; primera versión de Captura inteligente de consultas (posiblemente aún muy simple).
- **Depende de:** Fase 0 completa, al menos en lo referido a servicios, flota y marca.
- **Criterio de salida:** el sitio está publicado con información real y validada por Gonzalo; existe un canal de captación de consultas conectado (aunque sea a un formulario simple).

## Fase 2 — Agenda y operación básica
- **Objetivo:** reemplazar la agenda informal actual por un registro centralizado de servicios.
- **Incluye (preliminar):** Solicitudes y cotizaciones; Agenda de servicios; Clientes, pasajeros y cuentas corporativas (versión básica).
- **Depende de:** Fase 0 (procesos y reglas de cotización validados); idealmente Fase 1 en curso.
- **Criterio de salida:** todos los servicios nuevos se cargan en el sistema; Gonzalo puede ver su agenda completa sin depender de otro soporte paralelo.

## Fase 3 — Choferes y flota
- **Objetivo:** digitalizar el registro de choferes y vehículos, y habilitar el despacho asistido.
- **Incluye (preliminar):** Choferes (dentro de Despacho); Gestión de flota; Despacho y asignación de choferes y vehículos; Portal simple para choferes.
- **Depende de:** Fase 2 (la agenda debe existir para poder asignar contra ella).
- **Criterio de salida:** cada servicio agendado tiene chofer y vehículo asignado en el sistema; los choferes confirman sus servicios desde el portal.

## Fase 4 — Mantenimiento, obligaciones, liquidación de choferes y cobranza
- **Objetivo:** cubrir las cargas administrativas y de control de flota que hoy recaen enteramente en Gonzalo, incluyendo el ciclo completo de liquidación y pago a choferes.
- **Incluye (preliminar):** Mantenimiento preventivo y correctivo; Services por tiempo y kilometraje; Talleres, reparaciones y repuestos; Garantías; Patentes, seguros, habilitaciones y vencimientos; Gastos y obligaciones; Facturación y cobranza; Cuentas corrientes; **Liquidación de choferes; Rendición y aprobación de gastos; Adelantos y ajustes; Pagos y comprobantes**.
- **Depende de:** Fase 3 (la flota y choferes ya deben estar digitalizados; el portal del chofer debe existir como canal de carga de gastos).
- **Criterio de salida:** ningún vencimiento ni mantenimiento pendiente depende de la memoria de Gonzalo; la cobranza y cuentas corrientes están reflejadas en el sistema; **todo servicio ejecutado puede liquidarse sin recurrir a un registro externo, y todo gasto presentado por un chofer queda trazado desde su presentación hasta su reintegro o rechazo.**
- **Nota de secuenciación interna:** dentro de esta fase, Liquidación de choferes y Rendición y aprobación de gastos deben construirse en conjunto (no como funcionalidades aisladas), ya que la liquidación consume directamente los gastos aprobados, los adelantos y los ajustes.

## Fase 5 — Inteligencia operativa
- **Objetivo:** introducir los motores inteligentes de mayor impacto operativo directo, siempre con recomendación explicada y aprobación humana.
- **Incluye (preliminar):** Recomendación de chofer; Recomendación de vehículo; Detección de conflictos de agenda; Prevención de atrasos; Mantenimiento preventivo (motor); Control de vencimientos (motor); Alertas operativas; **Motor preliminar de liquidación; Motor de control de rendiciones; Detector de duplicados; Detector de inconsistencias; Recomendación de gastos refacturables**; Resumen diario de prioridades.
- **Depende de:** Fase 4 (los motores necesitan datos reales y estructurados de flota, mantenimiento, agenda, liquidaciones y rendiciones para ser confiables). **En particular, los motores de liquidación y rendiciones no deben construirse hasta que exista un historial real de liquidaciones hechas manualmente en el sistema durante la Fase 4, para poder contrastar sus recomendaciones contra el criterio real de Gonzalo.**
- **Criterio de salida:** los motores generan recomendaciones consistentes con el criterio real de Gonzalo, validadas en paralelo durante un período de convivencia con el proceso manual.

## Fase 6 — CRM, calidad, oportunidades y rentabilidad avanzada
- **Objetivo:** cerrar el círculo comercial y financiero: detectar oportunidades, medir calidad y analizar rentabilidad real con datos ya acumulados.
- **Incluye (preliminar):** CRM de oportunidades; Encuestas y calidad; Cotización asistida (motor, si no se adelantó antes); Control de cobranza (motor); Recomendación de próxima acción comercial; Detección de oportunidades; Análisis de calidad; Rentabilidad (módulo y motor); **Control de diferencias de rentabilidad (motor)**; Reportes y tablero de control.
- **Depende de:** Fase 5 (requiere historial operativo y financiero suficiente para ser útil).
- **Condición explícita:** la rentabilidad avanzada (margen real por servicio, cliente, vehículo y chofer) **no puede calcularse de forma confiable sin datos operativos consistentes de liquidación y rendición de gastos** (Fase 4). Calcular rentabilidad antes de eso produciría un margen "real" que en verdad ignora lo pagado a choferes y los gastos reintegrados, dando una cifra engañosa.
- **Criterio de salida:** existen reportes de rentabilidad y calidad basados en datos reales acumulados en las fases anteriores, no en supuestos.

---

## Notas generales
- Este orden de fases es una **hipótesis inicial de secuenciación por dependencias reales**, no una preferencia arbitraria: por ejemplo, no tiene sentido construir motores inteligentes (Fase 5) antes de tener datos reales de flota y agenda (Fases 2-4).
- Es posible que, tras el Discovery, se identifiquen quick wins que ameriten adelantar algún módulo puntual entre fases (por ejemplo, un control simple de vencimientos podría adelantarse si se detecta como urgente).
- Ninguna fase debe iniciarse sin revisión conjunta con Gonzalo y Daniel del alcance específico de esa fase.
