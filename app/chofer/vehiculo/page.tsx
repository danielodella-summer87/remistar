"use client";

import { useState } from "react";
import Link from "next/link";
import { Gauge, Fuel, Ban, Wrench, ShieldCheck, IdCard } from "lucide-react";
import { drivers } from "@/lib/mock";
import { getVehicle } from "@/lib/selectors";
import { vehicleCategoryLabels } from "@/lib/status";
import { formatDate } from "@/lib/format";
import { DEMO_DRIVER_ID, driverActions, useDriverDemoState } from "@/lib/driver-store";
import type { VehicleDemoUpdates } from "@/lib/driver-store";
import { VehicleStatusCard } from "@/components/driver/VehicleStatusCard";
import { MobileSection } from "@/components/driver/MobileSection";
import { DriverActionButton } from "@/components/driver/DriverActionButton";
import { ConfirmationSheet } from "@/components/driver/ConfirmationSheet";

const FUEL_LEVELS: { value: NonNullable<VehicleDemoUpdates["fuelLevel"]>; label: string }[] = [
  { value: "lleno", label: "Lleno" },
  { value: "tres_cuartos", label: "3/4" },
  { value: "mitad", label: "Mitad" },
  { value: "un_cuarto", label: "1/4" },
  { value: "reserva", label: "Reserva" },
];

export default function ChoferVehiculoPage() {
  const state = useDriverDemoState();
  const driver = drivers.find((d) => d.id === DEMO_DRIVER_ID);
  const vehicle = getVehicle(driver?.usualVehicleId);

  const [mileageOpen, setMileageOpen] = useState(false);
  const [fuelOpen, setFuelOpen] = useState(false);
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [mileageInput, setMileageInput] = useState(String(vehicle?.mileage ?? ""));
  const [unavailableReason, setUnavailableReason] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!vehicle) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="text-sm font-medium text-slate-600">No tenés un vehículo asignado.</p>
      </div>
    );
  }

  const currentMileage = state.vehicle.mileage ?? vehicle.mileage;
  const currentFuel = state.vehicle.fuelLevel;
  const isUnavailable = state.vehicle.unavailable ?? false;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-slate-900">Mi vehículo</h1>

      <VehicleStatusCard vehicle={vehicle} />

      {isUnavailable && (
        <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-700">
          Marcado como no disponible{state.vehicle.unavailableReason ? `: ${state.vehicle.unavailableReason}` : "."}
        </div>
      )}

      <MobileSection title="Estado actual">
        <dl className="space-y-2.5 text-sm">
          <Row label="Kilometraje" value={`${currentMileage.toLocaleString("es-UY")} km`} />
          <Row label="Combustible" value={currentFuel ? FUEL_LEVELS.find((f) => f.value === currentFuel)?.label ?? "—" : "No informado"} />
          <Row label="Categoría" value={vehicleCategoryLabels[vehicle.category]} />
          <Row label="Capacidad" value={`${vehicle.capacity} pasajeros`} />
        </dl>
      </MobileSection>

      <MobileSection title="Documentación (solo lectura)">
        <dl className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" />
            <Row label="Seguro vence" value={formatDate(vehicle.insuranceExpiry)} />
          </div>
          <div className="flex items-center gap-2.5">
            <IdCard className="h-4 w-4 shrink-0 text-slate-400" />
            <Row label="Patente/inspección vence" value={formatDate(vehicle.registrationExpiry)} />
          </div>
        </dl>
      </MobileSection>

      <div className="grid grid-cols-2 gap-3">
        <ActionTile icon={Gauge} label="Actualizar kilometraje" onClick={() => setMileageOpen(true)} />
        <ActionTile icon={Fuel} label="Informar combustible" onClick={() => setFuelOpen(true)} />
        <Link
          href={`/chofer/incidencias?tipo=mecanico`}
          className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm active:bg-slate-50"
        >
          <Wrench className="h-5 w-5 text-petrol-700" />
          <span className="text-xs font-medium text-slate-700">Reportar falla</span>
        </Link>
        <ActionTile icon={Ban} label="Vehículo no disponible" onClick={() => setUnavailableOpen(true)} tone="danger" />
      </div>

      {feedback && (
        <p className="rounded-lg bg-opgreen-50 px-3 py-2 text-center text-xs font-medium text-opgreen-700">
          {feedback} — cambio guardado en este dispositivo (demo).
        </p>
      )}

      <ConfirmationSheet open={mileageOpen} onClose={() => setMileageOpen(false)} title="Actualizar kilometraje">
        <div className="space-y-4">
          <input
            type="number"
            value={mileageInput}
            onChange={(e) => setMileageInput(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
          />
          <DriverActionButton
            label="Guardar kilometraje"
            tone="primary"
            onClick={() => {
              const value = Number(mileageInput);
              if (!Number.isNaN(value) && value >= 0) {
                driverActions.updateVehicle({ mileage: value });
                setFeedback("Kilometraje actualizado");
              }
              setMileageOpen(false);
            }}
          />
        </div>
      </ConfirmationSheet>

      <ConfirmationSheet open={fuelOpen} onClose={() => setFuelOpen(false)} title="Informar nivel de combustible">
        <div className="space-y-2">
          {FUEL_LEVELS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                driverActions.updateVehicle({ fuelLevel: f.value });
                setFeedback("Nivel de combustible informado");
                setFuelOpen(false);
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-left text-sm font-medium text-slate-800 active:bg-slate-50"
            >
              {f.label}
            </button>
          ))}
        </div>
      </ConfirmationSheet>

      <ConfirmationSheet
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
        title="Marcar vehículo como no disponible"
        description="Se le va a avisar a operaciones (demo)."
      >
        <div className="space-y-4">
          <textarea
            value={unavailableReason}
            onChange={(e) => setUnavailableReason(e.target.value)}
            rows={2}
            placeholder="Motivo (opcional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
          />
          <DriverActionButton
            label="Confirmar no disponibilidad"
            tone="danger"
            onClick={() => {
              driverActions.updateVehicle({ unavailable: true, unavailableReason: unavailableReason || undefined });
              setFeedback("Vehículo marcado como no disponible");
              setUnavailableOpen(false);
            }}
          />
        </div>
      </ConfirmationSheet>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function ActionTile({
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: {
  icon: typeof Gauge;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm active:bg-slate-50"
    >
      <Icon className={`h-5 w-5 ${tone === "danger" ? "text-red-600" : "text-petrol-700"}`} />
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </button>
  );
}
