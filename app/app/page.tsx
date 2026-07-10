import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock,
  UserX,
  CarFront,
  Wallet,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { DemoBadge } from "@/components/shared/DemoBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { RecommendationCard } from "@/components/shared/RecommendationCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { NewServiceButton } from "@/components/domain/NewServiceButton";
import { UpcomingServicesPanel } from "@/components/domain/UpcomingServicesPanel";
import { getRecommendations } from "@/lib/mock";
import {
  upcomingServices,
  dashboardKpis,
  fleetStatusSummary,
  overdueInvoices,
  pendingSettlements,
  expensesPendingReview,
  invoiceBalanceDue,
  clientLabel,
  driverLabel,
  openOpportunities,
  upcomingMaintenance,
} from "@/lib/selectors";
import { formatCurrency, formatDateLong } from "@/lib/format";
import { vehicleStatusMeta, settlementStatusMeta } from "@/lib/status";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const kpis = dashboardKpis();
  const fleet = fleetStatusSummary();
  const recommendations = getRecommendations().slice(0, 4);
  const upcoming = upcomingServices(6);
  const overdue = overdueInvoices();
  const settlementsPending = pendingSettlements();
  const expensesPending = expensesPendingReview();
  const opportunities = openOpportunities().slice(0, 4);
  const maintenanceSoon = upcomingMaintenance(10);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium capitalize text-slate-500">{formatDateLong(today)}</p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Hola, Gonzalo</h1>
            <DemoBadge />
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Hoy hay <strong className="text-slate-800">{kpis.todayServices}</strong> servicios agendados
            {kpis.unassignedServices > 0 && (
              <>
                {" "}y <strong className="text-amber-700">{kpis.unassignedServices}</strong> todavía sin chofer o vehículo.
              </>
            )}
          </p>
        </div>
        <NewServiceButton />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="Servicios de hoy" value={kpis.todayServices} icon={CalendarClock} tone="brand" />
        <MetricCard label="Sin asignar" value={kpis.unassignedServices} icon={UserX} tone={kpis.unassignedServices > 0 ? "danger" : "success"} />
        <MetricCard label="Vehículos disponibles" value={kpis.availableVehicles} icon={CarFront} tone="success" />
        <MetricCard label="Cobranza pendiente" value={formatCurrency(kpis.pendingCollection)} icon={Wallet} tone="warning" />
        <MetricCard label="Gastos por revisar" value={kpis.expensesToReview} icon={Receipt} tone="info" />
        <MetricCard label="Alertas críticas" value={kpis.criticalAlerts} icon={AlertTriangle} tone={kpis.criticalAlerts > 0 ? "danger" : "success"} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Próximos servicios */}
          <SectionCard
            title="Próximos servicios"
            description="Tocá un servicio para ver el detalle completo."
            action={<Link href="/app/servicios" className="text-xs font-medium text-petrol-700 hover:underline">Ver todos →</Link>}
          >
            <UpcomingServicesPanel services={upcoming} />
          </SectionCard>

          {/* Asistente operativo */}
          <SectionCard
            title="Asistente operativo"
            description="Recomendaciones generadas con reglas simples sobre los datos demo, sin IA real."
          >
            {recommendations.length === 0 ? (
              <p className="text-sm text-slate-500">No hay recomendaciones activas en este momento.</p>
            ) : (
              <div className="space-y-3">
                {recommendations.map((r) => (
                  <RecommendationCard key={r.id} recommendation={r} />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          {/* Estado de flota */}
          <SectionCard title="Estado de flota" action={<Link href="/app/vehiculos" className="text-xs font-medium text-petrol-700 hover:underline">Ver flota →</Link>}>
            <ul className="space-y-2.5">
              {(
                [
                  ["disponible", fleet.disponible],
                  ["en_servicio", fleet.en_servicio],
                  ["reservado", fleet.reservado],
                  ["mantenimiento", fleet.mantenimiento],
                  ["fuera_de_servicio", fleet.fuera_de_servicio],
                ] as const
              ).map(([status, count]) => {
                const meta = vehicleStatusMeta(status);
                return (
                  <li key={status} className="flex items-center justify-between text-sm">
                    <StatusBadge label={meta.label} tone={meta.tone} />
                    <span className="font-medium text-slate-700">{count}</span>
                  </li>
                );
              })}
            </ul>
            {maintenanceSoon.length > 0 && (
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {maintenanceSoon.length} vehículo(s) con mantenimiento próximo o en curso.
              </p>
            )}
          </SectionCard>

          {/* Administración */}
          <SectionCard title="Administración">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <Link href="/app/facturacion" className="text-slate-600 hover:text-petrol-700">Facturas vencidas</Link>
                <span className="font-medium text-red-600">{overdue.length}</span>
              </li>
              <li className="flex items-center justify-between">
                <Link href="/app/liquidaciones" className="text-slate-600 hover:text-petrol-700">Liquidaciones pendientes</Link>
                <span className="font-medium text-amber-700">{settlementsPending.length}</span>
              </li>
              <li className="flex items-center justify-between">
                <Link href="/app/gastos" className="text-slate-600 hover:text-petrol-700">Gastos sin comprobante</Link>
                <span className="font-medium text-amber-700">{expensesPending.length}</span>
              </li>
            </ul>
            {overdue.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                {overdue.slice(0, 2).map((inv) => (
                  <div key={inv.id} className="flex justify-between text-xs text-slate-500">
                    <span>{clientLabel(inv.clientId)}</span>
                    <span className="font-medium text-red-600">{formatCurrency(invoiceBalanceDue(inv))}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Oportunidades */}
          <SectionCard title="Oportunidades comerciales" action={<Link href="/app/oportunidades" className="text-xs font-medium text-petrol-700 hover:underline">Ver todas →</Link>}>
            {opportunities.length === 0 ? (
              <p className="text-sm text-slate-500">No hay oportunidades abiertas.</p>
            ) : (
              <ul className="space-y-3">
                {opportunities.map((o) => (
                  <li key={o.id} className="text-sm">
                    <p className="font-medium text-slate-800">{o.company}</p>
                    <p className="text-xs text-slate-500">{o.title} — {formatCurrency(o.estimatedValue)}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {settlementsPending.length > 0 && (
            <SectionCard title="Choferes con liquidación pendiente">
              <ul className="space-y-2 text-sm">
                {settlementsPending.slice(0, 4).map((s) => {
                  const meta = settlementStatusMeta(s.status);
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-2">
                      <span className="text-slate-600">{driverLabel(s.driverId)}</span>
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
