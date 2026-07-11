import type { DiscoveryAnswer, DiscoveryContradiction, DiscoveryRecommendation, DiscoveryRecommendationDecision } from "./types";

/**
 * Reglas simples basadas en las respuestas ya cargadas, sin IA externa. Cada regla es una función pura:
 * (answers) => boolean, más el texto ya redactado de qué se detectó, por qué importa y la propuesta.
 * Ninguna regla marca nada como decisión definitiva: solo sugiere.
 */

export type AnswersMap = Record<string, DiscoveryAnswer>;

function valueOf(answers: AnswersMap, questionId: string) {
  return answers[questionId]?.value;
}

function includesValue(answers: AnswersMap, questionId: string, option: string): boolean {
  const value = valueOf(answers, questionId);
  if (Array.isArray(value)) return value.includes(option);
  return value === option;
}

function equalsValue(answers: AnswersMap, questionId: string, option: string): boolean {
  return valueOf(answers, questionId) === option;
}

interface RecommendationRule {
  id: string;
  title: string;
  finding: string;
  why: string;
  proposal: string;
  modules: string[];
  isDetected: (answers: AnswersMap) => boolean;
}

const RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    id: "rec-diferenciar-roles-empresa",
    title: "Diferenciar solicitante, pasajero, pagador y contacto administrativo",
    finding: "Remistar trabaja con clientes de tipo empresa.",
    why: "En una empresa puede pedir el viaje una secretaria, viajar otra persona, pagar la empresa y recibir la factura un contacto administrativo diferente.",
    proposal: "Conviene diferenciar solicitante, pasajero, pagador y contacto administrativo como roles separados.",
    modules: ["Clientes y pasajeros", "Facturación"],
    isDetected: (answers) => includesValue(answers, "clientes-tipos-cliente", "empresa"),
  },
  {
    id: "rec-separar-liquidacion-vehiculo-propio",
    title: "Separar liquidación, reintegros y costos de vehículo propio",
    finding: "Hay choferes que trabajan con vehículo propio.",
    why: "Cuando el chofer aporta el vehículo, sus costos (combustible, desgaste) no deberían mezclarse con la comisión del servicio.",
    proposal: "Será necesario separar liquidación por servicio, reintegros y costos del vehículo.",
    modules: ["Liquidación de choferes", "Gastos y rendiciones"],
    isDetected: (answers) =>
      equalsValue(answers, "choferes-vehiculo-propiedad", "siempre_propio") ||
      equalsValue(answers, "choferes-vehiculo-propiedad", "puede_ser_cualquiera"),
  },
  {
    id: "rec-plantillas-recurrentes",
    title: "Incorporar plantillas de reserva y repetición automática",
    finding: "Existen servicios recurrentes o contratados.",
    why: "Cargar un servicio recurrente a mano, viaje por viaje, es trabajo repetido y propenso a errores.",
    proposal: "Conviene incorporar plantillas de reserva y repetición automática para servicios recurrentes.",
    modules: ["Agenda y coordinación", "Servicios"],
    isDetected: (answers) => equalsValue(answers, "servicios-recurrentes-existen", "si"),
  },
  {
    id: "rec-cuenta-corriente-cobranza",
    title: "Relacionar cobranza y facturación con cada servicio y cliente",
    finding: "Existen clientes con cuenta corriente.",
    why: "Sin trazabilidad servicio-cliente-factura, controlar cuánto debe cada cliente se vuelve manual y propenso a error.",
    proposal: "Cobranza y facturación deben relacionarse con cada servicio y cliente.",
    modules: ["Cobranza", "Facturación"],
    isDetected: (answers) => includesValue(answers, "cobranza-medios-pago", "cuenta_corriente"),
  },
  {
    id: "rec-odometro-portal-chofer",
    title: "Solicitar actualización periódica del odómetro",
    finding: "El mantenimiento se controla (también) por kilometraje.",
    why: "Sin un dato de kilometraje actualizado, no se puede anticipar cuándo un vehículo necesita service.",
    proposal: "El portal del chofer debería solicitar actualización periódica del odómetro.",
    modules: ["Mantenimiento", "Portal del chofer"],
    isDetected: (answers) => includesValue(answers, "mantenimiento-criterio-control", "por_kilometraje"),
  },
  {
    id: "rec-registrar-autorizacion-gastos",
    title: "Registrar quién autorizó cada gasto, cuándo y por qué",
    finding: "Los gastos de los choferes requieren autorización previa.",
    why: "Sin trazabilidad de la autorización, es difícil resolver diferencias o reclamos sobre un gasto.",
    proposal: "El sistema debería registrar quién autorizó, cuándo y por qué.",
    modules: ["Gastos y rendiciones"],
    isDetected: (answers) => equalsValue(answers, "gastos-requiere-autorizacion-previa", "si"),
  },
  {
    id: "rec-priorizar-alertas-sobre-automatizacion",
    title: "Priorizar alertas y recomendaciones antes que automatizaciones autónomas",
    finding: "Gonzalo concentra hoy todas las decisiones críticas.",
    why: "Automatizar decisiones que hoy dependen de un solo criterio humano es riesgoso sin un período de confianza previo.",
    proposal: "La primera etapa debería priorizar alertas y recomendaciones, no automatizaciones autónomas.",
    modules: ["Automatizaciones e inteligencia"],
    isDetected: (answers) => equalsValue(answers, "empresa-delegacion-decisiones", "gonzalo_todo"),
  },
];

