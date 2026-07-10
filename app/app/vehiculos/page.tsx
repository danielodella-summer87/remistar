"use client";

import { useMemo, useState } from "react";
import { Car } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, SearchInput, FilterChip } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { VehicleDetailContent } from "@/components/domain/VehicleDetailContent";
import { vehicles } from "@/lib/mock";
import { driverLabel } from "@/lib/selectors";
import { vehicleStatusMeta } from "@/lib/status";
import type { Vehicle, VehicleStatus } from "@/lib/types";

const statusFilters: { label: string; value: VehicleStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Disponible", value: "disponible" },
  { label: "En servicio", value: "en_servicio" },
  { label: "Reservado", value: "reservado" },
  { label: "Mantenimiento", value: "mantenimiento" },
  { label: "Fuera de servicio", value: "fuera_de_servicio" },
];

export default function VehiculosPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<VehicleStatus | "todos">("todos");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    return vehicles
      .filter((v) => (status === "todos" ? true : v.status === status))
      .filter((v) => `${v.brand} ${v.model} ${v.plate}`.toLowerCase().includes(search.toLowerCase()));
  }, [search, status]);

  return (
    <div className="space-y-6">
      <PageHeader title="Vehículos" description="Estado, documentación y mantenimiento de cada unidad de la flota." />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por marca, modelo o matrícula…" />
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={status === f.value}
              onClick={() => setStatus(f.value)}
              count={f.value === "todos" ? vehicles.length : vehicles.filter((v) => v.status === f.value).length}
            />
          ))}
        </div>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Car} title="No se encontraron vehículos" description="Probá con otro término de búsqueda o cambiá el filtro de estado." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => {
            const meta = vehicleStatusMeta(v.status);
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelected(v)}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{v.brand} {v.model}</p>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{v.plate} · {v.capacity} pasajeros</p>
                <p className="mt-1 text-xs text-slate-500">Conductor habitual: {driverLabel(v.usualDriverId)}</p>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  {v.mileage.toLocaleString("es-UY")} km
                </p>
              </button>
            );
          })}
        </div>
      )}

      <DetailDrawer open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.brand} ${selected.model}` : ""} subtitle={selected?.plate}>
        {selected && <VehicleDetailContent vehicle={selected} />}
      </DetailDrawer>
    </div>
  );
}
