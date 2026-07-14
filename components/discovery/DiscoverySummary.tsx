"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { useDiscoveryState } from "@/lib/discovery/store";
import { buildExportData } from "@/lib/discovery/export";
import { discoverySections } from "@/lib/discovery/sections";
import { DiscoveryExportActions } from "./DiscoveryExportActions";
import { DiscoveryRecommendationCard } from "./DiscoveryRecommendationCard";
import { DiscoveryContradictionCard } from "./DiscoveryContradictionCard";
import { DiscoveryNotes } from "./DiscoveryNotes";
import { DiscoveryEditLink } from "./DiscoveryEditLink";
import { DiscoverySectionStatusBadge } from "./DiscoveryStatusBadge";
import { discoveryActions } from "@/lib/discovery/store";
import { syncConfirmedSectionsToSupabase } from "@/lib/discovery/sync";

type FilterKey = "confirmados" | "pendientes" | "supuestos" | "criticos" | "recomendaciones" | "contradicciones";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "confirmados", label: "Confirmados" },
  { key: "pendientes", label: "Pendientes" },
  { key: "supuestos", label: "Supuestos" },
  { key: "criticos", label: "Críticos" },
  { key: "recomendaciones", label: "Recomendaciones" },
  { key: "contradicciones", label: "Contradicciones" },
];

