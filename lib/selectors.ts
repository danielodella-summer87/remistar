import {
  clients,
  passengers,
  drivers,
  vehicles,
  services,
  invoices,
  collections,
  settlements,
  expenseReports,
  maintenanceRecords,
  opportunities,
  alerts,
} from "@/lib/mock";
import { daysFromToday } from "@/lib/format";
import type { Service, Vehicle, Invoice } from "@/lib/types";

// ---------------------------------------------------------------------------
// Lookups puntuales — evitan repetir `.find(...)` en cada página
// ---------------------------------------------------------------------------

export const getClient = (id?: string) => (id ? clients.find((c) => c.id === id) : undefined);
export const getPassenger = (id?: string) => (id ? passengers.find((p) => p.id === id) : undefined);
export const getDriver = (id?: string) => (id ? drivers.find((d) => d.id === id) : undefined);
export const getVehicle = (id?: string) => (id ? vehicles.find((v) => v.id === id) : undefined);
export const getService = (id?: string) => (id ? services.find((s) => s.id === id) : undefined);
export const getInvoice = (id?: string) => (id ? invoices.find((i) => i.id === id) : undefined);
export const getSettlement = (id?: string) => (id ? settlements.find((s) => s.id === id) : undefined);

export function passengersForClient(clientId: string) {
  return passengers.filter((p) => p.clientId === clientId);
}
export function servicesForClient(clientId: string) {
  return services
    .filter((s) => s.clientId === clientId)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}
export function invoicesForClient(clientId: string) {
  return invoices.filter((i) => i.clientId === clientId);
}
export function servicesForDriver(driverId: string) {
  return services
    .filter((s) => s.driverId === driverId)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}
export function settlementsForDriver(driverId: string) {
  return settlements.filter((s) => s.driverId === driverId);
}
export function expensesForDriver(driverId: string) {
  return expenseReports.filter((e) => e.driverId === driverId);
}
export function servicesForVehicle(vehicleId: string) {
  return services
    .filter((s) => s.vehicleId === vehicleId)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}
export function maintenanceForVehicle(vehicleId: string) {
  return maintenanceRecords.filter((m) => m.vehicleId === vehicleId);
}

export function clientLabel(id?: string): string {
  return getClient(id)?.name ?? "Cliente sin identificar";
}
export function driverLabel(id?: string): string {
  return getDriver(id)?.name ?? "Sin asignar";
}
export function vehicleLabel(id?: string): string {
  const v = getVehicle(id);
  return v ? `${v.brand} ${v.model} (${v.plate})` : "Sin asignar";
}

// ---------------------------------------------------------------------------
// Agenda / servicios
// ---------------------------------------------------------------------------

export function servicesOnDate(date: string): Service[] {
  return services
    .filter((s) => s.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function todaysServices(): Service[] {
  return servicesOnDate(new Date().toISOString().slice(0, 10));
}

export function upcomingServices(limit = 6): Service[] {
  return services
    .filter((s) => daysFromToday(s.date) >= 0 && s.status !== "cancelado" && s.status !== "finalizado")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, limit);
}

export function unassignedServices(): Service[] {
  return services.filter(
    (s) => (!s.driverId || !s.vehicleId) && s.status !== "cancelado" && s.status !== "finalizado"
  );
}

export function atRiskServices(): Service[] {
  return services.filter(
    (s) => s.risk === "alto" && s.status !== "cancelado" && s.status !== "finalizado"
  );
}

// ---------------------------------------------------------------------------
// Flota
// ---------------------------------------------------------------------------

export function vehiclesByStatus(status: Vehicle["status"]): Vehicle[] {
  return vehicles.filter((v) => v.status === status);
}

export function fleetStatusSummary() {
  return {
    disponible: vehiclesByStatus("disponible").length,
    en_servicio: vehiclesByStatus("en_servicio").length,
    reservado: vehiclesByStatus("reservado").length,
    mantenimiento: vehiclesByStatus("mantenimiento").length,
    fuera_de_servicio: vehiclesByStatus("fuera_de_servicio").length,
  };
}

export function upcomingMaintenance(withinDays = 14) {
  return maintenanceRecords.filter(
    (m) => m.status !== "completado" && daysFromToday(m.scheduledDate) <= withinDays
  );
}

// ---------------------------------------------------------------------------
// Facturación / cobranza
// ---------------------------------------------------------------------------

export function overdueInvoices(): Invoice[] {
  return invoices.filter((i) => i.status === "vencida");
}

export function invoicesPendingIssue(): Invoice[] {
  return invoices.filter((i) => i.status === "pendiente");
}

export function servicesPendingInvoice() {
  const invoicedServiceIds = new Set(invoices.flatMap((i) => i.serviceIds));
  return services.filter((s) => s.status === "finalizado" && !invoicedServiceIds.has(s.id));
}

export function refacturableExpensesPending() {
  return expenseReports.filter((e) => e.refacturable && e.status !== "rechazado");
}

export function collectionsForInvoice(invoiceId: string) {
  return collections.filter((c) => c.invoiceId === invoiceId);
}

export function invoiceBalanceDue(invoice: Invoice): number {
  const paid = collectionsForInvoice(invoice.id)
    .filter((c) => c.type !== "promesa_pago")
    .reduce((sum, c) => sum + c.amount, 0);
  return Math.max(invoice.amount - paid, 0);
}

export function clientsWithDebt() {
  return clients.filter((c) => c.balance < 0).sort((a, b) => a.balance - b.balance);
}

// ---------------------------------------------------------------------------
// Liquidaciones / gastos
// ---------------------------------------------------------------------------

export function expensesForSettlement(settlementId: string) {
  return expenseReports.filter((e) => e.settlementId === settlementId);
}

export function pendingSettlements() {
  return settlements.filter(
    (s) => !["pagada", "cerrada"].includes(s.status)
  );
}

export function expensesPendingReview() {
  return expenseReports.filter((e) =>
    ["pendiente_comprobante", "pendiente_revision", "observado"].includes(e.status)
  );
}

// ---------------------------------------------------------------------------
// Comercial
// ---------------------------------------------------------------------------

export function openOpportunities() {
  return opportunities.filter((o) => o.stage !== "ganado" && o.stage !== "perdido");
}

// ---------------------------------------------------------------------------
// KPIs del dashboard
// ---------------------------------------------------------------------------

export function dashboardKpis() {
  return {
    todayServices: todaysServices().length,
    unassignedServices: unassignedServices().length,
    availableVehicles: vehiclesByStatus("disponible").length,
    pendingCollection: overdueInvoices().reduce((sum, i) => sum + invoiceBalanceDue(i), 0),
    expensesToReview: expensesPendingReview().length,
    criticalAlerts: alerts.filter((a) => a.severity === "critica" && a.status !== "resuelta").length,
  };
}
