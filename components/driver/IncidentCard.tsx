import { TriangleAlert } from "lucide-react";
import type { DriverIncident } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { driverIncidentTypeLabels, driverIncidentSeverityMeta, driverIncidentStatusMeta } from "@/lib/driver-status";
import { formatDate } from "@/lib/format";

export function IncidentCard({ incident, onClick }: { incident: DriverIncident; onClick?: () => void }) {
  const severity = driverIncidentSeverityMeta(incident.severity);
  const status = driverIncidentStatusMeta(incident.status);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm active:bg-slate-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <TriangleAlert className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{driverIncidentTypeLabels[incident.type]}</p>
          <p className="text-xs text-slate-400">{formatDate(incident.createdAt)}</p>
        </div>
        <p className="mt-1 text-sm text-slate-600">{incident.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge label={severity.label} tone={severity.tone} />
          <StatusBadge label={status.label} tone={status.tone} />
        </div>
      </div>
    </button>
  );
}
