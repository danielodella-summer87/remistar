import { Lightbulb } from "lucide-react";
import type { Recommendation } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import type { Tone } from "@/lib/status";

const priorityTone: Record<Recommendation["priority"], Tone> = {
  alta: "danger",
  media: "warning",
  baja: "neutral",
};

const priorityLabel: Record<Recommendation["priority"], string> = {
  alta: "Prioridad alta",
  media: "Prioridad media",
  baja: "Prioridad baja",
};

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="flex gap-3 rounded-lg border border-petrol-100 bg-petrol-50/40 p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-petrol-100 text-petrol-700">
        <Lightbulb className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-900">{recommendation.title}</p>
          <StatusBadge label={priorityLabel[recommendation.priority]} tone={priorityTone[recommendation.priority]} />
        </div>
        <p className="mt-1 text-xs text-slate-500">Detectado en: {recommendation.detectedFrom}</p>
        <p className="mt-1.5 text-sm text-slate-600">{recommendation.reason}</p>
        <p className="mt-2 text-xs font-medium text-petrol-700">
          Acción sugerida: <span className="font-normal text-slate-600">{recommendation.suggestedAction}</span>
        </p>
        {recommendation.missingData && (
          <p className="mt-1 text-xs text-amber-700">Falta información: {recommendation.missingData}</p>
        )}
        <p className="mt-2 text-[11px] italic text-slate-400">
          Recomendación demo — construida con reglas simples sobre datos mock, sin IA real.
        </p>
      </div>
    </div>
  );
}
