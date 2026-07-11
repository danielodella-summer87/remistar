/**
 * Modelos preliminares del módulo de Relevamiento (Discovery guiado).
 *
 * Estos tipos estructuran en la app el cuestionario que ya existe en
 * docs/discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md y
 * docs/discovery/REMISTAR-DISCOVERY-2-inventario-informacion.md. NO son un
 * esquema de base de datos definitivo ni reemplazan esos documentos: son la
 * forma de los datos que usa este prototipo para guiar la entrevista con
 * Gonzalo y guardar el progreso en el navegador (localStorage demo).
 */

export type ID = string;

// ---------------------------------------------------------------------------
// Clasificación de preguntas
// ---------------------------------------------------------------------------

/** critico: bloquea el diseño del proceso si no se responde. importante: aporta pero no bloquea. complementario: enriquece. */
export type DiscoveryImportance = "critico" | "importante" | "complementario";

export type DiscoveryDifficulty = "simple" | "media" | "compleja";

export type DiscoveryResponsible =
  | "gonzalo"
  | "daniel"
  | "contador"
  | "choferes"
  | "taller"
  | "proveedor_facturacion"
  | "otro";

export const DISCOVERY_RESPONSIBLE_LABELS: Record<DiscoveryResponsible, string> = {
  gonzalo: "Gonzalo",
  daniel: "Daniel",
  contador: "Contador",
  choferes: "Choferes",
  taller: "Taller",
  proveedor_facturacion: "Proveedor de facturación",
  otro: "Otro",
};

/** Estado de una pregunta individual dentro del relevamiento. */
export type DiscoveryStatus = "sin_responder" | "respondida" | "requiere_revision" | "pendiente_confirmar";

/** Estado agregado de una sección completa. */
export type DiscoverySectionStatus = "no_iniciada" | "en_progreso" | "lista_para_revisar" | "confirmada" | "requiere_revision";

// ---------------------------------------------------------------------------
// Tipos de respuesta
// ---------------------------------------------------------------------------

export type DiscoveryAnswerType =
  | "unica" // respuesta única (radio)
  | "multiple" // selección múltiple (checkbox)
  | "si_no_nose" // sí / no / no sé
  | "escala" // escala numérica (ej. 1 a 5)
  | "ranking" // ordenar opciones por prioridad
  | "matriz" // matriz filas x columnas booleanas
  | "numero"
  | "moneda"
  | "fecha"
  | "texto_corto"
  | "texto_largo"
  | "lista_dinamica" // lista de textos cortos agregados por el usuario
  | "escenario" // situación práctica + opción de decisión
  | "condicional"; // solo se muestra si otra pregunta cumple una condición

export interface DiscoveryOption {
  value: string;
  label: string;
  hint?: string;
}

export interface DiscoveryScenario {
  situation: string;
  options: DiscoveryOption[];
}

/** Pregunta visible solo si `questionId` tiene alguno de los valores de `equalsAny`. */
export interface DiscoveryDependsOn {
  questionId: ID;
  equalsAny: string[];
}

export interface DiscoveryQuestion {
  id: ID;
  sectionId: ID;
  order: number;
  title: string;
  prompt: string;
  /** "Qué necesitamos saber" */
  tip?: string;
  /** "Para qué lo necesitamos" */
  why?: string;
  importance: DiscoveryImportance;
  type: DiscoveryAnswerType;
  options?: DiscoveryOption[];
  allowOther?: boolean;
  matrixRows?: DiscoveryOption[];
  matrixCols?: DiscoveryOption[];
  /** Si es true, cada fila de la matriz se comporta como radio (una sola columna marcada) en vez de checkboxes. */
  matrixSingleSelectPerRow?: boolean;
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: [string, string];
  scenario?: DiscoveryScenario;
  placeholder?: string;
  dependsOn?: DiscoveryDependsOn;
  /** Módulos que esta respuesta afecta, ej. ["Agenda", "Choferes", "Liquidaciones"]. */
  affectsModules?: string[];
  /** Recomendación preliminar estática mostrada bajo la pregunta (distinta de las reglas dinámicas de rules.ts). */
  recommendationPreview?: string;
}

// ---------------------------------------------------------------------------
// Respuestas
// ---------------------------------------------------------------------------

export type DiscoveryAnswerValue =
  | string
  | string[]
  | number
  | boolean
  | Record<string, Record<string, boolean>> // matriz
  | undefined;

export interface DiscoveryAnswer {
  questionId: ID;
  status: DiscoveryStatus;
  value?: DiscoveryAnswerValue;
  otherText?: string;
  /** Notas de Daniel durante la entrevista. */
  note?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Secciones
// ---------------------------------------------------------------------------

export interface DiscoverySection {
  id: ID;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  objective: string;
  difficulty: DiscoveryDifficulty;
  estimatedMinutes: number;
}

export interface DiscoverySectionProgress {
  sectionId: ID;
  total: number;
  answered: number;
  criticalPending: number;
  percent: number;
  status: DiscoverySectionStatus;
}

export interface DiscoveryProgress {
  totalQuestions: number;
  answeredQuestions: number;
  percent: number;
  sectionsCompleted: number;
  sectionsTotal: number;
  criticalPending: number;
  contradictionsCount: number;
  pendingDecisions: number;
  lastUpdatedAt?: string;
  bySection: DiscoverySectionProgress[];
}

// ---------------------------------------------------------------------------
// Recomendaciones y contradicciones dinámicas
// ---------------------------------------------------------------------------

export type DiscoveryRecommendationDecision = "sugerida" | "aceptada" | "rechazada" | "revisar_despues";

export interface DiscoveryRecommendation {
  id: ID;
  detected: boolean;
  title: string;
  finding: string; // qué se detectó
  why: string; // por qué importa
  proposal: string; // propuesta
  modules: string[]; // módulos afectados
  decision: DiscoveryRecommendationDecision;
}

export interface DiscoveryContradiction {
  id: ID;
  detected: boolean;
  title: string;
  description: string;
  questionIds: ID[];
}

export interface DiscoveryDecision {
  id: ID;
  label: string;
  urgency: "ahora" | "puede_esperar" | "depende_de_otra_respuesta";
  detail?: string;
}

export interface DiscoveryNote {
  questionId: ID;
  text: string;
}
