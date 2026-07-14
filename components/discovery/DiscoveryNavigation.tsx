import { ArrowLeft, ArrowRight, SkipForward, Save } from "lucide-react";

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
      {/* Acciones menores: navegación secundaria dentro de la sección, deliberadamente discretas. */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1 py-1 text-xs font-medium text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1 py-1 text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            <SkipForward className="h-3.5 w-3.5" />
            Saltar
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Pregunta {currentIndex + 1} de {total}
        </span>
      </div>

      {/* Acciones principales: mismo tamaño/alto, con separación clara de las acciones menores de arriba. */}
      <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row-reverse sm:justify-start">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-opgreen-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-opgreen-700 sm:w-auto"
        >
          {isLast ? "Guardar y revisar sección" : "Guardar y continuar"}
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-petrol-600 bg-petrol-50 px-5 py-3 text-sm font-semibold text-petrol-800 hover:bg-petrol-100 sm:w-auto"
        >
          <Save className="h-4 w-4" />
          Guardar y salir
        </button>
      </div>
    </div>
  );
}
