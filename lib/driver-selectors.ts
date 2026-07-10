import type {
  Service,
  ExpenseReport,
  DriverIncident,
  DriverServiceStatus,
  DriverServiceHistoryEntry,
} from "@/lib/types";
import type { DriverDemoState } from "@/lib/driver-store";
import { defaultDriverServiceStatus, synthesizeDriverHistory } from "@/lib/driver-status";
import { services, expenseReports, settlements, drivers, vehicles } from "@/lib/mock";
import { driverIncidents } from "@/lib/mock/incidents";
import { daysFromToday } from "@/lib/format";

export function getDriverServiceStatus(service: Service, demoState: DriverDemoState): DriverServiceStatus {
  return demoState.serviceStatus[service.id] ?? defaultDriverServiceStatus(service.status);
}

export function getDriverServiceHistory(service: Service, demoState: DriverDemoState): DriverServiceHistoryEntry[] {
  return demoState.serviceHistory[service.id] ?? synthesizeDriverHistory(service);
}

export function listDriverServices(driverId: string): Service[] {
  return services
    .filter((s) => s.driverId === driverId)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

/** Servicio actual (en curso) o el próximo servicio activo del chofer, para el dashboard. */
export function getCurrentOrNextService(driverId: string, demoState: DriverDemoState): Service | undefined {
  const active = listDriverServices(driverId).filter((s) => {
    const status = getDriverServiceStatus(s, demoState);
    return status !== "cerrado" && status !== "rechazado" && daysFromToday(s.date) >= 0;
  });
  if (active.length === 0) return undefined;
  // Prioriza el que tenga el estado más avanzado (más "en curso"), y ante empate, el más próximo en el tiempo.
  const inProgress = active.find((s) => {
    const st = getDriverServiceStatus(s, demoState);
    return !["pendiente_aceptacion", "asignado"].includes(st);
  });
  return inProgress ?? active[0];
}

export function getNextServiceAfter(driverId: string, serviceId: string, demoState: DriverDemoState): Service | undefined {
  const active = listDriverServices(driverId).filter((s) => {
    const status = getDriverServiceStatus(s, demoState);
    return s.id !== serviceId && status !== "cerrado" && status !== "rechazado" && daysFromToday(s.date) >= 0;
  });
  return active[0];
}

export function getDriverExpenses(driverId: string, demoState: DriverDemoState): ExpenseReport[] {
  const seeded = expenseReports.filter((e) => e.driverId === driverId);
  const drafts = demoState.expenseDrafts.filter((e) => e.driverId === driverId);
  return [...drafts, ...seeded].sort((a, b) => b.date.localeCompare(a.date));
}

export function getDriverIncidents(driverId: string, demoState: DriverDemoState): DriverIncident[] {
  const seeded = driverIncidents.filter((i) => i.driverId === driverId);
  const drafts = demoState.incidentDrafts.filter((i) => i.driverId === driverId);
  return [...drafts, ...seeded].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getDriverSettlements(driverId: string) {
  return settlements
    .filter((s) => s.driverId === driverId)
    .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd));
}

export interface DriverAlertItem {
  id: string;
  title: string;
  description: string;
  tone: "success" | "warning" | "danger" | "info" | "neutral" | "brand";
}

/** Alertas personales del chofer: reglas simples sobre datos reales del propio chofer, sin IA. */
export function getDriverAlerts(driverId: string, demoState: DriverDemoState): DriverAlertItem[] {
  const alerts: DriverAlertItem[] = [];
  const driver = drivers.find((d) => d.id === driverId);
  const myServices = listDriverServices(driverId);
  const vehicle = vehicles.find((v) => v.id === driver?.usualVehicleId);

  const pendingAcceptance = myServices.filter(
    (s) => getDriverServiceStatus(s, demoState) === "pendiente_aceptacion" && daysFromToday(s.date) <= 1
  );
  pendingAcceptance.forEach((s) => {
    alerts.push({
      id: `alert-accept-${s.id}`,
      title: "Servicio sin aceptar",
      description: `${s.code} — ${s.origin} → ${s.destination}, ${s.time}.`,
      tone: "warning",
    });
  });

  const today = myServices.find((s) => daysFromToday(s.date) === 0);
  if (today) {
    const status = getDriverServiceStatus(today, demoState);
    if (!["cerrado", "rechazado", "en_viaje", "finalizado", "pendiente_rendicion"].includes(status)) {
      const [h, m] = today.time.split(":").map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(h, m, 0, 0);
      const minutesLeft = Math.round((target.getTime() - now.getTime()) / 60000);
      if (minutesLeft > 0 && minutesLeft <= 180) {
        alerts.push({
          id: `alert-soon-${today.id}`,
          title: `Próximo viaje en ${minutesLeft} minutos`,
          description: `${today.code} — presentación ${today.time} en ${today.origin}.`,
          tone: "info",
        });
      }
    }
    if (today.notes?.toLowerCase().includes("cartel")) {
      alerts.push({
        id: `alert-sign-${today.id}`,
        title: "Cliente solicita cartel identificatorio",
        description: `${today.code}: llevá un cartel con el nombre del pasajero.`,
        tone: "info",
      });
    }
  }

  if (vehicle && daysFromToday(vehicle.nextServiceDate) <= 15) {
    alerts.push({
      id: `alert-service-${vehicle.id}`,
      title: "Vehículo próximo a service",
      description: `${vehicle.brand} ${vehicle.model} (${vehicle.plate}) — service en ${Math.max(daysFromToday(vehicle.nextServiceDate), 0)} días.`,
      tone: "warning",
    });
  }
  if (vehicle && daysFromToday(vehicle.registrationExpiry) <= 30) {
    alerts.push({
      id: `alert-doc-vehicle-${vehicle.id}`,
      title: "Documento del vehículo próximo a vencer",
      description: `Patente/inspección de ${vehicle.plate} vence en ${Math.max(daysFromToday(vehicle.registrationExpiry), 0)} días.`,
      tone: "danger",
    });
  }

  if (driver && daysFromToday(driver.licenseExpiry) <= 45) {
    alerts.push({
      id: `alert-doc-license-${driver.id}`,
      title: "Tu licencia profesional está por vencer",
      description: `Vence en ${Math.max(daysFromToday(driver.licenseExpiry), 0)} días — coordiná la renovación con tiempo.`,
      tone: "danger",
    });
  }

  const expenses = getDriverExpenses(driverId, demoState);
  const missingReceipt = expenses.filter((e) => e.status === "pendiente_comprobante");
  if (missingReceipt.length > 0) {
    alerts.push({
      id: "alert-expense-receipt",
      title: "Gasto sin comprobante",
      description: `Tenés ${missingReceipt.length} gasto(s) esperando el comprobante.`,
      tone: "warning",
    });
  }
  const observedExpenses = expenses.filter((e) => e.status === "observado");
  if (observedExpenses.length > 0) {
    alerts.push({
      id: "alert-expense-observed",
      title: "Gasto observado",
      description: `Un responsable pidió una aclaración sobre ${observedExpenses.length} gasto(s).`,
      tone: "danger",
    });
  }

  const observedSettlement = getDriverSettlements(driverId).find((s) => s.status === "observada");
  if (observedSettlement) {
    alerts.push({
      id: `alert-settlement-${observedSettlement.id}`,
      title: "Liquidación observada",
      description: `Período ${observedSettlement.periodLabel} — requiere revisión administrativa antes de aprobarse.`,
      tone: "danger",
    });
  }

  return alerts;
}
