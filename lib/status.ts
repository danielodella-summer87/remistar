import type {
  ServiceStatus,
  ServiceRisk,
  VehicleStatus,
  DriverStatus,
  InvoiceStatus,
  SettlementStatus,
  ExpenseStatus,
  MaintenanceStatus,
  AlertSeverity,
  AlertStatus,
  OpportunityStage,
  CollectionType,
  VehicleOwnership,
  PaymentScheme,
} from "@/lib/types";
import type { DiscoveryStatus, DiscoverySectionStatus } from "@/lib/discovery/types";

export type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "brand";

export interface StatusMeta {
  label: string;
  tone: Tone;
}

export const toneClasses: Record<Tone, string> = {
  success: "bg-opgreen-50 text-opgreen-700 ring-1 ring-inset ring-opgreen-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  info: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  neutral: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  brand: "bg-petrol-50 text-petrol-700 ring-1 ring-inset ring-petrol-200",
};

export function serviceStatusMeta(status: ServiceStatus): StatusMeta {
  const map: Record<ServiceStatus, StatusMeta> = {
    pendiente: { label: "Pendiente", tone: "warning" },
    confirmado: { label: "Confirmado", tone: "info" },
    asignado: { label: "Asignado", tone: "brand" },
    en_curso: { label: "En curso", tone: "brand" },
    finalizado: { label: "Finalizado", tone: "success" },
    cancelado: { label: "Cancelado", tone: "neutral" },
  };
  return map[status];
}

export function riskMeta(risk: ServiceRisk): StatusMeta {
  const map: Record<ServiceRisk, StatusMeta> = {
    bajo: { label: "Riesgo bajo", tone: "success" },
    medio: { label: "Riesgo medio", tone: "warning" },
    alto: { label: "Riesgo alto", tone: "danger" },
  };
  return map[risk];
}

export function vehicleStatusMeta(status: VehicleStatus): StatusMeta {
  const map: Record<VehicleStatus, StatusMeta> = {
    disponible: { label: "Disponible", tone: "success" },
    reservado: { label: "Reservado", tone: "info" },
    en_servicio: { label: "En servicio", tone: "brand" },
    mantenimiento: { label: "En mantenimiento", tone: "warning" },
    fuera_de_servicio: { label: "Fuera de servicio", tone: "danger" },
  };
  return map[status];
}

export function driverStatusMeta(status: DriverStatus): StatusMeta {
  const map: Record<DriverStatus, StatusMeta> = {
    disponible: { label: "Disponible", tone: "success" },
    en_servicio: { label: "En servicio", tone: "brand" },
    descanso: { label: "En descanso", tone: "info" },
    inactivo: { label: "Inactivo", tone: "neutral" },
  };
  return map[status];
}

export function invoiceStatusMeta(status: InvoiceStatus): StatusMeta {
  const map: Record<InvoiceStatus, StatusMeta> = {
    pendiente: { label: "Pendiente de emitir", tone: "neutral" },
    emitida: { label: "Emitida", tone: "info" },
    vencida: { label: "Vencida", tone: "danger" },
    pagada_parcial: { label: "Pagada parcial", tone: "warning" },
    pagada: { label: "Pagada", tone: "success" },
    anulada: { label: "Anulada", tone: "neutral" },
  };
  return map[status];
}

export function collectionTypeMeta(type: CollectionType): StatusMeta {
  const map: Record<CollectionType, StatusMeta> = {
    pago_total: { label: "Pago total", tone: "success" },
    pago_parcial: { label: "Pago parcial", tone: "warning" },
    promesa_pago: { label: "Promesa de pago", tone: "info" },
  };
  return map[type];
}

export function settlementStatusMeta(status: SettlementStatus): StatusMeta {
  const map: Record<SettlementStatus, StatusMeta> = {
    borrador: { label: "Borrador", tone: "neutral" },
    pendiente_rendiciones: { label: "Pendiente de rendiciones", tone: "warning" },
    pendiente_revision: { label: "Pendiente de revisión", tone: "warning" },
    observada: { label: "Observada", tone: "danger" },
    aprobada: { label: "Aprobada", tone: "info" },
    lista_para_pagar: { label: "Lista para pagar", tone: "brand" },
    pagada_parcial: { label: "Pagada parcial", tone: "warning" },
    pagada: { label: "Pagada", tone: "success" },
    cerrada: { label: "Cerrada", tone: "success" },
    reabierta: { label: "Reabierta por ajuste", tone: "danger" },
  };
  return map[status];
}

export function expenseStatusMeta(status: ExpenseStatus): StatusMeta {
  const map: Record<ExpenseStatus, StatusMeta> = {
    pendiente_comprobante: { label: "Sin comprobante", tone: "warning" },
    pendiente_revision: { label: "Pendiente de revisión", tone: "info" },
    observado: { label: "Observado", tone: "danger" },
    aprobado: { label: "Aprobado", tone: "success" },
    aprobado_parcial: { label: "Aprobado parcial", tone: "warning" },
    rechazado: { label: "Rechazado", tone: "danger" },
    incluido_liquidacion: { label: "Incluido en liquidación", tone: "brand" },
    reintegrado: { label: "Reintegrado", tone: "success" },
  };
  return map[status];
}

