import { AlertTriangle } from "lucide-react";
import type { DriverAlertItem } from "@/lib/driver-selectors";

const toneClasses: Record<DriverAlertItem["tone"], string> = {
  success: "bg-opgreen-50 text-opgreen-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-sky-50 text-sky-600",
  neutral: "bg-slate-100 text-slate-500",
  brand: "bg-petrol-50 text-petrol-600",
};

export function DriverAlertCard({ alert }: { alert: DriverAlertItem }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneClasses[alert.tone]}`}>
        <AlertTriangle className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{alert.title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{alert.description}</p>
      </div>
    </div>
  );
}
