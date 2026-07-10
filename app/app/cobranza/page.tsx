"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClientDetailContent } from "@/components/domain/ClientDetailContent";
import { collections, invoices } from "@/lib/mock";
import { clientsWithDebt, clientLabel, overdueInvoices, invoiceBalanceDue } from "@/lib/selectors";
import { collectionTypeMeta } from "@/lib/status";
import { formatCurrency, formatDate, daysFromToday } from "@/lib/format";
import type { Client, Collection } from "@/lib/types";

export default function CobranzaPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const debtors = clientsWithDebt();
  const overdue = overdueInvoices();
  const promises = collections.filter((c) => c.type === "promesa_pago");
  const totalDebt = debtors.reduce((sum, c) => sum + Math.abs(c.balance), 0);

  const columns: DataTableColumn<Collection>[] = [
    { header: "Fecha", accessor: (c) => formatDate(c.date) },
    { header: "Cliente", accessor: (c) => clientLabel(c.clientId) },
    { header: "Factura", accessor: (c) => invoices.find((i) => i.id === c.invoiceId)?.number ?? "—" },
    { header: "Medio", accessor: (c) => c.method },
    { header: "Importe", accessor: (c) => formatCurrency(c.amount) },
    {
      header: "Tipo",
      accessor: (c) => {
        const meta = collectionTypeMeta(c.type);
        return <StatusBadge label={meta.label} tone={meta.tone} />;
      },
    },
    { header: "Notas", accessor: (c) => <span className="text-slate-500">{c.notes ?? "—"}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Cobranza" description="Cuentas corrientes, promesas de pago y facturas abiertas por cliente." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Deuda total (demo)" value={formatCurrency(totalDebt)} tone="danger" />
        <MetricCard label="Clientes con deuda" value={debtors.length} tone="warning" />
        <MetricCard label="Facturas vencidas" value={overdue.length} tone={overdue.length > 0 ? "danger" : "success"} />
        <MetricCard label="Promesas de pago activas" value={promises.length} tone="info" />
      </div>

      <SectionCard title="Clientes con deuda" description="Ordenados de mayor a menor saldo pendiente. Tocá un cliente para ver el detalle.">
        {debtors.length === 0 ? (
          <EmptyState icon={Wallet} title="No hay clientes con deuda registrada" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {debtors.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedClient(c)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.paymentTerms ?? "Sin condiciones especiales"}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{formatCurrency(c.balance)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Facturas vencidas — acción sugerida">
        {overdue.length === 0 ? (
          <p className="text-sm text-slate-500">No hay facturas vencidas en este momento.</p>
        ) : (
          <ul className="space-y-3">
            {overdue.map((inv) => {
              const daysLate = Math.abs(daysFromToday(inv.dueDate));
              const promise = collections.find((c) => c.invoiceId === inv.id && c.type === "promesa_pago");
              return (
                <li key={inv.id} className="rounded-lg border border-red-100 bg-red-50/50 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{inv.number} — {clientLabel(inv.clientId)}</span>
                    <span className="font-semibold text-red-600">{formatCurrency(invoiceBalanceDue(inv))}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Vencida hace {daysLate} día(s).{" "}
                    {promise
                      ? "Ya existe una promesa de pago registrada; hacer seguimiento de la fecha comprometida."
                      : "Sin promesa de pago registrada — se sugiere contactar al cliente."}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Movimientos de cobranza">
        <DataTable columns={columns} rows={collections} keyFor={(c) => c.id} emptyMessage="Sin movimientos de cobranza registrados." />
      </SectionCard>

      <DetailDrawer open={!!selectedClient} onClose={() => setSelectedClient(null)} title={selectedClient?.name ?? ""} subtitle="Cuenta corriente">
        {selectedClient && <ClientDetailContent client={selectedClient} />}
      </DetailDrawer>
    </div>
  );
}
