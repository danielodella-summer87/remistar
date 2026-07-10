"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, FilterChip } from "@/components/shared/FilterBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { ServiceDetailContent } from "@/components/domain/ServiceDetailContent";
import { NewServiceButton } from "@/components/domain/NewServiceButton";
import { services, drivers } from "@/lib/mock";
import { clientLabel, driverLabel, vehicleLabel } from "@/lib/selectors";
import { serviceStatusMeta, riskMeta } from "@/lib/status";
import { formatDateLong, formatDate } from "@/lib/format";
import type { Service } from "@/lib/types";

function isoOffset(base: Date, offset: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function conflictingIds(dayServices: Service[]): Set<string> {
  const byDriver = new Map<string, Service[]>();
  for (const s of dayServices) {
    if (!s.driverId || s.status === "cancelado") continue;
    const list = byDriver.get(s.driverId) ?? [];
    list.push(s);
    byDriver.set(s.driverId, list);
  }
  const ids = new Set<string>();
  for (const list of byDriver.values()) {
    if (list.length > 1) list.forEach((s) => ids.add(s.id));
  }
  return ids;
}

export default function AgendaPage() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState<"dia" | "semana">("dia");
  const [dayOffset, setDayOffset] = useState(0);
  const [driverFilter, setDriverFilter] = useState<string>("todos");
  const [selected, setSelected] = useState<Service | null>(null);

  const currentDate = isoOffset(today, dayOffset);

  const dayServices = useMemo(() => {
    return services
      .filter((s) => s.date === currentDate)
      .filter((s) => (driverFilter === "todos" ? true : s.driverId === driverFilter))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [currentDate, driverFilter]);

  const conflicts = useMemo(() => conflictingIds(dayServices), [dayServices]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => isoOffset(today, i)), [today]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Servicios organizados por horario, con detección de conflictos entre chofer y agenda."
        primaryAction={<NewServiceButton />}
      />

      <FilterBar>
        <div className="flex gap-2">
          <FilterChip label="Vista diaria" active={view === "dia"} onClick={() => setView("dia")} />
          <FilterChip label="Vista semanal" active={view === "semana"} onClick={() => setView("semana")} />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="Todos los choferes" active={driverFilter === "todos"} onClick={() => setDriverFilter("todos")} />
          {drivers.map((d) => (
            <FilterChip key={d.id} label={d.name} active={driverFilter === d.id} onClick={() => setDriverFilter(d.id)} />
          ))}
        </div>
      </FilterBar>

      {view === "dia" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={() => setDayOffset((o) => o - 1)}
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Día anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-medium capitalize text-slate-800">
              {formatDateLong(currentDate)} {dayOffset === 0 && <span className="text-petrol-600">(hoy)</span>}
            </p>
            <button
              type="button"
              onClick={() => setDayOffset((o) => o + 1)}
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Día siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {dayServices.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Sin servicios agendados" description="No hay servicios cargados para este día con los filtros actuales." />
          ) : (
            <ol className="space-y-2">
              {dayServices.map((s) => {
                const statusMeta = serviceStatusMeta(s.status);
                const risk = riskMeta(s.risk);
                const hasConflict = conflicts.has(s.id);
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(s)}
                      className={`flex w-full flex-col gap-2 rounded-lg border bg-white p-4 text-left transition-colors hover:border-petrol-300 sm:flex-row sm:items-center sm:justify-between ${
                        hasConflict ? "border-red-300" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-14 shrink-0 text-sm font-semibold text-slate-900">{s.time}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {clientLabel(s.clientId)} — {s.origin} → {s.destination}
                          </p>
                          <p className="text-xs text-slate-500">
                            {driverLabel(s.driverId)} · {vehicleLabel(s.vehicleId)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {hasConflict && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
                            <AlertTriangle className="h-3 w-3" /> Posible superposición
                          </span>
                        )}
                        <StatusBadge label={risk.label} tone={risk.tone} />
                        <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {weekDays.map((date) => {
            const dayList = services
              .filter((s) => s.date === date)
              .filter((s) => (driverFilter === "todos" ? true : s.driverId === driverFilter))
              .sort((a, b) => a.time.localeCompare(b.time));
            return (
              <div key={date} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold capitalize text-slate-600">{formatDate(date)}</p>
                {dayList.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-400">Sin servicios</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {dayList.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => setSelected(s)}
                          className="w-full rounded-md bg-slate-50 px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-petrol-50"
                        >
                          <span className="font-semibold">{s.time}</span> — {clientLabel(s.clientId)}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      <DetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Servicio ${selected.code}` : ""}
        subtitle={selected ? `${selected.origin} → ${selected.destination}` : undefined}
      >
        {selected && <ServiceDetailContent service={selected} />}
      </DetailDrawer>
    </div>
  );
}
