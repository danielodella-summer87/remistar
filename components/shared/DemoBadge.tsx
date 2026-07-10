import { Sparkles } from "lucide-react";

export function DemoBadge({ label = "Demo" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
      <Sparkles className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}
