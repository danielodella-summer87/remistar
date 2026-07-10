"use client";

import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { serviceTypesContent } from "@/lib/public-content";

interface FormState {
  serviceType: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  passengers: string;
  luggage: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  billingType: "personal" | "empresa";
  billingName: string;
  billingDocument: string;
  notes: string;
}

const initialState: FormState = {
  serviceType: "",
  date: "",
  time: "",
  origin: "",
  destination: "",
  passengers: "1",
  luggage: "",
  requesterName: "",
  requesterPhone: "",
  requesterEmail: "",
  billingType: "personal",
  billingName: "",
  billingDocument: "",
  notes: "",
};

const stepLabels = [
  "Datos del servicio",
  "Origen y destino",
  "Pasajeros y equipaje",
  "Datos del solicitante",
  "Facturación",
  "Observaciones",
];

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100";
const labelClass = "mb-1 block text-xs font-medium text-slate-700";

export function RequestTripForm() {
  const [step, setStep] = useState(0); // 0-5 = pasos, 6 = resumen, 7 = confirmado
  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = stepLabels.length;
  const progress = Math.min(((step + 1) / (totalSteps + 1)) * 100, 100);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function validateStep(): boolean {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (!data.serviceType) next.serviceType = "Elegí el tipo de servicio.";
      if (!data.date) next.date = "Indicá la fecha del traslado.";
      if (!data.time) next.time = "Indicá el horario aproximado.";
    }
    if (step === 1) {
      if (!data.origin.trim()) next.origin = "Indicá el origen.";
      if (!data.destination.trim()) next.destination = "Indicá el destino.";
    }
    if (step === 2) {
      if (!data.passengers || Number(data.passengers) < 1) next.passengers = "Indicá la cantidad de pasajeros.";
    }
    if (step === 3) {
      if (!data.requesterName.trim()) next.requesterName = "Ingresá tu nombre.";
      if (!data.requesterPhone.trim()) next.requesterPhone = "Ingresá un teléfono de contacto.";
    }
    if (step === 4 && data.billingType === "empresa") {
      if (!data.billingName.trim()) next.billingName = "Indicá la razón social.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  }
  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  if (step === 7) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-opgreen-200 bg-opgreen-50 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-opgreen-600" />
        <p className="text-lg font-semibold text-opgreen-800">Solicitud recibida (demo)</p>
        <p className="max-w-md text-sm text-opgreen-700">
          Un asesor va a revisar tu solicitud y te va a confirmar el precio y la disponibilidad
          antes de coordinar el traslado. En esta versión de demostración, la solicitud no se
          envió a ningún sistema real.
        </p>
        <button
          type="button"
          onClick={() => {
            setData(initialState);
            setStep(0);
          }}
          className="mt-2 rounded-lg border border-opgreen-300 bg-white px-4 py-2 text-xs font-semibold text-opgreen-700 hover:bg-opgreen-100"
        >
          Cargar otra solicitud de prueba
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progreso */}
      <div className="mb-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-opgreen-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-medium text-slate-500">
          {step === 6 ? "Resumen" : `Paso ${step + 1} de ${totalSteps}: ${stepLabels[step]}`}
        </p>
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Tipo de servicio</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {serviceTypesContent.map((s) => (
                <button
                  key={s.type}
                  type="button"
                  onClick={() => update("serviceType", s.type)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                    data.serviceType === s.type
                      ? "border-petrol-600 bg-petrol-50 text-petrol-800"
                      : "border-slate-200 text-slate-600 hover:border-petrol-300"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
            {errors.serviceType && <p className="mt-1 text-xs text-red-600">{errors.serviceType}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className={labelClass}>Fecha</label>
              <input
                id="date"
                type="date"
                className={inputClass}
                value={data.date}
                onChange={(e) => update("date", e.target.value)}
              />
              {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time" className={labelClass}>Horario aproximado</label>
              <input
                id="time"
                type="time"
                className={inputClass}
                value={data.time}
                onChange={(e) => update("time", e.target.value)}
              />
              {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="origin" className={labelClass}>Origen</label>
            <input
              id="origin"
              type="text"
              placeholder="Ej: Hotel Costanera Suites, Montevideo"
              className={inputClass}
              value={data.origin}
              onChange={(e) => update("origin", e.target.value)}
            />
            {errors.origin && <p className="mt-1 text-xs text-red-600">{errors.origin}</p>}
          </div>
          <div>
            <label htmlFor="destination" className={labelClass}>Destino</label>
            <input
              id="destination"
              type="text"
              placeholder="Ej: Aeropuerto Internacional de Carrasco"
              className={inputClass}
              value={data.destination}
              onChange={(e) => update("destination", e.target.value)}
            />
            {errors.destination && <p className="mt-1 text-xs text-red-600">{errors.destination}</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="passengers" className={labelClass}>Cantidad de pasajeros</label>
            <input
              id="passengers"
              type="number"
              min={1}
              max={20}
              className={inputClass}
              value={data.passengers}
              onChange={(e) => update("passengers", e.target.value)}
            />
            {errors.passengers && <p className="mt-1 text-xs text-red-600">{errors.passengers}</p>}
          </div>
          <div>
            <label htmlFor="luggage" className={labelClass}>Equipaje (opcional)</label>
            <input
              id="luggage"
              type="text"
              placeholder="Ej: 2 valijas grandes y 1 de mano"
              className={inputClass}
              value={data.luggage}
              onChange={(e) => update("luggage", e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="requesterName" className={labelClass}>Nombre y apellido</label>
            <input
              id="requesterName"
              type="text"
              className={inputClass}
              value={data.requesterName}
              onChange={(e) => update("requesterName", e.target.value)}
            />
            {errors.requesterName && <p className="mt-1 text-xs text-red-600">{errors.requesterName}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="requesterPhone" className={labelClass}>Teléfono</label>
              <input
                id="requesterPhone"
                type="tel"
                className={inputClass}
                value={data.requesterPhone}
                onChange={(e) => update("requesterPhone", e.target.value)}
              />
              {errors.requesterPhone && <p className="mt-1 text-xs text-red-600">{errors.requesterPhone}</p>}
            </div>
            <div>
              <label htmlFor="requesterEmail" className={labelClass}>Email (opcional)</label>
              <input
                id="requesterEmail"
                type="email"
                className={inputClass}
                value={data.requesterEmail}
                onChange={(e) => update("requesterEmail", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>¿A nombre de quién se factura?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update("billingType", "personal")}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                  data.billingType === "personal"
                    ? "border-petrol-600 bg-petrol-50 text-petrol-800"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Persona particular
              </button>
              <button
                type="button"
                onClick={() => update("billingType", "empresa")}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                  data.billingType === "empresa"
                    ? "border-petrol-600 bg-petrol-50 text-petrol-800"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Empresa
              </button>
            </div>
          </div>
          {data.billingType === "empresa" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="billingName" className={labelClass}>Razón social</label>
                <input
                  id="billingName"
                  type="text"
                  className={inputClass}
                  value={data.billingName}
                  onChange={(e) => update("billingName", e.target.value)}
                />
                {errors.billingName && <p className="mt-1 text-xs text-red-600">{errors.billingName}</p>}
              </div>
              <div>
                <label htmlFor="billingDocument" className={labelClass}>RUT (opcional)</label>
                <input
                  id="billingDocument"
                  type="text"
                  className={inputClass}
                  value={data.billingDocument}
                  onChange={(e) => update("billingDocument", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <label htmlFor="notes" className={labelClass}>Observaciones (opcional)</label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Cualquier detalle que debamos conocer: cartel con nombre, silla infantil, acceso al edificio, etc."
            className={inputClass}
            value={data.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <dl className="space-y-2">
              <SummaryRow label="Servicio" value={serviceTypesContent.find((s) => s.type === data.serviceType)?.title ?? "—"} />
              <SummaryRow label="Fecha y hora" value={`${data.date || "—"} ${data.time || ""}`} />
              <SummaryRow label="Origen" value={data.origin || "—"} />
              <SummaryRow label="Destino" value={data.destination || "—"} />
              <SummaryRow label="Pasajeros" value={data.passengers || "—"} />
              {data.luggage && <SummaryRow label="Equipaje" value={data.luggage} />}
              <SummaryRow label="Solicitante" value={`${data.requesterName || "—"} · ${data.requesterPhone || "—"}`} />
              <SummaryRow
                label="Facturación"
                value={data.billingType === "empresa" ? `Empresa — ${data.billingName || "—"}` : "Persona particular"}
              />
              {data.notes && <SummaryRow label="Observaciones" value={data.notes} />}
            </dl>
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Esta solicitud será revisada por el equipo de Remistar, que confirmará el precio y la
              disponibilidad antes de coordinar el traslado. Todavía no se trata de un servicio
              confirmado.
            </p>
          </div>
        </div>
      )}

      {/* Navegación */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronLeft className="h-4 w-4" /> Atrás
        </button>

        {step < 6 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-1.5 rounded-lg bg-petrol-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-petrol-800"
          >
            {step === 5 ? "Ver resumen" : "Siguiente"}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(7)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-opgreen-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-opgreen-600"
          >
            Confirmar solicitud (demo)
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}
