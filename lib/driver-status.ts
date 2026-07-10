import type {
  DriverServiceStatus,
  DriverServiceHistoryEntry,
  ServiceStatus,
  Service,
  DriverAvailabilityStatus,
  DriverIncidentType,
  DriverIncidentSeverity,
  DriverIncidentStatus,
} from "@/lib/types";
import type { Tone } from "@/lib/status";
import { formatDate } from "@/lib/format";

/** Orden estricto del flujo demo. Ningún estado puede saltear al siguiente. */
export const DRIVER_SERVICE_STATUS_ORDER: DriverServiceStatus[] = [
  "asignado",
  "pendiente_aceptacion",
  "aceptado",
  "en_camino",
  "en_origen",
  "pasajero_a_bordo",
  "en_viaje",
  "finalizado",
  "pendiente_rendicion",
  "cerrado",
];

export interface DriverStatusMeta {
  label: string;
  tone: Tone;
}

export function driverServiceStatusMeta(status: DriverServiceStatus): DriverStatusMeta {
  const map: Record<DriverServiceStatus, DriverStatusMeta> = {
    asignado: { label: "Asignado", tone: "neutral" },
    pendiente_aceptacion: { label: "Pendiente de aceptación", tone: "warning" },
    aceptado: { label: "Aceptado", tone: "info" },
    rechazado: { label: "Rechazado", tone: "danger" },
    en_camino: { label: "En camino", tone: "brand" },
    en_origen: { label: "En origen", tone: "brand" },
    pasajero_a_bordo: { label: "Pasajero a bordo", tone: "brand" },
    en_viaje: { label: "En viaje", tone: "brand" },
    finalizado: { label: "Finalizado", tone: "success" },
    pendiente_rendicion: { label: "Pendiente de rendición", tone: "warning" },
    cerrado: { label: "Cerrado", tone: "neutral" },
  };
  return map[status];
}

/** Siguiente estado válido, o null si es terminal (cerrado / rechazado). */
export function nextDriverServiceStatus(status: DriverServiceStatus): DriverServiceStatus | null {
  if (status === "rechazado") return null;
  const idx = DRIVER_SERVICE_STATUS_ORDER.indexOf(status);
  if (idx === -1 || idx === DRIVER_SERVICE_STATUS_ORDER.length - 1) return null;
  return DRIVER_SERVICE_STATUS_ORDER[idx + 1];
}

/** Texto del único CTA principal visible para avanzar desde este estado. */
export function ctaLabelForDriverStatus(status: DriverServiceStatus): string | null {
  const map: Partial<Record<DriverServiceStatus, string>> = {
    pendiente_aceptacion: "Aceptar servicio",
    aceptado: "Iniciar traslado",
    en_camino: "Llegué al origen",
    en_origen: "Pasajero a bordo",
    pasajero_a_bordo: "Iniciar viaje",
    en_viaje: "Finalizar servicio",
    finalizado: "Marcar gastos rendidos",
    pendiente_rendicion: "Cerrar servicio",
  };
  return map[status] ?? null;
}

/** Estado inicial demo derivado del ServiceStatus administrativo, cuando el chofer todavía no interactuó. */
export function defaultDriverServiceStatus(adminStatus: ServiceStatus): DriverServiceStatus {
  switch (adminStatus) {
    case "pendiente":
    case "confirmado":
    case "asignado":
      return "pendiente_aceptacion";
    case "en_curso":
      return "en_viaje";
    case "finalizado":
      return "cerrado";
    case "cancelado":
      return "rechazado";
    default:
      return "pendiente_aceptacion";
  }
}

export function driverAvailabilityMeta(status: DriverAvailabilityStatus): DriverStatusMeta {
  const map: Record<DriverAvailabilityStatus, DriverStatusMeta> = {
    disponible: { label: "Disponible", tone: "success" },
    en_servicio: { label: "En servicio", tone: "brand" },
    descanso: { label: "En descanso", tone: "info" },
    inactivo: { label: "No disponible", tone: "neutral" },
  };
  return map[status];
}

export const DRIVER_AVAILABILITY_OPTIONS: DriverAvailabilityStatus[] = [
  "disponible",
  "en_servicio",
  "descanso",
  "inactivo",
];

export const driverIncidentTypeLabels: Record<DriverIncidentType, string> = {
  mecanico: "Problema mecánico",
  accidente: "Accidente",
  atraso: "Atraso",
  pasajero_ausente: "Pasajero ausente",
  cambio_recorrido: "Cambio de recorrido",
  problema_pago: "Problema de pago",
  problema_cliente: "Problema con el cliente",
  equipaje_no_informado: "Equipaje no informado",
  otro: "Otro",
};

export const DRIVER_INCIDENT_TYPES: DriverIncidentType[] = [
  "mecanico",
  "accidente",
  "atraso",
  "pasajero_ausente",
  "cambio_recorrido",
  "problema_pago",
  "problema_cliente",
  "equipaje_no_informado",
  "otro",
];

export function driverIncidentSeverityMeta(severity: DriverIncidentSeverity): DriverStatusMeta {
  const map: Record<DriverIncidentSeverity, DriverStatusMeta> = {
    baja: { label: "Gravedad baja", tone: "neutral" },
    media: { label: "Gravedad media", tone: "warning" },
    alta: { label: "Gravedad alta", tone: "danger" },
  };
  return map[severity];
}

export function driverIncidentStatusMeta(status: DriverIncidentStatus): DriverStatusMeta {
  const map: Record<DriverIncidentStatus, DriverStatusMeta> = {
    reportada: { label: "Reportada", tone: "warning" },
    en_revision: { label: "En revisión", tone: "info" },
    resuelta: { label: "Resuelta", tone: "success" },
    cerrada: { label: "Cerrada", tone: "neutral" },
  };
  return map[status];
}

/** Historial sintetizado (sin overlay guardado todavía) a partir del estado administrativo del servicio. */
export function synthesizeDriverHistory(service: Service): DriverServiceHistoryEntry[] {
  const target = defaultDriverServiceStatus(service.status);
  const targetIdx = DRIVER_SERVICE_STATUS_ORDER.indexOf(target);
  const at = formatDate(service.date);
  if (target === "rechazado") {
    return [
      { status: "asignado", at },
      { status: "rechazado", at, note: service.notes ?? "Servicio no confirmado por el chofer." },
    ];
  }
  return DRIVER_SERVICE_STATUS_ORDER.slice(0, targetIdx + 1).map((status) => ({ status, at }));
}
