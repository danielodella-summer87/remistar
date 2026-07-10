import Link from "next/link";
import { Menu, BellRing } from "lucide-react";
import { alerts } from "@/lib/mock";

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const openAlerts = alerts.filter((a) => a.status === "abierta").length;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Abrir menú"
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-slate-900">Hola, Gonzalo</p>
          <p className="text-xs text-slate-500">Este es el estado de la operación hoy</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/app/alertas"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label={`Alertas abiertas: ${openAlerts}`}
        >
          <BellRing className="h-5 w-5" />
          {openAlerts > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {openAlerts}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-petrol-700 text-xs font-semibold text-white">
            GL
          </span>
          <span className="hidden text-xs font-medium text-slate-700 sm:inline">Gonzalo Larroque</span>
        </div>
      </div>
    </header>
  );
}
