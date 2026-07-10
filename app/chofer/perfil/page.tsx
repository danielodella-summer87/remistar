"use client";

import { useState } from "react";
import { RotateCcw, Star, Clock, Phone } from "lucide-react";
import { drivers } from "@/lib/mock";
import { DEMO_DRIVER_ID, driverActions } from "@/lib/driver-store";
import { formatDate, formatCurrency } from "@/lib/format";
import { vehicleOwnershipLabels, paymentSchemeLabels } from "@/lib/status";
import { MobileSection } from "@/components/driver/MobileSection";
import { ConfirmationSheet } from "@/components/driver/ConfirmationSheet";
import { DriverActionButton } from "@/components/driver/DriverActionButton";

export default function ChoferPerfilPage() {
  const driver = drivers.find((d) => d.id === DEMO_DRIVER_ID);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  if (!driver) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-petrol-100 text-2xl font-bold text-petrol-700">
          {driver.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </span>
        <p className="text-base font-semibold text-slate-900">{driver.name}</p>
        <p className="text-sm text-slate-500">{driver.phone}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Star} label="Calificación" value={driver.rating.toFixed(1)} />
        <Stat icon={Clock} label="Puntualidad" value={`${driver.punctuality}%`} />
        <Stat icon={Phone} label="Hs. semana" value={String(driver.hoursThisWeek)} />
      </div>

      <MobileSection title="Datos laborales (solo lectura)">
        <dl className="space-y-2.5 text-sm">
          <Row label="Fecha de ingreso" value={formatDate(driver.joinedAt)} />
          <Row label="Modalidad de pago" value={paymentSchemeLabels[driver.paymentScheme]} />
          <Row label="Vehículo" value={vehicleOwnershipLabels[driver.vehicleOwnership]} />
          <Row label="Saldo pendiente de liquidar" value={formatCurrency(driver.pendingSettlementAmount)} />
          <Row label="Gastos pendientes" value={String(driver.pendingExpensesCount)} />
        </dl>
      </MobileSection>

      <MobileSection title="Documentación (solo lectura)">
        <dl className="space-y-2.5 text-sm">
          <Row label="Licencia profesional vence" value={formatDate(driver.licenseExpiry)} />
          <Row label="Certificado de antecedentes vence" value={formatDate(driver.backgroundCheckExpiry)} />
          <Row label="Certificado de salud vence" value={formatDate(driver.healthCertExpiry)} />
        </dl>
        <p className="mt-3 text-xs text-slate-400">
          Estos datos son de solo lectura en este portal. Para actualizarlos, contactá a administración.
        </p>
      </MobileSection>

      <button
        type="button"
        onClick={() => setResetOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-600 active:bg-slate-50"
      >
        <RotateCcw className="h-4 w-4" /> Restablecer datos demo
      </button>

      <ConfirmationSheet
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="¿Restablecer todos los datos demo?"
        description="Se van a borrar los cambios guardados en este dispositivo: disponibilidad, estados de servicios, gastos, incidencias y confirmaciones de pago."
      >
        {resetDone ? (
          <p className="rounded-lg bg-opgreen-50 px-3 py-2 text-center text-sm font-medium text-opgreen-700">
            Datos demo restablecidos.
          </p>
        ) : (
          <DriverActionButton
            label="Sí, restablecer"
            tone="danger"
            onClick={() => {
              driverActions.resetDemo();
              setResetDone(true);
            }}
          />
        )}
      </ConfirmationSheet>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
      <Icon className="h-4 w-4 text-petrol-700" />
      <p className="text-base font-bold text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
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
