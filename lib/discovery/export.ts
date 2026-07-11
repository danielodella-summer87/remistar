import { ALL_QUESTIONS, isQuestionVisible } from "./questions/index";
import { discoverySections } from "./sections";
import { computeContradictions, computeRecommendations } from "./rules";
import { computeProgress } from "./progress";
import type { DiscoveryState } from "./store";
import { DISCOVERY_RESPONSIBLE_LABELS } from "./types";

const YES_NO_UNKNOWN_LABELS: Record<string, string> = { si: "Sí", no: "No", no_se: "No sé todavía" };

function optionLabelFor(question: (typeof ALL_QUESTIONS)[number], raw: string): string {
  if (question.type === "si_no_nose") return YES_NO_UNKNOWN_LABELS[raw] ?? raw;
  if (question.type === "escenario") return question.scenario?.options.find((o) => o.value === raw)?.label ?? raw;
  return question.options?.find((o) => o.value === raw)?.label ?? raw;
}

function matrixValueLabel(question: (typeof ALL_QUESTIONS)[number], value: Record<string, Record<string, boolean>>): string {
  const rowLabel = (rowValue: string) => question.matrixRows?.find((r) => r.value === rowValue)?.label ?? rowValue;
  const colLabel = (colValue: string) => question.matrixCols?.find((c) => c.value === colValue)?.label ?? colValue;
  const parts = Object.entries(value)
    .map(([row, cols]) => {
      const marked = Object.entries(cols)
        .filter(([, checked]) => checked)
        .map(([col]) => colLabel(col));
      if (marked.length === 0) return null;
      return `${rowLabel(row)}: ${marked.join(" + ")}`;
    })
    .filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join("; ") : "(sin marcar)";
}

function answerValueLabel(question: (typeof ALL_QUESTIONS)[number], answer: { value?: unknown; otherText?: string }): string {
  const value = answer.value;
  if (value === undefined || value === null || value === "") return "(sin valor)";
  if (Array.isArray(value)) {
    const labels = value.map((v) => optionLabelFor(question, String(v)));
    return labels.join(", ") + (answer.otherText ? ` (Otro: ${answer.otherText})` : "");
  }
  if (typeof value === "object") {
    return matrixValueLabel(question, value as Record<string, Record<string, boolean>>);
  }
  return optionLabelFor(question, String(value)) + (answer.otherText ? ` (Otro: ${answer.otherText})` : "");
}

export function buildExportData(state: DiscoveryState) {
  const progress = computeProgress(state.answers, state.confirmedSections, state.recommendationDecisions);
  const contradictions = computeContradictions(state.answers).filter((c) => c.detected);
  const recommendations = computeRecommendations(state.answers, state.recommendationDecisions).filter((r) => r.detected);

  const confirmed = ALL_QUESTIONS.filter((q) => isQuestionVisible(q, state.answers))
    .filter((q) => state.answers[q.id]?.status === "respondida")
    .map((q) => ({
      section: discoverySections.find((s) => s.id === q.sectionId)?.title ?? q.sectionId,
      question: q.title,
      answer: answerValueLabel(q, state.answers[q.id] ?? {}),
      note: state.answers[q.id]?.note,
    }));

  const assumptions = ALL_QUESTIONS.filter((q) => isQuestionVisible(q, state.answers))
    .filter((q) => state.answers[q.id]?.status === "pendiente_confirmar")
    .map((q) => ({
      section: discoverySections.find((s) => s.id === q.sectionId)?.title ?? q.sectionId,
      question: q.title,
    }));

  const pending = ALL_QUESTIONS.filter((q) => isQuestionVisible(q, state.answers))
    .filter((q) => {
      const status = state.answers[q.id]?.status ?? "sin_responder";
      return status === "sin_responder" || status === "requiere_revision";
    })
    .map((q) => ({
      id: q.id,
      sectionId: q.sectionId,
      section: discoverySections.find((s) => s.id === q.sectionId)?.title ?? q.sectionId,
      question: q.title,
      importance: q.importance,
      status: state.answers[q.id]?.status ?? "sin_responder",
      responsible: inferResponsible(q.id, q.sectionId),
    }));

  const decisionsAccepted = recommendations.filter((r) => r.decision === "aceptada");

  return {
    generatedAt: new Date().toISOString(),
    progress,
    confirmed,
    assumptions,
    pending,
    contradictions,
    recommendations,
    decisionsAccepted,
  };
}

