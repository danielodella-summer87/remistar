# REMISTAR — Discovery: diseño de persistencia real (Fase 1)

Diseño únicamente. Nada de esto está implementado todavía: no hay API routes,
no hay sincronización, no hay UI nueva, no hay migración de datos. El SQL
correspondiente está en
[`sql/REMISTAR-DISCOVERY-PERSISTENCE-1.sql`](sql/REMISTAR-DISCOVERY-PERSISTENCE-1.sql)
y debe ejecutarse manualmente en Supabase.

## Estado actual (auditado)

- **Store**: `lib/discovery/store.ts`. Única fuente de lectura/escritura del
  relevamiento en el navegador. Cachea en memoria y persiste en
  `window.localStorage` bajo la key `remistar:discovery:v1` en cada acción de
  `discoveryActions` (síncrono), con un flush de refuerzo al salir de la
  pantalla.
- **Estructura guardada** (`DiscoveryState`, mismo archivo): `version` (hoy
  `1`), `answers` (map `questionId -> DiscoveryAnswer`), `confirmedSections`,
  `recommendationDecisions`, `meetingMode`, `currentSectionSlug`,
  `currentQuestionId`, `reopenedSections`.
- **Tipos** (`lib/discovery/types.ts`): `DiscoveryAnswer` tiene `questionId`,
  `status` (`sin_responder | respondida | requiere_revision |
  pendiente_confirmar`), `value` (string | string[] | number | boolean |
  matriz booleana), `otherText`, `note`, `updatedAt`. No existe hoy ningún
  campo de identidad del entrevistado (nombre, empresa, teléfono, email) en
  ningún lugar del estado — es un dato nuevo que introduce este diseño.
- **Secciones y preguntas**: 20 secciones fijas en `lib/discovery/sections.ts`
  (`id` corto + `slug` de URL + metadata), y ~144 preguntas repartidas en
  `lib/discovery/questions/01-empresa.ts` … `20-automatizaciones.ts`, cada una
  con un `id` de tipo string kebab-case (ej. `empresa-razon-social`) y su
  `sectionId`. Son datos estáticos del código, no se persisten en DB.
- **Estado borrador/completado**: hoy solo existe a nivel de *sección*
  (`confirmedSections`, calculado en `lib/discovery/progress.ts` con estados
  como `no_iniciada`, `en_progreso`, `confirmada`, `requiere_revision`,
  `reabierta`). No existe un estado global de sesión tipo draft/completed —
  este diseño lo introduce a nivel `discovery_sessions`.
- **Fechas**: solo `updatedAt` por respuesta individual. No hay `created_at`
  ni fecha de finalización de la sesión completa hoy.
- **Reset**: manual y explícito, vía botón "Restablecer relevamiento"
  (`components/discovery/DiscoveryResetDialog.tsx`) con modal de
  confirmación → `discoveryActions.resetDemo()` → sobrescribe la key con el
  estado vacío. No hay ningún borrado automático.
- **Key `remistar:discovery:v1`**: única key relacionada al Discovery en todo
  el repo. Esta fase no la toca, no la invalida y no modifica su contenido.

## Arquitectura

- **Supabase Postgres es la fuente de verdad** una vez implementada la
  sincronización (fases futuras).
- **localStorage sigue siendo el respaldo local**: la UI sigue escribiendo
  ahí de forma síncrona como hoy, para que la app funcione sin latencia
  percibida y también sin conexión.
- **Toda escritura a Supabase pasa por una API route server-side de
  Next.js**, que usa el cliente de `lib/supabase/server.ts` (`SUPABASE_SECRET_KEY`).
  El navegador nunca escribe directo contra Supabase con la publishable key
  — reforzado además por RLS (ver `sql/REMISTAR-DISCOVERY-PERSISTENCE-1.sql`,
  sección 5).

## Flujo localStorage → API → Supabase (diseño, no implementado)

