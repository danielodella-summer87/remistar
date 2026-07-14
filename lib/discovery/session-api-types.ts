/** Tipos del contrato HTTP de la API de sesiones de Discovery (app/api/discovery/sessions). */

export type DiscoverySessionStatus = "draft" | "completed" | "archived";

export interface CreateDiscoverySessionRequestBody {
  intervieweeName: string;
  companyName: string;
  email?: string;
  phone?: string;
  questionnaireVersion: number;
  currentSectionSlug?: string;
  currentQuestionId?: string;
}

/** Forma segura de una sesión para devolver por HTTP: sin email/phone ni columnas internas. */
export interface DiscoverySessionResponse {
  id: string;
  status: DiscoverySessionStatus;
  intervieweeName: string;
  companyName: string;
  currentSectionSlug: string | null;
  currentQuestionId: string | null;
  questionnaireVersion: number;
  createdAt: string;
  updatedAt: string;
  recoveryToken: string;
}

/** Fila cruda de la tabla discovery_sessions (columnas snake_case de Postgres). */
export interface DiscoverySessionRow {
  id: string;
  status: DiscoverySessionStatus;
  interviewee_name: string;
  company: string;
  current_section_slug: string | null;
  current_question_id: string | null;
  questionnaire_version: number;
  created_at: string;
  updated_at: string;
  recovery_token: string;
}

export function toDiscoverySessionResponse(row: DiscoverySessionRow): DiscoverySessionResponse {
  return {
    id: row.id,
    status: row.status,
    intervieweeName: row.interviewee_name,
    companyName: row.company,
    currentSectionSlug: row.current_section_slug,
    currentQuestionId: row.current_question_id,
    questionnaireVersion: row.questionnaire_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    recoveryToken: row.recovery_token,
  };
}
