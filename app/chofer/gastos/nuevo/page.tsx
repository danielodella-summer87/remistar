"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Info } from "lucide-react";
import type { ExpenseCategory, ExpenseStatus } from "@/lib/types";
import { drivers } from "@/lib/mock";
import { expenseCategoryLabels } from "@/lib/status";
import { formatDate } from "@/lib/format";
import { isoDate } from "@/lib/mock/dates";
import { DEMO_DRIVER_ID, driverActions } from "@/lib/driver-store";
import { listDriverServices } from "@/lib/driver-selectors";
import { getVehicle } from "@/lib/selectors";
import { DriverActionButton } from "@/components/driver/DriverActionButton";
import { MobileSection } from "@/components/driver/MobileSection";

const CATEGORIES = Object.keys(expenseCategoryLabels) as ExpenseCategory[];
const REQUIRES_SERVICE: ExpenseCategory[] = ["peaje", "combustible", "estacionamiento", "desayuno", "almuerzo_cena"];
const PAYMENT_METHODS = ["Efectivo", "Tarjeta propia", "Tarjeta de la empresa", "Transferencia"];

export default function ChoferNuevoGastoPage() {
  return (
    <Suspense fallback={null}>
      <NuevoGastoForm />
    </Suspense>
  );
}

function NuevoGastoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const driver = drivers.find((d) => d.id === DEMO_DRIVER_ID);
  const vehicle = getVehicle(driver?.usualVehicleId);
  const services = useMemo(() => listDriverServices(DEMO_DRIVER_ID), []);

  const [category, setCategory] = useState<ExpenseCategory>("peaje");
  const [date, setDate] = useState(isoDate(0));
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"UYU" | "USD">("UYU");
  const [serviceId, setServiceId] = useState(searchParams.get("servicio") ?? "");
  const [provider, setProvider] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [preApproved, setPreApproved] = useState(false);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceRequired = REQUIRES_SERVICE.includes(category);

  function validate(): boolean {
    const next: Record<string, string> = {};
    const amountNumber = Number(amount);
    if (!amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      next.amount = "Ingresá un importe válido.";
    }
    if (!date) next.date = "Ingresá la fecha del gasto.";
    if (!category) next.category = "Seleccioná el tipo de gasto.";
    if (serviceRequired && !serviceId) next.serviceId = "Este tipo de gasto requiere indicar el servicio asociado.";
    if (!receiptFileName && !reason.trim()) {
      next.reason = "Si no adjuntás comprobante, contá el motivo del gasto.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const hasReceipt = Boolean(receiptFileName);
    const status: ExpenseStatus = hasReceipt ? "pendiente_revision" : "pendiente_comprobante";

    driverActions.addExpenseDraft({
      id: `exp-draft-${Date.now()}`,
      driverId: DEMO_DRIVER_ID,
      serviceId: serviceId || undefined,
      vehicleId: vehicle?.id,
      category,
      amount: Number(amount),
      date,
      hasReceipt,
      requiredPreApproval: false,
      preApproved,
      status,
      refacturable: false,
      currency,
      provider: provider || undefined,
      paymentMethod,
      reason: reason || undefined,
      notes: notes || undefined,
      isDemo: true,
    });

    router.push("/chofer/gastos");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Registrar gasto</h1>
        <p className="text-sm text-slate-500">Simulación de rendición — no se envía a ningún sistema real.</p>
      </div>

      <MobileSection title="Datos del gasto">
        <div className="space-y-3.5">
          <Field label="Tipo de gasto" error={errors.category}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {expenseCategoryLabels[c]}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha" error={errors.date}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Moneda">
              <select value={currency} onChange={(e) => setCurrency(e.target.value as "UYU" | "USD")} className={inputClass}>
                <option value="UYU">Pesos (UYU)</option>
                <option value="USD">Dólares (USD)</option>
              </select>
            </Field>
          </div>

          <Field label="Importe" error={errors.amount}>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </Field>

          <Field label={`Servicio asociado${serviceRequired ? " (obligatorio)" : " (opcional)"}`} error={errors.serviceId}>
            <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputClass}>
              <option value="">Sin servicio asociado</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {formatDate(s.date)} {s.time} · {s.code}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Vehículo">
            <select value={vehicle?.id ?? ""} disabled className={`${inputClass} bg-slate-50 text-slate-500`}>
              <option value={vehicle?.id ?? ""}>
                {vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : "Sin vehículo asignado"}
              </option>
            </select>
          </Field>
        </div>
      </MobileSection>

      <MobileSection title="Detalles adicionales">
        <div className="space-y-3.5">
          <Field label="Proveedor (opcional)">
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Ej: ANCAP, Estacionamiento Centro..."
              className={inputClass}
            />
          </Field>

          <Field label="Forma de pago">
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClass}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
            <input
              type="checkbox"
              checked={preApproved}
              onChange={(e) => setPreApproved(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-petrol-700"
            />
            <span className="text-sm text-slate-700">Tenía autorización previa para este gasto</span>
          </label>

          <Field label={`Motivo${!receiptFileName ? " (obligatorio sin comprobante)" : " (opcional)"}`} error={errors.reason}>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Contá brevemente por qué es necesario este gasto..."
              className={inputClass}
            />
          </Field>

          <Field label="Observaciones (opcional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
        </div>
      </MobileSection>

      <MobileSection title="Comprobante">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-5 text-center">
          <Camera className="h-6 w-6 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            {receiptFileName ?? "Adjuntar foto del comprobante"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setReceiptFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Simulación: el archivo no se sube ni se guarda. Se descarta al salir de esta pantalla.
        </p>
      </MobileSection>

      <DriverActionButton label="Guardar gasto" type="submit" tone="primary" />
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
