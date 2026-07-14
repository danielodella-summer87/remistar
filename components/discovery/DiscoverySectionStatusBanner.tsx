import { CheckCircle2, RotateCcw, ListChecks, ShieldCheck } from "lucide-react";
import type { DiscoverySectionStatus } from "@/lib/discovery/types";

function formatReopenedAt(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("es-UY", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

/**
 * Banner de estado para una sección ya completada: deja claro si está confirmada (y que confirmar no es
 * definitivo) o si fue reabierta (y que las respuestas anteriores se conservan). Todas las acciones de acá
 * son secundarias — nunca compiten con el único CTA verde principal de la pantalla.
 */
export function DiscoverySectionStatusBanner({
  status,
  reopenedAt,
  onReopen,
  onConfirmAgain,
  onMarkListaParaRevisar,
}: {
  status: DiscoverySectionStatus;
  reopenedAt?: string;
  onReopen: () => void;
  onConfirmAgain: () => void;
  onMarkListaParaRevisar: () => void;
}) {
  if (status === "confirmada") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-opgreen-50 px-3 py-2.5 text-xs text-opgreen-700 ring-1 ring-inset ring-opgreen-100">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Confirmada por ahora. Puede reabrirse en cualquier momento.
        </span>
        <button
          type="button"
          onClick={onReopen}
          className="inline-flex items-center gap-1.5 rounded-lg border border-opgreen-300 bg-white px-3 py-1.5 text-xs font-medium text-opgreen-700 hover:bg-opgreen-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reabrir sección
        </button>
      </div>
    );
  }

  if (status === "reabierta") {
    return (
      <div className="space-y-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
        <p className="flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5 shrink-0" />
          Esta sección fue reabierta. Las respuestas anteriores se conservan y pueden revisarse.
          {reopenedAt && <span className="text-amber-600">— {formatReopenedAt(reopenedAt)}</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onMarkListaParaRevisar}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
          >
            <ListChecks className="h-3.5 w-3.5" />
            Marcar como lista para revisar
          </button>
          <button
            type="button"
            onClick={onConfirmAgain}
            className="inline-flex items-center gap-1.5 rounded-lg border border-opgreen-300 bg-white px-3 py-1.5 text-xs font-medium text-opgreen-700 hover:bg-opgreen-100"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Confirmar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (status === "lista_para_revisar") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-petrol-50 px-3 py-2.5 text-xs text-petrol-700 ring-1 ring-inset ring-petrol-100">
        <span className="flex items-center gap-1.5">
          <ListChecks className="h-3.5 w-3.5 shrink-0" />
          Todas las preguntas visibles están respondidas. Todavía no fue confirmada.
        </span>
        <button
          type="button"
          onClick={onReopen}
          className="inline-flex items-center gap-1.5 rounded-lg border border-petrol-300 bg-white px-3 py-1.5 text-xs font-medium text-petrol-700 hover:bg-petrol-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reabrir sección
        </button>
      </div>
    );
  }

  return null;
}
