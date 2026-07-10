"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useDriverDemoState, driverActions } from "@/lib/driver-store";
import { DRIVER_AVAILABILITY_OPTIONS, driverAvailabilityMeta } from "@/lib/driver-status";
import { ConfirmationSheet } from "./ConfirmationSheet";

const dotClasses: Record<string, string> = {
  success: "bg-opgreen-500",
  brand: "bg-petrol-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function DriverStatusSelector() {
  const state = useDriverDemoState();
  const [open, setOpen] = useState(false);
  const meta = driverAvailabilityMeta(state.availability);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
      >
        <span className={`h-2 w-2 rounded-full ${dotClasses[meta.tone]}`} />
        {meta.label}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>

      <ConfirmationSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Cambiar disponibilidad"
        description="Este cambio es demo y se guarda solo en este dispositivo."
      >
        <div className="space-y-2">
          {DRIVER_AVAILABILITY_OPTIONS.map((option) => {
            const optionMeta = driverAvailabilityMeta(option);
            const active = option === state.availability;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  driverActions.setAvailability(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                  active
                    ? "border-petrol-600 bg-petrol-50 text-petrol-800"
                    : "border-slate-200 text-slate-700 active:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${dotClasses[optionMeta.tone]}`} />
                  {optionMeta.label}
                </span>
                {active && <Check className="h-4 w-4 text-petrol-700" />}
              </button>
            );
          })}
        </div>
      </ConfirmationSheet>
    </>
  );
}