1. La UI sigue escribiendo en `localStorage` en cada acción, igual que hoy.
2. En paralelo (con debounce), la UI llama a una futura API route interna
   (ej. `POST /api/discovery/answers`) con `recovery_token` de la sesión +
   `questionId` + `value`.
3. La API route resuelve `session_id` a partir del `recovery_token`, y hace
   upsert en `discovery_answers` con
   `ON CONFLICT (session_id, question_id) DO UPDATE`.
4. Si la sesión no existe todavía en Supabase, la misma API la crea primero
   en `discovery_sessions` (draft) con los datos de identidad disponibles.

## Estrategia de sincronización

- Last-write-wins a nivel de respuesta individual, usando `updated_at`.
- El `recovery_token` se genera una única vez al iniciar el relevamiento y se
  guarda también en `localStorage` junto al resto del estado, para poder
  re-sincronizar tras un refresh sin perder la asociación a la sesión.
- Reintentos: cambios que no lograron sincronizarse quedan reflejados solo en
  localStorage hasta el próximo intento (flush periódico o próxima acción del
  usuario). No se implementa cola de reintentos en esta fase.

## Manejo de errores

- Cualquier error de red o de Supabase al sincronizar se degrada en
  silencio a "seguir funcionando solo con localStorage": nunca debe bloquear
  ni interrumpir la entrevista en curso.
- Errores de validación server-side (ej. `recovery_token` inexistente) se
  loguean del lado del servidor; no se exponen como error visible a mitad de
  entrevista.

## Conflictos

- El constraint único `(session_id, question_id)` en `discovery_answers` es
  la barrera principal: ninguna escritura puede crear una segunda fila para
  la misma pregunta de la misma sesión, y ninguna escritura sin el
  `session_id` correcto puede pisar la respuesta de otra sesión.
- Si el mismo `recovery_token` se abre en dos pestañas/dispositivos a la vez,
  gana la última escritura por pregunta (no hay merge de campos ni control
  de versiones a nivel de respuesta individual en esta fase).

## Recuperación desde otro navegador

- El `recovery_token` (UUID, columna separada de `id` en
  `discovery_sessions`) identifica la sesión y es lo que se comparte (ej. por
  link) para retomar el relevamiento desde otro dispositivo.
- Al abrir ese link, una futura API de recuperación (no implementada) traería
  todas las `discovery_answers` de esa sesión y reconstruiría el
  `DiscoveryState` para hidratar el `localStorage` de ese navegador.

## Plan de migración de la sesión local existente

- La sesión que hoy vive en `remistar:discovery:v1` en el navegador de Daniel
  no se toca en esta fase ni se sube a Supabase todavía.
- Cuando se implemente la sincronización (fase futura), el primer flush
  deberá: (1) crear una fila en `discovery_sessions` si ese navegador no
  tiene una sesión asociada todavía, (2) volcar cada entrada de `answers` del
  estado local como una fila de `discovery_answers`, (3) mantener
  `localStorage` intacto como respaldo — no se borra ni se limpia como parte
  de la migración.

## Pruebas de aceptación (para cuando se implemente la sincronización)

1. Responder una pregunta sin conexión a internet → la respuesta persiste en
   `localStorage` y no se pierde.
2. Recuperar la conexión → la respuesta pendiente se sincroniza a Supabase
   sin intervención manual.
3. Abrir el mismo `recovery_token` desde otro navegador → se recuperan todas
   las respuestas ya guardadas en Supabase.
4. Responder la misma pregunta en dos pestañas del mismo navegador → no se
   generan dos filas en `discovery_answers` (lo garantiza el constraint
   único); gana la última escritura.
5. Intentar escribir en `discovery_answers` directo desde el navegador con la
   publishable key → debe fallar (RLS deny-by-default, sección 5 del SQL).
6. Reiniciar el servidor de Next.js → la sesión sigue siendo recuperable por
   su `recovery_token`.
