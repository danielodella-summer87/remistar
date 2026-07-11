import type { DiscoveryQuestion } from "../types";
import { empresaQuestions } from "./01-empresa";
import { serviciosQuestions } from "./02-servicios";
import { consultasQuestions } from "./03-consultas";
import { clientesQuestions } from "./04-clientes";
import { agendaQuestions } from "./05-agenda";
import { choferesQuestions } from "./06-choferes";
import { vehiculosQuestions } from "./07-vehiculos";
import { asignacionQuestions } from "./08-asignacion";
import { ejecucionQuestions } from "./09-ejecucion";
import { imprevistosQuestions } from "./10-imprevistos";
import { mantenimientoQuestions } from "./11-mantenimiento";
import { documentacionQuestions } from "./12-documentacion";
import { gastosQuestions } from "./13-gastos";
import { liquidacionesQuestions } from "./14-liquidaciones";
import { facturacionQuestions } from "./15-facturacion";
import { cobranzaQuestions } from "./16-cobranza";
import { oportunidadesQuestions } from "./17-oportunidades";
import { calidadQuestions } from "./18-calidad";
import { reportesQuestions } from "./19-reportes";
import { automatizacionesQuestions } from "./20-automatizaciones";

export const ALL_QUESTIONS: DiscoveryQuestion[] = [
  ...empresaQuestions,
  ...serviciosQuestions,
  ...consultasQuestions,
  ...clientesQuestions,
  ...agendaQuestions,
  ...choferesQuestions,
  ...vehiculosQuestions,
  ...asignacionQuestions,
  ...ejecucionQuestions,
  ...imprevistosQuestions,
  ...mantenimientoQuestions,
  ...documentacionQuestions,
  ...gastosQuestions,
  ...liquidacionesQuestions,
  ...facturacionQuestions,
  ...cobranzaQuestions,
  ...oportunidadesQuestions,
  ...calidadQuestions,
  ...reportesQuestions,
  ...automatizacionesQuestions,
];

export function getQuestionsBySection(sectionId: string): DiscoveryQuestion[] {
  return ALL_QUESTIONS.filter((question) => question.sectionId === sectionId).sort((a, b) => a.order - b.order);
}

export function getQuestionById(questionId: string): DiscoveryQuestion | undefined {
  return ALL_QUESTIONS.find((question) => question.id === questionId);
}

export function isQuestionVisible(question: DiscoveryQuestion, answers: Record<string, { value?: unknown }>): boolean {
  if (!question.dependsOn) return true;
  const parentAnswer = answers[question.dependsOn.questionId];
  const parentValue = parentAnswer?.value;
  if (parentValue === undefined) return false;
  const values = Array.isArray(parentValue) ? parentValue.map(String) : [String(parentValue)];
  return values.some((value) => question.dependsOn?.equalsAny.includes(value));
}
