"use client";

import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, SearchInput, FilterChip } from "@/components/shared/FilterBar";
import { MetricCard } from "@/components/shared/MetricCard";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ExpenseDetailContent } from "@/components/domain/ExpenseDetailContent";
import { expenseReports } from "@/lib/mock";
import { driverLabel, vehicleLabel } from "@/lib/selectors";
import { expenseStatusMeta, expenseCategoryLabels } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ExpenseReport } from "@/lib/types";

type QuickFilter =
  | "todos"
  | "pendiente"
  | "aprobado"
  | "observado"
  | "rechazado"
  | "sin_comprobante"
  | "duplicado"
  | "refacturable";

const filters: { label: string; value: QuickFilter }[] = [
  { label: "Todos", value: "todos" },
  { label: "Pendiente", value: "pendiente" },
  { label: "Aprobado", value: "aprobado" },
  { label: "Observado", value: "observado" },
  { label: "Rechazado", value: "rechazado" },
  { label: "Sin comprobante", value: "sin_comprobante" },
  { label: "Posible duplicado", value: "duplicado" },
  { label: "Refacturable", value: "refacturable" },
];

function matchesFilter(e: ExpenseReport, filter: QuickFilter): boolean {
  switch (filter) {
    case "todos":
      return true;
    case "pendiente":
      return e.status === "pendiente_comprobante" || e.status === "pendiente_revision";
    case "aprobado":
      return ["aprobado", "aprobado_parcial", "incluido_liquidacion", "reintegrado"].includes(e.status);
    case "observado":
      return e.status === "observado";
    case "rechazado":
      return e.status === "rechazado";
    case "sin_comprobante":
      return !e.hasReceipt;
    case "duplicado":
      return !!e.possibleDuplicate;
    case "refacturable":
      return e.refacturable;
  }
}

export default function GastosPage() {
  const [expenses, setExpenses] = useState<ExpenseReport[]>(expenseReports);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<QuickFilter>("todos");
  const [selected, setSelected] = useState<ExpenseReport | null>(null);

  function handleUpdate(id: string, changes: Partial<ExpenseReport>) {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...changes } : e)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...changes } : prev));
  }

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => matchesFilter(e, filter))
      .filter((e) => driverLabel(e.driverId).toLowerCase().includes(search.toLowerCase()));
  }, [expenses, filter, search]);

  const pendingCount = expenses.filter((e) => matchesFilter(e, "pendiente")).length;
  const noReceiptCount = expenses.filter((e) => !e.hasReceipt).length;
  const totalApproved = expenses
    .filter((e) => matchesFilter(e, "aprobado"))
    .reduce((sum, e) => sum + (e.approvedAmount ?? e.amount), 0);

  const columns: DataTableColumn<ExpenseReport>[] = [
    { header: "Chofer", accessor: (e) => <span className="font-medium text-slate-900">{driverLabel(e.driverId)}</span> },
    { header: "Categoría", accessor: (e) => expenseCategoryLabels[e.category] },
    { header: "Vehículo", accessor: (e) => vehicleLabel(e.vehicleId) },
    { header: "Fecha", accessor: (e) => formatDate(e.date) },
    { header: "Importe", accessor: (e) => formatCurrency(e.amount) },
    { header: "Comprobante", accessor: (e) => (e.hasReceipt ? <StatusBadge label="Sí" tone="success" /> : <StatusBadge label="No" tone="warning" />) },
    { header: "Refacturable", accessor: (e) => (e.refacturable ? <StatusBadge label="Sí" tone="brand" /> : <span className="text-slate-400">—</span>) },
    {
      header: "Estado",
      accessor: (e) => {
        const meta = expenseStatusMeta(e.status);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rendición de gastos"
        description="Gastos que los choferes pagan de su bolsillo, presentados para revisión, aprobación y reintegro."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricCard label="Pendientes de revisión" value={pendingCount} tone="warning" />
        <MetricCard label="Sin comprobante" value={noReceiptCount} tone="danger" />
        <MetricCard label="Total aprobado (demo)" value={formatCurrency(totalApproved)} tone="success" />
      </div>

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por chofer…" />
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={filter === f.value}
              onClick={() => setFilter(f.value)}
              count={expenses.filter((e) => matchesFilter(e, f.value)).length}
            />
          ))}
        </div>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="No hay gastos con este filtro" description="Probá con otro filtro o limpiá la búsqueda." />
      ) : (
        <DataTable columns={columns} rows={filtered} keyFor={(e) => e.id} onRowClick={setSelected} />
      )}

      <DetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Gasto — ${driverLabel(selected.driverId)}` : ""}
        subtitle={selected ? expenseCategoryLabels[selected.category] : undefined}
      >
        {selected && <ExpenseDetailContent expense={selected} onUpdate={handleUpdate} />}
      </DetailDrawer>
    </div>
  );
}
