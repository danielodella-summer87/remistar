import { Banknote } from "lucide-react";
import type { DriverSettlement } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { settlementStatusMeta } from "@/lib/status";
import { formatCurrency } from "@/lib/format";

export function SettlementCard({ settlement, onClick }: { settlement: DriverSettlement; onClick?: () => void }) {
  const meta = settlementStatusMeta(settlement.status);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm active:bg-slate-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-opgreen-50 text-opgreen-700">
        <Banknote className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">{settlement.periodLabel}</p>
          <p className="text-sm font-semibold text-slate-900">{formatCurrency(settlement.finalBalance)}</p>
        </div>
        <div className="mt-2">
          <StatusBadge label={meta.label} tone={meta.tone} />
        </div>
      </div>
    </button>
  );
}
