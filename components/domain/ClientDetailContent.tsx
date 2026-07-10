import type { Client } from "@/lib/types";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { serviceStatusMeta, serviceTypeLabels, invoiceStatusMeta } from "@/lib/status";
import { passengersForClient, servicesForClient, invoicesForClient } from "@/lib/selectors";

export function ClientDetailContent({ client }: { client: Client }) {
  const clientPassengers = passengersForClient(client.id);
  const clientServices = servicesForClient(client.id).slice(0, 6);
  const clientInvoices = invoicesForClient(client.id);

  return (
    <div className="space-y-5">
      <SectionCard title="Datos del cliente">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Tipo" value={client.type === "corporativo" ? "Corporativo" : "Particular"} />
          <Field label="Desde" value={formatDate(client.since)} />
          <Field label="Email" value={client.email} />
          <Field label="Teléfono" value={client.phone} />
          <Field label="Documento" value={client.document} />
          <Field label="Dirección" value={client.address} />
          {client.contactName && <Field label="Contacto" value={client.contactName} />}
          {client.paymentTerms && <Field label="Condiciones" value={client.paymentTerms} />}
        </dl>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-600">Saldo de cuenta corriente</span>
          <span className={`text-sm font-semibold ${client.balance < 0 ? "text-red-600" : "text-opgreen-700"}`}>
            {formatCurrency(client.balance)}
          </span>
        </div>
      </SectionCard>

      {clientPassengers.length > 0 && (
        <SectionCard title="Pasajeros habilitados">
          <ul className="space-y-2 text-sm">
            {clientPassengers.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <span className="text-slate-700">{p.name}</span>
                {p.isFrequent && <StatusBadge label="Frecuente" tone="brand" />}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title="Servicios recientes">
        {clientServices.length === 0 ? (
          <p className="text-sm text-slate-500">Sin servicios registrados todavía.</p>
        ) : (
          <ul className="space-y-2.5">
            {clientServices.map((s) => {
              const meta = serviceStatusMeta(s.status);
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">
                    {formatDate(s.date)} · {serviceTypeLabels[s.type]} · {s.origin} → {s.destination}
                  </span>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-xs text-slate-400">{client.totalServices} servicios en total (demo).</p>
      </SectionCard>

      <SectionCard title="Facturas">
        {clientInvoices.length === 0 ? (
          <p className="text-sm text-slate-500">Sin facturas registradas todavía.</p>
        ) : (
          <ul className="space-y-2.5">
            {clientInvoices.map((inv) => {
              const meta = invoiceStatusMeta(inv.status);
              return (
                <li key={inv.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">{inv.number} — {formatCurrency(inv.amount)}</span>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
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
