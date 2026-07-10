"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  Navigation,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ReceiptText,
  TriangleAlert,
} from "lucide-react";
import type { Service } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { serviceTypeLabels, riskMeta } from "@/lib/status";
import { getPassenger, clientLabel, vehicleLabel } from "@/lib/selectors";
import { useDriverDemoState, driverActions } from "@/lib/driver-store";
import { getDriverServiceStatus } from "@/lib/driver-selectors";
import { ctaLabelForDriverStatus, nextDriverServiceStatus, driverServiceStatusMeta } from "@/lib/driver-status";
import { telLink, googleMapsLink, wazeLink } from "@/lib/driver-links";
import { ServiceProgress } from "./ServiceProgress";
import { DriverActionButton } from "./DriverActionButton";
import { ConfirmationSheet } from "./ConfirmationSheet";

const REJECT_REASONS = [
  "No estoy disponible",
  "Problema con el vehículo",
  "No llego en hora",
  "Necesito descanso",
  "Otro",
];

export function CurrentServiceCard({ service }: { service: Service }) {
  const state = useDriverDemoState();
  const status = getDriverServiceStatus(service, state);
  const risk = riskMeta(service.risk);
  const passenger = getPassenger(service.passengerId);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [waitOpen, setWaitOpen] = useState(false);
  const [waitMinutes, setWaitMinutes] = useState("15");
  const [lastAction, setLastAction] = useState<string | null>(null);

  const ctaLabel = ctaLabelForDriverStatus(status);
  const isPendingAcceptance = status === "pendiente_aceptacion" || status === "asignado";
  const isTerminal = status === "cerrado" || status === "rechazado";

  function advance() {
    const next = nextDriverServiceStatus(status);
    if (!next) return;
    driverActions.setServiceStatus(service.id, next);
    setLastAction(`Marcado como "${driverServiceStatusMeta(next).label}"`);
  }

  function reject(reason: string) {
    driverActions.rejectService(service.id, reason);
    setRejectOpen(false);
    setLastAction("Servicio rechazado");
  }

  function sendExtraWait() {
    const minutes = Number(waitMinutes) || 0;
    driverActions.requestExtraWait(service.id, minutes);
    setWaitOpen(false);
    setLastAction(`Espera adicional de ${minutes} min informada`);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {serviceTypeLabels[service.type]} · {service.code}
        </p>
        <StatusBadge label={risk.label} tone={risk.tone} />
      </div>

      <p className="mt-2 text-2xl font-bold text-slate-900">{service.time}</p>
      <p className="text-sm text-slate-500">Hora de presentación</p>

      <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-opgreen-600" />
          <div>
            <p className="text-xs text-slate-400">Origen</p>
            <p className="text-sm font-medium text-slate-800">{service.origin}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div>
            <p className="text-xs text-slate-400">Destino</p>
            <p className="text-sm font-medium text-slate-800">{service.destination}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs text-slate-400">Cliente</p>
          <p className="font-medium text-slate-800">{clientLabel(service.clientId)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Pasajero</p>
          <p className="font-medium text-slate-800">{passenger?.name ?? "A confirmar"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Vehículo</p>
          <p className="font-medium text-slate-800">{vehicleLabel(service.vehicleId)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Importe a rendir</p>
          <p className="font-medium text-slate-800">{formatCurrency(service.driverPayoutAmount ?? 0)}</p>
        </div>
      </div>

      {service.notes && (
        <p className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">{service.notes}</p>
      )}

      <div className="mt-4 border-t border-slate-100 pt-4">
        <ServiceProgress status={status} />
      </div>

      {/* Accesos rápidos */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <QuickLink href={passenger?.phone ? telLink(passenger.phone) : undefined} icon={Phone} label="Llamar" />
        <QuickLink href={googleMapsLink(service.origin)} icon={MapPin} label="Origen" />
        <QuickLink href={googleMapsLink(service.destination)} icon={Navigation} label="Destino" />
        <QuickLink href={wazeLink(service.destination)} icon={Navigation} label="Waze" />
      </div>

      {!isTerminal && (
        <div className="mt-4 flex gap-2">
          <a
            href={`/chofer/gastos/nuevo?servicio=${service.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-xs font-medium text-slate-600 active:bg-slate-50"
          >
            <ReceiptText className="h-3.5 w-3.5" /> Cargar gasto
          </a>
          <a
            href={`/chofer/incidencias?servicio=${service.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-xs font-medium text-slate-600 active:bg-slate-50"
          >
            <TriangleAlert className="h-3.5 w-3.5" /> Reportar
          </a>
          <button
            type="button"
            onClick={() => setWaitOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-xs font-medium text-slate-600 active:bg-slate-50"
          >
            <Clock className="h-3.5 w-3.5" /> Espera
          </button>
        </div>
      )}

      {/* CTA principal — uno solo, según el estado */}
      {ctaLabel && (
        <div className="mt-4">
          <DriverActionButton label={ctaLabel} onClick={advance} icon={CheckCircle2} tone="primary" />
        </div>
      )}

      {isPendingAcceptance && (
        <button
          type="button"
          onClick={() => setRejectOpen(true)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 py-2 text-sm font-medium text-red-600"
        >
          <XCircle className="h-4 w-4" /> Rechazar servicio
        </button>
      )}

      {lastAction && (
        <p className="mt-3 rounded-lg bg-opgreen-50 px-3 py-2 text-center text-xs font-medium text-opgreen-700">
          {lastAction} — cambio guardado en este dispositivo (demo).
        </p>
      )}

      {status !== "asignado" && (
        <button
          type="button"
          onClick={() => {
            driverActions.resetServiceStatus(service.id);
            setLastAction(null);
          }}
          className="mt-3 flex w-full items-center justify-center gap-1.5 py-1.5 text-xs text-slate-400"
        >
          <RotateCcw className="h-3 w-3" /> Reiniciar demo de este servicio
        </button>
      )}

      <ConfirmationSheet
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="¿Por qué rechazás el servicio?"
        description="Quedará registrado en el historial del servicio."
      >
        <div className="space-y-2">
          {REJECT_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => reject(reason)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-left text-sm font-medium text-slate-800 active:bg-slate-50"
            >
              {reason}
            </button>
          ))}
        </div>
      </ConfirmationSheet>

      <ConfirmationSheet
        open={waitOpen}
        onClose={() => setWaitOpen(false)}
        title="Informar espera adicional"
        description="Se agrega como nota al historial del servicio (demo)."
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Minutos de espera</label>
            <input
              type="number"
              min={0}
              value={waitMinutes}
              onChange={(e) => setWaitMinutes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
            />
          </div>
          <DriverActionButton label="Informar espera" onClick={sendExtraWait} tone="brand" />
        </div>
      </ConfirmationSheet>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href?: string;
  icon: typeof Phone;
  label: string;
}) {
  if (!href) {
    return (
      <span className="flex flex-col items-center gap-1 rounded-lg bg-slate-50 py-2.5 text-[11px] text-slate-300">
        <Icon className="h-4 w-4" />
        {label}
      </span>
    );
  }
  return (
    <a
      href={href}
      target={href.startsWith("tel:") ? undefined : "_blank"}
      rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"}
      className="flex flex-col items-center gap-1 rounded-lg bg-petrol-50 py-2.5 text-[11px] font-medium text-petrol-700 active:bg-petrol-100"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}
