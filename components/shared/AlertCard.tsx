import { AlertTriangle } from "lucide-react";
import type { Alert } from "@/lib/types";
import { alertSeverityMeta, alertStatusMeta, alertModuleLabels } from "@/lib/status";
import { relativeDayLabel } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const severityIconClasses: Record<Alert["severity"], string> = {
  critica: "text-red-600 bg-red-50",
  alta: "text-amber-600 bg-amber-50",
  media: "text-sky-600 bg-sky-50",
  baja: "text-slate-500 bg-slate-100",
};

export function AlertCard({ alert }: { alert: Alert }) {
  const severity = alertSeverityMeta(alert.severity);
  const status = alertStatusMeta(alert.status);
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${severityIconClasses[alert.severity]}`}
      >
        <AlertTriangle className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-900">{alert.title}</p>
          <StatusBadge label={severity.label} tone={severity.tone} />
          <StatusBadge label={status.label} tone={status.tone} />
        </div>
        <p className="mt-1 text-sm text-slate-600">{alert.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
            {alertModuleLabels[alert.module]}
          </span>
          {alert.relatedEntity && <span>{alert.relatedEntity}</span>}
          <span>{relativeDayLabel(alert.createdAt)}</span>
          <span>Responsable: {alert.responsible}</span>
        </div>
        <p className="mt-2 text-xs font-medium text-petrol-700">
          Acción sugerida: <span className="font-normal text-slate-600">{alert.suggestedAction}</span>
        </p>
      </div>
    </div>
  );
}
