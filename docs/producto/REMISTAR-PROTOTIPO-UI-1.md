# Prototipo UI 1 — Sitio institucional y aplicación interna demo

> ⚠️ Este documento describe la **primera versión visual y funcional** de Remistar Intelligence: un prototipo de Next.js con datos 100% mock, sin backend, sin base de datos real y sin integraciones externas. Complementa (no reemplaza) los documentos de Discovery en `docs/discovery/`, `docs/operaciones/` y `docs/producto/REMISTAR-MODULOS-V0.md`. Ningún dato mostrado aquí es real de Remistar.

## 1. Alcance implementado

Se construyó un proyecto Next.js 16 (App Router, TypeScript, Tailwind CSS v4) con dos capas claramente separadas:

1. **Sitio institucional público** (7 rutas) — presenta la empresa, sus servicios y su flota, y permite iniciar una solicitud de traslado demo.
2. **Aplicación interna "Remistar Intelligence"** (15 rutas bajo `/app`) — cubre los 14 módulos operativos definidos en `docs/producto/REMISTAR-MODULOS-V0.md`, con datos mock relacionados entre sí, sidebar colapsable, panel de detalle y, en el caso de rendición de gastos, acciones interactivas reales (en memoria).

Todo funciona con datos de demostración generados en `lib/mock/`, con relaciones cruzadas coherentes (un servicio referencia a un cliente, un chofer, un vehículo, sus gastos, su factura y su liquidación reales dentro del propio set de datos mock).

## 2. Rutas creadas

### Sitio público (`app/(public)/`)

| Ruta | Contenido |
|---|---|
| `/` | Home: hero, servicios principales, por qué Remistar, empresas, flota, cómo funciona, CTA final |
| `/servicios` | Detalle de los 8 tipos de servicio |
| `/empresas` | Programa corporativo + listado de clientes corporativos demo |
| `/flota` | Grilla completa de la flota (8 vehículos demo) |
| `/nosotros` | Posicionamiento institucional y valores |
| `/contacto` | Formulario de contacto funcional (demo, sin backend) + datos de contacto + WhatsApp |
| `/solicitar-traslado` | Formulario de 6 pasos + resumen + confirmación demo |

### Aplicación interna (`app/app/`)

| Ruta | Módulo |
|---|---|
| `/app` | Dashboard operativo |
| `/app/agenda` | Agenda diaria y semanal con detección de conflictos |
| `/app/servicios` | Listado y detalle completo de servicios |
| `/app/clientes` | Clientes particulares y corporativos |
| `/app/choferes` | Choferes: disponibilidad, desempeño, documentación |
| `/app/vehiculos` | Flota: estado, documentación, mantenimiento |
| `/app/mantenimiento` | Tablero de mantenimiento, services, reparaciones, garantías |
| `/app/facturacion` | Servicios por facturar y facturas emitidas |
| `/app/cobranza` | Cuentas corrientes, deuda, promesas de pago |
| `/app/liquidaciones` | Liquidaciones de choferes con "revisión inteligente" |
| `/app/gastos` | Rendición de gastos con acciones interactivas (aprobar/rechazar/observar) |
| `/app/oportunidades` | Pipeline comercial (kanban por etapa) |
| `/app/calidad` | Satisfacción, puntualidad, reclamos, ranking de choferes |
| `/app/alertas` | Centralización de las 10 alertas demo, con filtros |
| `/app/configuracion` | Perfil, entorno demo, preferencias funcionales, integraciones pendientes |

Se usó `app/app/` (no `app/(app)/`) a propósito, para que la URL real sea `/app/...`, distinguiendo con claridad el sitio público del entorno interno, tal como se pidió.

## 3. Decisiones de diseño