export type DiscoveryExportData = ReturnType<typeof buildExportData>;

export function buildExportMarkdown(data: DiscoveryExportData): string {
  const lines: string[] = [];
  lines.push("# Relevamiento Remistar — Resumen");
  lines.push("");
  lines.push(`_Generado el ${new Date(data.generatedAt).toLocaleString("es-UY")}_`);
  lines.push("");
  lines.push(`Progreso general: ${data.progress.percent}% (${data.progress.answeredQuestions}/${data.progress.totalQuestions} preguntas)`);
  lines.push("");

  lines.push("## Procesos confirmados");
  if (data.confirmed.length === 0) lines.push("_Sin respuestas confirmadas todavía._");
  for (const item of data.confirmed) {
    lines.push(`- **[${item.section}] ${item.question}:** ${item.answer}${item.note ? ` _(nota: ${item.note})_` : ""}`);
  }
  lines.push("");

  lines.push("## Supuestos (marcados como 'no lo sabemos todavía')");
  if (data.assumptions.length === 0) lines.push("_Sin supuestos pendientes de confirmar._");
  for (const item of data.assumptions) {
    lines.push(`- [${item.section}] ${item.question}`);
  }
  lines.push("");

  lines.push("## Preguntas pendientes");
  if (data.pending.length === 0) lines.push("_No hay preguntas pendientes._");
  for (const item of data.pending) {
    lines.push(`- [${item.section}] ${item.question} (${item.importance}${item.status === "requiere_revision" ? ", requiere revisión" : ""})`);
  }
  lines.push("");

  lines.push("## Contradicciones detectadas");
  if (data.contradictions.length === 0) lines.push("_No se detectaron contradicciones._");
  for (const item of data.contradictions) {
    lines.push(`- **${item.title}:** ${item.description}`);
  }
  lines.push("");

  lines.push("## Recomendaciones");
  if (data.recommendations.length === 0) lines.push("_No hay recomendaciones disparadas todavía._");
  for (const item of data.recommendations) {
    lines.push(`- **${item.title}** (${item.decision}) — ${item.proposal} _(módulos: ${item.modules.join(", ")})_`);
  }
  lines.push("");

  lines.push("## Decisiones aceptadas");
  if (data.decisionsAccepted.length === 0) lines.push("_Sin decisiones aceptadas todavía._");
  for (const item of data.decisionsAccepted) {
    lines.push(`- ${item.title}`);
  }
  lines.push("");

  lines.push("## Próximos pasos");
  lines.push("- Revisar las preguntas pendientes marcadas como críticas.");
  lines.push("- Resolver las contradicciones detectadas con Gonzalo.");
  lines.push("- Confirmar o rechazar las recomendaciones sugeridas.");

  return lines.join("\n");
}

/**
 * Estimación inicial de a quién le corresponde resolver una pregunta pendiente, según el tema.
 * Es una sugerencia de agrupación, no una asignación definitiva: casi todo depende primero de Gonzalo.
 */
function inferResponsible(questionId: string, sectionId: string): keyof typeof DISCOVERY_RESPONSIBLE_LABELS {
  if (questionId.includes("taller")) return "taller";
  if (sectionId === "facturacion" && (questionId.includes("e-factura") || questionId.includes("datos-fiscales"))) return "contador";
  if (questionId.includes("sistema-no-reemplazable") || questionId.includes("facturacion-sistema-actual")) return "proveedor_facturacion";
  if (sectionId === "choferes" && questionId.includes("documentos")) return "choferes";
  return "gonzalo";
}

export function buildResponsibleGroups(data: DiscoveryExportData) {
  const groups: Record<string, DiscoveryExportData["pending"]> = {};
  for (const key of Object.keys(DISCOVERY_RESPONSIBLE_LABELS)) {
    groups[key] = [];
  }
  for (const item of data.pending) {
    groups[item.responsible].push(item);
  }
  return groups;
}
