"use client";

import { useMemo, useState } from "react";
import { Banknote } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, FilterChip } from "@/components/shared/FilterBar";
import { MetricCard } from "@/components/shared/MetricCard";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { SettlementDetailContent } from "@/components/domain/SettlementDetailContent";
import { settlements } from "@/lib/mock";
import { driverLabel, pendingSettlements } from "@/lib/selectors";
import { settlementStatusMeta } from "@/lib/status";
import { formatCurrency } from "@/lib/format";
import type { DriverSettlement, SettlementStatus } from "@/lib/types";

const statusFilters: { label: string; value: SettlementStatus | "todos" }[] = [
  { label: "Todas", value: "todos" },
  { label: "Pendiente de rendiciones", value: "pendiente_rendiciones" },
  { label: "Pendiente de revisión", value: "pendiente_revision" },
  { label: "Observada", value: "observada" },
  { label: "Aprobada", value: "aprobada" },
  { label: "Lista para pagar", value: "lista_para_pagar" },
  { label: "Pagada", value: "pagada" },
  { label: "Cerrada", value: "cerrada" },
];

export default function LiquidacionesPage() {
  const [status, setStatus] = useState<SettlementStatus | "todos">("todos");
  const [selected, setSelected] = useState<DriverSettlement | null>(null);

  const filtered = useMemo(
    () => settlements.filter((s) => (status === "todos" ? true : s.status === status)),
    [status]
  );

  const pending = pendingSettlements();
  const totalPending = pending.reduce((sum, s) => sum + s.finalBalance, 0);

  const columns: DataTableColumn<DriverSettlement>[] = [
    { header: "Chofer", accessor: (s) => <span className="font-medium text-slate-900">{driverLabel(s.driverId)}</span> },
    { header: "Período", accessor: (s) => s.periodLabel },
    { header: "Servicios", accessor: (s) => s.serviceIds.length },
    { header: "Importe servicios", accessor: (s) => formatCurrency(s.serviceAmount) },
    { header: "Gastos aprobados", accessor: (s) => formatCurrency(s.approvedExpensesAmount) },
    { header: "Adelantos", accessor: (s) => formatCurrency(s.advancesAmount) },
    { header: "Saldo final", accessor: (s) => <span className="font-semibold text-slate-800">{formatCurrency(s.finalBalance)}</span> },
    {
      header: "Estado",
      accessor: (s) => {
        const meta = settlementStatusMeta(s.status);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Liquidaciones de choferes" description="Cálculo, revisión y pago de lo que corresponde a cada chofer por período." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricCard label="Liquidaciones pendientes" value={pending.length} tone="warning" />
        <MetricCard label="Saldo pendiente de pago (demo)" value={formatCurrency(totalPending)} tone="brand" />
        <MetricCard label="Liquidaciones cerradas" value={settlements.filter((s) => s.status === "cerrada").length} tone="success" />
      </div>

      <FilterBar>
        {statusFilters.map((f) => (
          <FilterChip
            key={f.value}
            label={f.label}
            active={status === f.value}
            onClick={() => setStatus(f.value)}
            count={f.value === "todos" ? settlements.length : settlements.filter((s) => s.status === f.value).length}
          />
        ))}
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Banknote} title="No hay liquidaciones con este filtro" />
      ) : (
        <DataTable columns={columns} rows={filtered} keyFor={(s) => s.id} onRowClick={setSelected} />
      )}

      <DetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Liquidación — ${driverLabel(selected.driverId)}` : ""}
        subtitle={selected?.periodLabel}
      >
        {selected && <SettlementDetailContent settlement={selected} />}
      </DetailDrawer>
    </div>
  );
}
