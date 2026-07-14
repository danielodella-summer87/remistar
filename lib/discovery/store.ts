"use client";

import { useSyncExternalStore } from "react";
import type { DiscoveryAnswer, DiscoveryAnswerValue, DiscoveryStatus, DiscoveryRecommendationDecision } from "./types";

const STORAGE_KEY = "remistar:discovery:v1";

/** Estado de sincronización de la última respuesta enviada a Supabase (independiente del guardado local). */
export type DiscoverySyncStatus = "idle" | "syncing" | "synced" | "error";

export interface DiscoveryState {
  version: 1;
  answers: Record<string, DiscoveryAnswer>;
  confirmedSections: Record<string, boolean>;
  recommendationDecisions: Record<string, DiscoveryRecommendationDecision>;
  meetingMode: boolean;
  /** Última sección y pregunta donde estaba Gonzalo — permite retomar exactamente donde quedó. */
  currentSectionSlug?: string;
  currentQuestionId?: string;
  /** sectionId -> fecha/hora ISO del último "Reabrir sección". Se borra al volver a confirmar o marcar lista para revisar. */
  reopenedSections: Record<string, string>;
  /** id de la sesión de Discovery en Supabase (discovery_sessions.id). Ausente hasta la primera sincronización. */
  sessionId?: string;
  /** token opaco de recuperación de esa sesión (discovery_sessions.recovery_token). */
  recoveryToken?: string;
  /** updated_at de discovery_sessions tal como lo vimos la última vez; base para la concurrencia optimista de confirmedSections. */
  sessionUpdatedAt?: string;
  /** Estado de la última sincronización con Supabase; no afecta al guardado local, que sigue siendo síncrono. */
  syncStatus?: DiscoverySyncStatus;
  /** Fecha/hora ISO de la última sincronización exitosa con Supabase. */
  lastSyncedAt?: string;
  /** Identidad real de quien está respondiendo, capturada una sola vez antes de la primera sesión remota. */
  intervieweeName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
}

const DEFAULT_STATE: DiscoveryState = {
  version: 1,
  answers: {},
  confirmedSections: {},
  recommendationDecisions: {},
  meetingMode: false,
  currentSectionSlug: undefined,
  currentQuestionId: undefined,
  reopenedSections: {},
  sessionId: undefined,
  recoveryToken: undefined,
  sessionUpdatedAt: undefined,
  syncStatus: "idle",
  lastSyncedAt: undefined,
  intervieweeName: undefined,
  companyName: undefined,
  email: undefined,
  phone: undefined,
};

let cached: DiscoveryState | null = null;
const listeners = new Set<() => void>();

function read(): DiscoveryState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  if (cached) return cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cached = raw ? { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<DiscoveryState>) } : DEFAULT_STATE;
  } catch {
    cached = DEFAULT_STATE;
  }
  return cached;
}

function write(next: DiscoveryState) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage no disponible (modo privado, etc.) — se ignora, el estado sigue en memoria.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getServerSnapshot(): DiscoveryState {
  return DEFAULT_STATE;
}

/** Hook de lectura reactiva del estado del relevamiento, hidratación-segura. */
export function useDiscoveryState(): DiscoveryState {
  return useSyncExternalStore(subscribe, read, getServerSnapshot);
}

/**
 * true una vez que `useDiscoveryState()` ya devolvió el snapshot real de localStorage, no el snapshot
 * vacío usado para la primera pasada de hidratación. Útil para recalcular una sola vez, después de
 * hidratar, cualquier cosa que se haya resuelto con datos todavía vacíos (ej. preguntas condicionales
 * cuya visibilidad depende de otra respuesta ya guardada).
 */
export function isHydratedDiscoveryState(state: DiscoveryState): boolean {
  return state !== DEFAULT_STATE;
}

/** Lectura puntual del estado actual fuera de un componente React (para helpers de sincronización). */
export function getDiscoveryStateSnapshot(): DiscoveryState {
  return read();
}

function nowIso(): string {
  return new Date().toISOString();
}

function upsertAnswer(state: DiscoveryState, questionId: string, patch: Partial<DiscoveryAnswer>): DiscoveryState {
  const existing: DiscoveryAnswer = state.answers[questionId] ?? { questionId, status: "sin_responder" };
  const merged: DiscoveryAnswer = {
    ...existing,
    ...patch,
    questionId,
    updatedAt: nowIso(),
  };
  return { ...state, answers: { ...state.answers, [questionId]: merged } };
}

