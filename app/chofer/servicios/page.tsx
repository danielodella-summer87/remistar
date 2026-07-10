"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Service } from "@/lib/types";
import type { DriverServiceStatus } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { riskMeta } from "@/lib/status";
import { getPassenger, vehicleLabel } from "@/lib/selectors";
import { formatDate } from "@/lib/format";
import { useDriverDemoState, DEMO_DRIVER_ID } from "@/lib/driver-store";
import { listDriverServices, getDriverServiceStatus } from "@/lib/driver-selectors";
import { ctaLabelForDriverStatus, driverServiceStatusMeta } from "@/lib/driver-status";
import { daysFromToday } from "@/lib/format";

type DateTab = "hoy" | "proximos" | "finalizados";
type StatusFilter = "todos" | "pendientes" | "en_curso" | "finalizados";

const DATE_TABS: { value: DateTab; label: string }[] = [
  { value: "hoy", label: "Hoy" },
  { value: "proximos", label: "Próximos" },
  { value: "finalizados", label: "Finalizados" },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendientes", label: "Pendientes" },
  { value: "en_curso", label: "En curso" },
  { value: "finalizados", label: "Finalizados" },
];

const PENDING_STATUSES: DriverServiceStatus[] = ["pendiente_aceptacion", "asignado"];
const IN_PROGRESS_STATUSES: DriverServiceStatus[] = [
  "aceptado",
  "en_camino",
  "en_origen",
  "pasajero_a_bordo",
  "en_viaje",
];
const DONE_STATUSES: DriverServiceStatus[] = ["finalizado", "pendiente_rendicion", "cerrado", "rechazado"];

export default function ChoferServiciosPage() {
  const state = useDriverDemoState();
  const [tab, setTab] = useState<DateTab>("hoy");
  const [filter, setFilter] = useState<StatusFilter>("todos");

  const services = useMemo(() => listDriverServices(DEMO_DRIVER_ID), []);

  const byTab = useMemo(() => {
    return services.filter((s) => {
      const diff = daysFromToday(s.date);
      if (tab === "hoy") return diff === 0;
      if (tab === "proximos") return diff > 0;
      return diff < 0;
    });
  }, [services, tab]);

  const filtered = useMemo(() => {
    const list = byTab.filter((s) => {
      if (filter === "todos") return true;
      const status = getDriverServiceStatus(s, state);
      if (filter === "pendientes") return PENDING_STATUSES.includes(status);
      if (filter === "en_curso") return IN_PROGRESS_STATUSES.includes(status);
      return DONE_STATUSES.includes(status);
    });
    return [...list].sort((a, b) =>
      tab === "finalizados"
        ? (b.date + b.time).localeCompare(a.date + a.time)
        : (a.date + a.time).localeCompare(b.date + b.time)
    );
  }, [byTab, filter, state, tab]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="mb-3 text-lg font-bold text-slate-900">Mis servicios</h1>
        <div className="flex gap-2 overflow-x-auto">
          {DATE_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                tab === t.value ? "bg-petrol-700 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === f.value ? "bg-petrol-100 text-petrol-800" : "bg-slate-100 text-slate-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="text-sm font-medium text-slate-600">No hay servicios en esta vista.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((service) => (
            <ServiceListCard key={service.id} service={service} state={state} />
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceListCard({ service, state }: { service: Service; state: ReturnType<typeof useDriverDemoState> }) {
  const status = getDriverServiceStatus(service, state);
  const meta = driverServiceStatusMeta(status);
  const risk = riskMeta(service.risk);
  const passenger = getPassenger(service.passengerId);
  const cta = ctaLabelForDriverStatus(status);

  return (
    <Link
      href={`/chofer/servicios/${service.id}`}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm active:bg-slate-50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">
            {formatDate(service.date)} · {service.time}
          </p>
          <StatusBadge label={risk.label} tone={risk.tone} />
        </div>
        <p className="mt-1 truncate text-sm text-slate-600">
          {service.origin} → {service.destination}
        </p>
        <p className="mt-0.5 truncate text-xs text-slate-400">
          {passenger?.name ?? "Pasajero a confirmar"} · {vehicleLabel(service.vehicleId)}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <StatusBadge label={meta.label} tone={meta.tone} />
          {cta && <span className="text-xs font-medium text-petrol-700">{cta}</span>}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
    </Link>
  );
}
