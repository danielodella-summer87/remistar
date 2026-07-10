import { ShieldAlert } from "lucide-react";
import type { DriverSettlement } from "@/lib/types";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { settlementStatusMeta, expenseStatusMeta, serviceTypeLabels, expenseCategoryLabels } from "@/lib/status";
import { getDriver, expensesForSettlement } from "@/lib/selectors";
import { services } from "@/lib/mock";

export function SettlementDetailContent({ settlement }: { settlement: DriverSettlement }) {
  const driver = getDriver(settlement.driverId);
  const status = settlementStatusMeta(settlement.status);
  const includedServices = services.filter((s) => settlement.serviceIds.includes(s.id));
  const expenses = expensesForSettlement(settlement.id);
  const approved = expenses.filter((e) => ["aprobado", "aprobado_parcial", "incluido_liquidacion", "reintegrado"].includes(e.status));
  const rejected = expenses.filter((e) => e.status === "rechazado");

  const warnings: string[] = [];
  if (rejected.length > 0) warnings.push(`Hay ${rejected.length} gasto(s) rechazado(s) en este período — verificar que el chofer haya sido notificado.`);
  if (settlement.status === "observada") warnings.push("La liquidación está observada: revisar el motivo antes de aprobar.");
  if (settlement.approvedExpensesAmount > settlement.serviceAmount) warnings.push("Los gastos aprobados superan el importe por servicios del período — validar antes de pagar.");
  if ((settlement.status === "pagada" || settlement.status === "cerrada") && !settlement.receiptConfirmed) warnings.push("Está marcada como pagada pero no hay confirmación de recepción del chofer.");
  if (settlement.advancesAmount > 0 && settlement.status === "pendiente_rendiciones") warnings.push("Tiene un adelanto pendiente de descontar y todavía hay rendiciones sin cerrar.");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <StatusBadge label={status.label} tone={status.tone} />
        <span className="text-xs text-slate-400">{settlement.periodLabel}</span>
      </div>

      <SectionCard title={`Liquidación de ${driver?.name ?? "chofer"}`}>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Período" value={settlement.periodLabel} />
          <Field label="Servicios incluidos" value={`${includedServices.length}`} />
          <Field label="Esquema de pago" value={driver ? (driver.paymentScheme === "comision" ? "Comisión" : driver.paymentScheme === "jornal" ? "Jornal" : "Tarifa fija") : "—"} />
          <Field label="Vehículo" value={driver?.vehicleOwnership === "propio" ? "Propio del chofer" : "De Remistar"} />
        </dl>
      </SectionCard>

      <SectionCard title="Servicios del período">
        {includedServices.length === 0 ? (
          <p className="text-sm text-slate-500">Sin servicios asociados.</p>
        ) : (
          <ul className="space-y-2">
            {includedServices.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{formatDate(s.date)} · {serviceTypeLabels[s.type]} · {s.origin} → {s.destination}</span>
                <span className="font-medium text-slate-700">{formatCurrency(s.driverPayoutAmount ?? 0)}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Gastos rendidos en el período">
        {expenses.length === 0 ? (
          <p className="text-sm text-slate-500">Sin gastos rendidos en este período.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((e) => {
              const meta = expenseStatusMeta(e.status);
              return (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{expenseCategoryLabels[e.category]} — {formatCurrency(e.amount)}</span>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 text-xs text-slate-400">
          {approved.length} aprobado(s) · {rejected.length} rechazado(s)
        </p>
      </SectionCard>

      <SectionCard title="Cálculo del saldo (fórmula preliminar, no validada)">
        <dl className="space-y-2 text-sm">
          <Row label="Importe por servicios realizados" value={settlement.serviceAmount} />
          <Row label="+ Gastos reintegrables aprobados" value={settlement.approvedExpensesAmount} />
          <Row label="+ Ajustes a favor del chofer" value={settlement.adjustmentsAmount} />
          <Row label="− Adelantos recibidos" value={-settlement.advancesAmount} />
          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-semibold">
            <span className="text-slate-800">Saldo final</span>
            <span className="text-petrol-700">{formatCurrency(settlement.finalBalance)}</span>
          </div>
        </dl>
      </SectionCard>

      <SectionCard title="Pago">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Fecha de pago" value={settlement.paymentDate ? formatDate(settlement.paymentDate) : "Aún no pagada"} />
          <Field label="Forma de pago" value={settlement.paymentMethod ?? "—"} />
          <Field label="Comprobante" value={settlement.status === "pagada" || settlement.status === "cerrada" ? "Adjunto (demo)" : "—"} />
          <Field label="Confirmación del chofer" value={settlement.receiptConfirmed ? "Confirmada" : "Pendiente"} />
        </dl>
      </SectionCard>

      <SectionCard title="Revisión inteligente" description="Advertencias generadas con reglas simples — no aprueban ni rechazan nada automáticamente.">
        {warnings.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-opgreen-700">
            <ShieldAlert className="h-4 w-4" /> No se detectaron inconsistencias en esta liquidación.
          </p>
        ) : (
          <ul className="space-y-2">
            {warnings.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                {w}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[11px] italic text-slate-400">
          Recomendación demo. La aprobación, el pago y cualquier ajuste siguen requiriendo confirmación humana.
        </p>
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

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-700">{formatCurrency(value)}</dd>
    </div>
  );
}
