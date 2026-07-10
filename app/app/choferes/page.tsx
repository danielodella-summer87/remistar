"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IdCard, Star, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, SearchInput, FilterChip } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { DriverDetailContent } from "@/components/domain/DriverDetailContent";
import { drivers } from "@/lib/mock";
import { vehicleLabel } from "@/lib/selectors";
import { driverStatusMeta } from "@/lib/status";
import { formatCurrency } from "@/lib/format";
import type { Driver, DriverStatus } from "@/lib/types";

const statusFilters: { label: string; value: DriverStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Disponible", value: "disponible" },
  { label: "En servicio", value: "en_servicio" },
  { label: "En descanso", value: "descanso" },
  { label: "Inactivo", value: "inactivo" },
];

export default function ChoferesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DriverStatus | "todos">("todos");
  const [selected, setSelected] = useState<Driver | null>(null);

  const filtered = useMemo(() => {
    return drivers
      .filter((d) => (status === "todos" ? true : d.status === status))
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, status]);

  return (
    <div className="space-y-6">
      <PageHeader title="Choferes" description="Disponibilidad, desempeño y situación administrativa de cada chofer." />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar chofer…" />
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={status === f.value}
              onClick={() => setStatus(f.value)}
              count={f.value === "todos" ? drivers.length : drivers.filter((d) => d.status === f.value).length}
            />
          ))}
        </div>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={IdCard} title="No se encontraron choferes" description="Probá con otro término de búsqueda o cambiá el filtro de estado." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => {
            const meta = driverStatusMeta(d.status);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelected(d)}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{d.name}</p>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Star className="h-3.5 w-3.5 text-amber-400" /> {d.rating.toFixed(1)} · Puntualidad {d.punctuality}%
                </p>
                <p className="mt-1 text-xs text-slate-500">{vehicleLabel(d.usualVehicleId)}</p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-500">{d.pendingExpensesCount} gasto(s) pendiente(s)</span>
                  <span className="font-medium text-slate-700">{formatCurrency(d.pendingSettlementAmount)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <DetailDrawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} subtitle="Ficha de chofer">
        {selected && (
          <div className="space-y-4">
            <DriverDetailContent driver={selected} />
            <div className="border-t border-slate-100 pt-4">
              <Link
                href="/chofer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Smartphone className="h-4 w-4" /> Ver portal del chofer (demo)
              </Link>
              <p className="mt-1.5 text-center text-xs text-slate-400">
                Abre el prototipo móvil del chofer con datos de demostración, no específicos de {selected.name}.
              </p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
