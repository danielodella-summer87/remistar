import { Users, ShieldCheck } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { DemoBadge } from "@/components/shared/DemoBadge";

const categoryMeta: Record<
  Vehicle["category"],
  { label: string; equipment: string; recommendedFor: string }
> = {
  sedan_ejecutivo: {
    label: "Sedán ejecutivo",
    equipment: "Aire acondicionado, WiFi a bordo, agua de cortesía",
    recommendedFor: "Viajes ejecutivos, reuniones y traslados individuales",
  },
  van: {
    label: "Van",
    equipment: "Aire acondicionado, espacio para equipaje amplio",
    recommendedFor: "Grupos reducidos y traslados corporativos",
  },
  suv: {
    label: "SUV",
    equipment: "Aire acondicionado, mayor confort y espacio",
    recommendedFor: "Ejecutivos, familias y viajes al interior",
  },
  minibus: {
    label: "Minibús",
    equipment: "Aire acondicionado, capacidad ampliada",
    recommendedFor: "Grupos, eventos y traslados corporativos numerosos",
  },
};

export function FleetCard({ vehicle }: { vehicle: Vehicle }) {
  const meta = categoryMeta[vehicle.category];
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-petrol-800 to-petrol-600 text-white">
        <p className="text-sm font-semibold tracking-wide">
          {vehicle.brand} {vehicle.model}
        </p>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">{meta.label}</p>
          <DemoBadge />
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="h-3.5 w-3.5" /> Hasta {vehicle.capacity} pasajeros
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5" /> {meta.equipment}
        </div>
        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Uso recomendado: </span>
          {meta.recommendedFor}
        </p>
      </div>
    </div>
  );
}
