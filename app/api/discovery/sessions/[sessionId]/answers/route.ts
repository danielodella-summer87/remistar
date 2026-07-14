import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  toDiscoveryAnswerResponse,
  type DiscoveryAnswerRow,
} from "@/lib/discovery/answer-api-types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
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
    return NextResponse.json(
      { error: "invalid_json", message: "El body debe ser JSON válido." },
      { status: 400 }
    );
  }

  const sectionSlug = typeof body.sectionSlug === "string" ? body.sectionSlug.trim() : "";
  const questionId = typeof body.questionId === "string" ? body.questionId.trim() : "";
  const hasValue = "value" in body && body.value !== undefined;

  if (!sectionSlug) {
    return NextResponse.json(
      { error: "invalid_section_slug", message: "sectionSlug es obligatorio." },
      { status: 400 }
    );
  }
  if (!questionId) {
    return NextResponse.json(
      { error: "invalid_question_id", message: "questionId es obligatorio." },
      { status: 400 }
    );
  }
  if (!hasValue) {
    return NextResponse.json(
      { error: "missing_value", message: "value es obligatorio." },
      { status: 400 }
    );
  }
  const value = body.value;

  try {
    const supabase = createSupabaseServerClient();

    const { data: session, error: sessionError } = await supabase
      .from("discovery_sessions")
      .select("id, status")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error("discovery_sessions lookup failed:", sessionError.message);
      return NextResponse.json(
        { error: "supabase_lookup_failed", message: "No se pudo verificar la sesión." },
        { status: 502 }
      );
    }
    if (!session) {
      return NextResponse.json(
        { error: "session_not_found", message: "La sesión no existe." },
        { status: 404 }
      );
    }
    if (session.status === "archived") {
      return NextResponse.json(
        { error: "session_archived", message: "La sesión está archivada y no admite nuevas respuestas." },
        { status: 409 }
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("discovery_answers")
      .select("id")
      .eq("session_id", sessionId)
      .eq("question_id", questionId)
      .maybeSingle();

    if (existingError) {
      console.error("discovery_answers lookup failed:", existingError.message);
      return NextResponse.json(
        { error: "supabase_lookup_failed", message: "No se pudo verificar la respuesta existente." },
        { status: 502 }
      );
    }

    const operation = existing ? "updated" : "created";

    const { data: savedRow, error: upsertError } = await supabase
      .from("discovery_answers")
      .upsert(
        {
          session_id: sessionId,
          section_slug: sectionSlug,
          question_id: questionId,
          value,
        },
        { onConflict: "session_id,question_id" }
      )
      .select("id, session_id, section_slug, question_id, value, created_at, updated_at")
      .single();

    if (upsertError || !savedRow) {
      console.error("discovery_answers upsert failed:", upsertError?.message);
      return NextResponse.json(
        { error: "supabase_upsert_failed", message: "No se pudo guardar la respuesta." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      toDiscoveryAnswerResponse(savedRow as DiscoveryAnswerRow, operation),
      { status: operation === "created" ? 201 : 200 }
    );
  } catch (err) {
    console.error("discovery answer save threw:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "unexpected_error", message: "Error inesperado al guardar la respuesta." },
      { status: 500 }
    );
  }
}
