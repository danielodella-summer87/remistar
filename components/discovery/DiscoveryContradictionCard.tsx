import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import type { DiscoveryContradiction } from "@/lib/discovery/types";
import { questionHref } from "@/lib/discovery/links";

export function DiscoveryContradictionCard({ contradiction }: { contradiction: DiscoveryContradiction }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-700">
        <AlertTriangle className="h-3.5 w-3.5" /> Requiere revisión
      </div>
      <h3 className="text-sm font-semibold text-red-900">{contradiction.title}</h3>
      <p className="mt-1 text-xs text-red-800">{contradiction.description}</p>
      <div className="mt-3 flex flex-wrap gap-3 border-t border-red-100 pt-3">
        {contradiction.questionIds.map((qid) => {
          const href = questionHref(qid);
          if (!href) return null;
          return (
            <Link key={qid} href={href} className="inline-flex items-center gap-1 text-[11px] font-medium text-red-800 hover:underline">
              <Pencil className="h-3 w-3" />
              Revisar esta respuesta
            </Link>
          );
        })}
      </div>
    </div>
  );
}
