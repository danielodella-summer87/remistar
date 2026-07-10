# Portal móvil del chofer — UI 1

> ⚠️ Este documento describe el **módulo móvil de demostración para choferes** de Remistar Intelligence: un prototipo mobile-first construido sobre el mismo proyecto Next.js del prototipo institucional/interno, con datos 100% mock, sin backend, sin base de datos real, sin autenticación real, sin GPS ni APIs externas con clave. Complementa (no reemplaza) `docs/producto/REMISTAR-PROTOTIPO-UI-1.md` y los documentos de Discovery. Ningún dato mostrado aquí es real de Remistar ni de un chofer real.

## 1. Objetivo

Mostrar cómo sería la experiencia de un chofer usando su teléfono para operar el día a día, sin exponerle la visión completa de la empresa: solo lo que necesita para responder, en cualquier momento, a nueve preguntas — qué servicio tengo ahora, dónde debo ir, a qué hora, quién es el pasajero, qué vehículo debo usar, qué debo informar, qué gasto debo rendir, qué problema debo reportar, y cuánto tengo pendiente de liquidación.

El portal vive en `/chofer` y es independiente del panel administrativo (`/app`): no reutiliza el sidebar ni el layout interno, tiene su propio shell mobile-first con header, selector de disponibilidad y barra de navegación inferior de 5 accesos.

## 2. Rutas creadas

| Ruta | Contenido |
|---|---|
| `/chofer` | Dashboard: servicio actual/próximo con único CTA, alertas personales, próximo servicio después, accesos a gastos y liquidación pendiente |
| `/chofer/servicios` | Listado con tabs Hoy/Próximos/Finalizados y filtros Todos/Pendientes/En curso/Finalizados, tarjetas (no tablas) |
| `/chofer/servicios/[id]` | Detalle completo: datos del viaje, acciones de estado, gastos asociados, historial de estados, contacto operativo |
| `/chofer/gastos` | Listado de gastos rendidos (mock + agregados en la sesión) |
| `/chofer/gastos/nuevo` | Formulario de rendición de un gasto nuevo |
| `/chofer/liquidaciones` | Liquidaciones del chofer, solo consulta, con desglose expandible |
| `/chofer/vehiculo` | Estado del vehículo asignado y acciones (kilometraje, combustible, falla, no disponible) |
| `/chofer/incidencias` | Listado de incidencias + formulario de reporte |
| `/chofer/perfil` | Datos del chofer (solo lectura) + restablecer datos demo |

Todas las rutas son mobile-first (probadas en 390×844). En desktop, el contenido se centra en un contenedor tipo "marco de teléfono" (`max-w-md`, bordes redondeados, sombra) en vez de deformarse a ancho completo.

## 3. Flujo y máquina de estados del servicio

El estado operativo que ve el chofer (`DriverServiceStatus`) es una capa separada del `ServiceStatus` administrativo: nunca lo sobrescribe. Mientras el chofer no interactúa, se calcula un estado inicial razonable a partir del estado administrativo (`defaultDriverServiceStatus`); apenas el chofer actúa, el cambio se guarda en `localStorage` como un "overlay" por servicio.

Orden estricto (10 estados, sin saltos posibles):

`Asignado → Pendiente de aceptación → Aceptado → En camino → En origen → Pasajero a bordo → En viaje → Finalizado → Pendiente de rendición → Cerrado`

En cada pantalla se muestra **un único CTA principal** que avanza exactamente un paso (`Aceptar servicio` → `Iniciar traslado` → `Llegué al origen` → `Pasajero a bordo` → `Iniciar viaje` → `Finalizar servicio` → `Marcar gastos rendidos` → `Cerrar servicio`). La interfaz no ofrece ninguna forma de saltear pasos: el botón siempre llama a "el siguiente estado válido", nunca a uno arbitrario. En estados terminales (`Cerrado`, `Rechazado`) no se muestra CTA.

**Rechazo:** solo disponible en `Asignado`/`Pendiente de aceptación`, exige elegir un motivo de una lista fija (No estoy disponible / Problema con el vehículo / No llego en hora / Necesito descanso / Otro) y queda registrado en el historial.

Cada cambio de estado registra una entrada de historial con una marca de tiempo demo (hora real del navegador) y se puede deshacer con "Reiniciar demo de este servicio" (borra el overlay de ese servicio puntual) o desde `/chofer/perfil` con "Restablecer datos demo" (borra todo).

