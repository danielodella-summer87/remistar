"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useDriverDemoState, DEMO_DRIVER_ID } from "@/lib/driver-store";
import { getDriverExpenses } from "@/lib/driver-selectors";
import { ExpenseCard } from "@/components/driver/ExpenseCard";

export default function ChoferGastosPage() {
  const state = useDriverDemoState();
  const expenses = getDriverExpenses(DEMO_DRIVER_ID, state);
  const pending = expenses.filter((e) => e.status === "pendiente_comprobante" || e.status === "pendiente_revision");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Mis gastos</h1>
          <p className="text-sm text-slate-500">
            {pending.length > 0 ? `${pending.length} en revisión` : "No tenés gastos pendientes"}
          </p>
        </div>
        <Link
          href="/chofer/gastos/nuevo"
          className="flex items-center gap-1.5 rounded-xl bg-opgreen-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-opgreen-700"
        >
          <Plus className="h-4 w-4" /> Registrar
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="text-sm font-medium text-slate-600">Todavía no registraste gastos.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </div>
      )}
    </div>
  );
}
