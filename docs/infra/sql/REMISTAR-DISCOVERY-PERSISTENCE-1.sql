-- ============================================================================
-- REMISTAR — Discovery: persistencia real en Supabase (Fase 1 — diseño)
-- ============================================================================
-- Prepara las tablas para que Supabase sea la fuente de verdad del
-- relevamiento guiado (Discovery), que hoy solo vive en localStorage bajo la
-- key `remistar:discovery:v1` (ver lib/discovery/store.ts y
-- lib/discovery/types.ts). localStorage sigue funcionando como respaldo
-- local; este script no lo toca ni lo reemplaza.
--
-- Este archivo NO fue ejecutado por Claude Code. Ejecutarlo manualmente en
-- el SQL Editor del proyecto Supabase de Remistar.
--
-- Es idempotente: correrlo más de una vez no duplica objetos ni borra datos.
-- No contiene ningún DELETE, TRUNCATE, DROP TABLE ni escritura de datos.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Extensiones
-- ----------------------------------------------------------------------------
-- gen_random_uuid() es nativo desde Postgres 13. Se deja pgcrypto como red de
-- seguridad idempotente por si el proyecto corriera en una versión menor.
create extension if not exists pgcrypto;


-- ----------------------------------------------------------------------------
-- 2. Tabla: discovery_sessions
-- ----------------------------------------------------------------------------
-- Una fila = una instancia de relevamiento (una entrevista con un
-- entrevistado, ej. Gonzalo). Equivale al estado global que hoy vive en la
-- key de localStorage `remistar:discovery:v1`.
create table if not exists public.discovery_sessions (
  id uuid primary key default gen_random_uuid(),

  interviewee_name text not null,
  company text not null,
  phone text,
  email text,

  status text not null default 'draft',

  current_section_slug text,
  current_question_id text,

  -- Corresponde a DiscoveryState.version en lib/discovery/store.ts (hoy = 1).
  questionnaire_version integer not null default 1,

  -- Identificador opaco y distinto de `id` para retomar la sesión desde otro
  -- navegador/dispositivo (ej. vía link). Al ser una columna separada se puede
  -- rotar/revocar sin romper las referencias de discovery_answers.
  recovery_token uuid not null default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,

  constraint discovery_sessions_status_check
    check (status in ('draft', 'completed', 'archived')),

  constraint discovery_sessions_recovery_token_key
    unique (recovery_token),

  -- Un draft nunca puede tener fecha de finalización.
  constraint discovery_sessions_draft_without_completed_at
    check (status <> 'draft' or completed_at is null)
);

comment on table public.discovery_sessions is
  'Una sesión de relevamiento Discovery (una entrevista). Fuente de verdad; reemplaza al estado global hoy guardado en localStorage remistar:discovery:v1.';
comment on column public.discovery_sessions.recovery_token is
  'Identificador opaco y rotable para retomar la sesión desde otro navegador/dispositivo. Deliberadamente distinto de id.';

create index if not exists idx_discovery_sessions_status
  on public.discovery_sessions (status);


-- ----------------------------------------------------------------------------
-- 3. Tabla: discovery_answers
-- ----------------------------------------------------------------------------
-- Una fila = una respuesta a una pregunta, dentro de una sesión concreta.
-- Equivale a cada entrada de `answers` en el DiscoveryState de localStorage
-- (ver DiscoveryAnswer en lib/discovery/types.ts).
create table if not exists public.discovery_answers (
  id uuid primary key default gen_random_uuid(),

  session_id uuid not null
    references public.discovery_sessions (id) on delete cascade,

  section_slug text not null,
  question_id text not null,

  -- DiscoveryAnswerValue admite string | string[] | number | boolean | matriz;
  -- JSONB cubre los cinco casos sin perder tipado en la app.
  value jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Unicidad por sesión + pregunta: es la barrera que evita que un upsert
  -- mal filtrado pise en silencio la respuesta de OTRA sesión, y evita
  -- duplicar la respuesta dentro de la propia sesión. Todo upsert desde la
  -- API debe incluir siempre session_id explícito, nunca filtrar solo por
  -- question_id.
  constraint discovery_answers_session_question_key
    unique (session_id, question_id)
);

comment on table public.discovery_answers is
  'Respuestas individuales de una sesión de Discovery. (session_id, question_id) es única: todo upsert debe filtrar siempre por session_id explícito.';

create index if not exists idx_discovery_answers_section
  on public.discovery_answers (session_id, section_slug);


-- ----------------------------------------------------------------------------
-- 4. Trigger: updated_at automático
-- ----------------------------------------------------------------------------
create or replace function public.set_discovery_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_discovery_sessions_updated_at on public.discovery_sessions;
create trigger trg_discovery_sessions_updated_at
  before update on public.discovery_sessions
  for each row
  execute function public.set_discovery_updated_at();

drop trigger if exists trg_discovery_answers_updated_at on public.discovery_answers;
create trigger trg_discovery_answers_updated_at
  before update on public.discovery_answers
  for each row
  execute function public.set_discovery_updated_at();


-- ----------------------------------------------------------------------------
-- 5. Row Level Security
-- ----------------------------------------------------------------------------
-- Deliberadamente NO se crea ninguna policy para los roles `anon` ni
-- `authenticated`. Con RLS habilitado y cero policies, Postgres deniega por
-- defecto: esos roles no pueden leer ni escribir nada en estas tablas desde
-- el browser, ni siquiera con la publishable key.
--
-- El único rol que puede operar es `service_role` (el que usa el servidor de
-- Next.js al firmar con SUPABASE_SECRET_KEY), porque en Supabase ese rol
-- tiene BYPASSRLS y no está sujeto a estas políticas. Esto es intencional:
-- toda lectura/escritura real de Discovery debe pasar por una API route
-- server-side, nunca directo desde el navegador con la publishable key.
alter table public.discovery_sessions enable row level security;
alter table public.discovery_answers enable row level security;


-- ----------------------------------------------------------------------------
-- 6. Validación posterior (solo SELECT — no modifica nada)
-- ----------------------------------------------------------------------------
-- Correr esto después del bloque de arriba para confirmar que quedó todo
-- como se espera.

-- 6.1 Las tablas existen con las columnas esperadas
select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('discovery_sessions', 'discovery_answers')
order by table_name, ordinal_position;

-- 6.2 Constraints (PK, unique, check, FK)
select conrelid::regclass as table_name, conname, contype
from pg_constraint
where connamespace = 'public'::regnamespace
  and conrelid::regclass::text in ('discovery_sessions', 'discovery_answers')
order by table_name, conname;

-- 6.3 Índices creados
select tablename, indexname
from pg_indexes
where schemaname = 'public'
  and tablename in ('discovery_sessions', 'discovery_answers');

-- 6.4 RLS habilitado en ambas tablas (relrowsecurity debe ser TRUE)
select relname, relrowsecurity, relforcerowsecurity
from pg_class
where relname in ('discovery_sessions', 'discovery_answers');

-- 6.5 Policies existentes (debe devolver 0 filas: confirma el deny-by-default
-- para anon/authenticated descripto en la sección 5)
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where tablename in ('discovery_sessions', 'discovery_answers');

-- 6.6 Conteo de filas (debe ser 0 recién creadas las tablas; ningún dato se
-- borra ni se modifica con este script)
select
  (select count(*) from public.discovery_sessions) as sessions_count,
  (select count(*) from public.discovery_answers) as answers_count;
