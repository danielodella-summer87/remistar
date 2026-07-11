"use client";

import { useState } from "react";
import { HelpCircle, StickyNote, Sparkles } from "lucide-react";
import type { DiscoveryAnswer, DiscoveryAnswerValue, DiscoveryQuestion } from "@/lib/discovery/types";
import { DiscoveryTip, DiscoveryWhy } from "./DiscoveryTip";
import { DiscoveryAnswerRenderer } from "./DiscoveryAnswerRenderer";
import { DiscoveryImportanceBadge, DiscoveryStatusBadge } from "./DiscoveryStatusBadge";

export function DiscoveryQuestionCard({
  question,
  answer,
  meetingMode = false,
  onChangeValue,
  onMarkUnknown,
  onNote,
}: {
  question: DiscoveryQuestion;
  answer?: DiscoveryAnswer;
  meetingMode?: boolean;
  onChangeValue: (value: DiscoveryAnswerValue, otherText?: string) => void;
  onMarkUnknown: () => void;
  onNote: (text: string) => void;
}) {
  const [showNote, setShowNote] = useState(Boolean(answer?.note));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <DiscoveryImportanceBadge importance={question.importance} />
        <DiscoveryStatusBadge status={answer?.status ?? "sin_responder"} />
      </div>

      <h2 className="text-lg font-semibold text-slate-900">{question.title}</h2>
      <p className="mt-1.5 text-sm text-slate-700">{question.prompt}</p>

      {!meetingMode && question.tip && (
        <div className="mt-3">
          <DiscoveryTip text={question.tip} />
        </div>
      )}
      {!meetingMode && question.why && (
        <div className="mt-2">
          <DiscoveryWhy text={question.why} />
        </div>
      )}

      <div className="mt-4">
        <DiscoveryAnswerRenderer question={question} value={answer?.value} otherText={answer?.otherText} onChange={onChangeValue} />
      </div>

      {question.recommendationPreview && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-opgreen-50 px-3 py-2.5 text-xs text-opgreen-800 ring-1 ring-inset ring-opgreen-100">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold">Recomendación preliminar: </span>
            {question.recommendationPreview}
          </span>
        </div>
      )}

      {question.affectsModules && question.affectsModules.length > 0 && (
        <p className="mt-3 text-[11px] text-slate-400">Esta respuesta afecta: {question.affectsModules.join(", ")}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onMarkUnknown}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          No lo sabemos todavía
        </button>
        <button
          type="button"
          onClick={() => setShowNote((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <StickyNote className="h-3.5 w-3.5" />
          {showNote ? "Ocultar nota" : "Agregar nota de Daniel"}
        </button>
      </div>

      {showNote && (
        <textarea
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-petrol-400 focus:outline-none focus:ring-2 focus:ring-petrol-100"
          rows={2}
          placeholder="Nota interna, no se la mostramos a Gonzalo..."
          defaultValue={answer?.note ?? ""}
          onBlur={(e) => onNote(e.target.value)}
        />
      )}
    </div>
  );
}
