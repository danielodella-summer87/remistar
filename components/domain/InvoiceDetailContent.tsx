import type { Invoice } from "@/lib/types";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { invoiceStatusMeta, collectionTypeMeta, serviceTypeLabels, expenseStatusMeta, expenseCategoryLabels } from "@/lib/status";
import { getClient, collectionsForInvoice, invoiceBalanceDue } from "@/lib/selectors";
import { services, expenseReports } from "@/lib/mock";

export function InvoiceDetailContent({ invoice }: { invoice: Invoice }) {
  const client = getClient(invoice.clientId);
  const status = invoiceStatusMeta(invoice.status);
  const invoiceServices = services.filter((s) => invoice.serviceIds.includes(s.id));
  const relatedCollections = collectionsForInvoice(invoice.id);
  const balanceDue = invoiceBalanceDue(invoice);
  const refacturableExpenses = expenseReports.filter(
    (e) => e.refacturable && invoice.serviceIds.includes(e.serviceId ?? "")
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <StatusBadge label={status.label} tone={status.tone} />
        {invoice.hasRefacturableExpenses && <StatusBadge label="Con gastos refacturables" tone="warning" />}
      </div>

      <SectionCard title="Datos de la factura">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Cliente" value={client?.name ?? "—"} />
          <Field label="Emisión" value={formatDate(invoice.issueDate)} />
          <Field label="Vencimiento" value={formatDate(invoice.dueDate)} />
          <Field label="Importe total" value={formatCurrency(invoice.amount)} />
        </dl>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-600">Saldo pendiente de cobro</span>
          <span className={`text-sm font-semibold ${balanceDue > 0 ? "text-red-600" : "text-opgreen-700"}`}>
            {formatCurrency(balanceDue)}
          </span>
        </div>
      </SectionCard>

      <SectionCard title="Servicios incluidos">
        <ul className="space-y-2">
          {invoiceServices.map((s) => (
            <li key={s.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{formatDate(s.date)} · {serviceTypeLabels[s.type]} · {s.origin} → {s.destination}</span>
              <span className="font-medium text-slate-700">{formatCurrency(s.amount)}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Movimientos de cobranza">
        {relatedCollections.length === 0 ? (
          <p className="text-sm text-slate-500">Sin movimientos de cobranza registrados todavía.</p>
        ) : (
          <ul className="space-y-2">
            {relatedCollections.map((c) => {
              const meta = collectionTypeMeta(c.type);
              return (
                <li key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{formatDate(c.date)} · {c.method}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">{formatCurrency(c.amount)}</span>
                    <StatusBadge label={meta.label} tone={meta.tone} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      {refacturableExpenses.length > 0 && (
        <SectionCard title="Gastos refacturables asociados">
          <ul className="space-y-2">
            {refacturableExpenses.map((e) => {
              const meta = expenseStatusMeta(e.status);
              return (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{formatCurrency(e.amount)} — {expenseCategoryLabels[e.category]}</span>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}
