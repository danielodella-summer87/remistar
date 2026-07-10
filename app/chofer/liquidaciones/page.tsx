"use client";

import { useState } from "react";
import { Info, ChevronDown, Download, CheckCircle2, Send } from "lucide-react";
import type { DriverSettlement } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { settlementStatusMeta } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/format";
import { useDriverDemoState, DEMO_DRIVER_ID, driverActions } from "@/lib/driver-store";
import { getDriverSettlements } from "@/lib/driver-selectors";
import { DriverActionButton } from "@/components/driver/DriverActionButton";
import { ConfirmationSheet } from "@/components/driver/ConfirmationSheet";

export default function ChoferLiquidacionesPage() {
  const state = useDriverDemoState();
  const settlements = getDriverSettlements(DEMO_DRIVER_ID);
  const confirmedIds = new Set(state.paymentConfirmations.map((c) => c.settlementId));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Mis liquidaciones</h1>
        <p className="mt-1 flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Importes demo. La liquidación definitiva requiere aprobación administrativa.
        </p>
      </div>

      {settlements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="text-sm font-medium text-slate-600">Todavía no hay liquidaciones generadas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((settlement) => (
            <SettlementDetail
              key={settlement.id}
              settlement={settlement}
              receiptConfirmed={settlement.receiptConfirmed || confirmedIds.has(settlement.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SettlementDetail({
  settlement,
  receiptConfirmed,
}: {
  settlement: DriverSettlement;
  receiptConfirmed: boolean;
}) {
  const meta = settlementStatusMeta(settlement.status);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [observation, setObservation] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function downloadReceipt() {
    const lines = [
      "COMPROBANTE DEMO — REMISTAR INTELLIGENCE",
      "Este documento es una simulación y no tiene validez fiscal ni administrativa.",
      "",
      `Período: ${settlement.periodLabel}`,
      `Servicios incluidos: ${settlement.serviceIds.length}`,
      `Importe servicios: ${formatCurrency(settlement.serviceAmount)}`,
      `Gastos aprobados: ${formatCurrency(settlement.approvedExpensesAmount)}`,
      `Gastos rechazados: ${formatCurrency(settlement.rejectedExpensesAmount)}`,
      `Adelantos: ${formatCurrency(settlement.advancesAmount)}`,
      `Ajustes: ${formatCurrency(settlement.adjustmentsAmount)}`,
      `Saldo final estimado: ${formatCurrency(settlement.finalBalance)}`,
      `Estado: ${meta.label}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comprobante-demo-${settlement.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function sendObservation() {
    setFeedback("Observación enviada — se registra solo en esta sesión (demo).");
    setObservation("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">{settlement.periodLabel}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <StatusBadge label={meta.label} tone={meta.tone} />
            {receiptConfirmed && <StatusBadge label="Pago confirmado" tone="success" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-slate-900">{formatCurrency(settlement.finalBalance)}</p>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="space-y-4 border-t border-slate-100 p-4">
          <dl className="space-y-2 text-sm">
            <Row label="Período" value={`${formatDate(settlement.periodStart)} — ${formatDate(settlement.periodEnd)}`} />
            <Row label="Servicios incluidos" value={String(settlement.serviceIds.length)} />
            <Row label="Importe servicios" value={formatCurrency(settlement.serviceAmount)} />
            <Row label="Gastos aprobados" value={formatCurrency(settlement.approvedExpensesAmount)} />
            {settlement.rejectedExpensesAmount > 0 && (
              <Row label="Gastos rechazados" value={`-${formatCurrency(settlement.rejectedExpensesAmount)}`} />
            )}
            {settlement.advancesAmount > 0 && (
              <Row label="Adelantos" value={`-${formatCurrency(settlement.advancesAmount)}`} />
            )}
            {settlement.adjustmentsAmount !== 0 && (
              <Row label="Ajustes" value={formatCurrency(settlement.adjustmentsAmount)} />
            )}
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm font-semibold text-slate-900">
              <span>Saldo estimado</span>
              <span>{formatCurrency(settlement.finalBalance)}</span>
            </div>
            {settlement.paymentDate && (
              <Row label="Fecha de pago" value={formatDate(settlement.paymentDate)} />
            )}
            {settlement.paymentMethod && <Row label="Forma de pago" value={settlement.paymentMethod} />}
          </dl>

          <button
            type="button"
            onClick={downloadReceipt}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 active:bg-slate-50"
          >
            <Download className="h-4 w-4" /> Descargar comprobante (demo)
          </button>

          {settlement.status === "pagada" && !receiptConfirmed && (
            <DriverActionButton
              label="Recibí el pago"
              icon={CheckCircle2}
              tone="primary"
              onClick={() => setConfirmOpen(true)}
            />
          )}

          <div className="space-y-2 rounded-lg bg-slate-50 p-3">
            <label className="block text-xs font-medium text-slate-600">Enviar observación a administración</label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={2}
              placeholder="Ej: no me cerraron los importes de gastos..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
            />
            <button
              type="button"
              disabled={!observation.trim()}
              onClick={sendObservation}
              className="flex items-center gap-1.5 rounded-lg bg-petrol-700 px-3.5 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" /> Enviar observación
            </button>
            {feedback && <p className="text-xs font-medium text-opgreen-700">{feedback}</p>}
          </div>
        </div>
      )}

      <ConfirmationSheet
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="¿Confirmás que recibiste el pago?"
        description="Esta acción es solo una confirmación demo, no reemplaza la conciliación administrativa real."
      >
        <DriverActionButton
          label="Sí, recibí el pago"
          tone="primary"
          onClick={() => {
            driverActions.confirmPayment({
              id: `pay-confirm-${settlement.id}-${Date.now()}`,
              settlementId: settlement.id,
              confirmedAt: "Hoy",
              isDemo: true,
            });
            setConfirmOpen(false);
          }}
        />
      </ConfirmationSheet>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
