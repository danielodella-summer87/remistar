import { ArrowLeft, ArrowRight, SkipForward, LogOut } from "lucide-react";

export function DiscoveryNavigation({
  currentIndex,
  total,
  isLast,
  onPrev,
  onNext,
  onSkip,
  onExit,
}: {
  currentIndex: number;
  total: number;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
  onExit: () => void;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-6 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <SkipForward className="h-4 w-4" />
            Saltar
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Pregunta {currentIndex + 1} de {total}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Guardar y salir
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 rounded-lg bg-opgreen-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opgreen-700"
          >
            {isLast ? "Guardar y finalizar sección" : "Guardar y continuar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
