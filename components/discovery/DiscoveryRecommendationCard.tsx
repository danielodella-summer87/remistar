import { Sparkles, Check, X, Clock3 } from "lucide-react";
import type { DiscoveryRecommendation, DiscoveryRecommendationDecision } from "@/lib/discovery/types";
import { DiscoveryEditLink } from "./DiscoveryEditLink";

const decisionLabels: Record<DiscoveryRecommendationDecision, string> = {
  sugerida: "Sugerida",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  revisar_despues: "Revisar después",
};

const decisionTone: Record<DiscoveryRecommendationDecision, string> = {
  sugerida: "bg-slate-100 text-slate-600 ring-slate-200",
  aceptada: "bg-opgreen-50 text-opgreen-700 ring-opgreen-200",
  rechazada: "bg-red-50 text-red-700 ring-red-200",
  revisar_despues: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function DiscoveryRecommendationCard({
  recommendation,
  onDecide,
}: {
  recommendation: DiscoveryRecommendation;
  onDecide?: (decision: DiscoveryRecommendationDecision) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-petrol-700">
          <Sparkles className="h-3.5 w-3.5" /> Recomendación
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${decisionTone[recommendation.decision]}`}>
          {decisionLabels[recommendation.decision]}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{recommendation.title}</h3>
      <dl className="mt-2 space-y-1.5 text-xs text-slate-600">
        <div>
          <dt className="font-medium text-slate-500">Qué se detectó</dt>
          <dd>{recommendation.finding}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Por qué importa</dt>
          <dd>{recommendation.why}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Propuesta</dt>
          <dd>{recommendation.proposal}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Módulos afectados</dt>
          <dd>{recommendation.modules.join(", ")}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap gap-3">
          {recommendation.questionIds.map((qid) => (
            <DiscoveryEditLink key={qid} questionId={qid} label="Revisar esta respuesta" />
          ))}
        </div>

        {onDecide && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onDecide("aceptada")}
              className="inline-flex items-center gap-1 rounded-lg border border-opgreen-300 bg-opgreen-50 px-2.5 py-1.5 text-xs font-medium text-opgreen-700 hover:bg-opgreen-100"
            >
              <Check className="h-3.5 w-3.5" /> Aceptar
            </button>
            <button
              type="button"
              onClick={() => onDecide("rechazada")}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              <X className="h-3.5 w-3.5" /> Rechazar
            </button>
            <button
              type="button"
              onClick={() => onDecide("revisar_despues")}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <Clock3 className="h-3.5 w-3.5" /> Revisar después
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
