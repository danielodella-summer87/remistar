"use client";

import { Check, RefreshCw, CloudOff } from "lucide-react";
import type { DiscoverySyncStatus } from "@/lib/discovery/store";

/** Indicador discreto del estado de sincronización con Supabase. No es un CTA, solo informa. */
export function DiscoverySyncBadge({ status }: { status: DiscoverySyncStatus }) {
  if (status === "idle") return null;

  if (status === "syncing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Guardando…
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
        <CloudOff className="h-3 w-3" />
        Pendiente de sincronizar
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
      <Check className="h-3 w-3" />
      Guardado
    </span>
  );
}