export const discoveryActions = {
  answerQuestion(questionId: string, value: DiscoveryAnswerValue, otherText?: string) {
    write(upsertAnswer(read(), questionId, { value, otherText, status: "respondida" }));
  },

  setStatus(questionId: string, status: DiscoveryStatus) {
    write(upsertAnswer(read(), questionId, { status }));
  },

  markUnknown(questionId: string) {
    write(upsertAnswer(read(), questionId, { status: "pendiente_confirmar" }));
  },

  markForReview(questionId: string) {
    write(upsertAnswer(read(), questionId, { status: "requiere_revision" }));
  },

  setNote(questionId: string, note: string) {
    write(upsertAnswer(read(), questionId, { note }));
  },

  /** Marca la sección como confirmada o como lista para revisar. Cualquiera de las dos resuelve una reapertura pendiente. */
  confirmSection(sectionId: string, confirmed: boolean) {
    const state = read();
    const reopenedSections = { ...state.reopenedSections };
    delete reopenedSections[sectionId];
    write({ ...state, confirmedSections: { ...state.confirmedSections, [sectionId]: confirmed }, reopenedSections });
  },

  /** Reabre una sección ya confirmada/lista para revisar sin tocar ninguna respuesta, nota o decisión. */
  reopenSection(sectionId: string) {
    const state = read();
    write({
      ...state,
      confirmedSections: { ...state.confirmedSections, [sectionId]: false },
      reopenedSections: { ...state.reopenedSections, [sectionId]: nowIso() },
    });
  },

  decideRecommendation(recommendationId: string, decision: DiscoveryRecommendationDecision) {
    const state = read();
    write({
      ...state,
      recommendationDecisions: { ...state.recommendationDecisions, [recommendationId]: decision },
    });
  },

  setMeetingMode(enabled: boolean) {
    write({ ...read(), meetingMode: enabled });
  },

  /** Registra dónde quedó Gonzalo (sección + pregunta) para poder retomar exactamente ahí. No escribe si no cambió. */
  setPosition(sectionSlug: string, questionId: string) {
    const state = read();
    if (state.currentSectionSlug === sectionSlug && state.currentQuestionId === questionId) return;
    write({ ...state, currentSectionSlug: sectionSlug, currentQuestionId: questionId });
  },

  resetDemo() {
    write(DEFAULT_STATE);
  },

  /** Asocia el estado local a una sesión real de Supabase, sin tocar respuestas ni posición. */
  setSession(sessionId: string, recoveryToken: string, sessionUpdatedAt?: string) {
    const state = read();
    write({ ...state, sessionId, recoveryToken, sessionUpdatedAt: sessionUpdatedAt ?? state.sessionUpdatedAt, syncStatus: "idle" });
  },

  /** Refleja el resultado de una sincronización exitosa de confirmedSections con Supabase. */
  setConfirmedSectionsFromServer(confirmedSections: Record<string, boolean>, sessionUpdatedAt: string) {
    const state = read();
    write({ ...state, confirmedSections, sessionUpdatedAt });
  },

  /** Solo actualiza el `updated_at` conocido de la sesión (ej. tras un 409 de concurrencia, para no reintentar contra un valor ya viejo). */
  setSessionUpdatedAt(sessionUpdatedAt: string) {
    const state = read();
    write({ ...state, sessionUpdatedAt });
  },

  /** Refleja el resultado de la última sincronización de una respuesta con Supabase. */
  setSyncStatus(status: DiscoverySyncStatus, lastSyncedAt?: string) {
    const state = read();
    write({ ...state, syncStatus: status, lastSyncedAt: lastSyncedAt ?? state.lastSyncedAt });
  },

  /**
   * Guarda la identidad real de quien responde (nombre y empresa obligatorios, email/teléfono
   * opcionales). Strings vacíos o solo espacios se guardan como `undefined`, nunca como "".
   */
  setIdentity(identity: { intervieweeName?: string; companyName?: string; email?: string; phone?: string }) {
    const state = read();
    const clean = (value?: string) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    };
    write({
      ...state,
      intervieweeName: clean(identity.intervieweeName) ?? state.intervieweeName,
      companyName: clean(identity.companyName) ?? state.companyName,
      email: clean(identity.email) ?? state.email,
      phone: clean(identity.phone) ?? state.phone,
    });
  },

  /**
   * Reemplaza por completo el estado local con una sesión ya existente en Supabase (recuperación
   * desde otro navegador/dispositivo). Quien llama ya debe haber confirmado la sobrescritura si
   * había un relevamiento local activo — esta acción no pregunta, solo aplica.
   * `confirmedSections` y `sessionUpdatedAt` vienen del backend (columna `confirmed_sections` y
   * `updated_at` de discovery_sessions); si no vinieran, quedan en `{}`/`undefined` como en `DEFAULT_STATE`.
   */
  hydrateFromRemoteSession(session: {
    id: string;
    intervieweeName: string;
    companyName: string;
    currentSectionSlug?: string;
    currentQuestionId?: string;
    confirmedSections?: Record<string, boolean>;
    sessionUpdatedAt?: string;
    answers: Array<{ questionId: string; value: DiscoveryAnswerValue; updatedAt?: string }>;
  }) {
    const answers: Record<string, DiscoveryAnswer> = {};
    for (const a of session.answers) {
      answers[a.questionId] = {
        questionId: a.questionId,
        status: a.value === undefined ? "pendiente_confirmar" : "respondida",
        value: a.value,
        updatedAt: a.updatedAt,
      };
    }
    write({
      ...DEFAULT_STATE,
      answers,
      confirmedSections: session.confirmedSections ?? {},
      intervieweeName: session.intervieweeName,
      companyName: session.companyName,
      sessionId: session.id,
      sessionUpdatedAt: session.sessionUpdatedAt,
      currentSectionSlug: session.currentSectionSlug,
      currentQuestionId: session.currentQuestionId,
      syncStatus: "synced",
      lastSyncedAt: nowIso(),
    });
  },
};

/**
 * Función central de guardado: vuelve a persistir en localStorage el estado que ya está en memoria.
 * Como cada acción de arriba ya escribe de forma síncrona apenas ocurre el cambio, en el caso normal
 * esto es un no-op — pero sirve como red de seguridad única para todos los caminos de salida de la
 * pantalla (botón, navegación interna, cierre o recarga de pestaña) sin duplicar lógica en cada uno.
 */
export function flushDiscoveryChanges() {
  if (typeof window === "undefined" || cached === null) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // localStorage no disponible — no hay nada más que hacer al cerrar la pestaña.
  }
}