## 4. Datos demo

Se **extendieron** los mocks existentes (nunca se duplicaron entidades): un chofer nuevo, un vehículo nuevo y datos relacionados a ambos.

| Entidad agregada | Detalle |
|---|---|
| Chofer | `drv-8` — Martín Silva |
| Vehículo | `veh-9` — Nissan Versa (SCG 4567), asignado a Martín Silva |
| Servicios | 6 (`srv-21`…`srv-26`): 1 hoy, 2 próximos, 3 finalizados |
| Gastos | 5 (`exp-15`…`exp-19`), en distintos estados (aprobado, sin comprobante, observado, incluido en liquidación) |
| Liquidaciones | 2 (`set-7` pendiente de revisión, `set-8` pagada sin confirmar recepción — para poder probar "Recibí el pago") |
| Incidencias | 3 (`lib/mock/incidents.ts`, entidad nueva ya que no existía en el modelo admin) |
| Alertas personales | Calculadas dinámicamente (no son registros fijos): servicio sin aceptar, cliente pide cartel, vehículo con service próximo, documentación por vencer, licencia por vencer, gasto sin comprobante, gasto observado, liquidación observada |

**Campos agregados** (opcionales, sin romper compatibilidad con el resto del prototipo):
- `Service`: `stops`, `passengerCount`, `luggageNotes`, `paymentMethod`, `specialInstructions` — necesarios para el detalle de servicio pedido (escalas, pasajeros, equipaje, forma de pago, indicaciones) y ausentes en el modelo original.
- `ExpenseReport`: `currency`, `provider`, `paymentMethod`, `reason` — necesarios para el formulario de rendición y ausentes en el modelo original. `DriverExpenseDraft` reutiliza el tipo `ExpenseReport` (no se creó un tipo paralelo).

**Tipos nuevos** (los 5 explícitamente pedidos, ninguno más): `DriverAvailabilityStatus`, `DriverServiceStatus`, `DriverIncident` (+ sus enums de tipo/gravedad/estado), `DriverExpenseDraft` (alias de `ExpenseReport`), `DriverPaymentConfirmation`.

## 5. Acciones funcionales (reales, en memoria/localStorage — no hay backend)

- Cambiar disponibilidad (Disponible / En servicio / En descanso / No disponible) — persiste.
- Aceptar o rechazar un servicio (con motivo) — persiste, con historial.
- Avanzar el estado de un servicio paso a paso — persiste, con historial y marca de tiempo.
- Llamar al pasajero (`tel:`), abrir origen/destino en Google Maps y en Waze — enlaces públicos por URL, **sin claves ni SDKs**.
- Informar espera adicional (minutos) — se agrega como nota al historial del servicio.
- Cargar un gasto nuevo, con validaciones (importe/fecha/tipo obligatorios; servicio obligatorio para categorías asociadas a un viaje puntual — peaje, combustible, estacionamiento, desayuno, almuerzo/cena; motivo obligatorio si no se adjunta comprobante). El comprobante es un selector de archivo **simulado**: el nombre se muestra en pantalla pero el archivo nunca se sube ni se guarda, y se pierde al salir.
- Consultar liquidaciones, descargar un comprobante demo (archivo de texto generado en el navegador, sin validez fiscal), confirmar "Recibí el pago" y enviar una observación a administración (no persiste entre recargas, es solo de la sesión de navegación actual). El chofer **no puede modificar** una liquidación.
- Actualizar kilometraje e informar nivel de combustible del vehículo asignado — persiste.
- Reportar una falla del vehículo o cualquier otra incidencia (9 tipos), con gravedad, descripción, kilometraje, foto demo, si puede continuar y si necesita asistencia inmediata — persiste.
- Marcar el vehículo como "no disponible" con motivo — persiste.
- Restablecer todos los datos demo desde `/chofer/perfil`.

## 6. localStorage

Todo el estado del portal vive en una única clave versionada `remistar:driver-demo:v1` (`lib/driver-store.ts`), leída/escrita con un store `useSyncExternalStore` (mismo patrón hidratación-segura que el sidebar del panel interno). Contiene: disponibilidad, overlay de estado + historial por servicio, gastos y incidencias creados en la sesión, confirmaciones de pago, y actualizaciones del vehículo (kilometraje, combustible, no disponibilidad). No se usa para nada más — ni sesión, ni datos de otros módulos.

