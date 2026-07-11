"use client";

import { useSyncExternalStore } from "react";
import type { DiscoveryAnswer, DiscoveryAnswerValue, DiscoveryStatus, DiscoveryRecommendationDecision } from "./types";

const STORAGE_KEY = "remistar:discovery:v1";

export interface DiscoveryState {
  version: 1;
  answers: Record<string, DiscoveryAnswer>;
  confirmedSections: Record<string, boolean>;
  recommendationDecisions: Record<string, DiscoveryRecommendationDecision>;
  meetingMode: boolean;
  currentSectionSlug?: string;
}

const DEFAULT_STATE: DiscoveryState = {
  version: 1,
  answers: {},
  confirmedSections: {},
  recommendationDecisions: {},
  meetingMode: false,
  currentSectionSlug: undefined,
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

  confirmSection(sectionId: string, confirmed: boolean) {
    const state = read();
    write({ ...state, confirmedSections: { ...state.confirmedSections, [sectionId]: confirmed } });
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

  setCurrentSection(slug: string) {
    write({ ...read(), currentSectionSlug: slug });
  },

  resetDemo() {
    write(DEFAULT_STATE);
  },
};
