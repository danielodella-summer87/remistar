/** Tipos del contrato HTTP de la API de respuestas de Discovery (app/api/discovery/sessions/[sessionId]/answers). */

export interface SaveDiscoveryAnswerRequestBody {
  sectionSlug: string;
  questionId: string;
  value: unknown;
}

export type DiscoveryAnswerOperation = "created" | "updated";

/** Forma segura de una respuesta para devolver por HTTP. */
export interface DiscoveryAnswerResponse {
  id: string;
  sessionId: string;
  sectionSlug: string;
  questionId: string;
  value: unknown;
  createdAt: string;
  updatedAt: string;
  operation: DiscoveryAnswerOperation;
}

/** Fila cruda de la tabla discovery_answers (columnas snake_case de Postgres). */
export interface DiscoveryAnswerRow {
  id: string;
  session_id: string;
  section_slug: string;
  question_id: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

export function toDiscoveryAnswerResponse(
  row: DiscoveryAnswerRow,
  operation: DiscoveryAnswerOperation
): DiscoveryAnswerResponse {
  return {
    id: row.id,
    sessionId: row.session_id,
    sectionSlug: row.section_slug,
    questionId: row.question_id,
    value: row.value,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    operation,
  };
}
