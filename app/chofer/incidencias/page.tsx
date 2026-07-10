"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Camera, Info } from "lucide-react";
import type { DriverIncidentType, DriverIncidentSeverity } from "@/lib/types";
import { drivers } from "@/lib/mock";
import { getVehicle } from "@/lib/selectors";
import { DEMO_DRIVER_ID, driverActions, useDriverDemoState } from "@/lib/driver-store";
import { listDriverServices, getDriverIncidents } from "@/lib/driver-selectors";
import {
  DRIVER_INCIDENT_TYPES,
  driverIncidentTypeLabels,
  driverIncidentSeverityMeta,
} from "@/lib/driver-status";
import { formatDate } from "@/lib/format";
import { IncidentCard } from "@/components/driver/IncidentCard";
import { DriverActionButton } from "@/components/driver/DriverActionButton";
import { MobileSection } from "@/components/driver/MobileSection";

const SEVERITIES: DriverIncidentSeverity[] = ["baja", "media", "alta"];

export default function ChoferIncidenciasPage() {
  return (
    <Suspense fallback={null}>
      <IncidenciasScreen />
    </Suspense>
  );
}

function IncidenciasScreen() {
  const searchParams = useSearchParams();
  const state = useDriverDemoState();
  const incidents = getDriverIncidents(DEMO_DRIVER_ID, state);
  const [showForm, setShowForm] = useState(
    Boolean(searchParams.get("tipo") || searchParams.get("servicio"))
  );

  if (showForm) {
    return (
      <IncidentForm
        initialType={(searchParams.get("tipo") as DriverIncidentType) ?? undefined}
        initialServiceId={searchParams.get("servicio") ?? undefined}
        onDone={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-slate-900">Incidencias</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-xl bg-opgreen-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-opgreen-700"
        >
          <Plus className="h-4 w-4" /> Reportar
        </button>
      </div>

      {incidents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="text-sm font-medium text-slate-600">No tenés incidencias reportadas.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}

function IncidentForm({
  initialType,
  initialServiceId,
  onDone,
}: {
  initialType?: DriverIncidentType;
  initialServiceId?: string;
  onDone: () => void;
}) {
  const driver = drivers.find((d) => d.id === DEMO_DRIVER_ID);
  const vehicle = getVehicle(driver?.usualVehicleId);
  const services = useMemo(() => listDriverServices(DEMO_DRIVER_ID), []);

  const [type, setType] = useState<DriverIncidentType>(initialType ?? "mecanico");
  const [severity, setSeverity] = useState<DriverIncidentSeverity>("media");
  const [serviceId, setServiceId] = useState(initialServiceId ?? "");
  const [description, setDescription] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [mileage, setMileage] = useState("");
  const [canContinue, setCanContinue] = useState(true);
  const [needsAssistance, setNeedsAssistance] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Contá brevemente qué pasó.");
      return;
    }
    driverActions.addIncident({
      id: `inc-draft-${Date.now()}`,
      driverId: DEMO_DRIVER_ID,
      serviceId: serviceId || undefined,
      vehicleId: vehicle?.id,
      type,
      severity,
      description: description.trim(),
      actionTaken: actionTaken.trim() || undefined,
      canContinue,
      needsImmediateAssistance: needsAssistance,
      mileage: mileage ? Number(mileage) : undefined,
      photoDemoName: photoName ?? undefined,
      status: "reportada",
      createdAt: "Hoy",
      isDemo: true,
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Incidencia reportada</p>
          <p className="mt-1 text-sm text-slate-500">Quedó registrada como &quot;Reportada&quot; (demo).</p>
        </div>
        <DriverActionButton label="Volver a incidencias" onClick={onDone} tone="brand" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-lg font-bold text-slate-900">Reportar incidencia</h1>

      <MobileSection title="Datos de la incidencia">
        <div className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value as DriverIncidentType)} className={inputClass}>
              {DRIVER_INCIDENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {driverIncidentTypeLabels[t]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Gravedad</label>
            <div className="flex gap-2">
              {SEVERITIES.map((s) => {
                const meta = driverIncidentSeverityMeta(s);
                const active = severity === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`flex-1 rounded-lg py-2 text-xs font-medium ${
                      active ? "bg-petrol-700 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {meta.label.replace("Gravedad ", "")}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Servicio relacionado (opcional)</label>
            <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputClass}>
              <option value="">Sin servicio asociado</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {formatDate(s.date)} {s.time} · {s.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Kilometraje actual (opcional)</label>
            <input
              type="number"
              inputMode="numeric"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder={vehicle ? String(vehicle.mileage) : undefined}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Contá qué pasó..."
              className={inputClass}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Acción tomada (opcional)</label>
            <textarea
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
            <input
              type="checkbox"
              checked={canContinue}
              onChange={(e) => setCanContinue(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-petrol-700"
            />
            <span className="text-sm text-slate-700">Puedo continuar con el servicio</span>
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
            <input
              type="checkbox"
              checked={needsAssistance}
              onChange={(e) => setNeedsAssistance(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-red-600"
            />
            <span className="text-sm text-slate-700">Necesito asistencia inmediata</span>
          </label>
        </div>
      </MobileSection>

      <MobileSection title="Foto (opcional)">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-5 text-center">
          <Camera className="h-6 w-6 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">{photoName ?? "Adjuntar foto"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Simulación: la foto no se sube ni se guarda.
        </p>
      </MobileSection>

      <DriverActionButton label="Reportar incidencia" type="submit" tone="primary" />
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100";
