import { discoverySections } from "./sections";
import { ALL_QUESTIONS, getQuestionsBySection, isQuestionVisible } from "./questions/index";
import { computeContradictions, computeRecommendations, type AnswersMap } from "./rules";
import type { DiscoveryProgress, DiscoverySectionProgress, DiscoverySectionStatus, DiscoveryRecommendationDecision } from "./types";

function sectionStatus(
  answered: number,
  total: number,
  hasRequiresReview: boolean,
  confirmed: boolean,
  reopenedAt: string | undefined
): DiscoverySectionStatus {
  if (hasRequiresReview) return "requiere_revision";
  if (reopenedAt) return "reabierta";
  if (answered === 0) return "no_iniciada";
  if (answered < total) return "en_progreso";
  if (confirmed) return "confirmada";
  return "lista_para_revisar";
}

export function computeSectionProgress(
  sectionId: string,
  answers: AnswersMap,
  confirmedSections: Record<string, boolean>,
  reopenedSections: Record<string, string> = {}
): DiscoverySectionProgress {
  const questions = getQuestionsBySection(sectionId).filter((q) => isQuestionVisible(q, answers));
  const total = questions.length;
  let answered = 0;
  let criticalPending = 0;
  let hasRequiresReview = false;

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer && answer.status !== "sin_responder") {
      answered += 1;
      if (answer.status === "requiere_revision") hasRequiresReview = true;
    } else if (question.importance === "critico") {
      criticalPending += 1;
    }
  }

  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const reopenedAt = reopenedSections[sectionId];

  return {
    sectionId,
    total,
    answered,
    criticalPending,
    percent,
    status: sectionStatus(answered, total, hasRequiresReview, Boolean(confirmedSections[sectionId]), reopenedAt),
    reopenedAt,
  };
}

export function computeProgress(
  answers: AnswersMap,
  confirmedSections: Record<string, boolean>,
  recommendationDecisions: Record<string, DiscoveryRecommendationDecision>,
  reopenedSections: Record<string, string> = {}
): DiscoveryProgress {
  const bySection = discoverySections
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((section) => computeSectionProgress(section.id, answers, confirmedSections, reopenedSections));

  const totalQuestions = bySection.reduce((sum, s) => sum + s.total, 0);
  const answeredQuestions = bySection.reduce((sum, s) => sum + s.answered, 0);
  const criticalPending = bySection.reduce((sum, s) => sum + s.criticalPending, 0);
  const sectionsCompleted = bySection.filter(
    (s) => s.status === "confirmada" || s.status === "lista_para_revisar" || s.status === "reabierta"
  ).length;

  const contradictions = computeContradictions(answers).filter((c) => c.detected);
  const recommendations = computeRecommendations(answers, recommendationDecisions).filter(
    (r) => r.detected && r.decision === "sugerida"
  );

  const updatedTimestamps = Object.values(answers)
    .map((a) => a.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort();
  const lastUpdatedAt = updatedTimestamps.length > 0 ? updatedTimestamps[updatedTimestamps.length - 1] : undefined;

  return {
    totalQuestions,
    answeredQuestions,
    percent: totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100),
    sectionsCompleted,
    sectionsTotal: discoverySections.length,
    criticalPending,
    contradictionsCount: contradictions.length,
    pendingDecisions: recommendations.length,
    lastUpdatedAt,
    bySection,
  };
}

export function totalQuestionCount(): number {
  return ALL_QUESTIONS.length;
}

export function criticalQuestionCount(): number {
  return ALL_QUESTIONS.filter((q) => q.importance === "critico").length;
}