## 7. Integración con el resto del prototipo

- **Panel interno:** en `/app/choferes`, al abrir la ficha de cualquier chofer aparece un botón secundario "Ver portal del chofer (demo)" que abre `/chofer` en una pestaña nueva, aclarando que muestra datos de demostración y no los del chofer específico que se estaba consultando.
- **Sitio público:** no se agregó al menú principal; se sumó un enlace discreto "Acceso choferes" en el pie de página, apuntando a `/chofer`.

## 8. Validaciones realizadas con Playwright

Se navegó `/chofer` y sus 8 subrutas en un navegador real (Chromium vía Playwright MCP) contra el servidor de desarrollo, verificando en cada pantalla la consola (0 errores, 0 warnings) y ausencia de errores de hidratación:

- Viewport mobile 390×844: dashboard, listado y detalle de servicios, gastos, liquidaciones, vehículo, incidencias y perfil.
- Barra de navegación inferior: 5 accesos, activa según ruta, permanece visible al hacer scroll (confirmado con scroll real de ventana: header fijo en `top: 0` y nav fijo en el borde inferior del viewport tras desplazar 706px).
- Cambio de disponibilidad, confirmado tras recargar la página.
- Aceptación de un servicio y avance completo de la máquina de estados (8 pasos, de "Pendiente de aceptación" a "Cerrado"), verificando que en cada paso solo existe un botón de acción y que el historial registra cada transición con hora real.
- Enlaces de `tel:`, Google Maps y Waze verificados por URL (sin clave).
- Alta de un gasto sin comprobante: se bloqueó el envío hasta completar el motivo; alta exitosa con motivo, redirección al listado y aparición inmediata de la tarjeta nueva.
- Liquidaciones: expansión de detalle, descarga de comprobante demo, confirmación de "Recibí el pago" (la tarjeta pasa a mostrar el badge "Pago confirmado" y el botón desaparece).
- Reporte de incidencia (tipo prefilled desde "Reportar falla" del vehículo) con descripción obligatoria.
- Actualización de kilometraje del vehículo, verificada en pantalla.
- Restablecimiento de datos demo desde el perfil, verificado que el kilometraje modificado vuelve a su valor original de mock.
- Vista de escritorio (1280×900): confirmado por medición de `getBoundingClientRect` que el contenido y la barra inferior quedan acotados al contenedor tipo "marco de teléfono" (~448px) y no se estiran al ancho completo de la ventana.
- Punto de entrada desde `/app/choferes` (botón secundario) y enlace discreto en el pie de página del sitio público.

### Error encontrado y corregido durante la construcción

Al crear la ruta dinámica `/chofer/servicios/[id]` como Server Component, la comprobación `service.driverId !== DEMO_DRIVER_ID` devolvía siempre `true` (404 incluso para servicios válidos). Causa: `DEMO_DRIVER_ID` se exportaba desde `lib/driver-store.ts`, un módulo marcado `"use client"` — en React Server Components, **todos** los exports de un módulo cliente se convierten en referencias opacas al importarse desde un Server Component, incluso constantes de texto simples, por lo que la comparación nunca podía ser verdadera. Se corrigió extrayendo la constante a `lib/driver-constants.ts` (sin directiva `"use client"`) e importándola directamente desde ahí en la página de servidor; `driver-store.ts` sigue reexportándola para los componentes cliente que ya la usaban.

## 9. Qué es funcional vs. qué es solo demo

**Funcional de verdad (sin backend):**
- Las 9 rutas y su navegación completa.
- Persistencia real en `localStorage` de disponibilidad, estados de servicio, gastos, incidencias, confirmaciones de pago y datos del vehículo.
- Validaciones reales de formulario (gasto, incidencia).
- Enlaces reales a `tel:`, Google Maps y Waze (públicos, sin clave).
- Descarga real de un archivo de texto como comprobante demo (generado en el navegador).

**Solo demo / no persiste:**
- El archivo de comprobante o foto adjuntado nunca se sube ni se guarda; se pierde al salir de la pantalla.
- La observación enviada desde liquidaciones no se guarda entre recargas.
- Los importes, saldos y fechas de liquidación son datos mock, no cálculos reales de rendición.
- No hay autenticación: cualquiera que abra `/chofer` ve el portal como si fuera Martín Silva.

## 10. Limitaciones actuales