- **Identidad visual:** marca textual "Remistar" + subtítulo "Movilidad y coordinación inteligente"; sin logo definitivo. Paleta sobria: fondo claro, sidebar petrol oscuro (`petrol-900`), acentos verde operativo (`opgreen-500/600`) para confirmaciones y azul petróleo para la marca. Estados con colores moderados (ámbar/rojo/verde/celeste), nunca saturados.
- **Tipografía:** Inter vía `next/font/google`.
- **Componentes compartidos** (`components/shared/`): `AppShell`, `Sidebar`, `Topbar`, `PageHeader`, `MetricCard`, `StatusBadge`, `AlertCard`, `DataTable`, `EmptyState`, `DemoBadge`, `RecommendationCard`, `FilterBar`/`SearchInput`/`FilterChip`, `DetailDrawer`, `Timeline`, `SectionCard` — reutilizados en todas las páginas internas para mantener consistencia visual y evitar duplicar lógica.
- **Componentes de dominio** (`components/domain/`): un `*DetailContent` por entidad (Servicio, Cliente, Chofer, Vehículo, Factura, Liquidación, Gasto), reutilizados tanto desde el dashboard como desde el listado completo de cada módulo.
- **Sidebar colapsable:** estado persistido en `localStorage` vía `useSyncExternalStore` (hook `usePersistedBoolean`), evitando el antipatrón de `setState` dentro de un efecto y garantizando que el primer render en servidor y cliente coincidan (sin errores de hidratación). Incluye tooltips al pasar el mouse en modo colapsado y un drawer propio en mobile.
- **Un solo CTA principal por pantalla**, como se pidió (por ejemplo, "Nuevo servicio" en el dashboard/agenda/servicios, "Solicitar traslado" en el sitio público).
- **Asistente operativo demo:** `lib/mock/recommendations.ts` implementa reglas simples (servicio sin chofer, vehículo con service próximo, cliente con deuda, gasto sin comprobante, liquidación lista para revisar, oportunidad sin seguimiento, posible superposición de agenda) — explícitamente **sin IA real**, cada tarjeta indica qué detectó, por qué, y aclara "Recomendación demo".
- **Rendición de gastos interactiva:** las acciones (aprobar, aprobar parcial, rechazar, observar, pedir comprobante, marcar reintegrado) mutan un estado React local (`useState`) inicializado desde los datos mock; los cambios se reflejan en vivo en KPIs, filtros y la tabla, pero **no persisten** entre recargas ni tienen backend, tal como se pidió.
- **Ningún proceso crítico se automatiza:** liquidaciones muestran una card "Revisión inteligente" con advertencias generadas por reglas (gastos rechazados, liquidación observada, gastos que superan el importe del período, falta de confirmación de recepción), pero nunca aprueban ni pagan solas.

## 4. Datos mock utilizados

Centralizados en `lib/mock/` (uno por dominio) y expuestos vía `lib/mock/index.ts`, con IDs relacionados entre sí:

| Entidad | Cantidad |
|---|---|
| Clientes | 8 (5 corporativos, 3 particulares) |
| Pasajeros | 10 |
| Choferes | 7 |
| Vehículos | 8 |
| Servicios | 20 |
| Cotizaciones | 5 |
| Facturas | 10 |
| Movimientos de cobranza | 8 |
| Liquidaciones de choferes | 6 |
| Gastos rendidos | 14 |
| Registros de mantenimiento | 8 |
| Oportunidades comerciales | 6 |
| Encuestas de calidad | 8 |
| Alertas | 10 |

Las fechas relevantes (servicios de hoy, vencimientos próximos, períodos de liquidación) se calculan de forma **relativa a la fecha real del sistema** (`lib/mock/dates.ts`), para que el dashboard se sienta "vivo" sin importar cuándo se abra el prototipo. Todo dato visible está marcado como demo mediante el componente `DemoBadge` en cada página, y los montos usan formato de moneda `es-UY` sin asumir que sean cifras reales.

Modelos TypeScript completos en `lib/types.ts`: `Client`, `Passenger`, `Driver`, `Vehicle`, `Service`, `Quote`, `Invoice`, `Collection`, `DriverSettlement`, `ExpenseReport`, `MaintenanceRecord`, `CommercialOpportunity`, `Survey`, `Alert`, más los enums/uniones de estado correspondientes — deliberadamente **no** son un esquema de base de datos definitivo.

## 5. Validaciones realizadas con Playwright

Se navegó la aplicación en un navegador real (Chromium vía Playwright MCP) contra el servidor de producción (`next start`), verificando en cada pantalla la consola (sin errores ni warnings):

- **Sitio público:** home completa, navegación entre las 7 páginas, formulario de contacto (validación + envío + confirmación), formulario de solicitar traslado completo de punta a punta (6 pasos + validaciones bloqueando el avance + resumen + confirmación demo).
- **Aplicación interna:** dashboard (KPIs, próximos servicios, asistente operativo, estado de flota, administración, oportunidades), agenda (vista diaria y semanal, navegación de fechas), servicios (filtros por estado/riesgo/búsqueda + panel de detalle con historial, gastos, facturación, liquidación y rentabilidad preliminar), clientes, choferes, vehículos, mantenimiento, facturación, cobranza, liquidaciones (detalle + card de revisión inteligente), **gastos con acciones reales** (se aprobó un gasto y se verificó que el KPI, el filtro y la tabla se actualizaron en vivo), oportunidades (kanban), calidad, alertas (filtros por criticidad/módulo/estado) y configuración (toggles persistidos, verificados tras recarga).
- **Sidebar:** colapsado/expandido, persistencia tras recargar la página completa (sin parpadeo de hidratación), drawer en mobile.
- **Responsive:** vista mobile (390px) probada en dashboard y en una tabla ancha (servicios), confirmando que el scroll horizontal queda contenido dentro de la tabla y no rompe el layout de la página (`document.documentElement.scrollWidth === clientWidth`).

### Incidente durante la validación (resuelto)

Durante la validación se detectó que un proceso `next-server` anterior había quedado corriendo en el puerto 3100 desde antes de aplicar unas correcciones, y como `pkill -f "next start"` no coincidía con el nombre real del proceso (`next-server`), las pruebas siguientes siguieron golpeando el build viejo sin que fuera evidente. Se identificó por el PID/hora de inicio del proceso, se mató explícitamente (`pkill -f "next-server"`), se reconstruyó y se relanzó verificando el PID nuevo antes de continuar. Todas las validaciones reportadas en este documento corresponden al build final, confirmado contra el proceso correcto.

