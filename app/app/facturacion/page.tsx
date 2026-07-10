"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar, FilterChip } from "@/components/shared/FilterBar";
import { MetricCard } from "@/components/shared/MetricCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { InvoiceDetailContent } from "@/components/domain/InvoiceDetailContent";
import { invoices } from "@/lib/mock";
import { clientLabel, servicesPendingInvoice, refacturableExpensesPending, invoiceBalanceDue, overdueInvoices } from "@/lib/selectors";
import { invoiceStatusMeta, serviceTypeLabels } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Invoice, InvoiceStatus } from "@/lib/types";

const statusFilters: { label: string; value: InvoiceStatus | "todos" }[] = [
  { label: "Todas", value: "todos" },
  { label: "Pendiente de emitir", value: "pendiente" },
  { label: "Emitida", value: "emitida" },
  { label: "Vencida", value: "vencida" },
  { label: "Pagada parcial", value: "pagada_parcial" },
  { label: "Pagada", value: "pagada" },
];

export default function FacturacionPage() {
  const [status, setStatus] = useState<InvoiceStatus | "todos">("todos");
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = useMemo(
    () => invoices.filter((i) => (status === "todos" ? true : i.status === status)),
    [status]
  );

  const pendingServices = servicesPendingInvoice();
  const refacturable = refacturableExpensesPending();
  const overdue = overdueInvoices();

  const columns: DataTableColumn<Invoice>[] = [
    { header: "Número", accessor: (i) => <span className="font-medium text-slate-900">{i.number}</span> },
    { header: "Cliente", accessor: (i) => clientLabel(i.clientId) },
    { header: "Emisión", accessor: (i) => formatDate(i.issueDate) },
    { header: "Vencimiento", accessor: (i) => formatDate(i.dueDate) },
    { header: "Importe", accessor: (i) => formatCurrency(i.amount) },
    { header: "Saldo", accessor: (i) => formatCurrency(invoiceBalanceDue(i)) },
    {
      header: "Gastos refacturables",
      accessor: (i) => (i.hasRefacturableExpenses ? <StatusBadge label="Sí" tone="warning" /> : <span className="text-slate-400">—</span>),
    },
    {
      header: "Estado",
      accessor: (i) => {
        const meta = invoiceStatusMeta(i.status);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Facturación" description="Servicios por facturar, facturas emitidas y su estado de cobro." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Servicios sin facturar" value={pendingServices.length} tone="info" />
        <MetricCard label="Facturas vencidas" value={overdue.length} tone={overdue.length > 0 ? "danger" : "success"} />
        <MetricCard label="Gastos refacturables" value={refacturable.length} tone="warning" />
        <MetricCard label="Total facturado (demo)" value={formatCurrency(invoices.reduce((s, i) => s + i.amount, 0))} tone="neutral" />
      </div>

      {pendingServices.length > 0 && (
        <SectionCard title="Servicios finalizados pendientes de facturar">
          <ul className="space-y-2">
            {pendingServices.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{formatDate(s.date)} · {serviceTypeLabels[s.type]} · {clientLabel(s.clientId)} · {s.origin} → {s.destination}</span>
                <span className="font-medium text-slate-700">{formatCurrency(s.amount)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title="Facturas">
        <FilterBar>
          {statusFilters.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={status === f.value}
              onClick={() => setStatus(f.value)}
              count={f.value === "todos" ? invoices.length : invoices.filter((i) => i.status === f.value).length}
            />
          ))}
        </FilterBar>
        <div className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState icon={FileText} title="No hay facturas con este filtro" />
          ) : (
            <DataTable columns={columns} rows={filtered} keyFor={(i) => i.id} onRowClick={setSelected} />
          )}
        </div>
      </SectionCard>

      <DetailDrawer open={!!selected} onClose={() => setSelected(null)} title={selected?.number ?? ""} subtitle={selected ? clientLabel(selected.clientId) : undefined}>
        {selected && <InvoiceDetailContent invoice={selected} />}
      </DetailDrawer>
    </div>
  );
}
