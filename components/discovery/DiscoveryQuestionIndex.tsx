import type { DiscoveryAnswer, DiscoveryQuestion, DiscoveryStatus } from "@/lib/discovery/types";

const STATUS_LABEL: Record<DiscoveryStatus, string> = {
  sin_responder: "Pendiente",
  respondida: "Respondida",
  requiere_revision: "Requiere revisión",
  pendiente_confirmar: "No lo sabemos todavía",
};

/** Tono moderado a propósito: no debe leerse como un botón de acción principal (eso lo reserva "Guardar y continuar"). */
const DOT_TONE: Record<DiscoveryStatus, string> = {
  respondida: "border-opgreen-300 bg-opgreen-50 text-opgreen-700",
  requiere_revision: "border-amber-400 bg-amber-50 text-amber-700",
  pendiente_confirmar: "border-dashed border-slate-400 bg-slate-100 text-slate-500",
  sin_responder: "border-slate-300 bg-white text-slate-500",
};

/**
 * Índice de preguntas de la sección: deja ver de un vistazo cuántas preguntas hay, cuál está activa,
 * cuáles están respondidas/pendientes/marcadas, y permite saltar directamente a cualquiera. Guarda la
 * respuesta actual (vía la misma función central de autoguardado) antes de saltar.
 */
export function DiscoveryQuestionIndex({
  questions,
  answers,
  currentQuestionId,
  contradictionQuestionIds,
  onJump,
}: {
  questions: DiscoveryQuestion[];
  answers: Record<string, DiscoveryAnswer>;
  currentQuestionId: string;
  contradictionQuestionIds?: Set<string>;
  onJump: (index: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="mb-2 text-[11px] font-medium text-slate-500">
        {questions.length} pregunta{questions.length === 1 ? "" : "s"} en esta sección — tocá cualquier número para ir directo a esa pregunta.
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => {
          const status: DiscoveryStatus = answers[q.id]?.status ?? "sin_responder";
          const isCurrent = q.id === currentQuestionId;
          const hasContradiction = contradictionQuestionIds?.has(q.id) ?? false;
          const label = `Pregunta ${i + 1} · ${STATUS_LABEL[status]}${hasContradiction ? " · Con contradicción detectada" : ""}${
            isCurrent ? " · Pregunta actual" : ""
          }`;

          return (
            <button
              key={q.id}
              type="button"
              title={label}
              aria-label={label}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onJump(i)}
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-petrol-500 focus-visible:ring-offset-1 ${
                DOT_TONE[status]
              } ${isCurrent ? "border-petrol-600 ring-2 ring-petrol-500 ring-offset-1" : ""}`}
            >
              {i + 1}
              {hasContradiction && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white bg-red-500" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
