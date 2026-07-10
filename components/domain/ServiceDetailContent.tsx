import Link from "next/link";
import type { Service } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import { Timeline } from "@/components/shared/Timeline";
import { serviceStatusMeta, riskMeta, serviceTypeLabels, expenseStatusMeta, expenseCategoryLabels } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  clientLabel,
  driverLabel,
  vehicleLabel,
  getClient,
  getPassenger,
} from "@/lib/selectors";
import { invoices, collections, settlements, expenseReports, alerts } from "@/lib/mock";

export function ServiceDetailContent({ service }: { service: Service }) {
  const status = serviceStatusMeta(service.status);
  const risk = riskMeta(service.risk);
  const passenger = getPassenger(service.passengerId);
  const client = getClient(service.clientId);

  const relatedExpenses = expenseReports.filter((e) => e.serviceId === service.id);
  const relatedInvoice = invoices.find((i) => i.serviceIds.includes(service.id));
  const relatedCollections = relatedInvoice
    ? collections.filter((c) => c.invoiceId === relatedInvoice.id)
    : [];
  const relatedSettlement = settlements.find((s) => s.serviceIds.includes(service.id));
  const relatedAlerts = alerts.filter((a) => a.relatedEntity?.includes(service.code));

  const margin = service.amount - service.estimatedCost;

  const timeline = [
    { date: formatDate(service.date), label: "Solicitud registrada", description: "Datos del servicio cargados (demo)." },
    ...(service.status !== "pendiente"
      ? [{ date: formatDate(service.date), label: "Confirmado", description: "El cliente confirmó el servicio." }]
      : []),
    ...(service.driverId
      ? [{ date: formatDate(service.date), label: "Chofer y vehículo asignados", description: `${driverLabel(service.driverId)} — ${vehicleLabel(service.vehicleId)}` }]
      : []),
    ...(service.status === "en_curso" || service.status === "finalizado"
      ? [{ date: formatDate(service.date), label: "Servicio iniciado", description: `${service.origin} → ${service.destination}` }]
      : []),
    ...(service.status === "finalizado"
      ? [{ date: formatDate(service.date), label: "Servicio finalizado", description: "Cierre operativo registrado." }]
      : []),
    ...(service.status === "cancelado"
      ? [{ date: formatDate(service.date), label: "Servicio cancelado", description: service.notes ?? "Sin motivo registrado." }]
      : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label={status.label} tone={status.tone} />
        <StatusBadge label={risk.label} tone={risk.tone} />
        <span className="text-xs text-slate-400">{service.code}</span>
      </div>

      <SectionCard title="Datos del servicio">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Tipo" value={serviceTypeLabels[service.type]} />
          <Field label="Fecha y hora" value={`${formatDate(service.date)} · ${service.time}`} />
          <Field label="Origen" value={service.origin} />
          <Field label="Destino" value={service.destination} />
          <Field label="Cliente" value={clientLabel(service.clientId)} />
          <Field label="Pasajero" value={passenger?.name ?? "—"} />
          <Field label="Importe" value={formatCurrency(service.amount)} />
          <Field label="Criterio de pago al chofer" value={service.driverPayoutCriteria} full />
          {service.riskReason && <Field label="Motivo del riesgo" value={service.riskReason} full />}
          {service.notes && <Field label="Notas" value={service.notes} full />}
        </dl>
      </SectionCard>

      <SectionCard title="Asignación">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Chofer" value={driverLabel(service.driverId)} />
          <Field label="Vehículo" value={vehicleLabel(service.vehicleId)} />
        </dl>
        {(!service.driverId || !service.vehicleId) && (
          <p className="mt-3 text-xs font-medium text-amber-700">
            Este servicio todavía no tiene {!service.driverId && !service.vehicleId ? "chofer ni vehículo" : !service.driverId ? "chofer" : "vehículo"} asignado.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Historial (reconstruido para la demo)">
        <Timeline items={timeline} />
      </SectionCard>

      <SectionCard title="Gastos asociados" action={<Link href="/app/gastos" className="text-xs font-medium text-petrol-700 hover:underline">Ver rendición →</Link>}>
        {relatedExpenses.length === 0 ? (
          <p className="text-sm text-slate-500">No hay gastos rendidos por el chofer para este servicio.</p>
        ) : (
          <ul className="space-y-2">
            {relatedExpenses.map((e) => {
              const meta = expenseStatusMeta(e.status);
              return (
                <li key={e.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">{formatCurrency(e.amount)} — {expenseCategoryLabels[e.category]}</span>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Facturación y cobranza" action={<Link href="/app/facturacion" className="text-xs font-medium text-petrol-700 hover:underline">Ver facturación →</Link>}>
        {relatedInvoice ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Factura {relatedInvoice.number}</span>
              <span className="font-medium text-slate-800">{formatCurrency(relatedInvoice.amount)}</span>
            </div>
            {relatedCollections.length > 0 ? (
              relatedCollections.map((c) => (
                <div key={c.id} className="flex justify-between text-xs text-slate-500">
                  <span>Cobranza {formatDate(c.date)}</span>
                  <span>{formatCurrency(c.amount)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Sin movimientos de cobranza registrados todavía.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Este servicio todavía no fue incluido en una factura.</p>
        )}
      </SectionCard>

      <SectionCard title="Liquidación del chofer" action={<Link href="/app/liquidaciones" className="text-xs font-medium text-petrol-700 hover:underline">Ver liquidaciones →</Link>}>
        {relatedSettlement ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Período {relatedSettlement.periodLabel}</span>
            <span className="font-medium text-slate-800">{formatCurrency(relatedSettlement.finalBalance)}</span>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Este servicio todavía no fue incluido en una liquidación.</p>
        )}
      </SectionCard>

      {relatedAlerts.length > 0 && (
        <SectionCard title="Alertas relacionadas">
          <ul className="space-y-1.5">
            {relatedAlerts.map((a) => (
              <li key={a.id} className="text-sm text-slate-600">{a.title}</li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title="Rentabilidad preliminar (demo)">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Importe − costo estimado</span>
          <span className={`font-semibold ${margin >= 0 ? "text-opgreen-700" : "text-red-600"}`}>
            {formatCurrency(margin)}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Cálculo demostrativo (importe menos costo estimado). No incluye aún gastos reintegrados
          ni ajustes de liquidación reales — ver principio de rentabilidad en el roadmap.
        </p>
      </SectionCard>

      {client && client.balance < 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Este cliente tiene un saldo deudor de {formatCurrency(Math.abs(client.balance))} (demo).
        </p>
      )}
    </div>
  );
}

function Field({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}
