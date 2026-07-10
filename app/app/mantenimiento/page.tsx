"use client";

import { useMemo, useState } from "react";
import { Wrench } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, FilterChip } from "@/components/shared/FilterBar";
import { MetricCard } from "@/components/shared/MetricCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { VehicleDetailContent } from "@/components/domain/VehicleDetailContent";
import { maintenanceRecords, vehicles } from "@/lib/mock";
import { maintenanceStatusMeta } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/format";
import type { MaintenanceRecord, MaintenanceStatus, Vehicle } from "@/lib/types";

const statusFilters: { label: string; value: MaintenanceStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Programado", value: "programado" },
  { label: "En taller", value: "en_taller" },
  { label: "Atrasado", value: "atrasado" },
  { label: "Completado", value: "completado" },
];

export default function MantenimientoPage() {
  const [status, setStatus] = useState<MaintenanceStatus | "todos">("todos");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    return maintenanceRecords
      .filter((m) => (status === "todos" ? true : m.status === status))
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
  }, [status]);

  const inWorkshop = maintenanceRecords.filter((m) => m.status === "en_taller");
  const delayed = maintenanceRecords.filter((m) => m.status === "atrasado");
  const upcoming = maintenanceRecords.filter((m) => m.status === "programado");
  const totalCost = maintenanceRecords.reduce((sum, m) => sum + (m.cost ?? 0), 0);

  function vehicleFor(m: MaintenanceRecord) {
    return vehicles.find((v) => v.id === m.vehicleId);
  }

  const columns: DataTableColumn<MaintenanceRecord>[] = [
    { header: "Vehículo", accessor: (m) => { const v = vehicleFor(m); return v ? `${v.brand} ${v.model} (${v.plate})` : "—"; } },
    { header: "Tipo", accessor: (m) => (m.type === "preventivo" ? "Preventivo" : m.type === "correctivo" ? "Correctivo" : "Service") },
    { header: "Descripción", accessor: (m) => <span className="text-slate-600">{m.description}</span> },
    { header: "Taller", accessor: (m) => m.workshop },
    { header: "Fecha programada", accessor: (m) => formatDate(m.scheduledDate) },
    { header: "Costo", accessor: (m) => (m.cost ? formatCurrency(m.cost) : "—") },
    { header: "Garantía", accessor: (m) => (m.warrantyUntil ? `Hasta ${formatDate(m.warrantyUntil)}` : "—") },
    {
      header: "Estado",
      accessor: (m) => {
        const meta = maintenanceStatusMeta(m.status);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Mantenimiento" description="Services, reparaciones, garantías y vencimientos de la flota." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="En taller" value={inWorkshop.length} tone="warning" />
        <MetricCard label="Atrasados" value={delayed.length} tone={delayed.length > 0 ? "danger" : "success"} />
        <MetricCard label="Programados" value={upcoming.length} tone="info" />
        <MetricCard label="Costo acumulado (demo)" value={formatCurrency(totalCost)} tone="neutral" />
      </div>

      <SectionCard title="Tablero de estado">
        <FilterBar>
          {statusFilters.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={status === f.value}
              onClick={() => setStatus(f.value)}
              count={f.value === "todos" ? maintenanceRecords.length : maintenanceRecords.filter((m) => m.status === f.value).length}
            />
          ))}
        </FilterBar>
        <div className="mt-4">
          <DataTable
            columns={columns}
            rows={filtered}
            keyFor={(m) => m.id}
            onRowClick={(m) => {
              const v = vehicleFor(m);
              if (v) setSelectedVehicle(v);
            }}
            emptyMessage="No hay registros de mantenimiento con este filtro."
          />
        </div>
      </SectionCard>

      <SectionCard title="Alertas de mantenimiento demo" description="Ejemplos del tipo de alerta que generaría el motor de mantenimiento preventivo.">
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-amber-600" /> Service próximo a alcanzar kilometraje o fecha límite.</li>
          <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-opgreen-600" /> Reparación todavía cubierta por garantía vigente.</li>
          <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-red-600" /> Seguro o patente próximos a vencer.</li>
          <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-red-600" /> Vehículo fuera de servicio por reparación.</li>
          <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-amber-600" /> Reparación atrasada respecto de la fecha programada.</li>
        </ul>
      </SectionCard>

      <DetailDrawer
        open={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title={selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : ""}
        subtitle={selectedVehicle?.plate}
      >
        {selectedVehicle && <VehicleDetailContent vehicle={selectedVehicle} />}
      </DetailDrawer>
    </div>
  );
}
