import { drivers } from "@/lib/mock";
import { DEMO_DRIVER_ID } from "@/lib/driver-store";
import { DriverStatusSelector } from "./DriverStatusSelector";

export function DriverHeader() {
  const driver = drivers.find((d) => d.id === DEMO_DRIVER_ID);

  return (
    <header className="sticky top-0 z-30 bg-petrol-900 pt-[env(safe-area-inset-top)] shadow-sm">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="leading-tight">
          <p className="text-base font-bold text-white">
            Remistar<span className="text-opgreen-400">.</span>
          </p>
          <p className="text-xs text-petrol-300">Portal del chofer</p>
        </div>
        <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-[11px] font-medium text-amber-300">
          Demo
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{driver?.name ?? "Chofer"}</p>
        </div>
        <DriverStatusSelector />
      </div>
    </header>
  );
}
