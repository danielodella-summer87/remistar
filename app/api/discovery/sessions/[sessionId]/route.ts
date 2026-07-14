import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  toDiscoverySessionDetailResponse,
  type DiscoverySessionDetailAnswerRow,
  type DiscoverySessionDetailRow,
} from "@/lib/discovery/session-detail-api-types";
import { discoverySections } from "@/lib/discovery/sections";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_SECTION_IDS = new Set(discoverySections.map((s) => s.id));

/**
 * Recupera una sesión existente por id exacto (nunca lista sesiones). Usado por el flujo de
 * "Recuperar consulta existente" para reconstruir el estado local en otro navegador/dispositivo.
 * No devuelve recovery_token ni ninguna otra columna interna.
 */
export async function GET(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  if (!UUID_RE.test(sessionId)) {
    return NextResponse.json(
      { error: "invalid_session_id", message: "sessionId debe ser un UUID válido." },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();

    const { data: session, error: sessionError } = await supabase
      .from("discovery_sessions")
      .select(
        "id, interviewee_name, company, email, phone, status, questionnaire_version, current_section_slug, current_question_id, created_at, updated_at, completed_at, confirmed_sections"
      )
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error("discovery_sessions lookup failed:", sessionError.message);
      return NextResponse.json(
        { error: "supabase_lookup_failed", message: "No se pudo buscar la sesión." },
        { status: 502 }
      );
    }
    if (!session) {
      return NextResponse.json({ error: "session_not_found", message: "La sesión no existe." }, { status: 404 });
    }

    const { data: answers, error: answersError } = await supabase
      .from("discovery_answers")
      .select("section_slug, question_id, value, created_at, updated_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (answersError) {
      console.error("discovery_answers lookup failed:", answersError.message);
      return NextResponse.json(
        { error: "supabase_lookup_failed", message: "No se pudieron buscar las respuestas de la sesión." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      toDiscoverySessionDetailResponse(
        session as DiscoverySessionDetailRow,
        (answers ?? []) as DiscoverySessionDetailAnswerRow[]
      )
    );
  } catch (err) {
    console.error("discovery session detail lookup threw:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "unexpected_error", message: "Error inesperado al buscar la sesión." },
      { status: 500 }
    );
  }
}

/**
 * Actualiza únicamente `confirmed_sections` de una sesión existente. Nunca toca answers ni
 * ninguna otra columna. Usa concurrencia optimista vía `expectedUpdatedAt`: si la fila cambió
 * desde la última lectura del cliente, rechaza con 409 en vez de sobrescribir en silencio.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  if (!UUID_RE.test(sessionId)) {
    return NextResponse.json(
      { error: "invalid_session_id", message: "sessionId debe ser un UUID válido." },
      { status: 400 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "El body debe ser JSON válido." }, { status: 400 });
  }

  const confirmedSections = body.confirmedSections;
  const expectedUpdatedAt = body.expectedUpdatedAt;

  if (typeof expectedUpdatedAt !== "string" || !expectedUpdatedAt) {
    return NextResponse.json(
      { error: "missing_expected_updated_at", message: "expectedUpdatedAt es obligatorio (concurrencia optimista)." },
      { status: 400 }
    );
  }
  if (typeof confirmedSections !== "object" || confirmedSections === null || Array.isArray(confirmedSections)) {
    return NextResponse.json(
      { error: "invalid_confirmed_sections", message: "confirmedSections debe ser un objeto sectionId -> boolean." },
      { status: 400 }
    );
  }
  const entries = Object.entries(confirmedSections as Record<string, unknown>);
  for (const [sectionId, value] of entries) {
    if (!VALID_SECTION_IDS.has(sectionId)) {
      return NextResponse.json(
        { error: "unknown_section_id", message: `"${sectionId}" no es una sección válida del cuestionario actual.` },
        { status: 400 }
      );
    }
    if (typeof value !== "boolean") {
      return NextResponse.json(
        { error: "invalid_confirmed_sections", message: `El valor de "${sectionId}" debe ser boolean.` },
        { status: 400 }
      );
    }
  }

  try {
    const supabase = createSupabaseServerClient();

    const { data: updated, error: updateError } = await supabase
      .from("discovery_sessions")
      .update({ confirmed_sections: confirmedSections })
      .eq("id", sessionId)
      .eq("updated_at", expectedUpdatedAt)
      .select("confirmed_sections, updated_at")
      .maybeSingle();

    if (updateError) {
      console.error("discovery_sessions confirmed_sections update failed:", updateError.message);
      return NextResponse.json(
        { error: "supabase_update_failed", message: "No se pudo guardar confirmedSections." },
        { status: 502 }
      );
    }

    if (updated) {
      return NextResponse.json({
        confirmedSections: updated.confirmed_sections ?? {},
        updatedAt: updated.updated_at,
      });
    }

    // 0 filas afectadas: o no existe la sesión, o cambió desde la última lectura del cliente.
    const { data: current, error: currentError } = await supabase
      .from("discovery_sessions")
      .select("confirmed_sections, updated_at")
      .eq("id", sessionId)
      .maybeSingle();

    if (currentError) {
      console.error("discovery_sessions lookup after conflict failed:", currentError.message);
      return NextResponse.json(
        { error: "supabase_lookup_failed", message: "No se pudo verificar el estado actual de la sesión." },
        { status: 502 }
      );
    }
    if (!current) {
      return NextResponse.json({ error: "session_not_found", message: "La sesión no existe." }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "conflict",
        message: "La sesión fue modificada desde la última lectura. Volvé a leerla antes de reintentar.",
        confirmedSections: current.confirmed_sections ?? {},
        updatedAt: current.updated_at,
      },
      { status: 409 }
    );
  } catch (err) {
    console.error("discovery session confirmed_sections update threw:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "unexpected_error", message: "Error inesperado al guardar confirmedSections." },
      { status: 500 }
    );
  }
}
