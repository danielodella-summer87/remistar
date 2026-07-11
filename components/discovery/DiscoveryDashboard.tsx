"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Users2, CheckCircle2, AlertTriangle, ListChecks, FileText } from "lucide-react";
import { discoverySections } from "@/lib/discovery/sections";
import { computeProgress } from "@/lib/discovery/progress";
import { computeRecommendations, computeContradictions } from "@/lib/discovery/rules";
import { useDiscoveryState, discoveryActions } from "@/lib/discovery/store";
import { buildExportData } from "@/lib/discovery/export";
import { DiscoverySectionCard } from "./DiscoverySectionCard";
import { DiscoveryProgressBar } from "./DiscoveryProgressBar";
import { DiscoveryResetDialog } from "./DiscoveryResetDialog";
import { DiscoveryExportActions } from "./DiscoveryExportActions";

function formatDate(iso?: string) {
  if (!iso) return "Todavía sin actividad";
  return new Date(iso).toLocaleString("es-UY", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function DiscoveryDashboard() {
  const state = useDiscoveryState();
  const progress = useMemo(
    () => computeProgress(state.answers, state.confirmedSections, state.recommendationDecisions),
    [state.answers, state.confirmedSections, state.recommendationDecisions]
  );
  const recommendations = useMemo(
    () => computeRecommendations(state.answers, state.recommendationDecisions).filter((r) => r.detected),
    [state.answers, state.recommendationDecisions]
  );
  const contradictions = useMemo(() => computeContradictions(state.answers).filter((c) => c.detected), [state.answers]);
  const exportData = useMemo(
    () => buildExportData(state),
    [state]
  );

  const nextSection = useMemo(() => {
    const sorted = discoverySections.slice().sort((a, b) => a.order - b.order);
    const sectionProgress = new Map(progress.bySection.map((s) => [s.sectionId, s]));
    return (
      sorted.find((s) => {
        const p = sectionProgress.get(s.id);
        return p && p.status !== "confirmada" && p.status !== "lista_para_revisar";
      }) ?? sorted[0]
    );
  }, [progress.bySection]);

  const hasStarted = progress.answeredQuestions > 0;
  const criticalPendingTop = exportData.pending.filter((p) => p.importance === "critico").slice(0, 5);
  const complementaryPending = exportData.pending.filter((p) => p.importance === "complementario").slice(0, 4);

  return (
    <div className="space-y-8">
      {/* 1. Estado general + 2. CTA principal */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-slate-600">Progreso general del relevamiento</p>
              <span className="text-2xl font-semibold text-slate-900">{progress.percent}%</span>
            </div>
            <div className="mt-2">
              <DiscoveryProgressBar percent={progress.percent} />
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row lg:flex-col">
            <Link
              href={`/app/relevamiento/${nextSection.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-opgreen-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-opgreen-700"
            >
              {hasStarted ? "Continuar relevamiento" : "Iniciar modo reunión"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3 lg:grid-cols-6">
          <Metric label="Secciones completadas" value={`${progress.sectionsCompleted}/${progress.sectionsTotal}`} icon={CheckCircle2} />
          <Metric label="Secciones pendientes" value={String(progress.sectionsTotal - progress.sectionsCompleted)} icon={ListChecks} />
          <Metric label="Críticas sin responder" value={String(progress.criticalPending)} icon={AlertTriangle} tone={progress.criticalPending > 0 ? "warning" : undefined} />
          <Metric label="Contradicciones" value={String(progress.contradictionsCount)} icon={AlertTriangle} tone={progress.contradictionsCount > 0 ? "danger" : undefined} />
          <Metric label="Decisiones pendientes" value={String(progress.pendingDecisions)} icon={Users2} />
          <Metric label="Última actualización" value={formatDate(progress.lastUpdatedAt)} icon={FileText} small />
        </dl>
      </section>

      {/* 3. Secciones */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Secciones del relevamiento</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {discoverySections
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((section) => {
              const sectionProgress = progress.bySection.find((s) => s.sectionId === section.id)!;
              return <DiscoverySectionCard key={section.id} section={section} progress={sectionProgress} />;
            })}
        </div>
      </section>

      {/* 4. Resumen de hallazgos */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Resumen de hallazgos</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <span className="font-medium text-slate-900">{exportData.confirmed.length}</span> hechos confirmados
            </li>
            <li>
              <span className="font-medium text-slate-900">{exportData.assumptions.length}</span> supuestos marcados como &quot;no lo sabemos todavía&quot;
            </li>
            <li>
              <span className="font-medium text-slate-900">{recommendations.length}</span> recomendaciones disparadas
            </li>
            <li>
              <span className="font-medium text-slate-900">{contradictions.length}</span> temas a revisar por contradicción
            </li>
          </ul>
          <Link href="/app/relevamiento/resumen" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-petrol-700 hover:underline">
            Ver resumen completo <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* 5. Próximas decisiones */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Próximas decisiones</h2>
          <div className="space-y-3 text-xs">
            <div>
              <p className="mb-1 font-medium text-slate-700">Conviene definir ahora</p>
              {criticalPendingTop.length === 0 ? (
                <p className="text-slate-400">No hay críticas pendientes.</p>
              ) : (
                <ul className="list-inside list-disc space-y-0.5 text-slate-600">
                  {criticalPendingTop.map((p) => (
                    <li key={p.id}>{p.question}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="mb-1 font-medium text-slate-700">Puede esperar</p>
              {complementaryPending.length === 0 ? (
                <p className="text-slate-400">Nada complementario pendiente.</p>
              ) : (
                <ul className="list-inside list-disc space-y-0.5 text-slate-600">
                  {complementaryPending.map((p) => (
                    <li key={p.id}>{p.question}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <Link href="/app/relevamiento/pendientes" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-petrol-700 hover:underline">
            Ver todos los pendientes <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* 6. Acciones secundarias */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Acciones secundarias</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/app/relevamiento/resumen" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <FileText className="h-3.5 w-3.5" /> Ver resumen
          </Link>
          <Link href="/app/relevamiento/pendientes" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
            <ListChecks className="h-3.5 w-3.5" /> Ver pendientes
          </Link>
          <DiscoveryResetDialog onConfirm={discoveryActions.resetDemo} />
          <DiscoveryExportActions data={exportData} />
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  tone,
  small,
}: {
  label: string;
  value: string;
  icon: typeof CheckCircle2;
  tone?: "warning" | "danger";
  small?: boolean;
}) {
  const toneClass = tone === "danger" ? "text-red-600" : tone === "warning" ? "text-amber-600" : "text-slate-900";
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={`mt-0.5 font-semibold ${small ? "text-xs" : "text-lg"} ${toneClass}`}>{value}</p>
    </div>
  );
}
