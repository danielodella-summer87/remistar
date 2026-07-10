import type { DriverServiceStatus } from "@/lib/types";
import { DRIVER_SERVICE_STATUS_ORDER, driverServiceStatusMeta } from "@/lib/driver-status";

export function ServiceProgress({ status }: { status: DriverServiceStatus }) {
  if (status === "rechazado") {
    return (
      <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
        Servicio rechazado
      </div>
    );
  }

  const currentIndex = DRIVER_SERVICE_STATUS_ORDER.indexOf(status);
  const meta = driverServiceStatusMeta(status);

  return (
    <div>
      <div className="flex gap-1">
        {DRIVER_SERVICE_STATUS_ORDER.map((step, idx) => (
          <span
            key={step}
            className={`h-1.5 flex-1 rounded-full ${
              idx <= currentIndex ? "bg-petrol-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-700">
        Paso {currentIndex + 1} de {DRIVER_SERVICE_STATUS_ORDER.length}:{" "}
        <span className="text-petrol-700">{meta.label}</span>
      </p>
    </div>
  );
}
