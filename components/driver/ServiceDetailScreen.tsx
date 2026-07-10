"use client";

import { Phone, Users, Briefcase, CreditCard, ClipboardList, MapPinned, History } from "lucide-react";
import type { Service } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getPassenger, getVehicle, clientLabel } from "@/lib/selectors";
import { formatDate } from "@/lib/format";
import { useDriverDemoState, DEMO_DRIVER_ID } from "@/lib/driver-store";
import { getDriverServiceHistory, getDriverExpenses } from "@/lib/driver-selectors";
import { driverServiceStatusMeta } from "@/lib/driver-status";
import { telLink } from "@/lib/driver-links";
import { CurrentServiceCard } from "./CurrentServiceCard";
import { MobileSection } from "./MobileSection";
import { ExpenseCard } from "./ExpenseCard";

const OPERATIONS_CONTACT = { name: "Central operativa Remistar", phone: "+598 2600 0000" };

export function ServiceDetailScreen({ service }: { service: Service }) {
  const state = useDriverDemoState();
  const passenger = getPassenger(service.passengerId);
  const vehicle = getVehicle(service.vehicleId);
  const history = getDriverServiceHistory(service, state);
  const expenses = getDriverExpenses(DEMO_DRIVER_ID, state).filter((e) => e.serviceId === service.id);

  return (
    <div className="space-y-4">
      <CurrentServiceCard service={service} />

      <MobileSection title="Detalles del servicio">
        <dl className="space-y-3 text-sm">
          <Row label="Fecha" value={formatDate(service.date)} />
          <Row label="Cliente" value={clientLabel(service.clientId)} />
          <Row label="Teléfono del pasajero" value={passenger?.phone ?? "No informado"} />
          {service.stops && service.stops.length > 0 && (
            <div className="flex items-start gap-2.5">
              <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <dt className="text-xs text-slate-400">Escalas</dt>
                <dd className="font-medium text-slate-800">{service.stops.join(" · ")}</dd>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2.5">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">Pasajeros</dt>
              <dd className="font-medium text-slate-800">{service.passengerCount ?? "No informado"}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">Equipaje</dt>
              <dd className="font-medium text-slate-800">{service.luggageNotes ?? "No informado"}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
              <dt className="text-xs text-slate-400">Forma de pago del cliente</dt>
              <dd className="font-medium text-slate-800">{service.paymentMethod ?? "No informado"}</dd>
            </div>
          </div>
          <Row label="Matrícula del vehículo" value={vehicle?.plate ?? "No asignado"} />
          {service.specialInstructions && (
            <div className="flex items-start gap-2.5">
              <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <dt className="text-xs text-slate-400">Indicaciones</dt>
                <dd className="font-medium text-slate-800">{service.specialInstructions}</dd>
              </div>
            </div>
          )}
        </dl>
      </MobileSection>

      {expenses.length > 0 && (
        <MobileSection title="Gastos asociados a este servicio">
          <div className="space-y-2">
            {expenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        </MobileSection>
      )}

      <MobileSection
        title="Historial de estados"
        action={<History className="h-4 w-4 text-slate-300" />}
      >
        <ol className="space-y-3">
          {history.map((entry, idx) => {
            const meta = driverServiceStatusMeta(entry.status);
            return (
              <li key={`${entry.status}-${idx}`} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-petrol-600" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={meta.label} tone={meta.tone} />
                    <span className="text-xs text-slate-400">{entry.at}</span>
                  </div>
                  {entry.note && <p className="mt-0.5 text-sm text-slate-600">{entry.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </MobileSection>

      <MobileSection title="Contacto operativo">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-900">{OPERATIONS_CONTACT.name}</p>
            <p className="text-xs text-slate-500">Para consultas urgentes sobre este servicio</p>
          </div>
          <a
            href={telLink(OPERATIONS_CONTACT.phone)}
            className="flex items-center gap-1.5 rounded-lg bg-petrol-700 px-3.5 py-2 text-sm font-medium text-white active:bg-petrol-800"
          >
            <Phone className="h-4 w-4" /> Llamar
          </a>
        </div>
      </MobileSection>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}
