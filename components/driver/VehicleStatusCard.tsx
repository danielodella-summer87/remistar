import { Car } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { vehicleStatusMeta, vehicleCategoryLabels } from "@/lib/status";

export function VehicleStatusCard({ vehicle, onClick }: { vehicle: Vehicle; onClick?: () => void }) {
  const meta = vehicleStatusMeta(vehicle.status);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm active:bg-slate-50"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-petrol-50 text-petrol-700">
        <Car className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">
          {vehicle.brand} {vehicle.model}
        </p>
        <p className="text-xs text-slate-500">
          {vehicle.plate} · {vehicleCategoryLabels[vehicle.category]}
        </p>
      </div>
      <StatusBadge label={meta.label} tone={meta.tone} />
    </button>
  );
}