### Errores encontrados y corregidos durante la validación

1. **KPI "Alertas críticas" del dashboard** calculaba en realidad servicios de riesgo alto, no alertas con severidad crítica — corregido en `lib/selectors.ts` (`dashboardKpis`) para contar alertas con `severity === "critica"`.
2. **Categorías de gasto sin traducir** (`compra_urgente`, `estacionamiento`) se mostraban en crudo en 4 componentes (`ServiceDetailContent`, `DriverDetailContent`, `InvoiceDetailContent`, `SettlementDetailContent`) en vez de usar `expenseCategoryLabels`. Corregido en los cuatro lugares.
3. **Badge "Sin comprobante" duplicado** en el detalle de un gasto pendiente de comprobante (aparecía una vez por el estado y otra vez por la falta de comprobante). Corregido en `ExpenseDetailContent` para no repetir la badge cuando el estado ya es "Sin comprobante".

## 6. Resultado de TypeScript y build

```
npx tsc --noEmit   → sin errores
npx eslint .       → sin errores ni warnings
npm run build      → compilación exitosa, 22 rutas generadas como contenido estático
```

Rutas generadas por `next build` (todas `○ Static`):
`/`, `/_not-found`, `/app`, `/app/agenda`, `/app/alertas`, `/app/calidad`, `/app/choferes`, `/app/clientes`, `/app/cobranza`, `/app/configuracion`, `/app/facturacion`, `/app/gastos`, `/app/liquidaciones`, `/app/mantenimiento`, `/app/oportunidades`, `/app/servicios`, `/app/vehiculos`, `/contacto`, `/empresas`, `/flota`, `/nosotros`, `/servicios`, `/solicitar-traslado`.

## 7. Qué es funcional vs. qué es solo mock

**Funcional de verdad (sin backend):**
- Navegación completa entre las 22 rutas.
- Sidebar colapsable con persistencia real en `localStorage`.
- Formulario de contacto y de solicitud de traslado, con validación real en cada paso.
- Filtros, búsqueda y panel de detalle en todos los listados internos.
- Acciones de aprobar/observar/rechazar gastos, con mutación real de estado en memoria (React), reflejada en KPIs y filtros.
- Dos preferencias en Configuración, persistidas en `localStorage`.

**Solo mock / no persiste:**
- Todos los datos (clientes, choferes, vehículos, servicios, facturas, liquidaciones, gastos, alertas, etc.) son estáticos y relacionados entre sí, pero no se guardan cambios entre recargas salvo lo indicado arriba.
- "Nuevo servicio" (dashboard/agenda/servicios) muestra una confirmación demo pero no agrega el servicio a los datos.
- El asistente operativo y la revisión inteligente de liquidaciones son reglas simples sobre datos mock, no IA real.
- El formulario de solicitud de traslado y el de contacto no envían datos a ningún sistema.

## 8. Limitaciones actuales

- **Título de pestaña en páginas internas:** las páginas bajo `/app/*` son Client Components (por su interactividad: filtros, drawers, estado local), y Next.js no permite exportar `metadata` desde un Client Component. Por eso el título de la pestaña del navegador en esas rutas cae al valor por defecto del layout ("Panel interno · Remistar") en vez de un título específico por página. Se podría resolver más adelante separando cada página en un wrapper de servidor (con `metadata`) + un componente cliente interno, pero se dejó fuera de esta etapa por alcance.
- **Sin roles ni permisos:** toda la aplicación asume un único usuario ("Gonzalo Larroque"), como quedó documentado en `/app/configuracion`.
- **Sin persistencia real:** todo cambio de estado (gastos aprobados, formularios enviados) vive solo en memoria del navegador durante la sesión.
- **Sin mapas ni geolocalización real:** las "ubicaciones demo" de vehículos son texto estático.
- **La fórmula de liquidación, los criterios de asignación y las reglas de negocio siguen sin validar con Gonzalo** — este prototipo visual no reemplaza esa validación, solo la hace más concreta de discutir.

## 9. Próximos pasos recomendados

1. Revisar el prototipo con Gonzalo (recorriendo `/app` en vivo) para contrastar visualmente cada módulo contra la operación real, en paralelo al Discovery ya documentado.
2. Priorizar, junto con Daniel, qué módulos avanzan primero a integrarse con datos reales (siguiendo `docs/producto/REMISTAR-ROADMAP-V0.md`).
3. Decidir arquitectura de persistencia real (base de datos, autenticación, roles) recién después de validar el modelo de datos con el Discovery — no antes.
4. Si se aprueba avanzar, resolver la limitación de metadata por página y sumar accesibilidad adicional (foco visible, navegación por teclado en el drawer, lectura de tablas por lector de pantalla) antes de un despliegue real.
5. Reemplazar progresivamente `lib/mock/*` por datos reales, manteniendo la misma forma de `lib/types.ts` como punto de partida (no como esquema final).
