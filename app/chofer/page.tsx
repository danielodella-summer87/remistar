"use client";

import Link from "next/link";
import { Receipt, Banknote, ChevronRight, Route } from "lucide-react";
import { drivers } from "@/lib/mock";
import { formatCurrency, formatDate } from "@/lib/format";
import { useDriverDemoState, DEMO_DRIVER_ID } from "@/lib/driver-store";
import { getCurrentOrNextService, getNextServiceAfter, getDriverAlerts } from "@/lib/driver-selectors";
import { CurrentServiceCard } from "@/components/driver/CurrentServiceCard";
import { DriverAlertCard } from "@/components/driver/DriverAlertCard";
import { MobileSection } from "@/components/driver/MobileSection";

export default function ChoferDashboardPage() {
  const state = useDriverDemoState();
  const driver = drivers.find((d) => d.id === DEMO_DRIVER_ID);
  const current = getCurrentOrNextService(DEMO_DRIVER_ID, state);
  const next = current ? getNextServiceAfter(DEMO_DRIVER_ID, current.id, state) : undefined;
  const alerts = getDriverAlerts(DEMO_DRIVER_ID, state);

  return (
    <div className="space-y-4">
      {alerts.length > 0 && (
        <MobileSection title="Alertas para vos">
          <div className="space-y-2">
            {alerts.map((alert) => (
              <DriverAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </MobileSection>
      )}

      <div>
        <h1 className="mb-2 text-sm font-semibold text-slate-900">
          {current ? "Tu servicio" : "Sin servicios asignados"}
        </h1>
        {current ? (
          <CurrentServiceCard service={current} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-sm font-medium text-slate-600">No tenés servicios asignados por ahora.</p>
            <p className="mt-1 text-xs text-slate-400">
              Cuando operaciones te asigne un traslado, aparecerá acá.
            </p>
          </div>
        )}
      </div>

      {next && (
        <Link
          href={`/chofer/servicios/${next.id}`}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm active:bg-slate-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700">
            <Route className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400">Después de este, sigue</p>
            <p className="truncate text-sm font-medium text-slate-800">
              {formatDate(next.date)} {next.time} · {next.origin} → {next.destination}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/chofer/gastos"
          className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm active:bg-slate-50"
        >
          <Receipt className="h-4 w-4 text-petrol-700" />
          <p className="mt-2 text-lg font-bold text-slate-900">{driver?.pendingExpensesCount ?? 0}</p>
          <p className="text-xs text-slate-500">Gastos pendientes</p>
        </Link>
        <Link
          href="/chofer/liquidaciones"
          className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm active:bg-slate-50"
        >
          <Banknote className="h-4 w-4 text-petrol-700" />
          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatCurrency(driver?.pendingSettlementAmount ?? 0)}
          </p>
          <p className="text-xs text-slate-500">Pendiente de liquidar</p>
        </Link>
      </div>
    </div>
  );
}
