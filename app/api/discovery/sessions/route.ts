import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toDiscoverySessionResponse, type DiscoverySessionRow } from "@/lib/discovery/session-api-types";

function trimmedStringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "El body debe ser JSON válido." },
      { status: 400 }
    );
  }

  const intervieweeName = trimmedStringOrNull(body.intervieweeName);
  const companyName = trimmedStringOrNull(body.companyName);
  const email = trimmedStringOrNull(body.email);
  const phone = trimmedStringOrNull(body.phone);
  const currentSectionSlug = trimmedStringOrNull(body.currentSectionSlug);
  const currentQuestionId = trimmedStringOrNull(body.currentQuestionId);
  const questionnaireVersion = Number(body.questionnaireVersion);

  if (!intervieweeName) {
    return NextResponse.json(
      { error: "invalid_interviewee_name", message: "intervieweeName es obligatorio." },
      { status: 400 }
    );
  }
  if (!companyName) {
    return NextResponse.json(
      { error: "invalid_company_name", message: "companyName es obligatorio." },
      { status: 400 }
    );
  }
  if (!Number.isInteger(questionnaireVersion) || questionnaireVersion < 1) {
    return NextResponse.json(
      { error: "invalid_questionnaire_version", message: "questionnaireVersion debe ser un entero mayor o igual a 1." },
      { status: 400 }
    );
  }

  let insertedRow: DiscoverySessionRow | null;
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("discovery_sessions")
      .insert({
        interviewee_name: intervieweeName,
        company: companyName,
        email,
        phone,
        questionnaire_version: questionnaireVersion,
        current_section_slug: currentSectionSlug,
        current_question_id: currentQuestionId,
      })
      .select(
        "id, status, interviewee_name, company, current_section_slug, current_question_id, questionnaire_version, created_at, updated_at, recovery_token"
      )
      .single();

    if (error) {
      console.error("discovery_sessions insert failed:", error.message);
      return NextResponse.json(
        { error: "supabase_insert_failed", message: "No se pudo crear la sesión en Supabase." },
        { status: 502 }
      );
    }
    insertedRow = data as DiscoverySessionRow;
  } catch (err) {
    console.error("discovery_sessions insert threw:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "unexpected_error", message: "Error inesperado al crear la sesión." },
      { status: 500 }
    );
  }

  if (!insertedRow) {
    return NextResponse.json(
      { error: "supabase_insert_failed", message: "Supabase no devolvió la sesión creada." },
      { status: 502 }
    );
  }

  return NextResponse.json(toDiscoverySessionResponse(insertedRow), { status: 201 });
}
