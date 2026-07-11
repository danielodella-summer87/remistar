import { AlertTriangle } from "lucide-react";
import type { DiscoveryContradiction } from "@/lib/discovery/types";

export function DiscoveryContradictionCard({ contradiction }: { contradiction: DiscoveryContradiction }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-700">
        <AlertTriangle className="h-3.5 w-3.5" /> Requiere revisión
      </div>
      <h3 className="text-sm font-semibold text-red-900">{contradiction.title}</h3>
      <p className="mt-1 text-xs text-red-800">{contradiction.description}</p>
    </div>
  );
}