- Un solo chofer demo (Martín Silva): el portal no permite elegir "iniciar sesión como" otro chofer.
- Sin GPS ni ubicación real: los enlaces de mapa abren la app de mapas del dispositivo con la dirección de texto, no una ruta calculada en tiempo real.
- Sin notificaciones push: el chofer debe abrir la app para enterarse de un servicio nuevo o un cambio.
- El historial de estados sintetizado para servicios que el chofer aún no tocó parte del estado administrativo actual (no reconstruye una secuencia de eventos reales pasados).
- Sin roles ni permisos: no hay diferencia entre "mi" chofer y otro chofer a nivel de acceso.

## 11. Lista de decisiones pendientes para Gonzalo

Antes de convertir este prototipo en algo real, hace falta validar con la operación:

1. ¿Quiénes son los choferes hoy — en relación de dependencia, monotributistas, tercerizados?
2. ¿Cuál es la modalidad laboral y los turnos habituales?
3. ¿Qué reglas rigen la disponibilidad (cuándo puede marcarse "no disponible", con cuánta anticipación)?
4. ¿Qué pasa realmente cuando un chofer rechaza un servicio? ¿Hay penalización, reasignación automática, aviso al cliente?
5. ¿Existen tiempos mínimos de aceptación o de presentación antes del viaje?
6. ¿Hay reglas de descanso obligatorio entre servicios (horas de manejo continuo, etc.)?
7. ¿Qué datos debería ver realmente el chofer del cliente y del servicio — nombre completo, empresa, motivo del viaje?
8. ¿El chofer debe ver el importe total que paga el cliente, o solo lo que le corresponde a él?
9. ¿Qué gastos están permitidos sin autorización previa y cuáles la requieren siempre?
10. ¿Cuál es la política real de comprobantes (foto basta, hay que conservar el original, hay un monto a partir del cual es obligatorio)?
11. ¿Cuál es la periodicidad real de liquidación (semanal, quincenal, mensual)?
12. ¿Cuál es la forma de pago real (transferencia, efectivo, otra)?
13. ¿Existen adelantos? ¿Con qué reglas y límites?
14. ¿El vehículo es propio del chofer o de Remistar, y cambia esto las reglas de gastos (combustible, lavado, reparaciones)?
15. ¿Con qué frecuencia se actualiza el kilometraje real, y quién lo valida?
16. ¿Se usa hoy algún tipo de ubicación (GPS, check-in manual) durante el servicio?
17. ¿Es una necesidad real a futuro tener GPS en vivo, o alcanza con confirmaciones manuales de estado como las de este prototipo?
18. ¿Qué tipo de notificaciones necesita el chofer (nuevo servicio, cambio de horario, aviso de liquidación) y por qué canal (push, WhatsApp, SMS)?
19. ¿Cuál es el protocolo real ante un accidente o incidente grave, y a quién se contacta primero?
20. ¿Cuál es el contacto de emergencia/operativo real (hoy se usa un número y nombre genérico "Central operativa Remistar" como placeholder)?

## 12. Riesgos si se avanza sin resolver lo anterior

- Diseñar una máquina de estados de servicio "real" sin validar los tiempos mínimos y las reglas de rechazo con la operación puede obligar a rehacerla.
- Exponerle al chofer el importe total del cliente sin definirlo con Gonzalo podría filtrar información comercial sensible.
- Construir persistencia real de gastos/comprobantes sin acordar la política de aprobación puede generar fricción operativa (choferes bloqueados por reglas mal calibradas).
- Prometer GPS o notificaciones push en una futura fase sin validar la necesidad real puede generar costo de desarrollo innecesario.

## 13. Próximos pasos recomendados

1. Revisar este prototipo con Gonzalo navegando `/chofer` en vivo desde un teléfono, en paralelo a las preguntas de la sección 11.
2. Una vez resueltas esas preguntas, decidir si la máquina de estados de 10 pasos se mantiene igual o se simplifica/ajusta a la operación real.
3. Decidir si el portal necesita autenticación real (login por chofer) antes de cualquier despliegue fuera de demo — hoy cualquiera que conoce la URL ve el portal.
4. Si se aprueba avanzar, definir la arquitectura de persistencia real (base de datos, notificaciones) recién después de validar las reglas de negocio — no antes.
5. Evaluar necesidad real de GPS/mapa en vivo como conversación separada de "mostrar dirección en Maps/Waze" (que ya funciona hoy sin costo ni clave).