export function maintenanceStatusMeta(status: MaintenanceStatus): StatusMeta {
  const map: Record<MaintenanceStatus, StatusMeta> = {
    programado: { label: "Programado", tone: "info" },
    en_taller: { label: "En taller", tone: "warning" },
    completado: { label: "Completado", tone: "success" },
    atrasado: { label: "Atrasado", tone: "danger" },
  };
  return map[status];
}

export function alertSeverityMeta(severity: AlertSeverity): StatusMeta {
  const map: Record<AlertSeverity, StatusMeta> = {
    critica: { label: "Crítica", tone: "danger" },
    alta: { label: "Alta", tone: "warning" },
    media: { label: "Media", tone: "info" },
    baja: { label: "Baja", tone: "neutral" },
  };
  return map[severity];
}

export function alertStatusMeta(status: AlertStatus): StatusMeta {
  const map: Record<AlertStatus, StatusMeta> = {
    abierta: { label: "Abierta", tone: "warning" },
    en_revision: { label: "En revisión", tone: "info" },
    resuelta: { label: "Resuelta", tone: "success" },
  };
  return map[status];
}

export function opportunityStageMeta(stage: OpportunityStage): StatusMeta {
  const map: Record<OpportunityStage, StatusMeta> = {
    nuevo: { label: "Nuevo", tone: "neutral" },
    contactado: { label: "Contactado", tone: "info" },
    propuesta: { label: "Propuesta enviada", tone: "brand" },
    negociacion: { label: "En negociación", tone: "warning" },
    ganado: { label: "Ganado", tone: "success" },
    perdido: { label: "Perdido", tone: "neutral" },
  };
  return map[stage];
}

export function discoveryStatusMeta(status: DiscoveryStatus): StatusMeta {
  const map: Record<DiscoveryStatus, StatusMeta> = {
    sin_responder: { label: "Sin responder", tone: "neutral" },
    respondida: { label: "Respondida", tone: "success" },
    requiere_revision: { label: "Requiere revisión", tone: "danger" },
    pendiente_confirmar: { label: "No lo sabemos todavía", tone: "warning" },
  };
  return map[status];
}

export function discoverySectionStatusMeta(status: DiscoverySectionStatus): StatusMeta {
  const map: Record<DiscoverySectionStatus, StatusMeta> = {
    no_iniciada: { label: "No iniciada", tone: "neutral" },
    en_progreso: { label: "En progreso", tone: "info" },
    lista_para_revisar: { label: "Lista para revisar", tone: "brand" },
    confirmada: { label: "Confirmada", tone: "success" },
    requiere_revision: { label: "Requiere revisión", tone: "danger" },
    reabierta: { label: "Reabierta", tone: "warning" },
  };
  return map[status];
}

export const discoveryImportanceLabels: Record<string, string> = {
  critico: "Crítico",
  importante: "Importante",
  complementario: "Complementario",
};

export const serviceTypeLabels: Record<string, string> = {
  aeropuerto: "Aeropuerto",
  corporativo: "Corporativo",
  ejecutivo: "Ejecutivo",
  evento: "Evento",
  interior: "Viaje al interior",
  por_hora: "Por hora",
  programado: "Programado",
  frecuente: "Cliente frecuente",
};

export const expenseCategoryLabels: Record<string, string> = {
  peaje: "Peaje",
  combustible: "Combustible",
  estacionamiento: "Estacionamiento",
  desayuno: "Desayuno",
  almuerzo_cena: "Almuerzo / cena",
  alojamiento: "Alojamiento",
  lavado: "Lavado",
  reparacion_menor: "Reparación menor",
  compra_urgente: "Compra urgente",
  otro: "Otro",
};

export const vehicleCategoryLabels: Record<string, string> = {
  sedan_ejecutivo: "Sedán ejecutivo",
  van: "Van",
  suv: "SUV",
  minibus: "Minibús",
};

export const vehicleOwnershipLabels: Record<VehicleOwnership, string> = {
  propio: "Vehículo propio",
  remistar: "Vehículo de Remistar",
};

export const paymentSchemeLabels: Record<PaymentScheme, string> = {
  comision: "Comisión por servicio",
  jornal: "Jornal",
  tarifa_fija: "Tarifa fija",
};

export const alertModuleLabels: Record<string, string> = {
  operacion: "Operación",
  mantenimiento: "Mantenimiento",
  documentacion: "Documentación",
  cobranza: "Cobranza",
  liquidaciones: "Liquidaciones",
  gastos: "Gastos",
  calidad: "Calidad",
  comercial: "Comercial",
};