export function computeRecommendations(
  answers: AnswersMap,
  decisions: Record<string, DiscoveryRecommendationDecision>
): DiscoveryRecommendation[] {
  return RECOMMENDATION_RULES.map((rule) => ({
    id: rule.id,
    detected: rule.isDetected(answers),
    title: rule.title,
    finding: rule.finding,
    why: rule.why,
    proposal: rule.proposal,
    modules: rule.modules,
    decision: decisions[rule.id] ?? "sugerida",
  }));
}

interface ContradictionRule {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  isDetected: (answers: AnswersMap) => boolean;
}

const CONTRADICTION_RULES: ContradictionRule[] = [
  {
    id: "con-choferes-no-ven-importe-pero-aprueban",
    title: "Choferes no ven importes, pero aprueban su liquidación por viaje",
    description:
      "Se indicó que los choferes no ven el importe total del viaje, pero también que revisan el importe de cada viaje al confirmar su liquidación.",
    questionIds: ["choferes-ven-importe-total", "liquidacion-choferes-confirmacion"],
    isDetected: (answers) =>
      equalsValue(answers, "choferes-ven-importe-total", "no") &&
      includesValue(answers, "liquidacion-choferes-confirmacion", "revisa_importe_por_viaje"),
  },
  {
    id: "con-gasto-sin-comprobante-permitido",
    title: "El comprobante es obligatorio, pero un tipo de gasto no lo requiere",
    description:
      "Se indicó que el comprobante es obligatorio para todos los gastos, pero en la matriz de tipos de gasto el desayuno quedó marcado sin exigir comprobante.",
    questionIds: ["gastos-comprobante-obligatorio", "gastos-matriz-tipos"],
    isDetected: (answers) => {
      if (!equalsValue(answers, "gastos-comprobante-obligatorio", "si")) return false;
      const matrix = valueOf(answers, "gastos-matriz-tipos") as Record<string, Record<string, boolean>> | undefined;
      const desayuno = matrix?.desayuno;
      return desayuno !== undefined && desayuno.requiere_comprobante === false;
    },
  },
  {
    id: "con-vehiculo-vencido-sigue-disponible",
    title: "Un vehículo con documentación vencida puede seguir disponible",
    description:
      "Se marcó 'documentación vencida' como un estado posible del vehículo, pero se indicó que la documentación vencida no bloquea su disponibilidad.",
    questionIds: ["documentacion-bloquea-vehiculo", "vehiculos-estados-usados"],
    isDetected: (answers) =>
      equalsValue(answers, "documentacion-bloquea-vehiculo", "no") &&
      includesValue(answers, "vehiculos-estados-usados", "documentacion_vencida"),
  },
  {
    id: "con-liquidacion-mensual-y-por-viaje",
    title: "La liquidación es mensual, pero también se seleccionó pago por viaje",
    description:
      "Se marcaron 'mensual' y 'por viaje' como periodicidad de liquidación sin aclarar que varía según el chofer.",
    questionIds: ["liquidacion-periodicidad"],
    isDetected: (answers) =>
      includesValue(answers, "liquidacion-periodicidad", "mensual") &&
      includesValue(answers, "liquidacion-periodicidad", "por_viaje") &&
      !includesValue(answers, "liquidacion-periodicidad", "varia_por_chofer"),
  },
  {
    id: "con-sin-corporativos-pero-cuenta-corriente",
    title: "No hay clientes corporativos, pero existe cuenta corriente",
    description: "No se marcó 'empresa' entre los tipos de cliente, pero sí se indicó que existe cobro por cuenta corriente.",
    questionIds: ["clientes-tipos-cliente", "cobranza-medios-pago"],
    isDetected: (answers) =>
      !includesValue(answers, "clientes-tipos-cliente", "empresa") &&
      includesValue(answers, "cobranza-medios-pago", "cuenta_corriente"),
  },
  {
    id: "con-sin-km-pero-mantenimiento-por-km",
    title: "No se registran kilómetros, pero el mantenimiento se controla por kilometraje",
    description:
      "Se indicó que no se registra el kilometraje recorrido por servicio, pero también que el mantenimiento se controla por kilometraje.",
    questionIds: ["ejecucion-registra-kilometraje", "mantenimiento-criterio-control"],
    isDetected: (answers) =>
      equalsValue(answers, "ejecucion-registra-kilometraje", "no") &&
      includesValue(answers, "mantenimiento-criterio-control", "por_kilometraje"),
  },
];

export function computeContradictions(answers: AnswersMap): DiscoveryContradiction[] {
  return CONTRADICTION_RULES.map((rule) => ({
    id: rule.id,
    detected: rule.isDetected(answers),
    title: rule.title,
    description: rule.description,
    questionIds: rule.questionIds,
  }));
}
