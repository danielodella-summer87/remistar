import type { LucideIcon } from "lucide-react";
import type { Tone } from "@/lib/status";

const iconToneClasses: Record<Tone, string> = {
  success: "bg-opgreen-50 text-opgreen-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-sky-50 text-sky-600",
  neutral: "bg-slate-100 text-slate-500",
  brand: "bg-petrol-50 text-petrol-600",
};

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
        {hint && <p className="mt-1 truncate text-xs text-slate-500">{hint}</p>}
      </div>
      {Icon && (
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconToneClasses[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      )}
    </div>
  );
}
