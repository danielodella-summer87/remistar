import { Receipt, Camera } from "lucide-react";
import type { ExpenseReport } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { expenseStatusMeta, expenseCategoryLabels } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/format";
import { services, vehicles } from "@/lib/mock";

export function ExpenseCard({ expense, onClick }: { expense: ExpenseReport; onClick?: () => void }) {
  const meta = expenseStatusMeta(expense.status);
  const service = services.find((s) => s.id === expense.serviceId);
  const vehicle = vehicles.find((v) => v.id === expense.vehicleId);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm active:bg-slate-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700">
        <Receipt className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{expenseCategoryLabels[expense.category]}</p>
          <p className="text-sm font-semibold text-slate-900">{formatCurrency(expense.amount)}</p>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          {formatDate(expense.date)}
          {service ? ` · ${service.code}` : ""}
          {vehicle ? ` · ${vehicle.plate}` : ""}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <StatusBadge label={meta.label} tone={meta.tone} />
          {!expense.hasReceipt && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700">
              <Camera className="h-3 w-3" /> Sin comprobante
            </span>
          )}
        </div>
        {expense.notes && <p className="mt-1.5 text-xs text-slate-500">{expense.notes}</p>}
      </div>
    </button>
  );
}
