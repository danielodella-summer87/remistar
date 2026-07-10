"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, SearchInput, FilterChip } from "@/components/shared/FilterBar";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { NewServiceButton } from "@/components/domain/NewServiceButton";
import { ServiceDetailContent } from "@/components/domain/ServiceDetailContent";
import { services } from "@/lib/mock";
import { clientLabel, driverLabel, vehicleLabel } from "@/lib/selectors";
import { serviceStatusMeta, riskMeta, serviceTypeLabels } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Service, ServiceStatus } from "@/lib/types";
import { Route } from "lucide-react";

const statusFilters: { label: string; value: ServiceStatus | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Pendiente", value: "pendiente" },
  { label: "Confirmado", value: "confirmado" },
  { label: "Asignado", value: "asignado" },
  { label: "En curso", value: "en_curso" },
  { label: "Finalizado", value: "finalizado" },
  { label: "Cancelado", value: "cancelado" },
];

export default function ServiciosPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ServiceStatus | "todos">("todos");
  const [onlyAtRisk, setOnlyAtRisk] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);

  const filtered = useMemo(() => {
    return services
      .filter((s) => (status === "todos" ? true : s.status === status))
      .filter((s) => (onlyAtRisk ? s.risk === "alto" : true))
      .filter((s) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          s.code.toLowerCase().includes(q) ||
          clientLabel(s.clientId).toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }, [search, status, onlyAtRisk]);

  const columns: DataTableColumn<Service>[] = [
    { header: "Código", accessor: (s) => <span className="font-medium text-slate-900">{s.code}</span> },
    { header: "Tipo", accessor: (s) => serviceTypeLabels[s.type] },
    { header: "Cliente", accessor: (s) => clientLabel(s.clientId) },
    { header: "Origen → Destino", accessor: (s) => <span className="text-slate-600">{s.origin} → {s.destination}</span> },
    { header: "Fecha", accessor: (s) => formatDate(s.date) },
    { header: "Hora", accessor: (s) => s.time },
    { header: "Chofer", accessor: (s) => driverLabel(s.driverId) },
    { header: "Vehículo", accessor: (s) => vehicleLabel(s.vehicleId) },
    { header: "Importe", accessor: (s) => formatCurrency(s.amount) },
    {
      header: "Estado",
      accessor: (s) => {
        const meta = serviceStatusMeta(s.status);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
    {
      header: "Riesgo",
      accessor: (s) => {
        const meta = riskMeta(s.risk);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servicios"
        description="Todos los traslados registrados: pasados, en curso y por confirmar."
        primaryAction={<NewServiceButton />}
      />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por código, cliente, origen o destino…" />
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={status === f.value}
              onClick={() => setStatus(f.value)}
              count={f.value === "todos" ? services.length : services.filter((s) => s.status === f.value).length}
            />
          ))}
        </div>
        <FilterChip
          label="Solo riesgo alto"
          active={onlyAtRisk}
          onClick={() => setOnlyAtRisk((v) => !v)}
          count={services.filter((s) => s.risk === "alto").length}
        />
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Route}
          title="No hay servicios que coincidan con los filtros"
          description="Probá ajustar la búsqueda o limpiar los filtros de estado y riesgo."
        />
      ) : (
        <DataTable columns={columns} rows={filtered} keyFor={(s) => s.id} onRowClick={setSelected} />
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
