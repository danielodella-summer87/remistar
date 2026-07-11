import { StickyNote } from "lucide-react";
import type { DiscoveryExportData } from "@/lib/discovery/export";

export function DiscoveryNotes({ confirmed }: { confirmed: DiscoveryExportData["confirmed"] }) {
  const withNotes = confirmed.filter((item) => item.note && item.note.trim().length > 0);

  if (withNotes.length === 0) {
    return <p className="text-sm text-slate-400">Todavía no hay notas de Daniel cargadas.</p>;
  }

  return (
    <ul className="space-y-2">
      {withNotes.map((item) => (
        <li key={`${item.section}-${item.question}`} className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-inset ring-amber-100">
          <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            <span className="font-semibold">
              [{item.section}] {item.question}:
            </span>{" "}
            {item.note}
          </span>
        </li>
      ))}
    </ul>
  );
}
