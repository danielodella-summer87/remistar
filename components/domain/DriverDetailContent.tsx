import type { Driver } from "@/lib/types";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate, daysFromToday } from "@/lib/format";
import { driverStatusMeta, serviceStatusMeta, settlementStatusMeta, expenseStatusMeta, expenseCategoryLabels } from "@/lib/status";
import { servicesForDriver, settlementsForDriver, expensesForDriver, vehicleLabel } from "@/lib/selectors";
import { alerts } from "@/lib/mock";

function docTone(days: number): "success" | "warning" | "danger" {
  if (days < 0) return "danger";
  if (days <= 30) return "warning";
  return "success";
}
function docLabel(days: number): string {
  if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
  if (days === 0) return "Vence hoy";
  return `Vence en ${days} días`;
}

export function DriverDetailContent({ driver }: { driver: Driver }) {
  const status = driverStatusMeta(driver.status);
  const upcoming = servicesForDriver(driver.id).find(
    (s) => daysFromToday(s.date) >= 0 && s.status !== "cancelado" && s.status !== "finalizado"
  );
  const recentServices = servicesForDriver(driver.id).slice(0, 5);
  const driverSettlements = settlementsForDriver(driver.id);
  const driverExpenses = expensesForDriver(driver.id);
  const driverAlerts = alerts.filter((a) => a.relatedEntity?.includes(driver.name));

  const docs = [
    { label: "Licencia profesional", date: driver.licenseExpiry },
    { label: "Antecedentes", date: driver.backgroundCheckExpiry },
    { label: "Carné de salud", date: driver.healthCertExpiry },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <StatusBadge label={status.label} tone={status.tone} />
        <StatusBadge label={`${driver.vehicleOwnership === "propio" ? "Vehículo propio" : "Vehículo de Remistar"}`} tone="neutral" />
      </div>

      <SectionCard title="Datos generales">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Teléfono" value={driver.phone} />
          <Field label="Vehículo habitual" value={vehicleLabel(driver.usualVehicleId)} />
          <Field label="Puntualidad" value={`${driver.punctuality}%`} />
          <Field label="Calificación" value={`${driver.rating.toFixed(1)} / 5`} />
          <Field label="Horas esta semana" value={`${driver.hoursThisWeek} h`} />
          <Field label="Ingreso" value={formatDate(driver.joinedAt)} />
          <Field label="Esquema de pago" value={driver.paymentScheme === "comision" ? "Comisión" : driver.paymentScheme === "jornal" ? "Jornal" : "Tarifa fija"} />
        </dl>
      </SectionCard>

      <SectionCard title="Próximo servicio">
        {upcoming ? (
          <div className="text-sm">
            <p className="font-medium text-slate-800">{formatDate(upcoming.date)} · {upcoming.time}</p>
            <p className="text-slate-600">{upcoming.origin} → {upcoming.destination}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No tiene servicios próximos asignados.</p>
        )}
      </SectionCard>

      <SectionCard title="Documentación">
        <ul className="space-y-2.5">
          {docs.map((d) => {
            const days = daysFromToday(d.date);
            return (
              <li key={d.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{d.label}</span>
                <StatusBadge label={docLabel(days)} tone={docTone(days)} />
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <SectionCard title="Liquidaciones y gastos pendientes">
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-600">Saldo pendiente de liquidación</span>
          <span className="font-semibold text-slate-800">{formatCurrency(driver.pendingSettlementAmount)}</span>
        </div>
        {driverSettlements.length > 0 && (
          <ul className="mt-3 space-y-2">
            {driverSettlements.map((s) => {
              const meta = settlementStatusMeta(s.status);
              return (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{s.periodLabel}</span>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              );
            })}
          </ul>
        )}
        {driverExpenses.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="mb-2 text-xs font-medium text-slate-500">Gastos rendidos</p>
            <ul className="space-y-2">
              {driverExpenses.map((e) => {
                const meta = expenseStatusMeta(e.status);
                return (
                  <li key={e.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{formatCurrency(e.amount)} — {expenseCategoryLabels[e.category]}</span>
                    <StatusBadge label={meta.label} tone={meta.tone} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Servicios recientes">
        {recentServices.length === 0 ? (
          <p className="text-sm text-slate-500">Sin servicios registrados todavía.</p>
        ) : (
          <ul className="space-y-2">
            {recentServices.map((s) => {
              const meta = serviceStatusMeta(s.status);
              return (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{formatDate(s.date)} · {s.origin} → {s.destination}</span>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      {driverAlerts.length > 0 && (
        <SectionCard title="Alertas relacionadas">
          <ul className="space-y-1.5 text-sm text-slate-600">
            {driverAlerts.map((a) => <li key={a.id}>{a.title}</li>)}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}
