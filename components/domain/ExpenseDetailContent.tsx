"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, FileQuestion, PercentCircle, CheckCheck } from "lucide-react";
import type { ExpenseReport, ExpenseStatus } from "@/lib/types";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import { expenseStatusMeta, expenseCategoryLabels } from "@/lib/status";
import { driverLabel, vehicleLabel, clientLabel, getService } from "@/lib/selectors";

export function ExpenseDetailContent({
  expense,
  onUpdate,
}: {
  expense: ExpenseReport;
  onUpdate: (id: string, changes: Partial<ExpenseReport>) => void;
}) {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const status = expenseStatusMeta(expense.status);
  const service = getService(expense.serviceId);

  function apply(changes: Partial<ExpenseReport>, actionLabel: string) {
    onUpdate(expense.id, changes);
    setLastAction(actionLabel);
  }

  const actionable = !["reintegrado", "incluido_liquidacion"].includes(expense.status);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <StatusBadge label={status.label} tone={status.tone} />
        {!expense.hasReceipt && expense.status !== "pendiente_comprobante" && (
          <StatusBadge label="Sin comprobante" tone="warning" />
        )}
        {expense.possibleDuplicate && <StatusBadge label="Posible duplicado" tone="danger" />}
        {expense.refacturable && <StatusBadge label="Refacturable" tone="brand" />}
      </div>

      <SectionCard title="Datos del gasto">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <Field label="Chofer" value={driverLabel(expense.driverId)} />
          <Field label="Categoría" value={expenseCategoryLabels[expense.category]} />
          <Field label="Importe" value={formatCurrency(expense.amount)} />
          <Field label="Fecha" value={formatDate(expense.date)} />
          <Field label="Vehículo" value={vehicleLabel(expense.vehicleId)} />
          <Field label="Cliente" value={expense.clientId ? clientLabel(expense.clientId) : "—"} />
          <Field label="Servicio" value={service ? `${service.code} — ${service.origin} → ${service.destination}` : "—"} />
          <Field label="Autorización previa" value={expense.requiredPreApproval ? (expense.preApproved ? "Solicitada y otorgada" : "Requerida, no otorgada") : "No requerida"} />
          {expense.approvedAmount !== undefined && <Field label="Monto aprobado" value={formatCurrency(expense.approvedAmount)} />}
        </dl>
        {expense.notes && (
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{expense.notes}</p>
        )}
        <div className="mt-3 rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400">
          {expense.hasReceipt ? "Comprobante adjunto (demo)" : "Sin comprobante adjunto"}
        </div>
      </SectionCard>

      {actionable && (
        <SectionCard
          title="Acciones del responsable administrativo"
          description="Estas acciones son de demostración: solo cambian el estado en memoria durante esta sesión."
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <ActionButton
              icon={CheckCircle2}
              label="Aprobar"
              tone="success"
              onClick={() => apply({ status: "aprobado" as ExpenseStatus, approvedAmount: expense.amount }, "Gasto aprobado")}
            />
            <ActionButton
              icon={PercentCircle}
              label="Aprobar parcial"
              tone="warning"
              onClick={() =>
                apply(
                  { status: "aprobado_parcial" as ExpenseStatus, approvedAmount: Math.round(expense.amount * 0.7) },
                  "Gasto aprobado parcialmente (70% del importe, demo)"
                )
              }
            />
            <ActionButton
              icon={XCircle}
              label="Rechazar"
              tone="danger"
              onClick={() => apply({ status: "rechazado" as ExpenseStatus }, "Gasto rechazado")}
            />
            <ActionButton
              icon={AlertCircle}
              label="Observar"
              tone="info"
              onClick={() => apply({ status: "observado" as ExpenseStatus }, "Gasto marcado como observado")}
            />
            <ActionButton
              icon={FileQuestion}
              label="Pedir comprobante"
              tone="neutral"
              onClick={() => apply({ status: "pendiente_comprobante" as ExpenseStatus, hasReceipt: false }, "Se solicitó el comprobante al chofer")}
            />
            <ActionButton
              icon={CheckCheck}
              label="Marcar reintegrado"
              tone="brand"
              onClick={() => apply({ status: "reintegrado" as ExpenseStatus }, "Gasto marcado como reintegrado")}
            />
          </div>
          {lastAction && (
            <p className="mt-4 rounded-lg bg-opgreen-50 px-3 py-2 text-xs font-medium text-opgreen-700">
              {lastAction} — cambio aplicado solo en esta sesión (demo).
            </p>
          )}
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

const toneClasses = {
  success: "border-opgreen-200 bg-opgreen-50 text-opgreen-700 hover:bg-opgreen-100",
  warning: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
  danger: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  info: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
  neutral: "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
  brand: "border-petrol-200 bg-petrol-50 text-petrol-700 hover:bg-petrol-100",
};

function ActionButton({
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  onClick: () => void;
  tone: keyof typeof toneClasses;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-colors ${toneClasses[tone]}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
