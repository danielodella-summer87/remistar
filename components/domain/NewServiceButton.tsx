"use client";

import { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { clients } from "@/lib/mock";
import { serviceTypesContent } from "@/lib/public-content";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100";
const labelClass = "mb-1 block text-xs font-medium text-slate-700";

export function NewServiceButton() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function close() {
    setOpen(false);
    setTimeout(() => setSubmitted(false), 200);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-petrol-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-petrol-800"
      >
        <Plus className="h-4 w-4" />
        Nuevo servicio
      </button>

      <DetailDrawer open={open} onClose={close} title="Nuevo servicio" subtitle="Carga rápida — demo">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-opgreen-200 bg-opgreen-50 p-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-opgreen-600" />
            <p className="text-sm font-semibold text-opgreen-800">Servicio registrado (demo)</p>
            <p className="text-xs text-opgreen-700">
              En esta versión de demostración, el servicio no se agrega a los datos mock ni se
              persiste en ningún lado.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-1 rounded-lg border border-opgreen-300 bg-white px-4 py-2 text-xs font-semibold text-opgreen-700 hover:bg-opgreen-100"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className={labelClass}>Cliente</label>
              <select className={inputClass} required defaultValue="">
                <option value="" disabled>Seleccioná un cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tipo de servicio</label>
              <select className={inputClass} required defaultValue="">
                <option value="" disabled>Seleccioná un tipo</option>
                {serviceTypesContent.map((s) => (
                  <option key={s.type} value={s.type}>{s.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Fecha</label>
                <input type="date" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hora</label>
                <input type="time" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Origen</label>
              <input type="text" required className={inputClass} placeholder="Punto de partida" />
            </div>
            <div>
              <label className={labelClass}>Destino</label>
              <input type="text" required className={inputClass} placeholder="Punto de llegada" />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-petrol-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-petrol-800"
            >
              Registrar servicio (demo)
            </button>
          </form>
        )}
      </DetailDrawer>
    </>
  );
}
