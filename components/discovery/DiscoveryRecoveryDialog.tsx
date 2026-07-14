"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import {
  fetchSessionForRecovery,
  hasActiveLocalDiscovery,
  applyRecoveredSession,
  type RecoveryError,
} from "@/lib/discovery/recovery";
import type { DiscoverySessionDetailResponse } from "@/lib/discovery/session-detail-api-types";

const ERROR_MESSAGES: Record<RecoveryError, string> = {
  invalid_uuid: "Ese id no tiene formato de UUID válido.",
  not_found: "No existe ninguna sesión con ese id.",
  network_error: "No se pudo conectar con el servidor. Intentá de nuevo.",
};

/**
 * Recuperación manual de una sesión ya existente en Supabase (por id). Busca primero y muestra
 * identidad + cantidad de respuestas antes de aplicar nada; si hay un relevamiento local activo,
 * exige una confirmación explícita adicional antes de sobrescribirlo.
 */
export function DiscoveryRecoveryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<DiscoverySessionDetailResponse | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

  if (!open) return null;

  const localActive = preview ? hasActiveLocalDiscovery() : false;

  function reset() {
    setSessionId("");
    setLoading(false);
    setError(null);
    setPreview(null);
    setConfirmOverwrite(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPreview(null);
    setLoading(true);
    const result = await fetchSessionForRecovery(sessionId);
    setLoading(false);
    if (!result.ok) {
      setError(ERROR_MESSAGES[result.error]);
      return;
    }
    setPreview(result.detail);
  }

  function handleConfirm() {
    if (!preview) return;
    if (localActive && !confirmOverwrite) return;
    const { skippedUnknownAnswers } = applyRecoveredSession(preview);
    if (skippedUnknownAnswers.length > 0) {
      console.warn("Recuperación: se ignoraron questionIds que no existen en el cuestionario actual:", skippedUnknownAnswers);
    }
    handleClose();
    if (preview.currentSectionSlug) {
      router.push(`/app/relevamiento/${preview.currentSectionSlug}`);
    } else {
      router.push("/app/relevamiento");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center gap-2 text-slate-700">
          <Search className="h-5 w-5" />
          <h3 className="text-sm font-semibold text-slate-900">Recuperar consulta existente</h3>
        </div>
        <p className="text-sm text-slate-600">Ingresá el id de la sesión guardada en Supabase para continuarla en este navegador.</p>

        <form className="mt-4 space-y-3" onSubmit={handleSearch}>
          <label className="block text-xs font-medium text-slate-600">
            Id de la sesión
            <input
              type="text"
              value={sessionId}
              onChange={(e) => {
                setSessionId(e.target.value);
                setPreview(null);
                setError(null);
              }}
              placeholder="ej: 10ff2003-1280-420e-b53c-cc8da51bcc1e"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-petrol-500 focus:outline-none focus:ring-1 focus:ring-petrol-500"
              autoFocus
            />
          </label>

          {!preview && (
            <button
              type="submit"
              disabled={loading || !sessionId.trim()}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Buscar
            </button>
          )}

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          {preview && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">{preview.intervieweeName}</p>
              <p className="text-slate-600">{preview.companyName}</p>
              <p className="mt-1 text-xs text-slate-500">
                {preview.answers.length} respuestas guardadas · estado: {preview.status}
              </p>
            </div>
          )}

          {preview && localActive && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <p className="font-medium">Ya hay un relevamiento local activo en este navegador.</p>
              <p className="mt-1">Cargar esta sesión lo reemplaza por completo. Esta acción no se puede deshacer.</p>
              <label className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={confirmOverwrite}
                  onChange={(e) => setConfirmOverwrite(e.target.checked)}
                />
                Sí, reemplazar mi relevamiento local por esta sesión.
              </label>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            {preview && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={localActive && !confirmOverwrite}
                className="rounded-lg bg-petrol-600 px-3 py-2 text-sm font-semibold text-white hover:bg-petrol-700 disabled:opacity-50"
              >
                Confirmar carga
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
