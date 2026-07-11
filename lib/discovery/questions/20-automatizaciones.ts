import type { DiscoveryQuestion } from "../types";

/**
 * Fuente: catálogo de motores inteligentes de docs/producto/REMISTAR-MOTORES-INTELIGENTES-V0.md
 * (21 motores, todos con aprobación humana requerida). Ninguno se marca como decisión automática definitiva.
 */
export const automatizacionesQuestions: DiscoveryQuestion[] = [
  {
    id: "automatizaciones-nivel-por-funcion",
    sectionId: "automatizaciones",
    order: 1,
    title: "Nivel de autonomía por función",
    prompt: "Para cada función posible del sistema, marcá el nivel de autonomía que le darías hoy.",
    tip: "Elegí una sola columna por fila: desde 'solo informar' hasta 'nunca automatizar'.",
    why: "Define el límite entre lo que el sistema puede sugerir y lo que Gonzalo debe seguir decidiendo.",
    importance: "critico",
    type: "matriz",
    matrixSingleSelectPerRow: true,
    affectsModules: ["Automatizaciones e inteligencia"],
    matrixRows: [
      { value: "completar_consultas", label: "Completar datos de una consulta" },
      { value: "detectar_datos_faltantes", label: "Detectar datos faltantes" },
      { value: "sugerir_tarifa", label: "Sugerir tarifa" },
      { value: "sugerir_chofer", label: "Sugerir chofer" },
      { value: "sugerir_vehiculo", label: "Sugerir vehículo" },
      { value: "detectar_conflictos", label: "Detectar conflictos de agenda" },
      { value: "advertir_atrasos", label: "Advertir atrasos" },
      { value: "advertir_mantenimientos", label: "Advertir mantenimientos" },
      { value: "revisar_gastos", label: "Revisar gastos" },
      { value: "detectar_duplicados", label: "Detectar duplicados" },
      { value: "preparar_liquidaciones", label: "Preparar liquidaciones" },
      { value: "priorizar_cobranza", label: "Priorizar cobranza" },
      { value: "detectar_oportunidades", label: "Detectar oportunidades comerciales" },
      { value: "resumir_prioridades", label: "Resumir prioridades del día" },
    ],
    matrixCols: [
      { value: "solo_informar", label: "Solo informar" },
      { value: "recomendar", label: "Recomendar" },
      { value: "preparar_accion", label: "Preparar la acción" },
      { value: "ejecutar_con_aprobacion", label: "Ejecutar con aprobación" },
      { value: "nunca_automatizar", label: "Nunca automatizar" },
    ],
  },
  {
    id: "automatizaciones-confianza-general",
    sectionId: "automatizaciones",
    order: 2,
    title: "Nivel de confianza general",
    prompt: "En una escala del 1 al 5, ¿qué tan cómodo se siente Gonzalo hoy delegando decisiones a un sistema, aunque sea con aprobación?",
    importance: "importante",
    type: "escala",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: ["Nada cómodo", "Totalmente cómodo"],
  },
  {
    id: "automatizaciones-otras-ideas",
    sectionId: "automatizaciones",
    order: 3,
    title: "Otras ideas",
    prompt: "¿Hay alguna otra tarea que le gustaría que el sistema sugiera o prepare automáticamente?",
    importance: "complementario",
    type: "texto_largo",
  },
];
