/** Tipos del contrato HTTP de GET /api/discovery/sessions/[sessionId] (recuperación). */

import type { DiscoverySessionStatus } from "./session-api-types";

/** Fila cruda de discovery_answers, sin id ni session_id (ya se sabe a qué sesión pertenecen). */
export interface DiscoverySessionDetailAnswerRow {
  section_slug: string;
  question_id: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

/** Fila cruda de discovery_sessions — deliberadamente sin recovery_token. */
export interface DiscoverySessionDetailRow {
  id: string;
  interviewee_name: string;
  company: string;
  email: string | null;
  phone: string | null;
  status: DiscoverySessionStatus;
  questionnaire_version: number;
  current_section_slug: string | null;
  current_question_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  confirmed_sections: Record<string, boolean>;
}

export interface DiscoverySessionDetailAnswer {
  sectionSlug: string;
  questionId: string;
  value: unknown;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sesión completa + sus respuestas, para recuperarla en otro navegador/dispositivo.
 * Nunca incluye recovery_token ni ninguna otra columna interna/secreta.
 */
export interface DiscoverySessionDetailResponse {
  id: string;
  intervieweeName: string;
  companyName: string;
  email: string | null;
  phone: string | null;
  status: DiscoverySessionStatus;
  questionnaireVersion: number;
  currentSectionSlug: string | null;
  currentQuestionId: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  confirmedSections: Record<string, boolean>;
  answers: DiscoverySessionDetailAnswer[];
}

export function toDiscoverySessionDetailResponse(
  session: DiscoverySessionDetailRow,
  answers: DiscoverySessionDetailAnswerRow[]
): DiscoverySessionDetailResponse {
  return {
    id: session.id,
    intervieweeName: session.interviewee_name,
    companyName: session.company,
    email: session.email,
    phone: session.phone,
    status: session.status,
    questionnaireVersion: session.questionnaire_version,
    currentSectionSlug: session.current_section_slug,
    currentQuestionId: session.current_question_id,
    createdAt: session.created_at,
    updatedAt: session.updated_at,
    completedAt: session.completed_at,
    confirmedSections: session.confirmed_sections ?? {},
    answers: answers.map((a) => ({
      sectionSlug: a.section_slug,
      questionId: a.question_id,
      value: a.value,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    })),
  };
}
