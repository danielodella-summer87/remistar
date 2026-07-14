import { getSectionById } from "./sections";
import { getQuestionById } from "./questions/index";

/**
 * Construye el link para reabrir una pregunta puntual dentro de su sección y editarla.
 * Se usa desde el resumen, los pendientes, las recomendaciones y las contradicciones.
 */
export function questionHref(questionId: string): string | undefined {
  const question = getQuestionById(questionId);
  if (!question) return undefined;
  const section = getSectionById(question.sectionId);
  if (!section) return undefined;
  return `/app/relevamiento/${section.slug}?pregunta=${encodeURIComponent(questionId)}`;
}
