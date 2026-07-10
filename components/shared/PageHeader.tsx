import type { ReactNode } from "react";
import { DemoBadge } from "./DemoBadge";

export function PageHeader({
  title,
  description,
  primaryAction,
  secondaryContent,
  showDemoBadge = true,
}: {
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryContent?: ReactNode;
  showDemoBadge?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {showDemoBadge && <DemoBadge />}
        </div>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>}
        {secondaryContent}
      </div>
      {primaryAction}
    </div>
  );
}
