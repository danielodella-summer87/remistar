import Link from "next/link";
import { Clock, Gauge, AlertTriangle, RotateCcw } from "lucide-react";
import type { DiscoverySection, DiscoverySectionProgress } from "@/lib/discovery/types";
import { DiscoverySectionStatusBadge } from "./DiscoveryStatusBadge";
import { DiscoveryProgressBar } from "./DiscoveryProgressBar";
import { discoveryActions } from "@/lib/discovery/store";

const difficultyLabels: Record<DiscoverySection["difficulty"], string> = {
  simple: "Simple",
  media: "Media",
  compleja: "Compleja",
};

const REOPENABLE_STATUSES: DiscoverySectionProgress["status"][] = ["confirmada", "lista_para_revisar"];

export function DiscoverySectionCard({ section, progress }: { section: DiscoverySection; progress: DiscoverySectionProgress }) {
  const canReopen = REOPENABLE_STATUSES.includes(progress.status);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-petrol-300 hover:shadow-md">
      <Link href={`/app/relevamiento/${section.slug}`} className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sección {section.order}</p>
            <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{section.subtitle}</p>
          </div>
          <DiscoverySectionStatusBadge status={progress.status} />
        </div>

        <DiscoveryProgressBar percent={progress.percent} />

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3 w-3" /> {difficultyLabels[section.difficulty]}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> ~{section.estimatedMinutes} min
          </span>
          <span>
            {progress.answered}/{progress.total} preguntas
          </span>
          {progress.criticalPending > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-amber-600">
              <AlertTriangle className="h-3 w-3" /> {progress.criticalPending} crítica{progress.criticalPending > 1 ? "s" : ""} sin responder
            </span>
          )}
        </div>
      </Link>

      {canReopen && (
        <button
          type="button"
          onClick={() => discoveryActions.reopenSection(section.id)}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
        >
          <RotateCcw className="h-3 w-3" />
          Reabrir sección
        </button>
      )}
    </div>
  );
}
