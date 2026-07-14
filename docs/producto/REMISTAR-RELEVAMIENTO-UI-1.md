# Módulo de Relevamiento (Discovery guiado) — UI 1

> ⚠️ Este documento describe el **módulo interactivo de Discovery** de Remistar Intelligence: un asistente de relevamiento dentro de `/app` pensado para usarse en vivo, en reuniones entre Daniel y Gonzalo. Funciona enteramente con datos guardados en `localStorage` del navegador, sin backend, sin base de datos real, sin autenticación real y sin IA externa. No reemplaza los documentos de Discovery en papel (`docs/discovery/`); los convierte en una experiencia guiada y reutilizable.

## 1. Objetivo

El cuestionario en papel resultaba incómodo de usar en una reunión. Este módulo lo reorganiza en 20 secciones ordenadas de lo más importante/operativo a lo más estratégico, con preguntas mayormente estructuradas (checkboxes, radios, escalas, ranking, matrices, escenarios) en vez de texto libre, cada una con un tip ("qué necesitamos saber"), un why ("para qué lo necesitamos") y un nivel de importancia (crítico / importante / complementario). El sistema sugiere recomendaciones simples y marca contradicciones a partir de reglas fijas — sin IA externa — y produce un resumen final que distingue hechos confirmados, supuestos, decisiones pendientes y recomendaciones.

## 2. Rutas creadas

| Ruta | Contenido |
|---|---|
| `/app/relevamiento` | Dashboard: estado general, CTA único ("Continuar consulta" / "Iniciar consulta"), grilla de 20 secciones, resumen de hallazgos, próximas decisiones, acciones secundarias |
| `/app/relevamiento/[seccion]` | Runner de una sección: una pregunta (o pequeño grupo) por vez, con tip/why, "modo consulta", notas de Daniel, "no lo sabemos todavía", saltar, guardar y continuar/salir |
| `/app/relevamiento/resumen` | Resumen organizado por perfil, procesos confirmados, decisiones aceptadas, supuestos, pendientes, contradicciones, recomendaciones, módulos afectados, impacto en el MVP y próximos pasos, con filtros y exportación |
| `/app/relevamiento/pendientes` | Pendientes críticos, marcados para revisar, contradicciones, decisiones pendientes, material a solicitar y agrupación por responsable |

Entrada desde el sidebar interno, grupo **"Configuración y evolución"** (junto a "Configuración"), ícono de checklist (`ClipboardList` de `lucide-react`).

## 3. Contenido del cuestionario

Las 20 secciones reorganizan y condensan el contenido ya relevado en `docs/discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md` (22 secciones + bloque 7bis) y se apoyan también en `docs/operaciones/`, `docs/producto/REMISTAR-MODULOS-V0.md` y `docs/producto/REMISTAR-MOTORES-INTELIGENTES-V0.md`. El mapeo completo, sección por sección, está documentado en `docs/discovery/REMISTAR-CUESTIONARIO-DIGITAL-V1.md`. No se inventaron preguntas nuevas: se estructuraron las existentes.

Se centralizó todo en `lib/discovery/` para no hardcodear preguntas dentro de componentes visuales:

```
lib/discovery/
  types.ts            Modelos: DiscoverySection, DiscoveryQuestion, DiscoveryAnswer, etc.
  sections.ts          Metadata de las 20 secciones (orden, dificultad, minutos estimados)
  questions/            Un archivo por sección + index.ts que combina todo
  rules.ts              computeRecommendations() y computeContradictions() — reglas puras
  progress.ts           Cálculo de progreso global y por sección
  export.ts              Genera el JSON y el Markdown exportables
  store.ts               Persistencia en localStorage (useSyncExternalStore)
```

### Tipos de respuesta soportados

`unica`, `multiple`, `si_no_nose`, `escala`, `ranking`, `matriz`, `numero`, `moneda`, `fecha`, `texto_corto`, `texto_largo`, `lista_dinamica`, `escenario` y `condicional` (pregunta que solo aparece si otra respuesta cumple una condición, vía `dependsOn`). El renderizado de cada tipo vive en `DiscoveryAnswerRenderer`, un único componente reutilizable.

## 4. Persistencia local

Clave versionada `remistar:discovery:v1` en `localStorage`, con el mismo patrón que `lib/driver-store.ts`: un objeto único, `useSyncExternalStore` con snapshot de servidor fijo (estado vacío) para hidratación segura sin errores de SSR/RSC. Se persisten respuestas, notas, decisiones sobre recomendaciones, secciones confirmadas y el estado de "modo consulta". El botón "Restablecer relevamiento" (con confirmación) borra únicamente esta clave — no afecta otros datos demo de la aplicación (`remistar:driver-demo:v1`, preferencias, etc.).

## 5. Recomendaciones dinámicas

`lib/discovery/rules.ts` define 7 reglas simples de tipo `(respuestas) => detectado`, cada una con su hallazgo, por qué importa, propuesta y módulos afectados. Ejemplos: si hay clientes tipo empresa, sugiere diferenciar solicitante/pasajero/pagador/contacto administrativo; si el mantenimiento se controla por kilometraje, sugiere pedir el odómetro desde el portal del chofer. Cada recomendación puede aceptarse, rechazarse o dejarse para revisar después; la decisión también se persiste. Ninguna regla ejecuta ni decide nada por sí sola.

## 6. Contradicciones

6 validaciones lógicas fijas (ej. "los choferes no ven importes" pero "revisan el importe por viaje al confirmar su liquidación") marcan la situación como **"Requiere revisión"** sin bloquear el avance del relevamiento. Se muestran en el dashboard, el resumen y la pantalla de pendientes.

## 7. Exportación

Desde el dashboard y desde `/resumen`: copiar resumen (Markdown al portapapeles), descargar JSON, descargar Markdown, imprimir (impresión de navegador). No se genera PDF en esta etapa.

## 8. Limitaciones (qué es demo)

- Sin Supabase, sin SQL, sin backend, sin autenticación nueva, sin APIs externas, sin IA externa.
- Los tipos de `lib/discovery/types.ts` son preliminares: no son un modelo de base de datos definitivo.
- Ninguna respuesta se marca como "confirmada" salvo que el usuario la haya respondido explícitamente.
- Las recomendaciones y contradicciones son reglas fijas de este prototipo, no inferencias de un modelo.
- No se integra con `/chofer` ni con el sitio institucional.

## 9. Qué debe validarse con Gonzalo

Ver `/app/relevamiento/pendientes` (dinámico, según lo respondido) y la sección "Registro de respuestas pendientes" de `docs/discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md`.

## 10. Próximos pasos

1. Usar el módulo en la próxima reunión con Gonzalo, en modo consulta.
2. Revisar `/app/relevamiento/resumen` después de cada sesión y actualizar `docs/discovery/REMISTAR-DISCOVERY-2-inventario-informacion.md` con lo confirmado.
3. Resolver contradicciones detectadas antes de avanzar con el diseño de los módulos afectados.
4. Recién después de validar las preguntas críticas, avanzar hacia modelos de datos y reglas de negocio definitivas.
