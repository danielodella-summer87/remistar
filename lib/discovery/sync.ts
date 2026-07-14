"use client";

import { getQuestionById } from "./questions/index";
import { getSectionById } from "./sections";
import { discoveryActions, getDiscoveryStateSnapshot } from "./store";

/**
 * Crea la sesión de Discovery en Supabase la primera vez que hace falta (lazy) y la deja
 * asociada al estado local. Deduplicada: llamadas concurrentes comparten la misma promesa,
 * así nunca se crean dos sesiones por un doble disparo (re-render, doble clic, etc.).
 *
 * intervieweeName/companyName se leen siempre del estado local (capturados en
 * DiscoveryIdentityDialog antes de la primera sesión remota). Si todavía no están completos
 * no se crea sesión: el relevamiento sigue guardándose en localStorage sin perder nada.
 */
let sessionCreation: Promise<string | null> | null = null;

export async function ensureDiscoverySession(): Promise<string | null> {
  const state = getDiscoveryStateSnapshot();
  if (state.sessionId) return state.sessionId;

  const intervieweeName = state.intervieweeName?.trim();
  const companyName = state.companyName?.trim();
  if (!intervieweeName || !companyName) return null;

  if (!sessionCreation) {
    sessionCreation = (async () => {
      try {
        const res = await fetch("/api/discovery/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intervieweeName,
            companyName,
            email: state.email?.trim() || undefined,
            phone: state.phone?.trim() || undefined,
            questionnaireVersion: state.version,
          }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { id: string; recoveryToken: string; updatedAt: string };
        discoveryActions.setSession(data.id, data.recoveryToken, data.updatedAt);
        return data.id;
      } catch {
        return null;
      } finally {
        sessionCreation = null;
      }
    })();
  }
  return sessionCreation;
}

const inFlightAnswers = new Set<string>();

/**
 * Sincroniza a Supabase la respuesta ya guardada en localStorage para `questionId`.
 * Nunca lanza: cualquier falla se refleja en `syncStatus` sin interrumpir la navegación.
 * sectionSlug/questionId se derivan siempre del cuestionario real (nunca de un valor libre),
 * así nunca se envía un string arbitrario que no exista en el Discovery.
 */
export async function syncAnswerToSupabase(questionId: string): Promise<void> {
  if (inFlightAnswers.has(questionId)) return;

  const question = getQuestionById(questionId);
  const section = question ? getSectionById(question.sectionId) : undefined;
  if (!question || !section) return;

  const state = getDiscoveryStateSnapshot();
  const answer = state.answers[questionId];
  if (!answer || answer.value === undefined) return;

  inFlightAnswers.add(questionId);
  discoveryActions.setSyncStatus("syncing");

  try {
    const sessionId = await ensureDiscoverySession();
    if (!sessionId) {
      discoveryActions.setSyncStatus("error");
      return;
    }

    const res = await fetch(`/api/discovery/sessions/${sessionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionSlug: section.slug,
        questionId: question.id,
        value: answer.value,
      }),
    });

    if (!res.ok) {
      discoveryActions.setSyncStatus("error");
      return;
    }
    discoveryActions.setSyncStatus("synced", new Date().toISOString());
  } catch {
    discoveryActions.setSyncStatus("error");
  } finally {
    inFlightAnswers.delete(questionId);
  }
}

let confirmedSectionsSyncing = false;

/**
 * Sincroniza `confirmedSections` a Supabase con concurrencia optimista: manda el `updated_at`
 * de la sesión tal como lo vimos la última vez. Si la fila cambió desde entonces (409), no
 * sobrescribe nada localmente — solo adopta el `updated_at` real para que el próximo intento
 * ya no choque contra un valor viejo. Nunca lanza; cualquier falla se refleja en `syncStatus`.
 */
export async function syncConfirmedSectionsToSupabase(): Promise<void> {
  if (confirmedSectionsSyncing) return;
  confirmedSectionsSyncing = true;
  discoveryActions.setSyncStatus("syncing");

  try {
    const sessionId = await ensureDiscoverySession();
    if (!sessionId) {
      discoveryActions.setSyncStatus("error");
      return;
    }

    const state = getDiscoveryStateSnapshot();
    const expectedUpdatedAt = state.sessionUpdatedAt;
    if (!expectedUpdatedAt) {
      // Todavía no leímos updated_at de esta sesión (ej. sesión recién creada sin refetch) — no hay
      // base segura para la concurrencia optimista, así que no se envía nada hasta la próxima vez.
      discoveryActions.setSyncStatus("error");
      return;
    }

    const res = await fetch(`/api/discovery/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmedSections: state.confirmedSections,
        expectedUpdatedAt,
      }),
    });

    const data = (await res.json()) as { confirmedSections?: Record<string, boolean>; updatedAt?: string };

    if (res.status === 409) {
      console.warn("confirmedSections: conflicto de concurrencia, la sesión cambió desde la última lectura.");
      if (data.updatedAt) discoveryActions.setSessionUpdatedAt(data.updatedAt);
      discoveryActions.setSyncStatus("error");
      return;
    }
    if (!res.ok || !data.updatedAt) {
      discoveryActions.setSyncStatus("error");
      return;
    }

    discoveryActions.setConfirmedSectionsFromServer(data.confirmedSections ?? state.confirmedSections, data.updatedAt);
    discoveryActions.setSyncStatus("synced", new Date().toISOString());
  } catch {
    discoveryActions.setSyncStatus("error");
  } finally {
    confirmedSectionsSyncing = false;
  }
}
