import type { DiscoveryQuestion } from "../types";

/** Fuente: docs/discovery/REMISTAR-DISCOVERY-1-cuestionario-operativo.md §13. */
export const cobranzaQuestions: DiscoveryQuestion[] = [
  {
    id: "cobranza-medios-pago",
    sectionId: "cobranza",
    order: 1,
    title: "Medios de pago",
    prompt: "¿Cómo se cobra hoy a los clientes?",
    importance: "critico",
    type: "multiple",
    allowOther: true,
    affectsModules: ["Cobranza", "Facturación"],
    options: [
      { value: "efectivo", label: "Efectivo" },
      { value: "transferencia", label: "Transferencia" },
      { value: "tarjeta", label: "Tarjeta" },
      { value: "cuenta_corriente", label: "Cuenta corriente" },
    ],
  },
  {
    id: "cobranza-como-se-controla-deuda",
    sectionId: "cobranza",
    order: 2,
    title: "Cómo se controla la deuda",
    prompt: "¿Cómo se controla hoy quién debe y cuánto?",
    importance: "critico",
    type: "unica",
    allowOther: true,
    options: [
      { value: "planilla_o_registro", label: "Planilla o registro" },
      { value: "memoria_de_gonzalo", label: "Memoria de Gonzalo" },
      { value: "no_se_controla_formalmente", label: "No se controla formalmente" },
    ],
  },
  {
    id: "cobranza-clientes-con-atraso",
    sectionId: "cobranza",
    order: 3,
    title: "Clientes con atraso",
    prompt: "¿Hay clientes con atrasos recurrentes?",
    importance: "importante",
    type: "si_no_nose",
  },
  {
    id: "cobranza-escenario-cliente-con-deuda",
    sectionId: "cobranza",
    order: 4,
    title: "Escenario: cliente con deuda pide otro viaje",
    prompt: "Un cliente con deuda pendiente solicita un nuevo viaje. ¿Qué se hace?",
    importance: "critico",
    type: "escenario",
    scenario: {
      situation: "Un cliente que ya debe uno o más servicios anteriores pide coordinar un viaje nuevo.",
      options: [
        { value: "se_le_presta_el_servicio_igual", label: "Se le presta el servicio igual" },
        { value: "se_pide_pago_antes_de_confirmar", label: "Se pide pago antes de confirmar" },
        { value: "se_evalua_caso_a_caso", label: "Se evalúa caso a caso" },
      ],
    },
  },
  {
    id: "cobranza-escenario-empresa-paga-tarde",
    sectionId: "cobranza",
    order: 5,
    title: "Escenario: empresa que paga tarde",
    prompt: "Una empresa con cuenta corriente paga sistemáticamente tarde. ¿Qué se hace hoy?",
    importance: "importante",
    type: "escenario",
    scenario: {
      situation: "Una empresa cliente acumula atrasos de pago mes a mes, pero sigue pidiendo servicios.",
      options: [
        { value: "se_sigue_prestando_servicio", label: "Se sigue prestando el servicio sin condiciones" },
        { value: "se_le_reclama_pero_se_sigue_trabajando", label: "Se reclama, pero se sigue trabajando" },
        { value: "se_corta_el_servicio_hasta_regularizar", label: "Se corta el servicio hasta regularizar" },
      ],
    },
  },
  {
    id: "cobranza-condiciones-especiales-por-cliente",
    sectionId: "cobranza",
    order: 6,
    title: "Condiciones comerciales especiales",
    prompt: "¿Existen condiciones comerciales distintas por cliente (plazos, descuentos)?",
    importance: "complementario",
    type: "si_no_nose",
  },
];
