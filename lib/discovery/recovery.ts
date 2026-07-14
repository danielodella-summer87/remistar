"use client";

import { discoveryActions, getDiscoveryStateSnapshot } from "./store";
import { getSectionBySlug, getSectionById } from "./sections";
import { getQuestionById } from "./questions/index";
import type { DiscoveryAnswerValue } from "./types";
import type { DiscoverySessionDetailResponse } from "./session-detail-api-types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type RecoveryError = "invalid_uuid" | "not_found" | "network_error";

export type RecoveryResult =
  | { ok: true; detail: DiscoverySessionDetailResponse }
  | { ok: false; error: RecoveryError };

/** Busca una sesión remota por id exacto, sin tocar el estado local todavía (para poder previsualizarla antes de confirmar). */
export async function fetchSessionForRecovery(sessionId: string): Promise<RecoveryResult> {
  const trimmed = sessionId.trim();
  if (!UUID_RE.test(trimmed)) return { ok: false, error: "invalid_uuid" };

  try {
    const res = await fetch(`/api/discovery/sessions/${trimmed}`);
    if (res.status === 404) return { ok: false, error: "not_found" };
    if (!res.ok) return { ok: false, error: "network_error" };
    const detail = (await res.json()) as DiscoverySessionDetailResponse;
    return { ok: true, detail };
  } catch {
    return { ok: false, error: "network_error" };
  }
}

/** true si ya hay un relevamiento local con progreso o sesión propia que se perdería al recuperar otra sesión. */
export function hasActiveLocalDiscovery(): boolean {
  const state = getDiscoveryStateSnapshot();
  return Object.keys(state.answers).length > 0 || Boolean(state.sessionId);
}

/**
 * Aplica al estado local una sesión remota ya confirmada por el usuario. Filtra cualquier
 * questionId que no exista en el cuestionario actual (defensivo; no debería pasar con datos
 * validados en el import, pero nunca se inventan respuestas para preguntas inexistentes).
 * `value: null` en Supabase se traduce a `undefined` (pendiente_confirmar sin valor).
 */
export function applyRecoveredSession(detail: DiscoverySessionDetailResponse): { skippedUnknownAnswers: string[] } {
  const section = detail.currentSectionSlug ? getSectionBySlug(detail.currentSectionSlug) : undefined;
  const question = detail.currentQuestionId ? getQuestionById(detail.currentQuestionId) : undefined;
  const validPosition = Boolean(section && question && question.sectionId === section.id);

  const skippedUnknownAnswers: string[] = [];
  const answers: Array<{ questionId: string; value: DiscoveryAnswerValue; updatedAt?: string }> = [];
  for (const a of detail.answers) {
    if (!getQuestionById(a.questionId)) {
      skippedUnknownAnswers.push(a.questionId);
      continue;
    }
    answers.push({
      questionId: a.questionId,
      value: (a.value === null ? undefined : a.value) as DiscoveryAnswerValue,
      updatedAt: a.updatedAt,
    });
  }

  const confirmedSections: Record<string, boolean> = {};
  for (const [sectionId, confirmed] of Object.entries(detail.confirmedSections ?? {})) {
    if (getSectionById(sectionId)) confirmedSections[sectionId] = confirmed;
  }

  discoveryActions.hydrateFromRemoteSession({
    id: detail.id,
    intervieweeName: detail.intervieweeName,
    companyName: detail.companyName,
    currentSectionSlug: validPosition ? detail.currentSectionSlug ?? undefined : undefined,
    currentQuestionId: validPosition ? detail.currentQuestionId ?? undefined : undefined,
    confirmedSections,
    sessionUpdatedAt: detail.updatedAt,
    answers,
  });

  return { skippedUnknownAnswers };
}
