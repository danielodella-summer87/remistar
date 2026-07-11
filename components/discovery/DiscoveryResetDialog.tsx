"use client";

import { useState } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

export function DiscoveryResetDialog({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Restablecer relevamiento demo
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center gap-2 text-amber-600">
              <TriangleAlert className="h-5 w-5" />
              <h3 className="text-sm font-semibold text-slate-900">Restablecer relevamiento demo</h3>
            </div>
            <p className="text-sm text-slate-600">
              Se van a borrar todas las respuestas, notas y decisiones cargadas en este navegador. Esta acción no afecta
              ningún otro dato demo de la aplicación y no se puede deshacer.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Sí, restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