export function DiscoverySummary() {
  const state = useDiscoveryState();
  const data = useMemo(() => buildExportData(state), [state]);
  const [active, setActive] = useState<Set<FilterKey>>(new Set());

  function toggle(key: FilterKey) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const show = (key: FilterKey) => active.size === 0 || active.has(key);
  const criticalPending = data.pending.filter((p) => p.importance === "critico");
  const modulesAffected = Array.from(new Set(data.recommendations.flatMap((r) => r.modules))).sort();
  const completedSections = data.progress.bySection
    .filter((s) => s.status === "confirmada" || s.status === "reabierta" || s.status === "lista_para_revisar")
    .map((s) => ({ section: discoverySections.find((sec) => sec.id === s.sectionId)!, progress: s }))
    .filter((x) => x.section);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => toggle(f.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active.has(f.key) ? "border-petrol-500 bg-petrol-50 text-petrol-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <DiscoveryExportActions data={data} />
      </div>

      {/* 1. Perfil actual */}
      <SummarySection title="Perfil actual de Remistar">
        {data.confirmed.filter((c) => c.section === "La empresa hoy").length === 0 ? (
          <Empty text="Todavía no se confirmó información básica de la empresa." />
        ) : (
          <FactList items={data.confirmed.filter((c) => c.section === "La empresa hoy")} />
        )}
      </SummarySection>

      {/* Estado de las secciones: confirmar no bloquea, reabrir se puede desde acá */}
      <SummarySection title="Estado de las secciones" count={completedSections.length}>
        {completedSections.length === 0 ? (
          <Empty text="Todavía no hay secciones confirmadas ni listas para revisar." />
        ) : (
          <ul className="space-y-2">
            {completedSections.map(({ section, progress }) => (
              <li key={section.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Link href={`/app/relevamiento/${section.slug}`} className="text-sm font-medium text-slate-800 hover:underline">
                    {section.title}
                  </Link>
                  <DiscoverySectionStatusBadge status={progress.status} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {progress.status === "reabierta" ? (
                    <button
                      type="button"
                      onClick={() => {
                        discoveryActions.confirmSection(section.id, true);
                        void syncConfirmedSectionsToSupabase();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-opgreen-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-opgreen-700 hover:bg-opgreen-100"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      Confirmar de nuevo
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        discoveryActions.reopenSection(section.id);
                        void syncConfirmedSectionsToSupabase();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reabrir sección
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </SummarySection>

      {/* 2. Procesos confirmados */}
      {show("confirmados") && (
        <SummarySection title="Procesos confirmados" count={data.confirmed.length}>
          {data.confirmed.length === 0 ? <Empty text="Todavía no hay respuestas confirmadas." /> : <FactList items={data.confirmed} />}
        </SummarySection>
      )}

      {/* 3. Decisiones aceptadas */}
      {show("recomendaciones") && (
        <SummarySection title="Decisiones aceptadas" count={data.decisionsAccepted.length}>
          {data.decisionsAccepted.length === 0 ? (
            <Empty text="Todavía no se aceptó ninguna recomendación." />
          ) : (
            <ul className="space-y-1.5 text-sm text-slate-700">
              {data.decisionsAccepted.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>{d.title}</span>
                  <span className="flex flex-wrap gap-2">
                    {d.questionIds.map((qid) => (
                      <DiscoveryEditLink key={qid} questionId={qid} label="Revisar esta respuesta" />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SummarySection>
      )}

      {/* 4. Supuestos */}
      {show("supuestos") && (
        <SummarySection title="Supuestos (marcados como 'no lo sabemos todavía')" count={data.assumptions.length}>
          {data.assumptions.length === 0 ? (
            <Empty text="No hay supuestos pendientes de confirmar." />
          ) : (
            <ul className="space-y-1.5 text-sm text-slate-700">
              {data.assumptions.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <span className="text-slate-400">[{a.section}]</span> {a.question}
                  </span>
                  <DiscoveryEditLink questionId={a.id} label="Revisar esta respuesta" />
                </li>
              ))}
            </ul>
          )}
        </SummarySection>
      )}

      {/* 5. Preguntas pendientes */}
      {show("pendientes") && (
        <SummarySection title="Preguntas pendientes" count={data.pending.length}>
          {data.pending.length === 0 ? (
            <Empty text="No quedan preguntas pendientes." />
          ) : (
            <ul className="space-y-1.5 text-sm text-slate-700">
              {(active.has("criticos") ? criticalPending : data.pending).map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <span className="text-slate-400">[{p.section}]</span> {p.question}{" "}
                    <span className="text-[11px] text-amber-600">({p.importance})</span>
                  </span>
                  <DiscoveryEditLink questionId={p.id} label="Responder esta pregunta" />
                </li>
              ))}
            </ul>
          )}
        </SummarySection>
      )}

      {/* 6. Contradicciones */}
      {show("contradicciones") && (
        <SummarySection title="Contradicciones detectadas" count={data.contradictions.length}>
          {data.contradictions.length === 0 ? (
            <Empty text="No se detectaron contradicciones con las respuestas actuales." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.contradictions.map((c) => (
                <DiscoveryContradictionCard key={c.id} contradiction={c} />
              ))}
            </div>
          )}
        </SummarySection>
      )}

      {/* 7. Recomendaciones */}
      {show("recomendaciones") && (
        <SummarySection title="Recomendaciones" count={data.recommendations.length}>
          {data.recommendations.length === 0 ? (
            <Empty text="Todavía no se dispararon recomendaciones." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.recommendations.map((r) => (
                <DiscoveryRecommendationCard key={r.id} recommendation={r} onDecide={(d) => discoveryActions.decideRecommendation(r.id, d)} />
              ))}
            </div>
          )}
        </SummarySection>
      )}

      {/* Notas de Daniel */}
      <SummarySection title="Notas de Daniel">
        <DiscoveryNotes confirmed={data.confirmed} />
      </SummarySection>

      {/* 8. Módulos afectados */}
      <SummarySection title="Módulos afectados">
        {modulesAffected.length === 0 ? (
          <Empty text="Todavía no hay módulos afectados identificados." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {modulesAffected.map((m) => (
              <span key={m} className="rounded-full bg-petrol-50 px-2.5 py-1 text-xs font-medium text-petrol-700 ring-1 ring-inset ring-petrol-200">
                {m}
              </span>
            ))}
          </div>
        )}
      </SummarySection>

      {/* 9. Impacto sobre el MVP */}
      <SummarySection title="Impacto sobre el MVP">
        <p className="text-sm text-slate-600">
          Quedan <span className="font-semibold text-slate-900">{criticalPending.length}</span> preguntas críticas sin responder de un total de{" "}
          <span className="font-semibold text-slate-900">{data.progress.criticalPending + (data.progress.totalQuestions - data.progress.answeredQuestions - data.progress.criticalPending)}</span>{" "}
          pendientes. Mientras haya críticas sin responder, el diseño de esos procesos debe tratarse como hipótesis, no como definición final.
        </p>
      </SummarySection>

      {/* 10. Próximos pasos */}
      <SummarySection title="Próximos pasos">
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
          <li>Revisar con Gonzalo las preguntas críticas pendientes.</li>
          <li>Resolver las contradicciones detectadas antes de avanzar con el diseño de esos módulos.</li>
          <li>Aceptar o rechazar explícitamente cada recomendación sugerida.</li>
          <li>Repetir este resumen en la próxima consulta para medir el avance.</li>
        </ul>
      </SummarySection>
    </div>
  );
}

function SummarySection({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        {title}
        {typeof count === "number" && <span className="ml-2 text-xs font-normal text-slate-400">({count})</span>}
      </h2>
      {children}
    </section>
  );
}

function FactList({ items }: { items: ReturnType<typeof buildExportData>["confirmed"] }) {
  return (
    <ul className="space-y-1.5 text-sm text-slate-700">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-start justify-between gap-2">
          <span>
            <span className="text-slate-400">[{item.section}]</span> <span className="font-medium">{item.question}:</span> {item.answer}
          </span>
          <DiscoveryEditLink questionId={item.id} />
        </li>
      ))}
    </ul>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-slate-400">{text}</p>;
}
