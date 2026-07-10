import type { Vehicle } from "@/lib/types";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate, daysFromToday } from "@/lib/format";
import { vehicleStatusMeta, maintenanceStatusMeta, vehicleCategoryLabels } from "@/lib/status";
import { driverLabel, servicesForVehicle, maintenanceForVehicle } from "@/lib/selectors";
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

export function VehicleDetailContent({ vehicle }: { vehicle: Vehicle }) {
  const status = vehicleStatusMeta(vehicle.status);
  const recentServices = servicesForVehicle(vehicle.id).slice(0, 5);
  const maintenance = maintenanceForVehicle(vehicle.id);
  const vehicleAlerts = alerts.filter((a) => a.relatedEntity?.includes(vehicle.plate));
  const serviceDays = daysFromToday(vehicle.nextServiceDate);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <StatusBadge label={status.label} tone={status.tone} />
        <span className="text-xs text-slate-400">{vehicle.plate}</span>
      </div>

      <SectionCard title="Datos del vehículo">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Marca y modelo" value={`${vehicle.brand} ${vehicle.model} (${vehicle.year})`} />
          <Field label="Categoría" value={vehicleCategoryLabels[vehicle.category]} />
          <Field label="Capacidad" value={`${vehicle.capacity} pasajeros`} />
          <Field label="Kilometraje" value={`${vehicle.mileage.toLocaleString("es-UY")} km`} />
          <Field label="Conductor habitual" value={driverLabel(vehicle.usualDriverId)} />
          <Field label="Costo estimado" value={`${formatCurrency(vehicle.estimatedCostPerKm)} / km`} />
          <Field label="Ubicación (demo)" value={vehicle.demoLocation} />
        </dl>
      </SectionCard>

      <SectionCard title="Mantenimiento">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Próximo service</span>
          <StatusBadge label={docLabel(serviceDays)} tone={docTone(serviceDays)} />
        </div>
        <p className="mt-1 text-xs text-slate-400">Programado para {formatDate(vehicle.nextServiceDate)} (~{vehicle.nextServiceKm.toLocaleString("es-UY")} km)</p>
        {maintenance.length > 0 && (
          <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
            {maintenance.map((m) => {
              const meta = maintenanceStatusMeta(m.status);
              return (
                <li key={m.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{m.description}</span>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Documentación">
        <ul className="space-y-2.5">
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Seguro</span>
            <StatusBadge label={docLabel(daysFromToday(vehicle.insuranceExpiry))} tone={docTone(daysFromToday(vehicle.insuranceExpiry))} />
          </li>
          <li className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Patente / inspección</span>
            <StatusBadge label={docLabel(daysFromToday(vehicle.registrationExpiry))} tone={docTone(daysFromToday(vehicle.registrationExpiry))} />
          </li>
        </ul>
        {(vehicle.status === "mantenimiento" || vehicle.status === "fuera_de_servicio") && (
          <p className="mt-3 text-xs font-medium text-amber-700">
            Este vehículo no debería asignarse a nuevos servicios mientras esté {vehicle.status === "mantenimiento" ? "en mantenimiento" : "fuera de servicio"}.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Servicios recientes">
        {recentServices.length === 0 ? (
          <p className="text-sm text-slate-500">Sin servicios registrados todavía.</p>
        ) : (
          <ul className="space-y-2">
            {recentServices.map((s) => (
              <li key={s.id} className="text-sm text-slate-600">
                {formatDate(s.date)} · {s.origin} → {s.destination}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {vehicleAlerts.length > 0 && (
        <SectionCard title="Alertas relacionadas">
          <ul className="space-y-1.5 text-sm text-slate-600">
            {vehicleAlerts.map((a) => <li key={a.id}>{a.title}</li>)}
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
